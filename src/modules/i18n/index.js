import i18n from "i18next";
import { runInAction, autorun } from "mobx";
import { useLocalStore } from "mobx-react-lite";
import { createContext, useContext, useEffect } from "react";
import moment from "moment";
import "moment/locale/vi";
import en from "./locales/en.json";
import vi from "./locales/vi.json";

export const LocalizeContext = createContext();

export const useLocalizeStore = () => useContext(LocalizeContext);

export const useCreateLocalizeStore = () => {
  const store = useLocalStore(createStore);
  useEffect(() => {
    const dispose = autorun(() => {
      i18n.changeLanguage(store.locale);
      moment.locale(store.locale);
    });
    return () => dispose();
  });

  return store;
};

function createStore() {
  i18n.init({
    keySeparator: ">",
    nsSeparator: "|",
    lng: "vi-VN",
    resources: {
      en: {
        common: en
      },
      vi: {
        common: vi
      }
    },
    ns: ["common"],
    defaultNS: "common"
  });

  const store = {
    i18n,
    locale: "vi-VN",
    appSupportedLanguages: [
      { language: "English", code: "en-US" },
      { language: "Vietnamese", code: "vi-VN" }
    ],
    setLocale(locale) {
      i18n.removeResourceBundle(this.locale, "remote");
      this.locale = locale;
      try { 
        localStorage.setItem("locale", this.locale);
      } catch (error) {
        console.debug(error);
      }
    },
     loadAsyncStorageLanguage() {
      try {
        let currentLocale =  localStorage.getItem("locale");
        runInAction(() => {
          if (currentLocale) {
            this.locale = currentLocale;
          }
        });
      } catch (error) {
        console.debug(error);
      }
    },
    load() { 
       this.loadAsyncStorageLanguage();
    }
  };

  store.load(); 
  return store;
}