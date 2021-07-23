import React from 'react'
import { registerLocale } from 'react-datepicker'
import axios from 'axios'
import moment from 'moment'
import DropdownCustomize from "./DropdownCustomize"
import { getRequestConfigurations } from "../../commons/Utils"
import Constants from '../../commons/Constants'
import { withTranslation } from "react-i18next"
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

class LeaveFund extends React.Component {
  constructor() {
    super()
    this.state = {
      filter: {
        subordinates: [],
        employeeCodeToSearch: []
      },
      subordinateLeaveOfAbsences: [],
      subordinateLeaveOfAbsencesOriginal: [],
      isShowLoadingModal: false
    }
    this.currentYear = moment().year()
  }

  componentDidMount() {
    this.initialData()
  }

  initialData = () => {
    const subordinatesEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/subordinate`
    const subordinateLeaveOfAbsencesEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/subordinate/leaveofabsence?current_year=${this.currentYear}`
    const requestSubordinates = axios.get(subordinatesEndpoint, getRequestConfigurations())
    const requestSubordinateLeaveOfAbsences = axios.get(subordinateLeaveOfAbsencesEndpoint, getRequestConfigurations())

    Promise.allSettled([requestSubordinates, requestSubordinateLeaveOfAbsences]).then(responses => {
      this.processListSubordinates(responses[0])
      this.processSubordinateLeaveOfAbsences(responses[1])
      // this.setState({
      //     modal: {
      //         ...this.state.modal,
      //         isShowLoadingModal: false
      //     }
      // })
    })
  }

  processListSubordinates = responses => {
    if (responses && responses.status === "fulfilled" && responses.value && responses.value.data) {
      const result = responses.value.data.result

      if (result && result.code != Constants.API_ERROR_CODE) {
        const data = responses.value.data.data
        const subordinates = (data || []).map(item => {
          return {value: item.uid, label: item.fullname, AD: item.username, jobTitle: this.formatStringByMuleValue(item.job_name)}
        })

        this.setState({
          filter: {
            ...this.state.filter,
            subordinates: subordinates
          },
        })
      }
    }
  }

  processSubordinateLeaveOfAbsences = responses => {
    if (responses && responses.status === "fulfilled" && responses.value && responses.value.data) {
      const result = responses.value.data.result
      if (result && result.code != Constants.API_ERROR_CODE) {
        this.setState({subordinateLeaveOfAbsencesOriginal: responses.value.data.data || []})
      }
    }
  }

  fetchListSubordinates = async () => {
    const responses = await axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/subordinate`, getRequestConfigurations())
    const subordinates = this.prepareSubordinates(responses)

    this.setState({
      filter: {
        ...this.state.filter,
        subordinates: subordinates
      },
    })
  }

  submitFilter = () => {
    const { filter, subordinateLeaveOfAbsencesOriginal } = this.state
    const subordinateLeaveOfAbsences = subordinateLeaveOfAbsencesOriginal.filter(item => filter.employeeCodeToSearch.includes(item.personal_number.toString()))

    this.setState({subordinateLeaveOfAbsences: subordinateLeaveOfAbsences})
  }

  updateParent = optionsSelectedConfirmed => {
    let employeeCodeToSearch = []

    for (const [key, value] of Object.entries(optionsSelectedConfirmed)) {
      if (value?.selected) {
        employeeCodeToSearch = employeeCodeToSearch.concat(key)
      }
    }

    this.setState({
      filter: {
        ...this.state.filter,
        employeeCodeToSearch: employeeCodeToSearch
      },
    })
  }

  formatStringByMuleValue = value => {
    return (value === null || value === undefined || value === "" || value === "#") ? "" : value
  }

  convertToFloatByValue = value => {
    return (value === null || value === undefined || value === "" || value === "#") ? 0 : parseFloat(value)
  }

  formatDateByMuleValue = value => {
    const date = moment(value, 'DD-MM-YYYY')
    return date.isValid() ? date.format("DD/MM/YYYY") : ""
  }

  formatNumberStandardByValue = value => {
    if (value === null || value === undefined || value === "" || value === "#" || value === 0) {
      return "00"
    }

    if (value.toString()?.length === 1) {
      return `0${value}`
    }

    return value.toFixed(2)
  }

  renderListData = () => {
    const { isShowLoadingModal, subordinateLeaveOfAbsences } = this.state
    const lastYear = this.currentYear - 1

    return (
      subordinateLeaveOfAbsences.map((item, index) => {
        let usedAnnualLeaveLastYear = (item.used_annual_leave || []).find(a => a.year == lastYear)
        let unusedAnnualLeaveLastYear = (item.unused_annual_leave || []).find(a => a.year == lastYear)
        let usedCompensatoryLeaveLastYear = (item.used_compensatory_leave || []).find(a => a.year == lastYear)
        let unusedCompensatoryLeaveLastYear = (item.unused_compensatory_leave || []).find(a => a.year == lastYear)

        let usedAnnualLeaveThisYear = (item.used_annual_leave || []).find(a => a.year == this.currentYear)
        let unusedAnnualLeaveThisYear = (item.unused_annual_leave || []).find(a => a.year == this.currentYear)
        let usedCompensatoryLeaveThisYear = (item.used_compensatory_leave || []).find(a => a.year == this.currentYear)
        let unusedCompensatoryLeaveThisYear = (item.unused_compensatory_leave || []).find(a => a.year == this.currentYear)

        /* Ngày phép tồn năm trước */
        let numberUsedAnnualLeaveLastYear = this.convertToFloatByValue(usedAnnualLeaveLastYear?.days)
        let numberUnusedAnnualLeaveLastYear = this.convertToFloatByValue(unusedAnnualLeaveLastYear?.days)
        let expiryDateUnusedAnnualLeaveLastYear = this.formatDateByMuleValue(unusedAnnualLeaveLastYear?.expire_date)
        /* End Ngày phép tồn năm trước */

        /* Ngày phép năm nay */
        let numberUsedAnnualLeaveThisYear = this.convertToFloatByValue(usedAnnualLeaveThisYear?.days)
        let numberUnusedAnnualLeaveThisYear = this.convertToFloatByValue(unusedAnnualLeaveThisYear?.days)
        let expiryDateUnusedAnnualLeaveThisYear = this.formatDateByMuleValue(unusedAnnualLeaveThisYear?.expire_date)
        /* End Ngày phép năm nay */

        /* Giờ bù tồn năm trước */
        let numberUsedCompensatoryLeaveLastYear = this.convertToFloatByValue(usedCompensatoryLeaveLastYear?.days)
        let numberUnusedCompensatoryLeaveLastYear = this.convertToFloatByValue(unusedCompensatoryLeaveLastYear?.days)
        let expiryDateUnusedCompensatoryLeaveLastYear = this.formatDateByMuleValue(unusedCompensatoryLeaveLastYear?.expire_date)
        /* End Giờ bù tồn năm trước */

        /* Giờ bù tồn năm nay */
        let numberUsedCompensatoryLeaveThisYear = this.convertToFloatByValue(usedCompensatoryLeaveThisYear?.days)
        let numberUnusedCompensatoryLeaveThisYear = this.convertToFloatByValue(unusedCompensatoryLeaveThisYear?.days)
        let expiryDateUnusedCompensatoryLeaveThisYear = this.formatDateByMuleValue(unusedCompensatoryLeaveThisYear?.expire_date)
        /* End Giờ bù tồn năm nay */

        return  <tr key={index}>
                  <td className="full-name text-center"><span>{item?.fullname || ""}</span></td>
                  {/* Ngày phép tồn năm trước */}
                  <td className="text-center"><span className="same-width">{this.formatNumberStandardByValue(numberUsedAnnualLeaveLastYear)}</span></td>
                  <td className="text-warning text-center"><span className="same-width">{this.formatNumberStandardByValue(numberUnusedAnnualLeaveLastYear)}</span></td>
                  <td className="text-center"><span className="same-width">{expiryDateUnusedAnnualLeaveLastYear}</span></td>
                  {/* End Ngày phép tồn năm trước */}
                  {/* Ngày phép năm nay */}
                  <td className="text-center"><span className="sum-width">{this.formatNumberStandardByValue(numberUsedAnnualLeaveThisYear)}</span></td>
                  <td className="text-center text-primary"><span className="same-width">{this.formatNumberStandardByValue(numberUnusedAnnualLeaveThisYear)}</span></td>
                  <td className="text-center"><span className="same-width">{expiryDateUnusedAnnualLeaveThisYear}</span></td>
                  {/* End Ngày phép năm nay */}
                  <td className="text-center text-danger"><span className="same-width">{this.formatNumberStandardByValue(numberUnusedAnnualLeaveLastYear + numberUnusedAnnualLeaveThisYear)}</span></td>
                  {/* Giờ bù tồn năm trước */}
                  <td className="text-center"><span className="same-width">{this.formatNumberStandardByValue(numberUsedCompensatoryLeaveLastYear)}</span></td>
                  <td className="text-warning text-center"><span className="same-width">{this.formatNumberStandardByValue(numberUnusedCompensatoryLeaveLastYear)}</span></td>
                  <td className="text-center"><span className="same-width">{expiryDateUnusedCompensatoryLeaveLastYear}</span></td>
                  {/* End Giờ bù tồn năm trước */}
                  {/* Giờ bù tồn năm nay */}
                  <td className="text-center"><span className="same-width">{this.formatNumberStandardByValue(numberUsedCompensatoryLeaveThisYear)}</span></td>
                  <td className="text-primary text-center"><span className="same-width">{this.formatNumberStandardByValue(numberUnusedCompensatoryLeaveThisYear)}</span></td>
                  <td className="text-center"><span className="same-width">{expiryDateUnusedCompensatoryLeaveThisYear}</span></td>
                  {/* End Giờ bù tồn năm nay */}
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">{this.formatNumberStandardByValue(numberUnusedCompensatoryLeaveLastYear + numberUnusedCompensatoryLeaveThisYear)}</span></td>
                </tr>
      })
    )
  }

  renderCount = () => {
    const { t } = this.props
    const { isShowLoadingModal, subordinateLeaveOfAbsences } = this.state
    const lastYear = this.currentYear - 1

    let totalNumberUsedAnnualLeaveLastYear = 0
    let totalNumberUnusedAnnualLeaveLastYear = 0
    let totalNumberUsedAnnualLeaveThisYear = 0
    let totalNumberUnusedAnnualLeaveThisYear = 0
    let totalNumberUsedCompensatoryLeaveLastYear = 0
    let totalNumberUnusedCompensatoryLeaveLastYear = 0
    let totalNumberUsedCompensatoryLeaveThisYear = 0
    let totalNumberUnusedCompensatoryLeaveThisYear = 0
    let totalNumberUnusedAnnualLeave = 0
    let totalNumberUnusedCompensatoryLeave = 0
    
    subordinateLeaveOfAbsences.forEach(item => {
      let usedAnnualLeaveLastYear = (item.used_annual_leave || []).find(a => a.year == lastYear)
      let unusedAnnualLeaveLastYear = (item.unused_annual_leave || []).find(a => a.year == lastYear)
      let usedCompensatoryLeaveLastYear = (item.used_compensatory_leave || []).find(a => a.year == lastYear)
      let unusedCompensatoryLeaveLastYear = (item.unused_compensatory_leave || []).find(a => a.year == lastYear)

      let usedAnnualLeaveThisYear = (item.used_annual_leave || []).find(a => a.year == this.currentYear)
      let unusedAnnualLeaveThisYear = (item.unused_annual_leave || []).find(a => a.year == this.currentYear)
      let usedCompensatoryLeaveThisYear = (item.used_compensatory_leave || []).find(a => a.year == this.currentYear)
      let unusedCompensatoryLeaveThisYear = (item.unused_compensatory_leave || []).find(a => a.year == this.currentYear)

      /* Ngày phép tồn năm trước */
      let numberUsedAnnualLeaveLastYear = this.convertToFloatByValue(usedAnnualLeaveLastYear?.days)
      let numberUnusedAnnualLeaveLastYear = this.convertToFloatByValue(unusedAnnualLeaveLastYear?.days)
      let expiryDateUnusedAnnualLeaveLastYear = this.formatDateByMuleValue(unusedAnnualLeaveLastYear?.expire_date)
      /* End Ngày phép tồn năm trước */

      /* Ngày phép năm nay */
      let numberUsedAnnualLeaveThisYear = this.convertToFloatByValue(usedAnnualLeaveThisYear?.days)
      let numberUnusedAnnualLeaveThisYear = this.convertToFloatByValue(unusedAnnualLeaveThisYear?.days)
      let expiryDateUnusedAnnualLeaveThisYear = this.formatDateByMuleValue(unusedAnnualLeaveThisYear?.expire_date)
      /* End Ngày phép năm nay */

      /* Giờ bù tồn năm trước */
      let numberUsedCompensatoryLeaveLastYear = this.convertToFloatByValue(usedCompensatoryLeaveLastYear?.days)
      let numberUnusedCompensatoryLeaveLastYear = this.convertToFloatByValue(unusedCompensatoryLeaveLastYear?.days)
      let expiryDateUnusedCompensatoryLeaveLastYear = this.formatDateByMuleValue(unusedCompensatoryLeaveLastYear?.expire_date)
      /* End Giờ bù tồn năm trước */

      /* Giờ bù tồn năm nay */
      let numberUsedCompensatoryLeaveThisYear = this.convertToFloatByValue(usedCompensatoryLeaveThisYear?.days)
      let numberUnusedCompensatoryLeaveThisYear = this.convertToFloatByValue(unusedCompensatoryLeaveThisYear?.days)
      let expiryDateUnusedCompensatoryLeaveThisYear = this.formatDateByMuleValue(unusedCompensatoryLeaveThisYear?.expire_date)
      /* End Giờ bù tồn năm nay */
      
      totalNumberUsedAnnualLeaveLastYear += numberUsedAnnualLeaveLastYear
      totalNumberUnusedAnnualLeaveLastYear += numberUnusedAnnualLeaveLastYear
      totalNumberUsedAnnualLeaveThisYear += numberUsedAnnualLeaveThisYear
      totalNumberUnusedAnnualLeaveThisYear += numberUnusedAnnualLeaveThisYear
      totalNumberUsedCompensatoryLeaveLastYear += numberUsedCompensatoryLeaveLastYear
      totalNumberUnusedCompensatoryLeaveLastYear += numberUnusedCompensatoryLeaveLastYear
      totalNumberUsedCompensatoryLeaveThisYear += numberUsedCompensatoryLeaveThisYear
      totalNumberUnusedCompensatoryLeaveThisYear += numberUnusedCompensatoryLeaveThisYear
    })
    totalNumberUnusedAnnualLeave = totalNumberUnusedAnnualLeaveLastYear + totalNumberUnusedAnnualLeaveThisYear
    totalNumberUnusedCompensatoryLeave = totalNumberUnusedCompensatoryLeaveLastYear + totalNumberUnusedCompensatoryLeaveThisYear

    return (
      <tr>
        <th className="full-name text-center text-uppercase font-weight-bold"><span>{t("Total")}</span></th>
        <th className="text-center font-weight-bold"><span className="same-width">{this.formatNumberStandardByValue(totalNumberUsedAnnualLeaveLastYear)}</span></th>
        <th className="text-warning text-center font-weight-bold"><span className="same-width">{this.formatNumberStandardByValue(totalNumberUnusedAnnualLeaveLastYear)}</span></th>
        <th className="text-center font-weight-bold"><span className="same-width"></span></th>
        <th className="font-weight-bold text-center"><span className="sum-width">{this.formatNumberStandardByValue(totalNumberUsedAnnualLeaveThisYear)}</span></th>
        <th className="text-center font-weight-bold text-primary"><span className="same-width">{this.formatNumberStandardByValue(totalNumberUnusedAnnualLeaveThisYear)}</span></th>
        <th className="text-center font-weight-bold"><span className="same-width"></span></th>
        <th className="text-center font-weight-bold text-danger"><span className="same-width">{this.formatNumberStandardByValue(totalNumberUnusedAnnualLeave)}</span></th>
        <th className="text-center font-weight-bold"><span className="same-width">{this.formatNumberStandardByValue(totalNumberUsedCompensatoryLeaveLastYear)}</span></th>
        <th className="text-warning text-center font-weight-bold"><span className="same-width">{this.formatNumberStandardByValue(totalNumberUnusedCompensatoryLeaveLastYear)}</span></th>
        <th className="text-success text-center font-weight-bold"><span className="same-width"></span></th>
        <th className="text-center font-weight-bold"><span className="same-width">{this.formatNumberStandardByValue(totalNumberUsedCompensatoryLeaveThisYear)}</span></th>
        <th className="text-primary text-center font-weight-bold"><span className="same-width">{this.formatNumberStandardByValue(totalNumberUnusedCompensatoryLeaveThisYear)}</span></th>
        <th className="text-success text-center font-weight-bold"><span className="same-width"></span></th>
        <th className="font-weight-bold text-danger text-center"><span className="sum-width">{this.formatNumberStandardByValue(totalNumberUnusedCompensatoryLeave)}</span></th>
      </tr>
    )
  }

  render() {
    const { t } = this.props
    const { filter, subordinateLeaveOfAbsences } = this.state

    return (
      <div className="leave-fund-section">
        <div className="card border shadow container-fluid filter-block">
          <div className="row">
            <div className="col-md-3 column">
              <div className="title">{t("SelectEmployees")}</div>
              <div className="content input-container">
                <DropdownCustomize options={filter.subordinates} placeholderText={t("SelectEmployees")} updateParent={this.updateParent} />
              </div>
            </div>
            <div className="col-md-3 column">
              <div className="title">&nbsp;</div>
              <div className="content input-container">
                <button type="button" className="btn-search" onClick={this.submitFilter}>{t("Search")}</button>
              </div>
            </div>
          </div>
        </div>
        {
          subordinateLeaveOfAbsences.length > 0 
          ? <div className="card border shadow result-block">
              <div className="result-wrap-table">
                <table className="result-table">
                  <thead>
                    <tr>
                      <th className="text-center text-uppercase font-weight-bold" rowSpan="2">{t("FullName")}</th>
                      <th className="text-center text-uppercase font-weight-bold text-warning" colSpan="3">{t("RemainingLeavesFromLastYear")}</th>
                      <th className="text-center text-uppercase font-weight-bold text-primary" colSpan="3">{t("LeavesThisYear")}</th>
                      <th className="text-center text-uppercase font-weight-bold" rowSpan="2">{t("TotalAvaiableLeaves")}</th>
                      <th className="text-center text-uppercase font-weight-bold text-warning" colSpan="3">{t("RemaingToilHoursLastYear")}</th>
                      <th className="text-center text-uppercase font-weight-bold text-primary" colSpan="3">{t("ToilHoursThisYear")}</th>
                      <th className="text-center text-uppercase font-weight-bold" rowSpan="2">{t("TotalAvailableToilHours")}</th>
                    </tr>
                    <tr>
                      <th className="text-center"><span className="same-width">{t("Used")}</span></th>
                      <th className="text-center text-warning"><span className="same-width">{t("Available")}</span></th>
                      <th className="text-center"><span className="same-width">{t("ExpireDate")}</span></th>
                      <th className="text-center"><span className="same-width">{t("Used")}</span></th>
                      <th className="text-center text-primary"><span className="same-width">{t("Available")}</span></th>
                      <th className="text-center"><span className="same-width">{t("ExpireDate")}</span></th>
                      <th className="text-center"><span className="same-width">{t("Used")}</span></th>
                      <th className="text-center text-warning"><span className="same-width">{t("Available")}</span></th>
                      <th className="text-center"><span className="same-width">{t("ExpireDate")}</span></th>
                      <th className="text-center"><span className="same-width">{t("Used")}</span></th>
                      <th className="text-center text-primary"><span className="same-width">{t("Available")}</span></th>
                      <th className="text-center"><span className="same-width">{t("ExpireDate")}</span></th>
                    </tr>
                    { this.renderCount() }
                  </thead>
                  <tbody>
                    { this.renderListData() }
                  </tbody>
                </table>
              </div>
            </div>
          : null
        }
      </div>
    )
  }
}

export default withTranslation()(LeaveFund)
