import { getRssString, type RSSFeedItem } from "@astrojs/rss";
import { getGitUpdatedAt } from "@lib/gitUpdatedAt";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export const GET = async (context: APIContext) => {
  const entries = await getCollection("posts");
  const items = await Promise.all(
    entries
      .filter((entry) => entry.id.split("/")[0] !== "nsfw")
      .map(async (entry): Promise<RSSFeedItem> => {
        const [category, slug] = entry.id.split("/");
        const filePath = `content/posts/${entry.id}.md`;
        const updatedDate =
          (await getGitUpdatedAt(filePath)) ?? entry.data.publishDate;
        return {
          title: entry.data.title,
          link: entry.id,
          pubDate: entry.data.publishDate,
          customData: `<atom:updated>${updatedDate.toISOString()}</atom:updated>`,
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
  );
  const rss = await getRssString({
    title: "通算n度目のブログ",
    description: "@gamoutatsumi のブログ",
    site: context.url.toString(),
    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
    },
    items,
    stylesheet: "/rss.xsl",
  });
  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
