import { Badge } from "@/components/ui/badge";
import {
  BookUser,
  HelpCircle,
  Image,
  Layers,
  LayoutGrid,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Printer,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";
import { quoteStore } from "../../store/adminStore";
import ContactManagement from "./sections/ContactManagement";
import DesignsManagement from "./sections/DesignsManagement";
import FAQManagement from "./sections/FAQManagement";
import GalleryManagement from "./sections/GalleryManagement";
import QuoteRequests from "./sections/QuoteRequests";
import ServicesManagement from "./sections/ServicesManagement";
import SettingsManagement from "./sections/SettingsManagement";
import TestimonialsManagement from "./sections/TestimonialsManagement";

type Section =
  | "quotes"
  | "gallery"
  | "faq"
  | "services"
  | "testimonials"
  | "contact"
  | "settings"
  | "designs";

interface NavItem {
  id: Section;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: "quotes", label: "Quote Requests", icon: <Mail className="w-5 h-5" /> },
  { id: "gallery", label: "Gallery", icon: <Image className="w-5 h-5" /> },
  { id: "faq", label: "FAQ", icon: <HelpCircle className="w-5 h-5" /> },
  { id: "services", label: "Services", icon: <Layers className="w-5 h-5" /> },
  {
    id: "designs",
    label: "Our Designs",
    icon: <LayoutGrid className="w-5 h-5" />,
  },
  {
    id: "testimonials",
    label: "Testimonials",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    id: "contact",
    label: "Contact Info",
    icon: <BookUser className="w-5 h-5" />,
  },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

interface Props {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: Props) {
  const [section, setSection] = useState<Section>("quotes");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unread = quoteStore.unreadCount();

  const handleNav = (s: Section) => {
    setSection(s);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    onLogout();
  };

  const SectionContent = () => {
    switch (section) {
      case "quotes":
        return <QuoteRequests />;
      case "gallery":
        return <GalleryManagement />;
      case "faq":
        return <FAQManagement />;
      case "services":
        return <ServicesManagement />;
      case "designs":
        return <DesignsManagement />;
      case "testimonials":
        return <TestimonialsManagement />;
      case "contact":
        return <ContactManagement />;
      case "settings":
        return <SettingsManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 bg-black/50 z-20 lg:hidden w-full cursor-default"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-navy flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center flex-shrink-0">
              <Printer className="w-5 h-5 text-navy" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight">
                Tiwari Printing
              </p>
              <p className="text-gold text-xs font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              data-ocid={`admin.${item.id}.tab`}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                section === item.id
                  ? "bg-gold text-navy font-bold shadow-md"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === "quotes" && unread > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-1.5 py-0 h-5 min-w-5">
                  {unread}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            data-ocid="admin.logout_button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-border px-4 lg:px-8 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-navy hover:text-gold transition-colors"
            data-ocid="admin.toggle"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <h1 className="font-extrabold text-navy text-lg">
            {navItems.find((n) => n.id === section)?.label}
          </h1>
          <div className="ml-auto">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-navy transition-colors font-medium"
              data-ocid="admin.link"
            >
              ← View Website
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <SectionContent />
        </main>
      </div>
    </div>
  );
}
