import React from "react"
import _ from 'lodash'
import { withTranslation } from "react-i18next"

class TimesheetSummary extends React.Component {
  render() {
    const { t } = this.props
    return <div className="summary">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">{t("TimesheetSummary")}</div>
        <div className="card-body">
          <div className="row">
            <div className="col">
              <div className="title text-center">{t("StandardWorkingDays")}</div>
            </div>
            <div className="col">
              <div className="title text-center">{t("ActualWorkingDays")}</div>
            </div>
            <div className="col">
              <div className="title text-center">{t("PaidLeave")}</div>
            </div>
            <div className="col">
              <div className="title text-center text-sm">{t("TrainingAndBizTrip")}</div>
            </div>
            <div className="col">
              <div className="title text-center">{t("SuspensionDay")}</div>
            </div>
            <div className="col">
              <div className="title text-center">{t("UnpaidLeaveWork")}</div>
            </div>
            <div className="col">
              <div className="title text-center">{t("TotalOtHours")}</div>
            </div>
            <div className="col">
              <div className="title text-center">{t("TotalPaidDays")}</div>
            </div>
          </div>

          {this.props.timsheetSummary ?
          <div className="row">
            <div className="col">
              <div className="content text-center text-danger">{ _.ceil(this.props.timsheetSummary.working_day_plan, 2) || 0 }</div>
            </div>
            <div className="col">
              <div className="content text-center text-danger">{ _.ceil(this.props.timsheetSummary.actual_working, 2) || 0 }</div>
            </div>
            <div className="col">
              <div className="content text-center text-danger">{ _.ceil(this.props.timsheetSummary.paid_leave, 2) || 0 }</div>
            </div>
            <div className="col">
              <div className="content text-center text-danger">{ _.ceil(parseFloat(this.props.timsheetSummary.attendance || 0) + parseFloat(this.props.timsheetSummary.trainning || 0), 2) }</div>
            </div>
            <div className="col">
              <div className="content text-center text-danger">{ _.ceil(this.props.timsheetSummary.working_deal, 2) || 0 }</div>
            </div>
            <div className="col">
              <div className="content text-center text-danger">{ _.ceil(this.props.timsheetSummary.unpaid_leave, 2) || 0 }</div>
            </div>
            <div className="col">
              <div className="content text-center text-danger">{ _.ceil(this.props.timsheetSummary.total_overtime, 2) || 0 }</div>
            </div>
            <div className="col">
              <div className="content text-center text-danger">{ _.ceil(this.props.timsheetSummary.salary_wh, 2) || 0 }</div>
            </div>
          </div> : null}
        </div>
      </div>
    </div>
  }
}

export default withTranslation()(TimesheetSummary)
