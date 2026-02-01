import type { PhrasingContent, Root } from "mdast";
import type { Directives, LeafDirective } from "mdast-util-directive";
import type { Node } from "unist";
import { visit } from "unist-util-visit";

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

function getXLabelText(
  children: PhrasingContent[] | undefined,
): string | undefined {
  const textNode = children?.find((child) => child.type === "text");
  return textNode && "value" in textNode ? textNode.value : undefined;
}

/**
 * Parse the label in format "username/postId" from the first text child.
 */
function parseXLabel(
  children: PhrasingContent[] | undefined,
): { username: string; postId: string } | null {
  const label = getXLabelText(children);
  if (!label) {
    return null;
  }

  const match = label.match(/^([a-zA-Z0-9_]+)\/(\d+)$/);
  if (!match) {
    return null;
  }

  return {
    username: match[1],
    postId: match[2],
  };
}

/**
 * Create the link node for inside the blockquote
 */
function createLinkNode(username: string, postId: string): PhrasingContent {
  return {
    type: "link",
    url: `https://twitter.com/${username}/status/${postId}`,
    data: {
      hName: "a",
      hProperties: {
        href: `https://twitter.com/${username}/status/${postId}`,
      },
    },
    children: [],
  };
}

/**
 * Remark plugin to convert ::x[username/postId] directive to X/Twitter embed HTML
 *
 * Usage: ::x[gamoutatsumi/2017436349163610484]
 *
 * Generates:
 * <blockquote class="twitter-tweet">
 *   <a href="https://twitter.com/gamoutatsumi/status/2017436349163610484"></a>
 * </blockquote>
 * <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
 */
export function remarkXEmbed() {
  return (tree: Root) => {
    let hasEmbed = false;

    visit(tree, (node) => {
      if (!isDirective(node)) {
        return;
      }

      // Only process leaf directives named "x"
      if (node.type !== "leafDirective" || node.name !== "x") {
        return;
      }

      const label = getXLabelText(node.children);
      const parsed = parseXLabel(node.children);
      if (!parsed) {
        console.warn(
          `[xEmbed] Invalid X embed format: ${label}. Expected format: username/postId`,
        );
        return;
      }

      const { username, postId } = parsed;
      hasEmbed = true;

      // Convert the directive node to a blockquote with proper structure
      const data = node.data || (node.data = {});
      data.hName = "blockquote";
      data.hProperties = {
        class: "twitter-tweet",
      };

      // Replace children with just the link
      (node as LeafDirective).children = [createLinkNode(username, postId)];
    });

    // Append widgets.js script once at the end if embeds exist
    if (hasEmbed) {
      tree.children.push({
        type: "html",
        value:
          '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
      });
    }
  };
}
