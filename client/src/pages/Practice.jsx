import React from "react";
import "./css/practice.css";
import CodeEditor from "../components/Code_Editor/CodeEditor";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./editorTheme";

function Practice() {
  document.title = "Practice | StudySync";

  return (
    <ChakraProvider theme={theme}>
      <div className="code-editor-div">
        <CodeEditor />
        {/* google ads */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8386642099973212"
          crossOrigin="anonymous"
        ></script>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-8386642099973212"
          data-ad-slot="3931864628"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </div>
    </ChakraProvider>
  );
}

export default Practice;
