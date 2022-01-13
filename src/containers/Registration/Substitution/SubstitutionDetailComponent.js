import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from "react-i18next"
import DetailButtonComponent from '../DetailButtonComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'
import StatusModal from '../../../components/Common/StatusModal'
import Constants from '../.../../../../commons/Constants'
import { getRequestTypeIdsAllowedToReApproval } from "../../../commons/Utils"

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
        PBEG1: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE && timesheet.startBreakTime !== null ? moment(timesheet.startBreakTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : '',
        PEND1: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE && timesheet.endBreakTime !== null ? moment(timesheet.endBreakTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : '',
        PBEZ1: '',
        PUNB1: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE && timesheet.startBreakTime !== null && timesheet.endBreakTime !== null ? this.calTime(timesheet.startBreakTime, timesheet.endBreakTime) : '',
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

  showStatus = (status, appraiser) => {
    if (this.getTypeDetail() == 'request' && this.props.action == undefined) {
      return Constants.mappingStatusRequest[status].label;
    } 
    return (this.props.action == "consent" && status == 5 && appraiser) ? Constants.mappingStatusRequest[20].label : Constants.mappingStatusRequest[status].label
  }
  render() {
    const { t, substitution, action } = this.props
    const requestTypeId = substitution.requestTypeId
    const { isShowStatusModal, content, isSuccess } = this.state
    const requestTypeIdsAllowedToReApproval = getRequestTypeIdsAllowedToReApproval()
    const isShowApproval = (substitution.processStatusId === Constants.STATUS_WAITING) || (action === "approval" && substitution.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && requestTypeIdsAllowedToReApproval.includes(substitution.requestTypeId))

    let messageSAP = null;
    if (substitution.processStatusId === Constants.STATUS_PARTIALLY_SUCCESSFUL)
    {
      if (substitution.responseDataFromSAP && Array.isArray(substitution.responseDataFromSAP)) {
        const data = substitution.responseDataFromSAP.filter(val => val.STATUS === 'E');
        if (data) {
          const temp = data.map(val => val?.MESSAGE);
          messageSAP = temp.filter(function(item, pos) {
            return temp.indexOf(item) === pos;
          })
        }
      }
    }
    return (
      <div className="leave-of-absence shift-change-section">
        <h5>{t("EmployeeInfomation")}</h5>
        <div className="box shadow cbnv">
          <div className="row group">
            <div className="col-xl-3">
             {t("FullName")}
              <div className="detail auto-height">{substitution.user.fullName}</div>
            </div>
            <div className="col-xl-3">
              {t("EmployeeNo")}
              <div className="detail auto-height">{substitution.user.employeeNo}</div>
            </div>
            <div className="col-xl-3 auto-height">
              {t("Title")}
              <div className="detail auto-height">{substitution.user.jobTitle}</div>
            </div>
            <div className="col-xl-3">
              {t("DepartmentManage")}
              <div className="detail auto-height">{substitution.user.department}</div>
            </div>
          </div>
        </div>
        <StatusModal show={isShowStatusModal} content={content} isSuccess={isSuccess} onHide={this.hideStatusModal} />
        <h5>{t("ShiftChangeRequestInformation")}</h5>
        {substitution.requestInfo.filter(t => t.isEdited).map((timesheet, index) => {
          let dateInfoElementEdited = <b>{t("Day")} {moment(timesheet.date).format("DD/MM/YYYY")}</b>
          if (timesheet.applyFrom !== timesheet.applyTo) {
            dateInfoElementEdited = <b>{t("From")} {moment(timesheet.applyFrom, 'YYYYMMDD').format("DD/MM/YYYY")} - {t("To")} {moment(timesheet.applyTo, 'YYYYMMDD').format("DD/MM/YYYY")}</b>
          }

          return <div className="box shadow cbnv" key={index}>
            <div className="col text-uppercase date-info-edit"><p><i className="fa fa-clock-o"></i> {dateInfoElementEdited}</p></div>
            <div className="row">
              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">{t("ScheduledTime")}</p>
                  <div className="row">
                    <div className="col-6">
                      {t("Start")} {timesheet.shiftIndex}: <b>{timesheet.fromTimeByPlan ? moment(timesheet.fromTimeByPlan, TIME_FORMAT).format('HH:mm') : null}</b>
                    </div>
                    <div className="col-6 text-right">
                      {t("End")} {timesheet.shiftIndex}: <b>{timesheet.toTimeByplan ? moment(timesheet.toTimeByplan, TIME_FORMAT).format('HH:mm') : null}</b>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">{t("ShiftChangeTime")}</p>
                  <div className="row">
                    <div className="col-6">
                      {t("Start")} {timesheet.shiftIndex}: <b>{timesheet.fromTimeEdited ? moment(timesheet.fromTimeEdited, TIME_FORMAT).format('HH:mm') : null}</b>
                    </div>
                    <div className="col-6 text-right">
                      {t("End")} {timesheet.shiftIndex}: <b>{timesheet.toTimeEdited ? moment(timesheet.toTimeEdited, TIME_FORMAT).format('HH:mm') : null}</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {timesheet.startBreakTimeEdited ? <div className="row">
              <div className="col">
                <p>{t("BreakStartTime")}</p>
                <div className="detail">{timesheet?.startBreakTimeEdited ? moment(timesheet?.startBreakTimeEdited, 'HHmmss').format("HH:mm") : ""}</div>
              </div>
              <div className="col">
                <p>{t("BreakEndTime")}</p>
                <div className="detail">{timesheet?.endBreakTimeEdited ? moment(timesheet?.endBreakTimeEdited, 'HHmmss').format("HH:mm") : ""}</div>
              </div>
              <div className="col">
                <p>{t("ShiftBreak")}</p>
                <div className="detail">{t("Unpaid")}</div>
              </div>
            </div> : null}

            {timesheet.shiftId ? <div className="row">
              <div className="col">
                <p>{t("ChangedShiftCode")}</p>
                <div className="detail">{timesheet.shiftId}</div>
              </div>
              <div className="col">
                <p>Giờ làm việc thay đổi</p>
                <div className="detail">{timesheet.shiftHours}</div>
              </div>
            </div> : null}

            <div className="row">
              <div className="col" style={{marginTop: 10}}>
                {t("ShiftChangeReason")}
              <div className="detail">{timesheet.note}</div>
              </div>
            </div>
          </div>
        })}
        <h5>{t("ConsenterInformation")}</h5>
        <ApproverDetailComponent title={t("Consenter")} approver={substitution.appraiser} status={substitution.requestInfo ? substitution.processStatusId : ""} hrComment={substitution.appraiserComment} />
        {
          substitution && (Constants.STATUS_TO_SHOW_APPROVER.includes(substitution.processStatusId )) ?
          <>
            <h5>{t("ApproverInformation")}</h5>
            <ApproverDetailComponent title={t("Approver")} approver={substitution.approver} status={substitution.processStatusId} hrComment={substitution.approverComment} />
          </> : null
        }

        {
          substitution.requestDocuments.length > 0 ?
          <>
          <h5>{t("Evidence")}</h5>
          <ul className="list-inline">
            {substitution.requestDocuments.map((file, index) => {
              return <li className="list-inline-item" key={index}>
                <a className="file-name" href={file.fileUrl} title={file.fileName} target="_blank" download={file.fileName}>{file.fileName}</a>
              </li>
            })}
          </ul>
          </>
          : null
        }
        <div className="block-status">
          <span className={`status ${Constants.mappingStatusRequest[substitution.processStatusId].className}`}>{t(this.showStatus(substitution.processStatusId, substitution.appraiser))}</span>
          {messageSAP && 
            <div className={`d-flex status fail`}>
              <i className="fas fa-times pr-2 text-danger align-self-center"></i>
              <div>
                {messageSAP.map((msg, index) => {
                  return <div key={index}>{msg}</div>
                })}
              </div>
            </div>}
        </div>
        {
          substitution 
          && (substitution.processStatusId === 8 || (action != "consent" && substitution.processStatusId === 5) 
              || substitution.processStatusId === 2 
              || (action === "approval" && substitution.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && requestTypeIdsAllowedToReApproval.includes(substitution.requestTypeId))) 
          ? 
          <DetailButtonComponent 
            dataToSap={
              [
                {
                  "id": substitution.id,
                  "requestTypeId": Constants.SUBSTITUTION,
                  "sub": [
                    {
                      "id": substitution.id,
                    }
                  ]
                }
              ]
            } //this.getData()
            id={substitution.id}
            isShowApproval={isShowApproval}
            isShowRevocationOfApproval={substitution.processStatusId === Constants.STATUS_APPROVED}
            isShowConsent = {substitution.processStatusId === Constants.STATUS_WAITING_CONSENTED}
            isShowRevocationOfConsent = {substitution.processStatusId === Constants.STATUS_WAITING && substitution.appraiser}
            urlName={'requestsubstitution'}
            requestTypeId={requestTypeId}
            hiddenRevocationOfApprovalButton={1}
            action={action}
          />
          : null
        }
      </div>
    )
  }
}
export default withTranslation()(SubstitutionDetailComponent)