import React from 'react'
import { withTranslation } from "react-i18next"
import moment from 'moment'
import axios from 'axios'
import TimesheetSearch from './timesheetSearch'
import TimesheetSummary from './TimesheetSummary'
import TimesheetDetail from './TimesheetDetail'
import TimeTableDetail from './TimeTableDetail'
import { getMuleSoftHeaderConfigurations, getRequestConfigurations } from "../../commons/Utils"

class Timesheet extends React.Component {
    constructor() {
        super();
        this.state = {
          timsheetSummary: {},
          timesheets: [],
          timeTableData: null,
          isSearch: false,
          isTableSearch: false
        }
    }

    search(startDate, endDate) {
      this.setState({ isSearch: false, isTableSearch: false })
      let start = moment(startDate).format('YYYYMMDD').toString()
      let end = moment(endDate).format('YYYYMMDD').toString()

      const timeoverviewParams = {
        from_date: start,
        to_date: end
      };
      const reasonParams = {
        startdate: start,
        endDate: end
      }

      const config = getRequestConfigurations()
      config['params'] = reasonParams
      const muleSoftConfig = getMuleSoftHeaderConfigurations()
      const muleSoftConfigOriginal = {...muleSoftConfig}
      muleSoftConfig['params'] = timeoverviewParams

      const timOverviewEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/timeoverview`;
      const ReasonEndpoint = `${process.env.REACT_APP_REQUEST_URL}request/GetLeaveTypeAndComment`;
      const timekeepingEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/timekeeping?from_time=${start}&to_time=${end}`;
      
      const requestTimOverview = axios.get(timOverviewEndpoint, muleSoftConfig);
      const requestReson = axios.get(ReasonEndpoint, config);
      const requestTimekeeping = axios.get(timekeepingEndpoint, muleSoftConfigOriginal)

      Promise.allSettled([requestReson, requestTimOverview, requestTimekeeping]).then(axios.spread((...responses) => {
        const localState = {...this.state};
        //process BCC
        if(responses[1].status == "fulfilled") {
            const res = responses[1].value;
            if (res && res.data && res.data.data) {
              let dataSorted = res.data.data.sort((a, b) => moment(a.date, "DD-MM-YYYY").format("YYYYMMDD") < moment(b.date, "DD-MM-YYYY").format("YYYYMMDD") ? 1 : -1)
              if(dataSorted && dataSorted.length > 0) {
                const startReal =   moment( dataSorted[dataSorted.length - 1].date, 'DD-MM-YYYY').format('YYYYMMDD');
                start = startReal > start ? startReal : start;
                const endReal = moment(dataSorted[0].date, 'DD-MM-YYYY').format('YYYYMMDD'); 
                end = endReal < end ? endReal : end;
              } 
              localState.isTableSearch = true;
              localState.timeTableData = {
                dataSorted,
                start,
                end,
                reason: responses[0].status == 'fulfilled' ?  responses[0].value.data.data : []
              }
            }
        } else {
          localState.isTableSearch = true;
          localState.timeTableData = {
            dataSorted: [],
            start,
            end,
            reason: []
          }
        }

        //process timekeeping
        if(responses[2].status == "fulfilled") {
          let res = responses[2].value
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
            localState.isSearch = true;
            localState.timsheetSummary = timsheetSummary;
          }
        }

        this.setState(localState)
      }))
    }
  
    render() {
      const { t } = this.props
      return (
      <div className="timesheet-section personal-timesheet">
        <TimesheetSearch clickSearch={this.search.bind(this)}/>
        { (this.state.isSearch && this.state.timsheetSummary) ?
          <>
            <TimesheetSummary timsheetSummary={this.state.timsheetSummary}/>
          </>
          : this.state.isSearch ? 
            <div className="alert alert-warning shadow" role="alert">{t("NoDataFound")}</div> 
          : null
        }
        {
          (this.state.isTableSearch && this.state.timeTableData) ? 
          <TimeTableDetail timesheetData ={this.state.timeTableData} isSearch={this.state.isTableSearch} showCavet = {false} isOpen = {true}/> 
          : null
        }
      
      </div>)
    }
  }
export default withTranslation()(Timesheet);