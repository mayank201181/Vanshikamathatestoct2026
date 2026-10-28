import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Maths Test Prep — Year 8",
    short_name: "Maths Prep",
    description: "Year 8 maths class-test prep: FDP, Ratio, Expressions & Sequences.",
    start_url: "/",
    display: "standalone",
    background_color: "#eef2ff",
    theme_color: "#4f46e5",
    icons: [
      { src: "/api/appicon?size=192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/api/appicon?size=512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/api/appicon?size=512&maskable=1", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
