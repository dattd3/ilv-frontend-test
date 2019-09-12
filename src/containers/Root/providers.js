import React from "react";
import {
  ApiContext,
  useApiMemo,
  LocalizeContext,
  ThemeContext,
  GuardContext,
  useCreateLocalThemeStore,
  useCreateLocalizeStore,
  useCreateLocalGuardStore,
  useGuardStore,
  useApi
} from "../../modules";
import { I18nextProvider } from "react-i18next";
import { observer, useDisposable } from "mobx-react-lite";
import { reaction } from "mobx";

const LanguageProvider = function ({ children }) {
  const localize = useCreateLocalizeStore();
  return (
    <I18nextProvider i18n={localize.i18n}>
      <LocalizeContext.Provider value={localize}>
        {children}
      </LocalizeContext.Provider>
    </I18nextProvider>
  );
};

const ApiProvider = function ({ children }) {
  const api = useApiMemo(process.env.REACT_APP_REQUEST_URL);
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

const GuardProvider = function ({ children }) {
  const store = useCreateLocalGuardStore();
  return (
    <GuardContext.Provider value={store}>{children}</GuardContext.Provider>
  );
};

const ComposeApiWithGuard = function ({ children }) {
  const guard = useGuardStore();
  const api = useApi();

  useDisposable(() =>
    reaction(
      () => guard.session,
      session => {
        api.setAuthorization(session);
      }
    )
  )

  return children;
}

export default function ({ children }) {
  return (
    <ApiProvider>
      <LanguageProvider>
        <GuardProvider>
          <ComposeApiWithGuard>{children}</ComposeApiWithGuard>
        </GuardProvider>
      </LanguageProvider>
    </ApiProvider>
  );
}
