import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Akila Shashimantha — Systems Architect & Lead Full-Stack Engineer",
    short_name: "Akila Shashimantha",
    description:
      "Official portfolio & architectural CV of Akila Shashimantha. Lead engineer building high-throughput microservices, distributed systems, and precision web experiences.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F4F0",
    theme_color: "#161615",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
