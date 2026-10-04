import { linkLabel } from "@/lib/resume/filename";
import { Resume } from "@/lib/resume/resume-schema";
import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { PDF_FONT } from "./fonts";

// ---------- Layout settings (same values as the original reportlab version) ----------
const NAVY = "#1F2D3D";
const GRAY = "#3A3A3A";

// Margins were defined in twips (1440 per inch); react-pdf uses points (72 per inch).
const twipsToPt = (twips: number) => (twips / 1440) * 72;

const s = StyleSheet.create({
  page: {
    fontFamily: PDF_FONT,
    fontSize: 9,
    color: GRAY,
    paddingTop: twipsToPt(460),
    paddingBottom: twipsToPt(420),
    paddingLeft: twipsToPt(620),
    paddingRight: twipsToPt(620),
  },
  name: { fontSize: 18, fontWeight: 700, color: NAVY, lineHeight: 1.15, marginBottom: 1 },
  title: { fontSize: 10.5, fontWeight: 700, lineHeight: 1.2, marginTop: 2, marginBottom: 3 },
  contact: { fontSize: 8.5, lineHeight: 1.2, marginBottom: 4.5 },
  sectionHeading: {
    fontSize: 9.5,
    fontWeight: 700,
    color: NAVY,
    lineHeight: 1.15,
    marginTop: 6.5,
    marginBottom: 2.5,
  },
  rule: { borderBottomWidth: 0.75, borderBottomColor: NAVY, marginBottom: 3 },
  body: { fontSize: 9, lineHeight: 1.25 },
  bold: { fontWeight: 700 },
  navyBold: { fontWeight: 700, color: NAVY },
  jobRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: 4.5 },
  jobTitle: { fontSize: 9.5, fontWeight: 700, color: NAVY, lineHeight: 1.15 },
  jobDates: { fontSize: 8.5, fontWeight: 700, lineHeight: 1.15, textAlign: "right" },
  company: { fontSize: 8.5, fontStyle: "italic", lineHeight: 1.2, marginBottom: 1.5 },
  bulletRow: { flexDirection: "row", marginBottom: 1 },
  bulletMark: { width: 12, fontSize: 9, lineHeight: 1.25 },
  bulletText: { flex: 1, fontSize: 9, lineHeight: 1.25 },
  project: { fontSize: 9, lineHeight: 1.25, marginBottom: 1.5 },
  stack: { fontSize: 8, fontStyle: "italic" },
  small: { fontSize: 8, lineHeight: 1.2 },
  link: { color: GRAY, textDecoration: "underline" },
});

function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link src={href} style={s.link}>
      {children}
    </Link>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View>
      <View wrap={false} minPresenceAhead={40}>
        <Text style={s.sectionHeading}>{title.toUpperCase()}</Text>
        <View style={s.rule} />
      </View>
      {children}
    </View>
  );
}

export function ResumeDocument({ data }: { data: Resume }) {
  const { certifications } = data;

  return (
    <Document title={`${data.name} - Resume`} author={data.name}>
      <Page size="LETTER" style={s.page}>
        {/* Header */}
        <Text style={s.name}>{data.name}</Text>
        <Text style={s.title}>{data.title}</Text>
        <Text style={s.contact}>
          {data.location}
          {"  |  "}
          {data.phone}
          {"  |  "}
          <A href={`mailto:${data.email}`}>{data.email}</A>
          {data.links.map((l) => (
            <Text key={l.url}>
              {"  |  "}
              <A href={l.url}>{l.text}</A>
            </Text>
          ))}
        </Text>

        <Section title="Summary">
          <Text style={s.body}>{data.summary}</Text>
        </Section>

        <Section title="Core Skills">
          {data.skills.map((skill) => (
            <Text key={skill.label} style={s.body}>
              <Text style={s.navyBold}>{skill.label}:</Text> {skill.value}
            </Text>
          ))}
        </Section>

        <Section title="Work Experience">
          {data.experience.map((job, i) => (
            <View key={`${job.company}-${i}`}>
              <View wrap={false} minPresenceAhead={30}>
                <View style={s.jobRow}>
                  <Text style={[s.jobTitle, { flex: 1 }]}>{job.title}</Text>
                  <Text style={s.jobDates}>{job.dates}</Text>
                </View>
                <Text style={s.company}>
                  {job.company}
                  {job.companyLink ? (
                    <>
                      {" ("}
                      <A href={job.companyLink.url}>{job.companyLink.text}</A>
                      {")"}
                    </>
                  ) : null}
                </Text>
              </View>
              {job.bullets.map((b, j) => (
                <View key={j} style={s.bulletRow} wrap={false}>
                  <Text style={s.bulletMark}>•</Text>
                  <Text style={s.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </Section>

        <Section title="Key Projects">
          {data.projects.map((p, i) => (
            <Text key={`${p.title}-${i}`} style={s.project}>
              <Text style={s.navyBold}>{p.title}</Text>
              {p.link ? (
                <>
                  {" ("}
                  <A href={p.link}>{linkLabel(p.link)}</A>
                  {")"}
                </>
              ) : null}
              {"\n• "}
              {p.description} <Text style={s.stack}>Stack: {p.stack}</Text>
            </Text>
          ))}
        </Section>

        <Section title="Certifications">
          {certifications.map((c, i) => (
            <Text key={`${c.name}-${i}`} style={s.small}>
              <Text style={s.bold}>{c.name}</Text>
              {` — ${c.issuer}, ${c.completedDate}`}
              {c.url ? (
                <>
                  {" ("}
                  <A href={c.url}>Certificate</A>
                  {")"}
                </>
              ) : null}
            </Text>
          ))}
        </Section>

        <Section title="Education & Languages">
          <Text style={s.company}>
            {data.education.map((e) => `${e.degree} — ${e.school}`).join("   |   ")}
          </Text>
          <Text style={s.company}>{data.languages}</Text>
        </Section>
      </Page>
    </Document>
  );
}
