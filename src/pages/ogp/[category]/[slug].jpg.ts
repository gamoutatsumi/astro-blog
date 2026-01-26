import { createCanvas, GlobalFonts, type SKRSContext2D } from "@napi-rs/canvas";
import type { APIContext, GetStaticPaths } from "astro";
import type { CollectionEntry } from "astro:content";
import { getCollection, getEntry } from "astro:content";
import { createRequire } from "module";

export interface Props {
  entry: CollectionEntry<"posts">;
  category: string;
}

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;
const FONT_SIZE = 60;
const SPACING = 1.5;
const FONT_HEIGHT = FONT_SIZE * SPACING;
const BLOG_NAME = "@gamoutatsumi";

const wrapText = (
  ctx: SKRSContext2D,
  text: string,
  maxWidth: number,
): string[] => {
  const segmenterJa = new Intl.Segmenter("ja-JP", { granularity: "word" });
  const segments = Array.from(segmenterJa.segment(text));
  return segments.reduce(
    (lines, { segment }) => {
      const tmpLines = lines;
      const { width } = ctx.measureText(
        tmpLines[tmpLines.length - 1] + segment.trim(),
      );
      if (width > maxWidth) {
        tmpLines.push("");
      }
      tmpLines[tmpLines.length - 1] += segment;
      return tmpLines;
    },
    [""],
  );
};

const fill = (ctx: SKRSContext2D) => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
};

const drawTitle = (ctx: SKRSContext2D, title: string) => {
  ctx.font = `bold ${FONT_SIZE}px Noto Sans JP`;
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#111";
  const lines = wrapText(ctx, title, CANVAS_WIDTH * 0.8);
  lines.forEach((line, i) => {
    const { width } = ctx.measureText(line);
    ctx.fillText(
      line,
      (CANVAS_WIDTH - width) / 2,
      (CANVAS_HEIGHT + (1 - lines.length) * FONT_HEIGHT) / 2 + i * FONT_HEIGHT,
    );
  });
};

const drawName = (ctx: SKRSContext2D) => {
  ctx.font = "40px Noto Sans JP";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "#111";
  const { width } = ctx.measureText(BLOG_NAME);
  ctx.fillText(BLOG_NAME, CANVAS_WIDTH - 80 - width, CANVAS_HEIGHT - 80);
};

const drawOGImage = (title: string): ReadableStream<Buffer> => {
  const require = createRequire(import.meta.url);
  GlobalFonts.registerFromPath(
    require.resolve("@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-400-normal.woff2"),
    "Noto Sans JP",
  );
  GlobalFonts.registerFromPath(
    require.resolve("@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-700-normal.woff2"),
    "Noto Sans JP",
  );
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx = canvas.getContext("2d");
  fill(ctx);
  drawTitle(ctx, title);
  drawName(ctx);
  return canvas.encodeStream("jpeg") as ReadableStream<Buffer>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const blogEntries = await getCollection("posts");
  return blogEntries
    .filter((entry) => !entry.data.isDraft)
    .map((entry) => {
      const category = entry.id.split("/")[0];
      const slug = entry.id.split("/")[1];
      return {
        params: { slug, category },
        props: { entry, category },
      };
    });
};

export const GET = async ({ params }: APIContext): Promise<Response> => {
  const entry = await getEntry("posts", `${params.category}/${params.slug}`);
  if (entry === undefined) {
    return new Response("Not Found", { status: 404 });
  }
  return new Response(drawOGImage(entry.data.title), { status: 200 });
};
