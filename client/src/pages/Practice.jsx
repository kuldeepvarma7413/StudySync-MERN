import React from "react";
import "./css/practice.css";
import CodeEditor from "../components/Code_Editor/CodeEditor";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./editorTheme";

function Practice() {
  return (
    <ChakraProvider theme={theme}>
      <div className="code-editor-div">
        <CodeEditor />
      </div>
    </ChakraProvider>
  );
}

export default Practice;
