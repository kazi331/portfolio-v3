
import { ResumeBuilder } from "@/components/resume/ResumeBuilder";
import { DEFAULT_PROFILE, loadProfileText, PROFILE_OPTIONS } from "@/lib/resume/profiles";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./resume.css";

export const resumeFont = Inter({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-resume",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resume PDF Generator",
  description: "Edit resume JSON, preview it live, and download a polished PDF.",
};

// Read the JSON files on every request so edits in /data show up on refresh.
export const dynamic = "force-dynamic";

export default async function Page() {
  const initialJson = JSON.stringify(JSON.parse(await loadProfileText(DEFAULT_PROFILE)), null, 2);

  return (
    <div className={`${resumeFont.variable} shell`}>
      <ResumeBuilder
        profiles={PROFILE_OPTIONS}
        initialProfile={DEFAULT_PROFILE}
        initialJson={initialJson}
      />
    </div>
  );
}
