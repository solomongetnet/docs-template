import { tokenizeBash } from "./src/lib/rehype-bash-theme.ts";
const samples = [
  `bun add lumen-docs @lumen/core`,
  `bunx lumen init`,
  `bun run dev`,
  `npm install --save-dev typescript`,
  `echo "hello world" && cd ./src || exit 1`,
  `curl -L https://example.com | grep foo # fetch`,
  `export PATH="$HOME/.local/bin:$PATH"`,
];
for (const s of samples) {
  console.log(`\n--- ${s} ---`);
  const tokens = tokenizeBash(s);
  for (const t of tokens) {
    if (t.type !== "text" || !/^\s+$/.test(t.value)) {
      process.stdout.write(`[${t.type}:"${t.value}"] `);
    }
  }
}
