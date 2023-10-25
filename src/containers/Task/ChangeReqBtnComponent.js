import React from 'react'
import Constants from '../../commons/Constants'
import { withTranslation  } from "react-i18next"
import ConfirmRequestModal from './ConfirmRequestModal'

class ChangeReqBtnComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            absenceType: null,
            message: "",
            resultTitle: "",
            resultMessage: "",
            isShowStatusModal: false,
            isDisabledButtons: false,
            dataToSap: [],
            isConfirmShow: false,
            modalTitle: "",
            modalMessage: "",
            typeRequest: 1
        }

        this.requestRegistraion = {
            2: "LeaveRequest",
            3: "BizTrip_TrainingRequest",
            4: "ShiftChange",
            5: "ModifyInOut"
        }
    }

    approval = () => {
        const { t } = this.props
        this.setState({ isConfirmShow: true, modalTitle: t("ApproveRequest"), modalMessage: t("ConfirmApproveRequests"), typeRequest: Constants.STATUS_APPROVED })
    }
    
    disApproval = () => {
        const { t } = this.props
        this.setState({ isConfirmShow: true, modalTitle: t("RejectApproveRequest"), modalMessage: t("ReasonRejectingRequest"), typeRequest: Constants.STATUS_NOT_APPROVED })
    }

    consent = () => {
        const { t } = this.props
        this.setState({ isConfirmShow: true, modalTitle: t("ConsentConfirmation"), modalMessage: t("ConfirmConsentRequests"), typeRequest: Constants.STATUS_CONSENTED })
    }
    
    reject = () => {
        const { t } = this.props
        this.setState({ isConfirmShow: true, modalTitle: t("RejectConsenterRequest"), modalMessage: t("ReasonRejectRequest"), typeRequest: Constants.STATUS_NO_CONSENTED })
    }

    onHideModalConfirm() {
        this.setState({ isConfirmShow: false })
    }
    
    updateData() {
        this.props.updateData()
    }
    
    updateTaskStatus = (id, status) =>{
        // setTimeout(() => {  window.location.reload(); }, 1000);
    }

    hideStatusModal = () => {
        this.setState({ isShowStatusModal: false })
    }

    showStatusModal = (title, message, isSuccess = false) => {
        this.setState({ isShowStatusModal: true, resultTitle: title, resultMessage: message, isSuccess: isSuccess })
    }

    showConfirmModal = (modalStatus) =>{
        this.setState({ isShowNotiModal: modalStatus });
    }

    updateButtonStatus = status => {
        this.setState({ isDisabledButtons: status })
    }
    
    render() {
        const { t, disabled, dataToSap, action } = this.props
        const { isConfirmShow, modalTitle, modalMessage, typeRequest, isDisabledButtons } = this.state

        return <>
            <ConfirmRequestModal
                    urlName={'requestabsence'}
                    dataToSap={dataToSap}
                    id="total"
                    show={isConfirmShow}
                    title={modalTitle}
                    type={typeRequest}
                    updateData={this.updateData.bind(this)}
                    message={modalMessage}
                    onHide={this.onHideModalConfirm.bind(this)}
                    updateTask={this.updateTaskStatus}
                    updateButtonStatus={this.updateButtonStatus}
            />
            <div className="bg-white d-flex justify-content-center mt-2 action-btn button-block-bottom-fixed">
                {
                    action === "approval" &&
                    <>
                        {
                            <>
                            <button type="button" className="btn btn-danger mr-3" onClick={this.disApproval.bind(this)} disabled={ disabled || isDisabledButtons }><i className='fas fa-times mr-2'></i>{t("Reject")}</button>
                            <button type="button" className="btn btn-success"  onClick={this.approval.bind(this)} disabled={ disabled || isDisabledButtons }><i className='fas fa-check mr-2'></i>{t("Approval")}</button>
                            </>
                        }
                    </>
                }
                {
                    action === "consent" &&
                    <>
                        {
                            <>
                                <button type="button" className="btn btn-danger mr-3" onClick={this.reject.bind(this)} disabled={ disabled || isDisabledButtons }><i className='fas fa-times mr-2'></i>{t("Rejected")}</button>
                                <button type="button" className="btn btn-warning" onClick={this.consent.bind(this)} disabled={ disabled || isDisabledButtons }><i className='fas fa-check mr-2'></i>{t("Consent")}</button>
                            </>
                        }
                    </>
                }
            </div>
        </>
    }
}

export default withTranslation()(ChangeReqBtnComponent)
