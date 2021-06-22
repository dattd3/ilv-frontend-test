import React from 'react'
import axios from 'axios'
import { withTranslation } from "react-i18next"
import TimesheetSearch from './timesheetSearch'
import TimesheetSummary from './TimesheetSummary'
import TimesheetDetail from './TimesheetDetail'
import TimeTableDetail from './TimeTableDetail'
import moment from 'moment'
const DATE_TYPE = {
  DATE_OFFSET: 0,
  DATE_NORMAL: 1,
  DATE_OFF: 2
};
const EVENT_TYPE = {
  NO_EVENT: 0,
  EVENT_KEHOACH: 1,
  EVENT_KE_HOACH_CONTINUE: 2,
  EVENT_GIOTHUCTE : 3,
  EVENT_LOICONG: 4,
  EVENT_GIONGHI: 5,
  EVENT_CONGTAC: 6,
  EVENT_OT: 7
};

class Timesheet extends React.Component {

    constructor() {
        super();
        this.state = {
          timsheetSummary: {
          },
          timesheets: [],
          timeTables: [],
          isSearch: false
        }
    }
    
    searchTimesheetByDate (startDate, endDate) {
        this.setState({ isSearch: false })
        this.search(startDate, endDate);
        //this.requestReasonAndComment(startDate, endDate);
        const config = {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
              'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
            }
        }

        const start = moment(startDate).format('YYYYMMDD').toString()
        const end = moment(endDate).format('YYYYMMDD').toString()

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/timekeeping?from_time=${start}&to_time=${end}`, config)
        .then(res => {
          if (res && res.data && res.data.data) {
            const defaultData = {
              actual_working: 0,
              attendance: 0,
              paid_leave: 0,
              salary_wh: 0,
              total_overtime: 0,
              trainning: 0,
              unpaid_leave: 0,
              working_day_plan: 0,
              working_deal: 0
            }
            const timsheetSummary = res.data.data[0] ? res.data.data[0] : defaultData;
            this.setState({ timsheetSummary: timsheetSummary, isSearch: true })
          }
        }).catch(error => {
            // localStorage.clear();
            // window.location.href = map.Login;
        })

    }

    search(startDate, endDate) {
      let start = moment(startDate).format('YYYYMMDD').toString()
      let end = moment(endDate).format('YYYYMMDD').toString()
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        // 'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
        // 'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
      };

        const timeoverviewParams = {
          from_date: start,
          to_date: end
        };
        const reasonParams = {
          startdate: start,
          endDate: end
        }
        const timOverviewEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/timeoverview`;
        const ReasonEndpoint = `${process.env.REACT_APP_REQUEST_URL}request/GetLeaveTypeAndComment`;
        const requestTimOverview = axios.get(timOverviewEndpoint, {headers,params: timeoverviewParams });
        const requestReson = axios.get(ReasonEndpoint, {headers, params: reasonParams});
        axios.all([requestReson, requestTimOverview]).then(axios.spread((...responses) => {
          if(responses[1]) {
              const res = responses[1];
              if (res && res.data && res.data.data) {
                let dataSorted = res.data.data.sort((a, b) => moment(a.date, "DD-MM-YYYY").format("YYYYMMDD") < moment(b.date, "DD-MM-YYYY").format("YYYYMMDD") ? 1 : -1)
                if(dataSorted && dataSorted.length > 0) {
                  const startReal =   moment( dataSorted[dataSorted.length - 1].date, 'DD-MM-YYYY').format('YYYYMMDD');
                  start = startReal > start ? startReal : start;
                  const endReal = moment(dataSorted[0].date, 'DD-MM-YYYY').format('YYYYMMDD'); 
                  end = endReal < end ? endReal : end;
                } 
                const data = this.processDataForTable(dataSorted,start, end, responses[0].data.data);
                this.setState({ timeTables: data})
              }
          }
        }))
    }

    checkExist = (text) => {
      return text && text != '#'; 
    }
  
    getDayOffset = (currentDate, offset) => {
      const tomorrow = new Date(currentDate.getTime());
      tomorrow.setDate(currentDate.getDate()+ offset);
      return tomorrow;
  
    }

    getDatetimeForCheckFail(startTime, endTime, currentDay, nextDay) {
      //const currentDay = moment(dateString, "DD-MM-YYYY").format("YYYYMMDD");
      //const nextDay = moment(this.getDayOffset( moment(dateString, 'DD-MM-YYYY').toDate(), 1)).format('YYYYMMDD');
     
      return {
        start: currentDay + startTime,
        end: startTime < endTime ? currentDay + endTime : nextDay + endTime
      };
    }

    // "leave_start_time2": item.leave_start_time2, //nghi
    // "leave_end_time2": item.leave_end_time2, //nghi
    // "leave_end_time1": item.leave_end_time1, //nghi
    // "leave_start_time1":item.leave_start_time1, //nghi
    // "trip_end_time1": item.trip_end_time1, //cong tac
    // "trip_end_time2": item.trip_end_time2, //cong tac
    // "trip_start_time2": item.trip_start_time2,  //cong tac
    // "trip_start_time1": item.trip_start_time1, //cong tac

    // "ot_end_time3": item.ot_end_time3,//ot
    // "ot_end_time2": item.ot_end_time2, //ot
    // "ot_end_time1": item.ot_end_time1,//ot
    // "ot_start_time1":item.ot_start_time1,//ot
    // "ot_start_time2": item.ot_start_time2,//ot
    // "ot_start_time3": item.ot_start_time3//ot

    // to_time1: item.to_time1,
    //         to_time2: item.to_time2, 
    //         from_time2: item.from_time2, 
    //         from_time1: item.from_time1

    
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
      const fromDate = moment(fromDateString, 'YYYYMMDD').toDate();
      const toDate = moment(toDateString, 'YYYYMMDD').toDate();
      
       // Lấy số thứ tự của ngày hiện tại
      const fromDate_day = fromDate.getDay() == 0 ? 7 : fromDate.getDay();
      const toDate_day = toDate.getDay() == 0 ? 7 : toDate.getDay();
      const firstArray = Array.from({length:fromDate_day - 1}).map((x, index) => {
        return {
          day: moment(this.getDayOffset(fromDate, -1 *(fromDate_day - index - 1))).format('DD/MM'),
          date_type : DATE_TYPE.DATE_OFFSET, //ngay trắng,
          date: index + 1  // thu 2
        }
      })
      const lastArray = Array.from({length:7 - toDate_day}).map((x, index) => {
        return {
            date_type : DATE_TYPE.DATE_OFFSET, //ngay trắng,
            date: toDate_day + index + 1,  // thu 2
            day: moment(this.getDayOffset(toDate, index + 1)).format('DD/MM')
          }
      })
      const today = moment(new Date()).format("YYYYMMDD")
      for(let index = 0; index < data.length; index++) {
        const item = data[index];
        const currentDay = moment(item.date, "DD-MM-YYYY").format("YYYYMMDD");
        const nextDay = moment(this.getDayOffset( moment(item.date, 'DD-MM-YYYY').toDate(), 1)).format('YYYYMMDD');
        
        if(item.shift_id == 'OFF') {
          data[index] = {
            day: moment(item.date, 'DD-MM-YYYY').format('DD/MM'),
            date_type : DATE_TYPE.DATE_OFF, //ngày OFF
          }
          continue;
        }
        const timeSteps = [];
        //gio ke hoach  type( 0:khong co event , 1:  co 1 event, 2: event dang tiep tu,), subtype (0, khong co, 1 : etime 1, 2 time 2, 3 ca 2 time)
        const line1 = {type : EVENT_TYPE.NO_EVENT,
           subtype: '00', 
           count: item.count,
            shift_id : item.shift_id != '****' ? item.shift_id : null,
            to_time1: item.to_time1,
            to_time2: item.to_time2, 
            from_time2: item.from_time2, 
            from_time1: item.from_time1 };
        if(this.checkExist(item.from_time1)) {
          line1.type = EVENT_TYPE.EVENT_KEHOACH;
          line1.subtype =  1 + line1.subtype[0]
          
        }
        if(this.checkExist(item.from_time2)) {
          line1.type = EVENT_TYPE.EVENT_KEHOACH;
          line1.subtype = line1.subtype[0] + 1
          //timeSteps.push({start: item.from_time2, end: item.from_time2});
        }
        const nextItem = index + 1 < data.length ? data[index + 1 ] : null;
        if(nextItem &&  moment(item.date, 'DD-MM-YYYY').toDate().getDay() != 1 && this.checkExist(item.from_time1) && nextItem.from_time1 == item.from_time1 && nextItem.to_time1 == item.to_time1 && nextItem.from_time2 == item.from_time2 && nextItem.to_time2 == item.to_time2) {
          line1.type = EVENT_TYPE.EVENT_KE_HOACH_CONTINUE;
          line1.subtype = '00';
          nextItem.count = line1.count ? line1.count + 1 : 2;
          data[index + 1] = nextItem;
        }        

        //gio thuc te  // khong co event , 1 : gio thuc te, 2 : loi cham cong
        let line2 = {type: EVENT_TYPE.NO_EVENT, 
        type1: '00', 
        subtype: '000', 
        "start_time1_fact": item.start_time1_fact, //gio thuc te
        "end_time1_fact": item.end_time1_fact, //gio thuc te
        "end_time2_fact": item.end_time2_fact, //gio thuc te
        "start_time2_fact": item.start_time2_fact, //gio thuc te
        "start_time3_fact": item.start_time3_fact, //gio thuc te
        "end_time3_fact": item.end_time3_fact, //gio thuc te 
        };
        if(this.checkExist(item.start_time1_fact)) {
          line2.type = EVENT_TYPE.EVENT_GIOTHUCTE;
          
          if(this.checkExist(item.end_time1_fact)) {
            line2.type1 = EVENT_TYPE.EVENT_GIOTHUCTE + line2.type1[1];
            line2.subtype = 1 + line2.subtype[1];
            timeSteps.push(this.getDatetimeForCheckFail(item.start_time1_fact, item.end_time1_fact, currentDay, nextDay));
          } else {
            line2.type1 =  EVENT_TYPE.EVENT_LOICONG + line2.type1[1];
            line2.subtype = '1' + line2.subtype[1];
          }
        }
        if(this.checkExist(item.start_time2_fact)) {
          line2.type =  EVENT_TYPE.EVENT_GIOTHUCTE;
          if(this.checkExist(item.end_time2_fact)) {
            line2.type1 = line2.type1[0] + EVENT_TYPE.EVENT_GIOTHUCTE;
            line2.subtype = line2.subtype[0] + 1
            timeSteps.push(this.getDatetimeForCheckFail(item.start_time2_fact, item.end_time2_fact, currentDay, nextDay));
          } else {
            line2.type1 = line2.type1[0] + EVENT_TYPE.EVENT_LOICONG;
            line2.subtype = line2.subtype[0] + 1
          }
          
        }
        // if(this.checkExist(item.start_time3_fact)) {
        //   line2.type =  EVENT_TYPE.EVENT_GIOTHUCTE;
        //   line2.subtype = line2.subtype.replace(2, 1)
        //   //timeSteps.push({start: item.start_time3_fact, end: item.end_time3_fact});
        //   timeSteps.push(this.getDatetimeForCheckFail(item.start_time3_fact, item.end_time3_fact, currentDay, nextDay));
        // }
  
        //gio nghi : //0: khong co event, 1 : nghi, 2 : cong tac
        let line3 = {
            type: 0, 
            subtype: '00', 
           "leave_start_time2": item.leave_start_time2, //nghi
           "leave_end_time2": item.leave_end_time2, //nghi
           "leave_end_time1": item.leave_end_time1, //nghi
           "leave_start_time1":item.leave_start_time1, //nghi
           "trip_end_time1": item.trip_end_time1, //cong tac
           "trip_end_time2": item.trip_end_time2, //cong tac
           "trip_start_time2": item.trip_start_time2,  //cong tac
           "trip_start_time1": item.trip_start_time1, //cong tac
        }
        if(this.checkExist(item.leave_start_time1)) {
          line3.type =  EVENT_TYPE.EVENT_GIONGHI;
          line3.subtype = 1 + line3.subtype[1]
          timeSteps.push(this.getDatetimeForCheckFail(item.leave_start_time1, item.leave_end_time1, currentDay, nextDay));
        }
        if(this.checkExist(item.leave_start_time2)) {
          line3.type = EVENT_TYPE.EVENT_GIONGHI;
          line3.subtype = line3.subtype[0] + 1
          timeSteps.push(this.getDatetimeForCheckFail(item.leave_start_time2, item.leave_end_time2, currentDay, nextDay));
        }
        if(this.checkExist(item.trip_start_time1)) {
          line3.type = EVENT_TYPE.EVENT_CONGTAC;
          line3.subtype =1 + line3.subtype[1]
          
          timeSteps.push(this.getDatetimeForCheckFail(item.trip_start_time1, item.trip_end_time1, currentDay, nextDay));
        }
        if(this.checkExist(item.trip_start_time2)) {
          line3.type = EVENT_TYPE.EVENT_CONGTAC;
          line3.subtype = line3.subtype[0] + 1
          timeSteps.push(this.getDatetimeForCheckFail(item.trip_start_time2, item.trip_end_time2, currentDay, nextDay));
        }
  
        //gio OT
        const line4 = {
          type: 0,
          subtype: '000', 
          "ot_end_time3": item.ot_end_time3,//ot
          "ot_end_time2": item.ot_end_time2, //ot
          "ot_end_time1": item.ot_end_time1,//ot
          "ot_start_time1":item.ot_start_time1,//ot
          "ot_start_time2": item.ot_start_time2,//ot
          "ot_start_time3": item.ot_start_time3//ot
        }
        if(this.checkExist(item.ot_start_time1)) {
          line4.type =  EVENT_TYPE.EVENT_OT;
          line4.subtype = 1 + line4.subtype[1] + line4.subtype[2]
        }
        if(this.checkExist(item.ot_start_time2)) {
          line4.type =  EVENT_TYPE.EVENT_OT;
          line4.subtype =line4.subtype[0] + 1 + line4.subtype[2]
        }
        if(this.checkExist(item.ot_start_time3)) {
          line4.type = EVENT_TYPE.EVENT_OT;
          line4.subtype = line4.subtype[0] + line4.subtype[1] + 1
        }
        
       //check loi
       
       //check betwwen step time
        let timeStepsSorted = timeSteps.sort((a, b) => a.start > b.start ? 1 : -1);
        let isValid1 = true;
        let isValid2 = true;
        let isShift1 = true;
        let minStart = 0, maxEnd = 0, minStart2 = null, maxEnd2 = null;  
        const kehoach1 = this.getDatetimeForCheckFail(item.from_time1, item.to_time1, currentDay, nextDay)
        const kehoach2 = this.getDatetimeForCheckFail(item.from_time2, item.to_time2, currentDay, nextDay);
        if(timeSteps && timeSteps.length > 0) {
          minStart = timeStepsSorted[0].start;
          maxEnd = timeStepsSorted[0].end
          minStart2 = timeStepsSorted[0].start;;
          maxEnd2 = timeStepsSorted[0].end;
          for(let i = 0, j = 1; j < timeStepsSorted.length; i++, j++) {
            minStart = isShift1 && timeStepsSorted[i].start < minStart ? timeStepsSorted[i].start : minStart;
            minStart2 = (timeStepsSorted[i].start < minStart2) ? timeStepsSorted[i].start : minStart2;

            if(timeStepsSorted[j].start > kehoach1.end) {
              isShift1 = false;
            }
            maxEnd = isShift1 && timeStepsSorted[j].end >  maxEnd ? timeStepsSorted[j].end : maxEnd; 
            maxEnd2 =  (timeStepsSorted[j].end > maxEnd2) ? timeStepsSorted[j].end : maxEnd2;

            if(timeStepsSorted[i].end < timeStepsSorted[j].start) {

              if(line1.subtype == '11' && (timeStepsSorted[i].end >= kehoach1.end && timeStepsSorted[j].start <= kehoach2.start)) {
                isShift1 = false;
                maxEnd = timeStepsSorted[i].end;
                minStart2 = timeStepsSorted[j].start;
                maxEnd2 = timeStepsSorted[j].end;
              } else {
                minStart2 = timeStepsSorted[j].start;
                maxEnd2 = timeStepsSorted[j].end;
                if(timeStepsSorted[i].end < kehoach1.end) {
                  isValid1 = false;
                }
               
                if(timeStepsSorted[j].start > kehoach2.start) {
                  isValid2 = false;
                }
              }
              
            }
          }
          
        }
        //check with propose time
        if(this.checkExist(item.from_time1)) {
          isValid1 = minStart <= kehoach1.start && maxEnd >= kehoach1.end && isValid1 ? true : false;
          
          line2.type1 = isValid1 == false && currentDay <= today  ?  EVENT_TYPE.EVENT_LOICONG + line2.type1[1] : line2.type1;
          if(line2.type1[0] == EVENT_TYPE.EVENT_LOICONG) {
            line2.type = EVENT_TYPE.EVENT_GIOTHUCTE;
            line2.subtype = '1' + line2.subtype[1];
          }
          if(line2.type1[0] == 0) {
            line2.subtype = '1' + line2.subtype[1];
          }
        }
        
        if(this.checkExist(item.from_time2)) {
          isValid2 = minStart2 <= kehoach2.start && maxEnd2 >= kehoach2.end && isValid2 ? true : false;
          line2.type1 = isValid2 == false && currentDay <= today ?  line2.type1[0] + EVENT_TYPE.EVENT_LOICONG : line2.type1;
          if(line2.type1[1] == EVENT_TYPE.EVENT_LOICONG) {
            line2.type = EVENT_TYPE.EVENT_GIOTHUCTE;
            line2.subtype = line2.subtype[0] + '1';
          }
          if( line2.type1[1] == 0) {
            line2.subtype = line2.subtype[0] + '1';
          }
        }
        //get Comment

        line3 = this.getComment(moment(item.date, 'DD-MM-YYYY').format('YYYYMMDD'), line1, line3, reasonData);

        data[index] = {
            day: moment(item.date, 'DD-MM-YYYY').format('DD/MM'),
            date_type : DATE_TYPE.DATE_NORMAL, // ngày bt
          //date: 1,  // thu 3
          line1 : { // type( 0:khong co event , 1:  co 1 event, 2: event dang tiep tu,), subtype (0, khong co, 1 : etime 1, 2 time 2, 3 ca 2 time)
            ...line1
          },
          line2: {
            ...line2
          },
          line3: {
            ...line3
          },
          line4: {
            ...line4
          }
        }
        
        
        
      }
      return [...firstArray, ...(data.reverse()), ...lastArray];
    }

    render() {
      const { t } = this.props
      return (
      <div className="timesheet-section">
        <TimesheetSearch clickSearch={this.searchTimesheetByDate.bind(this)}/>
        { (this.state.isSearch && this.state.timsheetSummary) ?
          <>
            <TimesheetSummary timsheetSummary={this.state.timsheetSummary}/>
          </>
          : this.state.isSearch ? 
            <div className="alert alert-warning shadow" role="alert">{t("NoDataFound")}</div> 
          : null
        }
        {
          (this.state.timeTables)  ?
          <TimeTableDetail timesheets={this.state.timeTables}/> : <div className="alert alert-warning shadow" role="alert">{t("NoDataFound")}</div> 
        }
        
      
      </div>)
    }
  }
export default withTranslation()(Timesheet);