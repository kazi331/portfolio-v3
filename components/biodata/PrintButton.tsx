"use client";

import styles from "./biodata.module.css";

export function PrintButton() {
  return (
    <button type="button" className={styles.toolbarButton} onClick={() => window.print()}>
      Print / Save as PDF
    </button>
  );
}
