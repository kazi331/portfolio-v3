
import { linkLabel } from "@/lib/resume/filename";
import { Resume } from "@/lib/resume/resume-schema";
import styles from "./ResumePreview.module.css";

type Props = { data: Partial<Resume> };

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

/**
 * HTML approximation of the PDF. Deliberately tolerant of missing fields
 * (unlike PDF generation) so the preview keeps working while you type.
 */
export function ResumePreview({ data }: Props) {
  const links = data.links ?? [];

  return (
    <div className={styles.page}>
      <h1 className={styles.name}>{data.name}</h1>
      <div className={styles.title}>{data.title}</div>
      <div className={styles.contact}>
        {data.location}
        {"  |  "}
        {data.phone}
        {"  |  "}
        {data.email ? <A href={`mailto:${data.email}`}>{data.email}</A> : null}
        {links.map((l, i) => (
          <span key={`${l.url}-${i}`}>
            {"  |  "}
            <A href={l.url}>{l.text}</A>
          </span>
        ))}
      </div>

      <div className={styles.sectionHeading}>Summary</div>
      <p className={styles.bodyText}>{data.summary}</p>

      <div className={styles.sectionHeading}>Core Skills</div>
      {(data.skills ?? []).map((s, i) => (
        <div className={styles.skillLine} key={`${s.label}-${i}`}>
          <b>{s.label}:</b> {s.value}
        </div>
      ))}

      <div className={styles.sectionHeading}>Work Experience</div>
      {(data.experience ?? []).map((job, i) => (
        <div key={`${job.company}-${i}`}>
          <div className={styles.jobRow}>
            <span className={styles.jobTitle}>{job.title}</span>
            <span className={styles.jobDates}>{job.dates}</span>
          </div>
          <div className={styles.company}>
            {job.company}
            {job.companyLink ? (
              <>
                {" ("}
                <A href={job.companyLink.url}>{job.companyLink.text}</A>
                {")"}
              </>
            ) : null}
          </div>
          <ul className={styles.bullets}>
            {(job.bullets ?? []).map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        </div>
      ))}

      <div className={styles.sectionHeading}>Key Projects</div>
      {(data.projects ?? []).map((p, i) => (
        <div className={styles.projectLine} key={`${p.title}-${i}`}>
          <b className={styles.projectTitle}>{p.title}</b>
          {p.link ? (
            <>
              {" ("}
              <A href={p.link}>{linkLabel(p.link)}</A>
              {")"}
            </>
          ) : null}
          <br />
          <ul className={styles.bullets}>
            {(p.highlights ?? []).map((h, i) => (
              <li key={`${h}-${i}`}>{h}</li>
            ))}
          </ul>
          <span className={styles.stackLabel}>Stack: </span><span className={styles.stack}>{p.stack}</span><br />
        </div>
      ))}

      <div className={styles.sectionHeading}>Certifications</div>
      {(data.certifications ?? []).map((c, i) => (
        <div className={styles.certLine} key={`${c.name}-${i}`}>
          <b>{c.name}</b> — {c.issuer}, {c.completedDate}
          {c.url ? (
            <>
              {" ("}
              <A href={c.url}>Certificate</A>
              {")"}
            </>
          ) : null}
        </div>
      ))}

      <div className={styles.sectionHeading}>Education &amp; Languages</div>
      <div className={styles.eduLine}>
        <ul >
          {(data.education ?? []).map((e) => (
            <li key={`${e.degree}-${e.school}`}>{e.degree} — {e.school}</li>
          ))}
        </ul>
        <div><span style={{ fontWeight: "bold", fontSize: "10px" }}>Languages:</span>  <span className={styles.eduLine}>{data.languages}</span></div>
      </div>
    </div>
  );
}
