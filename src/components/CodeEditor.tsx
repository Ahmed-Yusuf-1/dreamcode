"use client";

import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView, Decoration, keymap } from "@codemirror/view";
import { Prec, RangeSetBuilder } from "@codemirror/state";
import { indentUnit } from "@codemirror/language";
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
    gutterForeground: "#8398c4",
  },
  styles: [
    { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.modifier], color: "#ff9ecf" },
    { tag: [t.string, t.special(t.string)], color: "#ffe49a" },
    { tag: [t.number, t.bool, t.null], color: "#b5f1c9" },
    { tag: [t.comment, t.lineComment, t.blockComment], color: "#97acd8", fontStyle: "italic" },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#9ad1ff" },
    { tag: [t.definition(t.variableName)], color: "#dbe9ff" },
    { tag: [t.typeName, t.className, t.namespace], color: "#c9b5ff" },
    { tag: [t.propertyName], color: "#9ad1ff" },
    { tag: [t.operator, t.punctuation], color: "#dbe9ff" },
  ],
});

const errorLineMark = Decoration.line({ class: "cm-errorLine" });

function errorLineExtension(line: number | undefined) {
  if (!line) return [];
  return EditorView.decorations.compute(["doc"], (state) => {
    const builder = new RangeSetBuilder<Decoration>();
    if (line >= 1 && line <= state.doc.lines) {
      const l = state.doc.line(line);
      builder.add(l.from, l.from, errorLineMark);
    }
    return builder.finish();
  });
}

export type EditorLanguage = "python" | "javascript" | "typescript";

export default function CodeEditor({
  value,
  onChange,
  language,
  minHeight = "200px",
  readOnly = false,
  lineNumbers = true,
  onRun,
  errorLine,
  ariaLabel,
}: {
  value: string;
  onChange?: (v: string) => void;
  language: EditorLanguage;
  minHeight?: string;
  readOnly?: boolean;
  lineNumbers?: boolean;
  /** Ctrl/Cmd+Enter runs the code. */
  onRun?: () => void;
  /** 1-based line to highlight after an error. */
  errorLine?: number;
  ariaLabel?: string;
}) {
  const extensions = useMemo(() => {
    const lang = language === "python" ? python() : javascript({ typescript: language === "typescript" });
    const exts = [
      lang,
      EditorView.lineWrapping,
      indentUnit.of(language === "python" ? "    " : "  "),
      EditorView.contentAttributes.of({
        "aria-label": ariaLabel || (readOnly ? "Code example" : "Code editor"),
        spellcheck: "false",
        autocapitalize: "off",
        autocorrect: "off",
      }),
      errorLineExtension(errorLine),
    ];
    if (onRun) {
      exts.push(
        Prec.highest(
          keymap.of([
            {
              key: "Mod-Enter",
              run: () => {
                onRun();
                return true;
              },
            },
          ]),
        ),
      );
    }
    return exts;
  }, [language, readOnly, ariaLabel, errorLine, onRun]);

  return (
    <div className="dc-editor">
      <CodeMirror
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        editable={!readOnly}
        theme={dreamTheme}
        extensions={extensions}
        basicSetup={{
          foldGutter: false,
          searchKeymap: false,
          autocompletion: false,
          highlightActiveLine: !readOnly,
          highlightActiveLineGutter: !readOnly,
          lineNumbers,
          tabSize: language === "python" ? 4 : 2,
        }}
        style={{ minHeight }}
        minHeight={minHeight}
      />
    </div>
  );
}
