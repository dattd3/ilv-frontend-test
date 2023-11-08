import React, { useState, useEffect } from "react"
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { Doughnut } from 'react-chartjs-2'
import axios from 'axios'
import _ from 'lodash'
import Constants from '../../../commons/Constants'
import { getRequestConfigurations } from '../../../commons/Utils'
import { calculateRating, isVinBusByCompanyCode, calculateScore, formatEvaluationNumber } from '../Utils'
import { evaluationStatus, actionButton, processStep, languageCodeMapping, evaluationApiVersion } from '../Constants'
import { useGuardStore } from '../../../modules'
import LoadingModal from '../../../components/Common/LoadingModal'
import StatusModal from '../../../components/Common/StatusModal'
import HOCComponent from '../../../components/Common/HOCComponent'
import EvaluationVinBusTemplate from '../Templates/VinBus'
import EvaluationVinGroupTemplate from '../Templates/Vingroup'
import Evaluation360 from "./Evaluation360"
import IconArrowRightWhite from '../../../assets/img/icon/pms/arrow-right-white.svg'
import IconArrowRightGray from '../../../assets/img/icon/pms/arrow-right-gray.svg'
import IconSave from '../../../assets/img/ic-save.svg'
import IconSendRequest from '../../../assets/img/icon/Icon_send.svg'
import IconReject from '../../../assets/img/icon/Icon_Cancel.svg'
import IconApprove from '../../../assets/img/icon/Icon_Check.svg'
import VinGroupForm from "./v2/Vingroup"
import VinBusForm from "./v2/VinBus"

const currentLocale = localStorage.getItem("locale")

function EvaluationOverall(props) {
  const { t } = useTranslation();
  const { evaluationFormDetail, showByManager } = props;
  const isOffLineType = evaluationFormDetail?.formType === 'OFF';
  const totalCompleted = showByManager ? evaluationFormDetail?.leadReviewTotalComplete || 0 : evaluationFormDetail?.seftTotalComplete || 0;
  const isDifferentZeroLevel = evaluationFormDetail.reviewStreamCode !== processStep.zeroLevel;

  const overallData = {
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
      report: `${formatEvaluationNumber((totalCompleted / evaluationFormDetail?.totalTarget * 100))}%`
    }
  }
  
  return <div className="block-overall">
    <div className="card shadow card-completed" style={isOffLineType ? { display: 'none' } : {}} >
      <h6 className="text-center text-uppercase chart-title">{t("EvaluationDetailAccomplished")}: <span className="font-weight-bold">{totalCompleted || 0}/{evaluationFormDetail?.totalTarget}</span></h6>
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
    <div className="card shadow card-overall" style={{ marginLeft: isOffLineType && 0 }}>
      <h6 className="text-center text-uppercase font-weight-bold chart-title">{t("EvaluationDetailOverallScore")}</h6>
      <div className="chart">
        <div className="detail">
          {(evaluationFormDetail?.status == evaluationStatus.launch ||
            (evaluationFormDetail?.status ==
              evaluationStatus.selfAssessment &&
              !showByManager) ||
            evaluationFormDetail?.reviewStreamCode ===
              processStep.zeroLevel) &&
          !isOffLineType
            ? formatEvaluationNumber(evaluationFormDetail?.totalSeftPoint)
            : formatEvaluationNumber(
                evaluationFormDetail?.totalLeadReviewPoint
              )}
        </div>
      </div>
    </div>
    <div className="card shadow card-detail">
      <table className='table-list-evaluation'>
        <thead>
          <tr className="highlight">
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
          {/* Row điểm tổng thể */}
          <tr className="highlight">
            <td className='c-criteria'><div className='font-weight-bold text-uppercase criteria'>{t("EvaluationDetailOverallScore")}</div></td>
            <td className='c-self-assessment text-center font-weight-bold'>{(evaluationFormDetail?.totalSeftPoint || 0).toFixed(2)}</td>
            {isDifferentZeroLevel && <td className='c-manager-assessment text-center font-weight-bold color-red'>{(evaluationFormDetail?.totalLeadReviewPoint || 0).toFixed(2)}</td>}
          </tr>
          {/* {
            isVinBusByCompanyCode(evaluationFormDetail?.companyCode) &&
            <tr>
              <td colSpan={3} className='text-uppercase text-center'><div className="d-flex justify-content-center align-items-center">Xếp hạng đánh giá: <span style={{ fontWeight: 'bold', color: '#C11D2A', fontSize: 20, marginLeft: 3, marginTop: -1}}>{evaluationFormDetail?.evaluateRating || ''}</span></div></td>
            </tr>
          } */}
        </tbody>
      </table>
    </div>
  </div>
}

function EvaluationProcess(props) {
  const { t } = useTranslation();
  const { evaluationFormDetail, showByManager, errors, updateData } = props;

  const isOffLineType = evaluationFormDetail?.formType === 'OFF';
  const { reviewStreamCode, isEdit } = evaluationFormDetail;
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
      return (stepEvaluationConfig || []).map((item, index) => {
        let activeClass = index === stepStatusMapping[evaluationFormDetail?.status] ? 'active' : '';
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

  const handleInputChange = (subIndex, parentIndex, stateName, element, childIndex) => {
    const val = element?.target?.value || ""

    if (isVinBusByCompanyCode(evaluationFormDetail?.companyCode)) {
      if (['realResult', 'leadRealResult'].includes(stateName) 
        && (
          !(/^[0-9][0-9,\.]*$/.test(Number(val))) 
          || Number(val) > 100 
          || (val?.split('.')[1] && val?.split('.')[1]?.length > 2) 
          || (Number(val) === 0 && !val?.includes('.') && val?.length > 1)
        )
      ) {
        return
      }
    } else {
      if (['seftPoint', 'leadReviewPoint'].includes(stateName) && (!(/^\d*$/.test(Number(val))) || val.includes('.'))) {
        return
      }
    }

    updateData(subIndex, parentIndex, stateName, val, childIndex)
  }

  const renderFormMainInfo = (code) => {
    switch (code) {
      case Constants.pnlVCode.VinBus:
        return (
          <EvaluationVinBusTemplate 
            evaluationFormDetail={evaluationFormDetail} 
            isEdit={isEdit} 
            showByManager={showByManager}
            evaluationStatus={evaluationStatus} 
            currentLocale={currentLocale}
            errors={errors}
            handleInputChange={handleInputChange}
          />
        )
      default:
        return (
          <EvaluationVinGroupTemplate 
            evaluationFormDetail={evaluationFormDetail}
            isEdit={isEdit}
            showByManager={showByManager} 
            evaluationStatus={evaluationStatus}
            currentLocale={currentLocale}
            errors={errors}
            handleInputChange={handleInputChange}
          />
        )
    }
  }

  return <div className="card shadow evaluation-process" style={isOffLineType ? { display: 'none' } : {}} >
    <div className="title">{t("EvaluationDetailASSESSMENTPROCESS")}</div>
    <div className="step-block">
      {renderEvaluationStep()}
    </div>
    <div className="employee-info-block">
      {renderEmployeeInfos()}
    </div>
    { renderFormMainInfo(evaluationFormDetail?.companyCode) }
  </div>
}

function EvaluationDetail(props) {
  const { t } = useTranslation();
  const [errors, SetErrors] = useState({});
  const [bottom, setBottom] = useState(false);
  const [isLoading, SetIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [evaluationFormDetail, SetEvaluationFormDetail] = useState(null);
  const [statusModal, SetStatusModal] = useState({ isShow: false, isSuccess: true, content: "", needReload: true });
  const guard = useGuardStore();
  const user = guard.getCurentUser();
  const isOffLineType = evaluationFormDetail?.formType === 'OFF';
  const { showByManager, updateParent } = props;
  const formCode = showByManager ? props?.formCode : props.match.params.formCode;
  const evaluationFormId = showByManager ? props?.evaluationFormId : props.match.params.id;
  const version = showByManager ? props?.version : props.match.params.version;

  useEffect(() => {
    const processEvaluationFormDetailData = response => {
      if (response && response.data) {
        const result = response.data.result
        if (result && result.code == Constants.PMS_API_SUCCESS_CODE) {
          const evaluationFormDetailTemp = response.data?.data;
          if (evaluationFormDetailTemp.listGroup) {
            evaluationFormDetailTemp.listGroup = ([...evaluationFormDetailTemp?.listGroup] || []).sort((pre, next) => pre?.groupOrder - next?.groupOrder)
          }
          SetEvaluationFormDetail(evaluationFormDetailTemp)
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
        const response = await axios.get(`${process.env.REACT_APP_HRDX_PMS_URL}api/${version}/targetform/formbyuser`, config)
        processEvaluationFormDetailData(response)
      } catch (e) {
        SetStatusModal({
          ...statusModal,
          isShow: true,
          content: t("AnErrorOccurred"),
          isSuccess: false,
          needReload: true,
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

  // Tổng điểm của CBNV hoặc Tổng điểm của CBQL cho từng group mục tiêu (kpi)
  const calculateAssessment = (listTarget) => {
    const isVinBus = isVinBusByCompanyCode(evaluationFormDetail?.companyCode)
    const assessmentScale = 5
    const assessment = (listTarget || []).reduce((initial, current) => {
      initial.selfAssessment += isVinBus ? Number(current?.seftPoint || 0) : Number(current?.seftPoint || 0) / assessmentScale * Number(current?.weight || 0)
      initial.managerAssessment += isVinBus ? Number(current?.leadReviewPoint || 0) : Number(current?.leadReviewPoint || 0) / assessmentScale * Number(current?.weight || 0)
      if (current.listTarget?.length) {
        const sub = current.listTarget?.reduce((subInitial, item) => {
          subInitial.selfAssessment += isVinBus ? Number(item?.seftPoint || 0) : Number(item?.seftPoint || 0) / assessmentScale * Number(item?.weight || 0)
          subInitial.managerAssessment += isVinBus ? Number(item?.leadReviewPoint || 0) : Number(item?.leadReviewPoint || 0) / assessmentScale * Number(item?.weight || 0)
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
    const isVinBus = isVinBusByCompanyCode(evaluationFormDetail?.companyCode)

    if (_.isNil(childIndex)) {
      evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex][stateName] = value
      if (isVinBus) {
        if (stateName === 'realResult') {
            evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex]['seftPoint'] = calculateScore(
            evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex]?.formulaCode,
            evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex]?.targetValue,
            evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex]?.weight,
            value
          )
        }
        if (stateName === 'leadRealResult') {
            evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex]['leadReviewPoint'] = calculateScore(
            evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex]?.formulaCode,
            evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex]?.targetValue,
            evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex]?.weight,
            value
          )
        } 
      }
    } else {
      evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex].listTarget[childIndex][stateName] = value
      if (isVinBus) {
        if (stateName === 'realResult') {
            evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex].listTarget[childIndex]['seftPoint'] = calculateScore(
            evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex]?.listTarget[childIndex]?.formulaCode,
            evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex]?.listTarget[childIndex]?.targetValue,
            evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex]?.listTarget[childIndex]?.weight,
            value
          )
        }
        if (stateName === 'leadRealResult') {
            evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex].listTarget[childIndex]['leadReviewPoint'] = calculateScore(
            evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex].listTarget[childIndex]?.formulaCode,
            evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex].listTarget[childIndex]?.targetValue,
            evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex].listTarget[childIndex]?.weight,
            value
          )
        }
      }
    }

    let totalQuestionsAnswered = 0
    if (showByManager) {
      totalQuestionsAnswered = (evaluationFormDetailTemp?.listGroup || []).reduce((initial, current) => {
        let questionsAnswered = (current?.listTarget || []).reduce((subInitial, subCurrent) => {
          subInitial += (subCurrent?.leadReviewPoint || (isVinBus && subCurrent?.leadRealResult)) ? 1 : 0
          if (subCurrent.listTarget?.length) {
            const subQuestionsAnswered = subCurrent.listTarget?.reduce((res, item) => {
              res += (item.leadReviewPoint || (isVinBus && subCurrent?.leadRealResult)) ? 1 : 0
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
          subInitial += (subCurrent?.seftPoint || (isVinBus && subCurrent?.realResult)) ? 1 : 0
          if (subCurrent.listTarget?.length) {
            const subQuestionsAnswered = subCurrent.listTarget?.reduce((res, item) => {
              res += (item.seftPoint || (isVinBus && subCurrent?.realResult)) ? 1 : 0
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
        groupLeadReviewPoint: calculateAssessment(item?.listTarget)?.managerAssessment || 0,
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

    if (isVinBus) {
      evaluationFormDetailTemp.evaluateRating = evaluationFormDetailTemp?.status == evaluationStatus.launch && evaluationFormDetailTemp?.evaluateRating
      ? evaluationFormDetailTemp?.evaluateRating
      : calculateRating(
        evaluationFormDetail.reviewStreamCode === processStep.zeroLevel 
        ? Number(totalInfos?.self || 0) 
        : evaluationFormDetail?.status > evaluationStatus.launch ? Number(totalInfos?.manager || 0) : null
      )
    }

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

  const isDataValid = () => {
    const isVinBus = isVinBusByCompanyCode(evaluationFormDetail?.companyCode)
    const errorResult = (evaluationFormDetail?.listGroup || []).reduce((initial, currentParent, indexParent) => {
      let targetErrors = {}
      if (currentParent?.listGroupConfig && currentParent?.listGroupConfig?.length > 0) { // Tinh thần thái độ
        targetErrors = (currentParent?.listTarget || []).reduce((subInitial, subCurrent, subIndex) => {
          let keyData = showByManager ? 'leadReviewPoint' : 'seftPoint'
          if (isVinBus) {
            keyData = showByManager ? 'leadRealResult' : 'realResult'
            subInitial[`${indexParent}_${subIndex}_${keyData}`] = null
            if (!subCurrent.listTarget?.length) {
              if (subCurrent[keyData] === '') {
                subInitial[`${indexParent}_${subIndex}_${keyData}`] = t("Required")
              }
            } else {
              const childErrors = subCurrent.listTarget?.map((childTarget, childIndex) => {
                subInitial[`${indexParent}_${subIndex}_${childIndex}_${keyData}`] = null
                if (childTarget[keyData] === '') {
                  subInitial[`${indexParent}_${subIndex}_${childIndex}_${keyData}`] = t("Required")
                }
              })
            }
          } else {
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
          }
          return subInitial
        }, {})
      } else { // Kết quả công việc
        targetErrors = (currentParent?.listTarget || []).reduce((subInitial, subCurrent, subIndex) => {
          if (showByManager) {
            if (isVinBus) {
              subInitial[`${indexParent}_${subIndex}_leadRealResult`] = null
              if (subCurrent?.leadRealResult === '') {
                subInitial[`${indexParent}_${subIndex}_leadRealResult`] = t("Required")
              }
            } else {
              subInitial[`${indexParent}_${subIndex}_leadReviewPoint`] = null
              if (!Number(subCurrent?.leadReviewPoint)) {
                subInitial[`${indexParent}_${subIndex}_leadReviewPoint`] = t("Required")
              }
            }
            return subInitial
          } else {
            if (isVinBus) {
              subInitial[`${indexParent}_${subIndex}_realResult`] = null
              if (subCurrent?.realResult === '') {
                subInitial[`${indexParent}_${subIndex}_realResult`] = t("Required")
              }
            } else {
              subInitial[`${indexParent}_${subIndex}_seftPoint`] = null
              subInitial[`${indexParent}_${subIndex}_realResult`] = null
              if (!Number(subCurrent?.seftPoint)) {
                subInitial[`${indexParent}_${subIndex}_seftPoint`] = t("Required")
              }
              if (!subCurrent?.realResult) {
                subInitial[`${indexParent}_${subIndex}_realResult`] = t("Required")
              }
            }
            return subInitial
          }
        }, {})
      }
      initial = { ...initial, ...targetErrors }
      return initial
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

  const isValidTotalScoreFunc = () => {
    const { totalSeftPoint, totalLeadReviewPoint } = evaluationFormDetail
    return Number(totalSeftPoint).toFixed(2) < 0 || Number(totalSeftPoint).toFixed(2) > 100 || Number(totalLeadReviewPoint).toFixed(2) < 0 || Number(totalLeadReviewPoint).toFixed(2) > 100 ? false : true
  }

  const isValidScoreFunc = (actionCode) => {
    if (actionCode == actionButton.save) {
      return true
    }

    const maximumScore = 5;
    const minimumScore = 1;
    const listGroup = evaluationFormDetail?.listGroup || []
    const isVinBus = isVinBusByCompanyCode(evaluationFormDetail?.companyCode)

    for (let groupIndex = 0; groupIndex < listGroup.length; groupIndex++) {
      let group = listGroup[groupIndex]
      for (let targetIndex = 0; targetIndex < group?.listTarget?.length; targetIndex++) {
        let target = group?.listTarget[targetIndex]
        if (
          target?.seftPoint !== null 
          && ((!isVinBus && Number(target?.seftPoint) > maximumScore) || isNaN(Number(target?.seftPoint)) || (!isVinBus && Number(target?.seftPoint) < minimumScore))
        ) {
          return false
        }
        if (target?.leadReviewPoint !== null 
          && ((!isVinBus && Number(target?.leadReviewPoint) > maximumScore) || isNaN(Number(target?.leadReviewPoint)) || (!isVinBus && Number(target?.leadReviewPoint) < minimumScore))
        ) {
          return false
        }

        for (let subTargetIndex = 0; subTargetIndex < target?.listTarget?.length; subTargetIndex++) {
          let subTarget = target?.listTarget[subTargetIndex]
          if (subTarget?.seftPoint !== null 
            && ((!isVinBus && Number(subTarget?.seftPoint) > maximumScore) || isNaN(Number(subTarget?.seftPoint)) || (!isVinBus && Number(subTarget?.seftPoint) < minimumScore))
          ) {
            return false
          }
          if (subTarget?.leadReviewPoint !== null 
            && ((!isVinBus && Number(subTarget?.leadReviewPoint) > maximumScore) || isNaN(Number(subTarget?.leadReviewPoint)) || (!isVinBus && Number(subTarget?.leadReviewPoint) < minimumScore))
          ) {
            return false
          }
        }
      }
    }

    return true
  }

  const handleSubmit = async (actionCode, isApprove, isSaveDraft) => {
    if (!isSaveDraft || (actionCode == actionButton.approve)) {
      const isValid = isDataValid()
      if (!isValid) {
        return
      }
    }

    const statusModalTemp = { ...statusModal }

    const isValidTotalScore = isValidTotalScoreFunc()
    const isValidScore = isValidScoreFunc(actionCode)

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
        statusModalTemp.needReload = true
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
        payload.totalSeftPoint = Number(payload.totalSeftPoint).toFixed(2)
        payload.totalLeadReviewPoint = Number(payload.totalLeadReviewPoint).toFixed(2)

        // if (payload?.totalLeadReviewPoint) {
        //   payload.evaluateRating = calculateRating(payload?.totalLeadReviewPoint)
        // }

        const isZeroLevel = payload?.reviewStreamCode === processStep.zeroLevel
        const response = await axios.post(`${process.env.REACT_APP_HRDX_PMS_URL}api/targetform/update`, { requestString: JSON.stringify(payload || {}) }, config)
        SetErrors({})
        SetIsLoading(false)
        statusModalTemp.isShow = true
        statusModalTemp.needReload = actionCode == actionButton.approve
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
          const keepPopupEvaluationDetail = actionCode == actionButton.save
          updateParent(statusModalTemp, keepPopupEvaluationDetail)
        }
      }
    } catch (e) {
      SetIsLoading(false)
      statusModalTemp.isShow = true
      statusModalTemp.isSuccess = false
      statusModalTemp.content = t("AnErrorOccurred")
      statusModalTemp.needReload = true
      if (!showByManager) {
        SetStatusModal(statusModalTemp)
      } else {
        updateParent(statusModalTemp)
      }
    }
  }

  const componentMapping = (companyCode) => {
    // switch (true) {
    //   case [Constants.pnlVCode.VinBus].includes(companyCode) :
    //       return (
    //         <VinBusForm 
    //           evaluationFormDetail={evaluationFormDetail}
    //           showByManager={showByManager}
    //           version={version}
    //           updateParent={updateParent}
    //         />
    //       )
    //   default:
    //     return (
    //       <VinGroupForm 
    //         evaluationFormDetail={evaluationFormDetail}
    //         showByManager={showByManager}
    //         version={version}
    //         updateParent={updateParent}
    //       />
    //     )
    // }

    return (
      <VinGroupForm 
        evaluationFormDetail={evaluationFormDetail}
        showByManager={showByManager}
        version={version}
        updateParent={updateParent}
      />
    )
  }

  return (
    <>
      <LoadingModal show={isLoading} />
      {
        dataLoaded && (
          <div className="evaluation-detail-page">
          {
            (!evaluationFormDetail || _.size(evaluationFormDetail) === 0 || (!evaluationFormDetail?.companyCode && evaluationFormDetail?.reviewStreamCode !== processStep.level360))
            ? (<h6 className="alert alert-danger" role="alert">{t("NoDataFound")}</h6>)
            : (
              <>
              {
                evaluationFormDetail?.reviewStreamCode === processStep.level360 ? (
                  <Evaluation360 evaluationFormDetail={evaluationFormDetail} />
                )
                : (
                  <>
                    <h1 className="content-page-header">{`${evaluationFormDetail?.checkPhaseFormName} ${t("of")} ${evaluationFormDetail?.fullName}`}</h1>
                    {
                      version === evaluationApiVersion.v2
                      ? componentMapping(evaluationFormDetail?.companyCode)
                      : (
                        <>
                          <StatusModal 
                            show={statusModal.isShow} 
                            isSuccess={statusModal.isSuccess} 
                            content={statusModal.content} 
                            className="evaluation-status-modal"
                            onHide={onHideStatusModal} />
                          <div>
                            <EvaluationOverall evaluationFormDetail={evaluationFormDetail} showByManager={showByManager} />
                            <EvaluationProcess evaluationFormDetail={evaluationFormDetail} showByManager={showByManager} errors={errors} updateData={updateData} />
                            <div className="button-block" style={isOffLineType ? { display: 'none' } : {}} >
                              {renderButtonBlock()}
                            </div>
                          </div>
                          {
                            !bottom && !isOffLineType &&
                            (evaluationFormDetail?.status == evaluationStatus.launch || (evaluationFormDetail?.status == evaluationStatus.selfAssessment && localStorage.getItem('employeeNo') == JSON.parse(evaluationFormDetail?.reviewer || '{}')?.uid))
                            && evaluationFormDetail?.isEdit && (
                              <div className="scroll-to-save" style={{ color: localStorage.getItem("companyThemeColor"), zIndex: '10' }}>
                                <div>
                                  <button className="btn-action save mr-3" onClick={() => handleSubmit(actionButton.save, null, true)}><Image src={IconSave} alt="Save" />{t("EvaluationDetailPartSave")}</button>
                                </div>
                              </div>
                            )
                          }
                        </>
                      )
                    }
                  </>
                )
              }
              </>
            )
          }
          </div>
        )
      }
    </>
  )
}

export default HOCComponent(EvaluationDetail)
