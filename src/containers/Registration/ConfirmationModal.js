import React from "react"
import axios from 'axios'
import { Modal } from 'react-bootstrap'

const DISAPPROVAL = 1
const APPROVAL = 2
const EVICTION = 3

class ConfirmationModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            message: "",
            resultTitle: "",
            resultMessage: ""
        }
    }

    showResultModal = (res) => {
        if (res && res.data) {
            const result = res.data.result
            const code = result.code
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
        const url = window.location.pathname
        const id = window.location.pathname.substring(url.lastIndexOf('/') + 1)
        let formData = new FormData()
        formData.append('ManagerInfo', JSON.stringify({
            fullname: localStorage.getItem('fullName'),
            title: localStorage.getItem('jobTitle'),
            department: localStorage.getItem('department'),
            code: localStorage.getItem('employeeNo')
        }))

        if (this.props.type === DISAPPROVAL) {
            formData.append('HRComment', this.state.message)
            this.updateRequest(formData, `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${id}/disapproval`, id)
        } else if (this.props.type === APPROVAL) {
            this.props.updateData()
            this.props.onHide()
        }
    }

    updateRequest(formData, url) {
        axios.post(url, formData, {
            headers: { Authorization: localStorage.getItem('accessToken') }
        })
            .then(response => {
                window.location.href = "/tasks"
            })
            .catch(error => {
                window.location.href = "/tasks"
            })
    }

    handleChangeMessage = (e) => {
        this.setState({ message: e.target.value });
    }

    onHideResultModal = () => {
        this.setState({ isShowResultConfirm: false });
        window.location.reload();
    }

    render() {
        return (
            <>
                <Modal className='info-modal-common position-apply-modal' centered show={this.props.show} onHide={this.props.onHide}>
                    <Modal.Header className='apply-position-modal' closeButton>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{this.props.message}</p>
                        {
                            this.props.type == DISAPPROVAL ?
                                <div className="message">
                                    <textarea className="form-control" id="note" rows="4" value={this.state.message} onChange={this.handleChangeMessage}></textarea>
                                </div>
                                : null
                        }
                        <div className="clearfix">
                            <button type="button" className="btn btn-primary w-25 float-right" data-type="yes" onClick={this.ok.bind(this)}>Có</button>
                            <button type="button" className="btn btn-secondary mr-2 w-25 float-right" onClick={this.props.onHide} data-type="no">Không</button>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

export default ConfirmationModal
