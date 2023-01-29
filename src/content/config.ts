import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    image: z.string(),
    publishDate: z.string().transform((str) => new Date(str)),
    isDraft: z.boolean(),
  }),
});

export const collections = {
  posts: blogCollection,
};
