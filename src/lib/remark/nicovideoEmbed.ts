import type { Html, PhrasingContent, Root } from "mdast";
import type { Directives } from "mdast-util-directive";
import type { Node, Parent } from "unist";
import { SKIP, visit } from "unist-util-visit";

const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 360;

/**
 * Type guard to check if a node is a directive
 */
function isDirective(node: Node): node is Directives {
  return (
    node.type === "containerDirective" ||
    node.type === "leafDirective" ||
    node.type === "textDirective"
  );
}

function getVideoId(
  children: PhrasingContent[] | undefined,
): string | undefined {
  const textNode = children?.find((child) => child.type === "text");
  return textNode && "value" in textNode ? textNode.value.trim() : undefined;
}

function parseDimension(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return fallback;
}

/**
 * Validate video ID format.
 */
function isValidVideoId(videoId: string): boolean {
  return /^(sm|nm|so|ca|ax|yo|nl|ig|na|cw|za|zb|zc|zd|ze)\d+$/i.test(videoId);
}

/**
 * Remark plugin to convert ::nicovideo[videoId] directive to embed HTML.
 */
export function remarkNicovideoEmbed() {
  return (tree: Root) => {
    visit(tree, (node, index, parent) => {
      if (!isDirective(node)) {
        return;
      }

      if (node.type !== "leafDirective" || node.name !== "nicovideo") {
        return;
      }

      if (typeof index !== "number" || !parent) {
        return;
      }

      const videoId = getVideoId(node.children);
      if (!videoId || !isValidVideoId(videoId)) {
        console.warn(`[nicovideoEmbed] Invalid NicoVideo ID: ${videoId ?? ""}`);
        return;
      }

      const width = parseDimension(node.attributes?.width, DEFAULT_WIDTH);
      const height = parseDimension(node.attributes?.height, DEFAULT_HEIGHT);
      const paddingBottom = (height / width) * 100;

      const embedUrl = `https://embed.nicovideo.jp/watch/${videoId}?oldScript=1&referer=&from=0&allowProgrammaticFullScreen=1`;
      const watchUrl = `https://www.nicovideo.jp/watch/${videoId}`;

      const html = [
        `<div class="nicovideo-embed" style="position: relative; width: 100%; height: 0; padding-bottom: ${paddingBottom.toFixed(6)}%;">`,
        `  <iframe src="${embedUrl}" width="${width}" height="${height}" allowfullscreen allow="autoplay; fullscreen" loading="lazy" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"></iframe>`,
        `  <noscript><a href="${watchUrl}">View on NicoVideo</a></noscript>`,
        `</div>`,
      ].join("\n");

      const htmlNode: Html = {
        type: "html",
        value: html,
      };
      (parent as Parent).children[index] = htmlNode;

      return SKIP;
    });
  };
}
