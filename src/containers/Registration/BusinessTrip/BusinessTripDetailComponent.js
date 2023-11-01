import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from "react-i18next"
import DetailButtonComponent from '../DetailButtonComponent'
import RequesterDetailComponent from '../RequesterDetailComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'
import RequestProcessing from '../RequestProcessing'
import StatusModal from '../../../components/Common/StatusModal'
import Constants from '../.../../../../commons/Constants'
import { getRequestTypeIdsAllowedToReApproval } from "../../../commons/Utils"
import { getOperationType } from 'containers/Utils/Common'

const TIME_FORMAT = 'HH:mm'
const DATE_FORMAT = 'DD/MM/YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'
const TIME_OF_SAP_FORMAT = 'HHmm00'
const FULL_DAY = 1

const RegisteredBusinessTripInfo = ({ businessTrip, t }) => {
  return (
    <>
      <h5 className='content-page-header'>{t('TitleTripAndTrainning')}</h5>
      <div className="box shadow cbnv">
        {
          (businessTrip?.requestInfoOld && businessTrip?.requestInfoOld?.length > 0 ? businessTrip?.requestInfoOld : businessTrip?.requestInfo).map((info, infoIndex) => {
            return (
              <div className='item' key={`info-${infoIndex}`}>
                <div className="row">
                  <div className="col-xl-4">
                    {t("StartDateTime")}
                    <div className="detail">{moment(info?.startDate).format('DD/MM/YYYY') + (info?.startTime ? ' ' + moment(info?.startTime, TIME_FORMAT).locale('en-us').format('HH:mm') : '')}</div>
                  </div>
                  <div className="col-xl-4">
                    {t("EndDateTime")}
                    <div className="detail">{moment(info?.endDate).format('DD/MM/YYYY') + (info?.endTime ? ' ' + moment(info?.endTime, TIME_FORMAT).locale('en-us').format('HH:mm') : '')}</div>
                  </div>
                  <div className="col-xl-4">
                    {t('TotalTimeForBizTripAndTraining')}
                    <div className="detail">{info?.isAllDay ? info?.days + ' ' + t("Day") : info?.hours + ' ' + t("Hour")}</div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-4">
                    {t('TypeOfBizTripAndTraining')}
                    <div className="detail">{info?.attendanceType?.label || ''}</div>
                  </div>
                  <div className="col-xl-4">
                    {t('Location')}
                    <div className="detail">{info?.location && info?.location?.label || ''}</div>
                  </div>
                  <div className="col-xl-4">
                    {t('MeansOfTransportation')}
                    <div className="detail">{info?.vehicle && info?.vehicle?.label || ''}</div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    {t('ReasonTripAndTrainning')}
                    <div className="detail">{info?.comment || ''}</div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

const AdjustmentBusinessTripInfo = ({ requestInfoToShow, requestInfo, totalRequestedTime, t }) => {
  return (
    <>
      <h5 className='content-page-header'>Thông tin điều chỉnh đăng ký công tác/đào tạo</h5>
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
              <label>{t("TypeOfBizTripAndTraining")}</label>
              <div className="detail adjustment">{requestInfo?.attendanceType?.label || ''}</div>
            </div>
            <div className="col-md-6">
              <label>{t("TotalLeaveTime")}</label>
              <div className="detail adjustment">{totalRequestedTime}</div>
            </div>
            <div className="col-md-6">
              <label>{t("Location")}</label>
              <div className="detail adjustment">{requestInfo?.location?.label || ''}</div>
            </div>
            <div className="col-md-6">
              <label>{t("MeansOfTransportation")}</label>
              <div className="detail adjustment">{requestInfo?.vehicle?.label || ''}</div>
            </div>
            <div className='col-md-12 reason-block'>
              <label>{t("ReasonTripAndTrainning")}</label>
              <div className="detail adjustment">{requestInfo?.comment || ''}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const Attachment = ({ requestDocuments, t }) => {
  return (
    <>
      <h5 className='content-page-header'>{t("Evidence")}</h5>
      <ul className="list-inline">
        {
          (requestDocuments || []).map((file, index) => {
            return (
              <li className="list-inline-item" key={index}>
                <a className="file-name" href={file?.fileUrl} title={file?.fileName} target="_blank" download={file?.fileName}>{file?.fileName}</a>
              </li>
            )
          })
        }
      </ul>
    </>
  )
}

class BusinessTripDetailComponent extends React.Component {
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

  showStatus = (status, appraiser) => {
    if (this.getTypeDetail() == 'request' && this.props.action == undefined) {
      return Constants.mappingStatusRequest[status].label;
    } 
    return (this.props.action == "consent" && status == 5 && appraiser) ? Constants.mappingStatusRequest[20].label : Constants.mappingStatusRequest[status].label
  }

  render() {
    const { t, businessTrip, action, viewPopup } = this.props
    const requestInfo = businessTrip.requestInfo[0]
    const requestTypeId = businessTrip.requestTypeId
    const requestTypeIdsAllowedToReApproval = getRequestTypeIdsAllowedToReApproval()
    const isShowApproval = requestTypeIdsAllowedToReApproval.includes(requestTypeId) && action === "approval" 
    && (requestInfo.processStatusId == Constants.STATUS_WAITING || requestInfo.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL)

    let messageSAP = null;
    if (requestInfo?.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL) {
      messageSAP = (businessTrip?.responseDataFromSAP || [])
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
    const totalRequestedTime = requestInfo?.isAllDay ? `${requestedTime?.totalDays} ${t("Day")}`  : `${requestedTime?.totalHours} ${t("Hour")}`

    // BE confirm với loại yêu cầu Đăng ký nghỉ hoặc Công tác đào tạo thì lấy trong requestInfo (trừ ngày tạo)
    const timeProcessing = {
      createDate: businessTrip?.createDate,
      assessedDate: requestInfo?.assessedDate,
      approvedDate: requestInfo?.approvedDate,
      updatedDate: requestInfo?.updatedDate,
      deletedDate: requestInfo?.deletedDate,
    }
    const operationType = getOperationType(businessTrip.requestTypeId, requestInfo.actionType, businessTrip.processStatusId)

    return (
      <div className="business-trip">
        <h5 className='content-page-header'>{t("EmployeeInfomation")}</h5>
        <RequesterDetailComponent user={businessTrip.user} viewPopup={viewPopup} />
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />

        { businessTrip?.requestInfoOld && businessTrip?.requestInfoOld?.length > 0 
          ? 
          <>
            <RegisteredBusinessTripInfo businessTrip={businessTrip} t={t} />
            <AdjustmentBusinessTripInfo requestInfoToShow={requestInfoToShow|| []} requestInfo={requestInfo} totalRequestedTime={totalRequestedTime} t={t} />
          </>
          : <RegisteredBusinessTripInfo businessTrip={businessTrip} t={t} />
        }

        {
          businessTrip?.appraiser?.fullName && (
            <>
              <h5 className='content-page-header'>{t("ConsenterInformation")}</h5>
              <ApproverDetailComponent
                title={t("Consenter")}
                manager={businessTrip.appraiser}
                status={requestInfo ? requestInfo.processStatusId : ""}
                hrComment={requestInfo.appraiserComment}
                isApprover={false} />
            </>
          )
        }

        {
          businessTrip?.approver?.fullName && (
            <>
              <h5 className='content-page-header'>{t("ApproverInformation")}</h5>
              <ApproverDetailComponent
                title={t("Approver")}
                manager={businessTrip.approver}
                status={requestInfo.processStatusId}
                hrComment={requestInfo.approverComment}
                isApprover={true} />
            </>
          )
        }

        <RequestProcessing {...timeProcessing} operationType={operationType} />

        { businessTrip?.requestDocuments?.length > 0 && <Attachment requestDocuments={businessTrip?.requestDocuments || []} t={t} /> }

        <div className="block-status">
          <span className={`status ${Constants.mappingStatusRequest[requestInfo.processStatusId].className}`}>{t(this.showStatus(requestInfo.processStatusId, businessTrip.appraiser))}</span>
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
          {/* businessTrip?.comment && <span className='cancellation-reason'>{ businessTrip?.comment }</span> */} {/* comment -> lý do hủy từ api */}
        </div>
        {
          requestInfo
          && (requestInfo.processStatusId === 8 || (action != "consent" && requestInfo.processStatusId === 5) || requestInfo.processStatusId === 2 
              || (action === "approval" && requestInfo.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && requestTypeIdsAllowedToReApproval.includes(requestTypeId))) 
          ? 
          <DetailButtonComponent 
            dataToSap={[{
              "id": businessTrip.id,
              "requestTypeId": Constants.BUSINESS_TRIP,
              "sub": [
                {
                  "id": requestInfo.id,
                }
              ]
            }]}
            isShowRevocationOfApproval={requestInfo.processStatusId === Constants.STATUS_APPROVED && (requestInfo.actionType == "INS" || requestInfo.actionType == "MOD")}
            isShowApproval={isShowApproval}
            isShowConsent = {requestInfo.processStatusId === Constants.STATUS_WAITING_CONSENTED}
            isShowRevocationOfConsent = {requestInfo.processStatusId === Constants.STATUS_WAITING && businessTrip.appraiser}
            id={businessTrip.id}
            urlName={'requestattendance'}
            requestTypeId={requestTypeId}
            action={action}
          /> 
          : null
        }
      </div>
    )
  }
}

export default withTranslation()(BusinessTripDetailComponent)
