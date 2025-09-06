import React, { createContext, useState, useContext } from "react";
import EN from "./EN.json";
import UR from "./UR.json";

const TranslationContext = createContext();

const translations = {
  en: EN,
  ur: UR,
};

export const TranslationProvider = ({ children }) => {
  const [lang, setLang] = useState("ur");

  const t = (key) => translations[lang][key] || key;

  const toggleLanguage = (toggle) => {
    setLang(toggle ? "en" : "ur");
  };

  return (
    <TranslationContext.Provider value={{ lang, setLang, t, toggleLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useLang = () => useContext(TranslationContext);
