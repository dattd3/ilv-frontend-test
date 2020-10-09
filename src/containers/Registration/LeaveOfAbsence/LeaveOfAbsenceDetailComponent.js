import React from 'react'
import moment from 'moment'
import DetailButtonComponent from '../DetailButtonComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'

class LeaveOfAbsenceDetailComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tasks: []
    }
  }

  render() {
    return (
      <div className="leave-of-absence">
        <h5>Thông tin CBNV đăng ký</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-3">
              Họ và tên
              <div className="detail">{this.props.leaveOfAbsence.userProfileInfo.user.fullname}</div>
            </div>
            <div className="col-3">
              Mã nhân viên
              <div className="detail">{this.props.leaveOfAbsence.userProfileInfo.user.employeeNo}</div>
            </div>
            <div className="col-3">
              Chức danh
              <div className="detail">{this.props.leaveOfAbsence.userProfileInfo.user.jobTitle}</div>
            </div>
            <div className="col-3">
              Khối/Phòng/Bộ phận
              <div className="detail">{this.props.leaveOfAbsence.userProfileInfo.user.department}</div>
            </div>
          </div>
        </div>

        <h5>Thông tin đăng ký nghỉ phép</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-3">
              Từ ngày/giờ
              <div className="detail">{moment(this.props.leaveOfAbsence.userProfileInfo.startDate).format('DD/MM/YYYY') + (this.props.leaveOfAbsence.userProfileInfo.startTime ? ' ' + moment(this.props.leaveOfAbsence.userProfileInfo.startTime).lang('en-us').format('hh:mm A') : '')}</div>
            </div>
            <div className="col-3">
              Đến ngày/giờ
              <div className="detail">{moment(this.props.leaveOfAbsence.userProfileInfo.endDate).format('DD/MM/YYYY') + (this.props.leaveOfAbsence.userProfileInfo.endTime ? ' ' + moment(this.props.leaveOfAbsence.userProfileInfo.endTime).lang('en-us').format('hh:mm A') : '')}</div>
            </div>
            <div className="col-3">
              Tổng thời gian nghỉ
              <div className="detail">{this.props.leaveOfAbsence.userProfileInfo.totalTime}</div>
            </div>
            <div className="col-3">
              Loại nghỉ
              <div className="detail">{this.props.leaveOfAbsence.userProfileInfo.absenceType.label}</div>
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
export default LeaveOfAbsenceDetailComponent