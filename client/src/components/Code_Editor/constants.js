export const LANGUAGE_VERSIONS = {
  JavaScript: "18.15.0",
  TypeScript: "5.0.3",
  Python: "3.10.0",
  Java: "15.0.2",
  CSharp: "6.12.0",
  PHP: "8.2.3",
};

export const CODE_SNIPPETS = {
    JavaScript: `function greet(greeting) {\n\tconsole.log(greeting);\n}\n\ngreet("Hello StudySync");\n`,
    TypeScript: `type Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello " + data.name + "!");\n}\n\ngreet({ name: "StudySync" });\n`,
    Python: `def greet(name):\n\tprint("Hello "+ name)\n\ngreet("StudySync")\n`,
    Java: `public class StudySync {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello StudySync");\n\t}\n}\n`,
    CSharp:
    'using System;\n\nnamespace HelloStudySync\n{\n\tclass StudySync { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello StudySync");\n\t\t}\n\t}\n}\n',
    PHP: "<?php\n\n$greet = 'Hello StudySync';\necho $greet;\n",
};
