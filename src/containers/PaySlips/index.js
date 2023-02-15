import React from 'react'
import axios from 'axios'
import { withTranslation } from "react-i18next"
import ConfirmPasswordModal from './ConfirmPasswordModal/ConfirmPasswordModal'
import FormSearchComponent from './SearchBlock/FormSearchComponent'
import MainResultComponent from './ResultBlock/MainResultComponent'
import IncomeComponent from './ResultBlock/IncomeComponent'
import WorkingInformationComponent from './ResultBlock/WorkingInformationComponent'
import LeaveInformationComponent from './ResultBlock/LeaveInformationComponent'
import LoadingModal from '../../components/Common/LoadingModal'
import { exportToPDF } from "../../commons/Utils"
import ReactHTMLTableToExcel from "react-html-table-to-excel"
import HOCComponent from '../../components/Common/HOCComponent'

class PaySlipsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowConfirmPasswordModal: true,
      acessToken: new URLSearchParams(props?.history?.location?.search).get('accesstoken') || null,
      payslip: null,
      isSearch: false,
      currencySelected: null,
      isLoading: false,
    }
  }

  componentDidMount() {
    const queryParams = new URLSearchParams(this.props?.history?.location?.search)
    if (queryParams.has('accesstoken')) {
      queryParams.delete('accesstoken')
      this.props.history.replace({
        search: queryParams.toString(),
      })
    }
  }

  handleSubmitSearch = (month, year, currency) => {
    this.setState({ isSearch: false, isLoading: true, currencySelected: currency })
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`,
        'Content-Type':'multipart/form-data'
      }
    }

    let bodyFormData = new FormData()
    bodyFormData.append('month', month < 10 ? `0${month}` : `${month}`)
    bodyFormData.append('year', `${year}`)
    bodyFormData.append('PayslipAuth', this.state.acessToken)
    bodyFormData.append('pernr', `${localStorage.getItem('employeeNo')}`)
    bodyFormData.append('companyCode', `${localStorage.getItem('companyCode')}`)

    axios.post(`${process.env.REACT_APP_REQUEST_URL}user/payslip`, bodyFormData, config)
    .then(res => {
        if (res && res.data && res.data.data && res.data.data.payslips) {
          const paySlipInfos = res.data.data.payslips[0]
          this.setState({payslip: paySlipInfos, isSearch: true})
        } else if(res && res.data && res.data.data.error == 'Invalid token.') {
          this.setState({acessToken: null, payslip: null, isSearch: false})
        } else {
          this.setState({payslip: null, isSearch: true})
        }
    }).catch(error => {
    }).finally(() => {
      this.setState({ isLoading: false })
    });
  }

  updateToken (acessToken) {
    this.setState({acessToken: acessToken})
  }

  downloadPDF = () => {
    const elementView = document.getElementById('result-block')
    exportToPDF(elementView, "payslip")
  }

  render() {            
    const { t } = this.props
    const { acessToken, isSearch, payslip, currencySelected, isLoading } = this.state

    return (
      <>
      <LoadingModal show={isLoading} />
      <ConfirmPasswordModal show={acessToken == null} onUpdateToken={this.updateToken.bind(this)} />
      <div className="payslips-section">
        <h1 className="content-page-header">{t("PaySlip")}</h1>
        <div className="card shadow mb-4">
          <div className="card-body">
            <FormSearchComponent search={this.handleSubmitSearch} />
            { isSearch && !payslip && <p className="text-danger">{t("NoDataFound")}</p> }
          </div>
        </div>
        {
          isSearch && acessToken && payslip ?
          <>
          <div className="block-buttons">
            <button className="btn-download download-pdf" onClick={this.downloadPDF}>Tải PDF</button>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="btn btn-link pull-right download-excel"
              table="payslip-download"
              filename="SalaryInformation"
              sheet="SalaryInformation"
              buttonText="Tải Excel"
            />
          </div>
          <div className="result-block" id="result-block">
            <div className="card mb-4">
              <div className="card-body">
                <MainResultComponent personalInformation={payslip.personal_information} />
              </div>
            </div>
            <div className="other-result-section">
              <WorkingInformationComponent payslip={payslip} currencySelected={currencySelected} />
              <LeaveInformationComponent payslip={payslip} />
              <IncomeComponent payslip={payslip} currencySelected={currencySelected} />
            </div>
          </div>
          <div className="block-buttons">
            <button className="btn-download download-pdf" onClick={this.downloadPDF}>Tải PDF</button>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="btn btn-link pull-right download-excel"
              table="payslip-download"
              filename="SalaryInformation"
              sheet="SalaryInformation"
              buttonText="Tải Excel"
            />
          </div>
          </>
          : null
        }
      </div>
      </>
    )
  }
}

export default HOCComponent(withTranslation()(PaySlipsComponent))
