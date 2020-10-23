import React from 'react'
import ConfirmationModal from './ConfirmationModal'

class DetailButtonComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            isConfirmShow: false,
            modalTitle: "",
            modalMessage: "",
            typeRequest: 1
        }

    }

    approval() {
        this.setState({ isConfirmShow: true, modalTitle: "Xác nhận phê duyệt", modalMessage: "Bạn có đồng ý phê duyệt không?", typeRequest: 2 })
    }

    disApproval() {
        this.setState({ isConfirmShow: true, modalTitle: "Xác nhận không phê duyệt", modalMessage: "Bạn có đồng ý không phê duyệt không?", typeRequest: 1 })
    }

    onHideModalConfirm() {
        this.setState({ isConfirmShow: false })
    }

    updateData() {
        this.props.updateData()
    }

    render() {
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
            />
            <div className="clearfix mt-5 mb-5">
                <button type="button" className="btn btn-success float-right ml-3 shadow" onClick={this.approval.bind(this)}>
                    <i className="fas fa-check" aria-hidden="true"></i> Phê duyệt</button>
                <button type="button" className="btn btn-danger float-right shadow" onClick={this.disApproval.bind(this)}><i className="fa fa-close"></i> Không duyệt</button>
            </div>
        </div>
    }
}

export default DetailButtonComponent