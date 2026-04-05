import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "../hooks/useInView";
import { type ServiceItem, serviceStore } from "../store/adminStore";

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    setServices(serviceStore.get());
  }, []);

  const handleCardClick = (serviceId: string) => {
    window.location.href = `/designs#service-${serviceId}`;
  };

  return (
    <div ref={ref} className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-2">
            What We Offer
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-navy uppercase tracking-wide">
            Our Premium Services
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 bg-gold rounded-full" />
        </motion.div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="services.list"
        >
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              data-ocid={`services.item.${i + 1}`}
              onClick={() => handleCardClick(service.id)}
              className="group bg-background border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {service.imageDataUrl ? (
                <img
                  src={service.imageDataUrl}
                  alt={service.name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : null}
              <div className="p-7">
                {!service.imageDataUrl && (
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                )}
                <h3 className="font-bold text-navy text-lg mb-2 group-hover:text-gold transition-colors">
                  {service.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
                <p className="mt-4 text-gold text-xs font-semibold tracking-wide group-hover:translate-x-1 transition-transform duration-200">
                  View Designs →
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
