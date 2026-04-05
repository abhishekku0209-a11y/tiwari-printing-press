// localStorage-based store for admin data

export interface QuoteRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  date: string;
  read: boolean;
}

export interface GalleryImage {
  id: string;
  title: string;
  dataUrl: string;
  createdAt: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  dataUrl: string;
  createdAt: string;
}

// VideoMeta: lightweight video metadata stored in localStorage.
// The actual video blob lives in IndexedDB (videoDb) keyed by the same id.
export interface VideoMeta {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: string;
  icon: string;
  name: string;
  description: string;
  imageDataUrl?: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  content: string;
  rating: number;
}

export interface SiteSettings {
  whatsappNumber: string;
  instagramUsername: string;
  heroTagline: string;
  aboutText: string;
  yearsExperience: number;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
}

export interface DesignItem {
  id: string;
  serviceId: string;
  dataUrl: string;
  createdAt: string;
}

const KEYS = {
  quotes: "tpp_quotes",
  gallery: "tpp_gallery",
  videos: "tpp_videos",
  videoMeta: "tpp_video_meta",
  faqs: "tpp_faqs",
  services: "tpp_services",
  testimonials: "tpp_testimonials",
  settings: "tpp_settings",
  contact: "tpp_contact",
  designs: "tpp_designs",
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("localStorage save error", e);
  }
}

// Quotes
export const quoteStore = {
  get: (): QuoteRequest[] => load(KEYS.quotes, []),
  add: (q: Omit<QuoteRequest, "id" | "date" | "read">) => {
    const quotes = quoteStore.get();
    const newQuote: QuoteRequest = {
      ...q,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      read: false,
    };
    save(KEYS.quotes, [newQuote, ...quotes]);
    return newQuote;
  },
  markRead: (id: string) => {
    const quotes = quoteStore
      .get()
      .map((q) => (q.id === id ? { ...q, read: true } : q));
    save(KEYS.quotes, quotes);
  },
  delete: (id: string) => {
    const quotes = quoteStore.get().filter((q) => q.id !== id);
    save(KEYS.quotes, quotes);
  },
  unreadCount: () => quoteStore.get().filter((q) => !q.read).length,
};

// Gallery
export const galleryStore = {
  get: (): GalleryImage[] => load(KEYS.gallery, []),
  add: (img: Omit<GalleryImage, "id" | "createdAt">) => {
    const images = galleryStore.get();
    const newImg: GalleryImage = {
      ...img,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    save(KEYS.gallery, [newImg, ...images]);
    return newImg;
  },
  delete: (id: string) => {
    save(
      KEYS.gallery,
      galleryStore.get().filter((i) => i.id !== id),
    );
  },
};

// Videos
export const videoStore = {
  get: (): VideoItem[] => load(KEYS.videos, []),
  add: (v: Omit<VideoItem, "id" | "createdAt">) => {
    const videos = videoStore.get();
    const newVid: VideoItem = {
      ...v,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    save(KEYS.videos, [newVid, ...videos]);
    return newVid;
  },
  delete: (id: string) => {
    save(
      KEYS.videos,
      videoStore.get().filter((v) => v.id !== id),
    );
  },
};

// VideoMeta — lightweight metadata in localStorage, blob in IndexedDB
export const videoMetaStore = {
  get: (): VideoMeta[] => load(KEYS.videoMeta, []),
  add: (id: string, title: string, description: string): VideoMeta => {
    const metas = videoMetaStore.get();
    const newMeta: VideoMeta = {
      id,
      title,
      description,
      createdAt: new Date().toISOString(),
    };
    save(KEYS.videoMeta, [newMeta, ...metas]);
    return newMeta;
  },
  delete: (id: string) => {
    save(
      KEYS.videoMeta,
      videoMetaStore.get().filter((m) => m.id !== id),
    );
  },
};

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "1",
    question: "What types of printing services do you offer?",
    answer:
      "We offer business card printing, pamphlet and flyer printing, vinyl banner printing, custom sticker printing, banner and hoarding printing, brochure and catalog printing, and much more.",
  },
  {
    id: "2",
    question: "What is the typical turnaround time?",
    answer:
      "Standard orders are completed within 3–5 business days. Rush orders can be processed in 24–48 hours with an express fee.",
  },
  {
    id: "3",
    question: "Do you offer design services?",
    answer:
      "Yes! Our in-house design team can create or refine your artwork. Design charges apply based on complexity.",
  },
  {
    id: "4",
    question: "What file formats do you accept?",
    answer:
      "We accept PDF (preferred), AI, PSD, CDR, and high-resolution JPEG/PNG files at 300 DPI with 3mm bleed.",
  },
  {
    id: "5",
    question: "Do you offer bulk order discounts?",
    answer:
      "Absolutely! We offer significant discounts for bulk orders. Contact us with your requirements.",
  },
  {
    id: "6",
    question: "Can you deliver to my city?",
    answer:
      "We serve 50+ cities across India through reliable courier partners.",
  },
];

export const faqStore = {
  get: (): FAQItem[] => load(KEYS.faqs, DEFAULT_FAQS),
  add: (q: Omit<FAQItem, "id">) => {
    const faqs = faqStore.get();
    const newFaq: FAQItem = { ...q, id: crypto.randomUUID() };
    save(KEYS.faqs, [...faqs, newFaq]);
    return newFaq;
  },
  update: (id: string, question: string, answer: string) => {
    save(
      KEYS.faqs,
      faqStore.get().map((f) => (f.id === id ? { ...f, question, answer } : f)),
    );
  },
  delete: (id: string) => {
    save(
      KEYS.faqs,
      faqStore.get().filter((f) => f.id !== id),
    );
  },
};

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "1",
    icon: "🪪",
    name: "Business Cards",
    description:
      "Premium quality business cards with UV coating, matte/gloss finish, spot UV, and more.",
  },
  {
    id: "2",
    icon: "📄",
    name: "Pamphlets & Flyers",
    description:
      "Eye-catching pamphlets and flyers for promotions, events, and marketing campaigns.",
  },
  {
    id: "3",
    icon: "🖼️",
    name: "Vinyl Printing",
    description:
      "Large format vinyl banners and hoardings for outdoor and indoor advertising.",
  },
  {
    id: "4",
    icon: "🏷️",
    name: "Custom Stickers",
    description:
      "Die-cut, kiss-cut, and sheet stickers in any shape or size for branding and packaging.",
  },
  {
    id: "5",
    icon: "📋",
    name: "Brochures",
    description:
      "Professionally designed brochures in tri-fold, bi-fold, and custom configurations.",
  },
  {
    id: "6",
    icon: "🖨️",
    name: "Banners",
    description:
      "Roll-up banners, pop-up displays, and fabric banners for exhibitions and events.",
  },
];

export const serviceStore = {
  get: (): ServiceItem[] => load(KEYS.services, DEFAULT_SERVICES),
  add: (s: Omit<ServiceItem, "id">) => {
    const items = serviceStore.get();
    const newItem: ServiceItem = { ...s, id: crypto.randomUUID() };
    save(KEYS.services, [...items, newItem]);
    return newItem;
  },
  update: (id: string, data: Partial<ServiceItem>) => {
    save(
      KEYS.services,
      serviceStore.get().map((s) => (s.id === id ? { ...s, ...data } : s)),
    );
  },
  delete: (id: string) => {
    save(
      KEYS.services,
      serviceStore.get().filter((s) => s.id !== id),
    );
  },
};

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    author: "Rajesh Sharma",
    role: "Business Owner",
    content:
      "Outstanding print quality! My business cards turned out even better than expected. Fast delivery and great pricing.",
    rating: 5,
  },
  {
    id: "2",
    author: "Priya Patel",
    role: "Marketing Manager",
    content:
      "Used them for our company event banners. The colors were vibrant and the team was professional throughout.",
    rating: 5,
  },
  {
    id: "3",
    author: "Amit Kumar",
    role: "Restaurant Owner",
    content:
      "Ordered 5000 menu flyers and they were delivered in 2 days! Top-notch quality and unbeatable prices.",
    rating: 4,
  },
];

export const testimonialStore = {
  get: (): TestimonialItem[] => load(KEYS.testimonials, DEFAULT_TESTIMONIALS),
  add: (t: Omit<TestimonialItem, "id">) => {
    const items = testimonialStore.get();
    const newItem: TestimonialItem = { ...t, id: crypto.randomUUID() };
    save(KEYS.testimonials, [...items, newItem]);
    return newItem;
  },
  delete: (id: string) => {
    save(
      KEYS.testimonials,
      testimonialStore.get().filter((t) => t.id !== id),
    );
  },
};

const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: "",
  instagramUsername: "",
  heroTagline: "Premium Printing Solutions for Every Need",
  aboutText:
    "With over 20 years of experience, Tiwari Printing Press has been delivering top-quality printing solutions to businesses and individuals across India.",
  yearsExperience: 20,
};

export const settingsStore = {
  get: (): SiteSettings => load(KEYS.settings, DEFAULT_SETTINGS),
  update: (data: Partial<SiteSettings>) => {
    const current = settingsStore.get();
    save(KEYS.settings, { ...current, ...data });
  },
};

const DEFAULT_CONTACT: ContactInfo = {
  address:
    "Tiwari Printing Press, Opposite Primary School, B 33/5, Gali No. 2, Sabzi Mandi Rd, Maujpur, Shahdara, New Delhi, Delhi 110053",
  phone: "",
  email: "",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.0!2d77.2795!3d28.6792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfb0000000001%3A0x1!2sTiwari+Printing+Press!5e0!3m2!1sen!2sin!4v1700000000000",
};

export const contactStore = {
  get: (): ContactInfo => load(KEYS.contact, DEFAULT_CONTACT),
  update: (data: Partial<ContactInfo>) => {
    const current = contactStore.get();
    save(KEYS.contact, { ...current, ...data });
  },
};

// Designs
export const designStore = {
  get: (): DesignItem[] => load(KEYS.designs, []),
  getByService: (serviceId: string): DesignItem[] =>
    designStore.get().filter((d) => d.serviceId === serviceId),
  add: (d: Omit<DesignItem, "id" | "createdAt">) => {
    const items = designStore.get();
    const newItem: DesignItem = {
      ...d,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    save(KEYS.designs, [...items, newItem]);
    return newItem;
  },
  delete: (id: string) => {
    save(
      KEYS.designs,
      designStore.get().filter((d) => d.id !== id),
    );
  },
};
