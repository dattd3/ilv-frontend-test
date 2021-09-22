import _ from 'lodash'
import moment from 'moment'
// import { formatStringByMuleValue } from "../../commons/Utils"
// import Constants from "../../commons/Constants";

const DATE_TYPE = {
    DATE_OFFSET: 0,
    DATE_NORMAL: 1,
    DATE_OFF: 2,
};
const EVENT_TYPE = {
    NO_EVENT: 0,
    EVENT_KEHOACH: 1,
    EVENT_KE_HOACH_CONTINUE: 2,
    EVENT_GIOTHUCTE: 3,
    EVENT_LOICONG: 4,
    EVENT_GIONGHI: 5,
    EVENT_CONGTAC: 6,
    EVENT_OT: 7,
};


const getDepartmentPartGroupByListData = listData => {
    const result = listData.find(item => item && item !== '#')
    return result
}

const groupArrayOfObjects = (list, key) => {
    return list.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}
const getDayOffset = (currentDate, offset) => {
    const tomorrow = new Date(currentDate.getTime());
    tomorrow.setDate(currentDate.getDate() + offset);
    return tomorrow;
};

const checkExist = (text) => {
    return text && text != "#";
};

const isHoliday = (item) => {
    return item.shift_id == "OFF" || (item.is_holiday == 1 && localStorage.getItem("companyCode") != "V060");
};

const getDatetimeForCheckFail = (startTime, endTime, currentDay, nextDay) => {
    return {
        start: currentDay + startTime,
        end: startTime < endTime ? currentDay + endTime : nextDay + endTime,
    };
}

const getComment = (dateString, line1, line2, reasonData) => {
    const reasonForCurrentDaty = reasonData.filter(item => (item.startDate <= dateString && item.endDate >= dateString) || (item.startDate == dateString && item.endDate == dateString))

    if (reasonForCurrentDaty.length == 0) {
        return line2;
    }

    for (let i = 0; i < reasonForCurrentDaty.length; i++) {
        const item = reasonForCurrentDaty[i];
        let startTime = null, endTime = null;
        if (item.startTime && item.endTime) {
            startTime = item.startTime
            endTime = item.endTime;
            if (startTime == line2.trip_start_time1 && endTime == line2.trip_end_time1) {
                line2.trip_start_time1_comment = item;
            } else if (startTime == line2.trip_start_time2 && endTime == line2.trip_end_time2) {
                line2.trip_start_time2_comment = item;
            } else if (startTime == line2.leave_start_time1 && endTime == line2.leave_end_time1) {
                line2.leave_start_time1_comment = item;
            } else if (startTime == line2.leave_start_time2 && endTime == line2.leave_end_time2) {
                line2.leave_start_time2_comment = item;
            }
        } else if (checkExist(line1.from_time1) && checkExist(line1.to_time1)) {
            if (checkExist(line2.trip_start_time1) && checkExist(line2.trip_end_time1)) {
                line2.trip_start_time1_comment = item;
            } else if (checkExist(line2.leave_start_time1) && checkExist(line2.leave_end_time1)) {
                line2.leave_start_time1_comment = item;
            }
        } else if (checkExist(line1.from_time2) && checkExist(line1.to_time2)) {
            if (checkExist(line2.trip_start_time2) && checkExist(line2.trip_end_time2)) {
                line2.trip_start_time2_comment = item;
            } else if (checkExist(line2.leave_start_time2) && checkExist(line2.leave_end_time2)) {
                line2.leave_start_time2_comment = item;
            }
        }
    }
    return line2;

}

const processDataForTable = (data1, fromDateString, toDateString, reasonData) => {
    const data = [...data1];
    const today = moment(new Date()).format("YYYYMMDD");
    // debugger
    for (let index = 0; index < data.length; index++) {
        const item = data[index];
        const currentDay = moment(item.date, "DD-MM-YYYY").format("YYYYMMDD");
        const nextDay = moment(
            getDayOffset(moment(item.date, "DD-MM-YYYY").toDate(), 1)
        ).format("YYYYMMDD");

        const timeSteps = [];
        //gio ke hoach  type( 0:khong co event , 1:  co 1 event, 2: event dang tiep tu,), subtype (0, khong co, 1 : etime 1, 2 time 2, 3 ca 2 time)
        const line1 = {
            type: EVENT_TYPE.NO_EVENT,
            subtype: "00",
            count: item.count || 0,
            shift_id: item.shift_id != "****" ? item.shift_id : null,
            to_time1: item.to_time1,
            to_time2: item.to_time2,
            from_time2: item.from_time2,
            from_time1: item.from_time1,
        };

        if (checkExist(item.from_time1) && !isHoliday(item)) {
            line1.type = EVENT_TYPE.EVENT_KEHOACH;
            line1.subtype = 1 + line1.subtype[0];
        }

        if (checkExist(item.from_time2) && !isHoliday(item)) {
            line1.type = EVENT_TYPE.EVENT_KEHOACH;
            line1.subtype = line1.subtype[0] + 1;
            //timeSteps.push({start: item.from_time2, end: item.from_time2});
        }

        const nextItem = index + 1 < data.length ? data[index + 1] : null;

        if (
            nextItem &&
            moment(item.date, "DD-MM-YYYY").toDate().getDay() != 1 &&
            checkExist(item.from_time1) &&
            nextItem.from_time1 == item.from_time1 &&
            nextItem.to_time1 == item.to_time1 &&
            nextItem.from_time2 == item.from_time2 &&
            nextItem.to_time2 == item.to_time2 &&
            !isHoliday(data[index + 1]) &&
            !isHoliday(item)
        ) {
            line1.type = EVENT_TYPE.EVENT_KE_HOACH_CONTINUE;
            line1.subtype = "00";
            nextItem.count = line1.count ? line1.count + 1 : 2;
            data[index + 1] = nextItem;
        }

        //gio thuc te  // khong co event , 1 : gio thuc te, 2 : loi cham cong
        let line2 = {
            type: EVENT_TYPE.NO_EVENT,
            type1: "00",
            subtype: "000",
            start_time1_fact: item.start_time1_fact, //gio thuc te
            end_time1_fact: item.end_time1_fact, //gio thuc te
            end_time2_fact: item.end_time2_fact, //gio thuc te
            start_time2_fact: item.start_time2_fact, //gio thuc te
            start_time3_fact: item.start_time3_fact, //gio thuc te
            end_time3_fact: item.end_time3_fact, //gio thuc te
        };

        if (checkExist(item.start_time1_fact)) {
            line2.type = EVENT_TYPE.EVENT_GIOTHUCTE;

            if (checkExist(item.end_time1_fact)) {
                line2.type1 = EVENT_TYPE.EVENT_GIOTHUCTE + line2.type1[1];
                line2.subtype = 1 + line2.subtype[1];
                timeSteps.push(
                    getDatetimeForCheckFail(
                        item.start_time1_fact,
                        item.end_time1_fact,
                        currentDay,
                        nextDay
                    )
                );
            } else {
                line2.type1 = isHoliday(item)
                    ? EVENT_TYPE.EVENT_GIOTHUCTE + line2.type1[1]
                    : EVENT_TYPE.EVENT_LOICONG + line2.type1[1];
                line2.subtype = "1" + line2.subtype[1];
            }
        }

        if (checkExist(item.start_time2_fact)) {
            line2.type = EVENT_TYPE.EVENT_GIOTHUCTE;

            if (checkExist(item.end_time2_fact)) {
                line2.type1 = line2.type1[0] + EVENT_TYPE.EVENT_GIOTHUCTE;
                line2.subtype = line2.subtype[0] + 1;
                timeSteps.push(
                    getDatetimeForCheckFail(
                        item.start_time2_fact,
                        item.end_time2_fact,
                        currentDay,
                        nextDay
                    )
                );
            } else {
                line2.type1 = isHoliday(item)
                    ? line2.type1[0] + EVENT_TYPE.EVENT_GIOTHUCTE
                    : line2.type1[0] + EVENT_TYPE.EVENT_LOICONG;
                line2.subtype = line2.subtype[0] + 1;
            }
        }

        //gio nghi : //0: khong co event, 1 : nghi, 2 : cong tac
        let line3 = {
            type: 0,
            subtype: "00",
            leave_start_time2: item.leave_start_time2, //nghi
            leave_end_time2: item.leave_end_time2, //nghi
            leave_end_time1: item.leave_end_time1, //nghi
            leave_start_time1: item.leave_start_time1, //nghi
            trip_end_time1: item.trip_end_time1, //cong tac
            trip_end_time2: item.trip_end_time2, //cong tac
            trip_start_time2: item.trip_start_time2, //cong tac
            trip_start_time1: item.trip_start_time1, //cong tac
        };

        if (checkExist(item.leave_start_time1)) {
            line3.type = EVENT_TYPE.EVENT_GIONGHI;
            line3.subtype = 1 + line3.subtype[1];
            timeSteps.push(
                getDatetimeForCheckFail(
                    item.leave_start_time1,
                    item.leave_end_time1,
                    currentDay,
                    nextDay
                )
            );
        }

        if (checkExist(item.leave_start_time2)) {
            line3.type = EVENT_TYPE.EVENT_GIONGHI;
            line3.subtype = line3.subtype[0] + 1;
            timeSteps.push(
                getDatetimeForCheckFail(
                    item.leave_start_time2,
                    item.leave_end_time2,
                    currentDay,
                    nextDay
                )
            );
        }

        if (checkExist(item.trip_start_time1)) {
            line3.type = EVENT_TYPE.EVENT_CONGTAC;
            line3.subtype = 1 + line3.subtype[1];

            timeSteps.push(
                getDatetimeForCheckFail(
                    item.trip_start_time1,
                    item.trip_end_time1,
                    currentDay,
                    nextDay
                )
            );
        }

        if (checkExist(item.trip_start_time2)) {
            line3.type = EVENT_TYPE.EVENT_CONGTAC;
            line3.subtype = line3.subtype[0] + 1;
            timeSteps.push(
                getDatetimeForCheckFail(
                    item.trip_start_time2,
                    item.trip_end_time2,
                    currentDay,
                    nextDay
                )
            );
        }

        //gio OT
        const line4 = {
            type: 0,
            subtype: "000",
            ot_end_time3: item.ot_end_time3, //ot
            ot_end_time2: item.ot_end_time2, //ot
            ot_end_time1: item.ot_end_time1, //ot
            ot_start_time1: item.ot_start_time1, //ot
            ot_start_time2: item.ot_start_time2, //ot
            ot_start_time3: item.ot_start_time3, //ot
        };

        if (checkExist(item.ot_start_time1)) {
            line4.type = EVENT_TYPE.EVENT_OT;
            line4.subtype = 1 + line4.subtype[1] + line4.subtype[2];
        }

        if (checkExist(item.ot_start_time2)) {
            line4.type = EVENT_TYPE.EVENT_OT;
            line4.subtype = line4.subtype[0] + 1 + line4.subtype[2];
        }

        if (checkExist(item.ot_start_time3)) {
            line4.type = EVENT_TYPE.EVENT_OT;
            line4.subtype = line4.subtype[0] + line4.subtype[1] + 1;
        }

        //check loi
        //check betwwen step time
        let timeStepsSorted = timeSteps.sort((a, b) =>
            a.start > b.start ? 1 : -1
        );
        let isValid1 = true;
        let isValid2 = true;
        let isShift1 = true;
        let minStart = 0,
            maxEnd = 0,
            minStart2 = null,
            maxEnd2 = null;
        const kehoach1 = getDatetimeForCheckFail(
            item.from_time1,
            item.to_time1,
            currentDay,
            nextDay
        );
        const kehoach2 = getDatetimeForCheckFail(
            item.from_time2,
            item.to_time2,
            currentDay,
            nextDay
        );

        if (timeSteps && timeSteps.length > 0) {
            minStart = timeStepsSorted[0].start;
            maxEnd = timeStepsSorted[0].end;
            minStart2 = timeStepsSorted[0].start;
            maxEnd2 = timeStepsSorted[0].end;
            for (let i = 0, j = 1; j < timeStepsSorted.length; i++, j++) {
                minStart =
                    isShift1 && timeStepsSorted[i].start < minStart
                        ? timeStepsSorted[i].start
                        : minStart;
                minStart2 =
                    timeStepsSorted[i].start < minStart2
                        ? timeStepsSorted[i].start
                        : minStart2;

                if (timeStepsSorted[j].start > kehoach1.end) {
                    isShift1 = false;
                }
                maxEnd =
                    isShift1 && timeStepsSorted[j].end > maxEnd
                        ? timeStepsSorted[j].end
                        : maxEnd;
                maxEnd2 =
                    timeStepsSorted[j].end > maxEnd2 ? timeStepsSorted[j].end : maxEnd2;

                if (timeStepsSorted[i].end < timeStepsSorted[j].start) {
                    if (
                        line1.subtype == "11" &&
                        timeStepsSorted[i].end >= kehoach1.end &&
                        timeStepsSorted[j].start <= kehoach2.start
                    ) {
                        isShift1 = false;
                        maxEnd = timeStepsSorted[i].end;
                        minStart2 = timeStepsSorted[j].start;
                        maxEnd2 = timeStepsSorted[j].end;
                    } else {
                        minStart2 = timeStepsSorted[j].start;
                        maxEnd2 = timeStepsSorted[j].end;
                        if (timeStepsSorted[i].end < kehoach1.end) {
                            isValid1 = false;
                        }

                        if (timeStepsSorted[j].start > kehoach2.start) {
                            isValid2 = false;
                        }
                    }
                }
            }
        }

        //check with propose time
        if (checkExist(item.from_time1) && !isHoliday(item)) {
            isValid1 =
                minStart <= kehoach1.start && maxEnd >= kehoach1.end && isValid1
                    ? true
                    : false;

            line2.type1 =
                isValid1 == false && currentDay <= today
                    ? EVENT_TYPE.EVENT_LOICONG + line2.type1[1]
                    : line2.type1;
            line2.type1 =
                isValid1 == true && line2.type1[0] == EVENT_TYPE.EVENT_LOICONG
                    ? EVENT_TYPE.EVENT_GIOTHUCTE + line2.type1[1]
                    : line2.type1;
            if (line2.type1[0] == EVENT_TYPE.EVENT_LOICONG) {
                line2.type = EVENT_TYPE.EVENT_GIOTHUCTE;
                line2.subtype = "1" + line2.subtype[1];
            }
            if (line2.type1[0] == 0) {
                line2.subtype = "1" + line2.subtype[1];
            }
        }

        if (checkExist(item.from_time2) && !isHoliday(item)) {
            isValid2 =
                minStart2 <= kehoach2.start && maxEnd2 >= kehoach2.end && isValid2
                    ? true
                    : false;
            line2.type1 =
                isValid2 == false && currentDay <= today
                    ? line2.type1[0] + EVENT_TYPE.EVENT_LOICONG
                    : line2.type1;
            line2.type1 =
                isValid2 == true && line2.type1[1] == EVENT_TYPE.EVENT_LOICONG
                    ? line2.type1[0] + EVENT_TYPE.EVENT_GIOTHUCTE
                    : line2.type1;
            if (line2.type1[1] == EVENT_TYPE.EVENT_LOICONG) {
                line2.type = EVENT_TYPE.EVENT_GIOTHUCTE;
                line2.subtype = line2.subtype[0] + "1";
            }
            if (line2.type1[1] == 0) {
                line2.subtype = line2.subtype[0] + "1";
            }
        }
        //get Comment

        //   line3 =  getComment(
        //     moment(item.date, "DD-MM-YYYY").format("YYYYMMDD"),
        //     line1,
        //     line3,
        //     reasonData
        //   );

        data[index] = {
            // pernr:item.pernr,
            // fullname:item.fullname,
            // username:item.username,
            day: moment(item.date, "DD-MM-YYYY").format("DD/MM"),
            date_type: isHoliday(item)
                ? DATE_TYPE.DATE_OFF
                : DATE_TYPE.DATE_NORMAL, // ngày bt
            is_holiday: item.is_holiday,
            //date: 1,  // thu 3
            line1: {
                // type( 0:khong co event , 1:  co 1 event, 2: event dang tiep tu,), subtype (0, khong co, 1 : etime 1, 2 time 2, 3 ca 2 time)
                ...line1,
            },
            line2: {
                ...line2,
            },
            line3: {
                ...line3,
            },
            line4: {
                ...line4,
            },
        };
    }

    return [...data.reverse()];
};

export function processDepartmentTimeSheet(dataRaw, start, end) {
    let dataSorted = dataRaw.sort((a, b) => moment(a.date, "DD-MM-YYYY").format("YYYYMMDD") < moment(b.date, "DD-MM-YYYY").format("YYYYMMDD") ? 1 : -1)
    if (dataSorted && dataSorted.length > 0) {
        const startReal = moment(dataSorted[dataSorted.length - 1].date, 'DD-MM-YYYY').format('YYYYMMDD');
        start = startReal > start ? startReal : start;
        const endReal = moment(dataSorted[0].date, 'DD-MM-YYYY').format('YYYYMMDD');
        end = endReal < end ? endReal : end;
    }
    var group_to_values = groupArrayOfObjects(dataRaw, "perr");
    var groups = Object.keys(group_to_values).map(function (key) {
        return {
            per: key,
            name: group_to_values[key][0].fullname,
            departmentPartGroup: getDepartmentPartGroupByListData([group_to_values[key][0].part, group_to_values[key][0].unit, group_to_values[key][0].department, group_to_values[key][0].division, group_to_values[key][0].pnl]),
            timesheets: group_to_values[key]
        };
    });

    const data = groups.map((q) => {
        let aip = { ...q, timesheets: processDataForTable(q.timesheets, start, end, null) }
        return aip
    });

    return data;
}

export const getDates = (startDate, endDate) => {
    const dates = [];
    let currentDate = startDate;
    const addDays = function (days) {
        const date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };
    while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
    }
    return dates;
}