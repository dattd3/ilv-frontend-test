import Constants from "../../commons/Constants"

const ANNUAL_LEAVE_KEY = "PQ01"
const COMPENSATORY_LEAVE_KEY = "PQ02"
const ADVANCE_COMPENSATORY_LEAVE_KEY = "PQ03"
const ADVANCE_ABSENCE_LEAVE_KEY = "PQ04"
const MATERNITY_LEAVE_KEY = "IN02"
const MARRIAGE_FUNERAL_LEAVE_KEY = "PN03"
const MOTHER_LEAVE_KEY = 'PN02'
const FOREIGN_SICK_LEAVE = 'PQ06'
const VIN_UNI_SICK_LEAVE = 'PQ07'
const VIN_SCHOOL_SICK_LEAVE = 'PQ08'

const absenceRequestTypes = [
  { value: 'IN01', label: 'SickLeave' },
  { value: MATERNITY_LEAVE_KEY, label: 'MaternityLeave' },
  { value: 'IN03', label: 'RecoveryLeave' },
  { value: 'PN01', label: 'LeaveForExpats' },
  { value: MOTHER_LEAVE_KEY, label: "LeaveForMother" },
  { value: MARRIAGE_FUNERAL_LEAVE_KEY, label: 'LeaveForMarriageFuneral' },
  // { value: 'PN04', label: 'LeaveForWorkAccidentOccupationalDisease' },
  { value: ANNUAL_LEAVE_KEY, label: 'AnnualLeaveYear' },
  { value: ADVANCE_ABSENCE_LEAVE_KEY, label: "AdvancedLeave" },
  { value: COMPENSATORY_LEAVE_KEY, label: 'ToilIfAny' },
  // { value: ADVANCE_COMPENSATORY_LEAVE_KEY, label: 'AdvancedTOIL' },
  { value: 'UN01', label: 'UnpaidLeave' },
  { value: FOREIGN_SICK_LEAVE, label: 'ForeignSickLeave' },
  { value: VIN_UNI_SICK_LEAVE, label: 'VinUniSickLeave' },
  { value: VIN_SCHOOL_SICK_LEAVE, label: 'VinSchoolSickLeave' },
]

const requestTypes = [
  { value: [Constants.UPDATE_PROFILE], label: 'EditBasicProfile' },
  { value: [Constants.LEAVE_OF_ABSENCE], label: 'LeaveRequest' },
  { value: [Constants.BUSINESS_TRIP], label: 'BizTrip_TrainingRequest' },
  { value: [Constants.SUBSTITUTION], label: 'ShiftChange' },
  { value: [Constants.IN_OUT_TIME_UPDATE], label: 'InOutChangeRequest' },
  { value: [Constants.CHANGE_DIVISON_SHIFT], label: 'AdminUploadShiftChange' },
  { value: [Constants.DEPARTMENT_TIMESHEET], label: 'DepartmentTimesheet' },
  { value: [Constants.ONBOARDING], label: 'ContractEvaluationType' },
  { value: [Constants.RESIGN_SELF], label: 'ResignationType'},
  { value: [Constants.SALARY_PROPOSE], label: 'SalaryType' },
  { value: [Constants.OT_REQUEST], label: 'MoneyOT' },
  { value: [Constants.PROPOSAL_TRANSFER], label: 'ProposalTransfer' },
  { value: [Constants.PROPOSAL_APPOINTMENT], label: 'ProposalAppointment' },
  {value: [Constants.WELFARE_REFUND], label: 'WelfareRefund'},
  { value: [Constants.INSURANCE_SOCIAL], label: 'InsuranceSocialRequest' },
  { value: [Constants.INSURANCE_SOCIAL_INFO], label: 'InsuranceSocialInfoRequest' },
  { value: [Constants.SOCIAL_SUPPORT], label: 'social_support_info' },
]

const PN03List = [
  { value: '1', label: 'MarriageForSelf' },
  { value: '2', label: 'MarriageForChildren' },
  { value: '3', label: 'DeceaseOfParents' },
];

const REQUEST_CATEGORIES = {
  CATEGORY_1: 1,
  CATEGORY_2: 2
}

export { absenceRequestTypes, PN03List, requestTypes, MATERNITY_LEAVE_KEY, MARRIAGE_FUNERAL_LEAVE_KEY, MOTHER_LEAVE_KEY, 
  FOREIGN_SICK_LEAVE, ANNUAL_LEAVE_KEY, ADVANCE_ABSENCE_LEAVE_KEY, COMPENSATORY_LEAVE_KEY, REQUEST_CATEGORIES, VIN_UNI_SICK_LEAVE, VIN_SCHOOL_SICK_LEAVE }
