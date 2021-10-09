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
    NOTIFICATION_REJECT: 7,
    NOTIFICATION_AUTO_JOB: 8,
    NOTIFICATION_UNUSUAL_TIMESHEET: 9,
    NOTIFICATION_SHIFT_CHANGE: 10
  },

  //Tasks
  TASK_PAGE_INDEX_DEFAULT: 1,
  TASK_PAGE_SIZE_DEFAULT: 10,

  // success code
  API_SUCCESS_CODE: "000000",

  //error_code
  API_ERROR_CODE: 1,
  API_ERROR_NOT_FOUND_CODE: "404",

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
  UPDATE_PROFILE: 1,
  LEAVE_OF_ABSENCE: 2,
  BUSINESS_TRIP: 3,
  SUBSTITUTION: 4,
  IN_OUT_TIME_UPDATE: 5,
  CHNAGE_DIVISON_SHIFT: 8,
  DEPARTMENT_TIMESHEET: 9,
  ONBOARDING: 6,
  RESIGN_SELF: 7,

  //Status request
  STATUS_PENDING: 0,
  STATUS_NOT_APPROVED: 1, // từ chối phê duyệt
  STATUS_APPROVED: 2, // phê duyệt
  STATUS_EVICTION: 3, // thu hồi
  STATUS_REVOCATION: 4, // hủy
  STATUS_WAITING: 5, // chờ phê duyệt
  STATUS_CONSENTED: 20,// thẩm định
  STATUS_PARTIALLY_SUCCESSFUL: 6, //không thành công
  STATUS_NO_CONSENTED: 7, // từ chối thẩm định
  STATUS_WAITING_CONSENTED: 8, // chờ thẩm định

  STATUS_TO_SHOW_CONSENTER: [1,2,3,4,5,6,7,8],
  STATUS_TO_SHOW_APPROVER: [1,2,3,4,5,6,8],
  STATUS_USE_COMMENT: [0,1,3,4,7],
  mappingStatus: {
    1: {label: 'Rejected', className: 'fail'},//từ chối phê duyệt
    2: {label: 'Approved', className: 'success'},// đã phê duyệt
    3: {label: 'Canceled', className: ''}, // đã thu hồi
    4: {label: 'Canceled', className: ''}, // đã hủy
    5: {label: 'Waiting', className: ''}, // đang chờ phê duyệt
    6: { label: "PartiallySuccessful", className: 'warning' },
    7: {label: 'Rejected', className: ''},// từ chối thẩm định
    8: {label: 'Waiting', className: ''}, // đang chờ thẩm định
    20:{ label: "Consented", className: '' }
  },

  mappingStatusRequest: {
    1: { label: 'Rejected', className: 'fail' },
    2: { label: 'Approved', className: 'success' },
    3: { label: 'Canceled', className: '' },
    4: { label: 'Canceled', className: '' },
    5: { label: "PendingApproval", className: '' },
    6: { label: "PartiallySuccessful", className: 'warning' },
    7: { label: "Rejected", className: 'fail' },
    8: { label: "PendingConsent", className: '' },
    20:{ label: "Consented", className: '' }
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
      TitleLeave: 'Thông tin chỉnh sửa đăng ký nghỉ',
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

  // user level
  CONSENTER_LIST_LEVEL : ["C2", "C1", "P2", "P1", "T4", "T3", "T2", "T1", "T0"],
  APPROVER_LIST_LEVEL :  ["C2", "C1", "P2", "P1", "T4", "T3", "T2", "T1", "T0"],
  CONSENTER_LIST_LEVEL_V073 : ["M0", "M1", "M2", "M3", "C2", "C1", "P2", "P1", "T4", "T3", "T2", "T1", "T0"],

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
    SUMARY_REPORT: 1
  }
};
export default Constants
