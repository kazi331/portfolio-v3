/**
 * CLI: builds a PDF from a resume profile.
 *
 *   npm run resume                 # full stack profile
 *   npm run resume -- frontend     # frontend profile
 */
import { slugifyFilename } from "@/lib/resume/filename";
import { renderResumePdf } from "@/lib/resume/pdf/render";
import { resumeSchema } from "@/lib/resume/resume-schema";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

async function main() {
  const profile = process.argv[2] ?? "fullstack";
  const file = path.join(process.cwd(), "data", `resume-data-${profile}.json`);
  const raw = JSON.parse(await readFile(file, "utf-8"));
  const data = resumeSchema.parse(raw);

  const filename = slugifyFilename(data.title);
  await writeFile(filename, await renderResumePdf(data));
  console.log(`${filename} written.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
