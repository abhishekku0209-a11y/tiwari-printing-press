import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "../backend";
import { createActorWithConfig } from "../config";
import { useInView } from "../hooks/useInView";

// 10 hardcoded high-quality testimonials -- always visible even without backend
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "default-1",
    author: "Rajesh Sharma",
    role: "Business Owner, Karol Bagh",
    content:
      "Outstanding print quality! My business cards turned out even better than expected. Fast delivery and pricing that beats every shop in Shahdara.",
    rating: BigInt(5),
    createdAt: BigInt(0),
  },
  {
    id: "default-2",
    author: "Priya Patel",
    role: "Marketing Manager",
    content:
      "Used Tiwari Printing Press for our company event banners. The colors were vibrant, the team was professional, and delivery was on time. Highly recommend!",
    rating: BigInt(5),
    createdAt: BigInt(0),
  },
  {
    id: "default-3",
    author: "Amit Kumar",
    role: "Restaurant Owner, Maujpur",
    content:
      "Ordered 5000 menu flyers and they were delivered in 2 days! Top-notch quality, accurate colors, and the pricing was unbeatable.",
    rating: BigInt(5),
    createdAt: BigInt(0),
  },
  {
    id: "default-4",
    author: "Sunita Verma",
    role: "Wedding Planner",
    content:
      "Got our wedding invitation cards printed here. Every card was flawless with beautiful gold foiling. The Tiwari team made our special day even more special.",
    rating: BigInt(5),
    createdAt: BigInt(0),
  },
  {
    id: "default-5",
    author: "Deepak Gupta",
    role: "Shop Owner, Dilshad Garden",
    content:
      "Best flex printing in Shahdara, no doubt. My shop board looks amazing. They matched the colors exactly to my design file. Will order again!",
    rating: BigInt(5),
    createdAt: BigInt(0),
  },
  {
    id: "default-6",
    author: "Neha Singh",
    role: "Event Coordinator",
    content:
      "Printed 200 brochures for our corporate event. Professional finish, perfect binding, zero errors. The staff was helpful and the turnaround was super quick.",
    rating: BigInt(5),
    createdAt: BigInt(0),
  },
  {
    id: "default-7",
    author: "Mohit Agarwal",
    role: "Startup Founder",
    content:
      "Tiwari Printing Press helped us print our entire product launch kit -- visiting cards, catalogs, and stickers. Everything was perfect quality and very affordable.",
    rating: BigInt(5),
    createdAt: BigInt(0),
  },
  {
    id: "default-8",
    author: "Kavita Joshi",
    role: "School Principal",
    content:
      "We order all our school calendars and letterheads from here every year. Consistent quality, great paper, and Manish ji is always helpful and responsive.",
    rating: BigInt(5),
    createdAt: BigInt(0),
  },
  {
    id: "default-9",
    author: "Ravi Shankar",
    role: "Textile Merchant",
    content:
      "Packaging labels and stickers for my textile business come out perfect every time. The lamination quality is excellent and they never miss a deadline.",
    rating: BigInt(5),
    createdAt: BigInt(0),
  },
  {
    id: "default-10",
    author: "Anita Choudhary",
    role: "NGO Director",
    content:
      "Printed 10,000 awareness pamphlets for our campaign at a very affordable rate. Great quality on recycled paper and the whole order was ready in 48 hours!",
    rating: BigInt(4),
    createdAt: BigInt(0),
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Start with 10 hardcoded defaults -- always visible
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const backend = await createActorWithConfig();
        const list = await backend.getTestimonials();
        if (list.length > 0) {
          setTestimonials(list);
          setIndex(0);
        }
        // If backend returns empty, keep showing defaults
      } catch (err) {
        console.error("Failed to load testimonials:", err);
        // Keep showing defaults on error
      }
    };
    loadTestimonials();
  }, []);

  useEffect(() => {
    if (paused || testimonials.length === 0) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      4000,
    );
    return () => clearInterval(t);
  }, [paused, testimonials.length]);

  const safeIndex = index % testimonials.length;

  const prev = () =>
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);

  const visible: Testimonial[] =
    testimonials.length === 1
      ? [testimonials[0]]
      : testimonials.length === 2
        ? [testimonials[0], testimonials[1]]
        : [
            testimonials[
              (safeIndex - 1 + testimonials.length) % testimonials.length
            ],
            testimonials[safeIndex],
            testimonials[(safeIndex + 1) % testimonials.length],
          ];

  const centerIdx =
    testimonials.length === 1 ? 0 : testimonials.length === 2 ? 1 : 1;

  return (
    <section id="testimonials">
      <div
        ref={ref}
        className="pb-20 lg:pb-28 bg-[#F7F8FB]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative">
            <div
              className={`grid gap-6 ${
                visible.length === 1
                  ? "grid-cols-1 max-w-lg mx-auto"
                  : visible.length === 2
                    ? "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto"
                    : "grid-cols-1 md:grid-cols-3"
              }`}
              data-ocid="testimonials.list"
            >
              {visible.map((t, i) => (
                <motion.div
                  key={`${t.id}-${safeIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  data-ocid={`testimonials.item.${i + 1}`}
                  className={`bg-white border rounded-2xl p-7 shadow-card flex flex-col gap-4 transition-all duration-300 ${
                    i === centerIdx
                      ? "border-gold/30 shadow-card-hover scale-105"
                      : "border-border"
                  }`}
                >
                  <div className="flex gap-1">
                    {Array.from({ length: Number(t.rating) }).map((_, si) => (
                      <Star
                        key={`star-${i}-${si + 1}`}
                        className="w-4 h-4 fill-gold text-gold"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {t.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold text-navy text-sm">
                        {t.author}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {testimonials.length > 1 && (
              <div className="flex justify-center gap-3 mt-8">
                <button
                  type="button"
                  onClick={prev}
                  data-ocid="testimonials.pagination_prev"
                  className="w-10 h-10 rounded-full border border-border bg-white hover:bg-navy hover:text-white hover:border-navy transition-all flex items-center justify-center text-navy"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2 items-center">
                  {testimonials.map((item, i) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setIndex(i)}
                      className={`transition-all rounded-full ${
                        i === safeIndex
                          ? "w-6 h-2.5 bg-gold"
                          : "w-2.5 h-2.5 bg-navy/20 hover:bg-navy/40"
                      }`}
                      aria-label={`Testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={next}
                  data-ocid="testimonials.pagination_next"
                  className="w-10 h-10 rounded-full border border-border bg-white hover:bg-navy hover:text-white hover:border-navy transition-all flex items-center justify-center text-navy"
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
