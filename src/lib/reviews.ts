/**
 * Reseñas mostradas en el sitio público, copiadas de la ficha pública de Google.
 *
 * Son texto literal de los autores. Si se publican con nombres, conviene
 * confirmar con la óptica y con cada autor. Las fechas son relativas ("Hace 2 meses")
 * y se quedan viejas: al obtener acceso a la API se deben reemplazar por datos en vivo.
 */

export interface SiteReview {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  timeAgo: string;
}

export const SITE_REVIEWS: SiteReview[] = [
  {
    author: "Sebastian Ruiz",
    rating: 5,
    text: "Excelente óptica. Desde el momento en que uno llega se nota la calidad humana y el profesionalismo de todo el equipo. Te hacen sentir bien atendido y acompañado durante todo el proceso. Sin duda, es un lugar de otro nivel. ¡Felicitaciones por el excelente servicio! Volveré siempre y lo recomendaré con total confianza.",
    timeAgo: "Hace 2 meses",
  },
  {
    author: "Nicolas Benavides",
    rating: 5,
    text: "Quiero agradecer a Óptica Guillén y al Doc Andrés, la atención excelente y muy buena calidad del servicio. Lo recomiendo por su calidad/precio. El examen es muy integral y moderno, el cual me permite estar muy satisfecho con mi resultado.",
    timeAgo: "Hace 11 meses",
  },
  {
    author: "Johanna Andrea Quintero Marin",
    rating: 5,
    text: "La calidez humana que tiene la óptica es maravillosa. El optómetra es una persona súper profesional, además la asesoría al escoger la montura es única. Definitivamente tiene un servicio único y espectacular. Adoro todos sus productos, ¡quería llevarme todas las monturas! Felicitaciones. Da gusto ser atendidos por ustedes.",
    timeAgo: "Hace 8 meses",
  },
];
