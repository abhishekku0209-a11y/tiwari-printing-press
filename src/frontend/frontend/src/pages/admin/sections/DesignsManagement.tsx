import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePlus, Layers, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  type DesignItem,
  type ServiceItem,
  designStore,
  serviceStore,
} from "../../../store/adminStore";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DesignsManagement() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadServices = useCallback(() => {
    setServices(serviceStore.get());
  }, []);

  const loadDesigns = useCallback((serviceId: string) => {
    if (!serviceId) {
      setDesigns([]);
      return;
    }
    setDesigns(designStore.getByService(serviceId));
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    loadDesigns(selectedServiceId);
  }, [selectedServiceId, loadDesigns]);

  const handleServiceChange = (value: string) => {
    setSelectedServiceId(value);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedServiceId) return;

    setUploading(true);
    let successCount = 0;

    for (const file of Array.from(files)) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        designStore.add({ serviceId: selectedServiceId, dataUrl });
        successCount++;
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (successCount > 0) {
      toast.success(
        `${successCount} design image${successCount > 1 ? "s" : ""} uploaded.`,
      );
    }

    loadDesigns(selectedServiceId);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = (id: string) => {
    designStore.delete(id);
    toast.success("Design removed.");
    loadDesigns(selectedServiceId);
  };

  const selectedService = services.find((s) => s.id === selectedServiceId);

  const getDesignCount = (serviceId: string) =>
    designStore.getByService(serviceId).length;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-navy mb-2">
        Designs Management
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        Upload and manage design images shown on the public "Our Designs" page,
        organized by service.
      </p>

      {/* Service selector */}
      <div className="mb-6">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
          Select Service
        </Label>
        <Select value={selectedServiceId} onValueChange={handleServiceChange}>
          <SelectTrigger className="w-full max-w-sm" data-ocid="designs.select">
            <SelectValue placeholder="Choose a service to manage designs" />
          </SelectTrigger>
          <SelectContent>
            {services.map((s) => {
              const count = getDesignCount(s.id);
              return (
                <SelectItem key={s.id} value={s.id}>
                  <span className="flex items-center gap-2">
                    <span>{s.icon}</span>
                    <span>{s.name}</span>
                    {count > 0 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        ({count})
                      </span>
                    )}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Empty state - no service selected */}
      {!selectedServiceId && (
        <div
          className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-secondary/20"
          data-ocid="designs.empty_state"
        >
          <Layers className="w-12 h-12 mb-3 opacity-20" />
          <p className="font-semibold">
            Select a service to manage its designs
          </p>
          <p className="text-xs mt-1 opacity-60">
            You can upload multiple images per service
          </p>
        </div>
      )}

      {/* Service selected - content area */}
      {selectedServiceId && selectedService && (
        <div>
          {/* Upload area */}
          <div className="bg-secondary/30 rounded-2xl border-2 border-dashed border-border p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-navy text-sm">
                  Upload Designs for{" "}
                  <span className="text-gold">{selectedService.name}</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Select one or multiple image files (JPG, PNG, WebP)
                </p>
              </div>
              <label className="cursor-pointer">
                <Button
                  asChild
                  disabled={uploading}
                  className="bg-navy hover:bg-navy-light text-white pointer-events-none"
                  data-ocid="designs.upload_button"
                >
                  <span>
                    <ImagePlus className="w-4 h-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload Images"}
                  </span>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Designs grid */}
          {designs.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground border border-border rounded-2xl"
              data-ocid="designs.empty_state"
            >
              <ImagePlus className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="font-semibold text-sm">
                No designs yet for {selectedService.name}
              </p>
              <p className="text-xs mt-1 opacity-60">
                Upload images above to get started
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {designs.length} design{designs.length !== 1 ? "s" : ""} —{" "}
                {selectedService.name}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {designs.map((design, i) => (
                  <div
                    key={design.id}
                    className="relative group rounded-xl overflow-hidden border border-border bg-white shadow-sm"
                    data-ocid={`designs.item.${i + 1}`}
                  >
                    <img
                      src={design.dataUrl}
                      alt={`Design ${i + 1}`}
                      className="w-full h-36 object-contain bg-secondary/20"
                    />
                    {/* Delete overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(design.id)}
                        data-ocid={`designs.delete_button.${i + 1}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg"
                        aria-label="Delete design"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
