import React from 'react'
import axios from 'axios'
import ConfirmPasswordModal from './ConfirmPasswordModal/ConfirmPasswordModal'
import FormSearchComponent from './SearchBlock/FormSearchComponent'
import MainResultComponent from './ResultBlock/MainResultComponent'
import IncomeComponent from './ResultBlock/IncomeComponent'
import WorkingInformationComponent from './ResultBlock/WorkingInformationComponent'
import LeaveInformationComponent from './ResultBlock/LeaveInformationComponent'

class PaySlipsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowConfirmPasswordModal: true,
      acessToken: null,
      payslip: null,
      isSearch: false
    }
  }

  componentWillMount() {
    
  }

  handleSubmitSearch = (month, year) => {
      this.setState({isSearch: false})
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
            this.setState({payslip: res.data.data.payslips[0], isSearch: true})
        } else if(res && res.data && res.data.data.error == 'Invalid token.') {
          this.setState({acessToken: null, payslip: null, isSearch: false})
        } else {
          this.setState({payslip: null, isSearch: true})
        }
    }).catch(error => {
    })
  }

  updateToken (acessToken) {
    this.setState({acessToken: acessToken})
  }

  render() {
    return (
      <>
      <ConfirmPasswordModal show={this.state.acessToken == null} onUpdateToken={this.updateToken.bind(this)} />
      <div className="payslips-section">
        <div className="card shadow mb-4">
          <div className="card-body">
            <FormSearchComponent search={this.handleSubmitSearch.bind(this)} />
            {this.state.isSearch && this.state.acessToken && this.state.payslip ? <MainResultComponent personalInformation={this.state.payslip.personal_information} /> : null }
            {this.state.isSearch && !this.state.payslip ? <p className="text-danger">Dữ liệu không tìm thấy!</p> : null}
          </div>
        </div>
        <div className="other-result-section">
          {this.state.isSearch && this.state.acessToken &&  this.state.payslip ? <WorkingInformationComponent payslip={this.state.payslip} /> : null }
          {this.state.isSearch && this.state.acessToken &&  this.state.payslip ? <LeaveInformationComponent payslip={this.state.payslip} /> : null }
          {this.state.isSearch && this.state.acessToken &&  this.state.payslip ? <IncomeComponent payslip={this.state.payslip} /> : null }
        </div>
      </div>
      </>
    )
  }
}

export default PaySlipsComponent
