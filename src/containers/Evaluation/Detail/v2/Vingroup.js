import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from 'axios'
import purify from "dompurify"
import _ from 'lodash'
import { actionButton, processStep, languageCodeMapping, evaluationStatus, scores } from '../../Constants'
import { getRequestConfigurations } from "commons/Utils"
import { hasNotValue } from "containers/Evaluation/Utils"
import Constants from "commons/Constants"
import Buttons from "../common/Buttons"
import LoadingModal from 'components/Common/LoadingModal'
import StatusModal from 'components/Common/StatusModal'
import EvaluationOverall from "../common/EvaluationOverall"
import EvaluationSteps from "../common/EvaluationSteps"
import EvaluationEmployeeInfo from "../common/EvaluationEmployeeInfo"
import IconSave from 'assets/img/ic-save.svg'
import IconUp from 'assets/img/icon/pms/icon-up.svg'
import IconDown from 'assets/img/icon/pms/icon-down.svg'

const currentLocale = localStorage.getItem("locale")

// KPI không thuộc Kết quả công việc)
const OtherKpiItem = ({ kpi, deviant, status, isEdit, showByManager, groupIndex, kpiIndex, groupChildrenLv1Index, errors, isDisableEmployeeComment = false, isDisableManagerComment = false, handleInputChange }) => {
    const { t } = useTranslation()
    const errorSelfPoint = (groupChildrenLv1Index !== null && groupChildrenLv1Index !== undefined) ? errors[`${groupIndex}_${groupChildrenLv1Index}_${kpiIndex}_seftPoint`] : errors[`${groupIndex}_${kpiIndex}_seftPoint`]
    const errorLeadReviewPoint = (groupChildrenLv1Index !== null && groupChildrenLv1Index !== undefined) ? errors[`${groupIndex}_${groupChildrenLv1Index}_${kpiIndex}_leadReviewPoint`] : errors[`${groupIndex}_${kpiIndex}_leadReviewPoint`]

    return (
        <div className="evaluation-item">
            <div className="title">{`${JSON.parse(kpi?.targetName || '{}')[languageCodeMapping[currentLocale]]}`}</div>
            <div className="score-block">
                <div className="self attitude-score">
                    <div className="item">
                        <span className="red label">{t("EvaluationDetailPartAttitudeSelfAssessment")}{!showByManager && <span className="required">(*)</span>}</span>
                        {
                            !showByManager && status == evaluationStatus.launch && isEdit
                            ? (
                                <select onChange={e => handleInputChange(groupIndex, groupChildrenLv1Index, kpiIndex, 'seftPoint', e)} value={kpi?.seftPoint || ''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            )
                            : (<input type="text" value={kpi?.seftPoint || ''} disabled />)
                        }
                    </div>
                    { errorSelfPoint && (<div className="alert alert-danger invalid-message" role="alert">{ errorSelfPoint }</div>) }
                </div>
                <div className="qltt attitude-score">
                    <div className="item">
                        <span className="red label">{t("EvaluationDetailPartAttitudeManagerAssessment")}{showByManager && <span className="required">(*)</span>}</span>
                        {
                        !(!showByManager || (showByManager && Number(status) >= Number(evaluationStatus.qlttAssessment))) && isEdit
                            ? (
                                <select onChange={e => handleInputChange(groupIndex, groupChildrenLv1Index, kpiIndex, 'leadReviewPoint', e)} value={kpi?.leadReviewPoint || ''}>
                                    <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                    {
                                        (scores || []).map((score, i) => {
                                            return (<option value={score} key={i}>{score}</option>)
                                        })
                                    }
                                </select>
                            )
                            : (<input type="text" value={kpi?.leadReviewPoint || ''} disabled />)
                        }
                    </div>
                    { errorLeadReviewPoint && (<div className="alert alert-danger invalid-message" role="alert">{ errorLeadReviewPoint }</div>) }
                </div>
                <div className="deviant">
                    <span className="red label">{t("EvaluationDetailPartAttitudeDifferent")}</span>
                    <span className={`value ${deviant && deviant > 0 ? 'up' : deviant && deviant < 0 ? 'down' : ''}`}>
                        &nbsp;{`${deviant && deviant > 0 ? '+' : ''}${deviant}`}
                        { deviant && deviant != 0 ? ( <img alt="Note" src={ deviant && deviant > 0 ? IconUp : deviant && deviant < 0 ? IconDown : '' } />) : '' }
                    </span>
                </div>
            </div>
            <div className="comment">
                <div className="self">
                    <p>{t("EvaluationDetailPartAttitudeCommentOfEmployee")}</p>
                    {
                        isDisableEmployeeComment
                        ? (
                            <div className="comment-content" dangerouslySetInnerHTML={{
                                __html: purify.sanitize(kpi?.seftOpinion || ""),
                            }} />
                        )
                        : (
                            <textarea 
                                rows={3} 
                                placeholder={isEdit ? !(showByManager || status != evaluationStatus.launch) ? t("EvaluationDetailPartSelectScoreInput") : '' : ''} 
                                value={kpi?.seftOpinion || ""} 
                                onChange={e => handleInputChange(groupIndex, groupChildrenLv1Index, kpiIndex, 'seftOpinion', e)} 
                                disabled={isDisableEmployeeComment} 
                            />
                        )
                    }
                </div>
                <div className="qltt">
                    <p>{t("EvaluationDetailPartAttitudeCommentOfManager")}</p>
                    {
                        isDisableManagerComment
                        ? (
                            <div className="comment-content" dangerouslySetInnerHTML={{
                                __html: purify.sanitize(kpi?.leaderReviewOpinion || ""),
                            }} />
                        )
                        : (
                            <textarea 
                                rows={3} 
                                placeholder={isEdit ? !(!showByManager || (showByManager && Number(status) >= Number(evaluationStatus.qlttAssessment))) ? t("EvaluationDetailPartSelectScoreInput") : '' : ''} 
                                value={kpi?.leaderReviewOpinion || ""} 
                                onChange={e => handleInputChange(groupIndex, groupChildrenLv1Index, kpiIndex, 'leaderReviewOpinion', e)} 
                                disabled={isDisableManagerComment} 
                            />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

const WorkResultKpiItem = ({ kpi, deviant, status, isEdit, showByManager, groupIndex, kpiIndex, groupChildrenLv1Index, errors, isDisableEmployeeComment = false, isDisableManagerComment = false, handleInputChange }) => {
    const { t } = useTranslation()
    const errorRealResult = (groupChildrenLv1Index !== null && groupChildrenLv1Index !== undefined) ? errors[`${groupIndex}_${groupChildrenLv1Index}_${kpiIndex}_realResult`] : errors[`${groupIndex}_${kpiIndex}_realResult`]
    const errorSelfPoint = (groupChildrenLv1Index !== null && groupChildrenLv1Index !== undefined) ? errors[`${groupIndex}_${groupChildrenLv1Index}_${kpiIndex}_seftPoint`] : errors[`${groupIndex}_${kpiIndex}_seftPoint`]
    const errorLeadReviewPoint = (groupChildrenLv1Index !== null && groupChildrenLv1Index !== undefined) ? errors[`${groupIndex}_${groupChildrenLv1Index}_${kpiIndex}_leadReviewPoint`] : errors[`${groupIndex}_${kpiIndex}_leadReviewPoint`]

    return (
        <div className="evaluation-item">
            <div className="title">{`${JSON.parse(kpi?.targetName || '{}')[languageCodeMapping[currentLocale]]}`}</div>
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
                                    kpi?.jobDetail && (
                                        <ul className="first">
                                            <li>{kpi?.jobDetail}</li>
                                        </ul>
                                    )
                                }
                                <ul className="second">
                                    <li>{!kpi?.metric1 ? '--' : kpi?.metric1}</li>
                                    <li>{!kpi?.metric2 ? '--' : kpi?.metric2}</li>
                                    <li>{!kpi?.metric3 ? '--' : kpi?.metric3}</li>
                                    <li>{!kpi?.metric4 ? '--' : kpi?.metric4}</li>
                                    <li>{!kpi?.metric5 ? '--' : kpi?.metric5}</li>
                                </ul>
                            </td>
                            <td className="text-center proportion"><span>{kpi?.weight}%</span></td>
                            <td className="text-center target"><span>{kpi?.target}</span></td>
                            <td className="actual-results">
                                <div>
                                {
                                    !showByManager && status == evaluationStatus.launch && isEdit
                                    ? (<textarea rows={3} placeholder={t("EvaluationInput")} value={kpi?.realResult || ""} onChange={(e) => handleInputChange(groupIndex, groupChildrenLv1Index, kpiIndex, 'realResult', e)} />)
                                    : (<span>{kpi?.realResult}</span>)
                                }
                                </div>
                                { errorRealResult && (<div className="alert alert-danger invalid-message" role="alert">{ errorRealResult }</div>) }
                            </td>
                            <td className="text-center self-assessment">
                                <div>
                                    {
                                        !showByManager && status == evaluationStatus.launch && isEdit
                                        ? (
                                            <select onChange={(e) => handleInputChange(groupIndex, groupChildrenLv1Index, kpiIndex, 'seftPoint', e)} value={kpi?.seftPoint || ''}>
                                                <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                                {
                                                    (scores || []).map((score, i) => {
                                                        return <option value={score} key={i}>{score}</option>
                                                    })
                                                }
                                            </select>
                                        )
                                        : (<span>{kpi?.seftPoint}</span>)
                                    }
                                </div>
                                { errorSelfPoint && (<div className="alert alert-danger invalid-message" role="alert">{ errorSelfPoint }</div>) }
                            </td>
                            <td className="text-center qltt-assessment">
                                <div>
                                    {
                                        showByManager && status == evaluationStatus.selfAssessment && isEdit
                                        ? (
                                            <select onChange={(e) => handleInputChange(groupIndex, groupChildrenLv1Index, kpiIndex, 'leadReviewPoint', e)} value={kpi?.leadReviewPoint || ''}>
                                                <option value=''>{t("EvaluationDetailPartSelectScore")}</option>
                                                {
                                                    (scores || []).map((score, i) => {
                                                        return <option value={score} key={i}>{score}</option>
                                                    })
                                                }
                                            </select>
                                        )
                                        : (<span>{kpi?.leadReviewPoint}</span>)
                                    }
                                </div>
                                { errorLeadReviewPoint && (<div className="alert alert-danger invalid-message" role="alert">{ errorLeadReviewPoint }</div>) }
                            </td>
                            <td className="text-center deviant">
                                <span className={`value ${deviant && deviant > 0 ? 'up' : deviant && deviant < 0 ? 'down' : ''}`}>
                                &nbsp;{`${deviant && deviant > 0 ? '+' : ''}${deviant}`}
                                {
                                    deviant && deviant != 0
                                    ? (<img alt='Note' src={deviant && deviant > 0 ? IconUp : deviant && deviant < 0 ? IconDown : ''} />)
                                    : ''
                                }
                                </span>
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
                    ? (
                        <div className="comment-content" dangerouslySetInnerHTML={{
                            __html: purify.sanitize(kpi?.seftOpinion || ""),
                        }} />
                    )
                    : (
                        <textarea 
                            rows={3} 
                            placeholder={isEdit ? !(showByManager || status != evaluationStatus.launch) ? t("EvaluationDetailPartSelectScoreInput") : '' : ''} 
                            value={kpi?.seftOpinion || ""} 
                            onChange={e => handleInputChange(groupIndex, groupChildrenLv1Index, kpiIndex, 'seftOpinion', e)} 
                            disabled={isDisableEmployeeComment} />
                    )
                }
                </div>
                <div className="qltt">
                <p>{t("EvaluationDetailPartAttitudeCommentOfManager")}</p>
                {
                    isDisableManagerComment
                    ? (
                        <div className="comment-content" dangerouslySetInnerHTML={{
                            __html: purify.sanitize(kpi?.leaderReviewOpinion || ""),
                        }} />
                    )
                    : (
                        <textarea 
                            rows={3} 
                            placeholder={isEdit ? !(!showByManager || (showByManager && Number(status) >= Number(evaluationStatus.qlttAssessment))) ? t("EvaluationDetailPartSelectScoreInput") : '' : ''} 
                            value={kpi?.leaderReviewOpinion || ""} 
                            onChange={e => handleInputChange(groupIndex, groupChildrenLv1Index, kpiIndex, 'leaderReviewOpinion', e)} 
                            disabled={isDisableManagerComment} />
                    )
                }
                </div>
            </div>
        </div>
    )
}

const EvaluationGroup = ({ isWorkResultBlock, group, status, isEdit, showByManager, groupIndex, isDisableEmployeeComment, isDisableManagerComment, errors, handleInputChange }) => {
    const { t } = useTranslation()
    const hasGroupChildrenLv1 = group?.groupChildren?.length > 0

    const renderListKPIs = (listKPIs = [], groupChildIndex, isWorkResultBlock = false, showDivider = false) => {
        return (
            (listKPIs).map((kpi, kIndex) => {
                let deviant = (hasNotValue(kpi?.leadReviewPoint) || hasNotValue(kpi?.seftPoint)) ? '' : Number(kpi?.leadReviewPoint) - Number(kpi?.seftPoint)
                return (
                    <React.Fragment key={`i-${groupIndex}-${groupChildIndex || 0}-${kIndex}`}>
                        {
                            isWorkResultBlock
                            ? (
                                <WorkResultKpiItem
                                    kpi={kpi}
                                    deviant={deviant}
                                    status={status}
                                    isEdit={isEdit}
                                    showByManager={showByManager}
                                    groupIndex={groupIndex}
                                    kpiIndex={kIndex}
                                    groupChildrenLv1Index={groupChildIndex}
                                    errors={errors}
                                    isDisableEmployeeComment={isDisableEmployeeComment}
                                    isDisableManagerComment={isDisableManagerComment}
                                    handleInputChange={handleInputChange}
                                />
                            )
                            : (
                                <OtherKpiItem
                                    kpi={kpi}
                                    deviant={deviant}
                                    status={status}
                                    isEdit={isEdit}
                                    showByManager={showByManager}
                                    groupIndex={groupIndex}
                                    kpiIndex={kIndex}
                                    groupChildrenLv1Index={groupChildIndex}
                                    errors={errors}
                                    isDisableEmployeeComment={isDisableEmployeeComment}
                                    isDisableManagerComment={isDisableManagerComment}
                                    handleInputChange={handleInputChange}
                                />
                            )
                        }
                        { showDivider && (<div className="divider" />)}
                    </React.Fragment>
                )
            })
        )
    }

    return (
        <div className={`part-block ${isWorkResultBlock ? 'work-result' : 'attitude'}`}>
            <div className="title">{`${JSON.parse(group?.groupName || '{}')[languageCodeMapping[currentLocale]]}`} <span className="red">({group?.groupWeight || 0}%)</span></div>
            {
                group?.listGroupConfig?.length > 0 && (
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
                        (group?.groupChildren || []).map((gChildren, gcIndex) => {
                            return (
                                <div className="evaluation-sub-group" key={`group-children-${gcIndex}`}>
                                    <div className='sub-group-name'>{`${JSON.parse(gChildren?.groupName || '{}')[languageCodeMapping[currentLocale]]}`} <span className="red">({gChildren?.groupWeight}%)</span></div>
                                    <div className="sub-group-targets">
                                        { renderListKPIs(gChildren?.listKPI, gcIndex, isWorkResultBlock, true) }
                                    </div>
                                </div>
                            )
                        })
                    )
                    : renderListKPIs(group?.listKPI, null, isWorkResultBlock, false)
                }
            </div>
        </div>
    )
}

const VinGroupForm = (props) => {
    const { t } = useTranslation()
    const { evaluationFormDetail, showByManager, version, updateParent } = props
    const [evaluationFormDetailState, SetEvaluationFormDetailState] = useState(null)
    const [isLoading, SetIsLoading] = useState(false)
    const [errors, SetErrors] = useState({})
    const [bottom, setBottom] = useState(false);
    const [statusModal, SetStatusModal] = useState({ isShow: false, isSuccess: true, content: "", needReload: true })

    useEffect(() => {
        SetEvaluationFormDetailState(evaluationFormDetail)
    }, [evaluationFormDetail])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, true)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    const onHideStatusModal = () => {
        const statusModalTemp = { ...statusModal }
        statusModalTemp.isShow = false
        statusModalTemp.isSuccess = true
        statusModalTemp.content = ""
        statusModalTemp.needReload = true
        SetStatusModal(statusModalTemp)
    
        if (statusModal.needReload) {
          window.location.reload()
        }
    }

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 200
        setBottom(bottom)
    }

    const handleInputChange = (groupIndex, groupChildrenLv1Index, kpiIndex, key, e) => {
        const val = e?.target?.value || ""
        if (['seftPoint', 'leadReviewPoint'].includes(key) && (!(/^\d*$/.test(Number(val))) || val.includes('.'))) {
            return
        }

        const evaluationFormDetailClone = {...evaluationFormDetailState}
        if (groupChildrenLv1Index !== null && groupChildrenLv1Index !== undefined) {
            evaluationFormDetailClone.groups[groupIndex].groupChildren[groupChildrenLv1Index].listKPI[kpiIndex][key] = val
        } else {
            evaluationFormDetailClone.groups[groupIndex].listKPI[kpiIndex][key] = val
        }

        let totalQuestionsAnswered = 0
        if (showByManager) { // Quản lý trực tiếp đánh giá
            totalQuestionsAnswered = (evaluationFormDetailClone?.groups || []).reduce((initial, current) => {
                let questionsAnswered = 0
                if (groupChildrenLv1Index !== null && groupChildrenLv1Index !== undefined) {
                    questionsAnswered = (current?.listKPI || []).reduce((subInitial, subCurrent) => {
                        subInitial += (subCurrent?.leadReviewPoint) ? 1 : 0
                        if (subCurrent?.listKPI?.length > 0) {
                            const subQuestionsAnswered = (subCurrent?.listKPI || []).reduce((res, item) => {
                                res += (item?.leadReviewPoint) ? 1 : 0
                                return res
                            }, 0)
                            subInitial += subQuestionsAnswered
                        }
                        return subInitial
                    }, 0)
                } else {
                    questionsAnswered = (current?.listKPI || []).reduce((subInitial, subCurrent) => {
                        subInitial += (subCurrent?.leadReviewPoint) ? 1 : 0
                        return subInitial
                    }, 0)
                }
                initial += questionsAnswered
                return initial
            }, 0)
        } else { // Nhân viên đánh giá
            totalQuestionsAnswered = (evaluationFormDetailClone?.groups || []).reduce((initial, current) => {
                let questionsAnswered = 0
                if (groupChildrenLv1Index !== null && groupChildrenLv1Index !== undefined) {
                    questionsAnswered = (current?.listKPI || []).reduce((subInitial, subCurrent) => {
                        subInitial += (subCurrent?.seftPoint) ? 1 : 0
                        if (subCurrent?.listKPI?.length > 0) {
                            const subQuestionsAnswered = (subCurrent?.listKPI || []).reduce((res, item) => {
                                res += (item?.seftPoint) ? 1 : 0
                                return res
                            }, 0)
                            subInitial += subQuestionsAnswered
                        }
                        return subInitial
                    }, 0)
                } else {
                    questionsAnswered = (current?.listKPI || []).reduce((subInitial, subCurrent) => {
                        subInitial += (subCurrent?.seftPoint) ? 1 : 0
                        return subInitial
                    }, 0)
                }
                initial += questionsAnswered
                return initial
            }, 0)
        }

        evaluationFormDetailClone.groups = [...evaluationFormDetailClone.groups || []].map(item => {
            return {
                ...item,
                groupSeftPoint: calculateAssessment(item)?.selfAssessment || 0,
                groupLeadReviewPoint: calculateAssessment(item)?.managerAssessment || 0,
            }
        })
        const totalInfos = getTotalInfoByListGroup(evaluationFormDetailClone?.groups)

        if (showByManager) {
            evaluationFormDetailClone.leadReviewTotalComplete = totalQuestionsAnswered
        } else {
            evaluationFormDetailClone.seftTotalComplete = totalQuestionsAnswered
        }

        evaluationFormDetailClone.totalSeftPoint = totalInfos?.self || 0
        evaluationFormDetailClone.totalLeadReviewPoint = totalInfos?.manager || 0

        SetEvaluationFormDetailState(evaluationFormDetailClone)
    }

    const getTotalInfoByListGroup = (groups) => {
        const result = (groups || []).reduce((initial, current) => {
            let assessment = calculateAssessment(current)
            initial.self += assessment?.selfAssessment * Number(current?.groupWeight) / 100
            initial.manager += assessment?.managerAssessment * Number(current?.groupWeight) / 100
            return initial
        }, { self: 0, manager: 0 })

        return result
    }

    const calculateAssessment = (group) => {
        const assessmentScale = 5
        let assessment

        if (group?.groupChildren?.length > 0) {
            assessment = (group?.groupChildren || []).reduce((initial, current) => {
                if (current?.listKPI?.length > 0) {
                    const sub = (current?.listKPI || []).reduce((subInitial, item) => {
                        subInitial.selfAssessment += Number(item?.seftPoint || 0) / assessmentScale * Number(item?.weight || 0)
                        subInitial.managerAssessment += Number(item?.leadReviewPoint || 0) / assessmentScale * Number(item?.weight || 0)
                        return subInitial
                    }, { selfAssessment: 0, managerAssessment: 0 })
                    initial.selfAssessment += sub.selfAssessment
                    initial.managerAssessment += sub.managerAssessment
                }
                return initial
            }, { selfAssessment: 0, managerAssessment: 0 })
    
        } else {
            assessment = (group?.listKPI || []).reduce((initial, current) => {
                initial.selfAssessment += Number(current?.seftPoint || 0) / assessmentScale * Number(current?.weight || 0)
                initial.managerAssessment += Number(current?.leadReviewPoint || 0) / assessmentScale * Number(current?.weight || 0)
                return initial
            }, { selfAssessment: 0, managerAssessment: 0 })
        }
        return assessment
    }

    const isValidTotalScoreFunc = () => {
        const { totalSeftPoint, totalLeadReviewPoint } = evaluationFormDetailState
        return Number(totalSeftPoint).toFixed(2) < 0 || Number(totalSeftPoint).toFixed(2) > 100 || Number(totalLeadReviewPoint).toFixed(2) < 0 || Number(totalLeadReviewPoint).toFixed(2) > 100 ? false : true
    }

    const isValidScoreFunc = () => {
        const maximumScore = 5;
        const minimumScore = 1;
        const groups = evaluationFormDetailState?.groups || []

        for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
            let group = groups[groupIndex]
            if (group?.groupChildren?.length > 0) {
                for (let groupChildrenIndex = 0; groupChildrenIndex < group?.groupChildren?.length; groupChildrenIndex++) {
                    let groupChildren = group?.groupChildren[groupChildrenIndex]
                    for (let kpiIndex = 0; kpiIndex < groupChildren?.listKPI?.length; kpiIndex++) {
                        let kpi = groupChildren?.listKPI[kpiIndex]
                        if (showByManager) {
                            if (hasNotValue(kpi?.leadReviewPoint) || Number(kpi?.leadReviewPoint) > maximumScore || Number(kpi?.leadReviewPoint) < minimumScore) {
                                return false
                            }
                        } else {
                            if (hasNotValue(kpi?.seftPoint) || Number(kpi?.seftPoint) > maximumScore || Number(kpi?.seftPoint) < minimumScore) {
                                return false
                            }
                        }
                    }
                }
            } else {
                for (let kpiIndex = 0; kpiIndex < group?.listKPI?.length; kpiIndex++) {
                    let kpi = group?.listKPI[kpiIndex]
                    if (showByManager) {
                        if (hasNotValue(kpi?.leadReviewPoint) || Number(kpi?.leadReviewPoint) > maximumScore || Number(kpi?.leadReviewPoint) < minimumScore) {
                            return false
                        }
                    } else {
                        if (hasNotValue(kpi?.seftPoint) || Number(kpi?.seftPoint) > maximumScore || Number(kpi?.seftPoint) < minimumScore) {
                            return false
                        }
                    }
                }
            }
        }
    
        return true
    }

    const isDataValid = () => {
        const errorResult = (evaluationFormDetailState?.groups || []).reduce((initial, group, groupIndex) => {
            const isWorkResultBlock= groupIndex === evaluationFormDetailState?.groups?.length - 1
            let targetErrors = {}
            if (group?.groupChildren?.length > 0) {
                targetErrors = (group?.groupChildren || []).reduce((subInitial, subGroup, subGroupIndex) => {
                    let keyData = showByManager ? 'leadReviewPoint' : 'seftPoint'
                    const subError = (subGroup?.listKPI || []).reduce((kpiInitial, kpi, kpiIndex) => {
                        kpiInitial[`${groupIndex}_${subGroupIndex}_${kpiIndex}_${keyData}`] = null
                        if (!Number(kpi[keyData])) {
                            kpiInitial[`${groupIndex}_${subGroupIndex}_${kpiIndex}_${keyData}`] = t("Required")
                        }
                        return kpiInitial
                    }, {})
                    return { ...subInitial, ...subError }
                }, {})
            } else {
                targetErrors = (group?.listKPI || []).reduce((subInitial, kpi, kpiIndex) => {
                    if (showByManager) {
                        subInitial[`${groupIndex}_${kpiIndex}_leadReviewPoint`] = null
                        if (!Number(kpi?.leadReviewPoint)) {
                            subInitial[`${groupIndex}_${kpiIndex}_leadReviewPoint`] = t("Required")
                        }
                        return subInitial
                    } else {
                        subInitial[`${groupIndex}_${kpiIndex}_seftPoint`] = null
                        subInitial[`${groupIndex}_${kpiIndex}_realResult`] = null
                        if (!Number(kpi?.seftPoint)) {
                            subInitial[`${groupIndex}_${kpiIndex}_seftPoint`] = t("Required")
                        }
                        if (isWorkResultBlock && !kpi?.realResult) {
                            subInitial[`${groupIndex}_${kpiIndex}_realResult`] = t("Required")
                        }
                        return subInitial
                    }
                }, {})
            }
            return { ...initial, ...targetErrors }
        }, {})

        const isValid = (Object.values(errorResult) || []).every(item => !item)
        SetErrors(errorResult)

        if (!isValid) {
            SetStatusModal({
                ...statusModal,
                isShow: true,
                isSuccess: false,
                content: t("PleaseEnterTheRequiredFields"),
                needReload: false,
            })
        }

        return isValid
    }

    const getResponseMessages = (formStatus, actionCode, apiStatus, isZeroLevel = false) => {
        const messageMapping = {
            [actionButton.save]: {
                //  CBNV lưu biểu mẫu
                [evaluationStatus.launch]: {
                    success: t("EvaluationFormSaveSuccessfully"),
                    failed: t("EvaluationFailedToSaveForm"),
                },
                // CBQLTT lưu biểu mẫu
                [evaluationStatus.selfAssessment]: {
                    success: t("EvaluationFormSaveSuccessfully"),
                    failed: t("EvaluationFailedToSaveForm"),
                },
            },
            [actionButton.approve]: {
                [evaluationStatus.launch]: {
                    success: isZeroLevel ? t("EvaluationFormEvaluatedSuccessfully") : t("EvaluationFormSubmittedToDirectManagerEvaluation"),
                    failed: isZeroLevel ? t("EvaluationFailedToEvaluateForm") : t("EvaluationFailedToSubmitForm"),
                },
                [evaluationStatus.selfAssessment]: {
                    success: t("EvaluationFormEvaluatedSuccessfully"),
                    failed: t("EvaluationFailedToEvaluateForm"),
                },
                [evaluationStatus.qlttAssessment]: {
                    success: t("EvaluationFormApprovedSuccessfully"),
                    failed: t("EvaluationFailedToApproveForm"),
                },
            },
            [actionButton.reject]: {
                [evaluationStatus.selfAssessment]: {
                    success: t("EvaluationFormSentBackToEmployeeSuccessfully"),
                    failed: t("EvaluationFailedToSendTheFormBackToEmployee"),
                },
                [evaluationStatus.qlttAssessment]: {
                    success: t("EvaluationFormSubmittedToManager"),
                    failed: t("EvaluationFailedToReSubmitForm"),
                },
            }
        }

        return messageMapping[actionCode][formStatus][apiStatus]
    }

    const handleSubmit = async (actionCode, isApprove, isSaveDraft) => {
        if (!isSaveDraft || (actionCode == actionButton.approve)) {
            const isValid = isDataValid()
            if (!isValid) return
        }
    
        const statusModalTemp = { ...statusModal }
        const isValidTotalScore = isValidTotalScoreFunc()
        const isValidScore = isValidScoreFunc()
    
        if (!isValidTotalScore || !isValidScore) {
          statusModalTemp.isShow = true
          statusModalTemp.isSuccess = false
          statusModalTemp.content = t("EvaluationTotalScoreInValid")
          statusModalTemp.needReload = false
          SetStatusModal(statusModalTemp)
          return
        }
    
        SetIsLoading(true)
        try {
            const config = getRequestConfigurations()
            if (actionCode == actionButton.reject || isApprove) { // Từ chối hoặc Phê duyệt
                const payload = {
                    ListFormCode: [{
                        formCode: evaluationFormDetailState?.formCode,
                        Approver: evaluationFormDetailState?.approver,
                        Reviewer: evaluationFormDetailState?.reviewer,
                    }],
                    type: actionCode,
                    CurrentStatus: evaluationFormDetailState?.status
                }
                const response = await axios.post(`${process.env.REACT_APP_HRDX_PMS_URL}api/form/ApproveBothReject`, payload, config)
                    SetIsLoading(false)
                    statusModalTemp.isShow = true
                    statusModalTemp.needReload = true
                    if (response?.data) {
                        const result = response.data?.result
                        if (result?.code == Constants.PMS_API_SUCCESS_CODE) {
                            statusModalTemp.isSuccess = true
                            statusModalTemp.content = getResponseMessages(evaluationFormDetailState?.status, actionCode, 'success')
                        } else {
                            statusModalTemp.isSuccess = false
                            statusModalTemp.content = result?.message
                        }
                    } else {
                        statusModalTemp.isSuccess = false
                        statusModalTemp.content = getResponseMessages(evaluationFormDetailState?.status, actionCode, 'failed')
                    }

                    if (!showByManager) {
                        SetStatusModal(statusModalTemp)
                    } else {
                        // updateParent(statusModalTemp)
                    }
            } else { // Lưu, CBNV Gửi tới bước tiếp theo, CBQLTT xác nhận
                const payload = { ...evaluationFormDetailState }
                payload.nextStep = actionCode
                payload.totalSeftPoint = Number(payload.totalSeftPoint).toFixed(2)
                payload.totalLeadReviewPoint = Number(payload.totalLeadReviewPoint).toFixed(2)
                
                const isZeroLevel = payload?.reviewStreamCode === processStep.zeroLevel
                const response = await axios.post(`${process.env.REACT_APP_HRDX_PMS_URL}api/${version}/targetform/update`, { requestString: JSON.stringify(payload || {}) }, config)
                SetErrors({})
                statusModalTemp.isShow = true
                statusModalTemp.needReload = actionCode == actionButton.approve
                if (response?.data) {
                    const result = response.data?.result
                    if (result?.code == Constants.PMS_API_SUCCESS_CODE) {
                        statusModalTemp.isSuccess = true
                        statusModalTemp.content = getResponseMessages(payload.status, actionCode, 'success', isZeroLevel)
                    } else {
                        statusModalTemp.isSuccess = false
                        statusModalTemp.content = result?.message
                    }
                } else {
                    statusModalTemp.isSuccess = false
                    statusModalTemp.content = getResponseMessages(payload.status, actionCode, 'failed', isZeroLevel)
                }

                if (!showByManager) {
                    SetStatusModal(statusModalTemp)
                } else {
                    const keepPopupEvaluationDetail = actionCode == actionButton.save
                    updateParent(statusModalTemp, keepPopupEvaluationDetail)
                }
            }
        } catch (e) {
            statusModalTemp.isShow = true
            statusModalTemp.isSuccess = false
            statusModalTemp.content = t("AnErrorOccurred")
            statusModalTemp.needReload = true
            if (!showByManager) {
                SetStatusModal(statusModalTemp)
            } else {
                updateParent(statusModalTemp)
            }
        } finally {
            SetIsLoading(false)
        }
    }

    const isOffLineType = evaluationFormDetailState?.formType === 'OFF'

    console.log("evaluationFormDetailState => ", evaluationFormDetailState)

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
                status={evaluationFormDetailState?.status}
                reviewStreamCode={evaluationFormDetailState?.reviewStreamCode}
                formType={evaluationFormDetailState?.formType}
                showByManager={showByManager}
                totalTarget={evaluationFormDetailState?.totalTarget}
                listGroup={evaluationFormDetailState?.groups}
                seftTotalComplete={evaluationFormDetailState?.seftTotalComplete}
                leadReviewTotalComplete={evaluationFormDetailState?.leadReviewTotalComplete}
                totalSeftPoint={evaluationFormDetailState?.totalSeftPoint}
                totalLeadReviewPoint={evaluationFormDetailState?.totalLeadReviewPoint}
            />
            <div className="card shadow evaluation-process" style={evaluationFormDetailState?.formType === 'OFF' ? { display: 'none' } : {}} >
                <div className="title">{t("EvaluationDetailASSESSMENTPROCESS")}</div>
                <div className="step-block">
                    <EvaluationSteps
                        status={evaluationFormDetailState?.status}
                        reviewStreamCode={evaluationFormDetailState?.reviewStreamCode}
                    />
                </div>
                <div className="employee-info-block">
                    <EvaluationEmployeeInfo
                        fullName={evaluationFormDetailState?.fullName}
                        position={evaluationFormDetailState?.position}
                        employeeLevel={evaluationFormDetailState?.employeeLevel}
                        organization_lv3={evaluationFormDetailState?.organization_lv3}
                        organization_lv4={evaluationFormDetailState?.organization_lv4}
                        hrAdmin={evaluationFormDetailState?.hrAdmin}
                        reviewStreamCode={evaluationFormDetailState?.reviewStreamCode}
                        reviewer={evaluationFormDetailState?.reviewer}
                        approver={evaluationFormDetailState?.approver}
                    />
                </div>
                {
                    (evaluationFormDetailState?.groups || []).map((group, gIndex) => {
                        const isDisableEmployeeComment = evaluationFormDetailState?.isEdit ? (showByManager || evaluationFormDetailState?.status != evaluationStatus.launch) : true
                        const isDisableManagerComment = evaluationFormDetailState?.isEdit ? (!showByManager || (showByManager && Number(evaluationFormDetailState?.status) >= Number(evaluationStatus.qlttAssessment))) : true

                        return (
                            <EvaluationGroup
                                key={`group-${gIndex}`}
                                isWorkResultBlock={gIndex === evaluationFormDetailState?.groups?.length - 1}
                                group={group}
                                status={evaluationFormDetailState?.status}
                                isEdit={evaluationFormDetailState?.isEdit}
                                showByManager={showByManager}
                                groupIndex={gIndex}
                                isDisableEmployeeComment={isDisableEmployeeComment}
                                isDisableManagerComment={isDisableManagerComment}
                                errors={errors}
                                handleInputChange={handleInputChange}
                            />
                        )
                    })
                }
            </div>
            <div className="button-block" style={isOffLineType ? { display: 'none' } : {}} >
                <Buttons 
                    showByManager={showByManager}
                    status={evaluationFormDetailState?.status}
                    isEdit={evaluationFormDetailState?.isEdit}
                    reviewer={evaluationFormDetailState?.reviewer}
                    approver={evaluationFormDetailState?.approver}
                    handleSubmit={handleSubmit}
                />
            </div>
            {
                !bottom && !isOffLineType &&
                (evaluationFormDetailState?.status == evaluationStatus.launch || (evaluationFormDetailState?.status == evaluationStatus.selfAssessment && localStorage.getItem('employeeNo') == JSON.parse(evaluationFormDetailState?.reviewer || '{}')?.uid))
                && evaluationFormDetailState?.isEdit && (
                    <div className="scroll-to-save" style={{ color: localStorage.getItem("companyThemeColor"), zIndex: '10' }}>
                        <div>
                            <button className="btn-action save mr-3" onClick={() => handleSubmit(actionButton.save, null, true)}><img src={IconSave} alt="Save" />{t("EvaluationDetailPartSave")}</button>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default VinGroupForm
