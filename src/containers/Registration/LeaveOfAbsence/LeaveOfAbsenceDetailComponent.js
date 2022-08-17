import React, { Fragment } from 'react'
import moment from 'moment'
import { withTranslation } from "react-i18next"
import axios from 'axios'
import _ from 'lodash'
import { getRequestTypeIdsAllowedToReApproval, getRequestConfigurations } from "../../../commons/Utils"
import DetailButtonComponent from '../DetailButtonComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'
import StatusModal from '../../../components/Common/StatusModal'
import Constants from '../.../../../../commons/Constants'

const TIME_FORMAT = 'HH:mm'
const DATE_FORMAT = 'DD/MM/YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'
const TIME_OF_SAP_FORMAT = 'HHmm00'
const FULL_DAY = true

const RegisteredLeaveInfo = ({ leaveOfAbsence, t }) => {
  return (
    <div className='registered-leave-info'>
      <h5 className='content-page-header'>{'Thông tin đã đăng ký nghỉ'}</h5>
      <div className="box shadow">
        {
          (leaveOfAbsence?.requestInfoOld && leaveOfAbsence?.requestInfoOld?.length > 0 ? leaveOfAbsence?.requestInfoOld : leaveOfAbsence?.requestInfo).map((info, infoIndex) => {
            return (
              <div className='item' key={`info-${infoIndex}`}>
                <div className="row">
                  <div className="col-xl-3">
                    {t("StartDateTime")}
                    <div className="detail">{info ? moment(info?.startDate).format("DD/MM/YYYY") + (info?.startTime ? ' ' + moment(info?.startTime, TIME_FORMAT).locale('en-us').format('HH:mm') : '') : ""}</div>
                  </div>
                  <div className="col-xl-3">
                    {t("EndDateTime")}
                    <div className="detail">{info ? moment(info?.endDate).format("DD/MM/YYYY") + (info?.endTime ? ' ' + moment(info?.endTime, TIME_FORMAT).locale('en-us').format('HH:mm') : '') : ""}</div>
                  </div>
                  <div className="col-xl-3">
                    {t("TotalLeaveTime")}
                    {/* <div className="detail">{ requestInfo && requestInfo.days && requestInfo.absenceType.value != "PQ02" ? requestInfo.days + ' ngày' : null } { requestInfo && requestInfo.hours  && requestInfo.absenceType.value == "PQ02" ? requestInfo.hours  + ' giờ' : null}</div> */}
                    <div className="detail">{( info && info?.days >= 1) ? info?.days + ' ' + t("Day") : info?.hours + ' ' + t("Hour")}</div>
                  </div>
                  <div className="col-xl-3">
                    {t("LeaveCategory")}
                    <div className="detail">{info && info?.absenceType ? info?.absenceType?.label : ""}</div>
                  </div>
                </div>
                {(info && info?.absenceType && info?.absenceType?.value === 'PN03') ? <div className="row">
                  <div className="col">
                    {t("MarriageFuneral")}
                    <div className="detail">{info?.absenceType?.label}</div>
                  </div>
                </div> : null}
                <div className="row">
                  <div className="col" style={{marginTop: 10}}>
                    {t(Constants.mappingActionType[info.actionType]?.ReasonRequestLeave)}
                    <div className="detail">{info ? info?.comment : ""}</div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

const AdjustmentLeaveInfo = ({ requestInfoToShow, requestInfo, totalRequestedTime, t }) => {
  return (
    <div className="box shadow cbnv">
      {
        (requestInfoToShow || []).map((requestItem, requestItemIndex) => {
          return (
            <div className='time-info' key={`request-item-${requestItemIndex}`}>
              <div className="row">
                <div className="col-xl-3">
                  {t("StartDate")}
                  <div className="detail adjustment">{requestItem?.startDate ? moment(requestItem?.startDate).format("DD/MM/YYYY") : ""}</div>
                </div>
                <div className="col-xl-3">
                  {t("StartHour")}
                  <div className="detail adjustment">{requestItem?.startTime ? moment(requestItem.startTime, TIME_FORMAT).locale('en-us').format('HH:mm') : ''}</div>
                </div>
                <div className="col-xl-3">
                  {t("EndDate")}
                  <div className="detail adjustment">{requestItem?.endDate ? moment(requestItem.endDate).format("DD/MM/YYYY") : ""}</div>
                </div>
                <div className="col-xl-3">
                  {t("Endtime")}
                  <div className="detail adjustment">{requestItem.endTime ? moment(requestItem.endTime, TIME_FORMAT).locale('en-us').format('HH:mm') : ''}</div>
                </div>
              </div>
            </div>
          )
        })
      }
      <div className='other-info'>
        <div className='row'>
          <div className="col-md-6">
            <label>{(requestInfo && requestInfo.absenceType && requestInfo.absenceType.value === 'PN03') ? t("MarriageFuneral") : t("LeaveCategory")}</label>
            <div className="detail adjustment">{requestInfo && requestInfo?.absenceType ? requestInfo.absenceType?.label : ""}</div>
          </div>
          <div className="col-md-6">
            <label>{t("TotalLeaveTime")}</label>
            <div className="detail adjustment">{totalRequestedTime}</div>
          </div>
          <div className='col-md-12 reason-block'>
            <label>{t(Constants.mappingActionType[requestInfo.actionType].ReasonRequestLeave)}</label>
            <div className="detail adjustment">{requestInfo ? requestInfo?.comment : ""}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const LeaveUserInfo = ({ userProfileInfo, annualLeaveSummary, viewPopup, t }) => {
  return (
    <>
    <h5 className='content-page-header'>{t("EmployeeInfomation")}</h5>
    <div className="box shadow cbnv">
      <div className="row group">
        <div className={`${viewPopup ? 'col-xl-4' : 'col-xl-2'}`}>
          {t("FullName")}
          <div className="detail">{userProfileInfo? userProfileInfo.fullName : ""}</div>
        </div>
        <div className={`${viewPopup ? 'col-xl-4' : 'col-xl-2'}`}>
          {t("EmployeeNo")}
          <div className="detail">{userProfileInfo ? userProfileInfo.employeeNo : ""}</div>
        </div>
        <div className={`${viewPopup ? 'col-xl-4' : 'col-xl-3'}`}>
          {t("Title")}
          <div className="detail">{userProfileInfo ? userProfileInfo.jobTitle : ""}</div>
        </div>
        <div className={`${viewPopup ? 'col-xl-12 view-popup' : 'col-xl-5'}`}>
          {t('DepartmentManage')}
          <div className="detail">{userProfileInfo ? userProfileInfo.department : ""}</div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-xl-2">
          {t("LeaveBalance")}
          <div className="detail">{annualLeaveSummary && annualLeaveSummary.DAY_LEA_REMAIN ? _.ceil(annualLeaveSummary.DAY_LEA_REMAIN, 2) : null}</div>
        </div>
        <div className="col-xl-3">
          {t("LeavesThisYear")}
          <div className="detail">{annualLeaveSummary && annualLeaveSummary.DAY_LEA ? _.ceil(annualLeaveSummary.DAY_LEA, 2) : null}</div>
        </div>
        <div className="col-xl-3">
          {t("AdvancecdAnnualLeave")}
          <div className="detail">{annualLeaveSummary && annualLeaveSummary.DAY_ADV_LEA ? _.ceil(annualLeaveSummary.DAY_ADV_LEA, 2) : null}</div>
        </div>
        <div className="col-xl-4">
          <div className="row">
            <div className="col-xl-6">
              {t("ToilHoursBalance")}
              <div className="detail">{annualLeaveSummary && annualLeaveSummary.HOUR_TIME_OFF_REMAIN ? _.ceil(annualLeaveSummary.HOUR_TIME_OFF_REMAIN, 2) : null}</div>
            </div>
            <div className="col-xl-6">
              {t("ToilHours")}
              <div className="detail">{annualLeaveSummary && annualLeaveSummary.HOUR_COMP ? _.ceil(annualLeaveSummary.HOUR_COMP, 2) : null}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

const Attachment = ({ leaveOfAbsence, t }) => {
  return (
    <>
      <h5 className='content-page-header'>{t("Evidence")}</h5>
      <ul className="list-inline">
        {leaveOfAbsence.requestDocuments.map((file, index) => {
          return <li className="list-inline-item" key={index}>
            <a className="file-name" href={file.fileUrl} title={file.fileName} target="_blank" download={file.fileName}>{file.fileName}</a>
          </li>
        })}
      </ul>
    </>
  )
}

class LeaveOfAbsenceDetailComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isShowStatusModal: false,
      annualLeaveSummary: {}
    }
  }

  componentDidMount() {
    this.processAbsenceData()
  }

  processAbsenceData = async () => {
    const { leaveOfAbsence } = this.props
    if (leaveOfAbsence && leaveOfAbsence.id) {
      const config = getRequestConfigurations()
      config.params = {
        id: leaveOfAbsence.id
      }
      try {
        const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}user/employee/currentabsence`, config)
        if (response && response.data) {
          const result = response.data.result
          if (result && result.code == Constants.API_SUCCESS_CODE) {
            const annualLeaveSummary = response.data.data || {}
            this.setState({ annualLeaveSummary: annualLeaveSummary })
          }
        }
      } catch (e) {}
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

  showStatus = (status, appraiser) => {
    if (this.getTypeDetail() == 'request' && this.props.action == undefined) {
      return Constants.mappingStatusRequest[status].label;
    } 
    return (this.props.action == "consent" && status == 5 && appraiser) ? Constants.mappingStatusRequest[20].label : Constants.mappingStatusRequest[status].label
  }

  render() {
    const { t, action, viewPopup, leaveOfAbsence } = this.props
    const userProfileInfo = leaveOfAbsence.user
    const requestTypeId = leaveOfAbsence.requestTypeId
    const requestInfo = leaveOfAbsence.requestInfo[0]
    const appraiser = leaveOfAbsence.appraiser
    const annualLeaveSummary = this.state.annualLeaveSummary
    const requestTypeIdsAllowedToReApproval = getRequestTypeIdsAllowedToReApproval()
    const isShowApproval = (requestInfo.processStatusId === Constants.STATUS_WAITING) || (action === "approval" && requestInfo.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && requestTypeIdsAllowedToReApproval.includes(requestTypeId))
    
    let messageSAP = null;
    if (leaveOfAbsence.processStatusId === Constants.STATUS_PARTIALLY_SUCCESSFUL)
    {
      if (leaveOfAbsence.responseDataFromSAP && Array.isArray(leaveOfAbsence.responseDataFromSAP)) {
        const data = leaveOfAbsence.responseDataFromSAP.filter(val => val.STATUS === 'E');
        if (data) {
          const temp = data.map(val => val?.MESSAGE);
          messageSAP = temp.filter(function(item, pos) {
            return temp.indexOf(item) === pos;
          })
        }
      }
    }

    let isShowAppraisalInfo = false
    if (appraiser && Object.values(appraiser).some(item => item !== null && item !== '')
      && requestInfo && Constants.STATUS_TO_SHOW_CONSENTER.includes(requestInfo.processStatusId)) {
      isShowAppraisalInfo = true
    }

    const newItem = [...requestInfo?.newItem]
    const requestInfoToShow = [_.omit(requestInfo, ['newItem']) || [], ...newItem || []]
    const requestedTime = (requestInfoToShow || []).reduce((initial, current) => {
      initial.totalHours += current?.hours || 0
      initial.totalDays += current?.days || 0
      return initial
    }, {totalHours: 0, totalDays: 0})
    const totalRequestedTime = requestInfo?.isAllDay ? `${requestedTime?.totalDays} ${t("Day")}`  : `${requestedTime?.totalHours} ${t("Hour")}`

    return (
      <div className="leave-of-absence">
        <LeaveUserInfo userProfileInfo={userProfileInfo} annualLeaveSummary={annualLeaveSummary} t={t} viewPopup={viewPopup} />
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        { leaveOfAbsence?.requestInfoOld && leaveOfAbsence?.requestInfoOld?.length > 0 
          ? 
          <>
            <RegisteredLeaveInfo leaveOfAbsence={leaveOfAbsence} t={t} />
            <h5 className='content-page-header'>{t(Constants.mappingActionType[requestInfo.actionType].TitleLeave)}</h5>
            <AdjustmentLeaveInfo requestInfoToShow={requestInfoToShow} requestInfo={requestInfo} totalRequestedTime={totalRequestedTime} t={t} />
          </>
          : <RegisteredLeaveInfo leaveOfAbsence={leaveOfAbsence} t={t} />
        }

        {
          isShowAppraisalInfo && 
          <>
            <h5 className='content-page-header'>{t("ConsenterInformation")}</h5>
            <ApproverDetailComponent title={t("Consenter")} approver={leaveOfAbsence.appraiser} status={requestInfo ? requestInfo.processStatusId : ""} hrComment={requestInfo.appraiserComment} />
          </>
        }

        {
          // this.getTypeDetail() === "request" ?
          requestInfo && (Constants.STATUS_TO_SHOW_APPROVER.includes(requestInfo.processStatusId )) ?
            <>
              <h5 className='content-page-header'>{t("ApproverInformation")}</h5>
              <ApproverDetailComponent title={t("Approver")} approver={leaveOfAbsence.approver} status={requestInfo ? requestInfo.processStatusId : ""} hrComment={requestInfo.approverComment} />
            </> : null
        }

        { leaveOfAbsence.requestDocuments.length > 0 && <Attachment leaveOfAbsence={leaveOfAbsence} t={t} /> }

        <div className="block-status">
          <span className={`status ${Constants.mappingStatusRequest[requestInfo.processStatusId].className}`}>{t(this.showStatus(requestInfo.processStatusId, appraiser))}</span>
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
          requestInfo && (requestInfo.processStatusId === 8 || (action != "consent" && requestInfo.processStatusId === 5) || requestInfo.processStatusId === 2 || 
          (action === "approval" && requestInfo.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && requestTypeIdsAllowedToReApproval.includes(requestTypeId))) 
          ? 
          <DetailButtonComponent dataToSap={
            [
              {
                "id": leaveOfAbsence.id,
                "requestTypeId":2,
                "sub": [
                  {
                    "id": requestInfo.id,
                  }
                ]
              }
            ]
          }
            isShowRevocationOfApproval={requestInfo.processStatusId === Constants.STATUS_APPROVED && (requestInfo.actionType == "INS" || requestInfo.actionType == "MOD")}
            isShowApproval={isShowApproval}
            isShowConsent = {requestInfo.processStatusId === Constants.STATUS_WAITING_CONSENTED}
            isShowRevocationOfConsent = {requestInfo.processStatusId === Constants.STATUS_WAITING && leaveOfAbsence.appraiser}
            id={leaveOfAbsence.id}
            urlName={'requestabsence'}
            requestTypeId={requestTypeId}
            action={action}
          />
          : null
        }
      </div>
    )
  }
}

export default withTranslation()(LeaveOfAbsenceDetailComponent)
