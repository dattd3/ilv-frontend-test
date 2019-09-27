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

function createStore(currentAuthUser) {
  return {
    activities: new Map(),
    currentAuthUser: currentAuthUser,
    get isAuthenticated() {
      return !!this.currentAuthUser
    },
    setIsAuth(currentAuthUser, isRemember = true) { 
      if (!currentAuthUser) return;
      this.currentAuthUser = deserialize(currentAuthUser);
      if (isRemember) Storage.save(this.currentAuthUser);
    },
    getCurentUser() {
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
  save(currentAuthUser) {
    localStorage.setItem('accessToken', currentAuthUser.accessToken);
    localStorage.setItem('tokenType', currentAuthUser.tokenType);
    localStorage.setItem('idToken', currentAuthUser.idToken);
    localStorage.setItem('refreshToken', currentAuthUser.refreshToken);
    localStorage.setItem('username', currentAuthUser.username);
    localStorage.setItem('userEmail', currentAuthUser.userEmail);
  },
  load() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    return {
      accessToken: localStorage.getItem('accessToken'),
      tokenType: localStorage.getItem('tokenType'),
      idToken: localStorage.getItem('idToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      username: localStorage.getItem('username'),
      userEmail: localStorage.getItem('userEmail')
    }
  },
  reset() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
  }
}

const deserialize = (currentAuthUser) => ({
  accessToken: currentAuthUser.signInUserSession.idToken.jwtToken,
  tokenType: "Bearer",
  idToken: currentAuthUser.signInUserSession.idToken.jwtToken,
  refreshToken: currentAuthUser.signInUserSession.refreshToken.token,
  username: currentAuthUser.attributes.name,
  userEmail: currentAuthUser.attributes.email
})