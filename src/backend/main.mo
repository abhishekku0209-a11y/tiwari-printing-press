import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Prim "mo:prim";
import Storage "blob-storage/Storage";


actor {
  // ── Blob-storage mixin ──────────────────────────────────────────────────────

  transient let _caffeineStorageState : Storage.State = Storage.new();

  type _CaffeineStorageRefillInformation = {
    proposed_top_up_amount : ?Nat;
  };

  type _CaffeineStorageRefillResult = {
    success : ?Bool;
    topped_up_amount : ?Nat;
  };

  type _CaffeineStorageCreateCertificateResult = {
    method : Text;
    blob_hash : Text;
  };

  public shared ({ caller }) func _caffeineStorageRefillCashier(refillInformation : ?_CaffeineStorageRefillInformation) : async _CaffeineStorageRefillResult {
    let cashier = await Storage.getCashierPrincipal();
    if (cashier != caller) {
      Runtime.trap("Unauthorized access");
    };
    await Storage.refillCashier(_caffeineStorageState, cashier, refillInformation);
  };

  public shared func _caffeineStorageUpdateGatewayPrincipals() : async () {
    await Storage.updateGatewayPrincipals(_caffeineStorageState);
  };

  public query func _caffeineStorageBlobIsLive(hash : Blob) : async Bool {
    Prim.isStorageBlobLive(hash);
  };

  public query ({ caller }) func _caffeineStorageBlobsToDelete() : async [Blob] {
    if (not Storage.isAuthorized(_caffeineStorageState, caller)) {
      Runtime.trap("Unauthorized access");
    };
    let deadBlobs = Prim.getDeadBlobs();
    switch (deadBlobs) {
      case (null) { [] };
      case (?deadBlobs) { deadBlobs.sliceToArray(0, 10000) };
    };
  };

  public shared ({ caller }) func _caffeineStorageConfirmBlobDeletion(blobs : [Blob]) : async () {
    if (not Storage.isAuthorized(_caffeineStorageState, caller)) {
      Runtime.trap("Unauthorized access");
    };
    Prim.pruneConfirmedDeadBlobs(blobs);
    type GC = actor {
      __motoko_gc_trigger : () -> async ();
    };
    let myGC = actor (debug_show (Prim.getSelfPrincipal<system>())) : GC;
    await myGC.__motoko_gc_trigger();
  };

  public query func _caffeineStorageCreateCertificate(blobHash : Text) : async _CaffeineStorageCreateCertificateResult {
    {
      method = "upload";
      blob_hash = blobHash;
    };
  };

  // ── App data types ──────────────────────────────────────────────────────────

  // VideoV1: the original stable type (no videoUrl field).
  // Kept as-is so the stable variable layout is backward-compatible.
  type VideoV1 = {
    id : Text;
    title : Text;
    description : Text;
    blobHash : Text;
    createdAt : Int;
  };

  // Video: the current application type that adds videoUrl.
  type Video = {
    id : Text;
    title : Text;
    description : Text;
    blobHash : Text;
    videoUrl : Text;
    createdAt : Int;
  };

  type Testimonial = {
    id : Text;
    author : Text;
    role : Text;
    content : Text;
    rating : Nat;
    createdAt : Int;
  };

  type GalleryImage = {
    id : Text;
    title : Text;
    blobHash : Text;
    createdAt : Int;
  };

  type AdminData = {
    id : Text;
    password : Text;
  };

  let admin = { id = "1234tiwari"; password = "123456" };

  // ── Stable stores ────────────────────────────────────────────────────────────

  // Maps are implicitly stable; no `stable` keyword needed on let-bound Maps.
  let videoStore = Map.empty<Text, VideoV1>();
  let videoStore2 = Map.empty<Text, Video>();
  let testimonialStore = Map.empty<Text, Testimonial>();
  let galleryStore = Map.empty<Text, GalleryImage>();

  // Hero image blob hash — set by admin, read by all visitors
  stable var heroImageBlobHash : Text = "";

  // Migration flag for video V1 -> V2
  stable var videoMigrationDone : Bool = false;

  if (not videoMigrationDone) {
    for (v in videoStore.values()) {
      let migrated : Video = {
        id = v.id;
        title = v.title;
        description = v.description;
        blobHash = v.blobHash;
        videoUrl = "";
        createdAt = v.createdAt;
      };
      videoStore2.add(v.id, migrated);
    };
    videoMigrationDone := true;
  };

  func compareByCreatedAtDesc(a : Int, b : Int) : Order.Order {
    Int.compare(b, a);
  };

  func isAdmin(adminData : AdminData) : Bool {
    adminData.id == admin.id and adminData.password == admin.password;
  };

  // ── Hero Image ──────────────────────────────────────────────────────────────

  public query func getHeroImageHash() : async Text {
    heroImageBlobHash;
  };

  public shared func setHeroImageHash(adminData : AdminData, blobHash : Text) : async () {
    if (not isAdmin(adminData)) {
      Runtime.trap("Invalid admin credentials");
    };
    heroImageBlobHash := blobHash;
  };

  // ── Gallery ─────────────────────────────────────────────────────────────────

  public shared func addGalleryImage(adminData : AdminData, title : Text, blobHash : Text) : async Text {
    if (not isAdmin(adminData)) {
      Runtime.trap("Invalid admin credentials");
    };
    let imageId = blobHash # title;
    let newImage : GalleryImage = {
      id = imageId;
      title;
      blobHash;
      createdAt = Time.now();
    };
    galleryStore.add(imageId, newImage);
    imageId;
  };

  public query func getGalleryImages() : async [GalleryImage] {
    let arr = galleryStore.values().toArray();
    arr.sort(func(a : GalleryImage, b : GalleryImage) : Order.Order {
      compareByCreatedAtDesc(a.createdAt, b.createdAt);
    });
  };

  public shared func deleteGalleryImage(adminData : AdminData, id : Text) : async () {
    if (not isAdmin(adminData)) {
      Runtime.trap("Invalid admin credentials");
    };
    if (not galleryStore.containsKey(id)) {
      Runtime.trap("Gallery image not found");
    };
    galleryStore.remove(id);
  };

  // ── Videos ─────────────────────────────────────────────────────────────────

  public shared func addVideo(adminData : AdminData, title : Text, description : Text, blobHash : Text) : async Text {
    if (not isAdmin(adminData)) {
      Runtime.trap("Invalid admin credentials");
    };
    let videoId = blobHash # title # description;
    let newVideo : Video = {
      id = videoId;
      title;
      description;
      blobHash;
      videoUrl = "";
      createdAt = Time.now();
    };
    videoStore2.add(videoId, newVideo);
    videoId;
  };

  public shared func addVideoByUrl(adminData : AdminData, title : Text, description : Text, videoUrl : Text) : async Text {
    if (not isAdmin(adminData)) {
      Runtime.trap("Invalid admin credentials");
    };
    let videoId = videoUrl # title;
    let newVideo : Video = {
      id = videoId;
      title;
      description;
      blobHash = "";
      videoUrl;
      createdAt = Time.now();
    };
    videoStore2.add(videoId, newVideo);
    videoId;
  };

  public query func getVideos() : async [Video] {
    let arr = videoStore2.values().toArray();
    arr.sort(func(a : Video, b : Video) : Order.Order {
      compareByCreatedAtDesc(a.createdAt, b.createdAt);
    });
  };

  public shared func deleteVideo(adminData : AdminData, id : Text) : async () {
    if (not isAdmin(adminData)) {
      Runtime.trap("Invalid admin credentials");
    };
    if (not videoStore2.containsKey(id)) {
      Runtime.trap("Video not found");
    };
    videoStore2.remove(id);
  };

  // ── Testimonials ────────────────────────────────────────────────────────────

  public shared func addTestimonial(adminData : AdminData, author : Text, role : Text, content : Text, rating : Nat) : async Text {
    if (not isAdmin(adminData)) {
      Runtime.trap("Invalid admin credentials");
    };
    let testimonialId = author # content;
    let newTestimonial : Testimonial = {
      id = testimonialId;
      author;
      role;
      content;
      rating;
      createdAt = Time.now();
    };
    testimonialStore.add(testimonialId, newTestimonial);
    testimonialId;
  };

  public query func getTestimonials() : async [Testimonial] {
    testimonialStore.values().toArray();
  };

  public shared func deleteTestimonial(adminData : AdminData, id : Text) : async () {
    if (not isAdmin(adminData)) {
      Runtime.trap("Invalid admin credentials");
    };
    if (not testimonialStore.containsKey(id)) {
      Runtime.trap("Testimonial not found");
    };
    testimonialStore.remove(id);
  };
};
