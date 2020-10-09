import React from 'react'
import moment from 'moment'
import DetailButtonComponent from '../DetailButtonComponent'
import RequesterDetailComponent from '../RequesterDetailComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'

class BusinessTripDetailComponent extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div className="business-trip">
        <h5>Thông tin CBNV đăng ký</h5>
        <RequesterDetailComponent user={this.props.leaveOfAbsence.userProfileInfo.user}/>

        <h5>Thông tin đăng ký nghỉ phép</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-4">
              Từ ngày/giờ
              <div className="detail">{moment(this.props.leaveOfAbsence.userProfileInfo.startDate).format('DD/MM/YYYY') + (this.props.leaveOfAbsence.userProfileInfo.startTime ? ' ' + moment(this.props.leaveOfAbsence.userProfileInfo.startTime).lang('en-us').format('hh:mm A') : '')}</div>
            </div>
            <div className="col-4">
              Đến ngày/giờ
              <div className="detail">{moment(this.props.leaveOfAbsence.userProfileInfo.endDate).format('DD/MM/YYYY') + (this.props.leaveOfAbsence.userProfileInfo.endTime ? ' ' + moment(this.props.leaveOfAbsence.userProfileInfo.endTime).lang('en-us').format('hh:mm A') : '')}</div>
            </div>
            <div className="col-4">
              Tổng thời gian nghỉ
              <div className="detail">{this.props.leaveOfAbsence.userProfileInfo.totalTime}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-4">
              Loại chuyến Công tác/Đào tạo
              <div className="detail">{this.props.leaveOfAbsence.userProfileInfo.attendanceQuotaType.label}</div>
            </div>
            <div className="col-4">
              Địa điểm
              <div className="detail">{this.props.leaveOfAbsence.userProfileInfo.place.label}</div>
            </div>
            <div className="col-4">
              Phương tiện
              <div className="detail">{this.props.leaveOfAbsence.userProfileInfo.vehicle.label}</div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              Lý do đăng ký nghỉ phép
              <div className="detail">{this.props.leaveOfAbsence.comment}</div>
            </div>
          </div>
        </div>

        <h5>Thông tin CBLĐ phê duyệt</h5>
        <ApproverDetailComponent approver={this.props.leaveOfAbsence.userProfileInfo.approver}/>

        <DetailButtonComponent />
      </div>
    )
  }
}
export default BusinessTripDetailComponent