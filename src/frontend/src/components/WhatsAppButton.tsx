import { MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { settingsStore } from "../store/adminStore";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="Instagram"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5.5"
        stroke="white"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.25" fill="white" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const [tooltip, setTooltip] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setTooltip(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const handleWhatsAppClick = () => {
    const settings = settingsStore.get();
    const number = settings.whatsappNumber
      ? settings.whatsappNumber.replace(/[^0-9]/g, "")
      : "919876543210";
    window.open(
      `https://wa.me/${number}?text=Hi!%20I%20would%20like%20to%20get%20a%20quote%20from%20Tiwari%20Printing%20Press.`,
      "_blank",
    );
  };

  const handleInstagramClick = () => {
    const settings = settingsStore.get();
    const url = settings.instagramUsername
      ? `https://www.instagram.com/${settings.instagramUsername}`
      : "https://www.instagram.com/";
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-card px-4 py-3 text-sm font-medium text-navy border border-border flex items-center gap-2 max-w-[200px]"
          >
            <span>Chat with us on WhatsApp!</span>
            <button
              type="button"
              onClick={() => setTooltip(false)}
              aria-label="Close"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instagram Button */}
      <motion.button
        type="button"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 1.2 }}
        onClick={handleInstagramClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Follow us on Instagram"
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background:
            "radial-gradient(circle at 30% 110%, #f9a825 0%, #f06292 40%, #e040fb 70%, #7c4dff 100%)",
        }}
      >
        <InstagramIcon className="w-7 h-7" />
      </motion.button>

      {/* WhatsApp Button */}
      <motion.button
        type="button"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 1 }}
        onClick={handleWhatsAppClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        data-ocid="whatsapp.button"
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg whatsapp-pulse"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white fill-white" />
      </motion.button>
    </div>
  );
}
