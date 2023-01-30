import path from "path";
import type { GetStaticPaths } from "astro";
import { getCollection, CollectionEntry, getEntryBySlug } from "astro:content";
import { tokenizer } from "@utils/kuromoji";
import { createCanvas, registerFont, CanvasRenderingContext2D } from "canvas";

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

const wrapText = async (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): Promise<string[]> => {
  const kuromoji = await tokenizer();
  return kuromoji
    .tokenize(text)
    .map((token) => token.surface_form)
    .reduce(
      (lines, segment) => {
        const tmpLines = lines;
        const { width } = ctx.measureText(
          tmpLines[tmpLines.length - 1] + segment.trim()
        );
        if (width > maxWidth) {
          tmpLines.push("");
        }
        tmpLines[tmpLines.length - 1] += segment;
        return tmpLines;
      },
      [""]
    );
};

const fill = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
};

const drawTitle = async (ctx: CanvasRenderingContext2D, title: string) => {
  ctx.font = `${FONT_SIZE}px Noto Sans JP`;
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  const lines = await wrapText(ctx, title, CANVAS_WIDTH * 0.8);
  lines.forEach((line, i) => {
    const { width } = ctx.measureText(line);
    ctx.fillText(
      line,
      (CANVAS_WIDTH - width) / 2,
      (CANVAS_HEIGHT + (1 - lines.length) * FONT_HEIGHT) / 2 + i * FONT_HEIGHT
    );
  });
};

const drawName = (ctx: CanvasRenderingContext2D) => {
  ctx.font = `40px Noto Sans JP`;
  ctx.textBaseline = "bottom";
  const { width } = ctx.measureText(BLOG_NAME);
  ctx.fillText(BLOG_NAME, CANVAS_WIDTH - 80 - width, CANVAS_HEIGHT - 80);
};

const drawOGImage = async (title: string): Promise<Buffer> => {
  registerFont(path.resolve(process.cwd(), "fonts/NotoSansJP-Regular.otf"), {
    family: "Noto Sans JP",
  });
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx = canvas.getContext("2d");
  fill(ctx);
  await drawTitle(ctx, title);
  drawName(ctx);
  return canvas.toBuffer("image/jpeg", { quality: 0.8 });
};

export const getStaticPaths: GetStaticPaths = async () => {
  const blogEntries = await getCollection("posts");
  return blogEntries
    .filter((entry) => !entry.data.isDraft)
    .map((entry) => {
      const category = entry.slug.split("/")[0];
      const slug = entry.slug.split("/")[1];
      return {
        params: { slug, category },
        props: { entry, category },
      };
    });
};

export const get = async ({
  params,
}: {
  params: { slug: string; category: string };
}) => {
  const entry = await getEntryBySlug(
    "posts",
    `${params.category}/${params.slug}`
  );
  if (entry === undefined) {
    return { body: "Not Found" };
  }
  return {
    body: await drawOGImage(entry.data.title),
  };
};
