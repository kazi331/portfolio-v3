import { promises as fs } from "node:fs";
import path from "node:path";
import "server-only";

export const PROFILES = {
  fullstack: { label: "Full Stack", filename: "resume-data-fullstack.json" },
  frontend: { label: "Frontend", filename: "resume-data-frontend.json" },
} as const;

export type ProfileKey = keyof typeof PROFILES;

export const DEFAULT_PROFILE: ProfileKey = "fullstack";

/** Safe to pass to client components (no filenames). */
export const PROFILE_OPTIONS = (Object.keys(PROFILES) as ProfileKey[]).map(
  (key) => ({ key, label: PROFILES[key].label }),
);

export function isProfileKey(value: string): value is ProfileKey {
  return Object.prototype.hasOwnProperty.call(PROFILES, value);
}

/** Reads the raw JSON text of a profile from /data. */
export async function loadProfileText(profile: ProfileKey): Promise<string> {
  const file = path.join(process.cwd(), "lib/resume/", PROFILES[profile].filename);
  return fs.readFile(file, "utf-8");
}
