import React from "react"
import axios from 'axios'
import { Modal } from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner'
import { withTranslation  } from "react-i18next"
import { uniq } from 'lodash'
import ResultModal from './ResultModal'
import ResultChangeShiftModal from './ResultChangeShiftModal'
import Constants from '../../commons/Constants'
import map from "../map.config"

class ConfirmationModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            message: "",
            resultTitle: "",
            resultMessage: "",
            isShowStatusModal: false,
            disabledSubmitButton: false,
            isShowStatusChangeShiftModal: false,
            errorMessage: null
        }
    }

    ok = (e) => {
        const { disabledSubmitButton, message } = this.state
        const { t, type, id, dataToSap, isSyncFromEmployee } = this.props

        if (disabledSubmitButton) {
            return;
        }

        if (isSyncFromEmployee) {
            this.sync()
            return
        }

        if ((Constants.STATUS_USE_COMMENT.includes(type) && message == "")) {
            this.setState({errorMessage: t("ReasonRequired")})
            return;
        }

        this.setState({ disabledSubmitButton: true });

        switch (type) {
            case Constants.STATUS_NOT_APPROVED: // không phê duyệt
                if(dataToSap[0].requestTypeId != Constants.ONBOARDING) {
                    dataToSap[0].sub[0].processStatusId = Constants.STATUS_NOT_APPROVED;
                }
                dataToSap[0].sub[0].comment = message;
                this.disApprove(dataToSap, `${process.env.REACT_APP_REQUEST_URL}request/approve`, id)
                break;
            case Constants.STATUS_APPROVED: // phê duyệt
                dataToSap[0].sub[0].processStatusId = Constants.STATUS_APPROVED;
                this.approve(dataToSap, id)
                break;
            case Constants.STATUS_CONSENTED: // thẩm định
                dataToSap[0].sub[0].processStatusId = Constants.STATUS_WAITING;
                this.consent(dataToSap);
                break;
            case Constants.STATUS_NO_CONSENTED: // từ chối thẩm định
                if(dataToSap[0].requestTypeId != Constants.ONBOARDING) {
                    dataToSap[0].sub[0].processStatusId = Constants.STATUS_NO_CONSENTED;
                }
                dataToSap[0].sub[0].comment = message;
                this.reject(dataToSap);
                break;
            case Constants.STATUS_REVOCATION: // hủy
                dataToSap.sub[0].processStatusId = Constants.STATUS_REVOCATION;
                dataToSap.sub[0].comment = message;
                this.cancel(dataToSap);
                break;
            case Constants.STATUS_EVICTION: // thu hồi
                dataToSap.sub[0].processStatusId = Constants.STATUS_EVICTION;
                dataToSap.sub[0].comment = message;
                this.revocation(dataToSap);
                break;
            case 0: //cán bộ phê duyệt thu hồi
                dataToSap[0].sub[0].processStatusId = Constants.STATUS_EVICTION;
                dataToSap[0].sub[0].comment = message;
                this.revocationApproval(dataToSap);
                break;
            default:
                break;
        }
    }

    sync = () => {
        const { dataToSap, t } = this.props

        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_URL}request/user-approve`,
            data: [dataToSap],
            headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
        })
        .then(res => {
            let titleModal = t("Notification")
            let messageModal = ''
            let isSuccess = false

            if (res && res?.data) {
                const data = res.data?.data
                const result = res.data?.result
                messageModal = result?.message
                const code = result?.code
                if (code == Constants.API_SUCCESS_CODE) {
                    if (data && data[0] && data[0]?.sub?.length > 0) {
                        if (!(data[0]?.sub || []).every(item => item?.status === 'E')) {
                            titleModal = t("Successful")
                            isSuccess = true
                            messageModal = t("SyncApprovalSuccess")
                        } else {
                            messageModal = uniq(data[0].sub.filter(item => item?.status === 'E').map(item => item?.message))?.join(', ')
                        }
                    }
                }
            }

            this.showStatusModal(titleModal, messageModal, isSuccess)
        })
        .catch(response => {
            this.showStatusModal(this.props.t("Notification"), "Có lỗi xảy ra! Xin vui lòng liên hệ IT để hỗ trợ", false)
        })
        .finally(res => {
            this.props.onHide()
        })
    }

    cancel = (dataToSap) => {
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_URL}request/cancel`,
            data: dataToSap,
            headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
        })
            .then(res => {
                if (res && res.data) {
                    const result = res.data.result
                    const code = result.code
                    if (code == Constants.API_SUCCESS_CODE) {
                        this.showStatusModal(this.props.t("Successful"), this.props.t("successfulCancelReq"), true)
                        // setTimeout(() => { this.hideStatusModal() }, 3000);
                    } else if (code == Constants.API_ERROR_NOT_FOUND_CODE) {
                        return window.location.href = map.NotFound
                    } else {
                        this.showStatusModal(this.props.t("Notification"), result.message, false)
                    }
                }
            })
            .finally(res => {
                this.props.onHide()
            })
            .catch(response => {
                this.showStatusModal(this.props.t("Notification"), "Có lỗi xảy ra! Xin vui lòng liên hệ IT để hỗ trợ", false)
            })
    }

    revocation = (dataToSap) => {
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_URL}request/cancel`,
            data: dataToSap,
            headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
        })
            .then(res => {
                if (res && res.data) {
                    const result = res.data.result
                    const code = result.code
                    if (code == Constants.API_SUCCESS_CODE) {
                        this.showStatusModal(this.props.t("Successful"), this.props.t("successfulRecallReq"), true)
                        // setTimeout(() => { this.hideStatusModal() }, 3000);
                    } else if (code == Constants.API_ERROR_NOT_FOUND_CODE) {
                        return window.location.href = map.NotFound
                    } else {
                        this.showStatusModal(this.props.t("Notification"), result.message, false)
                    }
                }
            })
            .finally(res => {
                this.props.onHide()
            })
            .catch(response => {
                this.showStatusModal(this.props.t("Notification"), "Có lỗi xảy ra! Xin vui lòng liên hệ IT để hỗ trợ", false)
            })
    }

    revocationApproval = (dataToSap) => {
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_URL}request/approved/cancel`,
            data: dataToSap[0],
            headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
        })
            .then(res => {
                if (res && res.data) {
                    const result = res.data.result
                    const code = result.code
                    if (code == Constants.API_SUCCESS_CODE) {
                        this.showStatusModal(this.props.t("Successful"), this.props.t("successfulRevocationApproval"), true)
                        // setTimeout(() => { this.hideStatusModal() }, 3000);
                    } else if (code == Constants.API_ERROR_NOT_FOUND_CODE) {
                        return window.location.href = map.NotFound
                    } else {
                        this.showStatusModal(this.props.t("Notification"), result.message, false)
                    }
                }
            })
            .finally(res => {
                this.props.onHide()
            })
            .catch(response => {
                this.showStatusModal(this.props.t("Notification"), "Có lỗi xảy ra! Xin vui lòng liên hệ IT để hỗ trợ", false)
            })
    }

    prepareDataForRevocation = () => {
        const dataToSap = [...this.props.dataToSap]
        const result = dataToSap.map(item => ({ ...item, ACTIO: 'DEL' }))
        return result
    }

    approve = (dataToSap,id) => {
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_URL}request/approve`,
            data: dataToSap,
            headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
        })
            .then(res => {
                if (res && res.data) {
                    const result = res.data.result
                    const code = result.code
                    if (code == Constants.API_SUCCESS_CODE) {
                        if (res.data.data[0].requestTypeId == Constants.CHANGE_DIVISON_SHIFT) {
                            this.showStatusChangeShiftModal(this.props.t("ApprovalResults"), res.data.data[0])
                        }
                        else {
                            if(res.data.data[0].sub[0].status == "E")
                            {
                                this.showStatusModal(this.props.t("Notification"), res.data.data[0].sub[0].message, false)
                            }
                            else{
                                this.showStatusModal(this.props.t("Successful"), this.props.t("successfulApprvalReq"), true)
                            }
                        }
                        // setTimeout(() => { this.hideStatusModal() }, 2000);
                    } else if (code == Constants.API_ERROR_NOT_FOUND_CODE) {
                        return window.location.href = map.NotFound
                    } else {
                        this.showStatusModal(this.props.t("Notification"), result.message, false)
                        // this.props.updateTask(id,0)
                    }
                }
            })
            .catch(error => {
                const errorCode = error?.response?.status
                this.showStatusModal(this.props.t("Notification"), errorCode === 504 ? "Yêu cầu đang được xử lý." : "Có lỗi xảy ra! Xin vui lòng liên hệ IT để hỗ trợ", errorCode === 504 ? true : false)
                // this.props.updateTask(id,0)
            })
            .finally(res => {
                this.props.onHide()
            })
    }

    disApprove = (formData, url, id) => {
        axios.post(url, formData, {
            headers: { Authorization: localStorage.getItem('accessToken') }
        }).then(res => {
                if (res && res.data) {
                    const data = res.data
                    
                    if (data.result && data.result.code == Constants.API_ERROR_NOT_FOUND_CODE) {
                        return window.location.href = map.NotFound
                    } 
                    else if(data.result && data.result.code == Constants.API_ERROR_CODE){
                        this.showStatusModal(this.props.t("Notification"), data.result.message, false)
                    }
                    else {
                        if( res.data.data[0].sub[0].status == "E")
                        {
                            this.showStatusModal(this.props.t("Notification"), res.data.data[0].sub[0].message, false)
                        }
                        else{
                            this.showStatusModal(this.props.t("Successful"), this.props.t("successfulDisApprovalReq"), true)
                        }
                        setTimeout(() => { this.redirectApprovalTab() }, 2000);
                    }
                }
            })
            .finally(res => {
                this.props.onHide();
            })
            .catch(response => {
                this.showStatusModal(this.props.t("Notification"), "Có lỗi xảy ra! Xin vui lòng liên hệ IT để hỗ trợ", false)
            })
    }

    consent = (dataToSap) => {
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_URL}request/assess?culture=${this.props.t('langCode')}`,
            data: dataToSap,
            headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
        })
            .then(res => {
                if (res && res.data) {
                    const result = res.data.result
                    const code = result.code
                    if (code == Constants.API_SUCCESS_CODE) {
                        if(res.data.data[0].sub[0].status == "E")
                        {
                            this.showStatusModal(this.props.t("Notification"), res.data.data[0].sub[0].message, false)
                        }
                        else{
                            this.showStatusModal(this.props.t("Successful"), this.props.t("successfulConsentReq"), true)
                        }
                        // setTimeout(() => { this.hideStatusModal() }, 2000);
                    } else if (code == Constants.API_ERROR_NOT_FOUND_CODE) {
                        return window.location.href = map.NotFound
                    } else {
                        this.showStatusModal(this.props.t("Notification"), result.message, false)
                    }
                }
            })
            .finally(res => {
                this.props.onHide()
            })
            .catch(response => {
                this.showStatusModal(this.props.t("Notification"), "Có lỗi xảy ra! Xin vui lòng liên hệ IT để hỗ trợ", false)
            })
    }

    reject = (dataToSap) => {
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_URL}request/assess?culture=${this.props.t('langCode')}`,
            data: dataToSap,
            headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
        })
            .then(res => {
                if (res && res.data) {
                    const result = res.data.result
                    const code = result.code
                    if (code == Constants.API_SUCCESS_CODE) {
                        if(res.data.data[0].sub[0].status == "E")
                        {
                            this.showStatusModal(this.props.t("Notification"), res.data.data[0].sub[0].message, false)
                        }
                        else{
                            this.showStatusModal(this.props.t("Successful"), this.props.t("successfulRejectConsentReq"), true)
                        }
                       
                        // setTimeout(() => { this.hideStatusModal() }, 2000);
                    } else if (code == Constants.API_ERROR_NOT_FOUND_CODE) {
                        return window.location.href = map.NotFound
                    } else {
                        this.showStatusModal(this.props.t("Notification"), result.message, false)
                    }
                }
            })
            .finally(res => {
                this.props.onHide()
            })
            .catch(response => {
                this.showStatusModal(this.props.t("Notification"), "Có lỗi xảy ra! Xin vui lòng liên hệ IT để hỗ trợ", false)
            })
    }

    handleChangeMessage = (e) => {
        if(e.target.value) {
            this.setState({ message: e.target.value, errorMessage: null })
        }
        else {
            this.setState({ message: "", errorMessage: this.props.t("ReasonRequired") })
        }
    }

    showStatusModal = (title, message, isSuccess = false) => {
        this.setState({ isShowStatusModal: true, resultTitle: title, resultMessage: message, isSuccess: isSuccess })
        this.setState({ disabledSubmitButton: false });
    }

    showStatusChangeShiftModal = (title, result) => {
        this.setState({ isShowStatusChangeShiftModal: true, resultTitle: title, resultMessage: result })
        this.setState({ disabledSubmitButton: false });
    }

    hideStatusModal = () => {
        this.setState({ isShowStatusModal: false })
        window.location.reload();
    }

    hideStatusChangeShiftModal= () => {
        this.setState({ isShowStatusChangeShiftModal: false })
        window.location.reload();
    }

    redirectApprovalTab = () => {
        window.location.href = "/tasks?tab=approval"
    }

    render() {
        const backgroundColorMapping = {
            [Constants.STATUS_NOT_APPROVED]: "bg-not-approved",
            [Constants.STATUS_NO_CONSENTED]: "bg-not-approved",
            [0]: "bg-not-approved",
            [Constants.STATUS_REVOCATION]: "bg-not-approved",
            [Constants.STATUS_APPROVED]: "bg-approved",
        }
        const { t, isSyncFromEmployee } = this.props
        
        return (
            <>
                <ResultModal show={this.state.isShowStatusModal} title={this.state.resultTitle} message={this.state.resultMessage} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
                <ResultChangeShiftModal show={this.state.isShowStatusChangeShiftModal} title={this.state.resultTitle} result={this.state.resultMessage} onHide={this.hideStatusChangeShiftModal} />
                
                <Modal className='info-modal-common position-apply-modal request-confirm-modal' centered show={this.props.show} onHide={this.props.onHide}>
                    <Modal.Header className={`apply-position-modal ${ isSyncFromEmployee ? 'bg-approved' : backgroundColorMapping[this.props.type] }`} closeButton>
                        <Modal.Title>{t(this.props.title)}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '16px' }}>
                        <p>{t(this.props.message)}</p>
                        {
                            !isSyncFromEmployee &&
                            Constants.STATUS_USE_COMMENT.includes(this.props.type) ?
                                <div className="message">
                                    <textarea className="form-control" id="note" rows="4" value={this.state.message} onChange={this.handleChangeMessage}></textarea>
                                    <span className="text-danger" style={{marginTop: 5}}>{this.state.errorMessage}</span>
                                </div>
                                : null
                        }
                        <div className="clearfix">
                            <button type="button" className={`btn btn-primary w-25 float-right ${ isSyncFromEmployee ? 'bg-approved' : backgroundColorMapping[this.props.type] }`} data-type="yes" disabled={this.state.disabledSubmitButton} onClick={this.ok.bind(this)}>
                                {!this.state.disabledSubmitButton ? t("Yes") :
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />}
                            </button>
                            <button type="button" className="btn btn-secondary mr-2 w-25 float-right" disabled = {this.state.disabledSubmitButton} onClick={this.props.onHide} data-type="no">{t("No")}</button>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

export default withTranslation()(ConfirmationModal)
