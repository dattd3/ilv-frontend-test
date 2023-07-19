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
            <div className="title">II. Nội dung đánh giá</div>
            <div className="list-evaluation">
            {
                (listEvaluation?.listTarget || []).map((target, i) => {
                    const isDisableInput = !isEdit || evaluationFormDetail.status == evaluation360Status.completed
                    return (
                        <div className="evaluation-item" key={i}>
                            <div dangerouslySetInnerHTML={{
                                __html: purify.sanitize(target?.metric1 || ''),
                                }}
                                className="matrix-info" 
                            />
                            <div dangerouslySetInnerHTML={{
                                __html: purify.sanitize(`${i + 1}. ${JSON.parse(target?.targetName || '{}')[languageCodeMapping[currentLocale]]}`),
                                }}
                                className="title" 
                            />
                            <div className="score">
                                <div className="item">
                                    <span className="label">Điểm đánh giá</span>
                                    <select onChange={(e) => handleInputChange(i, 'seftPoint', e)} value={target?.seftPoint || ''} disabled={isDisableInput}>
                                        <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                        {
                                        (scores || []).map((score, i) => {
                                            return <option value={score} key={i}>{score}</option>
                                        })
                                        }
                                        </select>
                                </div>
                            </div>
                            <div className="comment">
                                <div className="self">
                                    <p>{t("EvaluationDetailPartAttitudeCommentOfEmployee")}</p>
                                    {
                                    isDisableInput
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