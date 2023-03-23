import React, { useState, useEffect, useRef } from "react"
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import _ from 'lodash'
import purify from "dompurify"
import { formatIndexText, formatTargetText } from '../Utils'
import { formType } from '../Constants'
import Constants from '../../../commons/Constants'
import IconUp from '../../../assets/img/icon/pms/icon-up.svg'
import IconDown from '../../../assets/img/icon/pms/icon-down.svg'

const VinGroup = ({ evaluationFormDetail, isEdit, showByManager, evaluationStatus, currentLocale, languageCodeMapping, errors, handleInputChange }) => {
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
            {
                item?.listGroupConfig && item?.listGroupConfig?.length > 0 ?
                <div className="score-block">
                    <div className="self attitude-score">
                    <div className="item">
                        <span className="red label">{t("EvaluationDetailPartAttitudeSelfAssessment")}{!showByManager && <span className="required">(*)</span>}</span>
                        {
                        !showByManager && evaluationFormDetail.status == evaluationStatus.launch && isEdit
                            ?
                            <select onChange={(e) => !_.isNil(subGroupTargetIndex) ? handleInputChange(parentIndex, index, 'seftPoint', e, subGroupTargetIndex) : handleInputChange(i, index, 'seftPoint', e)} value={target?.seftPoint || ''}>
                            <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                            {
                                (scores || []).map((score, i) => {
                                return <option value={score} key={i}>{score}</option>
                                })
                            }
                            </select>
                            : <input type="text" value={target?.seftPoint || ''} disabled />
                        }
                    </div>
                    {
                        !isChild
                        ? errors[`${index}_${i}_seftPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_seftPoint`]}</div>
                        : errors[`${index}_${parentIndex}_${subGroupTargetIndex}_seftPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${parentIndex}_${subGroupTargetIndex}_seftPoint`]}</div>
                    }
                    {/* {errors[`${index}_${i}_seftPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_seftPoint`]}</div>} */}
                    </div>
                    <div className="qltt attitude-score">
                    <div className="item">
                        <span className="red label">{t("EvaluationDetailPartAttitudeManagerAssessment")}{showByManager && <span className="required">(*)</span>}</span>
                        {
                        !(!showByManager || (showByManager && Number(evaluationFormDetail.status) >= Number(evaluationStatus.qlttAssessment))) && isEdit
                            ?
                            <select onChange={(e) => !_.isNil(subGroupTargetIndex) ? handleInputChange(parentIndex, index, 'leadReviewPoint', e, subGroupTargetIndex) : handleInputChange(i, index, "leadReviewPoint", e)} value={target?.leadReviewPoint || ''}>
                            <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                            {
                                (scores || []).map((score, i) => {
                                return <option value={score} key={i}>{score}</option>
                                })
                            }
                            </select>
                            : <input type="text" value={target?.leadReviewPoint || ''} disabled />
                        }
                    </div>
                    {
                        !isChild
                        ? errors[`${index}_${i}_leadReviewPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_leadReviewPoint`]}</div>
                        : errors[`${index}_${parentIndex}_${subGroupTargetIndex}_leadReviewPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${parentIndex}_${subGroupTargetIndex}_leadReviewPoint`]}</div>
                    }
                    </div>
                    <div className="deviant">
                    <span className="red label">{t("EvaluationDetailPartAttitudeDifferent")}</span>
                    <span className={`value ${
                        deviant && deviant > 0
                            ? 'up'
                            : deviant && deviant < 0
                            ? 'down'
                            : ''
                        }`}
                    >
                        &nbsp;{`${deviant && deviant > 0 ? '+' : ''}${deviant}`}
                        {deviant && deviant != 0 ? (
                        <Image
                            alt="Note"
                            src={
                            deviant && deviant > 0
                                ? IconUp
                                : deviant && deviant < 0
                                ? IconDown
                                : ''
                            }
                        />
                        ) : (
                        ''
                        )}
                    </span>
                    </div>
                </div>
                :
                // Phần 2: Kết quả công việc
                <div className="wrap-score-table">
                    <table>
                        <thead>
                            <tr>
                                <th className="measurement"><span>{t("EvaluationDetailPartLevelOfPerformance")}<span className="note">({t("EvaluationDetailPartByScore")})</span></span></th>
                                <th className="text-center proportion"><span>{t("EvaluationDetailPartWeight")} %</span></th>
                                <th className="text-center target"><span>{t("EvaluationDetailPartTarget")}</span></th>
                                <th className="text-center actual-results"><span>{t("EvaluationDetailPartActualResult")}</span>{!showByManager && <span className="required">(*)</span>}</th>
                                <th className="text-center self-assessment"><span>{t("EvaluationDetailPartAttitudeSelfAssessment")}</span>{!showByManager && <span className="required">(*)</span>}</th>
                                <th className="text-center qltt-assessment"><span>{t("EvaluationDetailPartAttitudeManagerAssessment")}</span>{showByManager && <span className="required">(*)</span>}</th>
                                <th className="text-center deviant"><span>{t("EvaluationDetailPartAttitudeDifferent")}</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="measurement">
                                    {   
                                    target?.jobDetail && 
                                    <ul className="first">
                                        <li>{formatTargetText(target?.jobDetail)}</li>
                                    </ul>
                                    }
                                    <ul className="second">
                                    <li>{!target?.metric1 ? '--' : formatTargetText(target?.metric1)}</li>
                                    <li>{!target?.metric2 ? '--' : formatTargetText(target?.metric2)}</li>
                                    <li>{!target?.metric3 ? '--' : formatTargetText(target?.metric3)}</li>
                                    <li>{!target?.metric4 ? '--' : formatTargetText(target?.metric4)}</li>
                                    <li>{!target?.metric5 ? '--' : formatTargetText(target?.metric5)}</li>
                                    </ul>
                                </td>
                                <td className="text-center proportion"><span>{target?.weight}%</span></td>
                                <td className="text-center target"><span>{target?.target}</span></td>
                                <td className="actual-results">
                                    <div>
                                    {
                                        !showByManager && evaluationFormDetail.status == evaluationStatus.launch && isEdit
                                        ?
                                        <textarea rows={3} placeholder={t("EvaluationInput")} value={target?.realResult || ""} onChange={(e) => handleInputChange(i, index, 'realResult', e)} />
                                        :
                                        <span>{target?.realResult}</span>}
                                    </div>
                                    {errors[`${index}_${i}_realResult`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_realResult`]}</div>}
                                </td>
                                <td className="text-center self-assessment">
                                    <div>
                                    {
                                        !showByManager && evaluationFormDetail.status == evaluationStatus.launch && isEdit
                                        // ? <input type="text" placeholder={t("EvaluationInput")} value={target?.seftPoint || ""} onChange={(e) => handleInputChange(i, index, 'seftPoint', e)} /> 
                                        ? <select onChange={(e) => handleInputChange(i, index, 'seftPoint', e)} value={target?.seftPoint || ''}>
                                            <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                            {
                                            (scores || []).map((score, i) => {
                                                return <option value={score} key={i}>{score}</option>
                                            })
                                            }
                                        </select>
                                        : <span>{target?.seftPoint}</span>
                                    }
                                    </div>
                                    {errors[`${index}_${i}_seftPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_seftPoint`]}</div>}
                                </td>
                                <td className="text-center qltt-assessment">
                                    <div>
                                    {
                                        showByManager && evaluationFormDetail.status == evaluationStatus.selfAssessment && isEdit
                                        // ? <input type="text" placeholder={t("EvaluationInput")} value={target?.leadReviewPoint || ""} onChange={(e) => handleInputChange(i, index, 'leadReviewPoint', e)} />
                                        ? <select onChange={(e) => handleInputChange(i, index, 'leadReviewPoint', e)} value={target?.leadReviewPoint || ''}>
                                            <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                            {
                                            (scores || []).map((score, i) => {
                                                return <option value={score} key={i}>{score}</option>
                                            })
                                            }
                                        </select>
                                        : <span>{target?.leadReviewPoint}</span>
                                    }
                                    </div>
                                    {errors[`${index}_${i}_leadReviewPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_leadReviewPoint`]}</div>}
                                </td>
                                <td className="text-center deviant">
                                    <span className={`value ${deviant && deviant > 0 ? 'up' : deviant && deviant < 0 ? 'down' : ''}`}>
                                    &nbsp;{`${deviant && deviant > 0 ? '+' : ''}${deviant}`}
                                    {deviant && deviant != 0
                                        ?
                                        <Image alt='Note' src={deviant && deviant > 0 ? IconUp : deviant && deviant < 0 ? IconDown : ''} />
                                        :
                                        ''
                                    }
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            }
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
                let isAttitudeBlock = item?.listGroupConfig && item?.listGroupConfig?.length > 0
                const isDisableEmployeeComment = isEdit ? (showByManager || evaluationFormDetail.status != evaluationStatus.launch) : true
                const isDisableManagerComment = isEdit ? (!showByManager || (showByManager && Number(evaluationFormDetail.status) >= Number(evaluationStatus.qlttAssessment))) : true

                return <div className={`part-block ${isAttitudeBlock ? 'attitude' : 'work-result'}`} key={index}>
                <div className="title">{`${t("EvaluationDetailPart")} ${indexText} - ${JSON.parse(item?.groupName || '{}')[languageCodeMapping[currentLocale]]}`} <span className="red">({item?.groupWeight || 0}%)</span></div>
                {
                    isAttitudeBlock &&
                    <div className="wrap-score-table">
                    <table>
                        <thead>
                        <tr>
                            <th className="red">{t("EvaluationDetailPartAttitudeScore")}</th>
                            {
                            item?.listGroupConfig?.map((sub, subIndex) => {
                                return <th key={subIndex}><span className="milestones">{subIndex + 1}</span></th>
                            })
                            }
                        </tr>
                        <tr>
                            <th>%</th>
                            {
                            item?.listGroupConfig?.map((sub, subIndex) => {
                                return <th key={subIndex}><span>{sub?.weight}</span></th>
                            })
                            }
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="font-weight-bold">{t("EvaluationDetailPartAttitudeLevelExpression")}</td>
                            {
                            item?.listGroupConfig?.map((sub, subIndex) => {
                                return <td key={subIndex}><div>{JSON.parse(sub?.description || '{}')[languageCodeMapping[currentLocale]]}</div></td>
                            })
                            }
                        </tr>
                        </tbody>
                    </table>
                    </div>
                }

                <div className="list-evaluation">
                    {
                    (item?.listTarget || []).map((target, i) => {
                        let deviant = (target?.leadReviewPoint === '' || target?.leadReviewPoint === null || target?.seftPoint === '' || target?.seftPoint === null) ? '' : Number(target?.leadReviewPoint) - Number(target?.seftPoint)
                        const companyCodeForTemplate = evaluationFormDetail?.companyCode
                        if (evaluationFormDetail?.formType == formType.EMPLOYEE && companyCodeForTemplate != Constants.pnlVCode.VinMec) {
                        // Biểu mẫu giành cho Nhân viên không thuộc Vinmec
                        return renderEvaluationItem(item, index, scores, target, i, deviant)
                        }
                        if (evaluationFormDetail?.formType == formType.MANAGER || (companyCodeForTemplate == Constants.pnlVCode.VinMec && evaluationFormDetail?.formType == formType.EMPLOYEE)) {
                        // Biểu mẫu giành cho CBLĐ hoặc Nhân viên thuộc Vinmec
                        if (isAttitudeBlock) {
                            return <div className="evaluation-sub-group" key={`sub-group-${i}`}>
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
                        } else {
                            // Phần 2: Kết quả công việc
                            return (
                            <div className="evaluation-item" key={i}>
                                <div className="title">{`${i + 1}. ${JSON.parse(target?.targetName || '{}')[languageCodeMapping[currentLocale]]}`}</div>
                                <div className="wrap-score-table">
                                <table>
                                    <thead>
                                    <tr>
                                        <th className="measurement"><span>{t("EvaluationDetailPartLevelOfPerformance")}<span className="note">({t("EvaluationDetailPartByScore")})</span></span></th>
                                        <th className="text-center proportion"><span>{t("EvaluationDetailPartWeight")} %</span></th>
                                        <th className="text-center target"><span>{t("EvaluationDetailPartTarget")}</span></th>
                                        <th className="text-center actual-results"><span>{t("EvaluationDetailPartActualResult")}</span>{!showByManager && <span className="required">(*)</span>}</th>
                                        <th className="text-center self-assessment"><span>{t("EvaluationDetailPartAttitudeSelfAssessment")}</span>{!showByManager && <span className="required">(*)</span>}</th>
                                        <th className="text-center qltt-assessment"><span>{t("EvaluationDetailPartAttitudeManagerAssessment")}</span>{showByManager && <span className="required">(*)</span>}</th>
                                        <th className="text-center deviant"><span>{t("EvaluationDetailPartAttitudeDifferent")}</span></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="measurement">
                                        {
                                            target?.jobDetail && 
                                            <ul className="first">
                                            <li>{formatTargetText(target?.jobDetail)}</li>
                                            </ul>
                                        }
                                        <ul className="second">
                                            <li>{!target?.metric1 ? '--' : formatTargetText(target?.metric1)}</li>
                                            <li>{!target?.metric2 ? '--' : formatTargetText(target?.metric2)}</li>
                                            <li>{!target?.metric3 ? '--' : formatTargetText(target?.metric3)}</li>
                                            <li>{!target?.metric4 ? '--' : formatTargetText(target?.metric4)}</li>
                                            <li>{!target?.metric5 ? '--' : formatTargetText(target?.metric5)}</li>
                                        </ul>
                                        </td>
                                        <td className="text-center proportion"><span>{target?.weight}%</span></td>
                                        <td className="text-center target"><span>{target?.target}</span></td>
                                        <td className="actual-results">
                                        <div>
                                            {
                                            !showByManager && evaluationFormDetail.status == evaluationStatus.launch && isEdit
                                            ?
                                            <textarea rows={3} placeholder={t("EvaluationInput")} value={target?.realResult || ""} onChange={(e) => handleInputChange(i, index, 'realResult', e)} />
                                            :
                                            <span>{target?.realResult}</span>
                                            }
                                        </div>
                                        {errors[`${index}_${i}_realResult`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_realResult`]}</div>}
                                        </td>
                                        <td className="text-center self-assessment">
                                        <div>
                                            {
                                            !showByManager && evaluationFormDetail.status == evaluationStatus.launch && isEdit
                                                // ? <input type="text" placeholder={t("EvaluationInput")} value={target?.seftPoint || ""} onChange={(e) => handleInputChange(i, index, 'seftPoint', e)} /> 
                                                ? <select onChange={(e) => handleInputChange(i, index, 'seftPoint', e)} value={target?.seftPoint || ''}>
                                                <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                                {
                                                    (scores || []).map((score, i) => {
                                                    return <option value={score} key={i}>{score}</option>
                                                    })
                                                }
                                                </select>
                                                : <span>{target?.seftPoint}</span>
                                            }
                                        </div>
                                        {errors[`${index}_${i}_seftPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_seftPoint`]}</div>}
                                        </td>
                                        <td className="text-center qltt-assessment">
                                        <div>
                                            {
                                            showByManager && evaluationFormDetail.status == evaluationStatus.selfAssessment && isEdit
                                                // ? <input type="text" placeholder={t("EvaluationInput")} value={target?.leadReviewPoint || ""} onChange={(e) => handleInputChange(i, index, 'leadReviewPoint', e)} />
                                                ? <select onChange={(e) => handleInputChange(i, index, 'leadReviewPoint', e)} value={target?.leadReviewPoint || ''}>
                                                <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                                {
                                                    (scores || []).map((score, i) => {
                                                    return <option value={score} key={i}>{score}</option>
                                                    })
                                                }
                                                </select>
                                                : <span>{target?.leadReviewPoint}</span>
                                            }
                                        </div>
                                        {errors[`${index}_${i}_leadReviewPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_leadReviewPoint`]}</div>}
                                        </td>
                                        <td className="text-center deviant">
                                        <span className={`value ${deviant && deviant > 0 ? 'up' : deviant && deviant < 0 ? 'down' : ''}`}>&nbsp;{`${deviant && deviant > 0 ? '+' : ''}${deviant}`}{deviant && deviant != 0 ? <Image alt='Note' src={deviant && deviant > 0 ? IconUp : deviant && deviant < 0 ? IconDown : ''} /> : ''}</span>
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
                        }
                        }
                    })
                    }
                </div>
                </div>
            })
        }
        </>
    )
}

export default VinGroup