import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/studio/",
          "/api/",
          "/(auth)/",
          "/onboarding/",
        ],
      },
    ],
    sitemap: "https://aprn-africa.org/sitemap.xml",
  };
}
