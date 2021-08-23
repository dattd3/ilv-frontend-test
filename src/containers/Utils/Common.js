import moment from 'moment'
import Constants from '../../commons/Constants'

export default function processingDataReq(dataRawFromApi, tab) {
    let taskList = [];
    dataRawFromApi.forEach(element => {
        if (element.requestInfo) {
            element.requestInfo.forEach(e => {
                e.user = element.user
                e.appraiser = element.appraiser
                e.requestType = element.requestType
                e.requestTypeId = element.requestTypeId
                e.startDate = moment(e.startDate).format("DD/MM/YYYY")
                if (element.requestTypeId == Constants.UPDATE_PROFILE) {
                    e.processStatusId = element.processStatusId
                    e.id = element.id.toString()
                    e.comment = element.comment;
                    e.approverComment = element.approverComment;
                }
                if (element.requestTypeId == Constants.IN_OUT_TIME_UPDATE || element.requestTypeId == Constants.SUBSTITUTION) {
                    e.processStatusId = element.processStatusId
                    e.id = element.id.toString()
                    e.startDate = moment(e.date).format("DD/MM/YYYY")
                    e.comment = element.comment;
                    e.approverComment = element.approverComment;
                }
                if (e.processStatusId == 8 || (e.processStatusId == 5 && tab == "approval")) {
                    e.canChecked = true
                }
                taskList.push(e);
            })
        }
        if (element.requestTypeId == Constants.CHNAGE_DIVISON_SHIFT) {
            // if (element.processStatusId == 8 || (element.processStatusId == 5 && tab == "approval")) {
            //     element.canChecked = true
            // }
            taskList.push(element);
        }
    });

    taskList = taskList.filter(function (e, index, b) {
        var k = b.map(z => z.id)
        if (k.includes(e.id, index + 1)) {
            var indexPosition = k.indexOf(e.id, index + 1);
            b[indexPosition].startDate = (e.startDate + ",\r" + b[indexPosition].startDate);
        } else if (e.absenceType && e.absenceType.value == "PN02") {
            const startDate = moment(e.startDate, "DD/MM/YYYY")
            const endDate = moment(e.endDate, "YYYYMMDD")
            let now = startDate, dates = []

            while (now.isBefore(endDate) || now.isSame(endDate)) {
                dates.push(now.format('DD/MM/YYYY'));
                now.add(1, 'days')
            }
            e.startDate = dates.join(",\r")
            return e;
        } else {
            e.startDate = e.startDate;
            return e;
        }
    });
    return taskList
}