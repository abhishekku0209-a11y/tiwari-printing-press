import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ZoomIn } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { GalleryImage } from "../backend";
import { createActorWithConfig, loadConfig } from "../config";
import { useInView } from "../hooks/useInView";
import { StorageClient } from "../utils/StorageClient";

const SAMPLE_IMAGES = [
  {
    id: "sample-1",
    title: "Business Cards",
    src: "/assets/generated/gallery-business-cards.dim_400x300.jpg",
    category: "Cards",
  },
  {
    id: "sample-2",
    title: "Vinyl Banners",
    src: "/assets/generated/gallery-vinyl-banners.dim_400x500.jpg",
    category: "Vinyl",
  },
  {
    id: "sample-3",
    title: "Custom Stickers",
    src: "/assets/generated/gallery-stickers.dim_400x400.jpg",
    category: "Stickers",
  },
  {
    id: "sample-4",
    title: "Brochures",
    src: "/assets/generated/gallery-brochures.dim_400x280.jpg",
    category: "Print",
  },
  {
    id: "sample-5",
    title: "Pamphlets & Flyers",
    src: "/assets/generated/gallery-pamphlets.dim_400x350.jpg",
    category: "Print",
  },
  {
    id: "sample-6",
    title: "Event Banners",
    src: "/assets/generated/gallery-banners.dim_400x450.jpg",
    category: "Banners",
  },
];

type DisplayImage = {
  id: string;
  title: string;
  src: string;
  category: string;
};

async function buildGalleryUrl(blobHash: string): Promise<string> {
  const config = await loadConfig();
  const gatewayUrl =
    !config.storage_gateway_url || config.storage_gateway_url === "nogateway"
      ? "https://blob.caffeine.ai"
      : config.storage_gateway_url;
  const { HttpAgent } = await import("@icp-sdk/core/agent");
  const agent = new HttpAgent({ host: config.backend_host });
  const storageClient = new StorageClient(
    config.bucket_name,
    gatewayUrl,
    config.backend_canister_id,
    config.project_id,
    agent,
  );
  return storageClient.getDirectURL(blobHash);
}

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef);
  const [selected, setSelected] = useState<DisplayImage | null>(null);
  const [displayImages, setDisplayImages] =
    useState<DisplayImage[]>(SAMPLE_IMAGES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchGallery() {
      try {
        const backend = await createActorWithConfig();
        const images: GalleryImage[] = await backend.getGalleryImages();
        if (cancelled) return;
        if (images.length > 0) {
          // Build blob URLs for all images
          const resolved: DisplayImage[] = await Promise.all(
            images.map(async (img) => {
              try {
                const src = await buildGalleryUrl(img.blobHash);
                return {
                  id: img.id,
                  title: img.title,
                  src,
                  category: "Gallery",
                };
              } catch {
                return null;
              }
            }),
          ).then((arr) => arr.filter(Boolean) as DisplayImage[]);
          if (!cancelled && resolved.length > 0) {
            setDisplayImages(resolved);
          }
        }
        // If backend returns empty, keep showing sample images
      } catch (err) {
        console.error("Failed to load gallery:", err);
        // Keep showing sample images on error
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchGallery();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div ref={ref} className="py-20 lg:py-28 bg-[#F7F8FB]">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-2">
            Our Portfolio
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-navy uppercase tracking-wide">
            Our Portfolio Gallery
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 bg-gold rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm">
            Browse through our collection of high-quality prints and designs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="masonry-grid"
          data-ocid="gallery.list"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={`skeleton-${i + 1}`} className="masonry-item">
                  <Skeleton className="w-full h-48 rounded-2xl" />
                </div>
              ))
            : displayImages.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="masonry-item group relative overflow-hidden rounded-2xl cursor-pointer shadow-card hover:shadow-card-hover transition-all duration-300"
                  data-ocid={`gallery.item.${i + 1}`}
                  onClick={() => setSelected(img)}
                >
                  <div className="bg-white p-1 rounded-2xl">
                    <img
                      src={img.src}
                      alt={img.title}
                      className="w-full h-auto object-contain rounded-xl"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/60 transition-all duration-300 rounded-2xl flex items-end">
                    <div className="w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-xs font-semibold text-gold uppercase tracking-widest">
                        {img.category}
                      </span>
                      <p className="text-white font-bold text-sm">
                        {img.title}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <ZoomIn className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
        </motion.div>

        {/* Testimonials heading teaser below gallery images */}
        <div ref={headingRef} className="mt-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-2">
              Reviews
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-navy uppercase tracking-wide">
              What Our Clients Say
            </h2>
            <div className="mt-4 mx-auto w-16 h-1 bg-gold rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent
          className="max-w-3xl p-2 bg-navy border-navy"
          data-ocid="gallery.modal"
        >
          {selected && (
            <div className="rounded-xl overflow-hidden">
              <img
                src={selected.src}
                alt={selected.title}
                className="w-full h-auto object-contain"
              />
              <div className="p-4 text-center">
                <span className="text-gold text-xs font-semibold uppercase tracking-widest">
                  {selected.category}
                </span>
                <p className="text-white font-bold">{selected.title}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
