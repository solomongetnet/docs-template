import type { Root, Element, Text } from "hast";
import { visit } from "unist-util-visit";

const ALERT_TYPES = new Set(["note", "tip", "warning", "caution", "important", "danger"]);

/**
 * Detects GitHub-style blockquote alerts:
 *   > [!NOTE]
 *   > [!TIP]
 *   > [!WARNING]
 *   > [!CAUTION]
 *   > [!IMPORTANT]
 *
 * Sets `data-type` on the <blockquote> element so CSS variants can style them.
 */
export function rehypeBlockquoteAlerts() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "blockquote") return;

      // Find the first <p> child
      const firstP = node.children.find(
        (c): c is Element => c.type === "element" && (c as Element).tagName === "p"
      );
      if (!firstP) return;

      // Get the raw text of the first paragraph
      const firstTextNode = firstP.children.find((c): c is Text => c.type === "text");
      if (!firstTextNode) return;

      const match = firstTextNode.value.match(/^\[!([\w]+)\]\s*/);
      if (!match) return;

      const type = match[1].toLowerCase();
      if (!ALERT_TYPES.has(type)) return;

      // Stamp data-type on the blockquote
      node.properties = { ...node.properties, "data-type": type };

      // Remove the "[!TYPE]" prefix text so it doesn't render raw
      firstTextNode.value = firstTextNode.value.slice(match[0].length);

      // If the first paragraph is now empty, remove it
      const isEmpty = firstP.children.every(
        (c) => (c.type === "text" && (c as Text).value.trim() === "") || false
      );
      if (isEmpty) {
        node.children = node.children.filter((c) => c !== firstP);
      }
    });
  };
}
