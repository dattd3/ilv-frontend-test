import React from "react"
import { useTranslation } from "react-i18next"
import _ from 'lodash'
import purify from "dompurify"
import { formatIndexText, formatTargetText } from '../Utils'
import { formType, groupConfig, languageCodeMapping } from '../Constants'
import Constants from '../../../commons/Constants' 

const EvaluationVinBusTemplate = ({ evaluationFormDetail, isEdit, showByManager, evaluationStatus, currentLocale, errors, handleInputChange }) => {
    const { t } = useTranslation()

    // Hiển thị thông tin chính của form đánh giá
    const renderEvaluationItem = (item, index, scores, target, i, deviant, parentIndex, subGroupTargetIndex) => {
        // index => index của từng phần (Tinh thần thái độ hoặc Kết quả công việc)
        // i = 0 Nếu Biểu mẫu giành cho CBLĐ hoặc Nhân viên thuộc Vinmec. Ngược lại = index của item trong listTarget level 0 (ngang cấp Tinh thần thái độ hoặc Kết quả công việc)
        // parentIndex = index của item trong listTarget level 0 (ngang cấp Tinh thần thái độ hoặc Kết quả công việc) nếu Biểu mẫu giành cho CBLĐ hoặc Nhân viên thuộc Vinmec. Ngược lại = null
        // subGroupTargetIndex = index của item nằm trong listTarget sâu nhất nếu Biểu mẫu giành cho CBLĐ hoặc Nhân viên thuộc Vinmec. Ngược lại = null

        // const isChild = !_.isNil(parentIndex);
        const isChild = parentIndex !== null && parentIndex !== undefined && parentIndex !== ''
        const isDisableEmployeeComment = isEdit ? (showByManager || evaluationFormDetail.status != evaluationStatus.launch) : true
        const isDisableManagerComment = isEdit ? (!showByManager || (showByManager && Number(evaluationFormDetail.status) >= Number(evaluationStatus.qlttAssessment))) : true

        return (
            <div className="evaluation-item" key={target.id}>
                {
                    !isChild 
                    ? <div className="title">{`${i + 1}. ${JSON.parse(target?.targetName || '{}')[languageCodeMapping[currentLocale]]}`}</div> // 1 level
                    : <div className="sub-title">{`${parentIndex + 1}.${subGroupTargetIndex + 1} ${JSON.parse(target?.targetName || '{}')[languageCodeMapping[currentLocale]]}`}</div> // 2 level
                }
                <div className="wrap-score-table">
                    <table className='vin-bus'>
                        <thead>
                            <tr>
                                <th className="measurement"><span>{t("EvaluationDetailPartLevelOfPerformance")}<span className="note">({t("EvaluationDetailPartByScore")})</span></span></th>
                                <th className="text-center proportion"><span>{t("EvaluationDetailPartWeight")} %</span></th>
                                <th className="text-center target"><span>{t("EvaluationDetailPartTarget")}</span></th>
                                <th className="text-center self-assessment"><span>{t("ActualResult_SelfAssess")}</span>{!showByManager && <span className="required">(*)</span>}</th>
                                <th className="text-center qltt-assessment"><span>{t("ActualResult_ManagerAssess")}</span>{!showByManager && <span className="required">(*)</span>}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="measurement">
                                    {   
                                    target?.jobDetail && 
                                    <ul className="first">
                                        <li>{target?.jobDetail}</li>
                                    </ul>
                                    }
                                    <ul className="second">
                                        <li>{!target?.metric1 ? '--' : target?.metric1}</li>
                                        <li>{!target?.metric2 ? '--' : target?.metric2}</li>
                                        <li>{!target?.metric3 ? '--' : target?.metric3}</li>
                                        <li>{!target?.metric4 ? '--' : target?.metric4}</li>
                                        <li>{!target?.metric5 ? '--' : target?.metric5}</li>
                                    </ul>
                                </td>
                                <td className="text-center proportion"><span>{target?.weight}%</span></td>
                                <td className="text-center target"><span>{target?.target}</span></td>
                                <td className="self-assessment">
                                    <div className="data">
                                    {
                                        !showByManager && evaluationFormDetail.status == evaluationStatus.launch && isEdit
                                        ?
                                        <>
                                            <div>
                                                <input 
                                                    className="value" 
                                                    type="text" 
                                                    placeholder={t("Nhập 0 - 100")} 
                                                    value={target?.realResult === null || target?.realResult === undefined ? "" : target?.realResult} 
                                                    onChange={(e) => !_.isNil(subGroupTargetIndex) ? handleInputChange(parentIndex, index, 'realResult', e, subGroupTargetIndex) : handleInputChange(i, index, 'realResult', e)} />
                                            </div>
                                            {errors[`${index}_${i}_realResult`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_realResult`]}</div>}
                                            <div>
                                                <span className="value label">{target?.seftPoint === null || target?.seftPoint === undefined ? "" : target?.seftPoint}</span>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div>
                                                <span className="value label">{target?.realResult === null || target?.realResult === undefined ? "" : target?.realResult}</span>
                                            </div>
                                            <div>
                                                <span className="value label">{target?.seftPoint === null || target?.seftPoint === undefined ? "" : target?.seftPoint}</span>
                                            </div>
                                        </>
                                    }
                                    </div>
                                </td>
                                <td className="text-center qltt-assessment">
                                    <div className="data">
                                    {
                                        showByManager && evaluationFormDetail.status == evaluationStatus.selfAssessment && isEdit
                                        ?
                                        <>
                                            <div>
                                                <input 
                                                    className="value" 
                                                    type="text" 
                                                    placeholder={t("Nhập 0 - 100")} 
                                                    value={target?.leadRealResult === null || target?.leadRealResult === undefined ? "" : target?.leadRealResult} 
                                                    onChange={(e) => !_.isNil(subGroupTargetIndex) ? handleInputChange(parentIndex, index, 'leadRealResult', e, subGroupTargetIndex) : handleInputChange(i, index, 'leadRealResult', e)} />
                                            </div>
                                            {errors[`${index}_${i}_leadRealResult`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_leadRealResult`]}</div>}
                                            <div>
                                                <span className="value label">{target?.leadReviewPoint === null || target?.leadReviewPoint === undefined ? "" : target?.leadReviewPoint}</span>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div>
                                                <span className="value label">{target?.leadRealResult === null || target?.leadRealResult === undefined ? "" : target?.leadRealResult}</span>
                                            </div>
                                            <div>
                                                <span className="value label">{target?.leadReviewPoint === null || target?.leadReviewPoint === undefined ? "" : target?.leadReviewPoint}</span>
                                            </div>
                                        </>
                                    }
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="comment">
                    <div className="self">
                    <p>{t("EvaluationDetailPartAttitudeCommentOfEmployee")}</p>
                    {
                        isDisableEmployeeComment
                        ? <div className="comment-content" dangerouslySetInnerHTML={{
                            __html: purify.sanitize(target?.seftOpinion || ""),
                        }} />
                        : <textarea 
                            rows={3} 
                            placeholder={isEdit ? !(showByManager || evaluationFormDetail.status != evaluationStatus.launch) ? t("EvaluationDetailPartSelectScoreInput") : '' : ''} 
                            value={target?.seftOpinion || ""} 
                            onChange={(e) => !_.isNil(subGroupTargetIndex) ? handleInputChange(parentIndex, index, 'seftOpinion', e, subGroupTargetIndex) : handleInputChange(i, index, 'seftOpinion', e)} 
                            disabled={isDisableEmployeeComment} />
                    }
                    </div>
                    <div className="qltt">
                    <p>{t("EvaluationDetailPartAttitudeCommentOfManager")}</p>
                    {
                        isDisableManagerComment
                        ? <div className="comment-content" dangerouslySetInnerHTML={{
                            __html: purify.sanitize(target?.leaderReviewOpinion || ""),
                        }} />
                        : <textarea 
                            rows={3} 
                            placeholder={isEdit ? !(!showByManager || (showByManager && Number(evaluationFormDetail.status) >= Number(evaluationStatus.qlttAssessment))) ? t("EvaluationDetailPartSelectScoreInput") : '' : ''} 
                            value={target?.leaderReviewOpinion || ""} 
                            onChange={(e) => !_.isNil(subGroupTargetIndex) ? handleInputChange(parentIndex, index, 'leaderReviewOpinion', e, subGroupTargetIndex) : handleInputChange(i, index, "leaderReviewOpinion", e)} 
                            disabled={isDisableManagerComment} />
                    }
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
        {
            (evaluationFormDetail?.listGroup || []).map((item, index) => {
                let indexText = formatIndexText(index + 1)
                let scores = [1, 2, 3, 4, 5]
                let isAttitudeBlock = item?.groupTargetCode === groupConfig.ATTITUDE
                const isDisableEmployeeComment = isEdit ? (showByManager || evaluationFormDetail.status != evaluationStatus.launch) : true
                const isDisableManagerComment = isEdit ? (!showByManager || (showByManager && Number(evaluationFormDetail.status) >= Number(evaluationStatus.qlttAssessment))) : true

                return (
                    <div className={`part-block ${isAttitudeBlock ? 'attitude' : 'work-result'}`} key={index}>
                        <div className="title">{`${t("EvaluationDetailPart")} ${indexText} - ${JSON.parse(item?.groupName || '{}')[languageCodeMapping[currentLocale]]}`} <span className="red">({item?.groupWeight || 0}%)</span></div>
                        <div className="list-evaluation">
                        {
                            (item?.listTarget || []).map((target, i) => {
                                let deviant = (target?.leadReviewPoint === '' || target?.leadReviewPoint === null || target?.seftPoint === '' || target?.seftPoint === null) ? '' : Number(target?.leadReviewPoint) - Number(target?.seftPoint)

                                if (evaluationFormDetail?.formType == formType.EMPLOYEE) { // Tinh thần thái độ cho Nhân viên
                                    return renderEvaluationItem(item, index, scores, target, i, deviant)
                                }
                                
                                if (isAttitudeBlock) { // Tinh thần thái độ cho CBLĐ
                                    return (
                                        <div className="evaluation-sub-group" key={`sub-group-${i}`}>
                                            <div className='sub-group-name'>{`${i + 1}. ${JSON.parse(target?.groupName || '{}')[languageCodeMapping[currentLocale]]}`} <span className="red">({target.groupWeight}%)</span></div>
                                            <div className="sub-group-targets">
                                                {(target.listTarget || []).map((childTarget, childIndex) => {
                                                let deviant = (childTarget?.leadReviewPoint === '' || childTarget?.leadReviewPoint === null || childTarget?.seftPoint === '' || childTarget?.seftPoint === null) ? '' : Number(childTarget?.leadReviewPoint) - Number(childTarget?.seftPoint)
                                                return <React.Fragment key={childIndex}>
                                                    {renderEvaluationItem(item, index, scores, childTarget, 0, deviant, i, childIndex)}
                                                    <div className="divider" />
                                                </React.Fragment>
                                                })}
                                            </div>
                                        </div>
                                    )
                                }

                                // Kết quả công việc
                                return (
                                    <div className="evaluation-item" key={i}>
                                        <div className="title">{`${i + 1}. ${JSON.parse(target?.targetName || '{}')[languageCodeMapping[currentLocale]]}`}</div>
                                        <div className="wrap-score-table">
                                            <table className='vin-bus'>
                                                <thead>
                                                    <tr>
                                                        <th className="measurement"><span>{t("EvaluationDetailPartLevelOfPerformance")}<span className="note">({t("EvaluationDetailPartByScore")})</span></span></th>
                                                        <th className="text-center proportion"><span>{t("EvaluationDetailPartWeight")} %</span></th>
                                                        <th className="text-center target"><span>{t("EvaluationDetailPartTarget")}</span></th>
                                                        <th className="text-center self-assessment"><span>{t("ActualResult_SelfAssess")}</span>{!showByManager && <span className="required">(*)</span>}</th>
                                                        <th className="text-center qltt-assessment"><span>{t("ActualResult_ManagerAssess")}</span>{!showByManager && <span className="required">(*)</span>}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="measurement">
                                                            {   
                                                            target?.jobDetail && 
                                                            <ul className="first">
                                                                <li>{target?.jobDetail}</li>
                                                            </ul>
                                                            }
                                                            <ul className="second">
                                                                <li>{!target?.metric1 ? '--' : target?.metric1}</li>
                                                                <li>{!target?.metric2 ? '--' : target?.metric2}</li>
                                                                <li>{!target?.metric3 ? '--' : target?.metric3}</li>
                                                                <li>{!target?.metric4 ? '--' : target?.metric4}</li>
                                                                <li>{!target?.metric5 ? '--' : target?.metric5}</li>
                                                            </ul>
                                                        </td>
                                                        <td className="text-center proportion"><span>{target?.weight}%</span></td>
                                                        <td className="text-center target"><span>{target?.target}</span></td>
                                                        <td className="self-assessment">
                                                            <div className="data">
                                                            {
                                                                !showByManager && evaluationFormDetail.status == evaluationStatus.launch && isEdit
                                                                ?
                                                                <>
                                                                    <div>
                                                                        <input 
                                                                            className="value" 
                                                                            type="text" 
                                                                            placeholder={t("Nhập 0 - 100")} 
                                                                            value={target?.realResult === null || target?.realResult === undefined ? "" : target?.realResult} 
                                                                            onChange={(e) => handleInputChange(i, index, 'realResult', e)} />
                                                                    </div>
                                                                    {errors[`${index}_${i}_realResult`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_realResult`]}</div>}
                                                                    <div>
                                                                        <span className="value label">{target?.seftPoint === null || target?.seftPoint === undefined ? "" : target?.seftPoint}</span>
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    <div>
                                                                        <span className="value label">{target?.realResult === null || target?.realResult === undefined ? "" : target?.realResult}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="value label">{target?.seftPoint === null || target?.seftPoint === undefined ? "" : target?.seftPoint}</span>
                                                                    </div>
                                                                </>
                                                            }
                                                            </div>
                                                        </td>
                                                        <td className="text-center qltt-assessment">
                                                            <div className="data">
                                                            {
                                                                showByManager && evaluationFormDetail.status == evaluationStatus.selfAssessment && isEdit
                                                                ?
                                                                <>
                                                                    <div>
                                                                        <input 
                                                                            className="value" 
                                                                            type="text" 
                                                                            placeholder={t("Nhập 0 - 100")} 
                                                                            value={target?.leadRealResult === null || target?.leadRealResult === undefined ? "" : target?.leadRealResult} 
                                                                            onChange={(e) => handleInputChange(i, index, 'leadRealResult', e)} />
                                                                    </div>
                                                                    {errors[`${index}_${i}_leadRealResult`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_leadRealResult`]}</div>}
                                                                    <div>
                                                                        <span className="value label">{target?.leadReviewPoint === null || target?.leadReviewPoint === undefined ? "" : target?.leadReviewPoint}</span>
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    <div>
                                                                        <span className="value label">{target?.leadRealResult === null || target?.leadRealResult === undefined ? "" : target?.leadRealResult}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="value label">{target?.leadReviewPoint === null || target?.leadReviewPoint === undefined ? "" : target?.leadReviewPoint}</span>
                                                                    </div>
                                                                </>
                                                            }
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="comment">
                                            <div className="self">
                                                <p>{t("EvaluationDetailPartAttitudeCommentOfEmployee")}</p>
                                                {
                                                isDisableEmployeeComment
                                                ? <div className="comment-content" dangerouslySetInnerHTML={{
                                                    __html: purify.sanitize(target?.seftOpinion || ""),
                                                    }} />
                                                : <textarea 
                                                    rows={3} 
                                                    placeholder={isEdit ? !(showByManager || evaluationFormDetail.status != evaluationStatus.launch) ? t("EvaluationDetailPartSelectScoreInput") : '' : ''} 
                                                    value={target?.seftOpinion || ""} 
                                                    onChange={(e) => handleInputChange(i, index, 'seftOpinion', e)} 
                                                    disabled={isDisableEmployeeComment} />
                                                }
                                            </div>
                                            <div className="qltt">
                                                <p>{t("EvaluationDetailPartAttitudeCommentOfManager")}</p>
                                                {
                                                isDisableManagerComment
                                                ? <div className="comment-content" dangerouslySetInnerHTML={{
                                                    __html: purify.sanitize(target?.leaderReviewOpinion || ""),
                                                    }} />
                                                : <textarea 
                                                    rows={3} 
                                                    placeholder={isEdit ? !(!showByManager || (showByManager && Number(evaluationFormDetail.status) >= Number(evaluationStatus.qlttAssessment))) ? t("EvaluationDetailPartSelectScoreInput") : '' : ''} 
                                                    value={target?.leaderReviewOpinion || ""} 
                                                    onChange={(e) => handleInputChange(i, index, "leaderReviewOpinion", e)} 
                                                    disabled={isDisableManagerComment} />
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
            })
        }
        </>
    )
}

export default EvaluationVinBusTemplate
