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
    localStorage.setItem('email', currentAuthUser.email);
    localStorage.setItem('plEmail', currentAuthUser.plEmail);
    localStorage.setItem('jobType', currentAuthUser.jobType);
    localStorage.setItem('fullName', currentAuthUser.fullName);
    localStorage.setItem('jobTitle', currentAuthUser.jobTitle);
    localStorage.setItem('jobId', currentAuthUser.jobId);
    localStorage.setItem('benefitLevel', currentAuthUser.benefitLevel);
    localStorage.setItem('employeeLevel', currentAuthUser.employeeLevel);
    localStorage.setItem('company', currentAuthUser.company);
    localStorage.setItem('sabaId', currentAuthUser.sabaId);
    localStorage.setItem('employeeNo', currentAuthUser.employeeNo);
    localStorage.setItem('department', currentAuthUser.department);
    localStorage.setItem('avatar', currentAuthUser.avatar);
    localStorage.setItem('benefitTitle', currentAuthUser.benefitTitle);
    localStorage.setItem('organizationLv2', currentAuthUser.organizationLv2);
    localStorage.setItem('organizationLv3', currentAuthUser.organizationLv3);
    localStorage.setItem('organizationLv4', currentAuthUser.organizationLv4);
    localStorage.setItem('organizationLv5', currentAuthUser.organizationLv5);
    localStorage.setItem('companyCode', currentAuthUser.companyCode);
    localStorage.setItem('companyLogoUrl', currentAuthUser.companyLogoUrl);
    localStorage.setItem('companyThemeColor', currentAuthUser.companyThemeColor);
    localStorage.setItem('divisionId', currentAuthUser.divisionId);
    localStorage.setItem('division', currentAuthUser.division);
    localStorage.setItem('regionId', currentAuthUser.regionId);
    localStorage.setItem('region', currentAuthUser.region);
    localStorage.setItem('unitId', currentAuthUser.unitId);
    localStorage.setItem('unit', currentAuthUser.unit);
    localStorage.setItem('partId', currentAuthUser.partId);
    localStorage.setItem('part', currentAuthUser.part);
    localStorage.setItem('role_assigment', currentAuthUser.role_assigment);

  },
  load() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    return {
      tokenType: localStorage.getItem('tokenType'),
      accessToken: localStorage.getItem('accessToken'),
      tokenExpired: localStorage.getItem('tokenExpired'),
      email: localStorage.getItem('email'),
      plEmail: localStorage.getItem('plEmail'),
      jobType: localStorage.getItem('jobType'),
      fullName: localStorage.getItem('fullName'),
      jobTitle: localStorage.getItem('jobTitle'),
      jobId: localStorage.getItem('jobId'),
      benefitLevel: localStorage.getItem('benefitLevel'),
      employeeLevel: localStorage.getItem('employeeLevel'),
      company: localStorage.getItem('company'),
      sabaId: localStorage.getItem('sabaId'),
      department: localStorage.getItem('department'),
      avatar: localStorage.getItem('avatar'),
      employeeNo: localStorage.getItem('employeeNo'),
      benefitTitle: localStorage.getItem('benefitTitle'),
      organizationLv2: localStorage.getItem('organizationLv2'),
      organizationLv3: localStorage.getItem('organizationLv3'),
      organizationLv4: localStorage.getItem('organizationLv4'),
      organizationLv5: localStorage.getItem('organizationLv5'),
      companyCode: localStorage.getItem('companyCode'),
      companyLogoUrl: localStorage.getItem('companyLogoUrl'),
      companyThemeColor: localStorage.getItem('companyThemeColor'),
      divisionId: localStorage.getItem('divisionId'),
      division: localStorage.getItem('division'),
      regionId: localStorage.getItem('regionId'),
      region: localStorage.getItem('region'),
      unitId: localStorage.getItem('unitId'),
      unit: localStorage.getItem('unit'),
      partId: localStorage.getItem('partId'),
      part: localStorage.getItem('part'),
      role_assigment: localStorage.getItem('role_assigment')
    }
  },
  reset() {
    localStorage.removeItem('tokenType');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenExpired');
    localStorage.removeItem('email');
    localStorage.removeItem('plEmail');
    localStorage.removeItem('fullName');
    localStorage.removeItem('jobTitle');
    localStorage.removeItem('jobId');
    localStorage.removeItem('benefitLevel');
    localStorage.removeItem('employeeLevel');
    localStorage.removeItem('company');
    localStorage.removeItem('sabaId');
    localStorage.removeItem('employeeNo');
    localStorage.removeItem('department');
    localStorage.removeItem('jobType');
    localStorage.removeItem('avatar');
    localStorage.removeItem('benefitTitle');
    localStorage.removeItem('organizationLv2');
    localStorage.removeItem('organizationLv3');
    localStorage.removeItem('organizationLv4');
    localStorage.removeItem('organizationLv5');
    localStorage.removeItem('companyCode');
    localStorage.removeItem('companyLogoUrl');
    localStorage.removeItem('companyThemeColor');
    localStorage.removeItem('divisionId');
    localStorage.removeItem('division');
    localStorage.removeItem('regionId');
    localStorage.removeItem('region');
    localStorage.removeItem('unitId');
    localStorage.removeItem('unit');
    localStorage.removeItem('partId');
    localStorage.removeItem('part');
    localStorage.removeItem('role_assigment');
  }
}

const deserialize = (currentAuthUser) => ({
  tokenType: 'Bearer',
  accessToken: currentAuthUser.accessToken,
  tokenExpired: currentAuthUser.tokenExpired,
  email: currentAuthUser.email,
  plEmail: currentAuthUser.plEmail,
  fullName: currentAuthUser.fullName,
  jobTitle: currentAuthUser.jobTitle,
  jobId:currentAuthUser.jobId,
  benefitLevel: currentAuthUser.benefitLevel,
  employeeLevel: currentAuthUser.employeeLevel,
  company: currentAuthUser.company,
  sabaId: currentAuthUser.sabaId,
  department: currentAuthUser.department,
  jobType: currentAuthUser.jobType,
  avatar: currentAuthUser.avatar,
  employeeNo: currentAuthUser.employeeNo,
  benefitTitle: currentAuthUser.benefitTitle,
  organizationLv2: currentAuthUser.organizationLv2,
  organizationLv3: currentAuthUser.organizationLv3,
  organizationLv4: currentAuthUser.organizationLv4,
  organizationLv5: currentAuthUser.organizationLv5,
  companyCode: currentAuthUser.companyCode,
  companyLogoUrl: currentAuthUser.companyLogoUrl,
  companyThemeColor: currentAuthUser.companyThemeColor,
  divisionId: currentAuthUser.divisionId,
  division: currentAuthUser.division,
  regionId: currentAuthUser.regionId,
  region: currentAuthUser.region,
  unitId: currentAuthUser.unitId,
  unit: currentAuthUser.unit,
  partId: currentAuthUser.partId,
  part: currentAuthUser.part,
  role_assigment: currentAuthUser.role_assigment
})