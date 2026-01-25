import { getCollection } from "astro:content";
import { getRssString, type RSSFeedItem } from "@astrojs/rss";
import type { APIContext } from "astro";

export const GET = async (context: APIContext) => {
  const entries = await getCollection("posts");
  const rss = await getRssString({
    title: "通算n度目のブログ",
    description: "@gamoutatsumi のブログ",
    site: context.url.toString(),
    items: entries
      .filter((entry) => entry.id.split("/")[0] !== "nsfw")
      .map((entry): RSSFeedItem => {
        const [category, slug] = entry.id.split("/");
        return {
          title: entry.data.title,
          link: entry.id,
          pubDate: entry.data.publishDate,
          enclosure: {
            url: new URL(
              `/ogp/${category}/${slug}.jpg`,
              "https://blog.gamou.dev",
            ).toString(),
            type: "image/png",
            length: 0,
          },
        };
      }),
    stylesheet: "/rss.xsl",
  });
  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
