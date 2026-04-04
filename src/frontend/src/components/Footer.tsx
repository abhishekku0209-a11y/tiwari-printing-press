import { Mail, MapPin, Phone, Printer } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";
import { contactStore, settingsStore } from "../store/adminStore";

const quickLinks = ["Home", "Services", "Gallery", "Videos", "FAQ"];

const allServices = [
  "Business Cards",
  "Pamphlets & Flyers",
  "Vinyl Printing",
  "Custom Stickers",
  "Banners & Hoardings",
  "Brochures & Catalogs",
  "Offset Printing",
  "Flex Printing",
  "Wedding Cards",
  "Letterheads & Stationery",
  "Visiting Cards",
  "Product Catalogs",
  "Calendars & Planners",
  "Packaging & Boxes",
];

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";

  const contact = contactStore.get();
  const settings = settingsStore.get();
  const instagramUrl = settings.instagramUsername
    ? `https://www.instagram.com/${settings.instagramUsername}`
    : "https://www.instagram.com/";

  const scrollTo = (id: string) => {
    document
      .getElementById(id.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="bg-navy text-white rounded-t-[2.5rem] mt-0"
      data-ocid="footer.section"
    >
      <div className="container mx-auto px-4 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-gold rounded-xl flex items-center justify-center">
                <Printer className="w-6 h-6 text-navy" />
              </div>
              <div>
                <div className="font-extrabold text-white text-base tracking-wide">
                  TIWARI
                </div>
                <div className="text-white/50 text-[10px] tracking-widest uppercase">
                  Printing Press
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Premium printing solutions for businesses and individuals. Quality
              you can see, service you can trust.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-gold transition-colors rounded-full flex items-center justify-center"
                aria-label="Facebook"
              >
                <SiFacebook className="w-4 h-4" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-gold transition-colors rounded-full flex items-center justify-center"
                aria-label="Instagram"
              >
                <SiInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-gold transition-colors rounded-full flex items-center justify-center"
                aria-label="Twitter/X"
              >
                <SiX className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link)}
                    className="text-white/60 hover:text-gold transition-colors text-sm"
                    data-ocid={`footer.${link.toLowerCase()}.link`}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-5">
              Services
            </h4>
            <ul className="space-y-2">
              {allServices.map((s) => (
                <li key={s}>
                  <span className="text-white/60 text-sm">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {contact.address ? (
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-white/60 text-sm">
                    {contact.address}
                  </span>
                </li>
              ) : (
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-white/60 text-sm">
                    Tiwari Printing Press, Maujpur,
                    <br />
                    Shahdara, New Delhi - 110053
                  </span>
                </li>
              )}
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-white/60 hover:text-gold transition-colors text-sm"
                  >
                    {contact.phone}
                  </a>
                ) : (
                  <a
                    href="tel:+918800180074"
                    className="text-white/60 hover:text-gold transition-colors text-sm"
                  >
                    +91 8800180074
                  </a>
                )}
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                {contact.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-white/60 hover:text-gold transition-colors text-sm"
                  >
                    {contact.email}
                  </a>
                ) : (
                  <span className="text-white/40 text-sm italic">
                    Set in admin &rarr; Contact Info
                  </span>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>\u00a9 {year} Tiwari Printing Press. All rights reserved.</span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 transition-colors"
          >
            Built with \u2764\ufe0f using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
