import React from 'react'
import ConfirmationModal from './ConfirmationModal'
import Constants from '../.../../../commons/Constants'
import { withTranslation  } from "react-i18next"

class DetailButtonComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            isConfirmShow: false,
            modalTitle: "",
            modalMessage: "",
            typeRequest: 1
        }

        this.requestRegistraion = {
            2: "LeaveRequest",
            3: "BizTrip_TrainingRequest",
            4: "ShiftChange",
            5: "ModifyInOut",
            13: "OTRequest"
        }
    }

    approval = async () => {
      const { t, requestTypeId, haveOverOTFund, isNotEnoughTimeResign, nextKDateSentSap } = this.props
      if (requestTypeId === Constants.OT_REQUEST && haveOverOTFund) {
          return this.setState({ isConfirmShow: true, modalTitle: t("ApproveRequest"), modalMessage: t("WarningOverOTFundsApproval"), typeRequest: Constants.STATUS_APPROVED })
      }
      if (requestTypeId === Constants.RESIGN_SELF && isNotEnoughTimeResign) {
        return this.setState({ isConfirmShow: true, modalTitle: t("ApproveRequest"), modalMessage: t("WarningNotEnoughTimeResignApprover"), typeRequest: Constants.STATUS_APPROVED })
      }
      if (requestTypeId === Constants.WELFARE_REFUND && nextKDateSentSap) {
        return this.setState({ isConfirmShow: true, modalTitle: t("ApproveRequest"), modalMessage: t("WelfareRefundApproveWarning", {date: nextKDateSentSap}), typeRequest: Constants.STATUS_APPROVED })
      }
      this.setState({ isConfirmShow: true, modalTitle: t("ApproveRequest"), modalMessage:t("ConfirmApproveRequestHolder",{name: t(this.requestRegistraion[this.props.requestTypeId])}) , typeRequest: Constants.STATUS_APPROVED })
    }

    disApproval = () => {
        this.setState({ isConfirmShow: true, modalTitle: "RejectApproveRequest", modalMessage: "ReasonRejectingRequest", typeRequest: Constants.STATUS_NOT_APPROVED })
    }

    revocationApproval = () => {
        this.setState({ isConfirmShow: true, modalTitle: "ConfirmApprovalRecall", modalMessage: "SureApprovalRecall", typeRequest: 0 })
    }

    evictionRequest = () => {
        const { t } = this.props
        this.setState({ isConfirmShow: true, modalTitle: t("ConfirmRequestRecall"), modalMessage: t("SureRequestRecall") + t(this.requestRegistraion[this.props.requestTypeId]) + " này ?", typeRequest: 0 })
    }
    consent = async () => {
      const { t, requestTypeId, haveOverOTFund, isNotEnoughTimeResign } = this.props
      if (requestTypeId === Constants.OT_REQUEST && haveOverOTFund) {
          return this.setState({ isConfirmShow: true, modalTitle: t("ConsentConfirmation"), modalMessage: t("WarningOverOTFundsConsent"), typeRequest: Constants.STATUS_CONSENTED })
      }
      if (requestTypeId === Constants.RESIGN_SELF && isNotEnoughTimeResign) {
        return this.setState({ isConfirmShow: true, modalTitle: t("ConsentConfirmation"), modalMessage: t("WarningNotEnoughTimeResignApprover"), typeRequest: Constants.STATUS_CONSENTED })
      }
      this.setState({ isConfirmShow: true, modalTitle: t("ConsentConfirmation"), modalMessage: t("ConfirmConsentRequestHolder", {name: t(this.requestRegistraion[this.props.requestTypeId])}), typeRequest: Constants.STATUS_CONSENTED })
    }
    rejected = () => {
        this.setState({ isConfirmShow: true, modalTitle: "RejectConsenterRequest", modalMessage: "ReasonRejectRequest", typeRequest: Constants.STATUS_NO_CONSENTED })
    }
    onHideModalConfirm() {
        this.setState({ isConfirmShow: false })
    }

    updateData() {
        this.props.updateData()
    }

    getAction = () => {
        const pathName = window.location.pathname
        const pathNameArr = pathName.split('/')
        return pathNameArr[pathNameArr.length - 1]
    }
    updateTaskStatus = (id, status) =>{
        if(status && status === 2)
        {
            setTimeout(() => {  window.location.reload(); }, 1000)
        }
    }

    render() {
        const {t, action, requestTypeId, isShowReject = true, viewPopup, isShowApproval, isShowConsent, lockReload, onHideTaskDetailModal} = this.props
        const actionProcessing = action ? action : this.getAction()

        return <div className="bottom">
            <ConfirmationModal
                urlName={this.props.urlName}
                dataToSap={this.props.dataToSap}
                id={this.props.id}
                show={this.state.isConfirmShow}
                title={this.state.modalTitle}
                type={this.state.typeRequest}
                updateData={this.updateData.bind(this)}
                message={this.state.modalMessage}
                onHide={this.onHideModalConfirm.bind(this)}
                updateTask = {this.updateTaskStatus}
                lockReload={lockReload}
                action={action}
                onHideTaskDetailModal={onHideTaskDetailModal}
            />
            {
                actionProcessing === "approval" &&
                <div className="clearfix mt-2 mb-2">
                    {
                        isShowApproval &&
                        <>
                        <button type="button" className="btn btn-success float-right ml-3 shadow" onClick={this.approval.bind(this)}>
                            <i className="fas fa-check" aria-hidden="true"></i> {t("Approval")}</button>
                        {
                        isShowReject && <button type="button" className="btn btn-danger float-right shadow" onClick={this.disApproval.bind(this)}><i className="fa fa-close"></i> {t("Reject")}</button>
                        }
                        </>
                    }
                    {
                        (this.props.isShowRevocationOfApproval && !this.props.hiddenRevocationOfApprovalButton && [Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(Number(requestTypeId || 0))) && (
                            <button type="button" className="btn btn-danger float-right shadow" onClick={this.revocationApproval.bind(this)}><i className='fas fa-undo-alt'></i> {t("ApproralRecall")}</button>
                        )
                    }
                </div>
            }
            {
                actionProcessing === "consent" &&
                <div className="clearfix mt-2 mb-2">
                    {
                        isShowConsent && 
                        <>
                        <button type="button" className="btn btn-warning float-right ml-3 shadow" onClick={this.consent.bind(this)}>
                            <i className="fas fa-check" aria-hidden="true"></i> {t("Consent")}</button>
                        {
                        isShowReject && <button type="button" className="btn btn-danger float-right shadow" onClick={this.rejected.bind(this)}><i className="fa fa-close"></i> {t("Rejected")}</button>
                        }
                        </>
                    }
                    {/* {
                        this.props.isShowRevocationOfConsent ?
                        <button type="button" className="btn btn-danger float-right shadow" onClick={this.revocationApproval.bind(this)}><i className='fas fa-undo-alt'></i> Thu hồi thẩm định</button>
                        : null
                    } */}
                </div>
            }
            {/* {
                actionProcessing === "request" && this.props.isShowEvictionRequest ?
                <div className="clearfix mt-5 mb-5">
                    <button type="button" className="btn btn-danger float-right shadow" onClick={this.evictionRequest.bind(this)}><i className='fas fa-undo-alt'></i> Thu hồi yêu cầu</button>
                </div>
                : null
            } */}
        </div>
    }
}

export default withTranslation()(DetailButtonComponent)
