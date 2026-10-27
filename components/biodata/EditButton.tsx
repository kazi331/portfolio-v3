"use client";

import { useState } from "react";
import styles from "./biodata.module.css";

const HINT_OFF = "Edit text in place, then print or save as PDF.";
const HINT_ON = "Editing is on: click any text to change it. Print or save as PDF to keep a copy.";

export function EditButton() {
  const [editing, setEditing] = useState(false);

  function toggleEdit() {
    const next = !editing;
    document.querySelectorAll<HTMLElement>("#biodata [contenteditable]").forEach((el) => {
      el.contentEditable = next ? "true" : "false";
    });
    const hint = document.getElementById("biodata-hint");
    if (hint) hint.textContent = next ? HINT_ON : HINT_OFF;
    setEditing(next);
  }

  return (
    <button type="button" className={styles.toolbarButton} onClick={toggleEdit}>
      {editing ? "✓ Finish editing" : "✎ Edit biodata"}
    </button>
  );
}
