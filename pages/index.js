import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SplitPane from "react-split-pane";
import { ToastContainer, toast } from 'react-toastify';

import { CssEditor, HtmlEditor, JavascriptEditor } from "../components/editors";
import { useDebounce } from "../utils/useDebounce";
import Header from "./Header";
import styles from "./index.module.css";

const Index = () => {
  const [heightValue, setHeightValue] = useState("485px");

  const [loading, setLoading] = useState(true);
  const [isFetch, setFetch ] = useState(false);
  const [saving, setSaving] = useState(false);

  const [htmlValue, setHtmlValue] = useState("");
  const [jsValue, setJsValue] = useState("");
  const [cssValue, setCssValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  const debouncedHtml = useDebounce(htmlValue, 1000);
  const debouncedJs = useDebounce(jsValue, 1000);
  const debouncedCss = useDebounce(cssValue, 1000);

  const router = useRouter();
  const { id } = router.query
  console.log('id',id)
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`../api/pens/${id}`);
      const { data } = await response.json();

      if (response.status !== 200) {
        // await router.push("/404");
        setFetch(false);
      }

      setHtmlValue(data.html);
      setCssValue(data.css);
      setJsValue(data.js);

      setLoading(false);
    }

    if (id) {
      toast('🦄 Wait... You code is loading..', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        })
      fetchData();
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const output = `<html> 
                    <style>
                    ${debouncedCss}
                    </style>
                    <body>
                    ${debouncedHtml}
                    <script type="text/javascript">
                    ${debouncedJs}
                    </script>
                    </body>
                  </html>`;
    setOutputValue(output);
  }, [debouncedHtml, debouncedCss, debouncedJs]);

  const save = async () => {
    setSaving(true);
    const requestOptions = {
      method: !id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html: htmlValue,
        css: cssValue,
        js: jsValue,
        id: id,
      }),
    };
    const response = await fetch(`../api/pens/${id}`, requestOptions);
    const {
      data: { updatedRecord, newRecordId },
    } = await response.json();

    setSaving(false);
    if (!updatedRecord) {
      await router.push(`?id=${newRecordId}`);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const copyCode = () => {
    const url = 'https://ua-pen.herokuapp.com/?id='
    const currentUrl = router.query.id;
    let copiedText = url+currentUrl
    navigator.clipboard.writeText(copiedText).then(function() {
      toast('Your Code URL has been copied to Clipboard', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        })
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }


  return (
    <>
    <ToastContainer />
    <Header />
      <div className={styles.header}>
        
        <button className={styles.button} onClick={() => (location.href = "/")}>
          New
        </button>
        <button className={styles.button} onClick={save}>
          {saving ? "Saving..." : "Save"}
        </button>
        {id ? <button className={styles.button} onClick={copyCode}>
          Share Code
        </button>:''}

      </div>
      <SplitPane
        style={{ marginTop: "120px" }}
        split="horizontal"
        minSize={"50%"}
        onDragFinished={(height) => {
          setHeightValue(`${height - 40}px`);
        }}
      >
        <SplitPane split="vertical" minSize={"33%"}>
          <HtmlEditor
            height={heightValue}
            value={htmlValue}
            onChange={setHtmlValue}
          />
          <SplitPane split="vertical" minSize={"50%"}>
            <CssEditor
              height={heightValue}
              value={cssValue}
              onChange={setCssValue}
            />
            <JavascriptEditor
              height={heightValue}
              value={jsValue}
              onChange={setJsValue}
            />
          </SplitPane>
        </SplitPane>
        <iframe srcDoc={outputValue} className={styles.previewIframe} />
      </SplitPane>
    </>
  );
};

export default Index;
