import React from "react";
import { Modal } from 'react-bootstrap'
import EvaluationDetail from './Detail/index'

function EvaluationDetailModal(props) {
    const { isShow, evaluationFormId, formCode, employeeCode, onHide} = props
    
    const updateParent = (statusModal) => {
        onHide(statusModal)
    }

    return (
        <Modal 
            backdrop="static" 
            keyboard={false}
            className={'evaluation-detail-modal'}
            centered 
            show={isShow}
            onHide={onHide}
        >
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <EvaluationDetail 
                    showByManager={true} 
                    evaluationFormId={evaluationFormId} 
                    formCode={formCode} 
                    employeeCode={employeeCode}
                    updateParent={updateParent} />
            </Modal.Body>
        </Modal>
    )
}

export default EvaluationDetailModal
