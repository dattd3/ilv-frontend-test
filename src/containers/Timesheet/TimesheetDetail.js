import React, { useState } from "react"
import Button from 'react-bootstrap/Button'
import Fade from 'react-bootstrap/Fade'

function WorkingDay(props) {
  return (
    <div className="content">
      <div className="item">
        <p>Bắt đầu {props.index}</p>
        <p className="data"><b>{props.startTime || ""}</b>&nbsp;</p>
      </div>
      <div className="item">
        <p>Kết thúc {props.index}</p>
        <p className="data"><b>{props.endTime || ""}</b>&nbsp;</p>
      </div>
    </div>
  )
}

function Content(props) {
  const [open, setOpen] = useState(true);
  let timeFail1 = (props.timesheet.start_time1_plan < props.timesheet.start_time1_fact || props.timesheet.end_time1_plan > props.timesheet.end_time1_fact)
  let timeFail2 = (props.timesheet.start_time2_plan < props.timesheet.start_time2_fact || props.timesheet.end_time2_plan > props.timesheet.end_time2_fact)
  let timeFail3 = (props.timesheet.start_time3_plan < props.timesheet.start_time3_fact || props.timesheet.end_time3_plan > props.timesheet.end_time3_fact)
  let timeFail4 = (props.timesheet.start_time1_plan && (props.timesheet.start_time1_fact === null || props.timesheet.end_time1_fact === null))
  let timeFail = timeFail1 || timeFail2 || timeFail3 || timeFail4
  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        variant={props.timesheet.start_time1_plan == null ? "secondary" : "info"}
        className= "text-left"
        block >
        <div className="row">
          <div className="col-3">
            <i className={!open ? 'fa fa-plus-circle' : 'fa fa-minus-circle'}>&nbsp;</i>{props.timesheet.date.replace(/-/g, '/')}
          </div>
          <div className="col-3">
            <Fade in={props.timesheet.start_time1_plan == null}>
              <div id={"timesheet-detail-" + props.index}>Ngày nghỉ</div>
            </Fade>
          </div>
          <div className="col-3">
            <Fade in={!open}>
              <div id={"timesheet-detail-" + props.index}></div>
            </Fade>
          </div>
        </div>
      </Button>

      {open ? <Fade in={open}>
        <div id={"timesheet-detail-" + props.index} className="content">
        <div className="row">
          <div className="col-md-3 time-item">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title text-center">Giờ kế hoạch</h6>
                <WorkingDay index={1} startTime={props.timesheet.start_time1_plan} endTime={props.timesheet.end_time1_plan} />
                {props.timesheet.start_time2_plan ? <WorkingDay index={2} startTime={props.timesheet.start_time2_plan} endTime={props.timesheet.end_time2_plan}/> : null}
                {props.timesheet.start_time3_plan ? <WorkingDay index={3} startTime={props.timesheet.start_time3_plan} endTime={props.timesheet.end_time3_plan}/> : null}
              </div>
            </div>
          </div>

          <div className="col-md-3 time-item">
            <div className="card">
              <div className={ timeFail ? "card-body text-danger background-red" : "card-body"}>
                <h6 className="card-title text-center">Giờ thực tế</h6>
                <WorkingDay index={1} startTime={props.timesheet.start_time1_fact} endTime={props.timesheet.end_time1_fact}/>
                {props.timesheet.start_time2_fact ? <WorkingDay index={2} startTime={props.timesheet.start_time2_fact} endTime={props.timesheet.end_time2_fact}/> : null}
                {props.timesheet.start_time3_fact ? <WorkingDay index={3} startTime={props.timesheet.start_time3_fact} endTime={props.timesheet.end_time3_fact}/> : null}
              </div>
            </div>
          </div>

          <div className="col-md-3 time-item">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title text-center">Giờ công thực tế</h6>
                <h5 className="card-text text-center">{props.timesheet.actual_working_hours || 0}</h5>
              </div>
            </div>
          </div>

          <div className="col-md-3 time-item">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title text-center">Nghỉ hưởng lương (giờ)</h6>
                <h5 className="card-text text-center">{props.timesheet.paid_leave || 0}</h5>
              </div>
            </div>
          </div>

          <div className="col-md-3 time-item">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title text-center">Nghỉ không hưởng lương</h6>
                <h5 className="card-text text-center">{props.timesheet.unpaid_leave || 0}</h5>
              </div>
            </div>
          </div>

          <div className="col-md-3 time-item">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title text-center">Công tác (giờ)</h6>
                <h5 className="card-text text-center">{props.timesheet.attendance_hours || 0}</h5>
              </div>
            </div>
          </div>

          <div className="col-md-3 time-item">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title text-center">Giờ đào tạo</h6>
                <h5 className="card-text text-center">{props.timesheet.trainning_hours || 0}</h5>
              </div>
            </div>
          </div>

          <div className="col-md-3 time-item">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title text-center">Giờ OT chuyển thành nghỉ bù</h6>
                <h5 className="card-text text-center">{props.timesheet.compensatory_leave_hours || 0}</h5>
              </div>
            </div>
          </div>
        </div>
        </div>
      </Fade>: null}
    <hr/>
    </>
  )
}

function TimesheetDetail(props) {
  return (
    <div className="detail">
      <div className="card shadow">
        <div className="card-header bg-success text-white">CHI TIẾT NGÀY CÔNG</div>
        <div className="card-body">
            {props.timesheets.map((timesheet, key) => {
              return <Content timesheet={timesheet} index={key} key={key}/>
            })}
        </div>
      </div>
    </div>
  )
}

export default TimesheetDetail
