import { createContext, useContext } from "react";
import { useLocalStore } from "mobx-react-lite";

export const GuardContext = createContext();

export const useGuardStore = () => {
  return useContext(GuardContext);
};

export const useCreateLocalGuardStore = () => {
  const store = useLocalStore(() => createStore(Storage.load()));
  return store;
};

function createStore(session) {
  return {
    activities: new Map(),
    session: session,
    get isAuthenticated() {
      return !!this.session
    },
    setIsAuth(session, isRemember = true) {
      if (!session) return;
      this.session = deserialize(session);
      if (isRemember) Storage.save(this.session);
    },
    getCurentUser(){
      return Storage.load();
    },
    setActivity(activity, hasAccess) {
      this.activities.set(activity, hasAccess);
    },
    canAccess(activity) {
      return this.activities.has(activity) && !!this.activities.get(activity);
    },
    setLogOut() {
      Storage.reset();
    }
  };
}

const Storage = {
  save(session) {
    localStorage.setItem('accessToken', session.accessToken);
    localStorage.setItem('tokenType', session.tokenType);
    localStorage.setItem('idToken', session.idToken);
    localStorage.setItem('refreshToken', session.refreshToken);
  },
  load() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    return {
      accessToken: localStorage.getItem('accessToken'),
      tokenType: localStorage.getItem('tokenType'),
      idToken: localStorage.getItem('idToken'),
      refreshToken: localStorage.getItem('refreshToken')
    }
  },
  reset() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
  }
}

const deserialize = (session) => ({
  accessToken: session.idToken.jwtToken,
  tokenType: "Bearer",
  idToken: session.idToken.jwtToken,
  refreshToken: session.refreshToken.token,
})