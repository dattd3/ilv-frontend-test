import React from 'react'
import moment from 'moment'
import DetailButtonComponent from '../DetailButtonComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'

const DATE_FORMAT = 'DD/MM/YYYY'
const TIME_FORMAT = 'HH:mm'

class LeaveOfAbsenceDetailComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
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
              <div className="detail">{this.props.leaveOfAbsence.userProfileInfo.startDate + (this.props.leaveOfAbsence.userProfileInfo.startTime ? ' ' + moment(this.props.leaveOfAbsence.userProfileInfo.startTime, TIME_FORMAT).lang('en-us').format('hh:mm A') : '')}</div>
            </div>
            <div className="col-3">
              Đến ngày/giờ
              <div className="detail">{this.props.leaveOfAbsence.userProfileInfo.endDate + (this.props.leaveOfAbsence.userProfileInfo.endTime ? ' ' + moment(this.props.leaveOfAbsence.userProfileInfo.endTime, TIME_FORMAT).lang('en-us').format('hh:mm A') : '')}</div>
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

          {this.props.leaveOfAbsence.userProfileInfo.absenceType.value === 'PN03' ? <div className="row">
            <div className="col">
              Thông tin hiếu hỉ
              <div className="detail">{this.props.leaveOfAbsence.userProfileInfo.pn03.label}</div>
            </div>
          </div> : null}

          <div className="row">
            <div className="col">
              Lý do đăng ký nghỉ phép
              <div className="detail">{this.props.leaveOfAbsence.comment}</div>
            </div>
          </div>
        </div>

        <h5>Thông tin CBLĐ phê duyệt</h5>
        <ApproverDetailComponent approver={this.props.leaveOfAbsence.userProfileInfo.approver} />

        <ul className="list-inline">
          {this.props.leaveOfAbsence.userProfileInfoDocuments.map((file, index) => {
            return <li className="list-inline-item" key={index}>
              <a className="file-name" href={file.fileUrl} title="file đính kèm" target="_blank">{file.fileName}</a>
            </li>
          })}
        </ul>

        <DetailButtonComponent />
      </div>
    )
  }
}
export default LeaveOfAbsenceDetailComponent