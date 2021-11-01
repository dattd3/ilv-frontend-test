import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilterDataShirfReport from "../../ShareComponents/FilterDataShirfReport";

class ChangeShiftReport extends Component {
  constructor() {
    super();
    this.state = {
      timsheetSummary: {},
      annualLeaveSummary: [],
      annualLeaves: [],
      compensatoryLeaves: [],
      timeTableData: null,
      isSearch: false,
      isTableSearch: true,
      error: {}
    };
  }

  getMonths(data) {
    let months = []
    data.used_annual_leave_detail.forEach(used_annual_leave => {
      if (months.indexOf(used_annual_leave.month) === -1) {
        months.push(used_annual_leave.month)
      }
    })

    data.used_compensatory_leave_detail.forEach(used_compensatory_leave_detail => {
      if (months.indexOf(used_compensatory_leave_detail.month) === -1) {
        months.push(used_compensatory_leave_detail.month)
      }
    })

    data.arising_annual_leave_detail.forEach(arising_annual_leave_detail => {
      if (months.indexOf(arising_annual_leave_detail.month) === -1) {
        months.push(arising_annual_leave_detail.month)
      }
    })

    data.arising_compensatory_leave_detail.forEach(arising_compensatory_leave_detail => {
      if (months.indexOf(arising_compensatory_leave_detail.month) === -1) {
        months.push(arising_compensatory_leave_detail.month)
      }
    })
    return months.sort((a, b) => parseInt(a.split("-").reverse().join("")) - parseInt(b.split("-").reverse().join("")))
  }

  render() {
    const { t } = this.props;
    return (
      <div className="timesheet-section change-shift-report">
        <h1 className="content-page-header">{t("MenuChangeShiftReport")}</h1>
        <ToastContainer />
        <FilterDataShirfReport />
      </div>
    );
  }
}

export default withTranslation()(ChangeShiftReport);
