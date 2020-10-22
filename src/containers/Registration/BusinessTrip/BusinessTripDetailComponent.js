import React from 'react'
import moment from 'moment'
import DetailButtonComponent from '../DetailButtonComponent'
import RequesterDetailComponent from '../RequesterDetailComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'
import StatusModal from '../../../components/Common/StatusModal'
import axios from 'axios'

const TIME_FORMAT = 'HH:mm'
const DATE_FORMAT = 'DD/MM/YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'
const TIME_OF_SAP_FORMAT = 'HHmm00'

class BusinessTripDetailComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isShowStatusModal: false
    }
  }

  updateData() {
    const dataToSap = [{
      MYVP_ID: 'ATT' + '0'.repeat(9 - this.props.businessTrip.id.toString().length) + this.props.businessTrip.id,
      PERNR: this.props.businessTrip.userProfileInfo.user.employeeNo,
      BEGDA: moment(this.props.businessTrip.userProfileInfo.startDate, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
      ENDDA: moment(this.props.businessTrip.userProfileInfo.endDate, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
      SUBTY: this.props.businessTrip.userProfileInfo.attendanceQuotaType.value,
      BEGUZ: this.props.businessTrip.userProfileInfo.startTime ? moment(this.props.businessTrip.userProfileInfo.startTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null,
      ENDUZ: this.props.businessTrip.userProfileInfo.endTime ? moment(this.props.businessTrip.userProfileInfo.endTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null
    }]

    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
        'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET,
        'Content-Type': 'application/json'
      }
    }

    axios.put(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/user/requestattendance`, dataToSap, config)
      .then(res => {
        if (res && res.data) {
          const result = res.data[0]
          if (result && result.STATUS === 'S') {
            this.updateHistory(dataToSap)
          } else {
            this.showStatusModal(result.MESSAGE)
          }
        }
      }).catch(error => {
        this.showStatusModal('Có lỗi xảy ra! Xin vui lòng liên hệ IT để hỗ trợ')
      })
  }

  updateHistory(dataToSap) {
    let bodyFormData = new FormData();
    bodyFormData.append('UserProfileInfoToSap', JSON.stringify(dataToSap))

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.props.leaveOfAbsence.id}/registration-approve`,
      data: bodyFormData,
      headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
    })
      .then(response => {
        if (response && response.data && response.data.result) {
          this.showStatusModal('Phê duyệt thành công!', true)
        }
      })
      .catch(response => {
        this.showStatusModal('Có lỗi xảy ra! Xin vui lòng liên hệ IT để hỗ trợ')
      })
  }

  showStatusModal = (message, isSuccess = false) => {
    this.setState({ isShowStatusModal: true, content: message, isSuccess: isSuccess });
  }

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
  }

  render() {
    return (
      <div className="business-trip">
        <h5>Thông tin CBNV đăng ký</h5>
        <RequesterDetailComponent user={this.props.businessTrip.userProfileInfo.user} />
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />


        <h5>Thông tin đăng ký nghỉ phép</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-4">
              Từ ngày/giờ
              <div className="detail">{this.props.businessTrip.userProfileInfo.startDate + (this.props.businessTrip.userProfileInfo.startTime ? ' ' + moment(this.props.businessTrip.userProfileInfo.startTime, TIME_FORMAT).lang('en-us').format('hh:mm A') : '')}</div>
            </div>
            <div className="col-4">
              Đến ngày/giờ
              <div className="detail">{this.props.businessTrip.userProfileInfo.endDate + (this.props.businessTrip.userProfileInfo.endTime ? ' ' + moment(this.props.businessTrip.userProfileInfo.endTime, TIME_FORMAT).lang('en-us').format('hh:mm A') : '')}</div>
            </div>
            <div className="col-4">
              Tổng thời gian CT/ĐT
              <div className="detail">{this.props.businessTrip.userProfileInfo.totalTime ? this.props.businessTrip.userProfileInfo.totalTime + ' ngày' : null}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-4">
              Loại chuyến Công tác/Đào tạo
              <div className="detail">{this.props.businessTrip.userProfileInfo.attendanceQuotaType.label}</div>
            </div>
            <div className="col-4">
              Địa điểm
              <div className="detail">{this.props.businessTrip.userProfileInfo.place.label}</div>
            </div>
            <div className="col-4">
              Phương tiện
              <div className="detail">{this.props.businessTrip.userProfileInfo.vehicle.label}</div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              Lý do đăng ký nghỉ phép
              <div className="detail">{this.props.businessTrip.comment}</div>
            </div>
          </div>
        </div>

        <h5>Thông tin CBLĐ phê duyệt</h5>
        <ApproverDetailComponent approver={this.props.businessTrip.userProfileInfo.approver} />

        <ul className="list-inline">
          {this.props.businessTrip.userProfileInfoDocuments.map((file, index) => {
            return <li className="list-inline-item" key={index}>
              <a className="file-name" href={file.fileUrl} title="file đính kèm" target="_blank">{file.fileName}</a>
            </li>
          })}
        </ul>

        {this.props.businessTrip.status === 0 ? <DetailButtonComponent updateData={this.updateData.bind(this)} /> : null}
      </div>
    )
  }
}
export default BusinessTripDetailComponent