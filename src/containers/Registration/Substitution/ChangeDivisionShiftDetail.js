import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from "react-i18next"
import DetailButtonComponent from '../DetailButtonComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'
import RequestProcessing from '../RequestProcessing'
import StatusModal from '../../../components/Common/StatusModal'
import Constants from '../.../../../../commons/Constants'
import TableUtil from '../../../components/Common/table'
import CustomPaging from '../../../components/Common/CustomPaging'
import ExcelIcon from "../../../assets/img/excel-icon.svg";
import axios from 'axios'

const TIME_FORMAT = 'HH:mm:00'
const TIME_OF_SAP_FORMAT = 'HHmm00'
const DATE_FORMAT = 'DD-MM-YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'

class ChangeDivisionShiftDetail extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isShowStatusModal: false,
      pageNumber: 1
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

  calTime(start, end) {
    if (start == null || end == null) {
      return ""
    }
    const differenceInMs = moment(end, TIME_FORMAT).diff(moment(start, TIME_FORMAT))
    return moment.duration(differenceInMs).asHours()
  }

  onChangePage (index) {
    this.setState({pageNumber: index})
  }

  showStatus = (status, appraiser) => {
    if (this.getTypeDetail() == 'request' && this.props.action == undefined) {
      return Constants.mappingStatusRequest[status].label;
    } 
    return (this.props.action == "consent" && status == 5 && appraiser) ? Constants.mappingStatusRequest[20].label : Constants.mappingStatusRequest[status].label
  }

  exportErrorFile = () => {
    let fileName = `RequestHistory_${moment(new Date(),'MM-DD-YYYY_HHmmss').format('MM-DD-YYYY_HHmmss')}.xlsx`
    
    const config = {
      responseType: 'blob',
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/octet-stream'
      },
      params: {
        requestHistoryID: this.props.substitution.id,
      }
    }
    axios.get(`${process.env.REACT_APP_REQUEST_URL}Request/ExportExcelSubstitutionUploadError`, config)
    .then(res => {
      var blob = new Blob([res.data], { type: "application/octetstream" });

      //Check the Browser type and download the File.
      var isIE = false || !!document.documentMode;

      if (isIE) {
        window.navigator.msSaveBlob(blob, fileName);
      } 
      else {
        var url = window.URL || window.webkitURL;
        let link = url.createObjectURL(blob);
        var a = document.createElement("a");

        a.setAttribute("download", fileName);
        a.setAttribute("href", link);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
      }
    }).catch(error => {

    });
  }

  render() {
    const { t, lockReload, onHideTaskDetailModal } = this.props
    const requestTypeId = this.props.substitution.requestTypeId
    const listChangeShift = TableUtil.updateData(this.props.substitution.requestInfo, this.state.pageNumber - 1, 10)
    const timeProcessing = {
      createDate: this.props.substitution?.createDate,
      assessedDate: this.props.substitution?.assessedDate,
      approvedDate: this.props.substitution?.approvedDate,
      updatedDate: this.props.substitution?.updatedDate,
      deletedDate: this.props.substitution?.deletedDate,
    }

    return (
      <div className="leave-of-absence">
        <h5>{t("AdminInformation")}</h5>
        <div className="box shadow cbnv">
          <div className="row group">
            <div className="col-xl-3">
             {t("FullName")}
              <div className="detail auto-height">{this.props.substitution.user.fullName}</div>
            </div>
            <div className="col-xl-3">
              {t("EmployeeNo")}
              <div className="detail auto-height">{this.props.substitution.user.employeeNo}</div>
            </div>
            <div className="col-xl-3 auto-height">
              {t("Title")}
              <div className="detail auto-height">{this.props.substitution.user.jobTitle}</div>
            </div>
            <div className="col-xl-3">
              {t("DepartmentManage")}
              <div className="detail auto-height">{this.props.substitution.user.department}</div>
            </div>
          </div>
        </div>
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <h5>{t('DepartmentShiftInformation')}</h5>
        <div className="box shadow">
          {listChangeShift.length > 0 ? 
            <>
            <div className="change-shift">
            <table className="table">
              <thead>
                <tr>
                  <th className="sticky-col number-order sms-width text-center"> {t('NumberOrder')} </th>
                  <th className="sticky-col uid sm-width text-center"> {t('EmployeeNo')} </th>
                  <th className="sticky-col full-name mid-width"> {t('FullName')} </th>
                  <th className="sticky-col department xl-width"> {t('RoomPartGroup')} </th>
                  <th className="sm-width text-center"> {t('ShiftCategory')} </th>
                  <th className="mid-width text-center"> {t('StartDate')} </th>
                  <th className="mid-width text-center"> {t('EndDate')} </th>
                  <th className="sm-width text-center"> {t('ShiftCode')} </th>
                  <th className="sm-width text-center"> {t('StartHour')} </th>
                  <th className="sm-width text-center"> {t('Endtime')} </th>
                  <th className="mid-width text-center"> {t('BreakStart')} </th>
                  <th className="mid-width text-center"> {t('BreakEnd')} </th>
                  <th className="xl-width text-center"> {t('ShiftBreakHour')} <br/> ({t('Paid')}) </th>
                  <th className="xl-width text-center"> {t('ShiftBreakHour')} <br/> ({t('Unpaid')}) </th>
                  <th className="xl-width text-center"> Daily WS class <br/> ({t('Workshift')}) </th>
                  <th className="mid-width"> {t('Reason')} </th>
                </tr>
              </thead>
              <tbody>
              { listChangeShift.map((member, index) => {
                 return (
                  <tr key={index}>
                    <td className="sticky-col number-order sms-width text-center">{index+1}</td>
                    <td className="sticky-col uid sm-width text-center">{member.userID}</td>
                    <td className="sticky-col full-name mid-width">{member.fullName}</td>
                    <td className="sticky-col department xl-width">{member.department}</td>
                    <td className="sm-width text-center">{member.substitutionType}</td>
                    <td className="mid-width text-center">{member.startDate}</td>
                    <td className="mid-width text-center">{member.endDate}</td>
                    <td className="sm-width text-center">{member.dailyWorkScheduleID}</td>
                    <td className="sm-width text-center">{member.startTime}</td>
                    <td className="sm-width text-center">{member.endTime}</td>
                    <td className="mid-width text-center">{member.breakStart}</td>
                    <td className="mid-width text-center">{member.breakEnd}</td>
                    <td className="xl-width text-center">{member.numberHoursPaid}</td>
                    <td className="xl-width text-center">{member.unpaidHours}</td>
                    <td className="xl-width text-center">{member.dailyWSClass}</td>
                    <td className="mid-width">{member.couse}</td>
                  </tr>
                 )
              })}
              </tbody>
            </table>
          </div>
          {
                listChangeShift.length > 0 
                ?   <div className="row paging mt-2">
                        <div className="col-sm"></div>
                        <div className="col-sm"></div>
                        <div className="col-sm">
                            <CustomPaging pageSize={10} onChangePage={this.onChangePage.bind(this)} totalRecords={this.props.substitution.requestInfo.length} />
                        </div>
                        <div className="col-sm"></div>
                        <div className="col-sm text-right">{t("Total")}: {this.props.substitution.requestInfo.length}</div>
                    </div>
                : null
            }
             <div className="row group mt-2">
                <div className="col-xl-12 auto-height">
                  {t('ReasonRegisteringChangeDivision')}
                  <div className="detail">{this.props.substitution.comment ? this.props.substitution.comment : null}</div>
                </div>
              </div>
            </>
          : null}
        </div>
        
        {
          this.props?.substitution?.appraiser?.fullName && (
            <>
              <h5>{t("ConsenterInformation")}</h5>
              <ApproverDetailComponent
                title={t("Consenter")}
                manager={this.props.substitution.appraiser}
                status={this.props.substitution.requestInfo ? this.props.substitution.processStatusId : ""}
                hrComment={this.props.substitution.appraiserComment}
                isApprover={false} />
            </>
          )
        }

        {
          this.props?.substitution?.approver?.fullName && (
            <>
              <h5>{t("ApproverInformation")}</h5>
              <ApproverDetailComponent
                title={t("Approver")}
                manager={this.props.substitution.approver}
                status={this.props.substitution.processStatusId}
                hrComment={this.props.substitution.approverComment}
                isApprover={true} />
            </>
          )
        }

        <RequestProcessing {...timeProcessing} />

        {
          this.props.substitution.requestDocuments.length > 0 ?
          <>
          <h5>{t("Evidence")}</h5>
          <ul className="list-inline">
            {this.props.substitution.requestDocuments.map((file, index) => {
              return <li className="list-inline-item" key={index}>
                <a className="file-name" href={file.fileUrl} title={file.fileName} target="_blank" download={file.fileName}>
                  {file.fileType == "xls" ? <img src={ExcelIcon} className="mr-1 mb-1" alt="excel-icon" /> : null}
                  {file.fileName}
                </a>
              </li>
            })}
          </ul>
          </>
          : null
        }
        <div className="block-status">
          <span className={`status ${Constants.mappingStatusRequest[this.props.substitution.processStatusId].className}`}>{t(this.showStatus(this.props.substitution.processStatusId, this.props.substitution.appraiser))}</span>
          {
            this.props.substitution.processStatusId == 2 || this.props.substitution.processStatusId == 6 ? 
            <div className="d-flex result-change-shift justify-content-center align-items-center">
            <div className="mr-2">
              <i className="fas fa-check mr-1 text-success"></i> {t('Successful')}: <strong className="text-success">{this.props.substitution.recordInfo?.success}</strong>
            </div>
            <div className="vertical-line mr-2"></div>
            <div className="mr-2">
              <i className="fas fa-times mr-1 text-danger"></i> {t('Unsuccessful')}: <strong className="text-danger">{this.props.substitution.recordInfo?.fail}</strong>
            </div>
            <div className="vertical-line mr-2"></div>
            <div className="mr-2">
              <button  className="btn-export-err text-primary" onClick={this.exportErrorFile}><i className="fas fa-download mr-1"></i> {t('SeeErrorDetails')}</button>
            </div>
            </div>
            : null 
          }
         
        </div>
       
        { this.props.substitution && (this.props.substitution.processStatusId === 8 || (this.props.action != "consent" && this.props.substitution.processStatusId === 5) || this.props.substitution.processStatusId === 2 ) ? <DetailButtonComponent 
          dataToSap={
            [
              {
                "id": this.props.substitution.id,
                "requestTypeId": Constants.CHANGE_DIVISON_SHIFT,
                "sub": [
                  {
                    "id": this.props.substitution.id,
                  }
                ]
              }
            ]
          } //this.getData()
          id={this.props.substitution.id}
          isShowApproval={this.props.substitution.processStatusId === Constants.STATUS_WAITING}
          isShowRevocationOfApproval={this.props.substitution.processStatusId === Constants.STATUS_APPROVED}
          isShowConsent = {this.props.substitution.processStatusId === Constants.STATUS_WAITING_CONSENTED}
          isShowRevocationOfConsent = {this.props.substitution.processStatusId === Constants.STATUS_WAITING && this.props.substitution.appraiser}
          urlName={'requestsubstitution'}
          requestTypeId={requestTypeId}
          hiddenRevocationOfApprovalButton={1}
          action={this.props.action}
          lockReload={lockReload}
          onHideTaskDetailModal={onHideTaskDetailModal}
        /> : null}
      </div>
    )
  }
}
export default withTranslation()(ChangeDivisionShiftDetail)