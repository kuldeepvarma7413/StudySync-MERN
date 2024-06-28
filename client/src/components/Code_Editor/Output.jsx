import { Box, Button, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { executeCode } from "./api";

function Output({ editorRef, language }) {
  const toast = useToast();
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(sourceCode, language);
      console.log(result);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "Unable to run code",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box w="50%">
      <Button
        variant="outline"
        colorScheme="green"
        mb={4}
        onClick={runCode}
        isLoading={isLoading}
      >
        Run Code
      </Button>
      <Box
        height="80vh"
        p={2}
        color={isError ? "red.400" : ""}
        border="1px solid"
        borderRadius={4}
        borderColor={isError ? "red.500" : "#333"}
      >
        {output ? (
          output.map((line, index) => <Text key={index}>{line}</Text>)
        ) : (
          <>
            <p>Click "Run Code" to see the output here</p>
            <p>Provide input in code itself</p>
          </>
        )}
      </Box>
    </Box>
  );
}

export default Output;
