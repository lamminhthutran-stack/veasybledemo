import { createContext, useContext, useState } from "react";
import i18n from "./i18n";

export type Lang = "vi" | "en";

export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "vi",
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("vi");

  function handleSetLang(l: Lang) {
    setLang(l);
    i18n.changeLanguage(l); // sync i18next
  }

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);

export function LangToggle({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex rounded-[5px] p-0.5 text-xs font-semibold ${dark ? "bg-white/10" : "bg-gray-100"}`}>
      {(["vi", "en"] as const).map(l => (
        <button key={l} onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-[5px] transition-colors uppercase ${
            lang === l
              ? dark ? "bg-white/20 text-white" : "bg-white text-gray-900 shadow-sm"
              : dark ? "text-white/40" : "text-gray-400"
          }`}>
          {l}
        </button>
      ))}
    </div>
  );
}
