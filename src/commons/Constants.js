const Constants = {
  //Notification
  NOTIFICATION_PAGE_INDEX_DEFAULT: 1,
  NOTIFICATION_PAGE_SIZE_DEFAULT: 8,
  notificationType: {
    NOTIFICATION_DEFAULT: 0,
    NOTIFICATION_REGISTRATION: 1,
    NOTIFICATION_NEWS: 2,
    NOTIFICATION_HAPPY_BIRTHDAY: 3,
    NOTIFICATION_TRAINING_INFORMATION: 4,
    NOTIFICATION_OTHER: 5,
    NOTIFICATION_MISSING_DOC: 6,
    NOTIFICATION_APPROVED: 7,
    NOTIFICATION_AUTO_JOB: 8,
    NOTIFICATION_UNUSUAL_TIMESHEET: 9,
    NOTIFICATION_SHIFT_CHANGE: 10,
    NOTIFICATION_ADD_MEMBER_TO_PROJECT: 19,
    NOTIFICATION_MY_EVALUATION: 21,
    NOTIFICATION_LEAD_EVALUATION: 22,
    NOTIFICATION_MY_KPI_REGISTRATION_REQUEST: 23,
    NOTIFICATION_MY_KPI_REGISTRATION_APPROVAL_REQUEST: 24,
  },

  //Tasks
  TASK_PAGE_INDEX_DEFAULT: 1,
  TASK_PAGE_SIZE_DEFAULT: 10,

  // success code
  API_SUCCESS_CODE: "000000",
  PMS_API_SUCCESS_CODE: "200",

  //error_code
  API_ERROR_CODE: 1,
  API_ERROR_NOT_FOUND_CODE: "404",
  API_ERROR_CODE_WORKING_DAY_LOCKED: 2,

  // file_type
  PDF_FILE_TYPE: 'pdf',
  DOC_FILE_TYPE: 'doc',
  XLS_FILE_TYPE: 'xls',
  ZIP_FILE_TYPE: 'zip',
  IMAGE_FILE_TYPE: 'img',
  AUDIO_FILE_TYPE: 'audio',
  VIDEO_FILE_TYPE: 'video',
  OTHER_FILE_TYPE: 'other',
  KEY_PHONES_SUPPORT_LOCAL_STORAGE: 'phonesSupport',

  //Type request
  UPDATE_PROFILE: 1, // Cap nhat thong tin ca nhan
  LEAVE_OF_ABSENCE: 2,  // Dang ky nghi
  BUSINESS_TRIP: 3, // CTDT
  SUBSTITUTION: 4, // Phan ca
  IN_OUT_TIME_UPDATE: 5, // In out 
  CHANGE_DIVISON_SHIFT: 8, // Thay doi phan ca bo phan
  DEPARTMENT_TIMESHEET: 9, // Bang cham cong bo phan
  ONBOARDING: 6, // Danh gia hop dong
  RESIGN_SELF: 7, // De nghi cham dut hop dong
  SALARY_PROPOSE: 12, // De xuat luong
  OT_REQUEST: 13, // OT
  PROPOSAL_TRANSFER: 14, // Dieu chuyen
  PROPOSAL_APPOINTMENT: 15, // Bo nhiem, mien nhiem
  WELFARE_REFUND: 16, // Hoàn trả dịch vụ phúc lợi
  INSURANCE_SOCIAL: 20, //bảo hiểm xã hội
  INSURANCE_SOCIAL_INFO: 21, // thông tin đóng BHXH
  SOCIAL_SUPPORT: 22, // yêu cầu hỗ trợ liên quan BH

  //Status request
  STATUS_PENDING: 0,
  STATUS_NOT_APPROVED: 1, // từ chối phê duyệt
  STATUS_APPROVED: 2, // phê duyệt
  STATUS_EVICTION: 3, // thu hồi
  STATUS_REVOCATION: 4, // hủy
  STATUS_WAITING: 5, // chờ phê duyệt
  STATUS_PARTIALLY_SUCCESSFUL: 6, //không thành công
  STATUS_NO_CONSENTED: 7, // từ chối thẩm định
  STATUS_WAITING_CONSENTED: 8, // chờ thẩm định
  STATUS_CONSENTED: 20,// thẩm định
  STATUS_TRANSFER_REFUSE: 9998,
  STATUS_TRANSFER: 9999,
  STATUS_OB_SELF_EVALUATION: 9,
  STATUS_OB_APPRAISER_EVALUATION: 10,
  STATUS_OB_SUPERVISOR_EVALUATION: 11,
  STATUS_OB_HR_EVALUATION: 12,
  STATUS_OB_APPROVER_EVALUATION: 13,
  STATUS_WORK_DAY_LOCKED_CREATE: 101,
  STATUS_WORK_DAY_LOCKED_APPRAISAL: 102,
  STATUS_WORK_DAY_LOCKED_APPROVAL: 103,

  STATUS_USE_COMMENT: [0,1,3,4,7, 9998],

  mappingStatusRequest: {
    1: { label: 'Rejected', className: 'fail' },
    2: { label: 'Approved', className: 'success' },
    3: { label: 'Canceled', className: '' },
    4: { label: 'Canceled', className: '' },
    5: { label: "PendingApproval", className: '' },
    6: { label: "PartiallySuccessful", className: 'warning' },
    7: { label: "Rejected", className: 'fail' },
    8: { label: "PendingConsent", className: '' },
    20:{ label: "Consented", className: '' },
    0: {label: "Waiting", className: ''},
    101: { label: "PaidDayLocked", className: 'work-day_locked' },
    102: { label: "PaidDayLocked", className: 'work-day_locked' },
    103: { label: "PaidDayLocked", className: 'work-day_locked' },
  },
  //
  mappingActionType : {
    'INS': {
      TitleLeave: 'LeaveRequestInformation',
      TitleTripAndTrainning: 'Thông tin đăng ký công tác/đào tạo',
      ReasonTripAndTrainning: 'Lý do đăng ký công tác/đào tạo',
      ReasonRequestLeave: 'ReasonLeaveRequest'
    },
    'MOD': {
      TitleLeave: 'Thông tin điều chỉnh đăng ký nghỉ',
      TitleTripAndTrainning: 'Thông tin chỉnh sửa đăng ký công tác/đào tạo',
      ReasonTripAndTrainning: 'Lý do chỉnh sửa đăng ký công tác/đào tạo',
      ReasonRequestLeave: 'ReasonEditLeaveRequest'
    },
    'DEL': {
      TitleLeave: 'LeaveRequestInformation',
      TitleTripAndTrainning: 'Thông tin đăng ký công tác/đào tạo',
      ReasonTripAndTrainning: 'Lý do hủy đăng ký công tác/đào tạo',
      ReasonRequestLeave: 'ReasonCancelLeaveRequest'
    }
  },

  //DateTime
  DATE_OF_SAP_FORMAT: 'YYYYMMDD',
  TIME_OF_SAP_FORMAT: 'HHmm00',
  IN_OUT_TIME_FORMAT: 'HH:mm:ss',
  IN_OUT_DATE_FORMAT: 'DD-MM-YYYY',
  SUBSTITUTION_TIME_OF_SAP_FORMAT: 'HHmm00',
  SUBSTITUTION_TIME_FORMAT: 'HH:mm:00',
  SUBSTITUTION_DATE_FORMAT: 'DD-MM-YYYY',
  SUBSTITUTION_SHIFT_CODE: 1,
  SUBSTITUTION_SHIFT_UPDATE: 2,
  LEAVE_TIME_FORMAT: 'HH:mm',
  LEAVE_DATE_FORMAT: 'DD/MM/YYYY',
  LEAVE_TIME_FORMAT_TO_VALIDATION: 'HHmm00',
  LEAVE_FULL_DAY: 1,
  BUSINESS_TRIP_TIME_FORMAT: 'HH:mm',
  BUSINESS_TRIP_DATE_FORMAT: 'DD/MM/YYYY',
  SUBSTITUTION_TPKLA_FULL_DAY: 1,
  SUBSTITUTION_TPKLA_HALF_DAY: 2,
  SHIFT_CODE_OFF:  'OFF',
  // user level
  //CONSENTER_LIST_LEVEL : ["C1", "P2", "P1", "T4", "T3", "T2", "T1", "T0"],
  CONSENTER_LIST_LEVEL : ["C1", "T7", "P2", "T6", "P1", "T5", "T4", "T3", "T2", "T1", "T0"],
  APPROVER_LIST_LEVEL :  ["C1", "T7", "P2","T6", "P1","T5", "T4", "T3", "T2", "T1", "T0"],
  //CONSENTER_LIST_LEVEL_V073 : ["M0", "M1", "M2", "M3", "C1", "P2", "P1", "T4", "T3", "T2", "T1", "T0"],
  APPROVAL_DELEGATION_LIST_LEVEL : ["T3", "T2", "T1", "T0"],

  //other
  QAAlreadyExist: "QAAlreadyExist",

  // Ticket
  SOLVER_MANAGER: 1,
  SOLVER_RESOURCE: 2,
  SOLVER_TCKT: 3,

  ROLE_ASSIGMENT_APPROVE: ["ZCPS_CBLD_CC", "ZCPS_QLNSTD", "ZCPS_QLCPNL", "CVNS"],
  DATE_TYPE: {
    DATE_OFFSET: 0,
    DATE_NORMAL: 1,
    DATE_OFF: 2
  },
  TYPE_REPORT: {
    DETAIL_REPORT: 0,
    SUMARY_REPORT: 1,
    TIMESHEET_REPORT: 2
  },
  pnlVCode: {
    VinHome: "V040",
    VinBrain: "V095",
    VinPearl: "V030",
    MeliaVinpearl: "V035",
    VinMec: "V060",
    VinSchool: "V061",
    Vin3S: "V005",
    VincomRetail: "V053",
    VinSmart: "V073",
    VinSoftware: "V096",
    VinFast: "V070",
    VinFastTrading: "V077",
    VinITIS: "V097",
    VinUni: "V066",
    VinAI: "V099",
    VinBus: "V033",
    VinES: "V079",
    VinBigData: "V098",
    VinCon: "V041",
    VinHoliday1: "V036",
  },
  listFunctionsForPnLACL: {
    editProfile: 'EDIT_PROFILE',
    editEducation: 'EDIT_EDUCATION',
    editRelationship: 'EDIT_RELATIONSHIP',
    qnA: 'QnA',
    changeStaffShift: 'CHANGE_STAFF_SHIFT',
    selectWorkingShift24h: 'SELECT_WORKING_SHIFT_24H',
    foreignSickLeave: "FOREIGN_SICK_LEAVE"
  },
  // PnLCODE: {
  //   Vinhome: "V040",
  //   Vinbrain: "V095",
  //   Vinpearl: "V030",
  //   MeliaVinpearl: "V035",
  //   Vinmec: "V060",
  //   VinSchool: "V061",
  //   VinFast: "V070",
  //   VinFastTrading: "V077",
  //   VinFastPB: "V070",
  //   Vin3S: "V005",
  //   VinES: "V079",
  //   Vincon: "V041",
  //   VinBus: "V033",
  // },
  LOGIN_INSTRUCTION_PATH: "https://myvinpearl.s3.ap-southeast-1.amazonaws.com/shared/templates/ILOVEVINGROUP-HDDang+nhap-LoginInstruction.pdf",
  statusUserActiveMulesoft: 3,
  PAGE_INDEX_DEFAULT: 1,
  PAGE_SIZE_DEFAULT: 10,
  // Register and Proposed contract termination
  REGISTER_CONTRACT_TERMINATION_CODE: 1,
  PROPOSED_CONTRACT_TERMINATION_CODE: 2,
  GROUP_EMAIL_EXTENSION: '@vingroup.net',
  timeoutForSpecificApis: 180000,
  LANGUAGE_VI: 'vi-VN',
  LANGUAGE_EN: 'en-US',
  SALARY_APPRAISER_STATUS: {
    NO_AVAILABE: 0,
    APPRAISED: 1,
    WAITING: 2
  },
  MODULE: {
    TUYENDUNG: 1,
    DANHGIA_TAIKI: 2,
    DEXUATLUONG:3,
    NGHIVIEC:4,
    PHUCLOI: 5,
    DIEUCHUYEN: 6,
    BONHIEM: 7,
    THANHTOAN_NOIBO: 8,
    BAOHIEM: 9
  },
  MODULE_COMPANY_AVAILABE: process.env.REACT_APP_ENVIRONMENT === 'PRODUCTION' ? 
  { //production todo: add  "V077", "V070" to TUYENDUNG
    1: ["V040", "V005", "V079", "V041", "V030", "V035", "V036", "V077", "V070", "V099"],//TUYENDUNG + V061
    2: ["V040", "V005", "V061", "V077", "V070", "V099"],//DANHGIA_TAIKI
    3: [],//DEXUATLUONG
    4: ["V040", "V077", "V070"],//NGHIVIEC
    5: ["V077", "V070"],//PHUCLOI
    6: ["V077", "V070"], //DIEUCHUYEN
    7: ["V077", "V070"], //BONHIEM,
    8: [], //THANHTOAN_NOIBO
    9: ["V061"],//BAOHIEM
  } :
  { //Development
    1: ["V040", "V005", "V079", "V041", "V030", "V035", "V036", "V077", "V070", "V099"],//TUYENDUNG + V061
    2: ["V061","V040", "V005", "V079", "V041", "V070", "V077", "V099"],//DANHGIA_TAIKI
    3: [],//DEXUATLUONG "V061", "V040", "V005", "V079", "V041", "V070", "V077"
    4: ["V040", "V005", "V079", "V070", "V077"],//NGHIVIEC
    5: ["V061", "V040", "V005", "V079", "V041", "V070", "V077"],//PHUCLOI
    6: ["V040", "V070", "V077"], //DIEUCHUYEN
    7: ["V040", "V070", "V077"], //BONHIEM
    8: ["V040", "V070", "V077", "V030"], //THANH TOAN NOI BO
    9: ["V077", "V070", "V061", "V079"],//BAOHIEM
  },
  CURRENCY: {
    VND: 'VNĐ',
    USD: 'USD',
  },
  RESIGN_REASON_EMPLOYEE_INVALID: ["GI", "GL", "GM", "GN", "GO"],
  VFSX_SHIFT_ID_VALID: ["7003", "7007", "7008", "7009", "7075", "OFF"],
  GENDER: {
    MALE: '1',
    FEMALE: '2',
  },
  MARRIAGE_STATUS: {
    SINGLE: '0',
    MARRIED: '1',
    DIVORCED: '2',
  },
  STATUS_PROPOSAL: {
    EMPLOYEE: 0,
    LEADER_APPRAISER: 1,
    EMPLOYEE_APPRAISER: 2,
    CONSENTER: 3,
  },
  OPERATION_TYPES: {
    INS: "INS",
    MOD: "MOD",
    DEL: "DEL",
  },
  TIME_DEBOUNCE_FOR_SEARCH: 1400,
  MAINTENANCE: {
    APP_ID: 1,
    DEVICE: 'WEBSITE',
    MODE: 2,
  },
  tabListRequestMapping: {
    REQUEST: 'request',
    APPROVAL: 'approval',
    APPRAISAL: 'consent',
  },
  ORG_ID_VINPEARL: process.env.REACT_APP_ENVIRONMENT === 'PRODUCTION' ? '45001013' : '45001013',
  ORG_ID_VINPEARL_MELIA: process.env.REACT_APP_ENVIRONMENT === 'PRODUCTION' ? '45033560' : '45001263'
}

Constants.REQUEST_CATEGORY_1_LIST = {
  [Constants.LEAVE_OF_ABSENCE]: "LeaveRequest",
  [Constants.BUSINESS_TRIP]: "BizTrip_TrainingRequest",
  [Constants.SUBSTITUTION]: "ShiftChange",
  [Constants.IN_OUT_TIME_UPDATE]: "InOutChangeRequest",
  [Constants.UPDATE_PROFILE]: "EditBasicProfile",
  [Constants.ONBOARDING]: "ContractEvaluationType",
  [Constants.RESIGN_SELF]: "ResignationType",
  [Constants.OT_REQUEST]: "OTRequest",
  [Constants.CHANGE_DIVISON_SHIFT]: "AdminUploadShiftChange",
  [Constants.DEPARTMENT_TIMESHEET]: "DepartmentTimesheet",
  [Constants.WELFARE_REFUND]: "WelfareRefund"
}

Constants.REQUEST_CATEGORY_2_LIST = {
  // [Constants.SALARY_PROPOSE]: "SalaryType",
  [Constants.PROPOSAL_TRANSFER]: "ProposalTransfer",
  [Constants.PROPOSAL_APPOINTMENT]: "AppointmentDismissalRequest",
  [Constants.INSURANCE_SOCIAL]: "InsuranceSocialRequest",
  [Constants.INSURANCE_SOCIAL_INFO]: "InsuranceSocialInfoRequest",
  [Constants.SOCIAL_SUPPORT]: "social_support_info",

}

Constants.REQUEST_CATEGORY_1_LIST_ORDER = [Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP, Constants.SUBSTITUTION, Constants.IN_OUT_TIME_UPDATE, Constants.UPDATE_PROFILE,
  Constants.ONBOARDING, Constants.RESIGN_SELF, Constants.OT_REQUEST, Constants.CHANGE_DIVISON_SHIFT, Constants.DEPARTMENT_TIMESHEET, Constants.WELFARE_REFUND]

export default Constants
