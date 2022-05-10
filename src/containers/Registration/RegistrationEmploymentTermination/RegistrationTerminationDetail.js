import React from 'react'
import { withTranslation } from "react-i18next"
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

        if (!resignInfo.requestInfo) {
            return null;
        }

        let userInfos = {}
        // terminationUserInfo có 1 item cho trường hợp Đăng ký
        if (resignInfo?.requestInfo?.formResignation == Constants.REGISTER_CONTRACT_TERMINATION_CODE && resignInfo?.requestInfo.terminationUserInfo && resignInfo?.requestInfo.terminationUserInfo.length == 1) {
            userInfos = resignInfo?.requestInfo.terminationUserInfo[0]
        }

        const requestInfo = resignInfo.requestInfo
        const requestTypeId = resignInfo.requestTypeId
        const approvalInfo = resignInfo.approver || {}
        const appraiserInfo = resignInfo.appraiser || {}
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
                                    <div className="detail">{userInfos?.fullName || ""}</div>
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('Title')}</p>
                                <div>
                                    <div className="detail">{userInfos?.jobTitle || ""}</div>
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('DepartmentManage')}</p>
                                <div>
                                    <div className="detail">{userInfos?.department || ""}</div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p className="title">{t('DaysOnWorking')}</p>
                                <div>
                                    <div className="detail">{userInfos && userInfos.dateStartWork ? moment(userInfos.dateStartWork, "YYYY-MM-DD").format('DD/MM/YYYY') : ''}</div>
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('ContractType')}</p>
                                <div>
                                    <div className="detail">{userInfos?.contractName || ""}</div>
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
                                    <div className="detail">{requestInfo?.lastWorkingDay ? moment(requestInfo.lastWorkingDay, "YYYY-MM-DD").format('DD/MM/YYYY') : ''}</div>
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('ContractTerminationDate')}</p>
                                <div>
                                    <div className="detail">{requestInfo?.dateTermination ? moment(requestInfo.dateTermination, "YYYY-MM-DD").format('DD/MM/YYYY') : ""}</div>

                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('ReasonForContractTermination')}</p>
                                <div>
                                    <div className="detail">{requestInfo?.absenceType ? requestInfo.absenceType.label : ''}</div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <p className="title">Lý do chi tiết chấm dứt hợp đồng</p>
                                <div>
                                    {/* <input type="text" className="form-control" value={requestInfo?.reasonDetailed || ""} readOnly /> */}
                                    <div className="detail">{requestInfo?.reasonDetailed || ""}</div>
                                </div>
                            </div>
                        </div>
                        {
                            requestInfo?.processStatusId == Constants.STATUS_REVOCATION && requestInfo?.commentExtend != null && requestInfo?.commentExtend != "" && requestInfo?.commentExtend != undefined ?
                                <div className="row">
                                    <div className="col-12">
                                        <p className="title">Lý do hủy yêu cầu</p>
                                        <div>
                                            <div className="detail">{requestInfo?.commentExtend || ""}</div>

                                        </div>
                                    </div>
                                </div>
                                : null
                        }
                    </div>
                </div>

                <div className="block direct-manager">
                    <div className="box shadow">
                        <h6 className="block-title has-border-bottom">{t('DirectManager')}</h6>
                        <div className="row">
                            <div className="col-4">
                                <p className="title">{t('FullName')}</p>
                                <div>
                                    <div className="detail">{appraiserInfo?.fullName || ''}</div>

                                </div>
                            </div>

                            <div className="col-4">
                                <p className="title">{t('Position')}</p>
                                <div>
                                    <div className="detail">{appraiserInfo?.jobTitle || ''}</div>

                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('DepartmentManage')}</p>
                                <div>
                                    <div className="detail">{appraiserInfo?.department || ''}</div>

                                </div>
                            </div>
                            {
                                requestInfo?.appraiserComment != null && requestInfo?.appraiserComment != undefined && requestInfo?.appraiserComment != "" ?
                                    <div className="col-12">
                                        <p className="title">Lý do từ chối</p>
                                        <div>
                                            <div className="detail">{requestInfo?.appraiserComment || ""}</div>
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
                                    <div className="detail">{approvalInfo?.fullName || ""}</div>
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('Position')}</p>
                                <div>
                                    <div className="detail">{approvalInfo?.jobTitle || ""}</div>

                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('DepartmentManage')}</p>
                                <div>
                                    <div className="detail">{approvalInfo?.department || ""}</div>

                                </div>
                            </div>
                            {
                                requestInfo?.approverComment != null && requestInfo?.approverComment != undefined && requestInfo?.approverComment != "" ?
                                    <div className="col-12">
                                        <p className="title">Lý do từ chối</p>
                                        <div>
                                            <div className="detail">{requestInfo?.approverComment || ""}</div>
                                        </div>
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                </div>

                <AttachmentComponent files={files} updateFiles={this.updateFiles} />

                <div className="block-status">
                    <span className={`status ${Constants.mappingStatusRequest[requestInfo.processStatusId].className}`}>{(this.props.action == "consent" && requestInfo.processStatusId == 5 && resignInfo.appraiser) ? t(Constants.mappingStatusRequest[20].label) : t(Constants.mappingStatusRequest[requestInfo.processStatusId].label)}</span>
                </div>
                {(requestInfo.processStatusId === 8 || (this.props.action != "consent" && requestInfo.processStatusId === 5) || requestInfo.processStatusId === 2) ?
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
                        //isShowRevocationOfApproval={resignInfo.processStatusId === Constants.STATUS_APPROVED && (requestInfo.actionType == "INS" || requestInfo.actionType == "MOD")}
                        isShowRevocationOfApproval={false}
                        isShowApproval={requestInfo.processStatusId === Constants.STATUS_WAITING}
                        isShowConsent={requestInfo.processStatusId === Constants.STATUS_WAITING_CONSENTED}
                        isShowRevocationOfConsent={requestInfo.processStatusId === Constants.STATUS_WAITING && resignInfo.appraiser}
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
