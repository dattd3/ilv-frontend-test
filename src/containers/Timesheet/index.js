import React from 'react'
import axios from 'axios'
import TimesheetSearch from './timesheetSearch'
import TimesheetSummary from './TimesheetSummary'
import TimesheetDetail from './TimesheetDetail'
import moment from 'moment'

class Timesheet extends React.Component {

    constructor() {
        super();
        this.state = {
          timsheetSummary: {},
          timesheets: [],
          isSearch: false
        }
    }
    
    searchTimesheetByDate (startDate, endDate) {
        this.setState({ isSearch: false })
        const config = {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
              'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
            }
        }

        const start = moment(startDate).format('YYYYMMDD').toString()
        const end = moment(endDate).format('YYYYMMDD').toString()

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/timekeeping?from_time=${start}&to_time=${end}`, config)
        .then(res => {
          if (res && res.data && res.data.data) {
            const timsheetSummary = res.data.data[0]
            this.setState({ timsheetSummary: timsheetSummary, isSearch: true })
          }
        }).catch(error => {
            // localStorage.clear();
            // window.location.href = map.Login;
        })

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/timekeeping/detail?from_time=${start}&to_time=${end}`, config)
        .then(res => {
          if (res && res.data && res.data.data) {
            const timesheets = res.data.data
            this.setState({ timesheets: timesheets, isSearch: true })
          }
        }).catch(error => {
            // localStorage.clear();
            // window.location.href = map.Login;
        })
    }

    render() {
      return (
      <div className="timesheet-section">
        <TimesheetSearch clickSearch={this.searchTimesheetByDate.bind(this)}/>
      { (this.state.isSearch && this.state.timsheetSummary && this.state.timesheets.length > 0) ?
        <>
          <TimesheetSummary timsheetSummary={this.state.timsheetSummary}/>
          <TimesheetDetail timesheets={this.state.timesheets}/>
        </>
        : this.state.isSearch ? 
          <div class="alert alert-warning shadow" role="alert">Không tìm thấy dữ liệu</div> 
        : null
      }
      </div>)
    }
  }
export default Timesheet;