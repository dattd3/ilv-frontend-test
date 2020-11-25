import React from 'react'
import moment from 'moment'
import DetailButtonComponent from '../DetailButtonComponent'
import StatusModal from '../../../components/Common/StatusModal'
import Constants from '../.../../../../commons/Constants'

const TIME_FORMAT = 'HH:mm'
const DATE_FORMAT = 'DD/MM/YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'
const TIME_OF_SAP_FORMAT = 'HHmm00'
const FULL_DAY = 1

class LeaveOfAbsenceDetailComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isShowStatusModal: false
    }
  }

  showStatusModal = (message, isSuccess = false) => {
    this.setState({ isShowStatusModal: true, content: message, isSuccess: isSuccess });
  }

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
  }

  render() {
    const userProfileInfo = this.props.leaveOfAbsence.userProfileInfo
    const requestTypeId = this.props.leaveOfAbsence.requestTypeId

    return (
      <div className="leave-of-absence">
        <h5>Thông tin CBNV đăng ký</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-3">
              Họ và tên
              <div className="detail">{userProfileInfo.user ? userProfileInfo.user.fullname : ""}</div>
            </div>
            <div className="col-3">
              Mã nhân viên
              <div className="detail">{userProfileInfo.user ? userProfileInfo.user.employeeNo : ""}</div>
            </div>
            <div className="col-3">
              Chức danh
              <div className="detail">{userProfileInfo.user ? userProfileInfo.user.jobTitle : ""}</div>
            </div>
            <div className="col-3">
              Khối/Phòng/Bộ phận
              <div className="detail">{userProfileInfo.user ? userProfileInfo.user.department : ""}</div>
            </div>
          </div>
        </div>
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <h5>Thông tin đăng ký nghỉ</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-3">
              Từ ngày/giờ
              <div className="detail">{userProfileInfo.startDate + (userProfileInfo.startTime ? ' ' + moment(userProfileInfo.startTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '')}</div>
            </div>
            <div className="col-3">
              Đến ngày/giờ
              <div className="detail">{userProfileInfo.endDate + (userProfileInfo.endTime ? ' ' + moment(userProfileInfo.endTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '')}</div>
            </div>
            <div className="col-3">
              Tổng thời gian nghỉ
              <div className="detail">{this.props.leaveOfAbsence.userProfileInfo.leaveType == FULL_DAY ? this.props.leaveOfAbsence.userProfileInfo.totalDays ? this.props.leaveOfAbsence.userProfileInfo.totalDays + ' ngày' : "" : this.props.leaveOfAbsence.userProfileInfo.totalTimes ? this.props.leaveOfAbsence.userProfileInfo.totalTimes + ' giờ' : ""}</div>
            </div>
            <div className="col-3">
              Loại nghỉ
              <div className="detail">{userProfileInfo.absenceType ? userProfileInfo.absenceType.label : ""}</div>
            </div>
          </div>
          {(userProfileInfo.absenceType && userProfileInfo.absenceType.value === 'PN03') ? <div className="row">
            <div className="col">
              Thông tin hiếu hỉ
              <div className="detail">{userProfileInfo.pn03.label}</div>
            </div>
          </div> : null}
          <div className="row">
            <div className="col">
              Lý do đăng ký nghỉ
              <div className="detail">{this.props.leaveOfAbsence.comment}</div>
            </div>
          </div>
        </div>

        <div className="block-status">
          <span className={`status ${Constants.mappingStatus[this.props.leaveOfAbsence.status].className}`}>{Constants.mappingStatus[this.props.leaveOfAbsence.status].label}</span>
          {
            this.props.leaveOfAbsence.status == Constants.STATUS_NOT_APPROVED ?
            <span className="hr-comments-block">Lý do không duyệt: <span className="hr-comments">{this.props.leaveOfAbsence.hrComment || ""}</span></span> : null
          }
        </div>

        {
          this.props.leaveOfAbsence.userProfileInfoDocuments.length > 0 ?
          <>
          <h5>Tài liệu chứng minh</h5>
          <ul className="list-inline">
            {this.props.leaveOfAbsence.userProfileInfoDocuments.map((file, index) => {
              return <li className="list-inline-item" key={index}>
                <a className="file-name" href={file.fileUrl} title={file.fileName} target="_blank" download={file.fileName}>{file.fileName}</a>
              </li>
            })}
          </ul>
          </>
          : null
        }

        {this.props.leaveOfAbsence.status === 0 || this.props.leaveOfAbsence.status === 2 ? <DetailButtonComponent dataToSap={[{
          MYVP_ID: 'ABS' + '0'.repeat(9 - this.props.leaveOfAbsence.id.toString().length) + this.props.leaveOfAbsence.id,
          PERNR: userProfileInfo.user ? userProfileInfo.user.employeeNo : "",
          BEGDA: moment(userProfileInfo.startDate, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
          ENDDA: moment(userProfileInfo.endDate, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
          SUBTY: userProfileInfo.absenceType ? userProfileInfo.absenceType.value : "",
          BEGUZ: userProfileInfo.startTime ? moment(userProfileInfo.startTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null,
          ENDUZ: userProfileInfo.endTime ? moment(userProfileInfo.endTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null,
          ACTIO: 'INS'
        }]}
          isShowRevocationOfApproval={this.props.leaveOfAbsence.status === 2}
          id={this.props.leaveOfAbsence.id}
          urlName={'requestabsence'}
          requestTypeId={requestTypeId}
        /> : null}
      </div>
    )
  }
}

export default LeaveOfAbsenceDetailComponent
