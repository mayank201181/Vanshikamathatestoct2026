// Usage: node scripts/typecheck-file.mjs <file.ts|tsx> [...more]
// Type-checks only the given files (and what they import) with the project's
// compiler options. Much faster than a full build and safe to run in parallel.
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const files = process.argv.slice(2).map((f) => path.resolve(f));
if (!files.length) {
  console.error("Usage: node scripts/typecheck-file.mjs <file> [...]");
  process.exit(2);
}
const dir = mkdtempSync(path.join(os.tmpdir(), "tc-"));
const cfg = path.join(dir, "tsconfig.json");
writeFileSync(
  cfg,
  JSON.stringify({
    extends: path.join(root, "tsconfig.json"),
    compilerOptions: { incremental: false, noEmit: true, baseUrl: root, plugins: [], typeRoots: [path.join(root, "node_modules", "@types")] },
    files,
    include: [],
  }),
);
try {
  execFileSync(path.join(root, "node_modules", ".bin", "tsc"), ["-p", cfg], { stdio: "inherit", cwd: root });
  console.log("Type check OK");
} catch {
  process.exitCode = 1;
} finally {
  rmSync(dir, { recursive: true, force: true });
}
