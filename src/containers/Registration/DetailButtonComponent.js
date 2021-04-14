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
            5: "ModifyInOut"
        }
    }

    approval = () => {
        const { t } = this.props
        this.setState({ isConfirmShow: true, modalTitle: "Xác nhận phê duyệt", modalMessage: "Bạn có đồng ý phê duyệt " + t(this.requestRegistraion[this.props.requestTypeId]) + " này ?", typeRequest: Constants.STATUS_APPROVED })
    }

    disApproval = () => {
        const { t } = this.props
        this.setState({ isConfirmShow: true, modalTitle: "Xác nhận không phê duyệt", modalMessage: "Lý do không phê duyệt", typeRequest: Constants.STATUS_NOT_APPROVED })
    }

    revocationApproval = () => {
        const { t } = this.props
        this.setState({ isConfirmShow: true, modalTitle: t("ConfirmApprovalRecall"), modalMessage: t("SureApprovalRecall") + t(this.requestRegistraion[this.props.requestTypeId]), typeRequest: Constants.STATUS_REVOCATION })
    }

    evictionRequest = () => {
        const { t } = this.props
        this.setState({ isConfirmShow: true, modalTitle: t("ConfirmRequestRecall"), modalMessage: t("SureRequestRecall") + t(this.requestRegistraion[this.props.requestTypeId]) + " này ?", typeRequest: Constants.STATUS_EVICTION })
    }
    consent = () => {
        const { t } = this.props
        this.setState({ isConfirmShow: true, modalTitle: "Xác nhận thẩm định", modalMessage: "Bạn có đồng ý thẩm định " + t(this.requestRegistraion[this.props.requestTypeId]) + " này ?", typeRequest: Constants.STATUS_CONSENTED })
    }
    rejected = () => {
        const { t } = this.props
        this.setState({ isConfirmShow: true, modalTitle: "Xác nhận từ chối thẩm định", modalMessage: "Lý do từ chối thẩm định", typeRequest: Constants.STATUS_NO_CONSENTED })
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
        const action = this.props.action ? this.props.action : this.getAction()
        const {t} = this.props

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
            />
            {
            action === "approval" ?
            <div className="clearfix mt-5 mb-5">
                {
                    !this.props.isShowRevocationOfApproval ?
                    <>
                    <button type="button" className="btn btn-success float-right ml-3 shadow" onClick={this.approval.bind(this)}>
                        <i className="fas fa-check" aria-hidden="true"></i> {t("Approval")}</button>
                    <button type="button" className="btn btn-danger float-right shadow" onClick={this.disApproval.bind(this)}><i className="fa fa-close"></i> Không duyệt</button>
                    </>
                    : null
                }
                {
                    this.props.isShowRevocationOfApproval && !this.props.hiddenRevocationOfApprovalButton ?
                    <button type="button" className="btn btn-danger float-right shadow" onClick={this.revocationApproval.bind(this)}><i className='fas fa-undo-alt'></i> {t("ApproralRecall")}</button>
                    : null
                }
            </div>
            : null
            }
            {
            action === "consent" ?
            <div className="clearfix mt-5 mb-5">
                {
                    this.props.isShowConsent ? 
                    <>
                    <button type="button" className="btn btn-warning float-right ml-3 shadow" onClick={this.consent.bind(this)}>
                        <i className="fas fa-check" aria-hidden="true"></i> {t("Consent")}</button>
                    <button type="button" className="btn btn-danger float-right shadow" onClick={this.rejected.bind(this)}><i className="fa fa-close"></i> {t("Rejected")}</button>
                    </>
                    : null
                }
                {
                    this.props.isShowRevocationOfConsent ?
                    <button type="button" className="btn btn-danger float-right shadow" onClick={this.revocationApproval.bind(this)}><i className='fas fa-undo-alt'></i> Thu hồi thẩm định</button>
                    : null
                }
            </div>
            : null
            }
            {
                action === "request" && this.props.isShowEvictionRequest ?
                <div className="clearfix mt-5 mb-5">
                    <button type="button" className="btn btn-danger float-right shadow" onClick={this.evictionRequest.bind(this)}><i className='fas fa-undo-alt'></i> Thu hồi yêu cầu</button>
                </div>
                : null
            }
        </div>
    }
}

export default withTranslation()(DetailButtonComponent)
