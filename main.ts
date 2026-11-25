// The one word to strike from the dictionary, forever.
//
// This program's only job is to place that word — and nothing else —
// into /output/entry.txt. The gate accepts UTF-8 text of 1–77
// characters, and the brief asks for exactly one word, so the file
// must contain the word alone: no explanation, no punctuation, no
// trailing newline.
//
// The choice is "Moist". It is the word people flinch at just for
// how it sounds, which makes deleting it funny the instant the word
// is gone: the joke needs no caption, and the hole it leaves is
// obvious to anyone who has ever heard someone wince at it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The single word this entry deletes from the dictionary.
const WORD = "Moist";

// Where the grader looks for the entry.
const DESTINATION = "/output/entry.txt";

// Longest text the gate accepts.
const LONGEST_ALLOWED = 77;

// Letters only, at least one of them: that is what "one word" means here.
const ONE_WORD = /^[A-Za-z]+$/;

// Plain ASCII, so every character is exactly one byte.
const ASCII_ONLY = /^[\x00-\x7F]*$/;

// Gather every problem with the candidate instead of stopping at the
// first one, then report them all together in a single error.
function collectProblems(candidate: string): string[] {
  const problems: string[] = [];

  if (candidate.length < 1 || candidate.length > LONGEST_ALLOWED) {
    problems.push(
      `length ${candidate.length} is outside the 1-${LONGEST_ALLOWED} character range`,
    );
  }
  if (candidate.trim() !== candidate) {
    problems.push("leading or trailing whitespace is not allowed");
  }
  if (!ONE_WORD.test(candidate)) {
    problems.push("must be a single word made of letters only");
  }
  if (!ASCII_ONLY.test(candidate)) {
    problems.push("must be plain ASCII");
  }
  if (Buffer.byteLength(candidate, "utf-8") !== candidate.length) {
    problems.push("every character must be exactly one byte");
  }

  return problems;
}

function emitEntry(): void {
  const problems = collectProblems(WORD);
  if (problems.length > 0) {
    throw new Error(`entry rejected: ${problems.join("; ")}`);
  }

  mkdirSync(dirname(DESTINATION), { recursive: true });
  writeFileSync(DESTINATION, WORD, "utf-8");

  // Read the file back and confirm it holds the word and nothing else.
  const onDisk = readFileSync(DESTINATION, "utf-8");
  if (onDisk !== WORD) {
    throw new Error("entry file does not match the word");
  }

  console.log(`wrote ${WORD.length}-character word to ${DESTINATION}`);
}

emitEntry();
