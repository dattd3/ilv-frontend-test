import React from "react"
import axios from 'axios'
import { withTranslation } from "react-i18next"
import KPISearch from "./KPISearch"
import StaffInfo from "./StaffInfo"
import ShowKPIDetail from "./ShowKPIDetail"
import Constants from "../../commons/Constants"
class General extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      period: "2020",
      years: []
    }
  }

  componentDidMount() {
    this.getAllKPI()
  }

  getAllKPI = async () => {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
        'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
      }
    }
    const responses = await axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/successfactor/v1/kpi/general/all`, config)
    let years = this.collectYears(responses)
    years = [...new Set(years)]
    this.setState({years: years})
  }

  collectYears = responses => {
    if (responses && responses.data) {
      const result = responses.data.result
      if (result && result.code == Constants.API_SUCCESS_CODE) {
        const data = responses.data.data
        if (data && data.length > 0) {
          const years = data.map(item => item.Period && item.Period.length >= 7 && item.Period.substring(3, 7))
          return years
        }
        return []
      }
      return []
    }
    return []
  }

  selectPeriodCompleted = (value) => {
    this.setState({period: value})
  }

  render() {
    const { t } = this.props
    const {period, years} = this.state

    return (
      <div>
        <StaffInfo />
        {
          years.length > 0 ?
            <>
            <KPISearch years={years} selectPeriodCompleted={this.selectPeriodCompleted} />
            <ShowKPIDetail Period={period} />
            </>
          : <div className="alert alert-warning text-center" role="alert">Không có dữ liệu về KPI</div>
        }
      </div>
    )
  }
}

export default General
