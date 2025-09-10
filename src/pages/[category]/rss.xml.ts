import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext, GetStaticPaths } from "astro";

export const getStaticPaths: GetStaticPaths = async () => {
	const blogEntries = await getCollection("posts");
	return blogEntries
		.filter((entry) => !entry.data.isDraft)
		.map((entry) => {
			const category = entry.id.split("/")[0];
			return {
				params: { category },
				props: { category },
			};
		});
};

export const GET = async (context: APIContext) => {
	const entries = await getCollection("posts");
	const items = entries
		.filter((entry) => entry.id.split("/")[0] === context.params.category)
		.map((entry) => ({
			title: entry.data.title,
			link: entry.id,
			pubDate: entry.data.publishDate,
		}));

	return rss({
		title: "通算n度目のブログ",
		description: "@gamoutatsumi のブログ",
		site: context.url.toString(),
		items,
		stylesheet: "/rss.xsl",
	});
};
