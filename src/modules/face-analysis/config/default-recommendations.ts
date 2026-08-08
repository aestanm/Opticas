/** Recomendaciones por defecto (portables): el host puede sobreescribir cualquier entrada vía props. */
import type { FaceShape, FrameTypeExample, ShapeRecommendation } from "../types";
import { Aviator, Browline, CatEye, Rimless, Round, Square } from "./frame-icons";

const FRAME_TYPES: Record<string, FrameTypeExample> = {
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
    explanation:
      "Es un rostro con proporciones equilibradas, por lo que se adapta bien a casi cualquier montura. Puedes aprovechar para darle algo de carácter con formas geométricas.",
    recommendedFrameTypes: [FRAME_TYPES.square!, FRAME_TYPES.catEye!, FRAME_TYPES.aviator!],
    avoidNotes: "Evita monturas sobredimensionadas que tapen el equilibrio natural del rostro.",
  },
  redondo: {
    shape: "redondo",
    label: "Redondo",
    explanation:
      "Las líneas suaves del rostro se benefician de monturas con ángulos que aporten definición y contraste.",
    recommendedFrameTypes: [FRAME_TYPES.square!, FRAME_TYPES.browline!, FRAME_TYPES.catEye!],
    avoidNotes: "Las monturas redondas tienden a repetir la forma del rostro en vez de contrastarla.",
  },
  cuadrado: {
    shape: "cuadrado",
    label: "Cuadrado",
    explanation:
      "La mandíbula marcada se suaviza con monturas de líneas curvas, que equilibran los ángulos del rostro.",
    recommendedFrameTypes: [FRAME_TYPES.round!, FRAME_TYPES.catEye!, FRAME_TYPES.rimless!],
    avoidNotes: "Las monturas cuadradas o muy angulosas acentúan la mandíbula marcada.",
  },
  corazon: {
    shape: "corazon",
    label: "Corazón",
    explanation:
      "La frente es más ancha que la mandíbula, así que conviene una montura liviana que no sume peso visual en la parte superior.",
    recommendedFrameTypes: [FRAME_TYPES.aviator!, FRAME_TYPES.rimless!, FRAME_TYPES.round!],
    avoidNotes: "Evita monturas muy anchas arriba o con marco superior grueso (como browline), que acentúan la frente.",
  },
  alargado: {
    shape: "alargado",
    label: "Alargado",
    explanation:
      "El rostro es más largo que ancho, por lo que monturas con más altura ayudan a acortar visualmente las proporciones.",
    recommendedFrameTypes: [FRAME_TYPES.round!, FRAME_TYPES.square!, FRAME_TYPES.browline!],
    avoidNotes: "Las monturas pequeñas o muy estrechas alargan aún más el rostro.",
  },
  diamante: {
    shape: "diamante",
    label: "Diamante",
    explanation:
      "Los pómulos son el punto más ancho del rostro; una montura con líneas curvas suaviza esa zona y realza la mirada.",
    recommendedFrameTypes: [FRAME_TYPES.catEye!, FRAME_TYPES.round!, FRAME_TYPES.rimless!],
    avoidNotes: "Las monturas muy angulosas o estrechas compiten con el ancho de los pómulos.",
  },
};
