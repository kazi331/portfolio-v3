import { isProfileKey, loadProfileText } from "@/lib/resume/profiles";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** GET /api/profile/:profile -> the profile's resume JSON. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ profile: string }> },
) {
  const { profile } = await params;
  if (!isProfileKey(profile)) {
    return NextResponse.json({ error: "Unknown or invalid resume profile." }, { status: 404 });
  }
  try {
    return NextResponse.json(JSON.parse(await loadProfileText(profile)));
  } catch {
    return NextResponse.json({ error: "Unknown or invalid resume profile." }, { status: 404 });
  }
}
