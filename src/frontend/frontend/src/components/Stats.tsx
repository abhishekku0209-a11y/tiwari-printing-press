import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "../hooks/useInView";

const stats = [
  { value: 20, suffix: "+", label: "Years of Experience" },
  { value: 500, suffix: "+", label: "Happy Clients" },
  { value: 10000, suffix: "+", label: "Projects Completed" },
  { value: 50, suffix: "+", label: "Cities Served" },
];

function CountUp({
  target,
  suffix,
  active,
}: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [active, target]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <div ref={ref} id="about" className="py-16 lg:py-20 bg-navy">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-2">
            Our Track Record
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white uppercase tracking-wide">
            Experience in Excellence
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 bg-gold rounded-full" />
        </motion.div>

        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          data-ocid="stats.list"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              data-ocid={`stats.item.${i + 1}`}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gold mb-2">
                <CountUp
                  target={stat.value}
                  suffix={stat.suffix}
                  active={inView}
                />
              </div>
              <div className="text-white/80 text-sm font-medium uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
