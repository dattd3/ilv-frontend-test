import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from "react-i18next"
import DetailButtonComponent from './DetailButtonComponent'
import ApproverDetailComponent from './ApproverDetailComponent'
import StatusModal from '../../components/Common/StatusModal'
import Constants from '../.../../../commons/Constants'
import TableUtil from '../../components/Common/table'
import CustomPaging from '../../components/Common/CustomPaging'
import TimeSheetMember from '../WorkflowManagement/DepartmentManagement/EmployeeTimesheets/TimeSheetMember'
import ExcelIcon from "../../assets/img/excel-icon.svg";
import { processDepartmentTimeSheet, getDates } from "../Utils/ProcessDepartmentTimeSheet"
import axios from 'axios'

const TIME_FORMAT = 'HH:mm:00'
const TIME_OF_SAP_FORMAT = 'HHmm00'
const DATE_FORMAT = 'DD-MM-YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'

class DepartmentTimeSheetDetail extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isShowStatusModal: false,
      pageNumber: 1,
      dayList: [],
      timeSheets: []
    }
  }

  componentDidMount () {
    if (this.props.substitution) {
      let year = parseInt(this.props.substitution.createField.split('/')[1])
      let month = parseInt(this.props.substitution.createField.split('/')[0])
      let startDate = new Date( year, month - 2, 26)
      let endDate = new Date(year, month - 1, 25)
      let start = moment(startDate).format("YYYYMMDD").toString();
      let end = moment(endDate).format("YYYYMMDD").toString();
      this.setState({
        timeSheets: processDepartmentTimeSheet(this.props.substitution.requestInfo, start, end),
        dayList: getDates(startDate, endDate)
      })

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

  onChangePage(index) {
    this.setState({ pageNumber: index })
  }

  showStatus = (status, appraiser) => {
    if (this.getTypeDetail() == 'request' && this.props.action == undefined) {
      return Constants.mappingStatusRequest[status].label;
    }
    return (this.props.action == "consent" && status == 5 && appraiser) ? Constants.mappingStatus[20].label : Constants.mappingStatus[status].label
  }

  exportTimeSheetsFile = () => {
    let fileName = `Bang_cham_cong_${moment(new Date(), 'MM-DD-YYYY_HHmmss').format('MM-DD-YYYY_HHmmss')}.xlsx`

    const config = {
      responseType: 'blob',
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/octet-stream'
      },
    }

    let formData = new FormData();
    formData.append('requestHistoryId', this.props.substitution.id);
    axios.post(`${process.env.REACT_APP_REQUEST_URL}request/exportexceldepartmenttimesheet`, formData, config)
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
    const { t } = this.props
    const requestTypeId = this.props.substitution.requestTypeId
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
        <h5>{t('DepartmentTimeSheetInformation')}</h5>
        <div className="timesheet-section">
          <TimeSheetMember timesheets={this.state.timeSheets} dayList={this.state.dayList}/>
        </div>
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="row group">
              <div className="col-xl-12 auto-height">
                Lý do
                <input type="text" className="form-control mt-2" name="comment" value={this.props.substitution.comment} readOnly />
              </div>
            </div>
          </div>
        </div>
        <h5>{t("ConsenterInformation")}</h5>
        <ApproverDetailComponent title={t("Consenter")} approver={this.props.substitution.appraiser} status={this.props.substitution.requestInfo ? this.props.substitution.processStatusId : ""} hrComment={this.props.substitution.appraiserComment} />
        {
          this.props.substitution && (Constants.STATUS_TO_SHOW_APPROVER.includes(this.props.substitution.processStatusId)) ?
            <>
              <h5>{t("ApproverInformation")}</h5>
              <ApproverDetailComponent title={t("Approver")} approver={this.props.substitution.approver} status={this.props.substitution.processStatusId} hrComment={this.props.substitution.approverComment} />
            </> : null
        }

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
          <span className={`status ${Constants.mappingStatus[this.props.substitution.processStatusId].className}`}>{t(this.showStatus(this.props.substitution.processStatusId, this.props.substitution.appraiser))}</span>
          {
            this.props.substitution.processStatusId == 2 || this.props.substitution.processStatusId == 6 ?
              <div className="d-flex justify-content-center align-items-center">
                <div className="mr-2">
                  <button className="btn-export-err p-2 text-dark" onClick={this.exportTimeSheetsFile}><img src={ExcelIcon} className="mr-1 mb-1" alt="excel-icon" /> {t('Bảng chấm công bộ phận.xlsx')}</button>
                </div>
              </div>
              : null
          }

        </div>

        {this.props.substitution && (this.props.substitution.processStatusId === 8 || (this.props.action != "consent" && this.props.substitution.processStatusId === 5) || this.props.substitution.processStatusId === 2) ? <DetailButtonComponent
          dataToSap={
            [
              {
                "id": this.props.substitution.id,
                "requestTypeId": Constants.DEPARTMENT_TIMESHEET,
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
          isShowConsent={this.props.substitution.processStatusId === Constants.STATUS_WAITING_CONSENTED}
          isShowRevocationOfConsent={this.props.substitution.processStatusId === Constants.STATUS_WAITING && this.props.substitution.appraiser}
          urlName={'requestsubstitution'}
          requestTypeId={requestTypeId}
          hiddenRevocationOfApprovalButton={1}
          action={this.props.action}
        /> : null}
      </div>
    )
  }
}
export default withTranslation()(DepartmentTimeSheetDetail)