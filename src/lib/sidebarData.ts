import { type CollectionEntry, getCollection } from "astro:content";

type PostEntry = CollectionEntry<"posts">;

export async function getPublishedPosts(): Promise<PostEntry[]> {
  const entries = await getCollection("posts");
  return entries
    .filter((entry) => !entry.data.isDraft && !entry.id.startsWith("nsfw/"))
    .sort(
      (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
    );
}

export async function getCategories(): Promise<
  { slug: string; count: number }[]
> {
  const entries = await getPublishedPosts();
  const categoryCount = new Map<string, number>();

  for (const entry of entries) {
    const slug = entry.id.split("/")[0];
    categoryCount.set(slug, (categoryCount.get(slug) ?? 0) + 1);
  }

  return Array.from(categoryCount, ([slug, count]) => ({ slug, count })).sort(
    (a, b) => b.count - a.count,
  );
}

export async function getTags(): Promise<{ name: string; count: number }[]> {
  const entries = await getPublishedPosts();
  const tagCount = new Map<string, number>();

  for (const entry of entries) {
    for (const tag of entry.data.tags) {
      tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(tagCount, ([name, count]) => ({ name, count })).sort(
    (a, b) => b.count - a.count,
  );
}

export async function getRecentPosts(
  limit = 5,
): Promise<{ title: string; href: string; publishDate: Date }[]> {
  const entries = await getPublishedPosts();
  const recentEntries = entries.slice(0, limit);

  return recentEntries.map((entry) => ({
    title: entry.data.title,
    href: `/${entry.id}`,
    publishDate: entry.data.publishDate,
  }));
}
