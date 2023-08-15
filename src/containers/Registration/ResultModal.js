import React from "react"
import { Modal, Image } from 'react-bootstrap'
import IconSuccess from '../../assets/img/ic-success.svg'
import IconFailed from '../../assets/img/ic-failed.svg'
import IconWarning from 'assets/img/icon/Icon-warning-orange.svg'

class ResultModal extends React.Component {
    constructor(props) {
        super();
    }

    render () {
        const { show, title, message, isSuccess, isWarningCreateRequest } = this.props

        return (
            <Modal className='info-modal-common position-apply-modal result-modal' centered show={show} onHide={this.props.onHide}>
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="wrap-result">
                        <p className="text-center">{message}</p>
                        {
                            isWarningCreateRequest
                            ? <Image src={IconWarning} alt="Warning" className="ic-status" />
                            : isSuccess ? <Image src={IconSuccess} alt="Success" className="ic-status" /> : <Image src={IconFailed} alt="Failed" className="ic-status" />
                        }
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

export default ResultModal
