import type { BlockContent, Image, PhrasingContent, Root } from "mdast";
import type { Node, Parent } from "unist";
import { SKIP, visit } from "unist-util-visit";

function createImgNode(node: Image): Image {
  return {
    type: "image",
    url: node.url,
    alt: node.alt,
    data: {
      ...(node.data ?? {}),
      hName: "img",
      hProperties: {
        ...(node.data?.hProperties ?? {}),
        loading: "lazy",
      },
    },
  };
}

function createFigcaptionNode(title: string): PhrasingContent {
  return {
    type: "emphasis",
    data: {
      hName: "figcaption",
      hProperties: {
        class: "figcaption",
      },
    },
    children: [
      {
        type: "text",
        value: title,
      },
    ],
  };
}

/**
 * Remark plugin to wrap images with title text into figure/figcaption.
 */
export function remarkFigure() {
  return (tree: Root) => {
    visit(tree, "image", (node, index, parent) => {
      if (!node.title || index === null || !parent) {
        return;
      }

      if (!("children" in parent) || !Array.isArray(parent.children)) {
        return;
      }

      const figureNode: BlockContent = {
        type: "paragraph",
        data: {
          hName: "figure",
          hProperties: {
            class: "figure",
          },
        },
        children: [createImgNode(node), createFigcaptionNode(node.title)],
      };

      const safeIndex = index as number;
      (parent as Parent).children[safeIndex] = figureNode as Node;
      return SKIP;
    });
  };
}
