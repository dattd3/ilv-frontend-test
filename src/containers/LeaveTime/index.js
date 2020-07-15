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
            //   'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Authorization': `Bearer eyJraWQiOiJCYVwvdjYzZWlab1BhZ0Q5bXRJbjQzcm9WRDNQd0l4Uk5CZDJFUkR1TUxncz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiU21jQTVITkVCTEVrZnoxMVYyLUR0ZyIsInN1YiI6ImI1ZDdhOGYzLTdmMDAtNDc2NS1iYWI5LWQwNDNkODJjMDcyYyIsImNvZ25pdG86Z3JvdXBzIjpbImFwLXNvdXRoZWFzdC0xX01tMjVodEJBQl9WaW5ncm91cEF6dXJlQUQiXSwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfTW0yNWh0QkFCIiwiY29nbml0bzp1c2VybmFtZSI6IlZpbmdyb3VwQXp1cmVBRF9idktlYnJwZTNNTkNoOVZTem5qTk9aQjNSNjF6T1ZwZnZFYlFxYnlJSlY4Iiwibm9uY2UiOiJsRWZUSVBhaDRBc2cwM0VkN1UwaVNiQW8tQTlZNEJSMGhIM0lpRTFtV2JOV2VZaHVRdWtHRFpIYzkwVk1VaVJYaWRDWTZLci1NaFlJbjZFVlk4TmFVWHhiQklyVmFyblFCd25vb0J2T1JqTE5jazVVY2I1SDNvV0Y3V0hVeVpFSi1kdjIxLWIxOEVsRDl5dEVpcmJ0dF9ja2NOc1Y0c0lMajRPVzR5Sjd1ODAiLCJhdWQiOiIzNWlvYWVoODl1YmRudmt0czBhcDdrMzBpcSIsImlkZW50aXRpZXMiOlt7InVzZXJJZCI6ImJ2S2VicnBlM01OQ2g5VlN6bmpOT1pCM1I2MXpPVnBmdkViUXFieUlKVjgiLCJwcm92aWRlck5hbWUiOiJWaW5ncm91cEF6dXJlQUQiLCJwcm92aWRlclR5cGUiOiJPSURDIiwiaXNzdWVyIjpudWxsLCJwcmltYXJ5IjoidHJ1ZSIsImRhdGVDcmVhdGVkIjoiMTU2OTMxODU1MTM2NCJ9XSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1OTQ3OTkwNzgsIm5hbWUiOiJOZ3V54buFbiDEkOG7qWMgQ2hp4bq_biAoVlAtS0NOVFQtSE8pIiwiZXhwIjoxNTk0ODAyNjc4LCJpYXQiOjE1OTQ3OTkwNzgsImZhbWlseV9uYW1lIjoiY2hpZW5uZDRAdmluZ3JvdXAubmV0IiwiZW1haWwiOiJ2LmNoaWVubmQ0QHZpbnBlYXJsLmNvbSJ9.a0jYJc5hjEcFQsPQp8bLFgTrtqDzkQTfBMsbyaoi7uxVocJO3Jlet_vovrcGh_jt0JHf7f_lU1h2Yp8dl6xN768b5XudgcDviWlVF1vF2kjYKnwTR6106-7IxA5mhileUHvjmzZ1Dg2bF3qAEQTrIQW2pIhmclq_w_3rAihP4qnvdQV-QnMuDKIbJUtIHUg7Xij8MVYOJBYJcLj6tCLGI0OVfrxYXLbiBp6Huv7AGtpLmDvD28X7zeeged59WtMgadP6ZcglKo-RkLcxS7GEdiIa9B5lezx_fZOFAJeMRVlwGOkw0EdRGu5L0De6y__h4O4HSwijvEYEbW2tMTme-Q`,
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
              'Authorization': `Bearer eyJraWQiOiJCYVwvdjYzZWlab1BhZ0Q5bXRJbjQzcm9WRDNQd0l4Uk5CZDJFUkR1TUxncz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiU21jQTVITkVCTEVrZnoxMVYyLUR0ZyIsInN1YiI6ImI1ZDdhOGYzLTdmMDAtNDc2NS1iYWI5LWQwNDNkODJjMDcyYyIsImNvZ25pdG86Z3JvdXBzIjpbImFwLXNvdXRoZWFzdC0xX01tMjVodEJBQl9WaW5ncm91cEF6dXJlQUQiXSwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfTW0yNWh0QkFCIiwiY29nbml0bzp1c2VybmFtZSI6IlZpbmdyb3VwQXp1cmVBRF9idktlYnJwZTNNTkNoOVZTem5qTk9aQjNSNjF6T1ZwZnZFYlFxYnlJSlY4Iiwibm9uY2UiOiJsRWZUSVBhaDRBc2cwM0VkN1UwaVNiQW8tQTlZNEJSMGhIM0lpRTFtV2JOV2VZaHVRdWtHRFpIYzkwVk1VaVJYaWRDWTZLci1NaFlJbjZFVlk4TmFVWHhiQklyVmFyblFCd25vb0J2T1JqTE5jazVVY2I1SDNvV0Y3V0hVeVpFSi1kdjIxLWIxOEVsRDl5dEVpcmJ0dF9ja2NOc1Y0c0lMajRPVzR5Sjd1ODAiLCJhdWQiOiIzNWlvYWVoODl1YmRudmt0czBhcDdrMzBpcSIsImlkZW50aXRpZXMiOlt7InVzZXJJZCI6ImJ2S2VicnBlM01OQ2g5VlN6bmpOT1pCM1I2MXpPVnBmdkViUXFieUlKVjgiLCJwcm92aWRlck5hbWUiOiJWaW5ncm91cEF6dXJlQUQiLCJwcm92aWRlclR5cGUiOiJPSURDIiwiaXNzdWVyIjpudWxsLCJwcmltYXJ5IjoidHJ1ZSIsImRhdGVDcmVhdGVkIjoiMTU2OTMxODU1MTM2NCJ9XSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1OTQ3OTkwNzgsIm5hbWUiOiJOZ3V54buFbiDEkOG7qWMgQ2hp4bq_biAoVlAtS0NOVFQtSE8pIiwiZXhwIjoxNTk0ODAyNjc4LCJpYXQiOjE1OTQ3OTkwNzgsImZhbWlseV9uYW1lIjoiY2hpZW5uZDRAdmluZ3JvdXAubmV0IiwiZW1haWwiOiJ2LmNoaWVubmQ0QHZpbnBlYXJsLmNvbSJ9.a0jYJc5hjEcFQsPQp8bLFgTrtqDzkQTfBMsbyaoi7uxVocJO3Jlet_vovrcGh_jt0JHf7f_lU1h2Yp8dl6xN768b5XudgcDviWlVF1vF2kjYKnwTR6106-7IxA5mhileUHvjmzZ1Dg2bF3qAEQTrIQW2pIhmclq_w_3rAihP4qnvdQV-QnMuDKIbJUtIHUg7Xij8MVYOJBYJcLj6tCLGI0OVfrxYXLbiBp6Huv7AGtpLmDvD28X7zeeged59WtMgadP6ZcglKo-RkLcxS7GEdiIa9B5lezx_fZOFAJeMRVlwGOkw0EdRGu5L0De6y__h4O4HSwijvEYEbW2tMTme-Q`,
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