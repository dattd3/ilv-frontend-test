import React from "react";
import axios from 'axios';
import { Modal } from 'react-bootstrap';

class ConfirmationModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            message: ""
        }

        this.disapproval = 1;
        this.approval = 2;
    }

    ok = (e) => {
        const type = e.currentTarget.dataset.type;
        if (type === "yes") {
            if (this.props.type == this.disapproval) {
                let formData = new FormData()
                formData.append('HRComment', this.state.message)

                axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.props.userProfileHistoryId}/disapproval`, formData, {
                    headers: { Authorization: localStorage.getItem('accessToken') }
                })
                .then(response => {
                    window.location.href = "/tasks/approval";
                })
                .catch(error => {
                    window.location.href = "/tasks/approval";
                });
            } else if (this.props.type == this.approval) {
                axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.props.userProfileHistoryId}/approval`, {}, {
                    headers: { Authorization: localStorage.getItem('accessToken') }
                })
                .then(response => {
                    window.location.href = "/tasks/approval";
                })
                .catch(error => {
                    window.location.href = "/tasks/approval";
                });
            }
        }
    }

    handleChangeMessage = (e) => {
        this.setState({message : e.target.value});
    }

    render () {
        return (
            <>
            <Modal className='info-modal-common position-apply-modal' centered show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{this.props.message}</p>
                    {
                        this.props.type == this.disapproval ?
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
