import type { BlockContent, PhrasingContent, Root } from "mdast";
import type {
  ContainerDirective,
  Directives,
  LeafDirective,
  TextDirective,
} from "mdast-util-directive";
import type { Node } from "unist";
import { visit } from "unist-util-visit";

const admonitionTypes = {
  note: "Note",
  tip: "Tip",
  info: "Info",
  warning: "Warning",
  danger: "Danger",
  message: "Message",
};

type AdmonitionType = keyof typeof admonitionTypes;

function isDirective(node: Node): node is Directives {
  return (
    node.type === "containerDirective" ||
    node.type === "leafDirective" ||
    node.type === "textDirective"
  );
}

function prependContainerTitle(node: ContainerDirective, title: string) {
  const titleNode = {
    type: "paragraph",
    data: {
      hName: "div",
      hProperties: {
        class: "admonition-title",
      },
    },
    children: [
      {
        type: "text",
        value: title,
      },
    ],
  } satisfies BlockContent;

  node.children = [titleNode, ...node.children];
}

function prependPhrasingTitle(
  node: LeafDirective | TextDirective,
  title: string,
) {
  const titleNode = {
    type: "strong",
    data: {
      hName: "span",
      hProperties: {
        class: "admonition-title",
      },
    },
    children: [
      {
        type: "text",
        value: title,
      },
    ],
  } satisfies PhrasingContent;

  node.children = [titleNode, ...node.children];
}

/**
 * Remark plugin to convert directive syntax to admonition HTML blocks
 */
export function remarkAdmonitions() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (!isDirective(node)) {
        return;
      }
      const name = node.name;
      const type = name.toLowerCase() as AdmonitionType;

      // Only process known admonition types
      if (!admonitionTypes[type]) {
        return;
      }

      const title = node.attributes?.title || admonitionTypes[type];

      // Convert to HTML node
      const data = node.data || (node.data = {});
      const hName = "div";
      const hProperties = {
        class: `admonition admonition-${type}`,
      };

      data.hName = hName;
      data.hProperties = hProperties;

      // Insert title as first child
      if (node.type === "containerDirective") {
        prependContainerTitle(node, title);
      } else {
        prependPhrasingTitle(node, title);
      }
    });
  };
}
