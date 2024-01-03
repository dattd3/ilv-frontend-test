import moment from 'moment'
import Constants from '../../commons/Constants'
import { MOTHER_LEAVE_KEY } from "../Task/Constants"

const getDateByRange = (startDate, endDate) => {
    if (startDate && endDate) {
        let start = moment(startDate, 'YYYYMMDD')
        let end = moment(endDate, 'YYYYMMDD')
        let now = start.clone(), dates = []
        while (now.isSameOrBefore(end)) {
            dates.push(now.format('DD/MM/YYYY'))
            now.add(1, 'days')
        }
        return dates
    }
    return []
}

export const getOperationType = (requestTypeId, actionType, processStatusId) => {
  if ([Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP, Constants.OT_REQUEST].includes(requestTypeId)) {
    if (actionType == Constants.OPERATION_TYPES.DEL 
      && [Constants.STATUS_PARTIALLY_SUCCESSFUL, Constants.STATUS_NO_CONSENTED,
      Constants.STATUS_NOT_APPROVED, Constants.STATUS_EVICTION,
      Constants.STATUS_WAITING, Constants.STATUS_WAITING_CONSENTED,
      Constants.STATUS_WORK_DAY_LOCKED_CREATE, Constants.STATUS_WORK_DAY_LOCKED_APPRAISAL, Constants.STATUS_WORK_DAY_LOCKED_APPROVAL].includes(processStatusId)) {
      return Constants.OPERATION_TYPES.DEL;
    } else if (actionType == Constants.OPERATION_TYPES.DEL) {
      return Constants.OPERATION_TYPES.INS;
    } else {
      return actionType || Constants.OPERATION_TYPES.INS;
    }
  }
  return Constants.OPERATION_TYPES.INS
}

export default function processingDataReq(dataRawFromApi, tab) {
    let taskList = [];
    const listRequestTypeIdToShowTime = [Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP, Constants.SUBSTITUTION, Constants.IN_OUT_TIME_UPDATE, Constants.OT_REQUEST],
        listRequestTypeIdToGetSubId = [Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP];

    dataRawFromApi.forEach(element => {
        if([Constants.ONBOARDING, Constants.RESIGN_SELF, Constants.SALARY_PROPOSE, Constants.PROPOSAL_TRANSFER, Constants.PROPOSAL_APPOINTMENT, Constants.OT_REQUEST, Constants.WELFARE_REFUND, Constants.INSURANCE_SOCIAL, Constants.INSURANCE_SOCIAL_INFO, Constants.SOCIAL_SUPPORT, Constants.TAX_FINALIZATION].includes(element.requestTypeId)) {
        // if(element.requestTypeId == Constants.ONBOARDING || element.requestTypeId == Constants.RESIGN_SELF || element.requestTypeId == Constants.SALARY_PROPOSE) {
            if(element.requestTypeId === Constants.RESIGN_SELF) {
                element.id = element.id + '.1';
                element.appraiser = element.appraiserInfo ? element.appraiserInfo : {};
                element.approver = element.approver ? element.approver : {};
                element.startDate = "";
            }

            if([Constants.SALARY_PROPOSE, Constants.PROPOSAL_TRANSFER, Constants.PROPOSAL_APPOINTMENT, Constants.WELFARE_REFUND, Constants.INSURANCE_SOCIAL, Constants.INSURANCE_SOCIAL_INFO, Constants.SOCIAL_SUPPORT, Constants.TAX_FINALIZATION].includes(element.requestTypeId)) {
                element.salaryId = element.id;
                element.id = element.id + '.1';
                element.appraiser = {};
                element.approver = element.approverInfo ? element.approverInfo : {};
                element.user = element.userInfo;
                element.isEdit = false; // không cho phép thẩm định hàng loạt ngoài màn danh sách
                element.startDate = "";
            }

            if (element.requestTypeId === Constants.OT_REQUEST) {
              element.id = element.id.toString();
              element.user = element.userInfo;
              element.approver = element.approver ? element.approver : {};
              element.totalTime = element.requestInfo?.reduce((accumulator, currentValue) => accumulator += (currentValue.hoursOt) * 1, 0)?.toFixed(2);
              const dateRanges = element.requestInfo?.reduce((accumulator, currentValue) => [...accumulator, moment(currentValue.date, "YYYYMMDD").format("DD/MM/YYYY")], []);
              element.dateRange = dateRanges.join(", ");
            }
            element.operationType = getOperationType(element.requestTypeId, element.updateField, element.processStatusId)
            taskList.push(element);
        } else {
            if (element.requestInfo) {
                element.requestInfo.forEach(e => {
                    e.user = element.user
                    e.appraiser = element.appraiser
                    e.appraiserId = element.appraiserId
                    e.requestType = element.requestType
                    e.requestTypeId = element.requestTypeId
                    e.approver = element.approver ? element.approver : {};

                    if (element.requestTypeId == Constants.UPDATE_PROFILE) {
                        e.processStatusId = element.processStatusId
                        e.comment = element.comment;
                        e.approverComment = element.approverComment;
                    }
                    if (listRequestTypeIdToShowTime.includes(element.requestTypeId)) {
                        let date = [moment(e.date).format("DD/MM/YYYY")]
                        if (element.requestTypeId == Constants.SUBSTITUTION) {
                            if (!e?.applyFrom && !e?.applyTo) {
                                date = [moment(e?.date, 'YYYYMMDD').format("DD/MM/YYYY")]
                            } else if (e?.applyFrom === e?.applyTo) {
                                date = [moment(e?.applyFrom, 'YYYYMMDD').format("DD/MM/YYYY")]
                            } else {
                                date = getDateByRange(e?.applyFrom, e?.applyTo)
                            }
                        } else if (element.requestTypeId == Constants.LEAVE_OF_ABSENCE || element.requestTypeId == Constants.BUSINESS_TRIP) {
                            if (e?.startDate && e?.startDate === e?.endDate) {
                                date = [moment(e?.startDate, 'YYYYMMDD').format("DD/MM/YYYY")]
                            } else {
                                date = getDateByRange(e?.startDate, e?.endDate)
                            }
                        }
                        e.processStatusId = listRequestTypeIdToGetSubId.includes(element.requestTypeId) ? e.processStatusId : element.processStatusId
                        e.startDate = date
                        e.comment = element.comment;
                        e.approverComment = element.approverComment;
                    }
                    if (e.processStatusId == 8 || (e.processStatusId == 5 && tab == "approval")) {
                        e.canChecked = true
                    }
                    if (listRequestTypeIdToGetSubId.includes(element.requestTypeId)) {
                        e.id = e.id.toString()
                    } else {
                        e.id = element.id.toString()
                    }
                    e.isEdit = listRequestTypeIdToGetSubId.includes(element?.requestTypeId) ? e.isEdit : element.isEdit // ILVGR-1211
                    e.operationType = getOperationType(element.requestTypeId, e.actionType, e.processStatusId);
                    e.updateField = element?.updateField
                    taskList.push(e)
                })
            }
            if (element.requestTypeId == Constants.CHANGE_DIVISON_SHIFT || element.requestTypeId == Constants.DEPARTMENT_TIMESHEET) {
                element.id = element.id.toString()
                element.operationType = Constants.OPERATION_TYPES.INS
                element.operationType = getOperationType(element.requestTypeId, element.updateField, element.processStatusId);
                taskList.push(element);
            }
            if(element.requestTypeId == Constants.WELFARE_REFUND) {
                element.operationType = Constants.OPERATION_TYPES.INS
                element.id = element.id.toString()
                taskList.push(element);
            }
        }
    });

    taskList = taskList.filter(function (e, index, taskListOriginal) {
        let listRequestIdOriginals = taskListOriginal.map(item => item.id);

        if (listRequestIdOriginals.includes(e.id, index + 1)) {
            let indexPosition = listRequestIdOriginals.indexOf(e.id, index + 1);
            // taskListOriginal[indexPosition].startDate = (e.startDate + ",\r" + taskListOriginal[indexPosition].startDate);
            taskListOriginal[indexPosition].startDate = taskListOriginal[indexPosition].startDate?.concat(e.startDate)
        } else if (e.absenceType && e.absenceType.value == MOTHER_LEAVE_KEY) {
            let startDate = moment(e.startDate, "DD/MM/YYYY"),
                endDate = moment(e.endDate, "YYYYMMDD"),
                now = startDate, dates = [];

            while (now.isBefore(endDate) || now.isSame(endDate)) {
                dates.push(now.format('DD/MM/YYYY'));
                now.add(1, 'days')
            }
            e.startDate = dates;
            return e;
        } else {
            e.startDate = e.startDate;
            return e;
        }
    })
    return taskList;
}

export const replaceAll = (str, find, replace) => {
    if (str && str.length > 0) {
        var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
        return str.replace(new RegExp(escapedFind, 'g'), replace);
    } else {
        return '';
    }
};