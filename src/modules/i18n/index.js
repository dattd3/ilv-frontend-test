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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return store;
};

function createStore() {
  i18n.init({
    keySeparator: ">",
    nsSeparator: "|",
    lng: "vi",
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
    locale: "vi",
    appSupportedLanguages: [
      { language: "English", code: "en" },
      { language: "Vietnamese", code: "vi" }
    ],
    async setLocale(locale) {
      i18n.removeResourceBundle(this.locale, "remote");
      this.locale = locale;
      this.loadLanguage();
      try {
        await localStorage.setItem("locale", this.locale);
      } catch (error) {
        console.debug(error);
      }
    },
    async loadAsyncStorageLanguage() {
      try {
        let currentLocale = await localStorage.getItem("locale");
        runInAction(() => {
          if (currentLocale) {
            this.locale = currentLocale;
          }
        });
      } catch (error) {
        console.debug(error);
      }
    },
    async loadLanguage() {
      try {
        // call get language from be
        // const remoteTranslationResource = await getLanguage(this.locale);
        // i18next.addResources(this.locale, "remote", remoteTranslationResource.data);
      } catch (error) {
        /*implement later*/
        // this.setError('Can not load language');
        console.debug(error);
      }
    },
    async load() {
      await this.loadAsyncStorageLanguage();
      await this.loadLanguage();
    }
  };

  store.load();

  return store;
}
