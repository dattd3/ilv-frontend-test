import React from "react";
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import ResultModal from '../../Task/ApprovalDetail/ResultModal';
import Constants from '../../../commons/Constants'
import _ from 'lodash'

class ConfirmationModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            message: "",
            isShowResultConfirm: false,
            resultTitle: "",
            resultMessage: "",
            manager: props.manager,
            errors: {}
        }

        this.sendRequest = 4;
    }

    showResultModal = (res) => {
        this.setState({ isShowResultConfirm: true });
        if (res && res.data) {
            const result = res.data.result;
            const code = result.code;
            if (code == "000000") {
                this.setState({
                    resultTitle: "Thành công",
                    resultMessage: result.message,
                    isSuccess: true
                });
            } else {
                this.setState({
                    resultTitle: "Thông Báo",
                    resultMessage: result.message,
                    isSuccess: false
                });
            }
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.manager !== this.props.manager) {
          this.setState({ manager: nextProps.manager })
        }
    }

    ok = (e) => {
        const type = e.currentTarget.dataset.type;
        if (this.props.type == null || this.props.type == undefined) {
            if (this.props.confirmStatus == "error") {
                window.location.reload();
            } else {
                window.location.href = "/tasks";
            }
        } else {
            if (type === "yes") {
                if (this.props.type == Constants.STATUS_NOT_APPROVED) {
                    const errors = this.verifyInput()
                    const message = this.state.message
                    const manager = JSON.stringify(this.state.manager)
                    if (!_.isEmpty(errors)) {
                      return
                    }
                    let formData = new FormData()
                    formData.append('HRComment', message)
                    formData.append('ManagerInfo', manager)
                    axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.props.taskId}/disapproval`, formData, {
                        headers: { Authorization: localStorage.getItem('accessToken') }
                    })
                    .finally(() => {
                        window.location.href = "/tasks?tab=approval";
                    })
                } else if (this.props.type == Constants.STATUS_APPROVED) {
                    let formData = new FormData()
                    formData.append('ManagerInfo', JSON.stringify(this.state.manager))
                    
                    axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.props.taskId}/approval`, formData, {
                        headers: { Authorization: localStorage.getItem('accessToken') }
                    })
                    .then(response => {
                        this.showResultModal(response);
                    })
                    .catch(error => {
                        window.location.href = "/tasks?tab=approval";
                    });

                    setTimeout(() => { this.props.onHide() }, 600);
                } else if (this.props.type == Constants.STATUS_EVICTION) {
                    axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.props.taskId}/eviction`, {}, {
                        headers: { Authorization: localStorage.getItem('accessToken') }
                    })
                    .finally(() => {
                        window.location.href = "/tasks";
                    })

                    setTimeout(() => { this.props.onHide() }, 600);
                } else if (this.props.type == this.sendRequest) {
                    this.props.sendData(this.state.message);
                    setTimeout(() => { this.props.onHide() }, 400);
                }
            }
        }
    }

    handleChangeMessage = (e) => {
        this.setState({message : e.target.value});
    }

    onHideResultModal = () => {
        this.setState({isShowResultConfirm: false});
        window.location.reload();
    }

    error = name => {
        return this.state.errors[name] ? <p className="text-danger validation-message">{this.state.errors[name]}</p> : null
    }

    verifyInput = () => {
        let errors = {}
        if (_.isEmpty(this.state.message.trim())) {
            errors.message = '(Thông tin bắt buộc)'
        }
        this.setState({ errors: errors })
        return errors
    }

    render () {
        return (
            <>
            <ResultModal show={this.state.isShowResultConfirm} title={this.state.resultTitle} message={this.state.resultMessage} isSuccess={this.state.isSuccess} onHide={this.onHideResultModal} />
            <Modal className='info-modal-common position-apply-modal' centered show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{this.props.message}</p>
                    {
                        this.props.type == Constants.STATUS_NOT_APPROVED || this.props.type == this.sendRequest ?
                        <div className="message">
                            <textarea className="form-control" id="note" rows="4" value={this.state.message} onChange={this.handleChangeMessage}></textarea>
                            {this.error('message')}
                        </div>
                        : null
                    }

                    <div className="clearfix">
                        <button type="button" className="btn btn-primary w-25 float-right" data-type="yes" onClick={this.ok}>Có</button>
                        <button type="button" className="btn btn-secondary mr-2 w-25 float-right" onClick={this.props.onHide} data-type="no">Không</button>
                    </div>
                </Modal.Body>
            </Modal>
            </>
        )
    }
}

export default ConfirmationModal
