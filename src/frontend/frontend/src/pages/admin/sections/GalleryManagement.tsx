import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { type GalleryRecord, galleryDb } from "../../../store/mediaDb";

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryRecord[]>([]);
  const [objectUrls, setObjectUrls] = useState<Record<string, string>>({});
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const records = await galleryDb.getAll();
    setImages(records);
    // Create object URLs for display
    const urls: Record<string, string> = {};
    for (const r of records) {
      urls[r.id] = URL.createObjectURL(r.blob);
    }
    setObjectUrls((prev) => {
      // Revoke old URLs to free memory
      for (const url of Object.values(prev)) {
        URL.revokeObjectURL(url);
      }
      return urls;
    });
  }, []);

  useEffect(() => {
    load();
    return () => {
      // Cleanup object URLs on unmount
      setObjectUrls((prev) => {
        for (const url of Object.values(prev)) {
          URL.revokeObjectURL(url);
        }
        return {};
      });
    };
  }, [load]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // No size limit — any image allowed
    setFile(f);
    const previewUrl = URL.createObjectURL(f);
    setPreview(previewUrl);
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast.error("Please select a file and enter a title.");
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      for (let p = 10; p <= 80; p += 20) {
        await new Promise((r) => setTimeout(r, 100));
        setProgress(p);
      }
      await galleryDb.add(title.trim(), file);
      setProgress(100);
      await new Promise((r) => setTimeout(r, 200));
      toast.success("Image uploaded successfully!");
      setTitle("");
      setFile(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save image. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (id: string) => {
    await galleryDb.delete(id);
    if (objectUrls[id]) URL.revokeObjectURL(objectUrls[id]);
    toast.success("Image deleted.");
    await load();
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-navy mb-6">
        Gallery Management
      </h2>

      {/* Upload form */}
      <div className="bg-secondary/50 rounded-2xl p-6 mb-8 border border-border">
        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4">
          Upload New Image
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Image Title
            </Label>
            <Input
              placeholder="e.g. Business Card Samples"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-ocid="gallery.input"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Image File (any size)
            </Label>
            <Input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              data-ocid="gallery.upload_button"
            />
          </div>
        </div>

        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="h-32 rounded-xl object-cover border border-border"
            />
          </div>
        )}

        {uploading && (
          <div className="mt-4" data-ocid="gallery.loading_state">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Uploading... {progress}%
            </p>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={uploading || !file || !title.trim()}
          data-ocid="gallery.primary_button"
          className="mt-4 bg-navy hover:bg-navy-light text-white font-bold"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </>
          )}
        </Button>
      </div>

      {/* Image grid */}
      {images.length === 0 ? (
        <div
          className="text-center py-16 border-2 border-dashed border-border rounded-2xl text-muted-foreground"
          data-ocid="gallery.empty_state"
        >
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No images yet</p>
          <p className="text-sm mt-1">
            Upload images to display in the gallery.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div
              key={img.id}
              data-ocid={`gallery.item.${i + 1}`}
              className="group relative bg-secondary rounded-xl overflow-hidden border border-border"
            >
              <img
                src={objectUrls[img.id] ?? ""}
                alt={img.title}
                className="w-full aspect-square object-cover"
              />
              <div className="p-2">
                <p className="text-xs font-semibold text-navy truncate">
                  {img.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(img.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(img.id)}
                data-ocid={`gallery.delete_button.${i + 1}`}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
