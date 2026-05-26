import { defineCollection } from "astro:content";
import { rssSchema } from "@astrojs/rss";
import { glob } from "astro/loaders"; // Not available with legacy API
import z from "astro/zod"

const blog = defineCollection({
  schema: rssSchema.extend({
    img: z.optional(z.string()),
    updated: z.optional(z.date()),
  }),
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog/" }),
});

export const collections = { blog };
