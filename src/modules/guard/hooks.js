import { createContext, useContext } from "react";
import { useLocalStore } from "mobx-react-lite";

export const GuardContext = createContext();

export const useGuardStore = () => {
  return useContext(GuardContext);
};

export const useCreateLocalGuardStore = () => {
  const store = useLocalStore(createStore);
  return store;
};

function createStore() {
  return {
    isAuthenticated: false,
    activities: new Map(),
    setIsAuth(isAuthenticated) {
      this.isAuthenticated = isAuthenticated;
    },
    setActivity(activity, hasAccess) {
      this.activities.set(activity, hasAccess);
    },
    canAccess(activity) {
      return this.activities.has(activity) && !!this.activities.get(activity);
    }
  };
}