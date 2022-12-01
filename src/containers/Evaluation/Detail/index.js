import React, { useState, useEffect, useRef } from "react"
import Select from 'react-select'
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { Doughnut } from 'react-chartjs-2'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import _ from 'lodash'
import moment from "moment/moment";
import Constants from '../../../commons/Constants'
import { getRequestConfigurations } from '../../../commons/Utils'
import { evaluationStatus, actionButton } from '../Constants'
import { useGuardStore } from '../../../modules'
import LoadingModal from '../../../components/Common/LoadingModal'
import StatusModal from '../../../components/Common/StatusModal'
import HOCComponent from '../../../components/Common/HOCComponent'
import IconArrowRightWhite from '../../../assets/img/icon/pms/arrow-right-white.svg'
import IconArrowRightGray from '../../../assets/img/icon/pms/arrow-right-gray.svg'
import IconUp from '../../../assets/img/icon/pms/icon-up.svg'
import IconDown from '../../../assets/img/icon/pms/icon-down.svg'
import IconSave from '../../../assets/img/ic-save.svg'
import IconSendRequest from '../../../assets/img/icon/Icon_send.svg'
import IconReject from '../../../assets/img/icon/Icon_Cancel.svg'
import IconApprove from '../../../assets/img/icon/Icon_Check.svg'

const currentLocale = localStorage.getItem("locale")

const languageCodeMapping = {
  [Constants.LANGUAGE_VI]: 'vi',
  [Constants.LANGUAGE_EN]: 'en',
}

const formType = {
  MANAGER: 'LD',
  EMPLOYEE: 'NV',
}

const processStep = {
  zeroLevel: '0NF',
  oneLevel: '1NF',
  twoLevels: '2NF',
}

function EvaluationOverall(props) {
  const { t } = useTranslation()
  const { evaluationFormDetail, showByManager } = props
  const totalCompleted = showByManager ? evaluationFormDetail?.leadReviewTotalComplete || 0 : evaluationFormDetail?.seftTotalComplete || 0;
  const isDifferentZeroLevel = evaluationFormDetail.reviewStreamCode !== processStep.zeroLevel;

  const overallData = {
    // labels: ["Red", "Green"],
    datasets: [
      {
        data: [evaluationFormDetail?.totalTarget - totalCompleted, totalCompleted],
        backgroundColor: ["#DEE2E6", "#7AD731"],
        hoverBackgroundColor: ["#DEE2E6", "#7AD731"],
        borderWidth: 0
      }
    ]
  }

  const chartOption = {
    responsive: true,
    aspectRatio: 1,
    tooltips: { enabled: false },
    hover: { mode: null },
    cutoutPercentage: 75,
    plugins: {
      report: `${(totalCompleted / evaluationFormDetail?.totalTarget * 100).toFixed(2)}%`
    }
  }

  return <div className="block-overall">
    <div className="card shadow card-completed">
      <h6 className="text-center chart-title">{t("EvaluationDetailAccomplished")}: {totalCompleted || 0}/{evaluationFormDetail?.totalTarget}</h6>
      <div className="chart">
        <div className="detail">
          <div className="result">
            <Doughnut
              data={overallData}
              options={chartOption}
              width={138}
              height={138}
              plugins={
                [{
                  beforeDraw: function (chart, args, options) {
                    const width = chart.width,
                      height = chart.height,
                      ctx = chart.ctx;
                    ctx.restore()
                    // const fontSize = (height / 160).toFixed(2)
                    ctx.font = `normal normal bold 1.2em arial`
                    ctx.textBaseline = "top"
                    const text = chart?.options?.plugins?.report,
                      textX = Math.round((width - ctx.measureText(text).width) / 2),
                      textY = height / 2;
                    ctx.fillText(text, textX, textY)
                    ctx.save()
                  }
                }]
              }
            />
          </div>
        </div>
      </div>
    </div>
    <div className="card shadow card-overall">
      <h6 className="text-center chart-title">{t("EvaluationDetailOverallScore")}</h6>
      <div className="chart">
        <div className="detail">{(evaluationFormDetail?.status == evaluationStatus.launch || (evaluationFormDetail?.status == evaluationStatus.selfAssessment && !showByManager) || evaluationFormDetail?.reviewStreamCode === processStep.zeroLevel) ? evaluationFormDetail?.totalSeftPoint?.toFixed(2) || 0 : evaluationFormDetail?.totalLeadReviewPoint?.toFixed(2) || 0}</div>
      </div>
    </div>
    <div className="card shadow card-detail">
      <table className='table-list-evaluation'>
        <thead>
          <tr>
            <th className='c-criteria'><div className='criteria'>{t("EvaluationDetailCriteria")}</div></th>
            <th className='c-self-assessment text-center'><div className='self-assessment'>{t("EvaluationDetailSelfAssessment")}</div></th>
            {isDifferentZeroLevel && <th className='c-manager-assessment text-center'><div className='manager-assessment color-red'>{t("EvaluationDetailManagerAssessment")}</div></th>}
          </tr>
        </thead>
        <tbody>
          {
            (evaluationFormDetail?.listGroup || []).map((item, i) => {
              return <tr key={i}>
                <td className='c-criteria'><div className='criteria'>{JSON.parse(item?.groupName || '{}')[languageCodeMapping[currentLocale]]}</div></td>
                <td className='c-self-assessment text-center'>{(item?.groupSeftPoint || 0).toFixed(2)}</td>
                {isDifferentZeroLevel && <td className='c-manager-assessment text-center color-red'>{(item?.groupLeadReviewPoint || 0).toFixed(2)}</td>}
              </tr>
            })
          }
          <tr>
            <td className='c-criteria'><div className='font-weight-bold text-uppercase criteria'>{t("EvaluationDetailOverallScore")}</div></td>
            <td className='c-self-assessment text-center font-weight-bold'>{(evaluationFormDetail?.totalSeftPoint || 0).toFixed(2)}</td>
            {isDifferentZeroLevel && <td className='c-manager-assessment text-center font-weight-bold color-red'>{(evaluationFormDetail?.totalLeadReviewPoint || 0).toFixed(2)}</td>}
          </tr>
        </tbody>
      </table>
    </div>
  </div>
}

function EvaluationProcess(props) {
  const { evaluationFormDetail, showByManager, errors, updateData } = props
  const { t } = useTranslation();
  const formatIndexText = index => {
    const mapping = {
      1: 'I',
      2: 'II',
      3: 'III',
      4: 'IV',
      5: 'V',
      6: 'VI',
      7: 'VII',
      8: 'VIII',
      9: 'IX',
      10: 'X'
    }
    return mapping[index]
  }
  const { checkPhaseFormEndDate, reviewStreamCode, status, isEdit } = evaluationFormDetail;
  const isDifferentZeroLevel = reviewStreamCode !== processStep.zeroLevel;
  let stepStatusMapping, stepEvaluationConfig;

  switch (reviewStreamCode) {
    case processStep.zeroLevel:
      stepEvaluationConfig = [t("EvaluationDetailSelfAssessment"), t("EvaluationDetailCompleted")];
      stepStatusMapping = {
        [evaluationStatus.launch]: 0,
        [evaluationStatus.selfAssessment]: null,
        [evaluationStatus.qlttAssessment]: null,
        [evaluationStatus.cbldApproved]: 1,
      };
      break;
    case processStep.oneLevel:
      stepEvaluationConfig = [t("EvaluationDetailSelfAssessment"), t("EvaluationDetailManagerAssessment"), t("EvaluationDetailCompleted")];
      stepStatusMapping = {
        [evaluationStatus.launch]: 0,
        [evaluationStatus.selfAssessment]: 1,
        [evaluationStatus.qlttAssessment]: null,
        [evaluationStatus.cbldApproved]: 2,
      };
    default:
      break;
    case processStep.twoLevels:
      stepEvaluationConfig = [t("EvaluationDetailSelfAssessment"), t("EvaluationDetailManagerAssessment"), t("EvaluationDetailManagerApprove"), t("EvaluationDetailCompleted")];
      stepStatusMapping = {
        [evaluationStatus.launch]: 0,
        [evaluationStatus.selfAssessment]: 1,
        [evaluationStatus.qlttAssessment]: 2,
        [evaluationStatus.cbldApproved]: 3,
      };
      break;
  }

  const renderEvaluationStep = () => {
      return stepEvaluationConfig.map((item, index) => {
        let activeClass = index === stepStatusMapping[evaluationFormDetail?.status] ? 'active' : ''
        return (
          <div className="wrap-item" key={index}>
            <div className="line"><hr /></div>
            <div className={`info ${activeClass}`}>
              <div className="item">
                <span className="no"><span>{index + 1}</span></span>
                <span className="name">{item}</span>
                <Image src={!activeClass ? IconArrowRightGray : IconArrowRightWhite} alt="Next" className="next" />
              </div>
            </div>
          </div>
        )
    })
  }

  const renderEmployeeInfos = () => {
    const approverInfos = JSON.parse(evaluationFormDetail?.approver || '{}')
    const reviewerInfos = JSON.parse(evaluationFormDetail?.reviewer || '{}')
    const isShowManagerApproverInfo = evaluationFormDetail?.reviewStreamCode === processStep.twoLevels

    return (
      <>
        <div className="title">{t("EvaluationDetailEmployeeInfo")}</div>
        <div className="detail align-items-start">
          <div className="left">
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeFullName")}</span><span>:</span></span>
              <span className="value">{evaluationFormDetail?.fullName || ''}</span>
            </div>
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeJobTitle")}</span><span>:</span></span>
              <span className="value">{evaluationFormDetail?.position || ''}</span>
            </div>
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeJobLevel")}</span><span>:</span></span>
              <span className="value">{evaluationFormDetail?.employeeLevel || ''}</span>
            </div>
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeDivision")}</span><span>:</span></span>
              <span className="value">{evaluationFormDetail?.organization_lv3 || ''}</span>
            </div>
          </div>
          <div className="right">
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeDepartment")}</span><span>:</span></span>
              <span className="value">{evaluationFormDetail?.organization_lv4 || ''}</span>
            </div>
            {
              isDifferentZeroLevel && 
                <div className="info-item">
                  <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeManagerAssessment")}</span><span>:</span></span>
                  <span className="value">{reviewerInfos?.fullname && `${reviewerInfos?.fullname || ''} - ${reviewerInfos?.position_title || ''}`}</span>
                </div>
            }
            {
              isShowManagerApproverInfo && 
              <div className="info-item">
                <span className="label"><span className="font-weight-bold">{t("EvaluationDetailEmployeeManagerApprove")}</span><span>:</span></span>
                <span className="value">{approverInfos?.fullname && `${approverInfos?.fullname || ''} - ${approverInfos?.position_title || ''}`}</span>
              </div>
            }
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">HR Admin</span><span>:</span></span>
              <span className="value">{`${evaluationFormDetail?.hrAdmin || ''}`}</span>
            </div>
          </div>
        </div>
      </>
    )
  }

  const prepareScores = (listGroupConfig) => {
    if (!listGroupConfig || listGroupConfig?.length === 0) {
      return []
    }
    const scores = (listGroupConfig || []).map((item, index) => index + 1)
    return scores
  }

  const handleInputChange = (subIndex, parentIndex, stateName, element, childIndex) => {
    const val = element?.target?.value || ""
    if (['seftPoint', 'leadReviewPoint'].includes(stateName) && (!(/^\d*$/.test(Number(val))) || val.includes('.'))) {
      return
    }
    updateData(subIndex, parentIndex, stateName, val, childIndex)
  }

  const renderEvaluationItem = (item, index, scores, target, i, deviant, parentIndex, subGroupTargetIndex) => {
    const isChild = !_.isNil(parentIndex);
    return <div className="evaluation-item" key={target.id}>
      {!isChild ? <div className="title">{`${i + 1}. ${JSON.parse(target?.targetName || '{}')[languageCodeMapping[currentLocale]]}`}</div> : <div className="sub-title">{`${parentIndex + 1}.${subGroupTargetIndex + 1} ${JSON.parse(target?.targetName || '{}')[languageCodeMapping[currentLocale]]}`}</div>}
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
              {errors[`${index}_${i}_seftPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_seftPoint`]}</div>}
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
              {errors[`${index}_${i}_${subGroupTargetIndex}_leadReviewPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_${subGroupTargetIndex}_leadReviewPoint`]}</div>}
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
                    <ul>
                      {
                        target?.jobDetail && <li>{target?.jobDetail}</li>
                      }
                      <li>{target?.metric1}</li>
                      <li>{target?.metric2}</li>
                      <li>{target?.metric3}</li>
                      <li>{target?.metric4}</li>
                      <li>{target?.metric5}</li>
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
          <textarea 
            rows={1} 
            placeholder={isEdit ? !(showByManager || evaluationFormDetail.status != evaluationStatus.launch) ? t("EvaluationDetailPartSelectScoreInput") : '' : ''} 
            value={target?.seftOpinion || ""} 
            onChange={(e) => !_.isNil(subGroupTargetIndex) ? handleInputChange(parentIndex, index, 'seftOpinion', e, subGroupTargetIndex) : handleInputChange(i, index, 'seftOpinion', e)} 
            disabled={isEdit ? (showByManager || evaluationFormDetail.status != evaluationStatus.launch) : true} />
        </div>
        <div className="qltt">
          <p>{t("EvaluationDetailPartAttitudeCommentOfManager")}</p>
          <textarea 
            rows={1} 
            placeholder={isEdit ? !(!showByManager || (showByManager && Number(evaluationFormDetail.status) >= Number(evaluationStatus.qlttAssessment))) ? t("EvaluationDetailPartSelectScoreInput") : '' : ''} 
            value={target?.leaderReviewOpinion || ""} 
            onChange={(e) => !_.isNil(subGroupTargetIndex) ? handleInputChange(parentIndex, index, 'leaderReviewOpinion', e, subGroupTargetIndex) : handleInputChange(i, index, "leaderReviewOpinion", e)} 
            disabled={isEdit ? (!showByManager || (showByManager && Number(evaluationFormDetail.status) >= Number(evaluationStatus.qlttAssessment))) : true} />
        </div>
      </div>
    </div>
  }

  return <div className="card shadow evaluation-process">
    <div className="title">{t("EvaluationDetailASSESSMENTPROCESS")}</div>
    <div className="step-block">
      {renderEvaluationStep()}
    </div>
    <div className="employee-info-block">
      {renderEmployeeInfos()}
    </div>

    {
      (evaluationFormDetail?.listGroup || []).map((item, index) => {
        let indexText = formatIndexText(index + 1)
        // let scores = prepareScores(item?.listGroupConfig)
        let scores = [1, 2, 3, 4, 5]
        let isAttitudeBlock = item?.listGroupConfig && item?.listGroupConfig?.length > 0

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
                // const companyCode = localStorage.getItem('companyCode');
                const companyCodeForTemplate = evaluationFormDetail?.companyCode
                if (evaluationFormDetail?.formType == formType.EMPLOYEE && companyCodeForTemplate != Constants.pnlVCode.VinMec) { // Biểu mẫu giành cho Nhân viên
                  return renderEvaluationItem(item, index, scores, target, i, deviant)
                }
                if (evaluationFormDetail?.formType == formType.MANAGER || (companyCodeForTemplate == Constants.pnlVCode.VinMec && evaluationFormDetail?.formType == formType.EMPLOYEE)) { // Biểu mẫu giành cho CBLĐ
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
                                  <ul>
                                    {
                                      target?.jobDetail && <li>{target?.jobDetail}</li>
                                    }
                                    <li>{target?.metric1}</li>
                                    <li>{target?.metric2}</li>
                                    <li>{target?.metric3}</li>
                                    <li>{target?.metric4}</li>
                                    <li>{target?.metric5}</li>
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
                            <textarea 
                              rows={1} 
                              placeholder={isEdit ? !(showByManager || evaluationFormDetail.status != evaluationStatus.launch) ? t("EvaluationDetailPartSelectScoreInput") : '' : ''} 
                              value={target?.seftOpinion || ""} 
                              onChange={(e) => handleInputChange(i, index, 'seftOpinion', e)} 
                              disabled={isEdit ? (showByManager || evaluationFormDetail.status != evaluationStatus.launch) : true} />
                          </div>
                          <div className="qltt">
                            <p>{t("EvaluationDetailPartAttitudeCommentOfManager")}</p>
                            <textarea 
                              rows={1} 
                              placeholder={isEdit ? !(!showByManager || (showByManager && Number(evaluationFormDetail.status) >= Number(evaluationStatus.qlttAssessment))) ? t("EvaluationDetailPartSelectScoreInput") : '' : ''} 
                              value={target?.leaderReviewOpinion || ""} 
                              onChange={(e) => handleInputChange(i, index, "leaderReviewOpinion", e)} 
                              disabled={isEdit ? (!showByManager || (showByManager && Number(evaluationFormDetail.status) >= Number(evaluationStatus.qlttAssessment))) : true} />
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
  </div>
}

function EvaluationDetail(props) {
  const { t } = useTranslation()
  const [evaluationFormDetail, SetEvaluationFormDetail] = useState(null)
  const [isLoading, SetIsLoading] = useState(false)
  const [statusModal, SetStatusModal] = useState({ isShow: false, isSuccess: true, content: "" })
  const [errors, SetErrors] = useState({})
  const { showByManager, updateParent } = props
  const guard = useGuardStore()
  const user = guard.getCurentUser()
  const evaluationFormId = showByManager ? props?.evaluationFormId : props.match.params.id
  const formCode = showByManager ? props?.formCode : props.match.params.formCode
  const [bottom, setBottom] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    const processEvaluationFormDetailData = response => {
      if (response && response.data) {
        const result = response.data.result
        if (result && result.code == Constants.PMS_API_SUCCESS_CODE) {
          const evaluationFormDetailTemp = response.data?.data;
          if (evaluationFormDetailTemp.listGroup) {
            evaluationFormDetailTemp.listGroup = ([...evaluationFormDetailTemp?.listGroup] || []).sort((pre, next) => pre?.groupOrder - next?.groupOrder)
          }

          // const totalQuestionsAnswered = (evaluationFormDetailTemp?.listGroup || []).reduce((initial, current) => {
          //     let questionsAnswered = (current?.listTarget || []).reduce((subInitial, subCurrent) => {
          //         subInitial += subCurrent?.seftPoint ? 1 : 0
          //         return subInitial
          //     }, 0)
          //     initial += questionsAnswered
          //     return initial
          // }, 0)
          // evaluationFormDetailTemp.totalComplete = totalQuestionsAnswered
          SetEvaluationFormDetail(evaluationFormDetailTemp)
          // SetEvaluationFormDetail(testEvaluationData)
          setDataLoaded(true)
        }
      }
    }

    const fetchEvaluationFormDetails = async () => {
      SetIsLoading(true)
      try {
        const config = getRequestConfigurations()
        config.params = {
          checkPhaseFormId: evaluationFormId,
          EmployeeCode: showByManager ? props.employeeCode : user?.employeeNo,
          FormCode: formCode
        }
        const response = await axios.get(`${process.env.REACT_APP_HRDX_PMS_URL}api/targetform/formbyuser`, config)
        processEvaluationFormDetailData(response)
      } catch (e) {
        SetStatusModal({
          ...statusModal,
          isShow: true,
          content: t("AnErrorOccurred"),
          isSuccess: false,
        })
      } finally {
        SetIsLoading(false)
      }
    }

    fetchEvaluationFormDetails()
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 200;
    setBottom(bottom)
  };

  const calculateAssessment = (listTarget) => {
    const assessmentScale = 5
    const assessment = (listTarget || []).reduce((initial, current) => {
      initial.selfAssessment += Number(current?.seftPoint || 0) / assessmentScale * Number(current?.weight || 0)
      initial.managerAssessment += Number(current?.leadReviewPoint || 0) / assessmentScale * Number(current?.weight || 0)
      if (current.listTarget?.length) {
        const sub = current.listTarget?.reduce((subInitial, item) => {
          subInitial.selfAssessment += Number(item?.seftPoint || 0) / assessmentScale * Number(item?.weight || 0)
          subInitial.managerAssessment += Number(item?.leadReviewPoint || 0) / assessmentScale * Number(item?.weight || 0)
          return subInitial
        }, { selfAssessment: 0, managerAssessment: 0 })
        initial.selfAssessment += sub.selfAssessment
        initial.managerAssessment += sub.managerAssessment
      }
      return initial
    }, { selfAssessment: 0, managerAssessment: 0 })
    return assessment
  }

  const getTotalInfoByListGroup = (listGroup) => {
    const result = (listGroup || []).reduce((initial, current) => {
      let assessment = calculateAssessment(current?.listTarget)
      initial.self += assessment?.selfAssessment * Number(current?.groupWeight) / 100
      initial.manager += assessment?.managerAssessment * Number(current?.groupWeight) / 100
      return initial
    }, { self: 0, manager: 0 })
    return result
  }

  const updateData = (subIndex, parentIndex, stateName, value, childIndex) => {
    const evaluationFormDetailTemp = { ...evaluationFormDetail }
    if (_.isNil(childIndex)) {
      evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex][stateName] = value
    } else {
      evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex].listTarget[childIndex][stateName] = value
    }
    let totalQuestionsAnswered = 0
    if (showByManager) {
      totalQuestionsAnswered = (evaluationFormDetailTemp?.listGroup || []).reduce((initial, current) => {
        let questionsAnswered = (current?.listTarget || []).reduce((subInitial, subCurrent) => {
          subInitial += subCurrent?.leadReviewPoint ? 1 : 0
          if (subCurrent.listTarget?.length) {
            const subQuestionsAnswered = subCurrent.listTarget?.reduce((res, item) => {
              res += item.leadReviewPoint ? 1 : 0
              return res
            }, 0)
            subInitial += subQuestionsAnswered
          }
          return subInitial
        }, 0)
        initial += questionsAnswered
        return initial
      }, 0)
    } else {
      totalQuestionsAnswered = (evaluationFormDetailTemp?.listGroup || []).reduce((initial, current) => {
        let questionsAnswered = (current?.listTarget || []).reduce((subInitial, subCurrent) => {
          subInitial += subCurrent?.seftPoint ? 1 : 0
          if (subCurrent.listTarget?.length) {
            const subQuestionsAnswered = subCurrent.listTarget?.reduce((res, item) => {
              res += item.seftPoint ? 1 : 0
              return res
            }, 0)
            subInitial += subQuestionsAnswered
          }
          return subInitial
        }, 0)
        initial += questionsAnswered
        return initial
      }, 0)
    }

    evaluationFormDetailTemp.listGroup = [...evaluationFormDetailTemp.listGroup || []].map(item => {
      return {
        ...item,
        groupSeftPoint: calculateAssessment(item?.listTarget)?.selfAssessment || 0,
        groupLeadReviewPoint: calculateAssessment(item?.listTarget)?.managerAssessment || 0
      }
    })
    const totalInfos = getTotalInfoByListGroup(evaluationFormDetailTemp.listGroup)
    if (showByManager) {
      evaluationFormDetailTemp.leadReviewTotalComplete = totalQuestionsAnswered
    } else {
      evaluationFormDetailTemp.seftTotalComplete = totalQuestionsAnswered
    }
    evaluationFormDetailTemp.totalSeftPoint = totalInfos?.self || 0
    evaluationFormDetailTemp.totalLeadReviewPoint = totalInfos?.manager || 0
    SetEvaluationFormDetail(evaluationFormDetailTemp)
  }

  const renderButtonBlock = () => {
    const currentUserLoggedUID = localStorage.getItem('employeeNo');
    const reviewerUID = JSON.parse(evaluationFormDetail?.reviewer || '{}')?.uid;
    const approverUID = JSON.parse(evaluationFormDetail?.approver || '{}')?.uid;
    const { isEdit } = evaluationFormDetail;

    if(!isEdit) return null;

    switch (evaluationFormDetail?.status) {
      case evaluationStatus.launch:
        return (
          <>
            <button className="btn-action save" onClick={() => handleSubmit(actionButton.save, null, true)}><Image src={IconSave} alt="Save" />{t("EvaluationDetailPartSave")}</button>
            <button className="btn-action send" onClick={() => handleSubmit(actionButton.approve)}><Image src={IconSendRequest} alt="Send" />{t("EvaluationDetailPartSubmitToNextStep")}</button>
          </>
        )
      case evaluationStatus.selfAssessment:
        if (showByManager && currentUserLoggedUID == reviewerUID) {
          return (
            <>
              <button className="btn-action save mr-3" onClick={() => handleSubmit(actionButton.save, null, true)}><Image src={IconSave} alt="Save" />{t("EvaluationDetailPartSave")}</button>
              <button className="btn-action reject" onClick={() => handleSubmit(actionButton.reject, null, true)}><Image src={IconReject} alt="Reject" />{t("EvaluationDetailPartReject")}</button>
              <button className="btn-action confirm" onClick={() => handleSubmit(actionButton.approve)}><Image src={IconApprove} alt="Confirm" />{t("EvaluationDetailPartConfirm")}</button>
            </>
          )
        }
        return null
      case evaluationStatus.qlttAssessment:
        if (showByManager && currentUserLoggedUID == approverUID) {
          return (
            <>
              <button className="btn-action reject" onClick={() => handleSubmit(actionButton.reject, null, true)}><Image src={IconReject} alt="Reject" />{t("EvaluationDetailPartReject")}</button>
              <button className="btn-action approve" onClick={() => handleSubmit(actionButton.approve, true)}><Image src={IconApprove} alt="Approve" />{t("EvaluationDetailPartApprove")}</button>
            </>
          )
        }
        return null
    }
  }

  const getResponseMessages = (formStatus, actionCode, apiStatus, isZeroLevel = false) => {
    const messageMapping = {
      [actionButton.save]: {
        [evaluationStatus.launch]: {
          success: t("EvaluationFormSaveSuccessfully"),
          failed: t("EvaluationFailedToSaveForm"),
        }
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
        }
      },
      [actionButton.reject]: {
        [evaluationStatus.selfAssessment]: {
          success: t("EvaluationFormSentBackToEmployeeSuccessfully"),
          failed: t("EvaluationFailedToSendTheFormBackToEmployee"),
        },
        [evaluationStatus.qlttAssessment]: {
          success: t("EvaluationFormSubmittedToManager"),
          failed: t("EvaluationFailedToReSubmitForm"),
        }
      }
    }
    return messageMapping[actionCode][formStatus][apiStatus]
  }

  const onHideStatusModal = () => {
    const statusModalTemp = { ...statusModal }
    statusModalTemp.isShow = false
    statusModalTemp.isSuccess = true
    statusModalTemp.content = ""
    SetStatusModal(statusModalTemp)
    window.location.reload()
  }

  const isDataValid = () => {
    const errorResult = (evaluationFormDetail?.listGroup || []).reduce((initial, currentParent, indexParent) => {
      let targetErrors = {}
      if (currentParent?.listGroupConfig && currentParent?.listGroupConfig?.length > 0) {
        targetErrors = (currentParent?.listTarget || []).reduce((subInitial, subCurrent, subIndex) => {
          let keyData = showByManager ? 'leadReviewPoint' : 'seftPoint'
          subInitial[`${indexParent}_${subIndex}_${keyData}`] = null
          if (!subCurrent.listTarget?.length) {
            if (!Number(subCurrent[keyData])) {
              subInitial[`${indexParent}_${subIndex}_${keyData}`] = t("Required")
            }
          } else {
            const childErrors = subCurrent.listTarget?.map((childTarget, childIndex) => {
              subInitial[`${indexParent}_${subIndex}_${childIndex}_${keyData}`] = null
              if (!Number(childTarget[keyData])) {
                subInitial[`${indexParent}_${subIndex}_${childIndex}_${keyData}`] = t("Required")
              }
            })
          }

          return subInitial
        }, {})
      } else {
        targetErrors = (currentParent?.listTarget || []).reduce((subInitial, subCurrent, subIndex) => {
          if (showByManager) {
            subInitial[`${indexParent}_${subIndex}_leadReviewPoint`] = null
            if (!Number(subCurrent?.leadReviewPoint)) {
              subInitial[`${indexParent}_${subIndex}_leadReviewPoint`] = t("Required")
            }
            return subInitial
          } else {
            subInitial[`${indexParent}_${subIndex}_seftPoint`] = null
            subInitial[`${indexParent}_${subIndex}_realResult`] = null
            if (!Number(subCurrent?.seftPoint)) {
              subInitial[`${indexParent}_${subIndex}_seftPoint`] = t("Required")
            }
            if (!subCurrent?.realResult) {
              subInitial[`${indexParent}_${subIndex}_realResult`] = t("Required")
            }
            return subInitial
          }
        }, {})
      }
      initial = { ...initial, ...targetErrors }
      return initial
    }, {})
    SetErrors(errorResult)
    return (Object.values(errorResult) || []).every(item => !item)
  }

  const handleSubmit = async (actionCode, isApprove, isSaveDraft) => {
    if (!isSaveDraft || (actionCode !== actionButton.reject && actionCode !== actionButton.save)) {
      const isValid = isDataValid()
      if (!isValid) {
        return
      }
    }

    SetIsLoading(true)
    const statusModalTemp = { ...statusModal }
    try {
      const config = getRequestConfigurations()
      if (actionCode == actionButton.reject || isApprove) { // Từ chối hoặc Phê duyệt
        const payload = {
          ListFormCode: [{
            formCode: evaluationFormDetail?.formCode,
            Approver: evaluationFormDetail?.approver,
            Reviewer: evaluationFormDetail?.reviewer
          }],
          type: actionCode,
          CurrentStatus: evaluationFormDetail?.status
        }
        const response = await axios.post(`${process.env.REACT_APP_HRDX_PMS_URL}api/form/ApproveBothReject`, payload, config)
        SetIsLoading(false)
        statusModalTemp.isShow = true
        if (response && response.data) {
          const result = response.data.result
          if (result.code == Constants.PMS_API_SUCCESS_CODE) {
            statusModalTemp.isSuccess = true
            statusModalTemp.content = getResponseMessages(evaluationFormDetail?.status, actionCode, 'success')
          } else {
            statusModalTemp.isSuccess = false
            statusModalTemp.content = result?.message
          }
        } else {
          statusModalTemp.isSuccess = false
          statusModalTemp.content = getResponseMessages(evaluationFormDetail?.status, actionCode, 'failed')
        }
        if (!showByManager) {
          SetStatusModal(statusModalTemp)
        } else {
          updateParent(statusModalTemp)
        }
      } else { // Lưu, CBNV Gửi tới bước tiếp theo, CBQLTT xác nhận
        const payload = { ...evaluationFormDetail }
        payload.nextStep = actionCode
        const isZeroLevel = payload?.reviewStreamCode === processStep.zeroLevel
        const response = await axios.post(`${process.env.REACT_APP_HRDX_PMS_URL}api/targetform/update`, { requestString: JSON.stringify(payload || {}) }, config)
        SetIsLoading(false)
        statusModalTemp.isShow = true
        if (response && response.data) {
          const result = response.data.result
          if (result.code == Constants.PMS_API_SUCCESS_CODE) {
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
          updateParent(statusModalTemp)
        }
      }
    } catch (e) {
      SetIsLoading(false)
      statusModalTemp.isShow = false
      statusModalTemp.isSuccess = false
      statusModalTemp.content = t("AnErrorOccurred")
      if (!showByManager) {
        SetStatusModal(statusModalTemp)
      } else {
        updateParent(statusModalTemp)
      }
    }
  }

  return (
    <>
      <LoadingModal show={isLoading} />
      {!showByManager && <StatusModal show={statusModal.isShow} isSuccess={statusModal.isSuccess} content={statusModal.content} onHide={onHideStatusModal} />}
      <div className="evaluation-detail-page">
        {
          dataLoaded 
          ?
          (!evaluationFormDetail || _.size(evaluationFormDetail) === 0 || !evaluationFormDetail?.companyCode)
          ? <h6 className="alert alert-danger" role="alert">{t("NoDataFound")}</h6>
          :
            <>
              <h1 className="content-page-header">{`${evaluationFormDetail?.checkPhaseFormName} ${t("of")} ${evaluationFormDetail?.fullName}`}</h1>
              <div>
                <EvaluationOverall evaluationFormDetail={evaluationFormDetail} showByManager={showByManager} />
                <EvaluationProcess evaluationFormDetail={evaluationFormDetail} showByManager={showByManager} errors={errors} updateData={updateData} />
                <div className="button-block">
                  {renderButtonBlock()}
                </div>
              </div>
              {!bottom &&
                (evaluationFormDetail?.status == evaluationStatus.launch ||
                  (evaluationFormDetail?.status == evaluationStatus.selfAssessment && localStorage.getItem('employeeNo') == JSON.parse(evaluationFormDetail?.reviewer || '{}')?.uid)) && evaluationFormDetail?.isEdit && (
                    <div className="scroll-to-save" style={{ color: localStorage.getItem("companyThemeColor"), zIndex: '10' }}>
                      <div>
                        <button className="btn-action save mr-3" onClick={() => handleSubmit(actionButton.save, null, true)}><Image src={IconSave} alt="Save" />{t("EvaluationDetailPartSave")}</button>
                      </div>
                    </div>
                  )}
            </>
          : null
        }
      </div>

    </>
  )
}

export default HOCComponent(EvaluationDetail)
