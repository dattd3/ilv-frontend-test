import React from "react"
import _ from 'lodash'
import { withTranslation } from "react-i18next"

class TimesheetSummary extends React.Component {
  render() {
    const { t, timsheetSummary } = this.props

    return <div className="summary">
      <div className="card shadow">
        <div className="card-header text-uppercase">{t("TimesheetSummary")}</div>
        <div className="card-body">
          <div className="row title">
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
          {
            timsheetSummary && (
              <div className="row title" style={{ marginTop: 5 }}>
                <div className="col">
                  <div className="content text-center text-danger">{ _.ceil(timsheetSummary?.working_day_plan, 2) || 0 }</div>
                </div>
                <div className="col">
                  <div className="content text-center text-danger">{ _.ceil(timsheetSummary?.actual_working, 2) || 0 }</div>
                </div>
                <div className="col">
                  <div className="content text-center text-danger">{ _.ceil(timsheetSummary?.paid_leave, 2) || 0 }</div>
                </div>
                <div className="col">
                  <div className="content text-center text-danger">{ _.ceil(parseFloat(timsheetSummary?.attendance || 0) + parseFloat(timsheetSummary?.trainning || 0), 2) }</div>
                </div>
                <div className="col">
                  <div className="content text-center text-danger">{ _.ceil(timsheetSummary?.working_deal, 2) || 0 }</div>
                </div>
                <div className="col">
                  <div className="content text-center text-danger">{ _.ceil(timsheetSummary?.unpaid_leave, 2) || 0 }</div>
                </div>
                <div className="col">
                  <div className="content text-center text-danger">{ _.ceil(timsheetSummary?.total_overtime, 2) || 0 }</div>
                </div>
                <div className="col">
                  <div className="content text-center text-danger">{ _.ceil(timsheetSummary?.salary_wh, 2) || 0 }</div>
                </div>
              </div>
            )
          }
          <div className="row">
            <div className="col">
              <div className="content text-danger notice">{t('TimesheetNotice')}</div>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  }
}

export default withTranslation()(TimesheetSummary)
