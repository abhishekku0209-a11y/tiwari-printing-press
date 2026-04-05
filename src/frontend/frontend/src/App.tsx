import { Toaster } from "@/components/ui/sonner";
import FAQQuote from "./components/FAQQuote";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";
import Header from "./components/Header";
import Hero from "./components/Hero";
import LocationMap from "./components/LocationMap";
import Services from "./components/Services";
import Stats from "./components/Stats";
import Testimonials from "./components/Testimonials";
import WhatsAppButton from "./components/WhatsAppButton";
import OurDesigns from "./pages/OurDesigns";
import AdminPage from "./pages/admin/AdminPage";

function getEffectivePath(): string {
  const redirect = sessionStorage.getItem("spa_redirect");
  if (redirect) {
    sessionStorage.removeItem("spa_redirect");
    return redirect;
  }
  return window.location.pathname;
}

function PublicSite() {
  return (
    <div className="min-h-screen bg-background font-poppins">
      <Header />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="about">
          <Stats />
        </section>
        <section id="services">
          <Services />
        </section>
        <section id="gallery">
          <Gallery />
        </section>
        <Testimonials />
        <section id="faq">
          <FAQQuote />
        </section>
        <LocationMap />
      </main>
      <Footer />
      <WhatsAppButton />
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  const path = getEffectivePath();
  const isAdmin = path.startsWith("/admin");
  const isDesigns = path.startsWith("/designs");

  if (isAdmin) {
    return (
      <>
        <AdminPage />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  if (isDesigns) {
    return (
      <>
        <OurDesigns />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return <PublicSite />;
}
