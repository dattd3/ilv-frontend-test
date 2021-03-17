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
        let formData = new FormData()
        if (this.props.type === Constants.STATUS_NOT_APPROVED) {
            formData.append('HRComment', this.state.message)
            this.disApprove(formData, `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${id}/registration-disapprove`, id)
        } else if (this.props.type === Constants.STATUS_APPROVED) {
            this.approve(id)
        } else if (this.props.type === Constants.STATUS_REVOCATION) {
            this.revocation(id)
        } else if (this.props.type === Constants.STATUS_EVICTION) {
            this.eviction(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${id}/eviction`, id)
        }
    }

    eviction = (url, id) => {
        this.props.onHide();
        axios.post(url, null, {
            headers: { Authorization: localStorage.getItem('accessToken') }
        })
            .then(res => {
                if (res && res.data) {
                    const data = res.data
                    if (data.result && data.result.code == Constants.API_ERROR_NOT_FOUND_CODE) {
                        return window.location.href = map.NotFound
                    } else {
                        this.showStatusModal(this.props.t("Successful"), "Thu hồi yêu cầu thành công!", true)
                    }
                }
            })
            .catch(response => {
                window.location.href = "/tasks?tab=approval"
            })
    }

    revocation = (id) => {
        this.props.onHide()
        const dataToSap = this.prepareDataForRevocation()
        let bodyFormData = new FormData()
        bodyFormData.append('UserProfileInfoToSap', JSON.stringify(dataToSap))

        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${id}/registration-revocation`,
            data: bodyFormData,
            headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
        })
            .then(res => {
                if (res && res.data) {
                    const result = res.data.result
                    const code = result.code
                    if (code == "000000") {
                        this.showStatusModal(this.props.t("Successful"), result.message, true)
                    } else if (code == Constants.API_ERROR_NOT_FOUND_CODE) {
                        return window.location.href = map.NotFound
                    } else {
                        this.showStatusModal(this.props.t("Notification"), result.message, false)
                    }
                }
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

    approve = (id) => {
        this.props.onHide()
        const dataToSap = this.props.dataToSap
        let bodyFormData = new FormData()
        bodyFormData.append('UserProfileInfoToSap', JSON.stringify(dataToSap))

        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${id}/registration-approve`,
            data: bodyFormData,
            headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
        })
            .then(res => {
                if (res && res.data) {
                    const result = res.data.result
                    const code = result.code
                    if (code == "000000") {
                        this.showStatusModal(this.props.t("Successful"), result.message, true)
                    } else if (code == Constants.API_ERROR_NOT_FOUND_CODE) {
                        return window.location.href = map.NotFound
                    } else {
                        this.showStatusModal(this.props.t("Notification"), result.message, false)
                    }
                }
            })
            .catch(response => {
                this.showStatusModal(this.props.t("Notification"), "Có lỗi xảy ra! Xin vui lòng liên hệ IT để hỗ trợ", false)
            })
    }

    disApprove = (formData, url) => {
        this.props.onHide();
        axios.post(url, formData, {
            headers: { Authorization: localStorage.getItem('accessToken') }
        })
            .then(res => {
                if (res && res.data) {
                    const data = res.data
                    if (data.result && data.result.code == Constants.API_ERROR_NOT_FOUND_CODE) {
                        return window.location.href = map.NotFound
                    } else {
                        this.showStatusModal(this.props.t("Successful"), "Hủy phê duyệt thành công!", true)
                    }
                }
            })
            .catch(response => {
                window.location.href = "/tasks?tab=approval"
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
        window.location.href = "/tasks?tab=approval"
    }

    render() {
        const backgroundColorMapping = {
            [Constants.STATUS_NOT_APPROVED]: "bg-not-approved",
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
                            this.props.type == Constants.STATUS_NOT_APPROVED ?
                                <div className="message">
                                    <textarea className="form-control" id="note" rows="4" value={this.state.message} onChange={this.handleChangeMessage}></textarea>
                                </div>
                                : null
                        }
                        <div className="clearfix">
                            <button type="button" className={`btn btn-primary w-25 float-right ${backgroundColorMapping[this.props.type]}`} data-type="yes" disabled={this.state.disabledSubmitButton} onClick={this.ok.bind(this)}>
                                {!this.state.disabledSubmitButton ? "Có" :
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />}
                            </button>
                            <button type="button" className="btn btn-secondary mr-2 w-25 float-right" onClick={this.props.onHide} data-type="no">{t("No")}</button>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

export default withTranslation()(ConfirmationModal)
