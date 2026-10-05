import { BRAND, BUSINESS_HOURS, SITE_URL } from "@/lib/brand";

const DAY_CODES: Record<string, string> = {
  Lunes: "Monday",
  Martes: "Tuesday",
  Miércoles: "Wednesday",
  Jueves: "Thursday",
  Viernes: "Friday",
  Sábado: "Saturday",
  Domingo: "Sunday",
};

// Datos estructurados para que Google interprete el negocio como óptica local.
// No incluye aggregateRating: solo debe agregarse con reseñas reales.
export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Optician",
    name: BRAND.name,
    legalName: BRAND.legalName,
    url: SITE_URL,
    telephone: `+${BRAND.whatsappNumber}`,
    description: "Tecnología avanzada en salud visual, asesoría personalizada y lentes en Cali.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Cra. 39 # 9B-106, Los Cambulos",
      addressLocality: "Cali",
      addressRegion: "Valle del Cauca",
      addressCountry: "CO",
    },
    openingHoursSpecification: BUSINESS_HOURS.filter((h) => h.hours !== "Cerrado").map((h) => {
      const [open, close] = h.hours.replace(/\s?a\. m\.| p\. m\./g, "").split(" - ");
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DAY_CODES[h.day],
        opens: to24h(open),
        closes: to24h(close),
      };
    }),
    sameAs: [BRAND.instagramUrl, BRAND.facebookUrl, BRAND.tiktokUrl],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// "8:00" -> "08:00", "5:00" -> "17:00", "11:00" -> "11:00"
function to24h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const hour = h < 7 ? h + 12 : h;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
