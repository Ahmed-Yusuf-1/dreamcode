"use client";

import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";

/** Dusk-blue editor theme matching the prototype's code panels. */
const dreamTheme = createTheme({
  theme: "dark",
  settings: {
    background: "transparent",
    foreground: "#dbe9ff",
    caret: "#ffffff",
    selection: "rgba(110,160,240,.35)",
    selectionMatch: "rgba(110,160,240,.25)",
    lineHighlight: "rgba(76,130,220,.18)",
    gutterBackground: "transparent",
    gutterForeground: "#48618f",
  },
  styles: [
    { tag: [t.keyword, t.controlKeyword, t.operatorKeyword], color: "#ff9ecf" },
    { tag: [t.string, t.special(t.string)], color: "#ffe49a" },
    { tag: [t.number, t.bool], color: "#b5f1c9" },
    { tag: [t.comment], color: "#6e87b8" },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#9ad1ff" },
    { tag: [t.definition(t.variableName)], color: "#dbe9ff" },
    { tag: [t.propertyName], color: "#9ad1ff" },
    { tag: [t.operator], color: "#dbe9ff" },
  ],
});

export default function CodeEditor({
  value,
  onChange,
  language,
  minHeight = "200px",
  readOnly = false,
  lineNumbers = true,
}: {
  value: string;
  onChange?: (v: string) => void;
  language: "python" | "javascript" | "typescript";
  minHeight?: string;
  readOnly?: boolean;
  lineNumbers?: boolean;
}) {
  const langExtension =
    language === "python"
      ? python()
      : javascript({ typescript: language === "typescript" });
  return (
    <div className="dc-editor">
      <CodeMirror
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        editable={!readOnly}
        theme={dreamTheme}
        extensions={[langExtension, EditorView.lineWrapping]}
        basicSetup={{
          foldGutter: false,
          searchKeymap: false,
          autocompletion: false,
          highlightActiveLine: !readOnly,
          lineNumbers,
        }}
        style={{ minHeight }}
        minHeight={minHeight}
      />
    </div>
  );
}
