import React, { useRef, useState } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from "./constants";
import { Box, HStack } from "@chakra-ui/react";
import Output from "./Output";

function CodeEditor() {
  const editorRef = useRef();
  const [value, setValue] = useState(CODE_SNIPPETS["Python"] || "Write your code here");
  const [language, setLanguage] = useState('Python');

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  return (
    <>
      <HStack>
        <Box w="50%">
          <LanguageSelector language={language} onSelect={onSelect} />
          <Editor
            height="80vh"
            theme="vs-dark"
            language={language.toLocaleLowerCase()}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={() => setValue(value)}
          />
        </Box>
        <Output editorRef={editorRef} language={language} />
      </HStack>
    </>
  );
}

export default CodeEditor;
