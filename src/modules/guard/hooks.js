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
    localStorage.setItem('tokenType', currentAuthUser.tokenType);
    localStorage.setItem('accessToken', currentAuthUser.accessToken);
    localStorage.setItem('tokenExpired', currentAuthUser.tokenExpired);
    localStorage.setItem('plEmail', currentAuthUser.plEmail);
    localStorage.setItem('email', currentAuthUser.email);
    localStorage.setItem('jobType', currentAuthUser.jobType);
    localStorage.setItem('fullName', currentAuthUser.fullName);
    localStorage.setItem('jobTitle', currentAuthUser.jobTitle);
    localStorage.setItem('company', currentAuthUser.company);
    localStorage.setItem('sabaId', currentAuthUser.sabaId);
    localStorage.setItem('employeeNo', currentAuthUser.employeeNo);
    localStorage.setItem('department', currentAuthUser.department);
    localStorage.setItem('location', currentAuthUser.location);
  },
  load() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    return {
      tokenType: localStorage.getItem('tokenType'),
      accessToken: localStorage.getItem('accessToken'),
      tokenExpired: localStorage.getItem('tokenExpired'),
      plEmail: localStorage.getItem('plEmail'),
      email: localStorage.getItem('email'),
      jobType: localStorage.getItem('jobType'),
      fullName: localStorage.getItem('fullName'),
      jobTitle: localStorage.getItem('jobTitle'),
      company: localStorage.getItem('company'),
      sabaId: localStorage.getItem('sabaId'),
      department: localStorage.getItem('department'),
      location: localStorage.getItem('location'),
      employeeNo: localStorage.getItem('employeeNo')
    }
  },
  reset() {
    localStorage.removeItem('tokenType');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenExpired');
    localStorage.removeItem('plEmail');
    localStorage.removeItem('email');
    localStorage.removeItem('fullName');
    localStorage.removeItem('jobTitle');
    localStorage.removeItem('company');
    localStorage.removeItem('sabaId');
    localStorage.removeItem('employeeNo');
    localStorage.removeItem('location');
    localStorage.removeItem('department');
    localStorage.removeItem('jobType');
  }
}

const deserialize = (currentAuthUser) => ({
  tokenType: 'Bearer',
  accessToken: currentAuthUser.accessToken,
  tokenExpired: currentAuthUser.tokenExpired,
  plEmail: currentAuthUser.plEmail,
  email: currentAuthUser.email,
  fullName: currentAuthUser.fullName,
  jobTitle: currentAuthUser.jobTitle,
  company: currentAuthUser.company,
  sabaId: currentAuthUser.sabaId,
  department: currentAuthUser.department,
  location: currentAuthUser.location,
  jobType: currentAuthUser.jobType,
  employeeNo: currentAuthUser.employeeNo
})