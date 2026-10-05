import type { MetadataRoute } from "next";
import { NAV_LINKS, SITE_URL } from "@/lib/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  return NAV_LINKS.map((link) => ({
    url: `${SITE_URL}${link.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: link.href === "/" ? 1 : 0.8,
  }));
}
