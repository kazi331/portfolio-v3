import { slugifyFilename } from "@/lib/resume/filename";
import { renderResumePdf } from "@/lib/resume/pdf/render";
import { describeSchemaError, resumeSchema } from "@/lib/resume/resume-schema";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * POST /api/generate
 * Body: { resume: <resume JSON object> }
 * Returns the PDF as an attachment. Nothing is written to disk.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const resume = (body as { resume?: unknown } | null)?.resume;
  if (resume === undefined || resume === null || typeof resume !== "object") {
    return NextResponse.json({ error: "Missing required field: resume" }, { status: 400 });
  }

  const parsed = resumeSchema.safeParse(resume);
  if (!parsed.success) {
    return NextResponse.json({ error: describeSchemaError(parsed.error) }, { status: 400 });
  }

  const pdf = await renderResumePdf(parsed.data);
  const filename = slugifyFilename(parsed.data.title);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
