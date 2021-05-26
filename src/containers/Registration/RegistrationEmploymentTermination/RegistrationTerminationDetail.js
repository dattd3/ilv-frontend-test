import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { withTranslation  } from "react-i18next"
import moment from 'moment'
import DetailButtonComponent from '../DetailButtonComponent';
import Constants from '../.../../../../commons/Constants'

class RegistrationEmploymentTermination extends React.Component {
  constructor(props) {
    super()
    this.state = {
        reasonTypes: [],
        userInfos: {},
        infos: {},
        staffTerminationDetail: {},
        directManager: null,
        seniorExecutive: null,
        files: [],
        isUpdateFiles: false,
        isEdit: false,
        dateStartWork: ''
    }
  }

  updateTabLink = key => {
    this.props.history.push('?tab=' + key)
    this.setState({ tab: key })
  }

  render() {
    const { t } = this.props
    const {
        isEdit,
        files,
        titleModal,
        messageModal,
        disabledSubmitButton,
        isShowStatusModal,
        isSuccess,
        reasonTypes,
        
        infos,
        directManager,
        seniorExecutive,
        dateStartWork
    } = this.state
    const terminationInfo = this.props.resignInfo
    if( !terminationInfo.requestInfo) {
        return null;
    }
    const userInfos = JSON.parse(terminationInfo.requestInfo.UserInfo)[0];
    const requestInfo = this.props.resignInfo.requestInfo
    const requestTypeId = this.props.resignInfo.requestTypeId
    const approvalInfo = requestInfo && requestInfo.ApproverInfo ? JSON.parse(requestInfo.ApproverInfo) : {};
    const appraiserInfo = requestInfo && requestInfo.SupervisorInfo ? JSON.parse(requestInfo.SupervisorInfo) : {};
    return (
      <div className="registration-section registration-employment-termination justify-content-between">
         <div className="block staff-information-block">
            <h6 className="block-title">I. {t('StaffInformation')}</h6>
            <div className="box shadow">
                <div className="row">
                    <div className="col-4">
                        <p className="title">{t('FullName')}</p>
                        <div>
                            <input type="text" className="form-control" value={userInfos?.fullName || ""} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('Title')}</p>
                        <div>
                            <input type="text" className="form-control" value={userInfos?.jobTitle || ""} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('DepartmentManage')}</p>
                        <div>
                            <input type="text" className="form-control" value={userInfos?.department || ""} readOnly />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <p className="title">{t('DaysOnWorking')}</p>
                        <div>
                            <input type="text" className="form-control" value={userInfos.dateStartWork ? moment(userInfos.dateStartWork, "YYYY-MM-DD").format('DD/MM/YYYY') : ''} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('ContractType')}</p>
                        <div>
                            <input type="text" className="form-control" value={userInfos?.contractName || ""} readOnly />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="block staff-information-block">
            <h6 className="block-title">II. {t('StaffInformationProposedToTerminateContract')}</h6>
            <div className="box shadow">
                <div className="row">
                    <div className="col-4">
                        <p className="title">{t('LastWorkingDay')}</p>
                        <div>
                            <input type="text" className="form-control" value={requestInfo.LastWorkingDay ? moment(requestInfo.LastWorkingDay, "YYYY-MM-DD").format('DD/MM/YYYY') : ''} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('ContractTerminationDate')}</p>
                        <div>
                            <input type="text" className="form-control" value={requestInfo.DateTermination ? moment(requestInfo.DateTermination, "YYYY-MM-DD").format('DD/MM/YYYY') : ""} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('ReasonForContractTermination')}</p>
                        <div>
                            <input type="text" className="form-control" value={requestInfo.Reason ? JSON.parse(requestInfo.Reason).label : ''} readOnly />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <p className="title">{t('DetailedReason')}</p>
                        <div>
                            <input type="text" className="form-control" value={requestInfo.ReasonDetailed || ""} readOnly />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="block direct-manager">
            <div className="box shadow">
                <h6 className="block-title has-border-bottom">{t('DirectManager')}</h6>
                <div className="row">
                    <div className="col-4">
                        <p className="title">{t('FullName')}</p>
                        <div>
                            <input type="text" className="form-control" value={appraiserInfo?.fullname || ''} readOnly />
                        </div>
                    </div>

                    <div className="col-4">
                        <p className="title">{t('Position')}</p>
                        <div>
                            <input type="text" className="form-control" value={appraiserInfo?.current_position || ""} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('DepartmentManage')}</p>
                        <div>
                            <input type="text" className="form-control" value={appraiserInfo?.department || ""} readOnly />
                        </div>
                    </div>
                    {
                        resignInfo.processStatusId == Constants.STATUS_NOT_APPROVED || resignInfo.processStatusId == Constants.STATUS_NO_CONSENTED || resignInfo.processStatusId == Constants.STATUS_EVICTION ?
                        <div className="col-4">
                            <p className="title">Lý do không duyệt</p>
                            <div>
                                <input type="text" className="form-control" value={resignInfo.appraiserComment || ""} readOnly />
                            </div>
                        </div>
                        : null
                    }
                </div>
            </div>
        </div>

        <div className="block senior-executive">
            <div className="box shadow">
                <h6 className="block-title has-border-bottom">{t('SeniorExecutive')}</h6>
                <div className="row">
                    <div className="col-4">
                        <p className="title">{t('FullName')}</p>
                        <div>
                            <input type="text" className="form-control" value={approvalInfo?.fullname || ""} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('Position')}</p>
                        <div>
                            <input type="text" className="form-control" value={approvalInfo?.current_position || ""} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('DepartmentManage')}</p>
                        <div>
                            <input type="text" className="form-control" value={approvalInfo?.department || ""} readOnly />
                        </div>
                    </div>
                    {
                        resignInfo.processStatusId == Constants.STATUS_NOT_APPROVED || resignInfo.processStatusId == Constants.STATUS_NO_CONSENTED || resignInfo.processStatusId == Constants.STATUS_EVICTION ?
                        <div className="col-4">
                            <p className="title">Lý do không duyệt</p>
                            <div>
                                <input type="text" className="form-control" value={resignInfo.approverComment || ""} readOnly />
                            </div>
                        </div>
                        : null
                    }
                </div>
            </div>
        </div>
        <ul className="list-inline">
            {(requestInfo.AttachedFiles || []).map((file, index) => {
                return <li className="list-inline-item" key={index}>
                    <span className="file-name">
                        <a title={file.name} href={file.fileUrl} download={file.name} target="_blank">{file.name}</a>
                    </span>
                </li>
            })}
        </ul>

        <div className="block-status">
          <span className={`status ${Constants.mappingStatus[terminationInfo.processStatusId].className}`}>{(this.props.action == "consent" && terminationInfo.processStatusId == 5 && terminationInfo.appraiser) ? t(Constants.mappingStatus[6].label) : t(Constants.mappingStatus[terminationInfo.processStatusId].label)}</span>
        </div>
        {(terminationInfo.processStatusId === 8 || (this.props.action != "consent" && terminationInfo.processStatusId === 5) || terminationInfo.processStatusId === 2) ? 
        <DetailButtonComponent 
          dataToSap={[{
            "id": terminationInfo.id,
            "requestTypeId": Constants.RESIGN_SELF,
            "sub": [
              {
                "id": requestInfo.id,
              }
            ]
          }]}
          isShowRevocationOfApproval={terminationInfo.processStatusId === Constants.STATUS_APPROVED && (requestInfo.actionType == "INS" || requestInfo.actionType == "MOD")}
          isShowApproval={terminationInfo.processStatusId === Constants.STATUS_WAITING}
          isShowConsent = {terminationInfo.processStatusId === Constants.STATUS_WAITING_CONSENTED}
          isShowRevocationOfConsent = {terminationInfo.processStatusId === Constants.STATUS_WAITING && terminationInfo.appraiser}
          id={terminationInfo.id}
          urlName={'requestattendance'}
          requestTypeId={requestTypeId}
          action={this.props.action}
        /> : null}

      </div>
    )
  }
}

export default withTranslation()(RegistrationEmploymentTermination)
