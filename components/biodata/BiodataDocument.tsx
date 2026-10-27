import portrait from "@/public/Sharif-passport-photo.jpg";
import type { ReactNode } from "react";
import { EditButton } from "./EditButton";
import { PrintButton } from "./PrintButton";
import styles from "./biodata.module.css";


const personalFacts = [
  { label: "Date of birth", value: "1999" },
  { label: "Height", value: "5 ft 8 in (173 cm)" },
  { label: "Weight", value: "66 kg" },
  { label: "Blood group", value: "B+" },
  { label: "Religion", value: "Islam" },
  { label: "Complexion", value: "Medium" },
  { label: "Nationality", value: "Bangladeshi" },
  { label: "Marital status", value: "Never Married" },
];

const education = [
  {
    qualification: "B.A. (Honours) in English",
    institution: "Govt. Safar Ali College, under National University",
    session: "2017 - 2018",
  },
  {
    qualification: "HSC (Science)",
    institution: "Mosharraf Hossain Khan Chowdhury University College",
    session: "2017",
  },
  {
    qualification: "SSC (Science)",
    institution: "Gopalnagar B.A.B. High School",
    session: "2015",
  },
];

const experience = [
  {
    role: "Software Engineer",
    organization: "Devsnest OPC, Dhaka",
    period: "Oct 2025 – Aug 2026",
  },
  {
    role: "Full Stack Developer",
    organization: "Tutorsplan, Dhaka",
    period: "2024 – 2025",
  },
  {
    role: "Frontend Engineer",
    organization: "Approveage Inc., Canada (Remote)",
    period: "2023 – 2024",
  },
  {
    role: "Assistant Teacher",
    organization: "Ekattor Multimedia High School, Brahmanpara",
    period: "2019 – 2021",
  },
  {
    role: "Assistant Teacher",
    organization: "Green Bangla Model High School, Narayanganj",
    period: "2018 – 2019",
  },
];

const family = [
  {
    label: "Father",
    value: "Kazi Sham Mia — Former employee of the Government Social Welfare Service",
  },
  { label: "Mother", value: "Hosneyara Begum — Homemaker" },
  {
    label: "Siblings",
    value:
      "Five brothers and two sisters. I am the fourth among five brothers. My three elder brothers work in Saudi Arabia, and my younger brother is an HSC student. Both of my sisters are married.",
  },
  {
    label: "Brothers-in-law",
    value:
      "My elder sister’s husband serves as an Imam and Khatib at a mosque in Cumilla city. My younger sister’s husband is a businessman based in Mirpur, Dhaka.",
  },
];

const partnerFacts = [
  { label: "Preferred age", value: "18–25 years" },
  { label: "Preferred height", value: "5 ft 2 in or above" },
  { label: "Education", value: "SSC to Honours, or equivalent" },
];

const qualities = [
  "Practicing Muslim with good character and manners",
  "Honest, polite, responsible, and family-oriented",
  "Respectful and supportive, and values education, modesty, and Islamic principles",
];

function Editable({
  as: Tag = "span",
  className,
  children,
}: {
  as?: "span" | "p" | "h1" | "td" | "div" | "ul";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={className} contentEditable={false} suppressContentEditableWarning>
      {children}
    </Tag>
  );
}

function Fact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className={styles.fact}>
      <span className={styles.label}>{label}</span>
      <Editable className={styles.value}>{value}</Editable>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function BiodataDocument({ editable = false }: { editable?: boolean }) {
  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        {editable ? <EditButton /> : null}
        <PrintButton />
      </div>
      {editable ? (
        <p id="biodata-hint" className={styles.hint}>
          Edit text in place, then print or save as PDF.
        </p>
      ) : null}

      <main id="biodata" className={styles.document}>
        <section className={styles.page}>
          <header className={styles.hero}>
            <div>
              <div className={styles.eyebrow}>Personal · Educational · Professional & Family Profile</div>
              <Editable as="h1">Kazi Shariful Islam</Editable>
              <Editable as="p">Self-taught Software Engineer · Honours Graduate</Editable>
              <Editable as="p">Mirpur, Dhaka · Originally from Brahmanpara, Cumilla</Editable>
            </div>
            {portrait ? (
              <img className={styles.portrait} src={portrait.src} alt="Kazi Shariful Islam portrait" />
            ) : (
              <div className={styles.portrait} role="img" aria-label="Kazi Shariful Islam portrait" />
            )}
          </header>

          <div className={styles.content}>
            <Section title="Personal Information">
              <div className={styles.facts}>
                {personalFacts.map((fact) => (
                  <Fact key={fact.label} label={fact.label} value={fact.value} />
                ))}
              </div>
            </Section>

            <Section title="Address">
              <div className={styles.twoCol}>
                <div className={styles.address}>
                  <span className={styles.label}>Present address</span>
                  <Editable className={styles.value}>Mirpur, Dhaka</Editable>
                </div>
                <div className={styles.address}>
                  <span className={styles.label}>Permanent address</span>
                  <Editable className={styles.value}>Brahmanpara, Cumilla</Editable>
                </div>
              </div>
            </Section>

            <Section title="Education">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Qualification</th>
                    <th>Institution</th>
                    <th>Session</th>
                  </tr>
                </thead>
                <tbody>
                  {education.map((row) => (
                    <tr key={row.qualification}>
                      <Editable as="td">{row.qualification}</Editable>
                      <Editable as="td">{row.institution}</Editable>
                      <Editable as="td">{row.session}</Editable>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            <Section title="Professional Background">
              <Editable as="p" className={styles.intro}>
                A self-taught software engineer who transitioned into the technology industry in 2022, with
                experience in full-stack and frontend development and collaboration with local and international
                teams.
              </Editable>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Organization</th>
                    <th>Period</th>
                  </tr>
                </thead>
                <tbody>
                  {experience.map((row) => (
                    <tr key={`${row.role}-${row.period}`}>
                      <Editable as="td">{row.role}</Editable>
                      <Editable as="td">{row.organization}</Editable>
                      <Editable as="td">{row.period}</Editable>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          </div>
        </section>

        <section className={styles.page}>
          <div className={styles.content}>
            <Section title="Family Background">
              <table className={styles.family}>
                <tbody>
                  {family.map((row) => (
                    <tr key={row.label}>
                      <th>{row.label}</th>
                      <Editable as="td">{row.value}</Editable>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            <Section title="Religious Values & Outlook">
              <Editable as="p" className={styles.intro}>
                A practicing Muslim and strive to observe the five daily prayers regularly. I value honesty,
                modesty, mutual respect, and responsibility in personal and family life. I believe a strong
                marriage is built on faith, trust, compassion, understanding, and shared commitment.
              </Editable>
            </Section>

            <Section title="Expectations for My Life Partner">
              <div className={styles.partnerFacts}>
                {partnerFacts.map((fact) => (
                  <Fact key={fact.label} label={fact.label} value={fact.value} />
                ))}
              </div>
              <p className={`${styles.label} ${styles.qualitiesLabel}`}>Desired qualities</p>
              <Editable as="ul">
                {qualities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </Editable>
              <Editable as="div" className={styles.statement}>
                “I hope to build a peaceful, faith-centered family grounded in mutual respect, trust,
                companionship, and support.”
              </Editable>
            </Section>

            <Section title="Contact">
              <div className={styles.contact}>
                <Fact
                  label="Personal phone"
                  value={<a href="tel:+8801612178331">+8801612178331</a>}
                />
                <Fact
                  label="Email"
                  value={<a href="mailto:sharifuli.dev@gmail.com">sharifuli.dev@gmail.com</a>}
                />
                <Fact label="Guardian (father)" value={<a href="tel:01922512001">01922512001</a>} />
              </div>
            </Section>

            <Editable as="p" className={styles.intro}>
              Families interested in proceeding further may contact me or my guardian for additional information
              and discussion.
            </Editable>
          </div>
        </section>
      </main>
    </div>
  );
}
