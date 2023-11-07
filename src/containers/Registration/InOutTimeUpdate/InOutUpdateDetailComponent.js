import React from 'react'
import moment from 'moment'
import { withTranslation } from "react-i18next"
import DetailButtonComponent from '../DetailButtonComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'
import RequestProcessing from '../RequestProcessing'
import Constants from '../.../../../../commons/Constants'
import { getRequestTypeIdsAllowedToReApproval } from "../../../commons/Utils"
import { getOperationType } from 'containers/Utils/Common'
import IconClock from 'assets/img/icon/ic_clock.svg'

const TIME_FORMAT = 'HH:mm:ss'
const DATE_FORMAT = 'DD-MM-YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'
const TIME_OF_SAP_FORMAT = 'HHmm00'

class InOutUpdateDetailComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
    }
  }

  getTypeDetail = () => {
    const pathName = window.location.pathname;
    const pathNameArr = pathName.split('/');
    return pathNameArr[pathNameArr.length - 1];
  }

  dataToSap() {
    let dataToSAP = []
    this.props.inOutTimeUpdate.requestInfo.timesheet.filter(t => t.isEdit).forEach((timesheet, index) => {
      ['1', '2'].forEach(n => {
        const startTimeName = `start_time${n}_fact_update`
        const endTimeName = `end_time${n}_fact_update`
        const startTimeNameOld = `start_time${n}_fact`
        const endTimeNameOld = `end_time${n}_fact`
        const startPlanTimeName = `from_time${n}`
        const endPlanTimeName = `to_time${n}`
        if (!timesheet[startTimeName] && !timesheet[endTimeName]) return
        if (true) {
          let startTime = timesheet[startTimeName] ? moment(timesheet[startTimeName], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : (!this.isNullCustomize(timesheet[startTimeNameOld]) ? moment(timesheet[startTimeNameOld], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null)
          if (startTime) {
            dataToSAP.push({
              MYVP_ID: 'TEV' + '0'.repeat(7 - this.props.inOutTimeUpdate.id.toString().length) + this.props.inOutTimeUpdate.id + `${index}${n}`,
              PERNR: this.props.inOutTimeUpdate.user.employeeNo,
              LDATE: moment(timesheet.date, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
              SATZA: 'P10',
              LTIME: startTime,
              DALLF: '+',
              ACTIO: 'INS'
            })
          }
        }

        if (true) {
          let endTime = timesheet[endTimeName] ? moment(timesheet[endTimeName], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : (!this.isNullCustomize(timesheet[endTimeNameOld]) ? moment(timesheet[endTimeNameOld], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null)
          if (endTime) {
            dataToSAP.push({
              MYVP_ID: 'TEV' + '0'.repeat(7 - this.props.inOutTimeUpdate.id.toString().length) + this.props.inOutTimeUpdate.id + `${index}${n}`,
              PERNR: this.props.inOutTimeUpdate.user.employeeNo,
              LDATE: moment(timesheet.date, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
              SATZA: 'P20',
              LTIME: endTime,
              DALLF: endTime > timesheet[startPlanTimeName] ? '+' : '-',
              ACTIO: 'INS'
            })
          }
        }
      })
    })
    return dataToSAP
  }

  isNullCustomize = value => {
    return (value == null || value == "null" || value == "" || value == undefined || value == 0 || value == "#") ? true : false
  }

  formatData = value => {
    return (value == null || value == "null" || value == "" || value == undefined || value == 0 || value == "#") ? "" : value
  }

  printTimeFormat = value => {
    return !this.isNullCustomize(value) && moment(this.formatData(value), "hhmmss").isValid() ? moment(this.formatData(value), "HHmmss").format("HH:mm:ss") : "" // pending by CuongNV56
  }

  showStatus = (status, appraiser) => {
    if (this.getTypeDetail() == 'request' && this.props.action == undefined) {
      return Constants.mappingStatusRequest[status].label;
    } 
    return (this.props.action == "consent" && status == 5 && appraiser) ? Constants.mappingStatusRequest[20].label : Constants.mappingStatusRequest[status].label
  }

  render() {
    const { t, action, inOutTimeUpdate, lockReload, onHideTaskDetailModal } = this.props
    const requestTypeIdsAllowedToReApproval = getRequestTypeIdsAllowedToReApproval()
    const isShowApproval = requestTypeIdsAllowedToReApproval.includes(inOutTimeUpdate.requestTypeId) && action === "approval" 
    && (inOutTimeUpdate.processStatusId == Constants.STATUS_WAITING || inOutTimeUpdate.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL)
    
    let messageSAP = null;
    if (inOutTimeUpdate.processStatusId === Constants.STATUS_PARTIALLY_SUCCESSFUL)
    {
      if (inOutTimeUpdate.responseDataFromSAP && Array.isArray(inOutTimeUpdate.responseDataFromSAP)) {
        const data = inOutTimeUpdate.responseDataFromSAP.filter(val => val.STATUS === 'E');
        if (data) {
          const temp = data.map(val => val?.MESSAGE);
          messageSAP = temp.filter(function(item, pos) {
            return temp.indexOf(item) === pos;
          })
        }
      }
    }

    let isShowAppraisalInfo = false
    if (inOutTimeUpdate && inOutTimeUpdate.appraiser && Object.values(inOutTimeUpdate.appraiser).some(item => item !== null && item !== '')) {
      isShowAppraisalInfo = true
    }

    const timeProcessing = {
      createDate: inOutTimeUpdate?.createDate,
      assessedDate: inOutTimeUpdate?.assessedDate,
      approvedDate: inOutTimeUpdate?.approvedDate,
      updatedDate: inOutTimeUpdate?.updatedDate,
      deletedDate: inOutTimeUpdate?.deletedDate,
    }
    // Operation type for in/out always is INS right now
    const operationType = getOperationType(inOutTimeUpdate.requestTypeId, inOutTimeUpdate.updateField, inOutTimeUpdate.processStatusId)

    return (
      <div className="leave-of-absence in-out-update-detail">
        <h5 className="content-page-header">{t("EmployeeInfomation")}</h5>
        <div className="box shadow cbnv">
          <div className="row group">
            <div className="col-xl-3">
             {t("FullName")}
              <div className="detail auto-height">{inOutTimeUpdate.user.fullName}</div>
            </div>
            <div className="col-xl-3">
              {t("EmployeeNo")}
              <div className="detail auto-height">{inOutTimeUpdate.user.employeeNo}</div>
            </div>
            <div className="col-xl-3">
              {t("Title")}
              <div className="detail auto-height">{inOutTimeUpdate.user.jobTitle}</div>
            </div>
            <div className="col-xl-3">
              {t("DepartmentManage")}
              <div className="detail auto-height">{inOutTimeUpdate.user.department}</div>
            </div>
          </div>
        </div>
        <h5 className="content-page-header">{t("InOutChangeRequestInfo")}</h5>
        {inOutTimeUpdate.requestInfo.filter(t => t.isEdited).map((timesheet, index) => {
          return <div className="box shadow" key={index}>
            <div className="d-flex align-items-center"><p><img src={IconClock} alt="Clock" className="ic-clock" /><b style={{ marginLeft: 5, textTransform: 'capitalize' }}>{t("Day")} {moment(timesheet.date).format("DD/MM/YYYY")}</b></p></div>
            <div className="row">
              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">{t('ActualTime')}</p>
                  <div className="row">
                    <div className="col-6">
                      {t("Start")} 1: <b>{this.printTimeFormat(timesheet.start_time1_fact)}</b>
                    </div>
                    <div className="col-6 text-right">
                      {t("End")} 1: <b>{this.printTimeFormat(timesheet.end_time1_fact)}</b>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      {t("Start")} 2: <b>{this.printTimeFormat(timesheet.start_time2_fact)}</b>
                    </div>
                    <div className="col-6 text-right">
                      {t("End")} 2: <b>{this.printTimeFormat(timesheet.end_time2_fact)}</b>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">{t("ChangedTime")}</p>
                  <div className="row">
                    <div className="col-6">
                      {t("Start")} 1: <b>{this.printTimeFormat(timesheet.start_time1_fact_update)}</b>
                    </div>
                    <div className="col-6 text-right">
                      {t("End")} 1: <b>{this.printTimeFormat(timesheet.end_time1_fact_update)}</b>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      {t("Start")} 2: <b>{this.printTimeFormat(timesheet.start_time2_fact_update)}</b>
                    </div>
                    <div className="col-6 text-right">
                      {t("End")} 2: <b>{this.printTimeFormat(timesheet.end_time2_fact_update)}</b>
                    </div>
                  </div>
                  <div className='previous-day-selection'>
                    <input type="checkbox" checked={timesheet?.isPrevDay || false} readOnly />
                    <label>{t("PreviousDay")}</label>
                  </div>
                </div>
              </div>
            </div>
            <p>{t('ReasonModifyInOut')}</p>
            <div className="row">
              <div className="col">
                <div className="detail">{timesheet.note || ""}</div>
              </div>
            </div>
          </div>
        })}

        {
          inOutTimeUpdate?.appraiser?.fullName && (
            <>
              <h5 className="content-page-header">{t("ConsenterInformation")}</h5>
              <ApproverDetailComponent
                title={t("Consenter")}
                manager={inOutTimeUpdate.appraiser}
                status={inOutTimeUpdate.requestInfo ? inOutTimeUpdate.processStatusId : ""}
                hrComment={inOutTimeUpdate.appraiserComment}
                isApprover={false} />
            </>
          )
        }
        
        {
          inOutTimeUpdate?.approver?.fullName && (
            <>
              <h5 className="content-page-header">{t("ApproverInformation")}</h5>
              <ApproverDetailComponent
                title={t("Approver")}
                manager={inOutTimeUpdate.approver}
                status={inOutTimeUpdate.processStatusId}
                hrComment={inOutTimeUpdate.approverComment}
                isApprover={true} />
            </>
          )
        }

        <RequestProcessing {...timeProcessing} operationType={operationType} />

        {
          inOutTimeUpdate.requestDocuments.length > 0 ?
            <>
              <h5>{t("Evidence")}</h5>
              <ul className="list-inline">
                {inOutTimeUpdate.requestDocuments.map((file, index) => {
                  return <li className="list-inline-item" key={index}>
                    <a className="file-name" href={file.fileUrl} title={file.fileName} target="_blank" download={file.fileName}>{file.fileName}</a>
                  </li>
                })}
              </ul>
            </>
            : null
        }
        <div className="block-status">
          <span className={`status ${Constants.mappingStatusRequest[inOutTimeUpdate.processStatusId].className}`}>{t(this.showStatus(inOutTimeUpdate.processStatusId, inOutTimeUpdate.appraiser))}</span>
          { inOutTimeUpdate?.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && messageSAP && 
            <div className={`d-flex status fail`}>
              <i className="fas fa-times pr-2 text-danger align-self-center"></i>
              <div>
                {messageSAP.map((msg, index) => {
                  return <div key={index}>{msg}</div>
                })}
              </div>
            </div>
          }
          {/* inOutTimeUpdate?.comment && <span className='cancellation-reason'>{ inOutTimeUpdate?.comment }</span> */} {/* comment -> lý do hủy từ api */}
        </div>
        {
          inOutTimeUpdate 
          && (inOutTimeUpdate.processStatusId === 8 || (action != "consent" && inOutTimeUpdate.processStatusId === 5) || inOutTimeUpdate.processStatusId === 2 
              || (action === "approval" && inOutTimeUpdate.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && requestTypeIdsAllowedToReApproval.includes(inOutTimeUpdate.requestTypeId))) 
          ? 
          <DetailButtonComponent
            dataToSap={
              [
                {
                  "id": inOutTimeUpdate.id,
                  "requestTypeId": Constants.IN_OUT_TIME_UPDATE,
                  "sub": [
                    {
                      "id": inOutTimeUpdate.id,
                    }
                  ]
                }
              ]
            } //this.dataToSap()
            id={inOutTimeUpdate.id}
            isShowApproval={isShowApproval}
            isShowRevocationOfApproval={inOutTimeUpdate.processStatusId === Constants.STATUS_APPROVED}
            isShowConsent = {inOutTimeUpdate.processStatusId === Constants.STATUS_WAITING_CONSENTED}
            isShowRevocationOfConsent = {inOutTimeUpdate.processStatusId === Constants.STATUS_WAITING && inOutTimeUpdate.appraiser}
            urlName={'requesttimekeeping'}
            requestTypeId={inOutTimeUpdate.requestTypeId}
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

export default withTranslation()(InOutUpdateDetailComponent)
