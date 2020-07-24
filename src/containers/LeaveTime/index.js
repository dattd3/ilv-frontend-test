import React from 'react'
import LeaveTimeSummary from './LeaveTimeSummary'
import LeaveTimeSearch from './LeaveTimeSearch'
import LeaveTimeDetail from './LeaveTimeDetail'
import axios from 'axios'
import moment from 'moment'

class LeaveTimePage extends React.Component {

    constructor() {
        super();
        this.state = {
          annualLeaveSummary: [],
          annualLeaves: [],
          compensatoryLeaves: [],
          RosteredDayOffs : [],
          isSearch: false,
          errorMessage: ''
        }
    }
    // componentWillMount() {
    //     const config = {
    //         headers: {
    //           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    //           'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
    //           'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
    //         }
    //     }

    //     const thisYear = new Date().getFullYear()

    //     axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/leaveofabsence?current_year=${thisYear}`, config)
    //     .then(res => {
    //       if (res && res.data && res.data.data) {
    //         const annualLeaveSummary = res.data.data
    //         this.setState({ annualLeaveSummary: annualLeaveSummary})
    //       }
    //     }).catch(error => {
    //         // localStorage.clear();
    //         // window.location.href = map.Login;
    //     })
    // }

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
      return months.sort()
    }

    searchTimesheetByDate (startDate, endDate) {
        this.setState({ isSearch: false, errorMessage: '' })

        const config = {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
              'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
            }
        }

        const start = moment(startDate).format('YYYYMMDD').toString()
        const end = moment(endDate).format('YYYYMMDD').toString()

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/leaveofabsence/detail?from_time=${start}&to_time=${end}`, config)
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
        return <div class="leave-time-page">
            {/* <LeaveTimeSummary data={this.state.annualLeaveSummary}/> */}
            <LeaveTimeSearch clickSearch={this.searchTimesheetByDate.bind(this)} errorMessage={this.state.errorMessage}/>
            {this.state.isSearch ? 
            <><LeaveTimeDetail 
                bg="primary" 
                headerTitle="NGÀY PHÉP NĂM"
                headers={{month: 'Tháng', annualLeaveOfArising: 'Số ngày phép phát sinh', usedAnnualLeave: 'Số ngày phép đã sử dụng', daysOfAnnualLeave: 'Ngày đã sử dụng'}}
                data={this.state.annualLeaves} 
            />
            <LeaveTimeDetail 
                bg="success" 
                headerTitle="NGÀY NGHỈ BÙ" 
                headers={{month: 'Tháng', annualLeaveOfArising: 'Số ngày bù phát sinh', usedAnnualLeave: 'Số ngày bù đã sử dụng', daysOfAnnualLeave: 'Ngày đã sử dụng'}}
                data={this.state.compensatoryLeaves} 
            />
            </> : null}
        </div>
    }

}

export default LeaveTimePage