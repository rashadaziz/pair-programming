import styles from "../styles/Home.module.css";
import * as Y from "yjs";
// @ts-ignore
import { yCollab } from "y-codemirror.next";
import { WebrtcProvider } from "y-webrtc";
import { EditorView, basicSetup } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript";
import { python, pythonLanguage } from "@codemirror/lang-python";
import { materialDark } from "cm6-theme-material-dark";
import { useEffect, useRef } from "react";

const lang = new Compartment();

const usercolors = [
  { color: "#30bced", light: "#30bced33" },
  { color: "#6eeb83", light: "#6eeb8333" },
  { color: "#ffbc42", light: "#ffbc4233" },
  { color: "#ecd444", light: "#ecd44433" },
  { color: "#ee6352", light: "#ee635233" },
  { color: "#9ac2c9", light: "#9ac2c933" },
  { color: "#8acb88", light: "#8acb8833" },
  { color: "#1be7ff", light: "#1be7ff33" },
];

const userColor = usercolors[Math.floor(Math.random() * usercolors.length)];

export default function Home() {
  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider("codemirror6-minterm-room", ydoc);
    const ytext = ydoc.getText("codemirror");

    const undoManager = new Y.UndoManager(ytext);

    provider.awareness.setLocalStateField("user", {
      name: "Anonymous " + Math.floor(Math.random() * 100),
      color: userColor.color,
      colorLight: userColor.light,
    });

    const fixedHeightEditor = EditorView.theme({
      "&": {
        height: "800px",
        width: "100%",
      },
      ".cm-scroller": {
        overflow: "auto",
      },
    });

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        lang.of(python()),
        materialDark,
        fixedHeightEditor,
        yCollab(ytext, provider.awareness, { undoManager }),
      ],
    });

    const viewer = new EditorView({
      state: state,
      parent: document.getElementById("editor"),
    });

    // to delete everything
    // viewer.dispatch({ changes: { from: 0, to: viewer.state.doc.length, insert: "" } });

    return () => {
      provider.destroy();
      viewer.destroy();
    };
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div
          style={{
            display: "flex",
            height: "100%",
            flexGrow: 1,
            width: "100%",
          }}
          id="editor"
        />
      </main>
    </div>
  );
}
