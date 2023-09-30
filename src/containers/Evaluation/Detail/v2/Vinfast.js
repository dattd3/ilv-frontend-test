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
const OtherKpiItem = ({ kpi, deviant, status, isEdit, showByManager, groupIndex, kpiIndex, groupChildrenLv1Index, errors, isDisableEmployeeComment = false, isDisableManagerComment = false, handleInputChange }) => {
    const { t } = useTranslation()

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
                    {/* {
                        !isChild
                        ? errors[`${index}_${i}_seftPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_seftPoint`]}</div>
                        : errors[`${index}_${parentIndex}_${subGroupTargetIndex}_seftPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${parentIndex}_${subGroupTargetIndex}_seftPoint`]}</div>
                    } */}
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
                    {/* {
                        !isChild
                        ? errors[`${index}_${i}_leadReviewPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_leadReviewPoint`]}</div>
                        : errors[`${index}_${parentIndex}_${subGroupTargetIndex}_leadReviewPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${parentIndex}_${subGroupTargetIndex}_leadReviewPoint`]}</div>
                    } */}
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

const WorkResultKpiItem = ({ kpi, deviant, status, isEdit, showByManager, groupIndex, kpiIndex, groupChildrenLv1Index, errors, handleInputChange }) => {
    const { t } = useTranslation()

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
                                {/* {errors[`${index}_${i}_realResult`] && (<div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_realResult`]}</div>)} */}
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
                                {/* {errors[`${index}_${i}_seftPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_seftPoint`]}</div>} */}
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
                                {/* {errors[`${index}_${i}_leadReviewPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_leadReviewPoint`]}</div>} */}
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
        </div>
    )
}

const EvaluationGroup = ({ isWorkResultBlock, group, status, isEdit, showByManager, groupIndex, isDisableEmployeeComment, isDisableManagerComment, errors, handleInputChange }) => {
    const { t } = useTranslation()
    const hasGroupChildrenLv1 = group?.groupChildren?.length > 0

    const renderListKPIs = (listKPIs = [], groupChildIndex, isWorkResultBlock = false, showDivider = false) => {
        return (
            (listKPIs).map((kpi, kIndex) => {
                let deviant = (kpi?.leadReviewPoint === '' || kpi?.leadReviewPoint === null || kpi?.seftPoint === '' || kpi?.seftPoint === null) ? '' : Number(kpi?.leadReviewPoint) - Number(kpi?.seftPoint)
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

const VinFastForm = (props) => {
    const { t } = useTranslation()
    const { evaluationFormDetail, showByManager } = props
    const { groups, status, formType : formTypeDetail, isEdit, reviewStreamCode } = evaluationFormDetail
    const [isLoading, SetIsLoading] = useState(false)
    const [errors, SetErrors] = useState({})
    const [statusModal, SetStatusModal] = useState({ isShow: false, isSuccess: true, content: "", needReload: true })

    const onHideStatusModal = () => {

    }

    const handleInputChange = (groupIndex, groupChildrenLv1Index, kpiIndex, key, e) => {
        console.log("==================================")
        console.log(evaluationFormDetail)
        console.log('input changing => ')
        console.log('groupIndex => ', groupIndex)
        console.log('groupChildrenLv1Index => ', groupChildrenLv1Index)
        console.log('kpiIndex => ', kpiIndex)
        console.log('key => ', key)
        console.log('e => ', e)
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
                status={status}
                reviewStreamCode={reviewStreamCode}
                formType={formTypeDetail}
                showByManager={showByManager}
                totalTarget={evaluationFormDetail?.totalTarget}
                listGroup={groups}
                seftTotalComplete={evaluationFormDetail?.seftTotalComplete}
                leadReviewTotalComplete={evaluationFormDetail?.leadReviewTotalComplete}
                totalSeftPoint={evaluationFormDetail?.totalSeftPoint}
                totalLeadReviewPoint={evaluationFormDetail?.totalLeadReviewPoint}
            />
            <div className="card shadow evaluation-process" style={formTypeDetail === 'OFF' ? { display: 'none' } : {}} >
                <div className="title">{t("EvaluationDetailASSESSMENTPROCESS")}</div>
                <div className="step-block">
                    <EvaluationSteps
                        status={status}
                        reviewStreamCode={reviewStreamCode}
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
                        reviewStreamCode={reviewStreamCode}
                        reviewer={evaluationFormDetail?.reviewer}
                        approver={evaluationFormDetail?.approver}
                    />
                </div>
                {
                    (groups || []).map((group, gIndex) => {
                        const isDisableEmployeeComment = isEdit ? (showByManager || status != evaluationStatus.launch) : true
                        const isDisableManagerComment = isEdit ? (!showByManager || (showByManager && Number(status) >= Number(evaluationStatus.qlttAssessment))) : true
                        const isVinBus = false

                        return (
                            <EvaluationGroup
                                key={`group-${gIndex}`}
                                isWorkResultBlock={gIndex === groups?.length - 1}
                                group={group}
                                status={status}
                                isEdit={isEdit}
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
        </>
    )
}

export default VinFastForm
