import React from 'react'
import axios from 'axios'
import TimesheetSearch from './timesheetSearch'
import TimesheetSummary from './TimesheetSummary'
import TimesheetDetail from './TimesheetDetail'

class Timesheet extends React.Component {

    constructor() {
        super();
        this.state = {
          timsheetSummary: [],
          timesheets: []
        }
    }
    
    searchTimesheetByDate (startDate, endDate) {
        const config = {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
              'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
            }
        }

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/profile`, config)
        .then(res => {
            if (res && res.data && res.data.data) {
            let userProfile = res.data.data[0];
            this.setState({ userProfile: userProfile });
            }
        }).catch(error => {
            // localStorage.clear();
            // window.location.href = map.Login;
        })
        console.log(startDate)
        console.log(endDate)
    }

    render() {
      return <div className="timesheet-section">
      <TimesheetSearch clickSearch={this.searchTimesheetByDate.bind(this)}/>
      
      <TimesheetSummary timsheetSummary={this.state.timesheetSummary}/>

      <TimesheetDetail timesheets={this.state.timesheets}/>
      </div>
    }
  }
export default Timesheet;