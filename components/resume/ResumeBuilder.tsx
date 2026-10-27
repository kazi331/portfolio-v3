"use client";

import type { Resume } from "@/lib/resume/resume-schema";
import { useEffect, useState } from "react";
import { JsonEditor } from "./JsonEditor";
import styles from "./ResumeBuilder.module.css";
import { ResumePreview } from "./ResumePreview";

type ProfileOption = { key: string; label: string };

type Props = {
  profiles: ProfileOption[];
  initialProfile: string;
  initialJson: string;
};

type Status = { kind: "idle" | "error" | "ok"; text: string };

const PREVIEW_DEBOUNCE_MS = 250;

export function ResumeBuilder({ profiles, initialProfile, initialJson }: Props) {
  const [profile, setProfile] = useState(initialProfile);
  const [text, setText] = useState(initialJson);
  const [preview, setPreview] = useState<Partial<Resume>>(() => JSON.parse(initialJson));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle", text: "" });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  // Debounced live preview. On invalid JSON the last good preview stays on screen.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setPreview(JSON.parse(text));
        setJsonError(null);
      } catch (e) {
        setJsonError(`JSON error (preview frozen until fixed): ${(e as Error).message}`);
      }
    }, PREVIEW_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [text]);

  async function handleProfileChange(next: string) {
    setProfile(next);
    setLoadingProfile(true);
    try {
      const resp = await fetch(`/api/resume/profile/${encodeURIComponent(next)}`);
      if (!resp.ok) throw new Error("Could not load profile.");
      setText(JSON.stringify(await resp.json(), null, 2));
    } catch (err) {
      setStatus({ kind: "error", text: (err as Error).message });
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handleGenerate() {
    setStatus({ kind: "idle", text: "Generating…" });
    setGenerating(true);

    try {
      let resume: unknown;
      try {
        resume = JSON.parse(text);
      } catch (e) {
        setStatus({ kind: "error", text: `Invalid JSON: ${(e as Error).message}` });
        return;
      }

      const resp = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume }),
      });

      if (!resp.ok) {
        const err = (await resp.json().catch(() => null)) as { error?: string } | null;
        setStatus({ kind: "error", text: err?.error || "Failed to generate PDF." });
        return;
      }

      const blob = await resp.blob();
      const disposition = resp.headers.get("Content-Disposition") ?? "";
      const filename = /filename="?([^"]+)"?/.exec(disposition)?.[1] ?? "Resume.pdf";

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setStatus({ kind: "ok", text: `Downloaded ${filename}` });
    } catch (err) {
      setStatus({ kind: "error", text: `Network error: ${(err as Error).message}` });
    } finally {
      setGenerating(false);
    }
  }

  const statusClass =
    status.kind === "error" ? styles.statusError : status.kind === "ok" ? styles.statusOk : "";

  return (
    <>
      <header className={styles.appbar}>
        <h1>Resume PDF Generator</h1>
        <div className={styles.actions}>
          <span className={`${styles.status} ${statusClass}`} role="status">
            {status.text}
          </span>
          <div className={styles.profileActions}>
            <label htmlFor="profileSelect" className={styles.srOnly}>
              Resume profile
            </label>
            <select
              id="profileSelect"
              className={styles.profileSelect}
              value={profile}
              disabled={loadingProfile}
              onChange={(e) => handleProfileChange(e.target.value)}
            >
              {profiles.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
            <button
              className={styles.generateBtn}
              onClick={handleGenerate}
              disabled={generating}
            >
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <div className={styles.tabbar} role="tablist">
        <button
          role="tab"
          aria-selected={tab === "edit"}
          className={tab === "edit" ? styles.active : ""}
          onClick={() => setTab("edit")}
        >
          Edit
        </button>
        <button
          role="tab"
          aria-selected={tab === "preview"}
          className={tab === "preview" ? styles.active : ""}
          onClick={() => setTab("preview")}
        >
          Preview
        </button>
      </div>

      <div
        className={`${styles.layout} ${tab === "edit" ? styles.showEditorOnly : styles.showPreviewOnly}`}
      >
        <div className={styles.editorPane}>
          {jsonError && <div className={styles.jsonError}>{jsonError}</div>}
          <div className={styles.editor}>
            <JsonEditor value={text} onChange={setText} />
          </div>
          <p className={styles.hint}>
            Edits update the preview instantly. Generate a PDF to download it — your JSON
            files in <code>data/</code> are never modified.
          </p>
        </div>

        <div className={styles.previewPane}>
          <ResumePreview data={preview} />
        </div>
      </div>
    </>
  );
}
