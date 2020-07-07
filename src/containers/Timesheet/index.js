import React from "react"
import TimesheetSearch from './timesheetSearch'
import TimesheetSummary from './TimesheetSummary'
import TimesheetDetail from './TimesheetDetail'

class Timesheet extends React.Component {
    render() {
      return <div className="timesheet-section">
      <TimesheetSearch/>
      
      <TimesheetSummary/>

      <TimesheetDetail/>
      </div>
    }
  }
export default Timesheet;