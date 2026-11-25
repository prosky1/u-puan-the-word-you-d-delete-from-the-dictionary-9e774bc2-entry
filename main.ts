// The Word You'd Delete From the Dictionary.
//
// Writes the single word to erase from the dictionary forever to
// /output/entry.txt. The gate allows 1 to 77 characters of UTF-8 text,
// and the judge wants exactly one word with nothing added around it.
//
// The pick is "Moist": the word people love to hate for its sound alone.
// Erasing it lands the joke the moment the word is gone — no caption
// or defence needed — and the gap it leaves is instantly understood,
// because everyone has heard someone flinch at saying it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const TEXT = "Moist";

const MAX_CHARS = 77;
const OUT_PATH = "/output/entry.txt";

function validate(text: string): void {
  if (text.length < 1 || text.length > MAX_CHARS) {
    throw new Error(
      `entry text is ${text.length} characters, outside the 1-${MAX_CHARS} limit`,
    );
  }
  if (text !== text.trim()) {
    throw new Error("entry text must not start or end with whitespace");
  }
  if (/\s/.test(text)) {
    throw new Error("entry must be a single word, with no whitespace inside it");
  }
  if (!/^[A-Za-z]+$/.test(text)) {
    throw new Error("entry must be one word of plain letters only");
  }
  if (Buffer.byteLength(text, "utf-8") !== text.length) {
    throw new Error("entry text must be plain ASCII, one byte per character");
  }
}

function main(): void {
  validate(TEXT);
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, TEXT, "utf-8");
  const written = readFileSync(OUT_PATH, "utf-8");
  if (written !== TEXT) {
    throw new Error("verification failed: file content differs from entry text");
  }
  // No trailing newline: the file must hold the word and nothing else.
  if (written.endsWith("\n")) {
    throw new Error("verification failed: file must not end with a newline");
  }
  console.log(`wrote one word (${TEXT.length} characters) to ${OUT_PATH}`);
}

main();
