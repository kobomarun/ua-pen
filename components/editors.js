import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/ext-spellcheck";
import "ace-builds/src-min-noconflict/snippets/javascript";
import 'ace-builds/src-min-noconflict/ext-searchbox';
import "ace-builds/src-min-noconflict/ext-language_tools";

import styles from "./editors.module.css";

export const JavascriptEditor = (props) => {
  return <Editor mode="javascript" title={"JS"} {...props} />;
};

export const HtmlEditor = (props) => {
  return <Editor mode="html" title={"HTML"} {...props} />;
};

export const CssEditor = (props) => {
  return <Editor mode="css" title={"CSS"} {...props} />;
};

const Editor = ({ mode, onChange, value, title, height }) => {
  return  (
    <div className={styles.editorContainer}>
      <div className={styles.editorTitle}>{title}</div>
      <AceEditor
        mode={mode}
        theme="monokai"
        name={title}
        onChange={onChange}
        fontSize={18}
        width={"100%"}
        height={height}
        value={value}
        showPrintMargin={true}
        showGutter={true}

        editorProps={{ $blockScrolling: true }}
        wrapEnabled= {true}
        highlightActiveLine={true}
        autoScrollEditorIntoView ={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
          showGutter: true
        }}
        // setOptions={{ useWorker: false }}
      />
    </div>
  );
};
