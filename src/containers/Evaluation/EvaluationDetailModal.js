import React from "react";
import { Modal } from 'react-bootstrap'
import EvaluationDetail from './Detail/index'
import Evaluation360 from "./Detail/Evaluation360"

function EvaluationDetailModal(props) {
    const { isShow, showByManager, evaluationFormId, formCode, employeeCode, version, isEvaluation360, onHide} = props
    
    const updateParent = (statusModal, keepPopupEvaluationDetail = false) => {
        onHide(statusModal, keepPopupEvaluationDetail)
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
                {
                    isEvaluation360 
                    ? (
                        <Evaluation360 
                            evaluationFormId={evaluationFormId} 
                            formCode={formCode} 
                            employeeCode={employeeCode} />
                    )
                    : (
                        <EvaluationDetail 
                            showByManager={showByManager} 
                            evaluationFormId={evaluationFormId} 
                            formCode={formCode} 
                            employeeCode={employeeCode}
                            version={version}
                            updateParent={updateParent} />
                    ) 
                }
            </Modal.Body>
        </Modal>
    )
}

export default EvaluationDetailModal
