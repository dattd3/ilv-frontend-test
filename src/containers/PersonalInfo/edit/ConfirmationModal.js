import React from "react";
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import ResultModal from '../../Task/ApprovalDetail/ResultModal';
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import _ from 'lodash'
import map from "../../map.config"
import Spinner from 'react-bootstrap/Spinner'
import { getValueParamByQueryString } from "commons/Utils";

class ConfirmationModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            isShowResultConfirm: false,
            resultTitle: "",
            resultMessage: "",
            manager: props.manager,
            errors: {},
            disabledSubmitButton: false
        }

        this.sendRequest = 4;
    }

    showResultModal = (res, type) => {
        const { t } = this.props;
        this.setState({ isShowResultConfirm: true });
        if (res && res.data) {
            const result = res.data.result;
            const code = result.code;
            if (code === Constants.API_SUCCESS_CODE && res.data?.data[0]?.sub[0]?.status === "S") {
                this.setState({
                    resultTitle: t("Successful"),
                    resultMessage: type == Constants.STATUS_NOT_APPROVED ? t("SuccessfulRejectRequest") : t("successfulApprvalReq"),
                    isSuccess: true
                });
            } else {
                this.setState({
                    resultTitle: t("Notification"),
                    resultMessage: res.data?.data[0]?.sub[0]?.message,
                    isSuccess: false
                });
            }
        } else {
            this.setState({
                resultTitle: t("Notification"),
                resultMessage: "Có lỗi ngoại lệ xảy ra, liên hệ IT",
                isSuccess: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.manager !== this.props.manager) {
            this.setState({ manager: nextProps.manager })
        }
    }

    ok = (e) => {
        if (this.state.disabledSubmitButton) {
            return;
        }
        this.setState({ disabledSubmitButton: true });

        const type = e.currentTarget.dataset.type;
        if (this.props.type == null || this.props.type == undefined) {
            if (this.props.confirmStatus == "error") {
                window.location.reload();
            } else {
                window.location.href = "/tasks";
            }
        } else {
            if (type === "yes") {
                if (this.props.type == Constants.STATUS_NOT_APPROVED) { // Từ chối
                    const errors = this.verifyInput()
                    const message = this.state.message

                    if (!_.isEmpty(errors)) {
                        return
                    }

                    let data = [{
                        id: this.props.data.id,
                        requestTypeId: Constants.UPDATE_PROFILE,
                        sub:[
                            {
                                id: this.props.data.id,
                                processStatusId: Constants.STATUS_NOT_APPROVED,
                                comment: message
                            }
                        ]
                    }]
                    axios.post(`${process.env.REACT_APP_REQUEST_URL}request/approve`, data, {
                        headers: { Authorization: localStorage.getItem('accessToken') }
                    })
                    .then(response => {
                        this.showResultModal(response, this.props.type);
                    })
                    .catch(error => {
                        this.showResultModal(error);
                    })
                    .finally(() => {
                        this.props.onHide()
                        // window.location.href = "/tasks?tab=approval";
                    })
                } else if (this.props.type == Constants.STATUS_APPROVED) {
                    let data = [{
                        id: this.props.data.id,
                        requestTypeId: Constants.UPDATE_PROFILE,
                        sub:[
                            {
                                id: this.props.data.id,
                                processStatusId: Constants.STATUS_APPROVED
                            }
                        ]
                    }]
                    axios.post(`${process.env.REACT_APP_REQUEST_URL}request/approve`, data, {
                        headers: { Authorization: localStorage.getItem('accessToken') }
                    })
                    .then(response => {
                        this.showResultModal(response, this.props.type);
                    })
                    .finally(res => {
                        this.props.onHide()
                    })
                    .catch(error => {
                        this.showResultModal(error);
                    });
                        
                } else if (this.props.type == Constants.STATUS_EVICTION) {
                    axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.props.taskId}/eviction`, {}, {
                        headers: { Authorization: localStorage.getItem('accessToken') }
                    })
                    .finally(() => {
                        window.location.href = "/tasks";
                    })

                    setTimeout(() => { this.props.onHide()}, 600);
                } else if (this.props.type == this.sendRequest) {
                    this.props.sendData(this.state.message);
                    setTimeout(() => { 
                        this.props.onHide();
                        this.setState({ disabledSubmitButton: false });
                    }, 400);   
                }
            }
        }
    }

    handleChangeMessage = (e) => {
        this.setState({ message: e.target.value });
    }

    onHideResultModal = () => {
        const { action, lockReload, onHideTaskDetailModal } = this.props
        this.setState({ isShowResultConfirm: false });
        if (window.location.pathname === map.Task) {
            const currentTab = getValueParamByQueryString(window.location.search, "tab")
            switch (currentTab) {
                case Constants.tabListRequestMapping.APPRAISAL:
                    if (action === Constants.tabListRequestMapping.APPRAISAL)
                    return window.location.reload();
                case Constants.tabListRequestMapping.APPROVAL:
                    if (action === Constants.tabListRequestMapping.APPROVAL)
                    return window.location.reload();
                default:
                    if (action === Constants.tabListRequestMapping.REQUEST)
                    onHideTaskDetailModal()
                    return
            }
        }

        if (lockReload) {
            onHideTaskDetailModal()
            return
        }
        window.location.reload();
    }

    error = name => {
        return this.state.errors[name] ? <p className="text-danger validation-message">{this.state.errors[name]}</p> : null
    }

    verifyInput = () => {
        const { t } = this.props;
        let errors = {}
        if (_.isEmpty(this.state.message.trim())) {
            errors.message = t("Required")
            this.setState({ disabledSubmitButton: false });
        }
        this.setState({ errors: errors })
        return errors
    }

    render() {
        const { t } = this.props
        const { isShowResultConfirm, resultTitle, resultMessage, isSuccess, disabledSubmitButton, message } = this.state

        return (
            <>
                <ResultModal show={isShowResultConfirm} title={resultTitle} message={resultMessage} isSuccess={isSuccess} onHide={this.onHideResultModal} />
                <Modal className='info-modal-common position-apply-modal request-confirm-modal' centered show={this.props.show} onHide={this.props.onHide}>
                    <Modal.Header className='apply-position-modal' closeButton>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{this.props.message}</p>
                        {
                            this.props.type == Constants.STATUS_NOT_APPROVED || this.props.type == this.sendRequest ?
                                <div className="message">
                                    <textarea className="form-control" id="note" rows="4" value={message} onChange={this.handleChangeMessage}></textarea>
                                    {this.error('message')}
                                </div>
                                : null
                        }

                        <div className="clearfix">
                            <button type="button" className="btn btn-primary w-25 float-right" data-type="yes" onClick={this.ok} disabled={disabledSubmitButton}>{!disabledSubmitButton ? t("Yes") :
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />}</button>
                            <button type="button" className="btn btn-secondary mr-2 w-25 float-right" onClick={this.props.onHide} data-type="no">{t("No")}</button>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

export default withTranslation()(ConfirmationModal)
