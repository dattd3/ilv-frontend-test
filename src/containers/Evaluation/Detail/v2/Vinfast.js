import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from 'axios'
import purify from "dompurify"
import _, { last } from 'lodash'
import { formType, languageCodeMapping, evaluationStatus, scores } from '../../Constants'
import Constants from "commons/Constants"
import LoadingModal from 'components/Common/LoadingModal'
import StatusModal from 'components/Common/StatusModal'
import EvaluationOverall from "../common/EvaluationOverall"
import EvaluationSteps from "../common/EvaluationSteps"
import EvaluationEmployeeInfo from "../common/EvaluationEmployeeInfo"
import IconArrowRightWhite from 'assets/img/icon/pms/arrow-right-white.svg'
import IconArrowRightGray from 'assets/img/icon/pms/arrow-right-gray.svg'
import IconSave from 'assets/img/ic-save.svg'
import IconSendRequest from 'assets/img/icon/Icon_send.svg'
import IconReject from 'assets/img/icon/Icon_Cancel.svg'
import IconApprove from 'assets/img/icon/Icon_Check.svg'
import IconUp from 'assets/img/icon/pms/icon-up.svg'
import IconDown from 'assets/img/icon/pms/icon-down.svg'

const currentLocale = localStorage.getItem("locale")

// KPI không thuộc Kết quả công việc)
const KpiItemOther = (props) => {
    const { t } = useTranslation()

    return (
        <div className="evaluation-item" key={target.id}>
            <div className="title">{`${JSON.parse(target?.targetName || '{}')[languageCodeMapping[currentLocale]]}`}</div>
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
                        <img
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
            <div className="comment">
                <div className="self">
                    <p>{t("EvaluationDetailPartAttitudeCommentOfEmployee")}</p>
                    {
                        isDisableEmployeeComment
                        ? <div className="comment-content" dangerouslySetInnerHTML={{
                                __html: purify.sanitize(target?.seftOpinion || ""),
                            }}
                        />
                        : <textarea 
                            rows={3} 
                            placeholder={isEdit ? !(showByManager || evaluationFormDetail.status != evaluationStatus.launch) ? t("EvaluationDetailPartSelectScoreInput") : '' : ''} 
                            value={target?.seftOpinion || ""} 
                            onChange={(e) => !_.isNil(subGroupTargetIndex) ? handleInputChange(parentIndex, index, 'seftOpinion', e, subGroupTargetIndex) : handleInputChange(i, index, 'seftOpinion', e)} 
                            disabled={isDisableEmployeeComment} 
                        />
                    }
                </div>
                <div className="qltt">
                    <p>{t("EvaluationDetailPartAttitudeCommentOfManager")}</p>
                    {
                        isDisableManagerComment
                        ? <div className="comment-content" dangerouslySetInnerHTML={{
                                __html: purify.sanitize(target?.leaderReviewOpinion || ""),
                            }}
                        />
                        : <textarea 
                            rows={3} 
                            placeholder={isEdit ? !(!showByManager || (showByManager && Number(evaluationFormDetail.status) >= Number(evaluationStatus.qlttAssessment))) ? t("EvaluationDetailPartSelectScoreInput") : '' : ''} 
                            value={target?.leaderReviewOpinion || ""} 
                            onChange={(e) => !_.isNil(subGroupTargetIndex) ? handleInputChange(parentIndex, index, 'leaderReviewOpinion', e, subGroupTargetIndex) : handleInputChange(i, index, "leaderReviewOpinion", e)} 
                            disabled={isDisableManagerComment} 
                        />
                    }
                </div>
            </div>
        </div>
    )
}

const WorkResultKpiItem = (props) => {
    const { t } = useTranslation()

    return (
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
                                <img alt='Note' src={deviant && deviant > 0 ? IconUp : deviant && deviant < 0 ? IconDown : ''} />
                                :
                                ''
                            }
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

const EvaluationGroup = ({ isWorkResultBlock, group }) => {
    const { t } = useTranslation()
    const hasGroupChildrenLv1 = group?.groupChildren?.length > 0

    return (
        <div className={`part-block ${isWorkResultBlock ? 'work-result' : 'attitude'}`}>
            <div className="title">{`${JSON.parse(group?.groupName || '{}')[languageCodeMapping[currentLocale]]}`} <span className="red">({group?.groupWeight || 0}%)</span></div>
            {
                group?.listGroupConfig > 0 && (
                    <div className="wrap-score-table">
                        <table className={'vin-group'}>
                            <thead>
                                <tr>
                                    <th className="red first">{t("EvaluationDetailPartAttitudeScore")}</th>
                                    {
                                        group.listGroupConfig.map((sub, subIndex) => {
                                            return (<th key={subIndex}><span className="milestones"><span>{subIndex + 1}</span></span></th>)
                                        })
                                    }
                                </tr>
                                <tr>
                                    <th className="first">%</th>
                                    {
                                        group.listGroupConfig.map((sub, subIndex) => {
                                            return (<th key={subIndex}><span>{sub?.weight}</span></th>)
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="font-weight-bold text-center align-middle first">{t("EvaluationDetailPartAttitudeLevelExpression")}</td>
                                    {
                                        group.listGroupConfig.map((sub, subIndex) => {
                                            return (
                                                <td key={subIndex}>
                                                    <div className="content" dangerouslySetInnerHTML={{
                                                        __html: purify.sanitize(JSON.parse(sub?.description || '{}')[languageCodeMapping[currentLocale]]),
                                                    }} />
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )
            }
            <div className="list-evaluation">
                {
                    hasGroupChildrenLv1
                    ? (
                        (group?.groupChildren || []).map((gChildren, gIndex) => {
                            let deviant = (childTarget?.leadReviewPoint === '' || childTarget?.leadReviewPoint === null || childTarget?.seftPoint === '' || childTarget?.seftPoint === null) ? '' : Number(childTarget?.leadReviewPoint) - Number(childTarget?.seftPoint)
                            return (
                                <div className="evaluation-sub-group" key={`group-children-${gIndex}`}>
                                    <div className='sub-group-name'>{`${JSON.parse(gChildren?.groupName || '{}')[languageCodeMapping[currentLocale]]}`} <span className="red">({gChildren?.groupWeight}%)</span></div>
                                    <div className="sub-group-targets">
                                        {
                                            (gChildren?.listKPI || []).map((kpi, kIndex) => {
                                                let deviant = (childTarget?.leadReviewPoint === '' || childTarget?.leadReviewPoint === null || childTarget?.seftPoint === '' || childTarget?.seftPoint === null) ? '' : Number(childTarget?.leadReviewPoint) - Number(childTarget?.seftPoint)
                                                return (
                                                    <React.Fragment key={childIndex}>
                                                        {
                                                            isWorkResultBlock
                                                            ? (
                                                                <WorkResultKpiItem
                                                                
                                                                />
                                                            )
                                                            : (
                                                                <KpiItemOther
                                                        
                                                                />
                                                            )
                                                        }

                                                        {/* <div className="evaluation-item">
                                                            <div className="sub-title">{`${JSON.parse(kpi?.targetName || '{}')[languageCodeMapping[currentLocale]]}`}</div>
                                                        </div> */}
                                                        <div className="divider" />
                                                    </React.Fragment>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    )
                    : (
                        <>
                        
                        </>
                    )
                }


                {
                    (group?.listTarget || []).map((target, i) => {
                        let deviant = (target?.leadReviewPoint === '' || target?.leadReviewPoint === null || target?.seftPoint === '' || target?.seftPoint === null) ? '' : Number(target?.leadReviewPoint) - Number(target?.seftPoint)
                        if (formTypeDetail == formType.EMPLOYEE && companyCode != Constants.pnlVCode.VinMec) {
                            // Biểu mẫu giành cho Nhân viên không thuộc Vinmec
                            return renderEvaluationItem(group, index, target, i, deviant)
                        }

                        if (formTypeDetail == formType.MANAGER || (companyCode == Constants.pnlVCode.VinMec && formTypeDetail == formType.EMPLOYEE)) {
                        // Biểu mẫu giành cho CBLĐ hoặc Nhân viên thuộc Vinmec
                        if (isAttitudeBlock) {
                            return <div className="evaluation-sub-group" key={`sub-group-${i}`}>
                            <div className='sub-group-name'>{`${i + 1}. ${JSON.parse(target?.groupName || '{}')[languageCodeMapping[currentLocale]]}`} <span className="red">({target.groupWeight}%)</span></div>
                            <div className="sub-group-targets">
                                {(target.listTarget || []).map((childTarget, childIndex) => {
                                let deviant = (childTarget?.leadReviewPoint === '' || childTarget?.leadReviewPoint === null || childTarget?.seftPoint === '' || childTarget?.seftPoint === null) ? '' : Number(childTarget?.leadReviewPoint) - Number(childTarget?.seftPoint)
                                return <React.Fragment key={childIndex}>
                                    {renderEvaluationItem(group, index, childTarget, 0, deviant, i, childIndex)}
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
                                        <span className={`value ${deviant && deviant > 0 ? 'up' : deviant && deviant < 0 ? 'down' : ''}`}>&nbsp;{`${deviant && deviant > 0 ? '+' : ''}${deviant}`}{deviant && deviant != 0 ? <img alt='Note' src={deviant && deviant > 0 ? IconUp : deviant && deviant < 0 ? IconDown : ''} /> : ''}</span>
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
    )
}

const VinFastForm = (props) => {
    const { t } = useTranslation()
    const { evaluationFormDetail, showByManager } = props
    const { groups, status, companyCode, formType : formTypeDetail, isEdit } = evaluationFormDetail
    const [isLoading, SetIsLoading] = useState(false)
    const [errors, SetErrors] = useState({})
    const [statusModal, SetStatusModal] = useState({ isShow: false, isSuccess: true, content: "", needReload: true })

    const onHideStatusModal = () => {

    }

    const handleInputChange = () => {

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
                formType={formTypeDetail}
                showByManager={showByManager}
                totalTarget={evaluationFormDetail?.totalTarget}
                listGroup={evaluationFormDetail?.groups}
                seftTotalComplete={evaluationFormDetail?.seftTotalComplete}
                leadReviewTotalComplete={evaluationFormDetail?.leadReviewTotalComplete}
                totalSeftPoint={evaluationFormDetail?.totalSeftPoint}
                totalLeadReviewPoint={evaluationFormDetail?.totalLeadReviewPoint}
            />
            <div className="card shadow evaluation-process" style={formTypeDetail === 'OFF' ? { display: 'none' } : {}} >
                <div className="title">{t("EvaluationDetailASSESSMENTPROCESS")}</div>
                <div className="step-block">
                    <EvaluationSteps
                        status={evaluationFormDetail?.status}
                        reviewStreamCode={evaluationFormDetail?.reviewStreamCode}
                    />
                </div>
                <div className="employee-info-block">
                    <EvaluationEmployeeInfo
                        fullName={evaluationFormDetail?.fullName}
                        position={evaluationFormDetail?.position}
                        employeeLevel={evaluationFormDetail?.employeeLevel}
                        organization_lv3={evaluationFormDetail?.organization_lv3}
                        organization_lv4={evaluationFormDetail?.organization_lv4}
                        hrAdmin={evaluationFormDetail?.hrAdmin}
                        reviewStreamCode={evaluationFormDetail?.reviewStreamCode}
                        reviewer={evaluationFormDetail?.reviewer}
                        approver={evaluationFormDetail?.approver}
                    />
                </div>
                {
                    (groups || []).map((group, index) => {
                        let isAttitudeBlock = group?.listGroupConfig?.length > 0
                        const isDisableEmployeeComment = isEdit ? (showByManager || status != evaluationStatus.launch) : true
                        const isDisableManagerComment = isEdit ? (!showByManager || (showByManager && Number(status) >= Number(evaluationStatus.qlttAssessment))) : true
                        const isVinBus = false
                        const hasGroupChildrenLv1 = group?.groupChildren?.length > 0

                        return (
                            <EvaluationGroup
                                key={`group-${index}`}
                                isWorkResultBlock={index === groups?.length - 1}
                                group={group}
                            />
                        )
                    })
                }
            </div>
        </>
    )
}

export default VinFastForm
