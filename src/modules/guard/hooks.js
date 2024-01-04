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
    localStorage.setItem('refreshToken', currentAuthUser.refreshToken);
    localStorage.setItem('email', currentAuthUser.email);
    localStorage.setItem('plEmail', currentAuthUser.plEmail);
    localStorage.setItem('jobType', currentAuthUser.jobType);
    localStorage.setItem('fullName', currentAuthUser.fullName);
    localStorage.setItem('jobTitle', currentAuthUser.jobTitle);
    localStorage.setItem('jobId', currentAuthUser.jobId);
    localStorage.setItem('benefitLevel', currentAuthUser.benefitLevel);
    localStorage.setItem('employeeLevel', currentAuthUser.employeeLevel);
    localStorage.setItem('actualRank', currentAuthUser.actualRank);
    localStorage.setItem('company', currentAuthUser.company);
    localStorage.setItem('sabaId', currentAuthUser.sabaId);
    localStorage.setItem('employeeNo', currentAuthUser.employeeNo);
    localStorage.setItem('department', currentAuthUser.department);
    localStorage.setItem('avatar', currentAuthUser.avatar);
    localStorage.setItem('benefitTitle', currentAuthUser.benefitTitle);
    localStorage.setItem('organizationLvId', currentAuthUser.organizationLvId);
    localStorage.setItem('organizationLv1', currentAuthUser.organizationLv1);
    localStorage.setItem('organizationLv2', currentAuthUser.organizationLv2);
    localStorage.setItem('organizationLv3', currentAuthUser.organizationLv3);
    localStorage.setItem('organizationLv4', currentAuthUser.organizationLv4);
    localStorage.setItem('organizationLv5', currentAuthUser.organizationLv5);
    localStorage.setItem('organizationLv6', currentAuthUser.organizationLv6);
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
    localStorage.setItem('prepare', currentAuthUser.prepare);
    localStorage.setItem('jobCode', currentAuthUser.jobCode);
    localStorage.setItem('actualDepartment', currentAuthUser.actualDepartment);
    localStorage.setItem('ad', currentAuthUser.ad);
    localStorage.setItem('master_code', currentAuthUser.master_code);
    localStorage.setItem('cost_center', currentAuthUser.cost_center);
    localStorage.setItem('insurance_number', currentAuthUser.insurance_number);
    localStorage.setItem('cell_phone_no', currentAuthUser.cell_phone_no);
    localStorage.setItem('orgshort_lv2', currentAuthUser.orgshort_lv2);
    localStorage.setItem('orgshort_lv3', currentAuthUser.orgshort_lv3);
    localStorage.setItem('orgshort_lv4', currentAuthUser.orgshort_lv4);
    localStorage.setItem('streetName', currentAuthUser.streetName);
    localStorage.setItem('essAvaible', currentAuthUser.essAvaible);
    localStorage.setItem('taxEnable', currentAuthUser.taxEnable);
  },
  load() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    return {
      tokenType: localStorage.getItem('tokenType'),
      accessToken: localStorage.getItem('accessToken'),
      tokenExpired: localStorage.getItem('tokenExpired'),
      refreshToken: localStorage.getItem('refreshToken'),
      email: localStorage.getItem('email'),
      plEmail: localStorage.getItem('plEmail'),
      jobType: localStorage.getItem('jobType'),
      fullName: localStorage.getItem('fullName'),
      jobTitle: localStorage.getItem('jobTitle'),
      jobId: localStorage.getItem('jobId'),
      benefitLevel: localStorage.getItem('benefitLevel'),
      employeeLevel: localStorage.getItem('employeeLevel'),
      actualRank: localStorage.getItem('actualRank'),
      company: localStorage.getItem('company'),
      sabaId: localStorage.getItem('sabaId'),
      department: localStorage.getItem('department'),
      avatar: localStorage.getItem('avatar'),
      employeeNo: localStorage.getItem('employeeNo'),
      benefitTitle: localStorage.getItem('benefitTitle'),
      organizationLvId: localStorage.getItem('organizationLvId'),
      organizationLv1: localStorage.getItem('organizationLv1'),
      organizationLv2: localStorage.getItem('organizationLv2'),
      organizationLv3: localStorage.getItem('organizationLv3'),
      organizationLv4: localStorage.getItem('organizationLv4'),
      organizationLv5: localStorage.getItem('organizationLv5'),
      organizationLv6: localStorage.getItem('organizationLv6'),
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
      role_assigment: localStorage.getItem('role_assigment'),
      prepare: localStorage.getItem('prepare'),
      jobCode: localStorage.getItem('jobCode'),
      actualDepartment: localStorage.getItem('actualDepartment'),
      ad: localStorage.getItem('ad'),
      master_code: localStorage.getItem('master_code'),
      cost_center: localStorage.getItem('cost_center'),
      insurance_number: localStorage.getItem('insurance_number'),
      cell_phone_no: localStorage.getItem('cell_phone_no'),
      orgshort_lv2: localStorage.getItem('orgshort_lv2'),
      orgshort_lv3: localStorage.getItem('orgshort_lv3'),
      orgshort_lv4: localStorage.getItem('orgshort_lv4'),
      streetName: localStorage.getItem('streetName'),
      essAvaible: localStorage.getItem('essAvaible'),
      taxEnable: localStorage.getItem('taxEnable')
    }
  },
  reset() {
    localStorage.removeItem('tokenType');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenExpired');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isCancelRefreshToken');
    // localStorage.removeItem('email');
    localStorage.removeItem('plEmail');
    localStorage.removeItem('fullName');
    localStorage.removeItem('jobTitle');
    localStorage.removeItem('jobId');
    localStorage.removeItem('benefitLevel');
    localStorage.removeItem('employeeLevel');
    localStorage.removeItem('actualRank');
    localStorage.removeItem('company');
    localStorage.removeItem('sabaId');
    localStorage.removeItem('employeeNo');
    localStorage.removeItem('department');
    localStorage.removeItem('jobType');
    localStorage.removeItem('avatar');
    localStorage.removeItem('benefitTitle');
    localStorage.removeItem('organizationLvId');
    localStorage.removeItem('organizationLv1');
    localStorage.removeItem('organizationLv2');
    localStorage.removeItem('organizationLv3');
    localStorage.removeItem('organizationLv4');
    localStorage.removeItem('organizationLv5');
    localStorage.removeItem('organizationLv6');
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
    localStorage.removeItem('prepare');
    localStorage.removeItem('jobCode');
    localStorage.removeItem('actualDepartment');
    localStorage.removeItem('ad');
    localStorage.removeItem('master_code');
    localStorage.removeItem("user-guides")
    localStorage.removeItem('cost_center');
    localStorage.removeItem('insurance_number');
    localStorage.removeItem('cultureMenu');
    localStorage.removeItem('cell_phone_no');
    localStorage.removeItem('orgshort_lv2');
    localStorage.removeItem('orgshort_lv3');
    localStorage.removeItem('orgshort_lv4');
    localStorage.removeItem('streetName');
    localStorage.removeItem('essAvaible');
    localStorage.removeItem('taxEnable');
  }
}

const deserialize = (currentAuthUser) => ({
  tokenType: 'Bearer',
  accessToken: currentAuthUser.accessToken,
  tokenExpired: currentAuthUser.tokenExpired,
  refreshToken: currentAuthUser.refreshToken,
  email: currentAuthUser.email,
  plEmail: currentAuthUser.plEmail,
  fullName: currentAuthUser.fullName,
  jobTitle: currentAuthUser.jobTitle,
  jobId:currentAuthUser.jobId,
  benefitLevel: currentAuthUser.benefitLevel,
  employeeLevel: currentAuthUser.employeeLevel,
  actualRank: currentAuthUser.actualRank,
  company: currentAuthUser.company,
  sabaId: currentAuthUser.sabaId,
  department: currentAuthUser.department,
  jobType: currentAuthUser.jobType,
  avatar: currentAuthUser.avatar,
  employeeNo: currentAuthUser.employeeNo,
  benefitTitle: currentAuthUser.benefitTitle,
  organizationLvId: currentAuthUser.organizationLvId,
  organizationLv1: currentAuthUser.organizationLv1,
  organizationLv2: currentAuthUser.organizationLv2,
  organizationLv3: currentAuthUser.organizationLv3,
  organizationLv4: currentAuthUser.organizationLv4,
  organizationLv5: currentAuthUser.organizationLv5,
  organizationLv6: currentAuthUser.organizationLv6,
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
  role_assigment: currentAuthUser.role_assigment,
  prepare: currentAuthUser.prepare,
  jobCode: currentAuthUser.jobCode,
  actualDepartment: currentAuthUser.actualDepartment,
  ad: currentAuthUser.ad,
  master_code: currentAuthUser.master_code,
  cost_center: currentAuthUser.cost_center,
  insurance_number: currentAuthUser.insurance_number,
  cell_phone_no: currentAuthUser.cell_phone_no,
  orgshort_lv2: currentAuthUser.orgshort_lv2,
  orgshort_lv3: currentAuthUser.orgshort_lv3,
  orgshort_lv4: currentAuthUser.orgshort_lv4,
  streetName: currentAuthUser.streetName,
  essAvaible: currentAuthUser.essAvaible,
  taxEnable: currentAuthUser.taxEnable
})