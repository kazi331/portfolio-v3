import type { Resume } from "@/lib/resume/resume-schema";
import { renderToBuffer } from "@react-pdf/renderer";
import { registerFonts } from "./fonts";
import { ResumeDocument } from "./ResumeDocument";

/** Renders resume data to PDF bytes. */
export async function renderResumePdf(data: Resume): Promise<Buffer> {
  registerFonts();
  return renderToBuffer(<ResumeDocument data={data} />);
}
