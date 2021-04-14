import React from "react"
import axios from 'axios'
import { Modal } from 'react-bootstrap'
import ResultModal from './ResultModal'
import Constants from '../../commons/Constants'
import map from "../map.config"
import Spinner from 'react-bootstrap/Spinner'
import { withTranslation  } from "react-i18next"

class ConfirmationModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            message: "",
            resultTitle: "",
            resultMessage: "",
            isShowStatusModal: false,
            disabledSubmitButton: false
        }
    }

    ok = (e) => {
        if (this.state.disabledSubmitButton) {
            return;
        }
        this.setState({ disabledSubmitButton: true });
        const url = window.location.pathname
        const id = this.props.id
        let formData = new FormData();
        switch (this.props.type) {
            case Constants.STATUS_NOT_APPROVED: // không phê duyệt
                this.props.dataToSap[0].sub[0].processStatusId = Constants.STATUS_NOT_APPROVED;
                this.props.dataToSap[0].sub[0].ApproverComment = this.state.message;
                console.log(this.props.dataToSap);
                this.disApprove(this.props.dataToSap, `${process.env.REACT_APP_REQUEST_URL}request/approve`, id)
                break;
            case Constants.STATUS_APPROVED: // phê duyệt
                this.props.dataToSap[0].sub[0].processStatusId = Constants.STATUS_APPROVED;
                this.approve(this.props.dataToSap,id)
                break;
            case Constants.STATUS_CONSENTED: // thẩm định
                this.props.dataToSap[0].sub[0].processStatusId = Constants.STATUS_WAITING;
                // console.log(this.props.dataToSap);
                this.consent(this.props.dataToSap);
                break;
            case Constants.STATUS_NO_CONSENTED: // từ chối thẩm định
                this.props.dataToSap[0].sub[0].processStatusId = Constants.STATUS_NO_CONSENTED;
                this.props.dataToSap[0].sub[0].AppraiserComment = this.state.message;
                this.reject(this.props.dataToSap);
                break;
            case Constants.STATUS_REVOCATION: // hủy
                this.props.dataToSap.sub[0].processStatusId = Constants.STATUS_REVOCATION;
                this.props.dataToSap.sub[0].comment = this.state.message;
                this.cancel(this.props.dataToSap);
                break;
            case Constants.STATUS_EVICTION: // thu hồi
                this.props.dataToSap.sub[0].processStatusId = Constants.STATUS_EVICTION;
                this.props.dataToSap.sub[0].comment = this.state.message;
                this.revocation(this.props.dataToSap);
                break;
            default:
                break;
        }
    }

    cancel = (dataToSap) => {
        console.log(dataToSap);
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
                    if (code == "000000") {
                        this.showStatusModal(this.props.t("Successful"), this.props.t("successfulCancelReq"), true)
                        setTimeout(() => { this.hideStatusModal() }, 3000);
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
        console.log(dataToSap);
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
                    if (code == "000000") {
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
                    if (code == "000000") {
                        if(res.data.data[0].sub[0].status == "E")
                        {
                            this.showStatusModal(this.props.t("Notification"), res.data.data[0].sub[0].message, false)
                        }
                        else{
                            this.showStatusModal(this.props.t("Successful"), result.message, true)
                        }
                        setTimeout(() => { this.hideStatusModal() }, 2000);
                    } else if (code == Constants.API_ERROR_NOT_FOUND_CODE) {
                        return window.location.href = map.NotFound
                    } else {
                        this.showStatusModal(this.props.t("Notification"), result.message, false)
                        // this.props.updateTask(id,0)
                    }
                }
            })
            .finally(res => {
                this.props.onHide()
            })
            .catch(response => {
                this.showStatusModal(this.props.t("Notification"), "Có lỗi xảy ra! Xin vui lòng liên hệ IT để hỗ trợ", false)
                // this.props.updateTask(id,0)
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
                            this.showStatusModal(this.props.t("Successful"), data.result.message, true)
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
        console.log(dataToSap);
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_URL}request/assess`,
            data: dataToSap,
            headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
        })
            .then(res => {
                if (res && res.data) {
                    const result = res.data.result
                    const code = result.code
                    if (code == "000000") {
                        if(res.data.data[0].sub[0].status == "E")
                        {
                            this.showStatusModal(this.props.t("Notification"), res.data.data[0].sub[0].message, false)
                        }
                        else{
                            this.showStatusModal(this.props.t("Successful"), result.message, true)
                        }
                        setTimeout(() => { this.hideStatusModal() }, 2000);
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
        console.log(dataToSap);
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_URL}request/assess`,
            data: dataToSap,
            headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
        })
            .then(res => {
                if (res && res.data) {
                    const result = res.data.result
                    const code = result.code
                    if (code == "000000") {
                        if(res.data.data[0].sub[0].status == "E")
                        {
                            this.showStatusModal(this.props.t("Notification"), res.data.data[0].sub[0].message, false)
                        }
                        else{
                            this.showStatusModal(this.props.t("Successful"), result.message, true)
                        }
                       
                        setTimeout(() => { this.hideStatusModal() }, 2000);
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
        this.setState({ message: e.target.value })
    }

    showStatusModal = (title, message, isSuccess = false) => {
        this.setState({ isShowStatusModal: true, resultTitle: title, resultMessage: message, isSuccess: isSuccess })
        this.setState({ disabledSubmitButton: false });
    }

    hideStatusModal = () => {
        this.setState({ isShowStatusModal: false })
        window.location.reload();
    }

    redirectApprovalTab = () => {
        window.location.href = "/tasks?tab=approval"
    }

    render() {
        const backgroundColorMapping = {
            [Constants.STATUS_NOT_APPROVED]: "bg-not-approved",
            [Constants.STATUS_NO_CONSENTED]: "bg-not-approved",
            [Constants.STATUS_REVOCATION]: "bg-not-approved",
            [Constants.STATUS_APPROVED]: "bg-approved",
        }
        const {t} = this.props
        return (
            <>
                <ResultModal show={this.state.isShowStatusModal} title={this.state.resultTitle} message={this.state.resultMessage} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
                <Modal className='info-modal-common position-apply-modal' centered show={this.props.show} onHide={this.props.onHide}>
                    <Modal.Header className={`apply-position-modal ${backgroundColorMapping[this.props.type]}`} closeButton>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{this.props.message}</p>
                        {
                            this.props.type == Constants.STATUS_NOT_APPROVED || this.props.type == Constants.STATUS_NO_CONSENTED || this.props.type == Constants.STATUS_EVICTION ?
                                <div className="message">
                                    <textarea className="form-control" id="note" rows="4" value={this.state.message} onChange={this.handleChangeMessage}></textarea>
                                </div>
                                : null
                        }
                        <div className="clearfix">
                            <button type="button" className={`btn btn-primary w-25 float-right ${backgroundColorMapping[this.props.type]}`} data-type="yes" disabled={this.state.disabledSubmitButton} onClick={this.ok.bind(this)}>
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
