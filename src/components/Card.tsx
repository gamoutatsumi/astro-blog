import type { CollectionEntry } from "astro:content";
import { dateTransform } from "@utils/dateTransform";

type CardProps = {
  entry: CollectionEntry<"posts">;
};
export const Card = ({ entry }: CardProps) => {
  const date = entry.data.publishDate;
  const link = `/${entry.slug}`;
  const category = entry.slug.split("/")[0];
  return (
    <div className="shadow-md rounded-md">
      <div className="flex flex-wrap gap-0">
        <a className="md:w-1/3" href={link}>
          <img
            src={entry.data.image}
            alt={entry.data.title}
            className="w-100"
          />
        </a>
        <div className="md:w-2/3">
          <div className="p-4 flex flex-col gap-4">
            <div
              style={{
                WebkitLineClamp: 2,
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "horizontal",
              }}
            >
              <a className="font-bold text-lg" href={link}>
                {entry.data.title}
              </a>
            </div>
            <p>{dateTransform(date)}</p>
            <div className="flex gap-2">
              category:
              <a href={`/${category}`} className="shadow-sm px-2 inline-block">
                {category}
              </a>
            </div>
            <div className="d-flex gap-2">
              tags:
              <ul className="list-none flex gap-2">
                {entry.data.tags.map((tag) => (
                  <li className="shadow-sm px-1" key={tag}>
                    <a href={`/tags/${tag}`}>{tag}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div
              style={{
                WebkitLineClamp: 3,
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
              }}
            >
              <p>{entry.body}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
