import React, { Component } from "react";
import FilterData from "../../ShareComponents/FilterData";
import axios from "axios";
import moment from "moment";
import { Spinner } from 'react-bootstrap';
import { withTranslation } from "react-i18next";
// import { useTranslation } from "react-i18next";
import TimeSheetMember from './TimeSheetMember'
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
      isLoading: false
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
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      // 'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
      // 'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
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
                timesheets: group_to_values[key],
              };
            });

            // const data = this.processDataForTable(groups,start, end, responses[0].data.data);
            // process time sheets raw data
            const data = groups.map((q) => {
              let aip =  {...q, timesheets: this.processDataForTable(q.timesheets,start, end, responses[0].data.data)}
              return aip
            });
            this.setState({ timeTables: data, isLoading: false, isSearch: true });
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
    return item.shift_id == "OFF" || item.is_holiday == 1;
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
  
  render() {
    const { t } = this.props;
    const {isSearch, timeTables, dayList, isLoading} = this.state

    console.log("kakakak")
    console.log(timeTables)

    return (
      <div className="timesheet-section">
        <FilterData clickSearch={this.searchTimesheetByDate.bind(this)} />
        {
          (isSearch && timeTables.length > 0)  ?
          <TimeSheetMember timesheets={timeTables} dayList={dayList}/> : 
          isSearch ? <div className="alert alert-warning shadow" role="alert">{t("NoDataFound")}</div> : 
          isLoading ? <div className="bg-light text-center p-5"><Spinner animation="border" variant="dark" size='lg' /></div>  : null
        }
      </div>
    );
  }
}

export default withTranslation()(EmployeeTimesheets);
