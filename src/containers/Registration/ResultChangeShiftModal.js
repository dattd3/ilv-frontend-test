import React from "react"
import { Modal } from 'react-bootstrap'

class ResultChangeShiftModal extends React.Component {
    constructor(props) {
        super();
    }

    render () {
        return (
            <Modal className='info-modal-common position-apply-modal' centered show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="wrap-result">
                        <div className="result-box">
                            <table className="table">
                            <tr>
                                <td colSpan="2" className="text-center">Tổng số bản ghi: <strong>{this.props.result.total}</strong></td>
                            </tr>
                            <tr>
                                <td className="text-center"><i className="fas fa-check mr-1 text-success"></i> Thành công: <strong className="text-success">{this.props.result.success}</strong></td>
                                <td className="text-center"><i className="fas fa-times mr-1 text-danger"></i> Không thành công: <strong className="text-danger">{this.props.result.fail}</strong></td>
                            </tr>
                            </table>
                        </div>
                    </div>
    
                </Modal.Body>
            </Modal>
        )
    }
}

export default ResultChangeShiftModal
