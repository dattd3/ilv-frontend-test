import React, { useState } from "react";
import { Modal, Spinner } from 'react-bootstrap';
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
import { Auth } from 'aws-amplify';



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
  const [isShowModal, SetIsShowModal] = useState(false);

  useDisposable(() => autorun(() => {
    if (guard.currentAuthUser) {
      api.setAuthorization(guard.currentAuthUser);
      api.inject.request(() => {
        SetIsShowModal(true);
      });
      api.inject.response((err) => {
        SetIsShowModal(false);
        if (err && err.response.status === 401) {
          guard.setLogOut();
          Auth.signOut();
        }
      });
      return;
    }
    api.removeAuthorization();
    api.eject.response((err) => {
      SetIsShowModal(false);
      if (err && err.response.status === 401) {
        guard.setLogOut();
        Auth.signOut();
      }
    });
  }));
  return [
    children,
    isShowModal,
    (
      <Modal centered show={isShowModal} onHide={() => { return; }}>
        <Modal.Body className='text-center no-bg'>
          <Spinner animation="border" variant="light" size='lg' />
        </Modal.Body>
      </Modal>
    )];
}

export default function ({ children }) {
  return (
    <ApiProvider>
      <LanguageProvider>
        <GuardProvider>
          <ComposeApiWithGuard>
            {children}
          </ComposeApiWithGuard>
        </GuardProvider>
      </LanguageProvider>
    </ApiProvider>
  );
}