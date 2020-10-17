import React from "react";
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import ResultModal from '../../Task/ApprovalDetail/ResultModal';
import Constants from '../../../commons/Constants'

class ConfirmationModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            message: "",
            isShowResultConfirm: false,
            resultTitle: "",
            resultMessage: ""
        }

        this.disapproval = 1;
        this.approval = 2;
        this.eviction = 3;
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
                    resultTitle: "Lỗi",
                    resultMessage: result.message,
                    isSuccess: false
                });
            }
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
                if (this.props.type == this.disapproval) {
                    let formData = new FormData()
                    formData.append('HRComment', this.state.message)
                    formData.append('ManagerInfo', JSON.stringify(this.props.manager))
    
                    axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.props.userProfileHistoryId}/disapproval`, formData, {
                        headers: { Authorization: localStorage.getItem('accessToken') }
                    })
                    .then(response => {
                        window.location.href = "/tasks";
                    })
                    .catch(error => {
                        window.location.href = "/tasks";
                    });
                } else if (this.props.type == this.approval) {
                    let formData = new FormData()
                    formData.append('ManagerInfo', JSON.stringify(this.props.manager))
                    
                    axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.props.userProfileHistoryId}/approval`, formData, {
                        headers: { Authorization: localStorage.getItem('accessToken') }
                    })
                    .then(response => {
                        this.showResultModal(response);
                    })
                    .catch(error => {
                        window.location.href = "/tasks";
                    });
                } else if (this.props.type == this.eviction) {
                    axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.props.userProfileHistoryId}/eviction`, {}, {
                        headers: { Authorization: localStorage.getItem('accessToken') }
                    })
                    .then(response => {
                        window.location.href = "/tasks";
                    })
                    .catch(error => {
                        window.location.href = "/tasks";
                    });
                } else if (this.props.type == this.sendRequest) {
                    this.props.sendData(this.state.message);
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
                        this.props.type == this.disapproval || this.props.type == this.sendRequest ?
                        <div className="message">
                            <textarea className="form-control" id="note" rows="4" value={this.state.message} onChange={this.handleChangeMessage}></textarea>
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
