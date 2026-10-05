/**
 * Información pública de la óptica
 * Fuente única para header, footer y página de contacto del sitio público
 */

export const BRAND = {
  name: "Óptica Guillén",
  legalName: "Óptica Guillén S.A.S.",
  tagline: "La respuesta a tu salud visual",
  city: "Cali",
  phoneDisplay: "+57 316 232 5372",
  whatsappNumber: "573162325372",
  address: "Cra. 39 # 9B-106, Los Cambulos, Cali, Valle del Cauca",
  instagramHandle: "@opticaguillen_cali",
  instagramUrl: "https://www.instagram.com/opticaguillen_cali/",
  facebookUrl: "https://www.facebook.com/OpticaGuillenCali/",
  tiktokHandle: "@opticaguillen.cali",
  tiktokUrl: "https://www.tiktok.com/@opticaguillen.cali",
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Enlace a la ficha de Google (no requiere API). Reemplazar por la URL directa del perfil cuando se tenga.
export const GOOGLE_REVIEWS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Óptica Guillén Cali")}`;

export const WHATSAPP_MESSAGE = "Hola! Estuve revisando su página web y me gustaría agendar una cita";

export const WHATSAPP_URL = `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const EXAM_PROMOTION = {
  title: "Examen visual gratis",
  description: "Al comprar tus lentes formulados con nosotros, el examen visual completo no tiene costo.",
} as const;

export const BUSINESS_HOURS = [
  { day: "Lunes", hours: "8:00 a. m. - 5:00 p. m." },
  { day: "Martes", hours: "8:00 a. m. - 5:00 p. m." },
  { day: "Miércoles", hours: "8:00 a. m. - 5:00 p. m." },
  { day: "Jueves", hours: "8:00 a. m. - 5:00 p. m." },
  { day: "Viernes", hours: "8:00 a. m. - 5:00 p. m." },
  { day: "Sábado", hours: "8:00 a. m. - 11:00 a. m." },
  { day: "Domingo", hours: "Cerrado" },
] as const;

// Orden pensado para grillas de 3 columnas: Andrés (CEO) queda en el centro.
export const TEAM = [
  {
    name: "Fernanda",
    role: "Gestora Comercial",
    photo: "/images/team/fernanda.jpg",
  },
  {
    name: "Andrés",
    role: "CEO & Optómetra",
    photo: "/images/team/andres.jpg",
  },
  {
    name: "Anyela",
    role: "Gestora Administrativa",
    photo: "/images/team/anyela.jpg",
  },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/descubre-tu-rostro", label: "Descubre tu rostro" },
  { href: "/contacto", label: "Contacto" },
] as const;
