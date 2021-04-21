import React from "react"
import axios from 'axios'
import { Modal } from 'react-bootstrap'
import ResultDetailModal from './ResultDetailModal'
import Constants from '../../commons/Constants'
import map from "../map.config"
import Spinner from 'react-bootstrap/Spinner'
import { withTranslation  } from "react-i18next"

class ConfirmRequestModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            message: "",
            resultTitle: "",
            resultMessage: "",
            resultDetail:[],
            isShowStatusModal: false,
            disabledSubmitButton: false,
            approverComment: "",
            errorMessage: null
        }
    }

    ok = (e) => {
        if (this.state.disabledSubmitButton) {
            return;
        }
        if ((Constants.STATUS_USE_COMMENT.includes(this.props.type) && this.state.message == "")) {
            this.setState({errorMessage: "Vui lòng nhập lý do"})
            return;
        }
        this.setState({ disabledSubmitButton: true });
        const url = window.location.pathname
        const id = this.props.id
        let formData = new FormData()
        switch (this.props.type) {
            case Constants.STATUS_NOT_APPROVED: // không phê duyệt
                this.disApprove(this.props.dataToSap, `${process.env.REACT_APP_REQUEST_URL}request/approve`, id)
                break;
            case Constants.STATUS_APPROVED: // phê duyệt
                this.approve(this.props.dataToSap,id)
                break;
            case Constants.STATUS_REVOCATION: // hủy
                this.revocation(id)
                break;
            case Constants.STATUS_EVICTION: // thu hồi phê duyệt
                this.eviction(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${id}/eviction`, id)
                break;
            case Constants.STATUS_CONSENTED: // thẩm định
                this.consent();
                break;
            case Constants.STATUS_NO_CONSENTED: // từ chối thẩm định
                this.reject();
                break;
            default:
                break;
        }
    }

    prepareDataForRevocation = () => {
        const dataToSap = [...this.props.dataToSap]
        const result = dataToSap.map(item => ({ ...item, ACTIO: 'DEL' }))
        return result
    }

    changeRequest = async (data, url, titleModalRes) => {
         return await axios({
            method: 'POST',
            url: url,
            data: data,
            headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
        })
            .then(res => {
                if (res && res.data) {
                    const result = res.data.result
                    const code = result.code
                    if (code == Constants.API_SUCCESS_CODE) {
                        this.showStatusModal(titleModalRes, result.message, res.data.data, true)
                        // this.props.updateTask(id,2)
                        // setTimeout(() => { this.hideStatusModal() }, 1000);
                    } else if (code == Constants.API_ERROR_NOT_FOUND_CODE) {
                        return window.location.href = map.NotFound
                    } else {
                        this.showStatusModal(this.props.t("Notification"), result.message,null, false)
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
    
    approve = (id) => {
        const dataPrepareToSap = [];
        const { t, dataToSap } = this.props
        const requestTypeIdsAllowedToReApproval = [Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP, Constants.SUBSTITUTION, Constants.IN_OUT_TIME_UPDATE]

        dataToSap.forEach(element => {
            let taskObj = {"id": element.requestTypeId == Constants.SUBSTITUTION || element.requestTypeId == Constants.IN_OUT_TIME_UPDATE || element.requestTypeId == Constants.CHANGE_DIVISON_SHIFT ? element.id : parseInt(element.id.split(".")[0]),"requestTypeId":element.requestTypeId,"sub":[]};
            // element.requestInfo.forEach(sub => {
                if (element.processStatusId == Constants.STATUS_WAITING || (element.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && (requestTypeIdsAllowedToReApproval.includes(element.requestTypeId)))) {
                    taskObj.sub.push({"id": element.id, "processStatusId": Constants.STATUS_APPROVED})
                }
            // });
            dataPrepareToSap.push(taskObj)
        });

        // let bodyFormData = new FormData()
        // bodyFormData.append('UserProfileInfoToSap', JSON.stringify(dataToSap))
        this.changeRequest(dataPrepareToSap, `${process.env.REACT_APP_REQUEST_URL}request/approve`, t("Trạng thái phê duyệt"))
    }

    disApprove = (formData, url, id) => {
        const dataToSap = [];
        this.props.dataToSap.forEach(element => {
            let taskObj = {"id": element.requestTypeId == Constants.SUBSTITUTION || element.requestTypeId == Constants.IN_OUT_TIME_UPDATE || element.requestTypeId == Constants.CHANGE_DIVISON_SHIFT ? element.id : parseInt(element.id.split(".")[0]),"requestTypeId":element.requestTypeId,"sub":[]};
            // element.requestInfo.forEach(sub => {
                if(element.processStatusId == Constants.STATUS_WAITING){
                    taskObj.sub.push({"id":element.id,"processStatusId": Constants.STATUS_NOT_APPROVED,"comment":this.state.message})
                }
            // });
            dataToSap.push(taskObj)
          });
        this.changeRequest(dataToSap,`${process.env.REACT_APP_REQUEST_URL}request/approve`,this.props.t("Trạng thái hủy phê duyệt"))
    }

    consent = () => {
        const dataToSap = [];
        this.props.dataToSap.forEach(element => {
            let taskObj = {};
            if(element.requestTypeId == Constants.ONBOARDING){
                taskObj = {"id":element.id ,"requestTypeId":element.requestTypeId,"sub":[]};
                taskObj.sub.push({"id":element.id,"processStatusId": element.processStatusId})
            } else {
                taskObj = {"id": element.requestTypeId == Constants.SUBSTITUTION || element.requestTypeId == Constants.IN_OUT_TIME_UPDATE || element.requestTypeId == Constants.CHANGE_DIVISON_SHIFT  ? element.id : parseInt(element.id.split(".")[0]),"requestTypeId":element.requestTypeId,"sub":[]};
                // element.requestInfo.forEach(sub => {
                    if(element.processStatusId == Constants.STATUS_WAITING_CONSENTED){
                        taskObj.sub.push({"id":element.id,"processStatusId": Constants.STATUS_WAITING})
                    }
                // });
            }
            dataToSap.push(taskObj)
          });
        this.changeRequest(dataToSap,`${process.env.REACT_APP_REQUEST_URL}request/assess`,this.props.t("Trạng thái thẩm định"))
    }

    reject = () => {
        const dataToSap = [];
        this.props.dataToSap.forEach(element => {
            let taskObj = {};
            if(element.requestTypeId == Constants.ONBOARDING){
                taskObj = {"id":element.id ,"requestTypeId":element.requestTypeId,"sub":[]};
                taskObj.sub.push({"id":element.id,"processStatusId": -1 ,"comment":this.state.message})
            }else{
                taskObj = {"id": element.requestTypeId == Constants.SUBSTITUTION || element.requestTypeId == Constants.IN_OUT_TIME_UPDATE || element.requestTypeId == Constants.CHANGE_DIVISON_SHIFT ? element.id : parseInt(element.id.split(".")[0]),"requestTypeId":element.requestTypeId,"sub":[]};
                // element.requestInfo.forEach(sub => {
                    if(element.processStatusId == Constants.STATUS_WAITING_CONSENTED){
                        taskObj.sub.push({"id":element.id,"processStatusId": Constants.STATUS_NO_CONSENTED,"comment":this.state.message})
                    }
                // });
            }

            dataToSap.push(taskObj)
          });
        
        this.changeRequest(dataToSap,`${process.env.REACT_APP_REQUEST_URL}request/assess`,this.props.t("Trạng thái hủy thẩm định"))
    }
    
    handleChangeMessage = (e) => {
        if(e.target.value) {
            this.setState({ message: e.target.value, errorMessage: null })
        }
        else {
            this.setState({ message: "", errorMessage: "Vui lòng nhập lý do" })
        }
    }

    showStatusModal = (title, message, data, isSuccess = false) => {
        this.setState({ isShowStatusModal: true, resultTitle: title, resultMessage: message,resultDetail: data, isSuccess: isSuccess })
        this.setState({ disabledSubmitButton: false });
    }

    hideStatusModal = () => {
        this.setState({ isShowStatusModal: false });
        window.location.reload();
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
                <ResultDetailModal show={this.state.isShowStatusModal} title={this.state.resultTitle} message={this.state.resultMessage} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} resultDetail={this.state.resultDetail}/>
                <Modal className='info-modal-common position-apply-modal' centered show={this.props.show} onHide={this.props.onHide}>
                    <Modal.Header className={`apply-position-modal ${backgroundColorMapping[this.props.type]}`} closeButton>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{this.props.message}</p>
                        {
                            this.props.type == Constants.STATUS_NOT_APPROVED ||  this.props.type == Constants.STATUS_NO_CONSENTED?
                                <div className="message">
                                    <textarea className="form-control" id="note" rows="4" value={this.state.message} onChange={this.handleChangeMessage}></textarea>
                                    <span className="text-danger">{this.state.errorMessage}</span>
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

export default withTranslation()(ConfirmRequestModal)
