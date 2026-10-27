import { slugifyFilename } from "@/lib/resume/filename";
import { renderResumePdf } from "@/lib/resume/pdf/render";
import { DEFAULT_PROFILE, loadProfileText } from "@/lib/resume/profiles";
import { describeSchemaError, resumeSchema } from "@/lib/resume/resume-schema";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /download -> the default (full stack) resume as a PDF. */
export async function GET() {
  try {
    const parsed = resumeSchema.safeParse(JSON.parse(await loadProfileText(DEFAULT_PROFILE)));
    if (!parsed.success) {
      return NextResponse.json(
        { error: `Unable to generate resume: ${describeSchemaError(parsed.error)}` },
        { status: 500 },
      );
    }
    const pdf = await renderResumePdf(parsed.data);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${slugifyFilename(parsed.data.title)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Unable to generate resume: ${message}` }, { status: 500 });
  }
}
