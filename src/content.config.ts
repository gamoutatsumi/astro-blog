import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		tags: z.array(z.string()),
		image: z.string().optional().default("/no_image_yoko.jpg"),
		publishDate: z.string().transform((str) => new Date(str)),
		isDraft: z.boolean(),
	}),
	loader: glob({ pattern: "**/*.md", base: "./content/posts" }),
});

export const collections = {
	posts: blogCollection,
};
