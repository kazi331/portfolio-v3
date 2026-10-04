import { z } from "zod";

const link = z.object({ text: z.string(), url: z.string() });

export const resumeSchema = z.object({
  name: z.string(),
  title: z.string(),
  location: z.string(),
  phone: z.string(),
  email: z.string(),
  links: z.array(link),
  summary: z.string(),
  skills: z.array(z.object({ label: z.string(), value: z.string() })),
  experience: z.array(
    z.object({
      title: z.string(),
      dates: z.string(),
      company: z.string(),
      companyLink: link.nullish(),
      bullets: z.array(z.string()),
    }),
  ),
  projects: z.array(
    z.object({
      title: z.string(),
      highlights: z.array(z.string()),
      stack: z.string(),
      link: z.string().nullish(),
    }),
  ),
  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string(),
        completedDate: z.string(),
        url: z.string().nullish(),
      }),
    )
    .default([]),
  education: z.array(z.object({ degree: z.string(), school: z.string() })),
  languages: z.string(),
});

export type Resume = z.infer<typeof resumeSchema>;

/** Turns a zod error into a short, human-readable message for the UI. */
export function describeSchemaError(error: z.ZodError): string {
  const issue = error.issues[0];
  const path = issue.path.join(".");
  if (issue.code === "invalid_type" && issue.expected === "undefined") {
    return `Missing required field: ${path}`;
  }
  return path ? `${path}: ${issue.message}` : issue.message;
}
