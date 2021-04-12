const Constants = {
  //Notification
  NOTIFICATION_PAGE_INDEX_DEFAULT: 1,
  NOTIFICATION_PAGE_SIZE_DEFAULT: 8,

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
  LEAVE_OF_ABSENCE: 2,
  BUSINESS_TRIP: 3,
  SUBSTITUTION: 4,
  IN_OUT_TIME_UPDATE: 5,

  //Status request
  STATUS_PENDING: 0,
  STATUS_NOT_APPROVED: 1, // từ chối phê duyệt
  STATUS_APPROVED: 2, // phê duyệt
  STATUS_EVICTION: 3, // thu hồi
  STATUS_REVOCATION: 4, // hủy
  STATUS_WAITING: 5, // chờ phê duyệt
  STATUS_CONSENTED: 6,// thẩm định
  STATUS_NO_CONSENTED: 7, // từ chối thẩm định
  STATUS_WAITING_CONSENTED: 8, // chờ thẩm định

  STATUS_TO_SHOW_CONSENTER: [1,2,3,4,5,7],
  STATUS_TO_SHOW_APPROVER: [1,2,3,4,5],
  mappingStatus: {
    1: {label: 'Từ chối', className: 'fail'},//từ chối phê duyệt
    2: {label: 'Approved', className: 'success'},// đã phê duyệt
    3: {label: 'Đã hủy', className: ''}, // đã thu hồi
    4: {label: 'Đã hủy', className: ''}, // đã hủy
    5: {label: 'Waiting', className: ''}, // đang chờ phê duyệt
    6: {label: 'Đã thẩm định', className: ''},
    7: {label: 'Từ chối', className: ''},// từ chối thẩm định
    8: {label: 'Waiting', className: ''} // đang chờ thẩm định
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

  //other
  QAAlreadyExist: "QAAlreadyExist",
};
export default Constants
