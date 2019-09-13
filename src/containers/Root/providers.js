import React from "react";
import {
  ApiContext,
  useApiMemo,
  LocalizeContext,
  GuardContext,
  useCreateLocalizeStore,
  useCreateLocalGuardStore,
  useGuardStore,
  useApi
} from "../../modules";
import { I18nextProvider } from "react-i18next";
import { autorun } from "mobx";
import { useDisposable } from "mobx-react-lite";
import { withRouter } from 'react-router-dom';
import map from '../map.config';

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
  //withRouter(function ({ children, history }) {
    useDisposable(() => autorun(() => {
      if (guard.session) {
        api.setAuthorization(guard.session);
        api.inject.response((err) => {
          if (err.response.status == 401) {
            //history.push(map.Login);
          }
        });
        return;
      }
      api.removeAuthorization()
      api.eject.response((err) => {
        if (err.response.status == 401) {
          //window.location.assign(map.Login);
        }
      })
    }));
    return children;
 // });
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
