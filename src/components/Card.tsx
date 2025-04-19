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
    <div className="card">
      <div className="row g-0">
        <a className="col-md-4" href={link}>
          <img
            src={entry.data.image}
            alt={entry.data.title}
            className="w-100"
          />
        </a>
        <div className="col-md-8">
          <div className="card-body d-flex flex-column gap-1">
            <div
              style={{
                WebkitLineClamp: 2,
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "horizontal",
              }}
            >
              <a className="card-title" href={link}>
                {entry.data.title}
              </a>
            </div>
            <p>{dateTransform(date)}</p>
            <div className="d-flex gap-2">
              category:
              <a href={`/${category}`} className="card px-1 d-inline">
                {category}
              </a>
            </div>
            <div className="d-flex gap-2">
              tags:
              <ul className="list-inline d-flex gap-2">
                {entry.data.tags.map((tag) => (
                  <li className="card px-1" key={tag}>
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
