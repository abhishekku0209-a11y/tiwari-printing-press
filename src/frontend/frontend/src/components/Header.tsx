import { Button } from "@/components/ui/button";
import { Menu, Printer, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#home", type: "scroll" },
  { label: "About", href: "#about", type: "scroll" },
  { label: "Services", href: "#services", type: "scroll" },
  { label: "Gallery", href: "#gallery", type: "scroll" },
  { label: "FAQ", href: "#faq", type: "scroll" },
  { label: "Our Designs", href: "/designs", type: "page" },
];

function navigateTo(path: string) {
  window.location.href = path;
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/";
  const isDesignsPage = currentPath.startsWith("/designs");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (isDesignsPage) return;
      const sections = ["home", "about", "services", "gallery", "faq"];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDesignsPage]);

  const handleNavClick = (link: { href: string; type: string }) => {
    if (link.type === "page") {
      navigateTo(link.href);
      return;
    }
    if (isDesignsPage) {
      navigateTo(`/${link.href}`);
      return;
    }
    const id = link.href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setTimeout(() => setMobileOpen(false), 100);
  };

  const isLinkActive = (link: { href: string; type: string }) => {
    if (link.type === "page") {
      return isDesignsPage;
    }
    if (isDesignsPage) return false;
    return activeSection === link.href.replace("#", "");
  };

  const handleQuoteClick = () => {
    if (isDesignsPage) {
      navigateTo("/#faq");
    } else {
      const el = document.getElementById("faq");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  const handleQuoteClickMobile = () => {
    handleQuoteClick();
    setTimeout(() => setMobileOpen(false), 100);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigateTo("/")}
            className="flex items-center gap-2 cursor-pointer"
            aria-label="Go to home"
          >
            <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center">
              <Printer className="w-5 h-5 text-gold" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-navy text-sm lg:text-base tracking-wide">
                TIWARI
              </div>
              <div className="text-[10px] lg:text-xs text-muted-foreground tracking-widest uppercase">
                Printing Press
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav
            className="hidden lg:flex items-center gap-6"
            data-ocid="main.nav"
          >
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.label}
                onClick={() => handleNavClick(link)}
                data-ocid={`nav.${link.label.toLowerCase().replace(" ", "_")}.link`}
                className={`text-sm font-medium transition-colors relative pb-1 ${
                  isLinkActive(link)
                    ? "text-navy"
                    : "text-muted-foreground hover:text-navy"
                }`}
              >
                {link.label}
                {isLinkActive(link) && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              type="button"
              onClick={handleQuoteClick}
              data-ocid="header.quote.button"
              className="bg-gold hover:bg-gold-dark text-navy font-semibold px-5 py-2 rounded-full text-sm"
            >
              Request Quote
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="lg:hidden p-2 text-navy"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="header.mobile_menu.toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-border"
            data-ocid="header.mobile_menu.panel"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`text-left py-2 text-sm font-medium transition-colors ${
                    isLinkActive(link)
                      ? "text-navy font-bold"
                      : "text-navy hover:text-gold"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <Button
                type="button"
                onClick={handleQuoteClickMobile}
                className="bg-gold hover:bg-gold-dark text-navy font-semibold mt-2 rounded-full"
              >
                Request Quote
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
