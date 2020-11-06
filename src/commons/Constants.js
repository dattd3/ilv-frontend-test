const Constants = {
  NOTIFICATION_PAGE_INDEX_DEFAULT: 1,
  NOTIFICATION_PAGE_SIZE_DEFAULT: 8,
  API_ERROR_CODE: 1,
  PDF_FILE_TYPE: 'pdf',
  DOC_FILE_TYPE: 'doc',
  XLS_FILE_TYPE: 'xls',
  ZIP_FILE_TYPE: 'zip',
  IMAGE_FILE_TYPE: 'img',
  AUDIO_FILE_TYPE: 'audio',
  VIDEO_FILE_TYPE: 'video',
  OTHER_FILE_TYPE: 'other',
  KEY_PHONES_SUPPORT_LOCAL_STORAGE: 'phonesSupport',
  LEAVE_OF_ABSENCE: 2,
  BUSINESS_TRIP: 3,
  SUBSTITUTION: 4,
  IN_OUT_TIME_UPDATE: 5,
  STATUS_PENDING: 0,
  STATUS_NOT_APPROVED: 1,
  STATUS_APPROVED: 2,
  STATUS_EVICTION: 3,
  mappingStatus: {
    0: {label: 'Đang chờ xử lý', className: ''},
    1: {label: 'Không phê duyệt', className: 'fail'},
    2: {label: 'Đã phê duyệt', className: 'success'},
    3: {label: 'Đã thu hồi', className: ''}
  }
};
export default Constants
