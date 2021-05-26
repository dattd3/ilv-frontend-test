import React from 'react'
import { withTranslation  } from "react-i18next"
import moment from 'moment'
import DetailButtonComponent from '../DetailButtonComponent'
import AttachmentComponent from '../TerminationComponents/AttachmentComponent'
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

    updateFiles = () => {

    }

  render() {
    const { t, resignInfo } = this.props
    const {
        isEdit,
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

    if( !resignInfo.requestInfo) {
        return null;
    }

    const userInfos = resignInfo.user
    const requestInfo = this.props.resignInfo.requestInfo
    const requestTypeId = this.props.resignInfo.requestTypeId
    const approvalInfo = requestInfo && requestInfo.ApproverInfo ? JSON.parse(requestInfo.ApproverInfo) : {};
    const appraiserInfo = requestInfo && requestInfo.SupervisorInfo ? JSON.parse(requestInfo.SupervisorInfo) : {};
    const files = (resignInfo.requestDocuments || []).map(item => {
        return {
            name: item.fileName,
            fileUrl: item.fileUrl || ""
        }
    })

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
                            <input type="text" className="form-control" value={userInfos && userInfos.dateStartWork ? moment(userInfos.dateStartWork, "YYYY-MM-DD").format('DD/MM/YYYY') : ''} readOnly />
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

        <AttachmentComponent files={files} updateFiles={this.updateFiles} />

        <div className="block-status">
          <span className={`status ${Constants.mappingStatus[resignInfo.processStatusId].className}`}>{(this.props.action == "consent" && resignInfo.processStatusId == 5 && resignInfo.appraiser) ? t(Constants.mappingStatus[6].label) : t(Constants.mappingStatus[resignInfo.processStatusId].label)}</span>
        </div>
        {(resignInfo.processStatusId === 8 || (this.props.action != "consent" && resignInfo.processStatusId === 5) || resignInfo.processStatusId === 2) ? 
        <DetailButtonComponent 
          dataToSap={[{
            "id": resignInfo.id,
            "requestTypeId": Constants.RESIGN_SELF,
            "sub": [
              {
                "id": requestInfo.id,
              }
            ]
          }]}
          isShowRevocationOfApproval={resignInfo.processStatusId === Constants.STATUS_APPROVED && (requestInfo.actionType == "INS" || requestInfo.actionType == "MOD")}
          isShowApproval={resignInfo.processStatusId === Constants.STATUS_WAITING}
          isShowConsent = {resignInfo.processStatusId === Constants.STATUS_WAITING_CONSENTED}
          isShowRevocationOfConsent = {resignInfo.processStatusId === Constants.STATUS_WAITING && resignInfo.appraiser}
          id={resignInfo.id}
          urlName={'requestattendance'}
          requestTypeId={requestTypeId}
          action={this.props.action}
        /> : null}

      </div>
    )
  }
}

export default withTranslation()(RegistrationEmploymentTermination)
