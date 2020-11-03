import React from "react"
import axios from 'axios'
import { Modal } from 'react-bootstrap'
import StatusModal from '../../components/Common/StatusModal'

const DISAPPROVAL = 1
const APPROVAL = 2
const EVICTION = 3

class ConfirmationModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            message: "",
            resultTitle: "",
            resultMessage: "",
            isShowStatusModal: false
        }
    }

    ok = (e) => {
        const url = window.location.pathname
        const id = this.props.id
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
            this.updateData()
            this.props.onHide()
        }
    }

    updateData() {
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
                'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET,
                'Content-Type': 'application/json'
            }
        }

        axios.put(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/user/${this.props.urlName}`, this.props.dataToSap, config)
            .then(res => {
                if (res && res.data) {
                    const result = res.data[0]
                    if (result && result.STATUS === 'S') {
                        this.updateHistory()
                    } else {
                        this.showStatusModal(result.MESSAGE)
                    }
                }
            }).catch(error => {
                this.showStatusModal('Có lỗi xảy ra! Xin vui lòng liên hệ IT để hỗ trợ')
            })
    }

    updateHistory() {
        let bodyFormData = new FormData();
        bodyFormData.append('UserProfileInfoToSap', JSON.stringify(this.props.dataToSap))

        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.props.id}/registration-approve`,
            data: bodyFormData,
            headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response && response.data && response.data.result) {
                    this.showStatusModal('Phê duyệt thành công!', true)
                }
            })
            .catch(response => {
                this.showStatusModal('Có lỗi xảy ra! Xin vui lòng liên hệ IT để hỗ trợ')
            })
    }

    updateRequest(formData, url) {
        axios.post(url, formData, {
            headers: { Authorization: localStorage.getItem('accessToken') }
        })
        .finally(() => {
            window.location.href = "/tasks?tab=approval";
        })
    }

    handleChangeMessage = (e) => {
        this.setState({ message: e.target.value });
    }

    showStatusModal = (message, isSuccess = false) => {
        this.setState({ isShowStatusModal: true, content: message, isSuccess: isSuccess });
      }
    
      hideStatusModal = () => {
        this.setState({ isShowStatusModal: false });
      }

    render() {
        return (
            <>
            <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
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
