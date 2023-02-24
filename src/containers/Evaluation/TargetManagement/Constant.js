import Constants from '../../../commons/Constants'

const REQUEST_STATUS = {
  DRAFT: 1,
  PROCESSING: 2,
  APPROVED: 3,
  REJECT: 4
}
const STATUS_DELETEABLE = [REQUEST_STATUS.DRAFT];
const STATUS_EDITABLE = [REQUEST_STATUS.DRAFT, REQUEST_STATUS.REJECT];
const STATUS_EDITABLE_APPROVE_TAB = [REQUEST_STATUS.PROCESSING];

const REGISTER_TYPES = {
  MANUAL: 0,
  LIBRARY: 1
}

const TABS = {
  OWNER: "OWNER",
  REQUEST: "REQUEST",
};

const STATUS_TYPES = {
  DELETE: 'Delete',
  APPROVE: 'Approve',
  REJECT: 'Reject'
};

const TARGET_INITIAL_DATA = {
  targetName: "",
  metric1: "",
  metric2: "",
  metric3: "",
  metric4: "",
  metric5: "",
  weight: "",
  jobDetail: "",
  target: "",
  fillByHr: false
};

const MODAL_TYPES = {
  REGISTER_MANUAL: REGISTER_TYPES.MANUAL,
  REGISTER_LIBRARY: REGISTER_TYPES.LIBRARY,
  FAIL: 3,
  SUCCESS: 4,
  DELETE_CONFIRM: 5,
  APPROVE_CONFIRM: 6,
  REJECT_CONFIRM: 7
};

const LANGUAGE_CODE_MAPPING = {
  [Constants.LANGUAGE_VI]: 'vi',
  [Constants.LANGUAGE_EN]: 'en',
}

const getUserInfo = () => ({
  account: localStorage.getItem("email")?.split("@")?.[0],
  fullName: localStorage.getItem("fullName"),
  employeeLevel: localStorage.getItem("actualRank"),
  EmployeeNo: localStorage.getItem("employeeNo"),
  jobCode: localStorage.getItem("jobCode"),
  current_position: localStorage.getItem("jobTitle"),
  department: localStorage.getItem("department"),
  organizationLv1: localStorage.getItem("organizationLv1"),
  organizationLv2: localStorage.getItem("organizationLv2"),
  organizationLv3: localStorage.getItem("organizationLv3"),
  organizationLv4: localStorage.getItem("organizationLv4"),
  organizationLv5: localStorage.getItem("organizationLv5"),
  organizationLv6: localStorage.getItem("organizationLv6"),
});

const CHECK_PHASE_LIST_ENDPOINT = `${process.env.REACT_APP_HRDX_PMS_URL}api/checkphase/list`;
const FETCH_TARGET_LIST_ENDPOINT = `${process.env.REACT_APP_HRDX_PMS_URL}api/targetregist/list`;
const CREATE_TARGET_REGISTER = `${process.env.REACT_APP_HRDX_PMS_URL}api/target/regist`;
const UPDATE_STATUS_TARGET_ENDPOINT = `${process.env.REACT_APP_HRDX_PMS_URL}api/targetregist/updatestatus`;

export {
  STATUS_DELETEABLE,
  STATUS_EDITABLE,
  TABS,
  CHECK_PHASE_LIST_ENDPOINT,
  FETCH_TARGET_LIST_ENDPOINT,
  TARGET_INITIAL_DATA,
  CREATE_TARGET_REGISTER,
  getUserInfo,
  UPDATE_STATUS_TARGET_ENDPOINT,
  STATUS_EDITABLE_APPROVE_TAB,
  MODAL_TYPES,
  STATUS_TYPES,
  REGISTER_TYPES,
  REQUEST_STATUS,
  LANGUAGE_CODE_MAPPING,
};
