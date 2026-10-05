/** Recomendaciones por defecto (portables): el host puede sobreescribir cualquier entrada vía props. */
import type { FaceShape, FrameTypeExample, ShapeRecommendation } from "../types";
import { Aviator, Browline, CatEye, Rimless, Round, Square } from "./frame-icons";

export const FRAME_TYPES: Record<string, FrameTypeExample> = {
  round: { id: "round", name: "Redonda", description: "Líneas curvas sin ángulos marcados.", Icon: Round },
  square: { id: "square", name: "Cuadrada", description: "Líneas rectas y esquinas definidas.", Icon: Square },
  catEye: { id: "cat-eye", name: "Cat-eye", description: "Ángulo elevado hacia afuera en la esquina superior.", Icon: CatEye },
  aviator: { id: "aviator", name: "Aviador", description: "Forma de gota, más ancha arriba que abajo.", Icon: Aviator },
  rimless: { id: "rimless", name: "Al aire / geométrica", description: "Sin marco visible o con formas geométricas ligeras.", Icon: Rimless },
  browline: { id: "browline", name: "Browline", description: "Marco marcado arriba, ligero o al aire abajo.", Icon: Browline },
};

export const DEFAULT_RECOMMENDATIONS: Record<FaceShape, ShapeRecommendation> = {
  ovalado: {
    shape: "ovalado",
    label: "Ovalado",
    description:
      "Frente y mandíbula de ancho similar, con pómulos algo más anchos y un largo mayor que el ancho.",
    explanation:
      "Es un rostro con proporciones equilibradas, por lo que se adapta bien a casi cualquier montura. Puedes aprovechar para darle algo de carácter con formas geométricas.",
    recommendedFrameTypes: [FRAME_TYPES.square!, FRAME_TYPES.catEye!, FRAME_TYPES.aviator!],
    avoidNotes: "Evita monturas sobredimensionadas que tapen el equilibrio natural del rostro.",
    tips: [
      "Casi cualquier forma te favorece: aprovecha para experimentar.",
      "Las monturas con algo de carácter geométrico destacan tus proporciones.",
      "Evita tamaños exagerados que rompan el equilibrio natural.",
    ],
  },
  redondo: {
    shape: "redondo",
    label: "Redondo",
    description: "Largo y ancho casi iguales, con mejillas llenas y una mandíbula suave.",
    explanation:
      "Las líneas suaves del rostro se benefician de monturas con ángulos que aporten definición y contraste.",
    recommendedFrameTypes: [FRAME_TYPES.square!, FRAME_TYPES.browline!, FRAME_TYPES.catEye!],
    avoidNotes: "Las monturas redondas tienden a repetir la forma del rostro en vez de contrastarla.",
    tips: [
      "Busca ángulos que definan el rostro, como cuadradas o rectangulares.",
      "Las monturas anchas y con altura ayudan a estilizar.",
      "Evita monturas redondas pequeñas que repiten la curva.",
    ],
  },
  cuadrado: {
    shape: "cuadrado",
    label: "Cuadrado",
    description: "Largo y ancho similares, con una mandíbula marcada y angulosa.",
    explanation:
      "La mandíbula marcada se suaviza con monturas de líneas curvas, que equilibran los ángulos del rostro.",
    recommendedFrameTypes: [FRAME_TYPES.round!, FRAME_TYPES.catEye!, FRAME_TYPES.rimless!],
    avoidNotes: "Las monturas cuadradas o muy angulosas acentúan la mandíbula marcada.",
    tips: [
      "Las líneas curvas suavizan la mandíbula marcada.",
      "Prefiere monturas redondas u ovaladas.",
      "Evita diseños muy rectos y angulosos.",
    ],
  },
  corazon: {
    shape: "corazon",
    label: "Corazón",
    description: "La frente es más ancha que la mandíbula, con un mentón más estrecho.",
    explanation:
      "La frente es más ancha que la mandíbula, así que conviene una montura liviana que no sume peso visual en la parte superior.",
    recommendedFrameTypes: [FRAME_TYPES.aviator!, FRAME_TYPES.rimless!, FRAME_TYPES.round!],
    avoidNotes: "Evita monturas muy anchas arriba o con marco superior grueso (como browline), que acentúan la frente.",
    tips: [
      "Monturas más anchas abajo, como aviador o al aire, equilibran la frente.",
      "Mantén el peso visual de la montura en la parte inferior.",
      "Evita marcos superiores gruesos.",
    ],
  },
  alargado: {
    shape: "alargado",
    label: "Alargado",
    description: "El largo supera claramente al ancho, con líneas laterales rectas.",
    explanation:
      "El rostro es más largo que ancho, por lo que monturas con más altura ayudan a acortar visualmente las proporciones.",
    recommendedFrameTypes: [FRAME_TYPES.round!, FRAME_TYPES.square!, FRAME_TYPES.browline!],
    avoidNotes: "Las monturas pequeñas o muy estrechas alargan aún más el rostro.",
    tips: [
      "Monturas con altura ayudan a acortar visualmente el rostro.",
      "Busca detalles laterales o puentes marcados.",
      "Evita monturas pequeñas y estrechas.",
    ],
  },
  diamante: {
    shape: "diamante",
    label: "Diamante",
    description: "Los pómulos son el punto más ancho, con frente y mandíbula más estrechas.",
    explanation:
      "Los pómulos son el punto más ancho del rostro; una montura con líneas curvas suaviza esa zona y realza la mirada.",
    recommendedFrameTypes: [FRAME_TYPES.catEye!, FRAME_TYPES.round!, FRAME_TYPES.rimless!],
    avoidNotes: "Las monturas muy angulosas o estrechas compiten con el ancho de los pómulos.",
    tips: [
      "Monturas tipo cat-eye o con curvas suavizan los pómulos.",
      "Una montura al aire o ligera no compite con el ancho de los pómulos.",
      "Evita diseños muy angulosos o estrechos.",
    ],
  },
};
