import React from 'react'
import moment from 'moment'
import DetailButtonComponent from '../DetailButtonComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'
import StatusModal from '../../../components/Common/StatusModal'
import Constants from '../.../../../../commons/Constants'
import { withTranslation } from "react-i18next"
import axios from 'axios'
import _ from 'lodash'

const TIME_FORMAT = 'HH:mm'
const DATE_FORMAT = 'DD/MM/YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'
const TIME_OF_SAP_FORMAT = 'HHmm00'
const FULL_DAY = true

class LeaveOfAbsenceDetailComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isShowStatusModal: false,
      annualLeaveSummary: {}
    }
  }
  componentDidMount() {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
        'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
      }
    }
  
    axios.post(`${process.env.REACT_APP_MULE_HOST_INBOUND}api/sap/hcm/v1/inbound/user/currentabsence`, {
      perno: this.props.leaveOfAbsence.user.employeeNo.toString(),
      date: moment().format('YYYYMMDD')
    }, config)
      .then(res => {
        if (res && res.data) {
          const annualLeaveSummary = res.data.data
          this.setState({ annualLeaveSummary: annualLeaveSummary })
        }
      }).catch(error => {
      })
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

  render() {
    const userProfileInfo = this.props.leaveOfAbsence.user
    const requestTypeId = this.props.leaveOfAbsence.requestTypeId
    const requestInfo = this.props.leaveOfAbsence.requestInfo
    const appraiser = this.props.leaveOfAbsence.appraiser
    const annualLeaveSummary = this.state.annualLeaveSummary
    const { t } = this.props
    return (
      <div className="leave-of-absence">
        <h5>Thông tin CBNV đăng ký</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-2">
             {t("FullName")}
              <div className="detail">{userProfileInfo? userProfileInfo.fullName : ""}</div>
            </div>
            <div className="col-2">
              {t("EmployeeNo")}
              <div className="detail">{userProfileInfo ? userProfileInfo.employeeNo : ""}</div>
            </div>
            <div className="col-3">
              {t("Title")}
              <div className="detail">{userProfileInfo ? userProfileInfo.jobTitle : ""}</div>
            </div>
            <div className="col-5">
              {t('DepartmentManage')}
              <div className="detail">{userProfileInfo ? userProfileInfo.department : ""}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-2">
              {t("LeaveBalance")}
              <div className="detail">{annualLeaveSummary && annualLeaveSummary.DAY_LEA_REMAIN ? _.ceil(annualLeaveSummary.DAY_LEA_REMAIN, 2) : null}</div>
            </div>
            <div className="col-2">
              {t("LeavesThisYear")}
              <div className="detail">{annualLeaveSummary && annualLeaveSummary.DAY_LEA ? _.ceil(annualLeaveSummary.DAY_LEA, 2) : null}</div>
            </div>
            <div className="col-3">
              {t("AdvancecdAnnualLeave")}
              <div className="detail">{annualLeaveSummary && annualLeaveSummary.DAY_ADV_LEA ? _.ceil(annualLeaveSummary.DAY_ADV_LEA, 2) : null}</div>
            </div>
            <div className="col-5">
              <div className="row">
                <div className="col-6">
                  {t("ToilHoursBalance")}
                  <div className="detail">{annualLeaveSummary && annualLeaveSummary.HOUR_TIME_OFF_REMAIN ? _.ceil(annualLeaveSummary.HOUR_TIME_OFF_REMAIN, 2) : null}</div>
                </div>
                <div className="col-6">
                  {t("ToilHours")}
                  <div className="detail">{annualLeaveSummary && annualLeaveSummary.HOUR_COMP ? _.ceil(annualLeaveSummary.HOUR_COMP, 2) : null}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <h5>Thông tin đăng ký nghỉ</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-3">
              {t("StartDateTime")}
              <div className="detail">{requestInfo ? moment(requestInfo.startDate).format("DD/MM/YYYY") + (requestInfo.startTime ? ' ' + moment(requestInfo.startTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '') : ""}</div>
            </div>
            <div className="col-3">
              {t("EndDateTime")}
              <div className="detail">{requestInfo ? moment(requestInfo.endDate).format("DD/MM/YYYY") + (requestInfo.endTime ? ' ' + moment(requestInfo.endTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '') : ""}</div>
            </div>
            <div className="col-3">
              {t("TotalLeaveTime")}
              {/* <div className="detail">{ requestInfo && requestInfo.days && requestInfo.absenceType.value != "PQ02" ? requestInfo.days + ' ngày' : null } { requestInfo && requestInfo.hours  && requestInfo.absenceType.value == "PQ02" ? requestInfo.hours  + ' giờ' : null}</div> */}
              <div className="detail">{( requestInfo && requestInfo.days >= 1) ? requestInfo.days + ' ' + t("Day") : requestInfo.hours + ' ' + t("Hour")}</div>
            </div>
            <div className="col-3">
              {t("LeaveCategory")}
              <div className="detail">{requestInfo && requestInfo.absenceType ? requestInfo.absenceType.label : ""}</div>
            </div>
          </div>
          {(requestInfo && requestInfo.absenceType && requestInfo.absenceType.value === 'PN03') ? <div className="row">
            <div className="col">
              {t("MarriageFuneral")}
              <div className="detail">{requestInfo.absenceType.label}</div>
            </div>
          </div> : null}
          <div className="row">
            <div className="col">
              {t("ReasonRequestLeave")}
              <div className="detail">{requestInfo ? requestInfo.comment : ""}</div>
            </div>
          </div>
        </div>

        {
          requestInfo && (Constants.STATUS_TO_SHOW_CONSENTER.includes(requestInfo.processStatusId )) ? 
          <>
            <h5>Thông tin CBQL thẩm định</h5>
            <ApproverDetailComponent title={t("Consenter")} approver={this.props.leaveOfAbsence.appraiser} status={requestInfo ? requestInfo.processStatusId : ""} hrComment={this.props.leaveOfAbsence.requestInfo.appraiserComment} />
          </>
          : null
        }
        {
          // this.getTypeDetail() === "request" ?
          requestInfo && (Constants.STATUS_TO_SHOW_APPROVER.includes(requestInfo.processStatusId )) ?
            <>
              <h5>Thông tin phê duyệt</h5>
              <ApproverDetailComponent title={t("Approver")} approver={this.props.leaveOfAbsence.approver} status={requestInfo ? requestInfo.processStatusId : ""} hrComment={this.props.leaveOfAbsence.requestInfo.approverComment} />
            </> : null
        }

        {
          this.props.leaveOfAbsence.requestDocuments.length > 0 ?
            <>
              <h5>{t("Evidence")}</h5>
              <ul className="list-inline">
                {this.props.leaveOfAbsence.requestDocuments.map((file, index) => {
                  return <li className="list-inline-item" key={index}>
                    <a className="file-name" href={file.fileUrl} title={file.fileName} target="_blank" download={file.fileName}>{file.fileName}</a>
                  </li>
                })}
              </ul>
            </>
            : null
        }
        <div className="block-status">
          <span className={`status ${Constants.mappingStatus[requestInfo.processStatusId].className}`}>{(this.props.action == "consent" && requestInfo.processStatusId == 5 && appraiser) ? t(Constants.mappingStatus[6].label) : t(Constants.mappingStatus[requestInfo.processStatusId].label)}</span>
        </div>
        {requestInfo && (requestInfo.processStatusId === 8 || (this.props.action != "consent" && requestInfo.processStatusId === 5) || requestInfo.processStatusId === 2 ) ? <DetailButtonComponent dataToSap={
          // [{
          // MYVP_ID: 'ABS' + '0'.repeat(9 - this.props.leaveOfAbsence.id.toString().length) + this.props.leaveOfAbsence.id,
          // PERNR: userProfileInfo.user ? userProfileInfo.user.employeeNo : "",
          // BEGDA: moment(userProfileInfo.startDate, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
          // ENDDA: moment(userProfileInfo.endDate, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
          // SUBTY: userProfileInfo.absenceType ? userProfileInfo.absenceType.value : "",
          // BEGUZ: userProfileInfo.startTime ? moment(userProfileInfo.startTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null,
          // ENDUZ: userProfileInfo.endTime ? moment(userProfileInfo.endTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null,
          // ACTIO: 'INS'
          // }]
          [
            {
              "id": this.props.leaveOfAbsence.id,
              "requestTypeId":2,
              "sub": [
                {
                  "id": requestInfo.id,
                }
              ]
            }
          ]
        }
          isShowRevocationOfApproval={requestInfo.processStatusId === Constants.STATUS_APPROVED}
          isShowConsent = {requestInfo.processStatusId === Constants.STATUS_WAITING_CONSENTED}
          isShowRevocationOfConsent = {requestInfo.processStatusId === Constants.STATUS_WAITING && this.props.leaveOfAbsence.appraiser}
          id={this.props.leaveOfAbsence.id}
          urlName={'requestabsence'}
          requestTypeId={requestTypeId}
          action={this.props.action}
        /> : null}
      </div>
    )
  }
}

export default withTranslation()(LeaveOfAbsenceDetailComponent)
