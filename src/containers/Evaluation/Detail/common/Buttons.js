import { useTranslation } from "react-i18next"
import { evaluationStatus, actionButton } from '../../Constants'
import IconSave from 'assets/img/ic-save.svg'
import IconSendRequest from 'assets/img/icon/Icon_send.svg'
import IconReject from 'assets/img/icon/Icon_Cancel.svg'
import IconApprove from 'assets/img/icon/Icon_Check.svg'

const Buttons = ({ showByManager, status, isEdit, reviewer, approver, handleSubmit }) => {
    const { t } = useTranslation()
    const currentUserLoggedUID = localStorage.getItem('employeeNo')
    const reviewerUID = JSON.parse(reviewer || '{}')?.uid
    const approverUID = JSON.parse(approver || '{}')?.uid

    if (!isEdit) return null

    switch (status) {
        case evaluationStatus.launch:
            return (
                <>
                    <button className="btn-action save" onClick={() => handleSubmit(actionButton.save, null, false)}><img src={IconSave} alt="Save" />{t("EvaluationDetailPartSave")}</button>
                    <button className="btn-action send" onClick={() => handleSubmit(actionButton.approve)}><img src={IconSendRequest} alt="Send" />{t("EvaluationDetailPartSubmitToNextStep")}</button>
                </>
            )
        case evaluationStatus.selfAssessment:
            if (showByManager && currentUserLoggedUID == reviewerUID) {
                return (
                    <>
                        <button className="btn-action save mr-3" onClick={() => handleSubmit(actionButton.save, null, false)}><img src={IconSave} alt="Save" />{t("EvaluationDetailPartSave")}</button>
                        <button className="btn-action reject" onClick={() => handleSubmit(actionButton.reject, null, false)}><img src={IconReject} alt="Reject" />{t("EvaluationDetailPartReject")}</button>
                        <button className="btn-action confirm" onClick={() => handleSubmit(actionButton.approve)}><img src={IconApprove} alt="Confirm" />{t("EvaluationDetailPartConfirm")}</button>
                    </>
                )
            }
            return null
        case evaluationStatus.qlttAssessment:
            if (showByManager && currentUserLoggedUID == approverUID) {
                return (
                    <>
                        <button className="btn-action reject" onClick={() => handleSubmit(actionButton.reject, null, false)}><img src={IconReject} alt="Reject" />{t("EvaluationDetailPartReject")}</button>
                        <button className="btn-action approve" onClick={() => handleSubmit(actionButton.approve, true)}><img src={IconApprove} alt="Approve" />{t("EvaluationDetailPartApprove")}</button>
                    </>
                )
            }
            return null
        default:
            return null
    }
}

export default Buttons
