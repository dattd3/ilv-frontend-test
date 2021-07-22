import React from 'react'
import Select , { components } from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import { Image } from 'react-bootstrap'
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
      subordinateLeaveOfAbsences: []
    }
  }

  componentDidMount() {
    this.initialData()
  }

  initialData = () => {
    const currentYear = moment().year()
    const subordinatesEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/subordinate`
    const subordinateLeaveOfAbsencesEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/subordinate/leaveofabsence?current_year=${currentYear}`

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
          return {value: item.uid, label: item.fullname, AD: item.username, jobTitle: item.job_name || ""}
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
      const subordinateLeaveOfAbsences = responses.value.data

      // const result = responses.value.data.result
      // if (result && result.code != Constants.API_ERROR_CODE) {
      //   const data = responses.value.data.data
      //   // const subordinates = (data || []).map(item => {
      //   //   return {value: item.uid, label: item.fullname, AD: item.username, jobTitle: item.job_name || ""}
      //   // })
      //   this.setState({subordinateLeaveOfAbsences: []})
      // }

      console.log(subordinateLeaveOfAbsences)

      this.setState({subordinateLeaveOfAbsences: subordinateLeaveOfAbsences})
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
    const { filter, subordinateLeaveOfAbsences } = this.state

    console.log("++++++++++++++++++++")
    console.log(subordinateLeaveOfAbsences)
    console.log(filter.employeeCodeToSearch)

    // TODO
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

  render() {
    const { t } = this.props
    const { filter, subordinateLeaveOfAbsences } = this.state

    return (
      <div className="leave-fund-section">
        <div className="card border shadow container-fluid filter-block">
          <div className="row">
            {/* <div className="col-md-3 column">
              <div className="title">Từ ngày</div>
              <div className="content input-container">
                <label>
                  <DatePicker
                    placeholderText="DD/MM/YYYY"
                    selected={filter.fromDate ? moment(filter.fromDate, 'YYYY-MM-DD').toDate() : null}
                    onChange={fromDate => this.handleDatePickerChange(fromDate)}
                    dateFormat="dd/MM/yyyy"
                    showMonthDropdown={true}
                    showYearDropdown={true}
                    locale="vi"
                    autoComplete="off"
                    className="form-control form-control-lg input"/>
                    <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                </label>
              </div>
            </div>
            <div className="col-md-3 column">
              <div className="title">Đến ngày</div>
              <div className="content input-container">
                <label>
                  <DatePicker
                    placeholderText="DD/MM/YYYY"
                    selected={filter.fromDate ? moment(filter.fromDate, 'YYYY-MM-DD').toDate() : null}
                    onChange={fromDate => this.handleDatePickerChange(fromDate)}
                    dateFormat="dd/MM/yyyy"
                    showMonthDropdown={true}
                    showYearDropdown={true}
                    locale="vi"
                    autoComplete="off"
                    className="form-control form-control-lg input"/>
                    <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                </label>
              </div>
            </div> */}
            <div className="col-md-3 column">
              <div className="title">Lựa chọn nhân viên</div>
              <div className="content input-container">
                <DropdownCustomize options={filter.subordinates} placeholderText="Lựa chọn nhân viên" updateParent={this.updateParent} />
              </div>
            </div>
            <div className="col-md-3 column">
              <div className="title">&nbsp;</div>
              <div className="content input-container">
                <button type="button" className="btn-search" onClick={this.submitFilter}>Tim kiếm</button>
              </div>
            </div>
          </div>
        </div>

        <div className="card border shadow result-block">
          <div className="result-wrap-table">
          <table className="result-table">
              <thead>
                <tr>
                  <th className="text-center text-uppercase font-weight-bold" rowSpan="2">Họ tên</th>
                  <th className="text-center text-uppercase font-weight-bold text-warning">Trước</th>
                  <th className="text-center text-uppercase font-weight-bold text-primary" colSpan="3">Ngày phép năm nay</th>
                  <th className="text-center text-uppercase font-weight-bold" rowSpan="2">Tổng số ngày phép còn được sử dụng</th>
                  <th className="text-center text-uppercase font-weight-bold text-warning" colSpan="3">Giờ bù tồn năm trước</th>
                  <th className="text-center text-uppercase font-weight-bold text-warning" colSpan="3">Ngày phép tồn năm trước</th>
                  <th className="text-center text-uppercase font-weight-bold text-primary" colSpan="3">Giờ bù tồn năm nay</th>
                  <th className="text-center text-uppercase font-weight-bold" rowSpan="2">Tổng số giờ bù còn được sử dụng</th>
                </tr>
                <tr>
                  <th className="text-center"><span className="same-width">Hạn sử dụng</span></th>
                  <th className="text-center"><span className="same-width">Đã sử dụng</span></th>
                  <th className="text-center text-primary"><span className="same-width">Còn được sử dụng</span></th>
                  <th className="text-center"><span className="same-width">Hạn sử dụng</span></th>
                  <th className="text-center"><span className="same-width">Đã sử dụng</span></th>
                  <th className="text-center text-warning"><span className="same-width">Còn được sử dụng</span></th>
                  <th className="text-center"><span className="same-width">Hạn sử dụng</span></th>
                  <th className="text-center"><span className="same-width">Đã sử dụng</span></th>
                  <th className="text-center text-warning"><span className="same-width">Còn được sử dụng</span></th>
                  <th className="text-center"><span className="same-width">Hạn sử dụng</span></th>
                  <th className="text-center"><span className="same-width">Đã sử dụng</span></th>
                  <th className="text-center text-primary"><span className="same-width">Còn được sử dụng</span></th>
                  <th className="text-center"><span className="same-width">Hạn sử dụng</span></th>
                </tr>
                <tr>
                  <th className="full-name text-center text-uppercase font-weight-bold"><span>TỔNG</span></th>
                  <th className="text-center font-weight-bold"><span className="same-width"></span></th>
                  <th className="text-center font-weight-bold"><span className="same-width">1</span></th>
                  <th className="text-primary text-center font-weight-bold"><span className="same-width">3</span></th>
                  <th className="text-center font-weight-bold"><span className="same-width"></span></th>
                  <th className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></th>
                  <th className="text-center font-weight-bold"><span className="same-width">5</span></th>
                  <th className="text-warning text-center font-weight-bold"><span className="same-width">6</span></th>
                  <th className="text-center font-weight-bold"><span className="same-width"></span></th>
                  <th className="text-center font-weight-bold"><span className="same-width">9</span></th>
                  <th className="text-warning text-center font-weight-bold"><span className="same-width">2</span></th>
                  <th className="text-success text-center font-weight-bold"><span className="same-width"></span></th>
                  <th className="text-center font-weight-bold"><span className="same-width">4</span></th>
                  <th className="text-primary text-center font-weight-bold"><span className="same-width">1</span></th>
                  <th className="text-success text-center font-weight-bold"><span className="same-width"></span></th>
                  <th className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="full-name text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-center"><span className="same-width">1</span></td>
                  <td className="text-primary text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-center"><span className="same-width">5</span></td>
                  <td className="text-warning text-center"><span className="same-width">6</span></td>
                  <td className="text-center"><span className="same-width">7</span></td>
                  <td className="text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-center"><span className="same-width">1</span></td>
                  <td className="text-primary text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-center"><span className="same-width">5</span></td>
                  <td className="text-warning text-center"><span className="same-width">6</span></td>
                  <td className="text-center"><span className="same-width">7</span></td>
                  <td className="text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-center"><span className="same-width">1</span></td>
                  <td className="text-primary text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-center"><span className="same-width">5</span></td>
                  <td className="text-warning text-center"><span className="same-width">6</span></td>
                  <td className="text-center"><span className="same-width">7</span></td>
                  <td className="text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-center"><span className="same-width">1</span></td>
                  <td className="text-primary text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-center"><span className="same-width">5</span></td>
                  <td className="text-warning text-center"><span className="same-width">6</span></td>
                  <td className="text-center"><span className="same-width">7</span></td>
                  <td className="text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-center"><span className="same-width">1</span></td>
                  <td className="text-primary text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-center"><span className="same-width">5</span></td>
                  <td className="text-warning text-center"><span className="same-width">6</span></td>
                  <td className="text-center"><span className="same-width">7</span></td>
                  <td className="text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-center"><span className="same-width">1</span></td>
                  <td className="text-primary text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-center"><span className="same-width">5</span></td>
                  <td className="text-warning text-center"><span className="same-width">6</span></td>
                  <td className="text-center"><span className="same-width">7</span></td>
                  <td className="text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-center"><span className="same-width">1</span></td>
                  <td className="text-primary text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-center"><span className="same-width">5</span></td>
                  <td className="text-warning text-center"><span className="same-width">6</span></td>
                  <td className="text-center"><span className="same-width">7</span></td>
                  <td className="text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-center"><span className="same-width">1</span></td>
                  <td className="text-primary text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-center"><span className="same-width">5</span></td>
                  <td className="text-warning text-center"><span className="same-width">6</span></td>
                  <td className="text-center"><span className="same-width">7</span></td>
                  <td className="text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-center"><span className="same-width">1</span></td>
                  <td className="text-primary text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-center"><span className="same-width">5</span></td>
                  <td className="text-warning text-center"><span className="same-width">6</span></td>
                  <td className="text-center"><span className="same-width">7</span></td>
                  <td className="text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-center"><span className="same-width">1</span></td>
                  <td className="text-primary text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-center"><span className="same-width">5</span></td>
                  <td className="text-warning text-center"><span className="same-width">6</span></td>
                  <td className="text-center"><span className="same-width">7</span></td>
                  <td className="text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-center"><span className="same-width">1</span></td>
                  <td className="text-primary text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-center"><span className="same-width">5</span></td>
                  <td className="text-warning text-center"><span className="same-width">6</span></td>
                  <td className="text-center"><span className="same-width">7</span></td>
                  <td className="text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-center"><span className="same-width">1</span></td>
                  <td className="text-primary text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-center"><span className="same-width">5</span></td>
                  <td className="text-warning text-center"><span className="same-width">6</span></td>
                  <td className="text-center"><span className="same-width">7</span></td>
                  <td className="text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-center"><span className="same-width">1</span></td>
                  <td className="text-primary text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-center"><span className="same-width">5</span></td>
                  <td className="text-warning text-center"><span className="same-width">6</span></td>
                  <td className="text-center"><span className="same-width">7</span></td>
                  <td className="text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-center"><span className="same-width">1</span></td>
                  <td className="text-primary text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-center"><span className="same-width">5</span></td>
                  <td className="text-warning text-center"><span className="same-width">6</span></td>
                  <td className="text-center"><span className="same-width">7</span></td>
                  <td className="text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-center"><span className="same-width">1</span></td>
                  <td className="text-primary text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-center"><span className="same-width">5</span></td>
                  <td className="text-warning text-center"><span className="same-width">6</span></td>
                  <td className="text-center"><span className="same-width">7</span></td>
                  <td className="text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-center"><span className="same-width">1</span></td>
                  <td className="text-primary text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-center"><span className="same-width">5</span></td>
                  <td className="text-warning text-center"><span className="same-width">6</span></td>
                  <td className="text-center"><span className="same-width">7</span></td>
                  <td className="text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(LeaveFund)
