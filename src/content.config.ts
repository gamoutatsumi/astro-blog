import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    image: z.string().default("/no_image_yoko.jpg"),
    publishDate: z.coerce.date(),
    updatedDate: z.date().optional(),
    isDraft: z.boolean(),
  }),
  loader: glob({ pattern: "**/*.md", base: "./content/posts" }),
});

export const collections = {
  posts: blogCollection,
};
