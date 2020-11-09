import React from 'react'
import moment from 'moment'
import DetailButtonComponent from '../DetailButtonComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'
import StatusModal from '../../../components/Common/StatusModal'
import Constants from '../.../../../../commons/Constants'

const TIME_FORMAT = 'HH:mm:00'
const TIME_OF_SAP_FORMAT = 'HHmm00'
const DATE_FORMAT = 'DD-MM-YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'
const SHIFT_CODE = 1
const SHIFT_UPDATE = 2

class SubstitutionDetailComponent extends React.Component {
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

  getData() {
    return this.props.substitution.userProfileInfo.timesheets.filter(t => t.isEdit).map((timesheet, index) => {
      return {
        MYVP_ID: 'ABS' + '0'.repeat(8 - this.props.substitution.id.toString().length) + this.props.substitution.id + index,
        PERNR: this.props.substitution.userProfileInfo.user.employeeNo,
        BEGDA: moment(timesheet.date, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
        ENDDA: moment(timesheet.date, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
        TPROG: timesheet.shiftType === SHIFT_CODE ? timesheet.shiftId : '',
        BEGUZ: timesheet.shiftType === SHIFT_UPDATE ? moment(timesheet.startTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : '',
        ENDUZ: timesheet.shiftType === SHIFT_UPDATE ? moment(timesheet.endTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : '',
        VTART: this.props.substitution.userProfileInfo.substitutionType.value,
        PBEG1: timesheet.shiftType === SHIFT_UPDATE && timesheet.startBreakTime !== null ? moment(timesheet.startBreakTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : '',
        PEND1: timesheet.shiftType === SHIFT_UPDATE && timesheet.endBreakTime !== null ? moment(timesheet.endBreakTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : '',
        PBEZ1: '',
        PUNB1: timesheet.shiftType === SHIFT_UPDATE && timesheet.startBreakTime !== null && timesheet.endBreakTime !== null ? this.calTime(timesheet.startBreakTime, timesheet.endBreakTime) : ''
      }
    })
  }

  calTime(startTime, endTime) {
    const differenceInMs = moment(endTime, TIME_FORMAT).diff(moment(startTime, TIME_FORMAT))
    return moment.duration(differenceInMs).asHours()
  }

  render() {
    return (
      <div className="leave-of-absence">
        <h5>Thông tin CBNV đăng ký</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-3">
              Họ và tên
              <div className="detail">{this.props.substitution.userProfileInfo.user.fullname}</div>
            </div>
            <div className="col-3">
              Mã nhân viên
              <div className="detail">{this.props.substitution.userProfileInfo.user.employeeNo}</div>
            </div>
            <div className="col-3">
              Chức danh
              <div className="detail">{this.props.substitution.userProfileInfo.user.jobTitle}</div>
            </div>
            <div className="col-3">
              Khối/Phòng/Bộ phận
              <div className="detail">{this.props.substitution.userProfileInfo.user.department}</div>
            </div>
          </div>
        </div>
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <h5>Thông tin đăng ký thay đổi phân ca</h5>
        {this.props.substitution.userProfileInfo.timesheets.filter(t => t.isEdit).map((timesheet, index) => {
          return <div className="box shadow cbnv" key={index}>
            <div className="col"><p><i className="fa fa-clock-o"></i> <b>Ngày {timesheet.date.replace(/-/g, '/')}</b></p></div>
            <div className="row">
              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">Giờ kế hoạch</p>
                  <div className="row">
                    <div className="col-6">
                      Bắt đầu {timesheet.shiftIndex}: <b>{timesheet.fromTime ? moment(timesheet.fromTime, TIME_OF_SAP_FORMAT).format(TIME_FORMAT) : null}</b>
                    </div>
                    <div className="col-6 text-right">
                      Kết thúc {timesheet.shiftIndex}: <b>{timesheet.toTime ? moment(timesheet.toTime, TIME_OF_SAP_FORMAT).format(TIME_FORMAT) : null}</b>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">Giờ thay đổi phân ca</p>
                  <div className="row">
                    <div className="col-6">
                      Bắt đầu {timesheet.shiftIndex}: <b>{timesheet.startTime}</b>
                    </div>
                    <div className="col-6 text-right">
                      Kết thúc {timesheet.shiftIndex}: <b>{timesheet.endTime}</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {timesheet.shiftType === SHIFT_UPDATE ? <div className="row">
              <div className="col">
                <p>Thời gian bắt đầu nghỉ ca</p>
                <div className="detail">{timesheet.startBreakTime}</div>
              </div>
              <div className="col">
                <p>Thời gian kết thúc nghỉ ca</p>
                <div className="detail">{timesheet.endBreakTime}</div>
              </div>
              <div className="col">
                <p>Giờ nghỉ giữa ca</p>
                <div className="detail">Không hưởng lương</div>
              </div>
            </div> : null}

            {timesheet.shiftType === SHIFT_CODE ? <div className="row">
              <div className="col">
                <p>Mã ca thay đổi</p>
                <div className="detail">{timesheet.shiftId}</div>
              </div>
              <div className="col">
                <p>Giờ làm việc thay đổi</p>
                <div className="detail">{timesheet.shiftHours}</div>
              </div>
            </div> : null}

            <div className="row">
              <div className="col">
                Lý do đăng ký thay đổi phân ca
              <div className="detail">{timesheet.note}</div>
              </div>
            </div>
          </div>
        })}

        <h5>Thông tin CBLĐ phê duyệt</h5>
        <ApproverDetailComponent approver={this.props.substitution.userProfileInfo.approver} status={this.props.substitution.status} hrComment={this.props.substitution.hrComment} />

        <ul className="list-inline">
          {this.props.substitution.userProfileInfoDocuments.map((file, index) => {
            return <li className="list-inline-item" key={index}>
              <a className="file-name" href={file.fileUrl} title="file đính kèm" target="_blank">{file.fileName}</a>
            </li>
          })}
        </ul>

        {this.props.substitution.status === 0 ? <DetailButtonComponent dataToSap={this.getData()}
          id={this.props.substitution.id}
          urlName={'requestsubstitution'}
        /> : null}
      </div>
    )
  }
}
export default SubstitutionDetailComponent