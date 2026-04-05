import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
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

  public shared ({ caller }) func _caffeineStorageUpdateGatewayPrincipals() : async () {
    await Storage.updateGatewayPrincipals(_caffeineStorageState);
  };

  public query ({ caller }) func _caffeineStorageBlobIsLive(hash : Blob) : async Bool {
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

  public query ({ caller }) func _caffeineStorageCreateCertificate(blobHash : Text) : async _CaffeineStorageCreateCertificateResult {
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
  // New entries in videoStore2 use this type.
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

  type AdminData = {
    id : Text;
    password : Text;
  };

  let admin = { id = "1234tiwari"; password = "123456" };

  // videoStore: legacy stable store (VideoV1, no videoUrl).
  // Never written to again; only read during migration.
  stable let videoStore = Map.empty<Text, VideoV1>();

  // videoStore2: new stable store (Video with videoUrl).
  stable let videoStore2 = Map.empty<Text, Video>();

  stable let testimonialStore = Map.empty<Text, Testimonial>();

  // Hero image blob hash — set by admin, read by all visitors
  stable var heroImageBlobHash : Text = "";

  // On first boot after upgrade, migrate old VideoV1 entries into videoStore2.
  // Uses a stable flag to ensure migration runs exactly once.
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

  func compareVideosByCreatedAt(v1 : Video, v2 : Video) : Order.Order {
    Int.compare(v2.createdAt, v1.createdAt);
  };

  func isAdmin(adminData : AdminData) : Bool {
    adminData.id == admin.id and adminData.password == admin.password;
  };

  // ── Hero Image ──────────────────────────────────────────────────────────────

  public query func getHeroImageHash() : async Text {
    heroImageBlobHash;
  };

  public shared ({ caller }) func setHeroImageHash(adminData : AdminData, blobHash : Text) : async () {
    if (not isAdmin(adminData)) {
      Runtime.trap("Invalid admin credentials");
    };
    heroImageBlobHash := blobHash;
  };

  // ── Videos ─────────────────────────────────────────────────────────────────

  // Add a video uploaded from device (blob storage)
  public shared ({ caller }) func addVideo(adminData : AdminData, title : Text, description : Text, blobHash : Text) : async Text {
    if (not isAdmin(adminData)) {
      Runtime.trap("Invalid admin credentials");
    };
    let videoId = blobHash.concat(title.concat(description));
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

  // Add a video by pasting a URL (YouTube or direct video link)
  public shared ({ caller }) func addVideoByUrl(adminData : AdminData, title : Text, description : Text, videoUrl : Text) : async Text {
    if (not isAdmin(adminData)) {
      Runtime.trap("Invalid admin credentials");
    };
    let videoId = videoUrl.concat(title);
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

  public query ({ caller }) func getVideos() : async [Video] {
    videoStore2.values().toArray().sort(compareVideosByCreatedAt);
  };

  public shared ({ caller }) func deleteVideo(adminData : AdminData, id : Text) : async () {
    if (not isAdmin(adminData)) {
      Runtime.trap("Invalid admin credentials");
    };
    if (not videoStore2.containsKey(id)) {
      Runtime.trap("Video not found");
    };
    videoStore2.remove(id);
  };

  // ── Testimonials ────────────────────────────────────────────────────────────

  public shared ({ caller }) func addTestimonial(adminData : AdminData, author : Text, role : Text, content : Text, rating : Nat) : async Text {
    if (not isAdmin(adminData)) {
      Runtime.trap("Invalid admin credentials");
    };
    let testimonialId = author.concat(content);
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

  public query ({ caller }) func getTestimonials() : async [Testimonial] {
    testimonialStore.values().toArray();
  };

  public shared ({ caller }) func deleteTestimonial(adminData : AdminData, id : Text) : async () {
    if (not isAdmin(adminData)) {
      Runtime.trap("Invalid admin credentials");
    };
    if (not testimonialStore.containsKey(id)) {
      Runtime.trap("Testimonial not found");
    };
    testimonialStore.remove(id);
  };
};
