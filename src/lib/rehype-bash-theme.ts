import type { Root, Element, Text } from "hast";
import { visit } from "unist-util-visit";

type TokenType =
  | "comment"
  | "string"
  | "variable"
  | "operator"
  | "flag"
  | "path"
  | "number"
  | "command"
  | "keyword"
  | "builtin"
  | "text";

interface Token {
  type: TokenType;
  value: string;
}

const SHELL_KEYWORDS = new Set([
  "if", "then", "else", "elif", "fi", "for", "while", "until", "do", "done",
  "case", "esac", "in", "function", "return", "exit", "export", "source",
  "alias", "unset", "local", "declare", "readonly", "eval", "exec", "shift",
  "continue", "break", "wait", "trap", "umask", "set", "shopt", "enable",
]);

const SHELL_BUILTINS = new Set([
  "cd", "ls", "cat", "echo", "printf", "read", "mkdir", "rm", "cp", "mv",
  "touch", "chmod", "chown", "find", "grep", "sed", "awk", "sort", "uniq",
  "wc", "head", "tail", "less", "more", "tar", "zip", "unzip", "curl", "wget",
  "ssh", "scp", "rsync", "git", "docker", "kubectl", "make", "python", "python3",
  "node", "npx", "bunx", "bun", "npm", "pnpm", "yarn", "vim", "nvim", "code",
]);

const PACKAGE_SUBCOMMANDS = new Set([
  "add", "install", "remove", "uninstall", "run", "build", "deploy", "init",
  "create", "dev", "start", "test", "lint", "format", "preview", "exec",
  "update", "upgrade", "publish", "login", "logout", "whoami", "cache",
  "config", "dlx", "outdated", "fund", "info", "search", "link", "unlink",
]);

const COMMAND_RUNNERS = new Set(["bun", "bunx", "npx", "npm", "pnpm", "yarn", "node"]);

function isCommandPosition(value: string, before: string): boolean {
  if (SHELL_BUILTINS.has(value) || SHELL_KEYWORDS.has(value)) return true;
  const trimmed = before.replace(/\s+/g, " ");
  const parts = trimmed.trim().split(" ");
  const lastSignificant = parts.pop()?.trim() ?? "";
  const secondLast = parts.pop()?.trim() ?? "";
  // After common runners the next word is a command/script (e.g. bunx wrangler)
  if (COMMAND_RUNNERS.has(lastSignificant) || COMMAND_RUNNERS.has(secondLast + " " + lastSignificant)) return true;
  const commandStarters = new Set(["", ";", "|", "&&", "||", "(", "{", "`", "$", "then", "do", "else", "elif"]);
  return commandStarters.has(lastSignificant);
}

function tokenizeBash(source: string): Token[] {
  const tokens: Token[] = [];
  const push = (type: TokenType, value: string) => {
    if (value.length === 0) return;
    if (tokens.length > 0 && tokens[tokens.length - 1].type === type) {
      tokens[tokens.length - 1].value += value;
    } else {
      tokens.push({ type, value });
    }
  };

  let i = 0;
  while (i < source.length) {
    const rest = source.slice(i);

    // Comments
    const commentMatch = rest.match(/^#[^\n]*/);
    if (commentMatch) {
      push("comment", commentMatch[0]);
      i += commentMatch[0].length;
      continue;
    }

    // Double-quoted strings (including simple interpolations inside)
    const dquoteMatch = rest.match(/^"(?:[^"\\]|\\.)*"/);
    if (dquoteMatch) {
      push("string", dquoteMatch[0]);
      i += dquoteMatch[0].length;
      continue;
    }

    // Single-quoted strings
    const squoteMatch = rest.match(/^'(?:[^'\\]|\\.)*'/);
    if (squoteMatch) {
      push("string", squoteMatch[0]);
      i += squoteMatch[0].length;
      continue;
    }

    // Variables ${...} or $VAR
    const varMatch = rest.match(/^\$\{[^}]*\}|^\$[A-Za-z_][A-Za-z0-9_]*/);
    if (varMatch) {
      push("variable", varMatch[0]);
      i += varMatch[0].length;
      continue;
    }

    // Operators
    const opMatch = rest.match(/^(&&|\|\||<<|>>|&\||\|&|>=|<=|[|&;<>(){}`])/);
    if (opMatch) {
      push("operator", opMatch[0]);
      i += opMatch[0].length;
      continue;
    }

    // Long flags --name or short flags -x (but not negative numbers)
    const flagMatch = rest.match(/^--[A-Za-z0-9_-]+|^-[^0-9\s]/);
    if (flagMatch) {
      push("flag", flagMatch[0]);
      i += flagMatch[0].length;
      continue;
    }

    // Paths /abs ./rel ../rel ~/home
    const pathMatch = rest.match(/^(~\/|\.{1,2}\/|\/[A-Za-z0-9_.\-/~]+)/);
    if (pathMatch) {
      push("path", pathMatch[0]);
      i += pathMatch[0].length;
      continue;
    }

    // Numbers
    const numMatch = rest.match(/^[0-9]+(\.[0-9]+)?/);
    if (numMatch) {
      push("number", numMatch[0]);
      i += numMatch[0].length;
      continue;
    }

    // Word / identifier
    const wordMatch = rest.match(/^[A-Za-z0-9_./@:-]+/);
    if (wordMatch) {
      const word = wordMatch[0];
      const before = source.slice(0, i);
      if (SHELL_KEYWORDS.has(word)) {
        push("keyword", word);
      } else if (PACKAGE_SUBCOMMANDS.has(word)) {
        push("keyword", word);
      } else if (isCommandPosition(word, before)) {
        push("command", word);
      } else {
        push("text", word);
      }
      i += word.length;
      continue;
    }

    // Whitespace and unmatched punctuation
    const wsMatch = rest.match(/^\s+/);
    if (wsMatch) {
      push("text", wsMatch[0]);
      i += wsMatch[0].length;
      continue;
    }

    // Any other single character
    push("text", rest[0]);
    i += 1;
  }

  return tokens;
}

function tokenToElement(token: Token): Element {
  return {
    type: "element",
    tagName: "span",
    properties: { className: [`bash-${token.type}`] },
    children: [{ type: "text", value: token.value }],
  };
}

export function rehypeBashTheme() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "code") return;
      const cls = String(node.properties?.className ?? "");
      const isShell = /language-(bash|shell|sh|zsh)\b/.test(cls);
      if (!isShell) return;

      const children: (Element | Text)[] = [];
      for (const child of node.children) {
        if (child.type === "text") {
          const tokens = tokenizeBash(child.value);
          children.push(...tokens.map(tokenToElement));
        } else {
          children.push(child as Element | Text);
        }
      }
      node.children = children;
    });
  };
}
