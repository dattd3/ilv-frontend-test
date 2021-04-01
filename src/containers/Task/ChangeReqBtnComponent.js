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
        this.setState({ isConfirmShow: true, modalTitle: "Xác nhận phê duyệt", modalMessage: "Bạn có đồng ý phê duyệt những yêu cầu này?", typeRequest: Constants.STATUS_APPROVED })
    }
    
    disApproval = () => {
        const { t } = this.props
        this.setState({ isConfirmShow: true, modalTitle: "Xác nhận không phê duyệt", modalMessage: "Lý do không phê duyệt (Bắt buộc)", typeRequest: Constants.STATUS_NOT_APPROVED })
    }

    consent = () => {
        const { t } = this.props
        this.setState({ isConfirmShow: true, modalTitle: "Xác nhận thẩm định", modalMessage: "Bạn có đồng ý thẩm định những yêu cầu này?", typeRequest: Constants.STATUS_CONSENTED })
    }
    
    reject = () => {
        const { t } = this.props
        this.setState({ isConfirmShow: true, modalTitle: "Xác nhận từ chối thẩm định", modalMessage: "Lý do từ chối thẩm định (Bắt buộc)", typeRequest: Constants.STATUS_NO_CONSENTED })
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
    
    render() {
        const action = this.props.action
        const {t} = this.props

        return <>
            <ConfirmRequestModal
                    urlName={'requestabsence'}
                    dataToSap={this.props.dataToSap}
                    id="total"
                    show={this.state.isConfirmShow}
                    title={this.state.modalTitle}
                    type={this.state.typeRequest}
                    updateData={this.updateData.bind(this)}
                    message={this.state.modalMessage}
                    onHide={this.onHideModalConfirm.bind(this)}
                    updateTask = {this.updateTaskStatus}
            />
            <div className="bg-white d-flex justify-content-center mt-2 mb-3 p-3">
                {
                    action === "approval" ?
                        <>
                        {
                            <>
                             <button type="button" className="btn btn-danger mr-3" onClick={this.disApproval.bind(this)} disabled={this.props.disabled}><i className='fas fa-times mr-2'></i>{t("Reject")}</button>
                            <button type="button" className="btn btn-success"  onClick={this.approval.bind(this)} disabled={this.props.disabled}><i className='fas fa-check mr-2'></i>{t("Approval")}</button>
                            </>
                        }
                        </>
                    : null
                }
                {
                    action === "consent" ?
                        <>
                        {
                            <>
                                <button type="button" className="btn btn-danger mr-3" onClick={this.reject.bind(this)} disabled={this.props.disabled}><i className='fas fa-times mr-2'></i>{t("Rejected")}</button>
                                <button type="button" className="btn btn-warning" onClick={this.consent.bind(this)} disabled={this.props.disabled}><i className='fas fa-check mr-2'></i>{t("Consent")}</button>
                            </>
                        }
                        </>
                    : null
                }
            </div>
        </>
    }
}

export default withTranslation()(ChangeReqBtnComponent)
