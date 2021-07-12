import React, { Component } from 'react';
import FilterData from '../../ShareComponents/FilterData'
import axios from 'axios'
import moment from 'moment'

class PersonalDetails extends Component {
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
                // const data = this.processDataForTable(dataSorted,start, end, responses[0].data.data);
                const data = []
                this.setState({ timeTables: data})
              }
          }
        }))
    }

    render() {
        return (
            <div className="timesheet-section">
                <FilterData clickSearch={this.searchTimesheetByDate.bind(this)}/>
            </div>
        );
    }
}

export default PersonalDetails;