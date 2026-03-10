import fs from "fs";

const lines = fs
  .readFileSync("siggy_ritual_training_dataset_20000.jsonl", "utf8")
  .split("\n");

const parsed = lines.filter(Boolean).map((l) => JSON.parse(l));

const seen = new Set();
const unique = [];

parsed.forEach((d) => {
  // Skip system messages, only get user + assistant
  const user = d.messages.find((m) => m.role === "user");
  const assistant = d.messages.find((m) => m.role === "assistant");

  if (!user || !assistant) return;

  // Deduplicate by user question
  if (seen.has(user.content)) return;
  seen.add(user.content);

  unique.push({ q: user.content, a: assistant.content });
});

// Filter out low quality answers
const quality = unique.filter((d) => d.a.length > 20).slice(0, 100);


const output = quality.map((d) => `Q: ${d.q}\nA: ${d.a}`).join("\n");

fs.writeFileSync("siggy_knowledge.txt", output);
console.log(`Total lines: ${parsed.length}`);
console.log(`Unique pairs: ${unique.length}`);
console.log(`Quality pairs: ${quality.length}`);
console.log(`✅ Saved to siggy_knowledge.txt`);
