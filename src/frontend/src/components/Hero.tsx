import { Button } from "@/components/ui/button";
import { HttpAgent } from "@icp-sdk/core/agent";
import { ArrowRight, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { createActorWithConfig } from "../config";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

const FALLBACK_HERO_IMAGE =
  "/assets/1775225126583-019d5774-878d-74f4-8dea-f1ee68ec8c8a.png";

const slides = [
  {
    headline: "BEST PRINTING",
    headline2: "PRESS IN DELHI",
    subtext:
      "Business cards, pamphlets, vinyl, banners & more — Tiwari Printing Press, Maujpur Shahdara, open 10AM-9PM daily.",
    highlight: "Trusted by 500+ Delhi Businesses",
  },
  {
    headline: "OFFSET & FLEX",
    headline2: "PRINTING EXPERTS",
    subtext:
      "High-quality offset, flex, vinyl & sticker printing in Shahdara, New Delhi. Fast turnaround, competitive prices.",
    highlight: "10,000+ Print Projects Completed",
  },
  {
    headline: "BUSINESS CARDS",
    headline2: "BANNERS & MORE",
    subtext:
      "Visiting cards, wedding cards, brochures, packaging & all printing needs — call +91 8800180074 for a free quote!",
    highlight: "Open 7 Days, 10AM\u20139PM",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [heroImageUrl, setHeroImageUrl] = useState<string>(FALLBACK_HERO_IMAGE);

  useEffect(() => {
    // Load hero image from backend blob storage
    let cancelled = false;
    async function fetchHeroImage() {
      // Check localStorage override first
      const localDataUrl = localStorage.getItem("tpp_hero_dataurl");
      if (localDataUrl) {
        setHeroImageUrl(localDataUrl);
        return; // don't fetch from backend
      }
      try {
        const actor = await createActorWithConfig();
        const hash = await actor.getHeroImageHash();
        if (cancelled || !hash || hash.trim() === "") return;
        // Build direct URL via StorageClient
        const config = await loadConfig();
        const gatewayUrl =
          !config.storage_gateway_url ||
          config.storage_gateway_url === "nogateway"
            ? "https://blob.caffeine.ai"
            : config.storage_gateway_url;
        const agent = new HttpAgent({ host: config.backend_host });
        const storageClient = new StorageClient(
          config.bucket_name,
          gatewayUrl,
          config.backend_canister_id,
          config.project_id,
          agent,
        );
        const url = await storageClient.getDirectURL(hash);
        if (!cancelled) {
          setHeroImageUrl(url);
        }
      } catch {
        // Fall back to the local asset quietly
      }
    }
    fetchHeroImage();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      4500,
    );
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const slide = slides[current];

  return (
    <div className="relative min-h-[92vh] flex items-center overflow-hidden pt-20">
      {/* Background: loaded from backend or fallback local asset */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${heroImageUrl}')`,
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <div className="space-y-6">
            <div className="relative min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  style={{ background: "transparent" }}
                  className="space-y-4"
                >
                  <span className="inline-flex items-center gap-2 bg-black text-gold border border-gold/40 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                    {slide.highlight}
                  </span>

                  <h1
                    className="text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight"
                    style={{
                      color: "#ffffff",
                      textShadow:
                        "0 2px 8px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.9)",
                    }}
                  >
                    {slide.headline}
                    <br />
                    <span className="text-gold">{slide.headline2}</span>
                  </h1>
                  <p
                    className="text-base lg:text-lg max-w-md leading-relaxed font-medium"
                    style={{
                      color: "#f0f0f0",
                      textShadow:
                        "0 1px 6px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)",
                    }}
                  >
                    {slide.subtext}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Buttons: always visible, outside the animated slide content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Button
                type="button"
                onClick={() => scrollTo("faq")}
                data-ocid="hero.quote.primary_button"
                className="bg-gold hover:bg-gold-dark text-navy font-semibold px-7 py-3 h-auto rounded-full text-sm shadow-lg hover:shadow-xl transition-all"
              >
                Get a Free Quote <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
              <Button
                type="button"
                onClick={() => scrollTo("gallery")}
                data-ocid="hero.works.secondary_button"
                className="bg-white text-navy border border-white hover:bg-gold hover:border-gold font-semibold px-7 py-3 h-auto rounded-full text-sm transition-all shadow-lg"
                style={{ color: "#0f172a" }}
              >
                View Our Work <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </motion.div>

            {/* Carousel dots */}
            <div className="flex gap-2 pt-2">
              {slides.map((_, i) => (
                <button
                  type="button"
                  key={`slide-dot-${i + 1}`}
                  onClick={() => setCurrent(i)}
                  data-ocid={`hero.slide.${i + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? "w-8 h-2.5 bg-gold"
                      : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right column – stat cards floating over the image */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:flex items-end justify-end h-96"
          >
            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-0 left-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-card px-5 py-3 border border-white/60"
            >
              <div className="text-2xl font-extrabold text-gold">20+</div>
              <div className="text-xs text-navy font-medium">
                Years Experience
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="absolute top-0 left-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-card px-5 py-3 border border-white/60"
            >
              <div className="text-2xl font-extrabold text-gold">10K+</div>
              <div className="text-xs text-navy font-medium">Projects Done</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute top-1/2 right-0 -translate-y-1/2 bg-gold/90 backdrop-blur-sm rounded-2xl shadow-card px-5 py-3 border border-gold/60"
            >
              <div className="text-2xl font-extrabold text-navy">500+</div>
              <div className="text-xs text-navy/80 font-medium">
                Happy Clients
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
