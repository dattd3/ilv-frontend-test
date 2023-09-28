import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from 'axios'
import LoadingModal from 'components/Common/LoadingModal'
import StatusModal from 'components/Common/StatusModal'
import IconArrowRightWhite from 'assets/img/icon/pms/arrow-right-white.svg'
import IconArrowRightGray from 'assets/img/icon/pms/arrow-right-gray.svg'
import IconSave from 'assets/img/ic-save.svg'
import IconSendRequest from 'assets/img/icon/Icon_send.svg'
import IconReject from 'assets/img/icon/Icon_Cancel.svg'
import IconApprove from 'assets/img/icon/Icon_Check.svg'
import EvaluationOverall from "../common/EvaluationOverall"
import EvaluationSteps from "../common/EvaluationSteps"
import EvaluationEmployeeInfo from "../common/EvaluationEmployeeInfo"

const VinFastForm = (props) => {
    const { t } = useTranslation()
    const { evaluationFormDetail, showByManager } = props
    const [isLoading, SetIsLoading] = useState(false)
    const [statusModal, SetStatusModal] = useState({ isShow: false, isSuccess: true, content: "", needReload: true })

    const onHideStatusModal = () => {

    }

    return (
        <>
            <LoadingModal show={isLoading} />
            <StatusModal 
                show={statusModal.isShow} 
                isSuccess={statusModal.isSuccess} 
                content={statusModal.content} 
                className="evaluation-status-modal"
                onHide={onHideStatusModal} 
            />
            <EvaluationOverall 
                status={evaluationFormDetail?.status}
                reviewStreamCode={evaluationFormDetail?.reviewStreamCode}
                formType={evaluationFormDetail?.formType}
                showByManager={showByManager}
                totalTarget={evaluationFormDetail?.totalTarget}
                listGroup={evaluationFormDetail?.groups}
                seftTotalComplete={evaluationFormDetail?.seftTotalComplete}
                leadReviewTotalComplete={evaluationFormDetail?.leadReviewTotalComplete}
                totalSeftPoint={evaluationFormDetail?.totalSeftPoint}
                totalLeadReviewPoint={evaluationFormDetail?.totalLeadReviewPoint}
            />

            <div className="card shadow evaluation-process" style={evaluationFormDetail?.formType === 'OFF' ? { display: 'none' } : {}} >
                <div className="title">{t("EvaluationDetailASSESSMENTPROCESS")}</div>
                <div className="step-block">
                    <EvaluationSteps
                        status={evaluationFormDetail?.status}
                        reviewStreamCode={evaluationFormDetail?.reviewStreamCode}
                    />
                </div>
                <div className="employee-info-block">
                    <EvaluationEmployeeInfo
                    
                    />
                </div>

                {/*{ renderFormMainInfo(evaluationFormDetail?.companyCode) } */}
            </div>
        </>
    )
}

export default VinFastForm
