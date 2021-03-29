import React, { useState } from "react"
import Button from 'react-bootstrap/Button'
import Fade from 'react-bootstrap/Fade'
import moment from 'moment'
import { useTranslation } from "react-i18next"

function WorkingDay(props) {
  const { t } = useTranslation();
  return (
    <div className="content">
      <div className="item">
        <p>{t("StartTime")} {props.index}</p>
        <p className="data"><b>{props.startTime || ""}</b>&nbsp;</p>
      </div>
      <div className="item">
        <p>{t("EndTime")} {props.index}</p>
        <p className="data"><b>{props.endTime || ""}</b>&nbsp;</p>
      </div>
    </div>
  )
}



function Content(props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  let timeFail1 = (props.timesheet.start_time1_plan < props.timesheet.start_time1_fact || props.timesheet.end_time1_plan > props.timesheet.end_time1_fact)
  let timeFail2 = (props.timesheet.start_time2_plan < props.timesheet.start_time2_fact || props.timesheet.end_time2_plan > props.timesheet.end_time2_fact)
  let timeFail3 = (props.timesheet.start_time3_plan < props.timesheet.start_time3_fact || props.timesheet.end_time3_plan > props.timesheet.end_time3_fact)
  let timeFail4 = (props.timesheet.start_time1_plan && (props.timesheet.start_time1_fact === null || props.timesheet.end_time1_fact === null))
  let timeFail = timeFail1 || timeFail2 || timeFail3 || timeFail4

  let getDayName = (date) => {
    var days = [t("Sun"), t('Mon'), t('Tue'), t('Wed'), t('Thu'), t('Fri'), t('Sat')];
    var dayStr = moment(date, "DD-MM-YYYY").format("MM/DD/YYYY").toString()
    var d = new Date(dayStr);
    var dayName = days[d.getDay()];
    return dayName
  }

  const lang = localStorage.getItem("locale")

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        variant={props.timesheet.start_time1_plan == null ? "secondary" : "info"}
        className="text-left"
        block >
        <div className="row">
          <div className="col-9">
            <i className={!open ? 'fa fa-plus-circle text-lowercase' : 'fa fa-minus-circle text-lowercase'}>&nbsp;</i>{getDayName(props.timesheet.date) + `${lang === "vi-VN" ? " ngày " : ", "}` + props.timesheet.date.replace(/-/g, '/')}
          </div>
          <div className="col-3">
            <Fade in={props.timesheet.start_time1_plan == null}>
              <div className="text-right" id={"timesheet-detail-" + props.index}>{t("DayOff")}</div>
            </Fade>
          </div>
        </div>
      </Button>

      {open ? <Fade in={open}>
        <div id={"timesheet-detail-" + props.index} className="content">
          <div className="row pr-4 pl-4 pb-4">
              <div className="col-md-6 col-xl-3 time-item">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title text-center">{t("ScheduledTime")}</h6>
                    <WorkingDay index={1} startTime={props.timesheet.start_time1_plan} endTime={props.timesheet.end_time1_plan} />
                    {props.timesheet.start_time2_plan ? <WorkingDay index={2} startTime={props.timesheet.start_time2_plan} endTime={props.timesheet.end_time2_plan} /> : null}
                    {props.timesheet.start_time3_plan ? <WorkingDay index={3} startTime={props.timesheet.start_time3_plan} endTime={props.timesheet.end_time3_plan} /> : null}
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-xl-3 time-item">
                <div className="card">
                  <div className={timeFail ? "card-body text-danger background-red" : "card-body"}>
                    <h6 className="card-title text-center">{t("ActualTime")}</h6>
                    <WorkingDay index={1} startTime={props.timesheet.start_time1_fact} endTime={props.timesheet.end_time1_fact} />
                    {props.timesheet.start_time2_fact ? <WorkingDay index={2} startTime={props.timesheet.start_time2_fact} endTime={props.timesheet.end_time2_fact} /> : null}
                    {props.timesheet.start_time3_fact ? <WorkingDay index={3} startTime={props.timesheet.start_time3_fact} endTime={props.timesheet.end_time3_fact} /> : null}
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-xl-3 time-item">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title text-center">{t("ActualWorkingHours")}</h6>
                    <h5 className="card-text text-center">{props.timesheet.actual_working_hours || 0}</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xl-3 time-item">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title text-center">{t("PaidLeaveHours")}</h6>
                    <h5 className="card-text text-center">{props.timesheet.paid_leave || 0}</h5>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-xl-3 time-item">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title text-center">{t("UnpaidLeave")}</h6>
                    <h5 className="card-text text-center">{props.timesheet.unpaid_leave || 0}</h5>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-xl-3 time-item">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title text-center">{t("BizTripHours")}</h6>
                    <h5 className="card-text text-center">{props.timesheet.attendance_hours || 0}</h5>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-xl-3 time-item">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title text-center">{t("TrainingHours")}</h6>
                    <h5 className="card-text text-center">{props.timesheet.trainning_hours || 0}</h5>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-xl-3 time-item">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title text-center">{t("CovnertOtHoursToToil")}</h6>
                    <h5 className="card-text text-center">{props.timesheet.compensatory_leave_hours || 0}</h5>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </Fade> : null}
    </>
  )
}

function TimesheetDetail(props) {
  const { t } = useTranslation()
  return (
    <div className="detail">
      <div className="card shadow">
        <div className="card-header bg-success text-white text-uppercase">{t("WorkingDaysDetail")}</div>
        <div className="card-body">
          {props.timesheets.map((timesheet, key) => {
            return <Content timesheet={timesheet} index={key} key={key} />
          })}
        </div>
      </div>
    </div>
  )
}

export default TimesheetDetail
