import React from "react";
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "./constants";
import "./css/languageselector.css";

const Languages = Object.entries(LANGUAGE_VERSIONS);

const ACTIVE_COLOR = "purple.200";

function LanguageSelector({ language, onSelect }) {
  return (
    <div className="language-selector">
      <Menu isLazy>
        <MenuButton as={Button} className="selected-language">{language}</MenuButton>
        <MenuList>
          {Languages.map(([lang, version]) => (
            <MenuItem key={lang}
            color={
              lang === language ? ACTIVE_COLOR : ""
            }
            bg={
              lang === language ? "gray.900" : "transparent"
            }
            _hover={{
              color: "purple.200",
              bg: "purple.800"}
            }
             onClick={() => onSelect(lang)}>
              {lang}
              &nbsp; <span className="language-version">{version}</span>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
}

export default LanguageSelector;
