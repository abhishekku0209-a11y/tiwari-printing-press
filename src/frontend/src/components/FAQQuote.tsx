import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown } from "lucide-react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useInView } from "../hooks/useInView";
import { faqStore, quoteStore } from "../store/adminStore";

export default function FAQQuote() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const faqs = faqStore.get();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      quoteStore.add({
        name: form.name,
        phone: form.phone,
        email: form.email,
        notes: form.notes,
      });
      setSubmitted(true);
      setForm({ name: "", phone: "", email: "", notes: "" });
      toast.success("Quote request submitted! We'll contact you shortly.");
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={ref} id="contact" className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-2">
            Get In Touch
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-navy uppercase tracking-wide">
            FAQ &amp; Free Quote
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 bg-gold rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3"
            data-ocid="faq.list"
          >
            <h3 className="text-lg font-bold text-navy mb-5">
              Frequently Asked Questions
            </h3>
            {faqs.map((faq, i) => (
              <div
                key={faq.id}
                data-ocid={`faq.item.${i + 1}`}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 text-left bg-background hover:bg-secondary transition-colors"
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  data-ocid={`faq.toggle.${i + 1}`}
                >
                  <span className="font-semibold text-navy text-sm pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${
                      openFAQ === faq.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFAQ === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border bg-background">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>

          {/* Quote Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-navy rounded-3xl p-8 lg:p-10 shadow-card-hover"
            data-ocid="quote.panel"
          >
            <h3 className="text-xl font-extrabold text-white mb-1 uppercase tracking-wide">
              Request a Free Quote
            </h3>
            <p className="text-white/60 text-sm mb-7">
              Fill in the form and we'll get back to you within 24 hours.
            </p>

            {submitted ? (
              <div
                className="text-center py-12"
                data-ocid="quote.success_state"
              >
                <CheckCircle2 className="w-16 h-16 text-gold mx-auto mb-4" />
                <p className="text-white font-bold text-lg">Thank You!</p>
                <p className="text-white/70 text-sm mt-2">
                  We'll reach out to you shortly.
                </p>
                <Button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 bg-gold hover:bg-gold-dark text-navy font-bold rounded-full px-7"
                >
                  Send Another
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                data-ocid="quote.modal"
              >
                <div>
                  <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                    Full Name *
                  </Label>
                  <Input
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-gold"
                    data-ocid="quote.input"
                  />
                </div>
                <div>
                  <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                    Phone Number *
                  </Label>
                  <Input
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-gold"
                    data-ocid="quote.input"
                  />
                </div>
                <div>
                  <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                    Email Address *
                  </Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-gold"
                    data-ocid="quote.input"
                  />
                </div>
                <div>
                  <Label className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                    Notes
                  </Label>
                  <Textarea
                    placeholder="Tell us about your printing requirements..."
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-gold resize-none"
                    rows={3}
                    data-ocid="quote.textarea"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold hover:bg-gold-dark text-navy font-bold rounded-full py-5"
                  data-ocid="quote.submit_button"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Send Quote Request"
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
