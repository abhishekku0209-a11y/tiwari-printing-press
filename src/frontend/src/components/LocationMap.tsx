import { MapPin, Navigation } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { useInView } from "../hooks/useInView";

const ADDRESS =
  "Tiwari Printing Press, Opposite Primary School, B 33/5, Gali No. 2, Sabzi Mandi Rd, Maujpur, Shahdara, New Delhi, Delhi 110053";
const MAPS_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;
const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&t=m&z=17&output=embed&iwloc=near`;

export default function LocationMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <section ref={ref} id="location" className="py-20 lg:py-28 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-2">
            Find Us
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-navy uppercase tracking-wide">
            Our Location
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 bg-gold rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Address card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-card flex flex-col gap-6 h-full"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="font-bold text-navy text-base mb-1">Address</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  B 33/5, Gali No. 2, Sabzi Mandi Rd
                  <br />
                  Opposite Primary School
                  <br />
                  Maujpur, Shahdara
                  <br />
                  New Delhi, Delhi 110053
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">
                Nearby Landmarks
              </p>
              <ul className="space-y-1.5 text-sm text-navy">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                  Opposite Primary School
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                  Sabzi Mandi Road
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                  Maujpur, Shahdara
                </li>
              </ul>
            </div>

            <a
              href={MAPS_SEARCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white font-semibold text-sm rounded-full px-6 py-3 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Get Directions
            </a>
          </motion.div>

          {/* Google Map embed */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 rounded-3xl overflow-hidden shadow-card-hover border border-border"
            style={{ minHeight: 380 }}
          >
            <iframe
              title="Tiwari Printing Press Location"
              src={MAPS_EMBED_URL}
              width="100%"
              height="420"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
