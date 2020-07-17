import React, { useState } from "react"
import Button from 'react-bootstrap/Button'
import Fade from 'react-bootstrap/Fade'

function WorkingDay(props) {
  return (
    <div className="content">
      <span className="float-left">Bắt đầu {props.index}: <b>{props.startTime}</b></span>
      <span className="float-right">Kết thúc {props.index}: <b>{props.endTime}</b></span>
    </div>
    )
  
}

function Content(props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        variant="link"
        className="text-left"
        block
      >
        <div className="row">
          <div className="col-3">
            <i className={!open ? 'fa fa-plus-circle' : 'fa fa-minus-circle'}>&nbsp;</i>{props.timesheet.date.replace(/-/g, '/')}
          </div>
          <div className="col-2">
              <Fade in={!open}>
                <div id={"timesheet-detail-" + props.index}>Giờ kế hoạch</div>
              </Fade>
          </div>
          <div className="col-2">
              <Fade in={!open}>
                <div id={"timesheet-detail-" + props.index}>Giờ thực tế</div>
              </Fade>
          </div>
        </div>
    </Button>
    
    {open ? <Fade in={open}>
      <div id={"timesheet-detail-" + props.index} className="content">
      <div className="row">
        <div className="col-md-5 box">
          <div className="title text-center">Giờ kế hoạch</div>
          <WorkingDay index={1} startTime={props.timesheet.start_time1_plan} endTime={props.timesheet.end_time1_plan}/>
          {props.timesheet.start_time2_plan ? <WorkingDay index={2} startTime={props.timesheet.start_time2_plan} endTime={props.timesheet.end_time2_plan}/> : null}
          {props.timesheet.start_time3_plan ? <WorkingDay index={3} startTime={props.timesheet.start_time3_plan} endTime={props.timesheet.end_time3_plan}/> : null}
        </div>
        <div className="col-md-5 box">
          <div className="title text-center">Giờ thực tế</div>
          <WorkingDay index={1} startTime={props.timesheet.start_time1_fact} endTime={props.timesheet.end_time1_fact}/>
          {props.timesheet.start_time2_fact ? <WorkingDay index={1} startTime={props.timesheet.start_time2_fact} endTime={props.timesheet.end_time1_fact}/> : null}
          {props.timesheet.start_time3_fact ? <WorkingDay index={1} startTime={props.timesheet.start_time3_fact} endTime={props.timesheet.end_time3_fact}/> : null}
        </div>
      </div>
      </div> 
    </Fade>: null}
    <hr/>
    </>
  )
}

function TimesheetDetail(props) {
  console.log(props)
  return (
    <div className="detail">
        <div className="card shadow">
          <div className="card-header bg-success text-white">CHI TIẾT NGÀY CÔNG</div>
          <div className="card-body">
            {props.timesheets.map((timesheet, key) => {
              return<Content timesheet={timesheet} index={key} key={key}/>
            })}
        </div>
        </div>
      </div>
  )
}

export default TimesheetDetail