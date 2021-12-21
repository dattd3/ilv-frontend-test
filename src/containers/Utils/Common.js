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

export default function processingDataReq(dataRawFromApi, tab) {
    let taskList = [];
    dataRawFromApi.forEach(element => {
        if (element.requestInfo) {
            element.requestInfo.forEach(e => {
                e.user = element.user
                e.appraiser = element.appraiser
                e.appraiserId = element.appraiserId
                e.requestType = element.requestType
                e.requestTypeId = element.requestTypeId
                // e.startDate = moment(e.startDate).format("DD/MM/YYYY")
                e.startDate = []
                if (element.requestTypeId == Constants.UPDATE_PROFILE) {
                    e.processStatusId = element.processStatusId
                    e.id = element.id.toString()
                    e.comment = element.comment;
                    e.approverComment = element.approverComment;
                }
                if (element.requestTypeId == Constants.IN_OUT_TIME_UPDATE || element.requestTypeId == Constants.SUBSTITUTION) {
                    let date = [moment(e.date).format("DD/MM/YYYY")]
                    if (element.requestTypeId == Constants.SUBSTITUTION) {
                        if (!e?.applyFrom && !e?.applyTo) {
                            date = [moment(e?.date, 'YYYYMMDD').format("DD/MM/YYYY")]
                        } else if (e?.applyFrom === e?.applyTo) {
                            date = [moment(e?.applyFrom, 'YYYYMMDD').format("DD/MM/YYYY")]
                        } else {
                            date = getDateByRange(e?.applyFrom, e?.applyTo)
                        }
                    }
                    e.processStatusId = element.processStatusId
                    e.id = element.id.toString()
                    e.startDate = date 
                    e.comment = element.comment;
                    e.approverComment = element.approverComment;
                }
                if (e.processStatusId == 8 || (e.processStatusId == 5 && tab == "approval")) {
                    e.canChecked = true
                }
                e.isEdit = element.isEdit
                taskList.push(e);
            })
        }
        if (element.requestTypeId == Constants.CHANGE_DIVISON_SHIFT || element.requestTypeId == Constants.DEPARTMENT_TIMESHEET) {
            element.id = element.id.toString()
            taskList.push(element);
        }
    });

    taskList = taskList.filter(function (e, index, taskListOriginal) {
        let listRequestIdOriginals = taskListOriginal.map(item => item.id)

        if (listRequestIdOriginals.includes(e.id, index + 1)) {
            let indexPosition = listRequestIdOriginals.indexOf(e.id, index + 1);
            // taskListOriginal[indexPosition].startDate = (e.startDate + ",\r" + taskListOriginal[indexPosition].startDate);
            taskListOriginal[indexPosition].startDate = taskListOriginal[indexPosition].startDate.concat(e.startDate)
        } else if (e.absenceType && e.absenceType.value == MOTHER_LEAVE_KEY) {
            let startDate = moment(e.startDate, "DD/MM/YYYY")
            let endDate = moment(e.endDate, "YYYYMMDD")
            let now = startDate, dates = []

            while (now.isBefore(endDate) || now.isSame(endDate)) {
                dates.push(now.format('DD/MM/YYYY'));
                now.add(1, 'days')
            }
            // e.startDate = dates.join(",\r")
            e.startDate = dates
            return e
        } else {
            e.startDate = e.startDate
            return e
        }
    })

    return taskList
}
