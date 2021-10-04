import React, { Component } from "react";
import FilterData from "../../ShareComponents/FilterData";
import axios from "axios";
import moment from "moment";
import _ from 'lodash'
import { Spinner, Button } from 'react-bootstrap';
import { withTranslation } from "react-i18next";
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx-js-style'
import TimeSheetMember from './TimeSheetMember'
import Constants from "../../../../commons/Constants";
import { formatStringByMuleValue } from "../../../../commons/Utils"
import ResultDetailModal from './ResultDetailModal'

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

class EmployeeTimesheets extends Component {
  constructor() {
    super();
    this.state = {
      timsheetSummary: {},
      timesheets: [],
      timeTables: [],
      isSearch: false,
      dayList: [],
      isLoading: false,
      employeesForFilter: [],
      employeeSelectedFilter: [],
      dateChanged: "",
      dataChanged: {},
      isShowStatusModal: false,
      resultShiftUpdateDetail: [],
      timeSheetOriginal: []
    };
  }

  searchTimesheetByDate(startDate, endDate, memberIds) {
    this.setState({
      isSearch: false,
      dayList: this.getDates(startDate, endDate),
    });
    this.search(startDate, endDate, memberIds);
  }
  getDates(startDate, endDate) {
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

  groupArrayOfObjects(list, key) {
    return list.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  search(startDate, endDate, memberIds) {
    let start = moment(startDate).format("YYYYMMDD").toString();
    let end = moment(endDate).format("YYYYMMDD").toString();
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
    };

    const timeoverviewParams = {
      from_date: parseInt(start),
      to_date: parseInt(end),
      personal_no_list: memberIds || [],
    };
    const reasonParams = {
      startdate: parseInt(start),
      endDate: parseInt(end),
    };
    this.setState({isLoading: true});
    const timOverviewEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/subordinate/timeoverview`;
    const ReasonEndpoint = `${process.env.REACT_APP_REQUEST_URL}request/GetLeaveTypeAndComment`;
    const requestTimOverview = axios.post(
      timOverviewEndpoint,
      timeoverviewParams,
      {headers}
    );
    const requestReson = axios.get(ReasonEndpoint, {
      headers,
      params: reasonParams,
    });

    const getDepartmentPartGroupByListData = listData => {
      const result = listData.find(item => item && item !== '#')
      return result
    }

    axios.all([requestReson, requestTimOverview]).then(
      axios.spread((...responses) => {
        if (responses[1]) {
          const res = responses[1];
          if (res && res.data && res.data.data) {
            let dataSorted = res.data.data.sort((a, b) => moment(a.date, "DD-MM-YYYY").format("YYYYMMDD") < moment(b.date, "DD-MM-YYYY").format("YYYYMMDD") ? 1 : -1)
            if(dataSorted && dataSorted.length > 0) {
              const startReal =   moment( dataSorted[dataSorted.length - 1].date, 'DD-MM-YYYY').format('YYYYMMDD');
              start = startReal > start ? startReal : start;
              const endReal = moment(dataSorted[0].date, 'DD-MM-YYYY').format('YYYYMMDD');
              end = endReal < end ? endReal : end;
            }

            //group data by pernr
            var group_to_values = this.groupArrayOfObjects(dataSorted, "pernr");
            var groups = Object.keys(group_to_values).map(function (key) {
              return {
                per: key,
                name: group_to_values[key][0].fullname,
                departmentPartGroup: getDepartmentPartGroupByListData([group_to_values[key][0].part, group_to_values[key][0].unit, group_to_values[key][0].department, group_to_values[key][0].division, group_to_values[key][0].pnl]),
                timesheets: group_to_values[key]
              };
            });

            const data = groups.map((q) => {
              let aip =  {...q, timesheets: this.processDataForTable(q.timesheets, start, end, responses[0].data.data)}
              return aip
            });

            this.setState({ timeTables: data, isLoading: false, isSearch: true, timeSheetOriginal: groups });
          }
        }
      })
    );
  }

  getDayOffset = (currentDate, offset) => {
    const tomorrow = new Date(currentDate.getTime());
    tomorrow.setDate(currentDate.getDate() + offset);
    return tomorrow;
  };

  checkExist = (text) => {
    return text && text != "#";
  };

  isHoliday = (item) => {
    return item.shift_id == "OFF" || (item.is_holiday == 1 && localStorage.getItem("companyCode") != "V060");
  };

  getDatetimeForCheckFail(startTime, endTime, currentDay, nextDay) {
    return {
      start: currentDay + startTime,
      end: startTime < endTime ? currentDay + endTime : nextDay + endTime,
    };
  }

  getComment = (dateString, line1,  line2, reasonData) =>{
    const reasonForCurrentDaty = reasonData.filter( item => (item.startDate <= dateString && item.endDate >= dateString) || (item.startDate == dateString && item.endDate == dateString))

    if(reasonForCurrentDaty.length == 0) {
      return line2;
    }

    for(let i = 0; i < reasonForCurrentDaty.length; i++) {
      const item = reasonForCurrentDaty[i];
      let startTime = null, endTime = null;
      if(item.startTime && item.endTime) {
        startTime = item.startTime
        endTime = item.endTime;
        if(startTime == line2.trip_start_time1 && endTime == line2.trip_end_time1) {
          line2.trip_start_time1_comment = item;
        } else if ( startTime == line2.trip_start_time2 && endTime == line2.trip_end_time2) {
          line2.trip_start_time2_comment = item;
        } else if( startTime == line2.leave_start_time1 && endTime == line2.leave_end_time1) {
          line2.leave_start_time1_comment = item;
        } else if( startTime == line2.leave_start_time2 && endTime == line2.leave_end_time2) {
          line2.leave_start_time2_comment = item;
        }
      } else if(this.checkExist(line1.from_time1) && this.checkExist(line1.to_time1)) {
        if(this.checkExist(line2.trip_start_time1) && this.checkExist(line2.trip_end_time1)) {
          line2.trip_start_time1_comment = item;
        } else if( this.checkExist(line2.leave_start_time1) && this.checkExist(line2.leave_end_time1) ) {
          line2.leave_start_time1_comment = item;
        }
      } else if(this.checkExist(line1.from_time2) && this.checkExist(line1.to_time2)) {
        if(this.checkExist(line2.trip_start_time2) && this.checkExist(line2.trip_end_time2)) {
          line2.trip_start_time2_comment = item;
        } else if( this.checkExist(line2.leave_start_time2) && this.checkExist(line2.leave_end_time2) ) {
          line2.leave_start_time2_comment = item;
        }
      }
    }
    return line2;

  }

  processDataForTable = (data1, fromDateString, toDateString, reasonData) => {   
    const data = [...data1];
    const today = moment(new Date()).format("YYYYMMDD");
    // debugger
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      const currentDay = moment(item.date, "DD-MM-YYYY").format("YYYYMMDD");
      const nextDay = moment(
        this.getDayOffset(moment(item.date, "DD-MM-YYYY").toDate(), 1)
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

      if (this.checkExist(item.from_time1) && !this.isHoliday(item)) {
        line1.type = EVENT_TYPE.EVENT_KEHOACH;
        line1.subtype = 1 + line1.subtype[0];
      }

      if (this.checkExist(item.from_time2) && !this.isHoliday(item)) {
        line1.type = EVENT_TYPE.EVENT_KEHOACH;
        line1.subtype = line1.subtype[0] + 1;
        //timeSteps.push({start: item.from_time2, end: item.from_time2});
      }

      const nextItem = index + 1 < data.length ? data[index + 1] : null;

      if (
        nextItem &&
        moment(item.date, "DD-MM-YYYY").toDate().getDay() != 1 &&
        this.checkExist(item.from_time1) &&
        nextItem.from_time1 == item.from_time1 &&
        nextItem.to_time1 == item.to_time1 &&
        nextItem.from_time2 == item.from_time2 &&
        nextItem.to_time2 == item.to_time2 &&
        !this.isHoliday(data[index + 1]) &&
        !this.isHoliday(item)
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

      if (this.checkExist(item.start_time1_fact)) {
        line2.type = EVENT_TYPE.EVENT_GIOTHUCTE;

        if (this.checkExist(item.end_time1_fact)) {
          line2.type1 = EVENT_TYPE.EVENT_GIOTHUCTE + line2.type1[1];
          line2.subtype = 1 + line2.subtype[1];
          timeSteps.push(
            this.getDatetimeForCheckFail(
              item.start_time1_fact,
              item.end_time1_fact,
              currentDay,
              nextDay
            )
          );
        } else {
          line2.type1 = this.isHoliday(item)
            ? EVENT_TYPE.EVENT_GIOTHUCTE + line2.type1[1]
            : EVENT_TYPE.EVENT_LOICONG + line2.type1[1];
          line2.subtype = "1" + line2.subtype[1];
        }
      }

      if (this.checkExist(item.start_time2_fact)) {
        line2.type = EVENT_TYPE.EVENT_GIOTHUCTE;

        if (this.checkExist(item.end_time2_fact)) {
          line2.type1 = line2.type1[0] + EVENT_TYPE.EVENT_GIOTHUCTE;
          line2.subtype = line2.subtype[0] + 1;
          timeSteps.push(
            this.getDatetimeForCheckFail(
              item.start_time2_fact,
              item.end_time2_fact,
              currentDay,
              nextDay
            )
          );
        } else {
          line2.type1 = this.isHoliday(item)
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

      if (this.checkExist(item.leave_start_time1)) {
        line3.type = EVENT_TYPE.EVENT_GIONGHI;
        line3.subtype = 1 + line3.subtype[1];
        timeSteps.push(
          this.getDatetimeForCheckFail(
            item.leave_start_time1,
            item.leave_end_time1,
            currentDay,
            nextDay
          )
        );
      }

      if (this.checkExist(item.leave_start_time2)) {
        line3.type = EVENT_TYPE.EVENT_GIONGHI;
        line3.subtype = line3.subtype[0] + 1;
        timeSteps.push(
          this.getDatetimeForCheckFail(
            item.leave_start_time2,
            item.leave_end_time2,
            currentDay,
            nextDay
          )
        );
      }

      if (this.checkExist(item.trip_start_time1)) {
        line3.type = EVENT_TYPE.EVENT_CONGTAC;
        line3.subtype = 1 + line3.subtype[1];

        timeSteps.push(
          this.getDatetimeForCheckFail(
            item.trip_start_time1,
            item.trip_end_time1,
            currentDay,
            nextDay
          )
        );
      }

      if (this.checkExist(item.trip_start_time2)) {
        line3.type = EVENT_TYPE.EVENT_CONGTAC;
        line3.subtype = line3.subtype[0] + 1;
        timeSteps.push(
          this.getDatetimeForCheckFail(
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

      if (this.checkExist(item.ot_start_time1)) {
        line4.type = EVENT_TYPE.EVENT_OT;
        line4.subtype = 1 + line4.subtype[1] + line4.subtype[2];
      }

      if (this.checkExist(item.ot_start_time2)) {
        line4.type = EVENT_TYPE.EVENT_OT;
        line4.subtype = line4.subtype[0] + 1 + line4.subtype[2];
      }

      if (this.checkExist(item.ot_start_time3)) {
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
      const kehoach1 = this.getDatetimeForCheckFail(
        item.from_time1,
        item.to_time1,
        currentDay,
        nextDay
      );
      const kehoach2 = this.getDatetimeForCheckFail(
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
      if (this.checkExist(item.from_time1) && !this.isHoliday(item)) {
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

      if (this.checkExist(item.from_time2) && !this.isHoliday(item)) {
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

      line3 = this.getComment(
        moment(item.date, "DD-MM-YYYY").format("YYYYMMDD"),
        line1,
        line3,
        reasonData
      );

      data[index] = {
        // pernr:item.pernr,
        // fullname:item.fullname,
        // username:item.username,
        day: moment(item.date, "DD-MM-YYYY").format("DD/MM"),
        date_type: this.isHoliday(item)
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

  exportTimeSheetsToExcel = () => {  
    const { t } = this.props
    const {dayList, timeTables} = this.state
    const title = t("Timesheet").replace(/[\\//]/g, '_')
    const fileNameForExport = `${moment().format("YYYYMMDDHHmmss")} ${title}.xlsx`
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    const ws = XLSX.utils.table_to_sheet(document.getElementById('result-table'))
    const cellHeaderInitialForStyles = ['A1', 'B1', 'A3', 'B3']
    let widthColumnInitial = [{width: 20}, {width: 30}, {width: 25}]

    for (let i = 0, len = dayList.length; i < len; i++) {
      widthColumnInitial = widthColumnInitial.concat({width: 20})
    }

    for (let j = 0, len = cellHeaderInitialForStyles.length; j < len; j++) {
      ws[cellHeaderInitialForStyles[j]].s = {
        alignment: {
          wrapText: true,
          vertical: "center"
        }
      }
    }

    let rowOffsetNumber = 3
    const rowSpanPerStep = 5
    if (timeTables.length > 1) {
      for (let k = 0, len = timeTables.length - 1; k < len; k++) {
        rowOffsetNumber += rowSpanPerStep
        ws[[`A${rowOffsetNumber}`]].s = {
          alignment: {
            wrapText: true,
            vertical: "center"
          }
        }
        ws[[`B${rowOffsetNumber}`]].s = {
          alignment: {
            wrapText: true,
            vertical: "center"
          }
        }
      }
    }

    ws['!cols'] = widthColumnInitial
    const wb = {Sheets: {[title]: ws}, SheetNames: [title]}
    const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'})
    const data = new Blob([excelBuffer], {type: fileType})
    FileSaver.saveAs(data, fileNameForExport)
  }

  renderDataPerDate = (data, key, type) => {
    const { t } = this.props
    const showRangeDate = (start, end) => {
      if (!formatStringByMuleValue(start) || !formatStringByMuleValue(end)) {
        return ""
      }
      return `${moment(start, 'HHmmss').format('HH:mm:ss')} - ${moment(end, 'HHmmss').format('HH:mm:ss')}`
    }

    return data.map((item, index) => {
      let val = ""
      switch (key) {
        case 'line1':
          val = t("DayOffLabel")
          if (item.date_type != Constants.DATE_TYPE.DATE_OFF) {
            val = [showRangeDate(item[key].from_time1, item[key].to_time1), showRangeDate(item[key].from_time2, item[key].to_time2)].join("\r\n")
          }
          break
        case 'line2':
          val = [showRangeDate(item[key].start_time1_fact, item[key].end_time1_fact), showRangeDate(item[key].start_time2_fact, item[key].end_time2_fact), showRangeDate(item[key].start_time3_fact, item[key].end_time3_fact)].join("\r\n")
          break
        case 'line3':
          if (type === "leave") {
            val = [showRangeDate(item[key].leave_start_time1, item[key].leave_end_time1), showRangeDate(item[key].leave_start_time2, item[key].leave_end_time2)].join("\r\n")
          } else if (type === "trip") {
            val = [showRangeDate(item[key].trip_start_time1, item[key].trip_end_time1), showRangeDate(item[key].trip_start_time2, item[key].trip_end_time2)].join("\r\n")
          }
          break
        case 'line4':
          val = [showRangeDate(item[key].ot_start_time1, item[key].ot_end_time1), showRangeDate(item[key].ot_start_time2, item[key].ot_end_time2), showRangeDate(item[key].ot_start_time3, item[key].ot_end_time3)].join("\r\n")
          break
      }
      return <td key={index}>{val}</td>
    })   
  }

  updateEmployees = (employeesForFilter, stateName) => {
    this.setState({[stateName]: employeesForFilter})
  }

  updateTimeSheetsParent = (dateChanged, dataChanged, uniqueApplicableObjects) => {
    const timeSheetOriginal = [...this.state.timeSheetOriginal]
    const dataChangedForObject = this.convertDataChangedToObj(dataChanged)
    const dateChangedFormat = moment(dateChanged, 'YYYYMMDD').format("DD-MM-YYYY")
    const uniqueApplicableObjectIds = uniqueApplicableObjects.map(ui => ui.uid)

    let start = ""
    let end = ""
    if (timeSheetOriginal && timeSheetOriginal.length > 0) {
      const firstItem = timeSheetOriginal[0]
      const timeSheet = firstItem.timesheets
      if (timeSheet && timeSheet.length > 0) {
        start = moment(timeSheet[timeSheet.length - 1].date, 'DD-MM-YYYY').format("YYYYMMDD")
        end = moment(timeSheet[0].date, 'DD-MM-YYYY').format("YYYYMMDD")
      }
    }

    let timeSheetOriginalToSave = []
    for (let i = 0, lenTimeSheetOriginal = timeSheetOriginal.length; i < lenTimeSheetOriginal; i++) {
      let item = timeSheetOriginal[i]
      let per = item.per
      item.isUpdating = false
      if (uniqueApplicableObjectIds.includes(parseInt(per))) {
        item.isUpdating = true
      }
      for (let j = 0, lenTimesheets = item.timesheets?.length; j < lenTimesheets; j++) {
        if (item.timesheets[j].date === dateChangedFormat && dataChangedForObject[per]) {
          item.timesheets[j].from_time1 = dataChangedForObject[item.per].startTime || dataChangedForObject[item.per].shiftFilter.shiftSelected?.from_time || ""
          item.timesheets[j].to_time1 = dataChangedForObject[item.per].endTime || dataChangedForObject[item.per].shiftFilter.shiftSelected?.to_time || ""
          item.timesheets[j].old_shift_id = item.timesheets[j].shift_id || ""
          item.timesheets[j].shift_id = dataChangedForObject[item.per].shiftFilter.shiftSelected?.shift_id || ""
        }
      }
      timeSheetOriginalToSave = timeSheetOriginalToSave.concat(item)
    }

    let timeSheetOriginalResult = []
    // Reset count - Dat support
    for (let i = 0; i < timeSheetOriginalToSave.length; i++) {
      let parent = timeSheetOriginalToSave[i]
      for (let j = 0; j < parent.timesheets.length; j++) {
        parent.timesheets[j].count = null
      }
      timeSheetOriginalResult = timeSheetOriginalResult.concat(parent)
    }

    const timeTables = timeSheetOriginalResult.map((q) => {
      let aip =  {...q, timesheets: this.processDataForTable(q.timesheets, start, end, [])}
      return aip
    })

    this.setState({timeTables: timeTables, dateChanged: dateChanged, dataChanged: dataChangedForObject})
  }

  convertDataChangedToObj = dataChanged => {
    const obj = {}
    for (let i = 0, lenParent = dataChanged.length; i < lenParent; i++) {
      let parent = dataChanged[i]
      for (let j = 0, lenChild = parent.applicableObjects?.length; j < lenChild; j++) {
        obj[parent.applicableObjects[j].uid.toString()] = parent
      }
    }
    return obj
  }

  cancelShiftUpdating = () => {
    window.location.reload()
  }

  prepareDataToSubmit = (timeSheetsUpdating, dateChanged, dataChanged) => {
    const payload = (timeSheetsUpdating || []).map(item => {
      let per = parseInt(item.per)
      let shiftUpdateType = dataChanged[per]?.shiftUpdateType
      let userInfos = dataChanged[per].applicableObjects.find(u => u.uid == per)
      return {
        shiftsUsers: [ // Required
          {
            employeeNo: per,
            fullName: item.name,
            email: `${userInfos.username?.toLowerCase()}@vingroup.net`,
            jobTitle: userInfos.job_name,
            department: item.departmentPartGroup,
            companyCode: localStorage.getItem('companyCode'),
            shift_Id_Old: shiftUpdateType == Constants.SUBSTITUTION_SHIFT_CODE ? item.timesheets.find(t => t.day == moment(dateChanged, 'YYYYMMDD').format("DD/MM"))?.line1.old_shift_id : "" // Ca trước khi thay đổi
          }
        ],
        substitutionType: dataChanged[per].shiftType.value, // Loại phân ca - Required
        startDate: dateChanged, // Required
        endDate: dateChanged, // Required
        shift_Id: shiftUpdateType == Constants.SUBSTITUTION_SHIFT_CODE ? dataChanged[per].shiftFilter.shiftSelected.shift_id : "", // Mã ca thay đổi (Nhập mã ca thì không nhập (startTime, endTime, shiftHours) và ngược lại)
        startTime: shiftUpdateType == Constants.SUBSTITUTION_SHIFT_UPDATE ? dataChanged[per].startTime : "", // Giờ bắt đầu HHmmss
        endTime: shiftUpdateType == Constants.SUBSTITUTION_SHIFT_UPDATE ? dataChanged[per].endTime : "", // Giờ kết thúc HHmmss
        shiftHours: shiftUpdateType == Constants.SUBSTITUTION_SHIFT_UPDATE ? dataChanged[per].totalTime : "", // Tổng thời gian
        causes: dataChanged[per].reason || "" // Comment
      }
    })
    return {leaderChangeShifts: payload}
  }

  acceptShiftUpdating = async () => {
    try {
      const {timeTables, dateChanged, dataChanged} = this.state
      const timeSheetsUpdating = (timeTables || []).filter(item => item.isUpdating)
      const payload = this.prepareDataToSubmit(timeSheetsUpdating, dateChanged, dataChanged)
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      }

      const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}leaderchanges/shifts`, payload, config)
      if (response && response.data) {
        const result = response.data.result
        if (result.code == Constants.API_SUCCESS_CODE) {
          const data = response.data.data
          let resultShiftUpdateDetail = (data.leaderChangeShifts || []).map(item => {
            return {id: item.id, fullName: item.fullName, ad: item.userInfos.email ? item.userInfos.email.replace("@vingroup.net", "") : item.userInfos.employeeNo, status: item.isSuccessSyncFromSap ? 'S' : 'E', message: item.message || ""}
          })

          resultShiftUpdateDetail = [
            {
              sub: [...resultShiftUpdateDetail]
            }
          ]
          this.setState({isShowStatusModal: true, resultShiftUpdateDetail: resultShiftUpdateDetail})
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  hideStatusModal = () => {
    this.setState({isShowStatusModal: false})
    window.location.reload()
  }

  render() {
    const { t } = this.props
    const {isSearch, timeTables, dayList, isLoading, employeesForFilter, employeeSelectedFilter, dataChanged, dateChanged, isShowStatusModal, resultShiftUpdateDetail} = this.state

    return (
      <>
      <ResultDetailModal show={isShowStatusModal} title="Trạng thái cập nhật phân ca" onHide={this.hideStatusModal} resultDetail={resultShiftUpdateDetail}/>
      <div className="timesheet-section">
        <h1 className="h3 text-uppercase text-gray-800">{t("Timesheet")}</h1>
        <FilterData clickSearch={this.searchTimesheetByDate.bind(this)} updateEmployees={this.updateEmployees} />
        {
          (isSearch && timeTables.length > 0)  ?
          <>
          <div className="btn-block">
            <button type="button" className="btn btn-outline-success" onClick={this.exportTimeSheetsToExcel}><i className="fas fa-file-excel"></i>{t("ExportFile")}</button>
          </div>
          {/* Temp render table to export table to excel */}
          <table id="result-table" style={{display: 'none'}}>
            <thead>
              <tr>
                <th rowSpan="2">{t("FullName")}</th>
                <th rowSpan="2">{t("RoomPartGroup")}</th>
                <th rowSpan="2"></th>
                {
                  dayList.map((item, i) => {
                    return <th className="text-center text-uppercase font-weight-bold" key={i}>{moment(item).format("dddd").toLocaleUpperCase()}</th>
                  })
                }
              </tr>
              <tr>
                {
                  dayList.map((item, i) => {
                    return <th key={i}>{moment(item).format("DD/MM/YYYY")}</th>
                  })
                }
              </tr>
            </thead>
            <tbody>
              {
                timeTables.map((item, i) => {
                  return <React.Fragment key={i}>
                    <tr>
                      <td rowSpan="5">{item.name}</td>
                      <td rowSpan="5">{item.departmentPartGroup}</td>
                      <td>{t("TimePlan")}</td>
                      {this.renderDataPerDate(item.timesheets, 'line1')}
                    </tr>
                    <tr>
                      <td>{t("TimeActual")}</td>
                      {this.renderDataPerDate(item.timesheets, 'line2')}
                    </tr>
                    <tr>
                      <td>{t("Leave")}</td>
                      {this.renderDataPerDate(item.timesheets, 'line3', 'leave')}
                    </tr>
                    <tr>
                      <td>{t("Biztrip")}</td>
                      {this.renderDataPerDate(item.timesheets, 'line3', 'trip')}
                    </tr>
                    <tr>
                      <td>{t("OT")}</td>
                      {this.renderDataPerDate(item.timesheets, 'line4')}
                    </tr>
                  </React.Fragment>
                })
              }
            </tbody>
          </table>
          {/* End Temp render table to export table to excel */}
          <TimeSheetMember timesheets={timeTables} updateTimeSheetsParent={this.updateTimeSheetsParent} dayList={dayList} dateChanged={dateChanged} employeesForFilter={employeesForFilter} employeeSelectedFilter={employeeSelectedFilter} />
          {
            _.size(dataChanged) > 0 ?
            <div className="action-buttons-group">
              <Button type="button" variant="secondary" className="btn-cancel" onClick={this.cancelShiftUpdating}>{t("CancelSearch")}</Button>
              <Button type="button" variant="primary" className="btn-submit" onClick={this.acceptShiftUpdating} disabled={false}>{t("Save")}</Button>
            </div>
            : null
          }

          </> :
          isSearch ? <div className="alert alert-warning shadow" role="alert">{t("NoDataFound")}</div> :
          isLoading ? <div className="bg-light text-center p-5"><Spinner animation="border" variant="dark" size='lg' /></div>  : null
        }
      </div>
      </>
    );
  }
}

export default withTranslation()(EmployeeTimesheets);
