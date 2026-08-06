/**
 * Tarjeta de checklist (check en caja + texto), al estilo de los posts educativos
 * de Óptica Guillén ("Cuando un niño no ve bien puede...")
 */

import { Check } from "lucide-react";

export function ChecklistCard({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-4 rounded-xl bg-white/95 px-4 py-3 shadow-sm"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-teal text-white">
            <Check size={18} strokeWidth={3} />
          </span>
          <span className="text-sm font-medium text-brand-navy">{item}</span>
        </li>
      ))}
    </ul>
  );
}
