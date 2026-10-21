import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const submissionsDir = process.env.SUBMISSIONS_DIR
  ? path.resolve(process.env.SUBMISSIONS_DIR)
  : path.join(here, "..", "data", "submissions");

export async function saveSubmission(submission) {
  await mkdir(submissionsDir, { recursive: true });
  await appendFile(
    path.join(submissionsDir, "submissions.jsonl"),
    `${JSON.stringify(submission)}\n`,
    "utf8"
  );
}
