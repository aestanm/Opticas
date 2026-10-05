import { ExternalLink, Star } from "lucide-react";
import { GOOGLE_REVIEWS_URL } from "@/lib/brand";
import { SITE_REVIEWS } from "@/lib/reviews";

export function ReviewsSection() {
  return (
    <section className="container py-16">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 text-amber-400" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={20} className="fill-current" />
          ))}
        </div>
        <h2 className="mt-3 text-3xl font-bold text-brand-navy">Lo que dicen nuestros pacientes</h2>
        <p className="mt-2 text-slate-600">Lo que dicen quienes ya confiaron en nosotros.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {SITE_REVIEWS.map((review) => (
          <figure key={review.author} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex gap-1 text-amber-400" aria-label={`${review.rating} de 5 estrellas`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className={i < review.rating ? "fill-current" : "text-slate-200"} />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm text-slate-600">“{review.text}”</blockquote>
            <figcaption className="mt-4 text-xs text-slate-400">
              <span className="font-semibold text-brand-navy">{review.author}</span> · {review.timeAgo}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-brand-navy/20 px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy/5"
        >
          Ver todas las reseñas en Google <ExternalLink size={16} />
        </a>
      </div>
    </section>
  );
}
