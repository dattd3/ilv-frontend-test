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
    setActivity(activity, hasAccess) {
      this.activities.set(activity, hasAccess);
    },
    canAccess(activity) {
      return this.activities.has(activity) && !!this.activities.get(activity);
    }
  };
}

const Storage = {
  save(session) {
    localStorage.setItem('accessToken', session.idToken.jwtToken);
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
  }
}

const deserialize = (session) => ({
  accessToken: session.accessToken.jwtToken,
  tokenType: "Bearer",
  idToken: session.idToken.jwtToken,
  refreshToken: session.refreshToken.token,
})