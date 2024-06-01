import { LANGUAGE_VERSIONS } from "./constants";
const API_URL = "https://emkc.org/api/v2/piston";

export const executeCode = async (sourceCode, language) => {
  const res = await fetch(API_URL + "/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: language.toLowerCase(),
      version: LANGUAGE_VERSIONS[language],
      files: [
        {
          content: sourceCode,
        },
      ],
    }),
  });
  return res.json();
};
