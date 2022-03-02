import React from "react"
import { Modal, Button } from 'react-bootstrap'
import { withTranslation } from "react-i18next"

class ConfirmModal extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { t, show, confirmHeader, confirmContent, onHide, onCancelClick, onAcceptClick, tempButtonLabel, mainButtonLabel, modalClassName } = this.props
        return (
            <Modal backdrop="static" keyboard={false}
                className={modalClassName ? `info-modal-common position-apply-modal ${modalClassName}` : 'info-modal-common position-apply-modal'}
                centered show={show}
                onHide={onHide}
            >
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>{confirmHeader}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="wrap-result text-left">{confirmContent}</p>
                    <div className="clearfix edit-button text-right">
                        <Button variant="secondary" className="pr-4 pl-4" onClick={onCancelClick}>{tempButtonLabel ? tempButtonLabel : t("No")}</Button>
                        <Button variant="primary" className="pr-4 pl-4" onClick={onAcceptClick}>{mainButtonLabel ? mainButtonLabel : t("Yes")}</Button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

export default withTranslation()(ConfirmModal)
