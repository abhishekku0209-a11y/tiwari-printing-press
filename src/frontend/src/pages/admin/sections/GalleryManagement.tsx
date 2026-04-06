import { ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { designStore, serviceStore } from "../../../store/adminStore";
import type { DesignItem, ServiceItem } from "../../../store/adminStore";

type DisplayItem = DesignItem & { serviceName: string };

export default function GalleryManagement() {
  const [items, setItems] = useState<DisplayItem[]>([]);

  useEffect(() => {
    const services: ServiceItem[] = serviceStore.get();
    const serviceMap: Record<string, string> = {};
    for (const s of services) serviceMap[s.id] = s.name;

    const all = designStore.get().map((d) => ({
      ...d,
      serviceName: serviceMap[d.serviceId] ?? "Unknown",
    }));
    setItems(all);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-navy mb-2">Gallery</h2>
      <p className="text-muted-foreground text-sm mb-6">
        These images are sourced from <strong>Our Designs</strong>. To add or
        remove images, go to the <strong>Designs</strong> tab.
      </p>

      {items.length === 0 ? (
        <div
          className="text-center py-16 border-2 border-dashed border-border rounded-2xl text-muted-foreground"
          data-ocid="gallery.empty_state"
        >
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No images yet</p>
          <p className="text-sm mt-1">
            Upload design images in the <strong>Designs</strong> tab — they will
            appear here and in the public gallery.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((img, i) => (
            <div
              key={img.id}
              data-ocid={`gallery.item.${i + 1}`}
              className="group relative bg-secondary rounded-xl overflow-hidden border border-border"
            >
              <img
                src={img.dataUrl}
                alt={`${img.serviceName} design`}
                className="w-full aspect-square object-contain bg-secondary/30"
              />
              <div className="p-2">
                <p className="text-xs font-semibold text-navy truncate">
                  {img.serviceName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
