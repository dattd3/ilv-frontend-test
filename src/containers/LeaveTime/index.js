import React from 'react'
import LeaveTimeSummary from './LeaveTimeSummary'
import LeaveTimeSearch from './LeaveTimeSearch'
import LeaveTimeDetail from './LeaveTimeDetail'
import axios from 'axios'
import moment from 'moment'
import { withTranslation } from "react-i18next"
import HOCComponent from '../../components/Common/HOCComponent'
import { getMuleSoftHeaderConfigurations, getRequestConfigurations } from "../../commons/Utils"

class LeaveTimePage extends React.Component {
    constructor() {
        super();
        this.state = {
          annualLeaveSummary: [],
          annualLeaves: [],
          compensatoryLeaves: [],
          RosteredDayOffs : [],
          isSearch: false,
          errorMessage: '',
          pendingTimeInfo: {},
        }
    }

    componentDidMount() {
      const muleSoftConfig = getMuleSoftHeaderConfigurations()
      const thisYear = new Date().getFullYear()

      axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/leaveofabsence?current_year=${thisYear}`, muleSoftConfig)
      .then(res => {
        if (res && res.data && res.data.data) {
          const annualLeaveSummary = res.data.data
          this.setState({ annualLeaveSummary: annualLeaveSummary})
        }
      }).catch(error => {
          // localStorage.clear();
          // window.location.href = map.Login;
      })

      const config = getRequestConfigurations()
      axios.get(`${process.env.REACT_APP_REQUEST_URL}request/pendings`, config)
      .then(res => {
        if (res && res?.data && res?.data?.data) {
          this.setState({ pendingTimeInfo: res?.data?.data })
        }
      }).catch(error => {
      })
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

    searchTimesheetByDate (startDate, endDate) {
        this.setState({ isSearch: false, errorMessage: '' })

        const config = getMuleSoftHeaderConfigurations()
        const start = moment(startDate).format('YYYYMMDD').toString()
        const end = moment(endDate).format('YYYYMMDD').toString()

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/leaveofabsence/detail?from_time=${start}&to_time=${end}`, config)
        .then(res => {
          if (res && res.data && res.data.data) {
            const months = this.getMonths(res.data.data)
            const annualLeaves = months.map((month) => {
                  return {
                    month: month.replace(/-/, '/'),
                    usedLeave: res.data.data.used_annual_leave_detail.filter((usedAnnualLeave) =>  usedAnnualLeave.month == month ),
                    arisingLeave: res.data.data.arising_annual_leave_detail.filter((arisingAnnualLeave) => arisingAnnualLeave.month == month ),
                  }
              })

              const compensatoryLeaves = months.map((month) => {
                return {
                  month: month.replace(/-/, '/'),
                  usedLeave: res.data.data.used_compensatory_leave_detail.filter((usedCompensatoryLeave) => usedCompensatoryLeave.month == month ),
                  arisingLeave: res.data.data.arising_compensatory_leave_detail.filter((arisingCompensatoryLeave) => arisingCompensatoryLeave.month == month ),
                }
            })
            this.setState({ annualLeaves: annualLeaves, compensatoryLeaves: compensatoryLeaves})
          }
        }).catch(error => {
            // localStorage.clear();
            // window.location.href = map.Login;
        })
        this.setState({ isSearch: true })
    }

    render() {
      const { t } = this.props
      const { annualLeaveSummary, isSearch, errorMessage, annualLeaves, compensatoryLeaves, pendingTimeInfo } = this.state

      return <div className="leave-time-page">
          <LeaveTimeSummary data={annualLeaveSummary} pendingTimeInfo={pendingTimeInfo} />
          <LeaveTimeSearch clickSearch={this.searchTimesheetByDate.bind(this)} errorMessage={errorMessage}/>
          {
            isSearch && (
            <>
              <LeaveTimeDetail 
                bg="primary" 
                headerTitle={t("LeavesYear")}
                headers={{month: t("Month"), annualLeaveOfArising: t("NewUsableLeaves"), usedAnnualLeave: t("UsedLeaves"), daysOfAnnualLeave: t("DateOfLeaves")}}
                data={annualLeaves} 
              />
              <LeaveTimeDetail 
                  bg="success" 
                  headerTitle={t("ToilDay")}
                  headers={{month: t("Month"), annualLeaveOfArising: t("NewUsableToil"), usedAnnualLeave: t("UsedToil"), daysOfAnnualLeave: t("DateOfLeaves")}}
                  data={compensatoryLeaves} 
              />
            </>
          )
        }
      </div>
    }
}

export default HOCComponent(withTranslation()(LeaveTimePage))
