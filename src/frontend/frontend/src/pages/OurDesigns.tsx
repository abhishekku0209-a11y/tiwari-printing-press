import { ArrowLeft, ImageOff, LayoutGrid } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import WhatsAppButton from "../components/WhatsAppButton";
import { useInView } from "../hooks/useInView";
import { designStore, serviceStore } from "../store/adminStore";
import type { DesignItem, ServiceItem } from "../store/adminStore";

function navigateTo(path: string) {
  window.location.href = path;
}

function ServiceDesignSection({
  service,
  designs,
}: {
  service: ServiceItem;
  designs: DesignItem[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.08);

  return (
    <motion.div
      ref={ref}
      id={`service-${service.id}`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="mb-16 scroll-mt-28"
    >
      {/* Section header */}
      <div className="flex items-center gap-4 mb-6">
        {service.imageDataUrl ? (
          <img
            src={service.imageDataUrl}
            alt={service.name}
            className="w-10 h-10 rounded-lg object-cover border border-border flex-shrink-0"
          />
        ) : (
          <span className="text-3xl flex-shrink-0">{service.icon}</span>
        )}
        <div>
          <h2 className="text-2xl font-extrabold text-navy">{service.name}</h2>
          <p className="text-muted-foreground text-sm">
            {designs.length} design{designs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex-1 h-px bg-border ml-2" />
      </div>

      {designs.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-2xl text-muted-foreground bg-secondary/30"
          data-ocid="designs.empty_state"
        >
          <ImageOff className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">No designs uploaded yet</p>
          <p className="text-xs mt-1 opacity-60">
            Admin can add designs from the dashboard
          </p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {designs.map((design, idx) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="break-inside-avoid rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 bg-white"
              data-ocid={`designs.item.${idx + 1}`}
            >
              <img
                src={design.dataUrl}
                alt={`${service.name} design ${idx + 1}`}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function OurDesigns() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [designsMap, setDesignsMap] = useState<Record<string, DesignItem[]>>(
    {},
  );
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, 0.1);

  useEffect(() => {
    const allServices = serviceStore.get();
    setServices(allServices);
    const map: Record<string, DesignItem[]> = {};
    for (const s of allServices) {
      map[s.id] = designStore.getByService(s.id);
    }
    setDesignsMap(map);
  }, []);

  // Scroll to section based on hash
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.replace("#", "");
    const attemptScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    const timer = setTimeout(attemptScroll, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background font-poppins">
      <Header />

      <main className="pt-20 lg:pt-24">
        {/* Page Hero */}
        <div
          ref={heroRef}
          className="bg-navy py-16 lg:py-20 relative overflow-hidden"
        >
          {/* Background decorative circles */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

          <div className="container mx-auto px-4 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <LayoutGrid className="w-8 h-8 text-gold" />
                <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-wide uppercase">
                  Our Designs
                </h1>
              </div>
              <div className="mx-auto w-24 h-1 bg-gold rounded-full mb-5" />
              <p className="text-white/60 text-base lg:text-lg max-w-xl mx-auto">
                Browse our print work by service — see the quality that
                thousands of satisfied customers trust.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Breadcrumb / back button */}
        <div className="container mx-auto px-4 lg:px-8 py-5">
          <button
            type="button"
            onClick={() => navigateTo("/")}
            data-ocid="designs.link"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy transition-colors font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>

        {/* Designs content */}
        <div className="container mx-auto px-4 lg:px-8 pb-20">
          {services.length === 0 ? (
            <div
              className="text-center py-20 text-muted-foreground"
              data-ocid="designs.empty_state"
            >
              <LayoutGrid className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-semibold text-lg">No services found</p>
            </div>
          ) : (
            services.map((service) => (
              <ServiceDesignSection
                key={service.id}
                service={service}
                designs={designsMap[service.id] ?? []}
              />
            ))
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
