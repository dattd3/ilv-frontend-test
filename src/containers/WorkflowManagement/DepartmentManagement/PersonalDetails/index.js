import React, { Component } from "react";
import FilterData from "../../ShareComponents/FilterData";
import LeaveTimeCard from "../../ShareComponents/LeaveTimeData";
import TimeTableDetail from '../../../Timesheet/TimeTableDetail'
import axios from "axios";
import moment from "moment";
import { withTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class PersonalDetails extends Component {
  constructor() {
    super();
    this.state = {
      timsheetSummary: {},
      annualLeaveSummary: [],
      annualLeaves: [],
      compensatoryLeaves: [],
      timeTableData: null,
      isSearch: false,
      isTableSearch: true
    };
  }

  search(startDate, endDate, members) {
    const { t } = this.props
    if(!members || members.length == 0) {
      toast.error(t('staff_selection_warning'));
      return;
    }

    this.setState({ isSearch: false, isTableSearch: false });
    let start = moment(startDate).format("YYYYMMDD").toString();
    let end = moment(endDate).format("YYYYMMDD").toString();
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
       'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
       'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
    };

    const timOverviewEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/subordinate/timeoverview`;
    const leaveAbsenceDetailEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/subordinate/leaveofabsence/detail`;
    const ReasonEndpoint = `${process.env.REACT_APP_REQUEST_URL}request/GetLeaveTypeAndComment_subordinate `;
    const requestTimeoverview = axios.post(timOverviewEndpoint, {
      personal_no_list: members,
      from_date: start,
      to_date: end
    }, {
      headers
    })
    const requestleaveAbsenceDetail = axios.post(leaveAbsenceDetailEndpoint, {
      personal_no_list: members,
      from_time: start,
      to_time: end
    }, {
      headers
    })

    const requestReason = axios.post(ReasonEndpoint, {
      personal_no_list: members,
      from_date: start,
      to_date: end
    }, {
      headers
    })


    Promise.allSettled([requestTimeoverview, requestleaveAbsenceDetail, requestReason]).then((responses) => {
        const localState = {...this.state};
        //process time overview
        if (responses[0].status="fulfilled") {
          const res = responses[0].value;
          if (res && res.data && res.data.data) {
            let dataSorted = res.data.data.sort((a, b) =>
              moment(a.date, "DD-MM-YYYY").format("YYYYMMDD") <
              moment(b.date, "DD-MM-YYYY").format("YYYYMMDD")
                ? 1
                : -1
            );
            if (dataSorted && dataSorted.length > 0) {
              const startReal = moment(
                dataSorted[dataSorted.length - 1].date,
                "DD-MM-YYYY"
              ).format("YYYYMMDD");
              start = startReal > start ? startReal : start;
              const endReal = moment(dataSorted[0].date, "DD-MM-YYYY").format(
                "YYYYMMDD"
              );
              end = endReal < end ? endReal : end;
            }
            localState.isTableSearch = true;
            localState.timeTableData = {
              dataSorted,
              start,
              end,
              members,
              reason: responses[2].status == 'fulfilled' ?  responses[2].value.data.data : []
            }
          }
        }

        //process Leave absence
        if(responses[1].status == 'fulfilled') {
          const res = responses[1].value;
          if (res && res.data && res.data.data && res.data.data.length > 0) {
            const months = this.getMonths(res.data.data[0])
            const annualLeaves = months.map((month) => {
                  return {
                    month: month.replace(/-/, '/'),
                    usedLeave: res.data.data[0].used_annual_leave_detail.filter((usedAnnualLeave) =>  usedAnnualLeave.month == month ),
                    arisingLeave: res.data.data[0].arising_annual_leave_detail.filter((arisingAnnualLeave) => arisingAnnualLeave.month == month ),
                  }
              })

              const compensatoryLeaves = months.map((month) => {
                return {
                  month: month.replace(/-/, '/'),
                  usedLeave: res.data.data[0].used_compensatory_leave_detail.filter((usedCompensatoryLeave) => usedCompensatoryLeave.month == month ),
                  arisingLeave: res.data.data[0].arising_compensatory_leave_detail.filter((arisingCompensatoryLeave) => arisingCompensatoryLeave.month == month ),
                }
            })
            localState.annualLeaves = annualLeaves;
            localState.compensatoryLeaves = compensatoryLeaves;
          }
        }

        this.setState(localState);
      }
    );
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
      <div className="timesheet-section">
        <ToastContainer />
        <FilterData clickSearch={this.search.bind(this)} type="singleChoice"/>
        <div className="detail">
        <TimeTableDetail timesheetData ={this.state.timeTableData} isSearch={this.state.isTableSearch} showCavet = {true} isOpen = {false} /> 
          <LeaveTimeCard
            bg="primary"
            headerTitle={t("LeavesYear")}
            headers={{
              month: t("Month"),
              annualLeaveOfArising: t("NewUsableLeaves"),
              usedAnnualLeave: t("UsedLeaves"),
              daysOfAnnualLeave: t("DateOfLeaves"),
            }}
            data={this.state.annualLeaves}
          />
          <LeaveTimeCard
            bg="info"
            headerTitle={t("ToilDay")}
            headers={{
              month: t("Month"),
              annualLeaveOfArising: t("NewUsableToil"),
              usedAnnualLeave: t("UsedToil"),
              daysOfAnnualLeave: t("DateOfLeaves"),
            }}
            data={this.state.compensatoryLeaves}
          />
        </div>
      </div>
    );
  }
}

export default withTranslation()(PersonalDetails);
