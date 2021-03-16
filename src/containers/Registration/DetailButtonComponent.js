import React from 'react'
import ConfirmationModal from './ConfirmationModal'
import Constants from '../.../../../commons/Constants'

class DetailButtonComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            isConfirmShow: false,
            modalTitle: "",
            modalMessage: "",
            typeRequest: 1
        }

        this.requestRegistraion = {
            2: "Đăng ký nghỉ",
            3: "Đăng ký Công tác/Đào tạo",
            4: "Thay đổi phân ca",
            5: "Sửa giờ vào - ra"
        }
    }

    approval = () => {
        this.setState({ isConfirmShow: true, modalTitle: "Xác nhận phê duyệt", modalMessage: "Bạn có đồng ý phê duyệt " + this.requestRegistraion[this.props.requestTypeId] + " này ?", typeRequest: Constants.STATUS_APPROVED })
    }

    disApproval = () => {
        this.setState({ isConfirmShow: true, modalTitle: "Xác nhận không phê duyệt", modalMessage: "Lý do không phê duyệt (Bắt buộc)", typeRequest: Constants.STATUS_NOT_APPROVED })
    }

    revocationApproval = () => {
        this.setState({ isConfirmShow: true, modalTitle: "Xác nhận thu hồi phê duyệt", modalMessage: "Bạn có đồng ý thu hồi phê duyệt " + this.requestRegistraion[this.props.requestTypeId] + " này ?", typeRequest: Constants.STATUS_REVOCATION })
    }

    evictionRequest = () => {
        this.setState({ isConfirmShow: true, modalTitle: "Xác nhận thu hồi yêu cầu", modalMessage: "Bạn có đồng ý thu hồi yêu cầu " + this.requestRegistraion[this.props.requestTypeId] + " này ?", typeRequest: Constants.STATUS_EVICTION })
    }

    onHideModalConfirm() {
        this.setState({ isConfirmShow: false })
    }

    updateData() {
        this.props.updateData()
    }

    getAction = () => {
        const pathName = window.location.pathname
        const pathNameArr = pathName.split('/')
        return pathNameArr[pathNameArr.length - 1]
    }
    updateTaskStatus = (id, status) =>{
        setTimeout(() => {  window.location.reload(); }, 1000);
       
    }

    render() {
        const action = this.getAction()

        return <div className="bottom">
            <ConfirmationModal
                urlName={this.props.urlName}
                dataToSap={this.props.dataToSap}
                id={this.props.id}
                show={this.state.isConfirmShow}
                title={this.state.modalTitle}
                type={this.state.typeRequest}
                updateData={this.updateData.bind(this)}
                message={this.state.modalMessage}
                onHide={this.onHideModalConfirm.bind(this)}
                updateTask = {this.updateTaskStatus}
            />
            {
            action === "approval" ?
            <div className="clearfix mt-5 mb-5">
                {
                    !this.props.isShowRevocationOfApproval ?
                    <>
                    <button type="button" className="btn btn-success float-right ml-3 shadow" onClick={this.approval.bind(this)}>
                        <i className="fas fa-check" aria-hidden="true"></i> Phê duyệt</button>
                    <button type="button" className="btn btn-danger float-right shadow" onClick={this.disApproval.bind(this)}><i className="fa fa-close"></i> Không duyệt</button>
                    </>
                    : null
                }
                {
                    this.props.isShowRevocationOfApproval && !this.props.hiddenRevocationOfApprovalButton ?
                    <button type="button" className="btn btn-danger float-right shadow" onClick={this.revocationApproval.bind(this)}><i className='fas fa-undo-alt'></i> Thu hồi phê duyệt</button>
                    : null
                }
            </div>
            : null
            }
            {
                action === "request" && this.props.isShowEvictionRequest ?
                <div className="clearfix mt-5 mb-5">
                    <button type="button" className="btn btn-danger float-right shadow" onClick={this.evictionRequest.bind(this)}><i className='fas fa-undo-alt'></i> Thu hồi yêu cầu</button>
                </div>
                : null
            }
        </div>
    }
}

export default DetailButtonComponent
