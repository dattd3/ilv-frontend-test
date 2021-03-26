import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from "react-i18next"
import DetailButtonComponent from '../DetailButtonComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'
import StatusModal from '../../../components/Common/StatusModal'
import Constants from '../.../../../../commons/Constants'

const TIME_FORMAT = 'HH:mm:00'
const TIME_OF_SAP_FORMAT = 'HHmm00'
const DATE_FORMAT = 'DD-MM-YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'

class SubstitutionDetailComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isShowStatusModal: false
    }
  }

  getTypeDetail = () => {
    const pathName = window.location.pathname;
    const pathNameArr = pathName.split('/');
    return pathNameArr[pathNameArr.length - 1];
  }

  showStatusModal = (message, isSuccess = false) => {
    this.setState({ isShowStatusModal: true, content: message, isSuccess: isSuccess });
  }

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
  }

  getData() {
    return this.props.substitution.requestInfo.timesheet.filter(t => t.isEdit).map((timesheet, index) => {
      return {
        MYVP_ID: 'SUB' + '0'.repeat(8 - this.props.substitution.id.toString().length) + this.props.substitution.id + index,
        PERNR: this.props.substitution.user.employeeNo,
        BEGDA: moment(timesheet.date, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
        ENDDA: moment(timesheet.date, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
        TPROG: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_CODE ? timesheet.shiftId : '',
        BEGUZ: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE ? moment(timesheet.startTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : '',
        ENDUZ: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE ? moment(timesheet.endTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : '',
        VTART: timesheet.substitutionType.value,
        PBEG1: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE && timesheet.startBreakTime ? moment(timesheet.startBreakTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : '',
        PEND1: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE && timesheet.endBreakTime  ? moment(timesheet.endBreakTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : '',
        PBEZ1: '',
        PUNB1: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE && timesheet.startBreakTime && timesheet.endBreakTime  ? this.calTime(timesheet.startBreakTime, timesheet.endBreakTime) : '',
        TPKLA: parseFloat(timesheet.shiftHours) > 4 && timesheet.shiftType == Constants.SUBSTITUTION_SHIFT_UPDATE ? Constants.SUBSTITUTION_TPKLA_FULL_DAY : Constants.SUBSTITUTION_TPKLA_HALF_DAY
      }
    })
  }

  calTime(start, end) {
    if (start == null || end == null) {
      return ""
    }
    const differenceInMs = moment(end, TIME_FORMAT).diff(moment(start, TIME_FORMAT))
    return moment.duration(differenceInMs).asHours()
  }

  render() {
    const { t } = this.props
    const requestTypeId = this.props.substitution.requestTypeId

    return (
      <div className="leave-of-absence">
        <h5>Thông tin CBNV đăng ký</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-3">
             {t("FullName")}
              <div className="detail">{this.props.substitution.user.fullname}</div>
            </div>
            <div className="col-3">
              {t("EmployeeNo")}
              <div className="detail">{this.props.substitution.user.employeeNo}</div>
            </div>
            <div className="col-3">
              {t("Title")}
              <div className="detail">{this.props.substitution.user.jobTitle}</div>
            </div>
            <div className="col-3">
              {t("DepartmentManage")}
              <div className="detail">{this.props.substitution.user.department}</div>
            </div>
          </div>
        </div>
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <h5>Thông tin đăng ký thay đổi phân ca</h5>
        {this.props.substitution.requestInfo.timesheet.filter(t => t.isEdit).map((timesheet, index) => {
          return <div className="box shadow cbnv" key={index}>
            <div className="col text-uppercase"><p><i className="fa fa-clock-o"></i> <b>{t("Day")} {timesheet.date.replace(/-/g, '/')}</b></p></div>
            <div className="row">
              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">{t("ScheduledTime")}</p>
                  <div className="row">
                    <div className="col-6">
                      {t("Start")} {timesheet.shiftIndex}: <b>{timesheet.fromTime ? moment(timesheet.fromTime, TIME_OF_SAP_FORMAT).format(TIME_FORMAT) : null}</b>
                    </div>
                    <div className="col-6 text-right">
                      {t("End")} {timesheet.shiftIndex}: <b>{timesheet.toTime ? moment(timesheet.toTime, TIME_OF_SAP_FORMAT).format(TIME_FORMAT) : null}</b>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">Giờ thay đổi phân ca</p>
                  <div className="row">
                    <div className="col-6">
                      {t("Start")} {timesheet.shiftIndex}: <b>{timesheet.startTime}</b>
                    </div>
                    <div className="col-6 text-right">
                      {t("End")} {timesheet.shiftIndex}: <b>{timesheet.endTime}</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE ? <div className="row">
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
                <div className="detail">{t("Unpaid")}</div>
              </div>
            </div> : null}

            {timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_CODE ? <div className="row">
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

        {
          this.getTypeDetail() === "request" ?
          <>
          <h5>Thông tin phê duyệt</h5>
          <ApproverDetailComponent approver={this.props.substitution.approver} status={this.props.substitution.requestInfo.processStatusId} hrComment={this.props.substitution.hrComment} />
          </> : 
          <div className="block-status">
            <span className={`status ${Constants.mappingStatus[this.props.substitution.requestInfo.processStatusId].className}`}>{t(Constants.mappingStatus[this.props.substitution.requestInfo.processStatusId].label)}</span>
            {
              this.props.substitution.requestInfo.processStatusId == Constants.STATUS_NOT_APPROVED ?
              <span className="hr-comments-block">Lý do không duyệt: <span className="hr-comments">{this.props.substitution.hrComment || ""}</span></span> : null
            }
          </div>
        }

        {
          this.props.substitution.requestDocuments.length > 0 ?
          <>
          <h5>Tài liệu chứng minh</h5>
          <ul className="list-inline">
            {this.props.substitution.requestDocuments.map((file, index) => {
              return <li className="list-inline-item" key={index}>
                <a className="file-name" href={file.fileUrl} title={file.fileName} target="_blank" download={file.fileName}>{file.fileName}</a>
              </li>
            })}
          </ul>
          </>
          : null
        }

        {this.props.substitution.requestInfo.processStatusId == 0 || this.props.substitution.requestInfo.processStatusId == 2 ? <DetailButtonComponent dataToSap={this.getData()}
          id={this.props.substitution.id}
          isShowRevocationOfApproval={this.props.substitution.requestInfo.processStatusId == 2}
          isShowEvictionRequest={this.props.substitution.requestInfo.processStatusId == 0}
          urlName={'requestsubstitution'}
          requestTypeId={requestTypeId}
          hiddenRevocationOfApprovalButton={1}
        /> : null}
      </div>
    )
  }
}
export default withTranslation()(SubstitutionDetailComponent)