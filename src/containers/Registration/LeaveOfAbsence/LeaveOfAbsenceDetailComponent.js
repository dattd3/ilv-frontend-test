import React from 'react'
import moment from 'moment'
import { withTranslation } from "react-i18next"
import axios from 'axios'
import _ from 'lodash'
import { getRequestTypeIdsAllowedToReApproval, getRequestConfigurations } from "../../../commons/Utils"
import DetailButtonComponent from '../DetailButtonComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'
import RequestProcessing from '../RequestProcessing'
import StatusModal from '../../../components/Common/StatusModal'
import Constants from '../.../../../../commons/Constants'
import { getOperationType } from 'containers/Utils/Common'
import { FOREIGN_SICK_LEAVE, MARRIAGE_FUNERAL_LEAVE_KEY, VIN_UNI_SICK_LEAVE, VIN_SCHOOL_SICK_LEAVE } from 'containers/Task/Constants'

const TIME_FORMAT = 'HH:mm'

const RegisteredLeaveInfo = ({ leaveOfAbsence, t, annualLeaveSummary }) => {

  const formatDayUnitByValue = (val) => {
    if (Number(val) > 1) {
      return t("DayMultiplicity")
    }

    return t("Day")
  }
  return (
    <div className='registered-leave-info'>
      <h5 className='content-page-header'>{t("InformationOnRegisteredLeave")}</h5>
      <div className="box shadow">
        {
          (leaveOfAbsence?.requestInfoOld && leaveOfAbsence?.requestInfoOld?.length > 0 ? leaveOfAbsence?.requestInfoOld : leaveOfAbsence?.requestInfo).map((info, infoIndex) => {
            let isForeignSickLeave = info?.absenceType?.value === FOREIGN_SICK_LEAVE
            let isVinUniSickLeave = info?.absenceType?.value === VIN_UNI_SICK_LEAVE
            let isVinSchoolSickLeave = info?.absenceType?.value === VIN_SCHOOL_SICK_LEAVE

            return (
              <div className='item' key={`info-${infoIndex}`}>
                {
                  (isForeignSickLeave || isVinUniSickLeave || isVinSchoolSickLeave) ? (
                    <>
                      <div className="row">
                        <div className="col-xl-4">
                          {t("StartDateTime")}
                          <div className="detail">{info ? moment(info?.startDate).format("DD/MM/YYYY") + (info?.startTime ? ' ' + moment(info?.startTime, TIME_FORMAT).locale('en-us').format('HH:mm') : '') : ""}</div>
                        </div>
                        <div className="col-xl-4">
                          {t("EndDateTime")}
                          <div className="detail">{info ? moment(info?.endDate).format("DD/MM/YYYY") + (info?.endTime ? ' ' + moment(info?.endTime, TIME_FORMAT).locale('en-us').format('HH:mm') : '') : ""}</div>
                        </div>
                        <div className="col-xl-4">
                          {t("TotalLeaveTime")}
                          <div className="detail">{( info && info?.days >= 1) ? info?.days + ' ' + formatDayUnitByValue(info?.days || 0) : info?.hours + ' ' + t("Hour")}</div>
                        </div>
                      </div>
                      <div className='row' style={{ marginTop: 15, marginBottom: 5 }}>
                        <div className="col-xl-8">
                          {t("LeaveCategory")}
                          <div className="detail">{info?.absenceType?.label || ""}</div>
                        </div>
                        {
                          isForeignSickLeave
                          ? (
                            <div className="col-xl-4">
                              {t("SickLeaveFundForExpat")}
                              <div className="detail">{`${Number(annualLeaveSummary?.SICK_LEA_EXPAT || 0).toFixed(3)} ${formatDayUnitByValue(annualLeaveSummary?.SICK_LEA_EXPAT || 0)}`}</div>
                            </div>
                          )
                          : isVinUniSickLeave ? (
                            <div className="col-xl-4">
                              {t("SickLeaveFundForVinUni")}
                              <div className="detail">{`${Number(annualLeaveSummary?.SICK_LEA_VUNI || 0).toFixed(3)} ${formatDayUnitByValue(annualLeaveSummary?.SICK_LEA_VUNI || 0)}`}</div>
                            </div>
                          )
                          : (
                            <div className="col-xl-4">
                              {t("SickLeaveFundForVinSchool")}
                              <div className="detail">{`${Number(annualLeaveSummary?.SICK_LEA_VSC || 0).toFixed(3)} ${formatDayUnitByValue(annualLeaveSummary?.SICK_LEA_VSC || 0)}`}</div>
                            </div>
                          )
                        }
                      </div>
                    </>
                  ) : (
                    <>
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
                          <div className="detail">{( info && info?.days >= 1) ? info?.days + ' ' + formatDayUnitByValue(info?.days || 0) : info?.hours + ' ' + t("Hour")}</div>
                        </div>
                        <div className="col-xl-3">
                          {t("LeaveCategory")}
                          <div className="detail">{info && info?.absenceType ? info?.absenceType?.label : ""}</div>
                        </div>
                      </div>
                    </>
                  )
                }

                {(info && info?.absenceType && info?.absenceType?.value === MARRIAGE_FUNERAL_LEAVE_KEY) && 
                <div className="row">
                  <div className="col">
                    {t("MarriageFuneral")}
                    <div className="detail">{info?.absenceType?.label}</div>
                  </div>
                </div>
                }

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
            <label>{(requestInfo && requestInfo.absenceType && requestInfo.absenceType.value === MARRIAGE_FUNERAL_LEAVE_KEY) ? t("MarriageFuneral") : t("LeaveCategory")}</label>
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
          {t("AdvancedAnnualLeave")}
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
      return Constants.mappingStatusRequest[status]?.label;
    } 
    return (this.props.action == "consent" && status == 5 && appraiser) ? Constants.mappingStatusRequest[20].label : Constants.mappingStatusRequest[status]?.label
  }

  formatDayUnitByValue = (val) => {
    const { t } = this.props
    
    if (Number(val) > 1) {
      return t("DayMultiplicity")
    }

    return t("Day")
  }

  render() {
    const { t, action, viewPopup, leaveOfAbsence, lockReload, onHideTaskDetailModal } = this.props
    const userProfileInfo = leaveOfAbsence.user
    const requestTypeId = leaveOfAbsence.requestTypeId
    const requestInfo = leaveOfAbsence.requestInfo[0]
    const appraiser = leaveOfAbsence.appraiser
    const annualLeaveSummary = this.state.annualLeaveSummary
    const requestTypeIdsAllowedToReApproval = getRequestTypeIdsAllowedToReApproval()
    const isShowApprovalButton = requestTypeIdsAllowedToReApproval.includes(requestTypeId) && action === "approval"
    && (requestInfo.processStatusId == Constants.STATUS_WAITING || requestInfo.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL)

    let messageSAP = null
    if (requestInfo?.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL) {
      messageSAP = (leaveOfAbsence?.responseDataFromSAP || [])
      .filter(item => item?.STATUS?.toUpperCase() === 'E' && item?.MESSAGE)
      .map(item => item?.MESSAGE)
    }

    const newItem = [...requestInfo?.newItem]
    const requestInfoToShow = [_.omit(requestInfo, ['newItem']) || [], ...newItem || []]
    const requestedTime = (requestInfoToShow || []).reduce((initial, current) => {
      initial.totalHours += current?.hours || 0
      initial.totalDays += current?.days || 0
      return initial
    }, {totalHours: 0, totalDays: 0})
    const totalRequestedTime = requestInfo?.isAllDay ? `${requestedTime?.totalDays} ${this.formatDayUnitByValue(requestedTime?.totalDays || 0)}` : `${requestedTime?.totalHours} ${t("Hour")}`

    // BE confirm với loại yêu cầu Đăng ký nghỉ hoặc Công tác đào tạo thì lấy trong requestInfo (trừ ngày tạo)
    const timeProcessing = {
      createDate: leaveOfAbsence?.createDate,
      assessedDate: requestInfo?.assessedDate,
      approvedDate: requestInfo?.approvedDate,
      updatedDate: requestInfo?.updatedDate,
      deletedDate: requestInfo?.deletedDate,
    }
    const operationType = getOperationType(requestTypeId, requestInfo.actionType, leaveOfAbsence.processStatusId)

    return (
      <div className="leave-of-absence">
        <LeaveUserInfo userProfileInfo={userProfileInfo} annualLeaveSummary={annualLeaveSummary} t={t} viewPopup={viewPopup} />
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        { leaveOfAbsence?.requestInfoOld && leaveOfAbsence?.requestInfoOld?.length > 0 
          ? 
          <>
            <RegisteredLeaveInfo leaveOfAbsence={leaveOfAbsence} t={t} annualLeaveSummary={annualLeaveSummary} />
            <h5 className='content-page-header'>{t(Constants.mappingActionType[requestInfo.actionType].TitleLeave)}</h5>
            <AdjustmentLeaveInfo requestInfoToShow={requestInfoToShow} requestInfo={requestInfo} totalRequestedTime={totalRequestedTime} t={t} annualLeaveSummary={annualLeaveSummary} />
          </>
          : <RegisteredLeaveInfo leaveOfAbsence={leaveOfAbsence} t={t} annualLeaveSummary={annualLeaveSummary} />
        }

        {
          appraiser?.fullName && (
            <>
              <h5 className='content-page-header'>{t("ConsenterInformation")}</h5>
              <ApproverDetailComponent 
                title={t("Consenter")}
                manager={leaveOfAbsence.appraiser}
                status={requestInfo ? requestInfo.processStatusId : ""}
                hrComment={requestInfo.appraiserComment}
                isApprover={false} />
            </>
          )
        }

        {
          leaveOfAbsence?.approver?.fullName && (
            <>
              <h5 className='content-page-header'>{t("ApproverInformation")}</h5>
              <ApproverDetailComponent
                title={t("Approver")}
                manager={leaveOfAbsence.approver}
                status={requestInfo ? requestInfo.processStatusId : ""}
                hrComment={requestInfo.approverComment}
                isApprover={true} />
            </>
          )
        }

        <RequestProcessing {...timeProcessing} operationType={operationType} />

        { leaveOfAbsence.requestDocuments.length > 0 && <Attachment leaveOfAbsence={leaveOfAbsence} t={t} /> }

        <div className="block-status">
          <span className={`status ${Constants.mappingStatusRequest[requestInfo.processStatusId]?.className}`}>{t(this.showStatus(requestInfo?.processStatusId, appraiser))}</span>
          { requestInfo?.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && messageSAP && 
            <div className={`d-flex status fail`}>
              <i className="fas fa-times pr-2 text-danger align-self-center"></i>
              <div>
                {messageSAP.map((msg, index) => {
                  return <div key={index}>{msg}</div>
                })}
              </div>
            </div>
          }
          {/* leaveOfAbsence?.comment && <span className='cancellation-reason'>{ leaveOfAbsence?.comment }</span> */} {/* comment -> lý do hủy từ api */}
        </div>

        {
          (
            requestInfo.processStatusId === Constants.STATUS_WAITING_CONSENTED 
            || (action != "consent" && requestInfo.processStatusId === Constants.STATUS_WAITING) 
            || requestInfo.processStatusId === Constants.STATUS_APPROVED 
            || (action === "approval" && requestInfo.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && requestTypeIdsAllowedToReApproval.includes(requestTypeId))
          )
          ? 
          <DetailButtonComponent 
            dataToSap={
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
            isShowApproval={isShowApprovalButton}
            isShowConsent = {requestInfo?.processStatusId == Constants.STATUS_WAITING_CONSENTED}
            isShowRevocationOfConsent = {requestInfo.processStatusId === Constants.STATUS_WAITING && leaveOfAbsence.appraiser}
            id={leaveOfAbsence.id}
            urlName={'requestabsence'}
            requestTypeId={requestTypeId}
            action={action}
            lockReload={lockReload}
            onHideTaskDetailModal={onHideTaskDetailModal}
          />
          : null
        }
      </div>
    )
  }
}

export default withTranslation()(LeaveOfAbsenceDetailComponent)
