/**
 * Información pública de la óptica
 * Fuente única para header, footer y página de contacto del sitio público
 */

export const BRAND = {
  name: "Óptica Guillén",
  tagline: "La respuesta a tu salud visual",
  city: "Cali",
  phoneDisplay: "+57 316 232 5372",
  whatsappNumber: "573162325372",
  address: "Cra. 39 # 9B-106, Los Cambulos, Cali, Valle del Cauca",
  instagramHandle: "@opticaguillen_cali",
  instagramUrl: "https://www.instagram.com/opticaguillen_cali/",
  facebookUrl: "https://www.facebook.com/OpticaGuillenCali/",
} as const;

export const WHATSAPP_URL = `https://wa.me/${BRAND.whatsappNumber}`;

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
  { href: "/servicios", label: "Servicios" },
  { href: "/descubre-tu-rostro", label: "Descubre tu rostro" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;
