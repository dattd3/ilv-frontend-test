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
          RosteredDayOffs : [],
          isSearch: false
        }
    }

    componentWillMount() {
        const config = {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
              'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
            }
        }

        const thisYear = new Date().getFullYear()

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/leaveofabsence?current_year=${thisYear}`, config)
        .then(res => {
          if (res && res.data && res.data.data) {
            console.log(res.data.data)
            const annualLeaveSummary = res.data.data
            this.setState({ annualLeaveSummary: annualLeaveSummary})
          }
        }).catch(error => {
            // localStorage.clear();
            // window.location.href = map.Login;
        })
    }

    searchTimesheetByDate (startDate, endDate) {
        this.setState({ isSearch: false })

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
            console.log(res.data.data)
            // const annualLeaveSummary = res.data.data
            // this.setState({ annualLeaveSummary: annualLeaveSummary})
          }
        }).catch(error => {
            // localStorage.clear();
            // window.location.href = map.Login;
        })

        this.setState({
            annualLeaves: [
                {month: 'T1', annualLeaveOfArising: 1, expiryDate: '31/05/2020', usedAnnualLeave: 3, daysOfAnnualLeave: ['12/01/2020', '15/01/2020', '20/01/2020'] },
                {month: 'T2', annualLeaveOfArising: 1, expiryDate: '31/05/2020', usedAnnualLeave: 0, daysOfAnnualLeave: ['12/02/2020'] }
            ]
        })

        this.setState({
            RosteredDayOffs: [
                {month: 'T1', annualLeaveOfArising: 1, expiryDate: '31/05/2020', usedAnnualLeave: 3, daysOfAnnualLeave: ['12/01/2020', '15/01/2020', '20/01/2020'] },
                {month: 'T2', annualLeaveOfArising: 1, expiryDate: '31/05/2020', usedAnnualLeave: 0, daysOfAnnualLeave: ['12/02/2020'] }
            ]
        })
        this.setState({ isSearch: true })
    }

    render() {
        return <div class="leave-time-page">
            <LeaveTimeSummary data={this.state.annualLeaveSummary}/>
            <LeaveTimeSearch clickSearch={this.searchTimesheetByDate.bind(this)}/>
            {this.state.isSearch ? 
            <><LeaveTimeDetail 
                bg="primary" 
                headerTitle="NGÀY PHÉP NĂM"
                headers={{month: 'Tháng', annualLeaveOfArising: 'Số ngày phép phát sinh', expiryDate: 'Hạn sử dụng', usedAnnualLeave: 'Số ngày phép đã sử dụng', daysOfAnnualLeave: 'Ngày đã sử dụng'}}
                data={this.state.annualLeaves} 
            />
            <LeaveTimeDetail 
                bg="success" 
                headerTitle="NGÀY NGHỈ BÙ" 
                headers={{month: 'Tháng', annualLeaveOfArising: 'Số ngày bù phát sinh', expiryDate: 'Hạn sử dụng', usedAnnualLeave: 'Số ngày bù đã sử dụng', daysOfAnnualLeave: 'Ngày đã sử dụng'}}
                data={this.state.RosteredDayOffs} 
            /></> : null}
        </div>
    }

}

export default LeaveTimePage