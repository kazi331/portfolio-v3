"use client";

import { json } from "@codemirror/lang-json";
import { materialDark } from "@uiw/codemirror-theme-material";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";

const fontTheme = EditorView.theme({
  "&": { height: "100%", fontSize: "12px" },
  ".cm-scroller": { fontFamily: "'Courier New', monospace", overflow: "auto" },
  ".cm-gutters": { backgroundColor: "#263238", borderRight: "1px solid #1e272c" },
  ".cm-lineNumbers .cm-gutterElement": { color: "#546e7a" },
});

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function JsonEditor({ value, onChange }: Props) {
  return (
    <CodeMirror
      value={value}
      height="100%"
      theme={materialDark}
      extensions={[json(), EditorView.lineWrapping, fontTheme]}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        closeBrackets: true,
        bracketMatching: true,
        indentOnInput: true,
        tabSize: 2,
      }}
      onChange={onChange}
      aria-label="Resume JSON editor"
      style={{ height: "100%" }}
    />
  );
}
