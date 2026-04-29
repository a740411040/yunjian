import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "云笺",
    short_name: "云笺",
    description: "可安装的新中式云端笔记与社区应用。",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f5f5f7",
    theme_color: "#c04851",
    lang: "zh-CN",
    categories: ["productivity", "lifestyle", "social"],
    icons: [
      {
        src: "/pwa/icon-192",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/pwa/icon-512",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/pwa/icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
