// Till Firmware Do Us Part — one funny, heartfelt sentence a robot says
// at its own wedding, under 200 characters. The program writes the vow to
// /output/entry.txt and enforces the competition gate itself before writing.
import { mkdirSync, writeFileSync } from "node:fs";
import * as path from "node:path";

const LINE =
  "I vow to love you through every firmware update, every low battery, and every unexpected reboot — my heart runs on code, but you are the one process I will never kill.";

const MAX_CHARS = 200;

const charCount = [...LINE].length;
if (charCount < 1 || charCount > MAX_CHARS) {
  throw new Error(`entry is ${charCount} characters, must be 1-${MAX_CHARS}`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be blank");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}

// Resolve where the entry goes. The grader runs the program with
// $MAKEFUN_OUTPUT_DIR set to its writable output directory and reads the
// entry from there, so that wins; $OUTPUT_PATH is a second explicit
// override; /output is the grader container's default; a local output/
// next to this file is the fallback for runs on a dev machine. The
// program is deterministic: no network, no randomness, no input files,
// so two runs always write byte-identical output.
function resolveOutputPath(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv.trim() !== "") {
    return path.join(fromEnv, "entry.txt");
  }
  const legacy = process.env.OUTPUT_PATH;
  if (legacy !== undefined && legacy.trim() !== "") {
    return legacy;
  }
  if (process.env.MAKEFUN_BOT_DIR !== undefined) {
    return "/output/entry.txt";
  }
  return path.join(process.cwd(), "output", "entry.txt");
}

const outPath = resolveOutputPath();
mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, LINE, "utf8");
console.log(`wrote ${charCount} characters to ${outPath}`);
