import type { Root } from "mdast";
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

/**
 * Remark plugin to convert directive syntax to admonition HTML blocks
 */
export function remarkAdmonitions() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        // @ts-ignore: directive node has name property
        const name = node.name as string;
        const type = name.toLowerCase() as AdmonitionType;

        // Only process known admonition types
        if (!admonitionTypes[type]) {
          return;
        }

        const title =
          // @ts-ignore: directive node may have attributes
          node.attributes?.title || admonitionTypes[type];

        // Convert to HTML node
        const data = node.data || (node.data = {});
        const hName = "div";
        const hProperties = {
          class: `admonition admonition-${type}`,
        };

        data.hName = hName;
        data.hProperties = hProperties;

        // Insert title as first child
        // @ts-ignore: directive node has children property
        node.children = [
          {
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
          },
          // @ts-ignore: directive node has children property
          ...node.children,
        ];
      }
    });
  };
}
