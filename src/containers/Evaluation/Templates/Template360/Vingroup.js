import React from "react"
import { useTranslation } from "react-i18next"
import _ from 'lodash'
import purify from "dompurify"
import { evaluation360Status, languageCodeMapping } from "../../Constants"

const VinGroup = ({ evaluationFormDetail, isEdit, currentLocale, errors, handleInputChange }) => {
    const { t } = useTranslation()
    const listEvaluation = evaluationFormDetail?.listGroup[1] // Lấy item thứ 2
    const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    return (
        <div className={`part-block`}>
            <div className="title">II. {t("ContentsOfAssessment")}</div>
            <div className="list-evaluation">
            {
                (listEvaluation?.listTarget || []).map((target, i) => {
                    const isCompleted = evaluationFormDetail.status == evaluation360Status.completed || evaluationFormDetail.status == evaluation360Status.evaluated
                    const isDisableInput = !isEdit || isCompleted
                    return (
                        <div className="evaluation-item" key={i}>
                            {
                                target?.metric1 !== null && target?.metric1?.trim() !== '' && (
                                    <div dangerouslySetInnerHTML={{
                                        __html: purify.sanitize(target?.metric1 || ''),
                                        }}
                                        className="matrix-info" 
                                    />
                                )
                            }
                            {
                                target?.kpiGroup !== null && target?.kpiGroup?.trim() !== '' && (
                                    <div dangerouslySetInnerHTML={{
                                        __html: purify.sanitize(target?.kpiGroup || ''),
                                        }}
                                        className="matrix-info font-weight-bold" 
                                    />
                                )
                            }
                            <div dangerouslySetInnerHTML={{
                                __html: purify.sanitize(`${i + 1}. ${JSON.parse(target?.targetName || '{}')[languageCodeMapping[currentLocale]]}`),
                                }}
                                className="title font-weight-normal" 
                            />
                            <div className="score">
                                <div className="item">
                                    <span className="label">{t("EvaluationScore")}</span>
                                    {
                                        isCompleted
                                        ? (<div className="score-label">{parseInt(target?.seftPoint) === 0 ? 'N/A' : (target?.seftPoint ?? '')}</div>)
                                        : (
                                            <select onChange={(e) => handleInputChange(i, 'seftPoint', e)} value={target?.seftPoint ?? ''} disabled={isDisableInput}>
                                                <option value=''>{t("Select")}</option>
                                                {
                                                    (scores || []).map((score, i) => {
                                                        return <option value={score} key={i}>{score === 0 ? 'N/A' : score}</option>
                                                    })
                                                }
                                            </select>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="comment">
                                <div className="self">
                                    <p>{t("Opinion")}</p>
                                    {
                                    isCompleted
                                    ? <div className="comment-content" dangerouslySetInnerHTML={{
                                        __html: purify.sanitize(target?.seftOpinion || ""),
                                        }} />
                                    : <textarea 
                                        rows={3} 
                                        placeholder={t("EvaluationDetailPartSelectScoreInput")} 
                                        value={target?.seftOpinion || ""} 
                                        onChange={(e) => handleInputChange(i, 'seftOpinion', e)} 
                                        disabled={isDisableInput} />
                                    }
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}

export default VinGroup