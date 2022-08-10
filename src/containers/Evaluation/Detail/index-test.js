import React, { useState, useEffect } from "react"
import Select from 'react-select'
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { Doughnut } from 'react-chartjs-2'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import _ from 'lodash'
import Constants from '../../../commons/Constants'
import { getRequestConfigurations } from '../../../commons/Utils'
import { evaluationStatus, actionButton } from '../Constants'
import { useGuardStore } from '../../../modules'
import LoadingModal from '../../../components/Common/LoadingModal'
import StatusModal from '../../../components/Common/StatusModal'
import IconArrowRightWhite from '../../../assets/img/icon/pms/arrow-right-white.svg'
import IconArrowRightGray from '../../../assets/img/icon/pms/arrow-right-gray.svg'
import IconUp from '../../../assets/img/icon/pms/icon-up.svg'
import IconDown from '../../../assets/img/icon/pms/icon-down.svg'
import IconSave from '../../../assets/img/ic-save.svg'
import IconSendRequest from '../../../assets/img/icon/Icon_send.svg'
import IconReject from '../../../assets/img/icon/Icon_Cancel.svg'
import IconApprove from '../../../assets/img/icon/Icon_Check.svg'

function EvaluationOverall(props) {
  const { evaluationFormDetail, showByManager } = props
  const totalCompleted = showByManager ? evaluationFormDetail?.leadReviewTotalComplete || 0 : evaluationFormDetail?.seftTotalComplete || 0

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
      <h6 className="text-center">Đã hoàn thành: {totalCompleted || 0}/{evaluationFormDetail?.totalTarget}</h6>
      <div className="chart">
        <div className="detail">
          <div className="result">
            <Doughnut
              data={overallData}
              options={chartOption}
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
      <h6 className="text-center chart-title">Điểm tổng thể</h6>
      <div className="chart">
        <div className="detail">{(evaluationFormDetail?.status == evaluationStatus.launch || (evaluationFormDetail?.status == evaluationStatus.selfAssessment && !showByManager)) ? evaluationFormDetail?.totalSeftPoint || 0 : evaluationFormDetail?.totalLeadReviewPoint || 0}</div>
      </div>
    </div>
    <div className="card shadow card-detail">
      <table className='table-list-evaluation'>
        <thead>
          <tr>
            <th className='c-criteria'><div className='criteria'>Tiêu chí đánh giá</div></th>
            <th className='c-self-assessment text-center'><div className='self-assessment'>Tự đánh giá</div></th>
            <th className='c-manager-assessment text-center'><div className='manager-assessment color-red'>QLTT đánh giá</div></th>
          </tr>
        </thead>
        <tbody>
          {
            (evaluationFormDetail?.listGroup || []).map((item, i) => {
              return <tr key={i}>
                <td className='c-criteria'><div className='criteria'>{item?.groupName}</div></td>
                <td className='c-self-assessment text-center'>{item?.groupSeftPoint || 0}</td>
                <td className='c-manager-assessment text-center color-red'>{item?.groupLeadReviewPoint || 0}</td>
              </tr>
            })
          }
          <tr>
            <td className='c-criteria'><div className='font-weight-bold text-uppercase criteria'>Điểm tổng thể</div></td>
            <td className='c-self-assessment text-center font-weight-bold'>{evaluationFormDetail?.totalSeftPoint || 0}</td>
            <td className='c-manager-assessment text-center font-weight-bold color-red'>{evaluationFormDetail?.totalLeadReviewPoint || 0}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
}

function EvaluationProcess(props) {
  const { evaluationFormDetail, showByManager, errors, updateData } = props
  const processStep = {
    oneLevel: '1NF',
    twoLevels: '2NF',
  }
  const stepStatusMapping = {
    [evaluationStatus.launch]: 0,
    [evaluationStatus.selfAssessment]: 1,
    [evaluationStatus.qlttAssessment]: evaluationFormDetail?.reviewStreamCode === processStep.oneLevel ? null : 2,
    [evaluationStatus.cbldApproved]: evaluationFormDetail?.reviewStreamCode === processStep.oneLevel ? 2 : 3,
  }
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

  const renderEvaluationStep = () => {
    const stepEvaluationConfig = evaluationFormDetail?.reviewStreamCode === processStep.oneLevel
      ? ['CBNV tự đánh giá', 'CBQLTT đánh giá', 'Hoàn thành']
      : ['CBNV tự đánh giá', 'CBQLTT đánh giá', 'CBLĐ có thẩm quyền phê duyệt', 'Hoàn thành']
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

    return (
      <>
        <div className="title">Thông tin nhân viên</div>
        <div className="detail">
          <div className="left">
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">Họ và tên</span><span>:</span></span>
              <span className="value">{evaluationFormDetail?.fullName || ''}</span>
            </div>
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">Chức danh</span><span>:</span></span>
              <span className="value">{evaluationFormDetail?.position || ''}</span>
            </div>
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">Cấp bậc</span><span>:</span></span>
              <span className="value">{evaluationFormDetail?.employeeLevel || ''}</span>
            </div>
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">Ban/Chuỗi/Khối</span><span>:</span></span>
              <span className="value">{evaluationFormDetail?.organization_lv3 || ''}</span>
            </div>
          </div>
          <div className="right">
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">Phòng/Vùng/Miền</span><span>:</span></span>
              <span className="value">{evaluationFormDetail?.organization_lv4 || ''}</span>
            </div>
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">QLTT đánh giá</span><span>:</span></span>
              <span className="value">{reviewerInfos?.fullname && `${reviewerInfos?.fullname || ''} - ${reviewerInfos?.position_title || ''}`}</span>
            </div>
            <div className="info-item">
              <span className="label"><span className="font-weight-bold">CBLĐ phê duyệt</span><span>:</span></span>
              <span className="value">{approverInfos?.fullname && `${approverInfos?.fullname || ''} - ${approverInfos?.position_title || ''}`}</span>
            </div>
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

  const handleInputChange = (subIndex, parentIndex, stateName, element) => {
    const val = element?.target?.value || ""
    if (['seftPoint', 'leadReviewPoint'].includes(stateName) && (!(/^\d*$/.test(Number(val))) || val.includes('.'))) {
      return
    }
    updateData(subIndex, parentIndex, stateName, val)
  }

  const renderEvaluationItem = (item, index, scores, target, i, deviant, subGroupIndex, subGroupTargetIndex) => {
    const isChild = !!target.subGroupTargetCode
    return <div className="evaluation-item" key={target.id}>
      {!isChild ? <div className="title">{`${i + 1}. ${target?.targetName}`}</div> : <div className="sub-title">{`${subGroupIndex + 1}.${subGroupTargetIndex + 1} ${target?.targetName}`}</div>}
      {
        item?.listGroupConfig && item?.listGroupConfig?.length > 0 ?
          <div className="score-block">
            <div className="self attitude-score">
              <div className="item">
                <span className="red label">Điểm tự đánh giá{!showByManager && <span className="required">(*)</span>}</span>
                {
                  !showByManager && evaluationFormDetail.status == evaluationStatus.launch
                    ?
                    <select onChange={(e) => handleInputChange(i, index, 'seftPoint', e)} value={target?.seftPoint || ''}>
                      <option value=''>Chọn điểm</option>
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
                <span className="red label">Điểm QLTT đánh giá{showByManager && <span className="required">(*)</span>}</span>
                {
                  showByManager && evaluationFormDetail.status == evaluationStatus.selfAssessment
                    ?
                    <select onChange={(e) => handleInputChange(i, index, 'leadReviewPoint', e)} value={target?.leadReviewPoint || ''}>
                      <option value=''>Chọn điểm</option>
                      {
                        (scores || []).map((score, i) => {
                          return <option value={score} key={i}>{score}</option>
                        })
                      }
                    </select>
                    : <input type="text" value={target?.leadReviewPoint || ''} disabled />
                }
              </div>
              {errors[`${index}_${i}_leadReviewPoint`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_leadReviewPoint`]}</div>}
            </div>
            <div className="deviant">
              <span className="red label">Điểm chênh lệch</span>
              <span className={`value ${deviant && deviant > 0 ? 'up' : deviant && deviant < 0 ? 'down' : ''}`}>&nbsp;{`${deviant && deviant > 0 ? '+' : ''}${deviant}`}{deviant && deviant != 0 ? <Image alt='Note' src={deviant && deviant > 0 ? IconUp : deviant && deviant < 0 ? IconDown : ''} /> : ''}</span>
            </div>
          </div>
          :
          <div className="wrap-score-table">
            <table>
              <thead>
                <tr>
                  <th className="measurement"><span>Cách đo lường<span className="note">(Tính theo điểm)</span></span></th>
                  <th className="text-center proportion"><span>Tỷ trọng %</span></th>
                  <th className="text-center target"><span>Mục tiêu</span></th>
                  <th className="text-center actual-results"><span>Kết quả thực tế</span>{!showByManager && <span className="required">(*)</span>}</th>
                  <th className="text-center self-assessment"><span>Điểm tự đánh giá</span>{!showByManager && <span className="required">(*)</span>}</th>
                  <th className="text-center qltt-assessment"><span>Điểm QLTT đánh giá</span>{showByManager && <span className="required">(*)</span>}</th>
                  <th className="text-center deviant"><span>Điểm chênh lệch</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="measurement">
                    <ul>
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
                      {!showByManager && evaluationFormDetail.status == evaluationStatus.launch ? <textarea rows={3} placeholder="Nhập" value={target?.realResult || ""} onChange={(e) => handleInputChange(i, index, 'realResult', e)} /> : <span>{target?.realResult}</span>}
                    </div>
                    {errors[`${index}_${i}_realResult`] && <div className="alert alert-danger invalid-message" role="alert">{errors[`${index}_${i}_realResult`]}</div>}
                  </td>
                  <td className="text-center self-assessment">
                    <div>
                      {
                        !showByManager && evaluationFormDetail.status == evaluationStatus.launch
                          // ? <input type="text" placeholder="Nhập" value={target?.seftPoint || ""} onChange={(e) => handleInputChange(i, index, 'seftPoint', e)} /> 
                          ? <select onChange={(e) => handleInputChange(i, index, 'seftPoint', e)} value={target?.seftPoint || ''}>
                            <option value=''>Chọn điểm</option>
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
                        showByManager && evaluationFormDetail.status == evaluationStatus.selfAssessment
                          // ? <input type="text" placeholder="Nhập" value={target?.leadReviewPoint || ""} onChange={(e) => handleInputChange(i, index, 'leadReviewPoint', e)} />
                          ? <select onChange={(e) => handleInputChange(i, index, 'leadReviewPoint', e)} value={target?.leadReviewPoint || ''}>
                            <option value=''>Chọn điểm</option>
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
      }
      <div className="comment">
        <div className="self">
          <p>Ý kiến của CBNV tự đánh giá</p>
          <textarea rows={1} placeholder="Nhập thông tin" value={target?.seftOpinion || ""} onChange={(e) => handleInputChange(i, index, 'seftOpinion', e)} disabled={showByManager || evaluationFormDetail.status != evaluationStatus.launch} />
        </div>
        <div className="qltt">
          <p>Ý kiến của QLTT đánh giá</p>
          <textarea rows={1} value={target?.leaderReviewOpinion || ""} onChange={(e) => handleInputChange(i, index, 'leaderReviewOpinion', e)} disabled={!showByManager || (showByManager && Number(evaluationFormDetail.status) >= Number(evaluationStatus.qlttAssessment))} />
        </div>
      </div>
    </div>
  }

  return <div className="card shadow evaluation-process">
    <div className="title">Quy trình đánh giá</div>
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

        return <div className={`part-block ${item?.listGroupConfig && item?.listGroupConfig?.length > 0 ? 'attitude' : 'work-result'}`} key={index}>
          <div className="title">{`Phần ${indexText} - ${item?.groupName}`} <span className="red">({item?.groupWeight || 0}%)</span></div>
          {
            item?.listGroupConfig && item?.listGroupConfig?.length > 0 &&
            <div className="wrap-score-table">
              <table>
                <thead>
                  <tr>
                    <th className="red">Điểm</th>
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
                    <td>Mức độ thể hiện</td>
                    {
                      item?.listGroupConfig?.map((sub, subIndex) => {
                        return <td key={subIndex}><div>{sub?.description}</div></td>
                      })
                    }
                  </tr>
                </tbody>
              </table>
            </div>
          }

          <div className="list-evaluation">
            {
              // (item?.listTarget || []).map((target, i) => {
              //   let deviant = (target?.leadReviewPoint === '' || target?.leadReviewPoint === null || target?.seftPoint === '' || target?.seftPoint === null) ? '' : Number(target?.leadReviewPoint) - Number(target?.seftPoint)

              //   return renderEvaluationItem(item, index, scores, target, i, deviant)
              // })
              Object.entries(_.groupBy(item?.listTarget, "subGroupTargetCode")).map(([key, subGroup], subGroupIndex) => {
                if (key === "undefined") {
                  return (subGroup || []).map((target, i) => {
                    let deviant = (target?.leadReviewPoint === '' || target?.leadReviewPoint === null || target?.seftPoint === '' || target?.seftPoint === null) ? '' : Number(target?.leadReviewPoint) - Number(target?.seftPoint)
                    return renderEvaluationItem(item, index, scores, target, i, deviant)
                  })
                }
                return <div className="evaluation-sub-group">
                  <div className="sub-group-name">{`${subGroupIndex + 1}. ${subGroup[0].subGroupName}`} <span className="red">({subGroup[0].weight}%)</span></div>
                  <div className="sub-group-targets">
                    {(subGroup || []).map((target, i) => {
                      let deviant = (target?.leadReviewPoint === '' || target?.leadReviewPoint === null || target?.seftPoint === '' || target?.seftPoint === null) ? '' : Number(target?.leadReviewPoint) - Number(target?.seftPoint)
                      const rawIndex = _.findIndex(item.listTarget, t => t.id === target.id)
                      return <React.Fragment key={rawIndex}>
                        {renderEvaluationItem(item, index, scores, target, rawIndex, deviant, subGroupIndex, i)}
                        <div className="divider" />
                      </React.Fragment>
                    })}
                  </div>
                </div>
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

  useEffect(() => {
    const processEvaluationFormDetailData = response => {
      if (response && response.data) {
        const result = response.data.result
        if (result && result.code == Constants.PMS_API_SUCCESS_CODE) {
          const evaluationFormDetailTemp = response.data?.data
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
          // SetEvaluationFormDetail(evaluationFormDetailTemp)
          SetEvaluationFormDetail(testEvaluationData)
        }
      }
      SetIsLoading(false)
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
        console.error(e)
        SetIsLoading(false)
      }
    }

    fetchEvaluationFormDetails()
  }, [])

  const calculateAssessment = (listTarget) => {
    const assessmentScale = 5
    const assessment = (listTarget || []).reduce((initial, current) => {
      initial.selfAssessment += Number(current?.seftPoint || 0) / assessmentScale * Number(current?.weight || 0)
      initial.managerAssessment += Number(current?.leadReviewPoint || 0) / assessmentScale * Number(current?.weight || 0)
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

  const updateData = (subIndex, parentIndex, stateName, value) => {
    const evaluationFormDetailTemp = { ...evaluationFormDetail }
    evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex][stateName] = value
    let totalQuestionsAnswered = 0
    if (showByManager) {
      totalQuestionsAnswered = (evaluationFormDetailTemp?.listGroup || []).reduce((initial, current) => {
        let questionsAnswered = (current?.listTarget || []).reduce((subInitial, subCurrent) => {
          subInitial += subCurrent?.leadReviewPoint ? 1 : 0
          return subInitial
        }, 0)
        initial += questionsAnswered
        return initial
      }, 0)
    } else {
      totalQuestionsAnswered = (evaluationFormDetailTemp?.listGroup || []).reduce((initial, current) => {
        let questionsAnswered = (current?.listTarget || []).reduce((subInitial, subCurrent) => {
          subInitial += subCurrent?.seftPoint ? 1 : 0
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
    const currentUserLoggedUID = localStorage.getItem('employeeNo')
    const reviewerUID = JSON.parse(evaluationFormDetail?.reviewer || '{}')?.uid
    const approverUID = JSON.parse(evaluationFormDetail?.approver || '{}')?.uid

    switch (evaluationFormDetail?.status) {
      case evaluationStatus.launch:
        return (
          <>
            <button className="btn-action save" onClick={() => handleSubmit(actionButton.save, null, true)}><Image src={IconSave} alt="Save" />Lưu</button>
            <button className="btn-action send" onClick={() => handleSubmit(actionButton.approve)}><Image src={IconSendRequest} alt="Send" />Gửi tới bước tiếp theo</button>
          </>
        )
      case evaluationStatus.selfAssessment:
        if (showByManager && currentUserLoggedUID == reviewerUID) {
          return (
            <>
              <button className="btn-action reject" onClick={() => handleSubmit(actionButton.reject, null, true)}><Image src={IconReject} alt="Reject" />Từ chối</button>
              <button className="btn-action confirm" onClick={() => handleSubmit(actionButton.approve)}><Image src={IconApprove} alt="Confirm" />Xác nhận</button>
            </>
          )
        }
        return null
      case evaluationStatus.qlttAssessment:
        if (showByManager && currentUserLoggedUID == approverUID) {
          return (
            <>
              <button className="btn-action reject" onClick={() => handleSubmit(actionButton.reject, null, true)}><Image src={IconReject} alt="Reject" />Từ chối</button>
              <button className="btn-action approve" onClick={() => handleSubmit(actionButton.approve, true)}><Image src={IconApprove} alt="Approve" />Phê duyệt</button>
            </>
          )
        }
        return null
    }
  }

  const getResponseMessages = (formStatus, actionCode, apiStatus) => {
    const messageMapping = {
      [actionButton.save]: {
        [evaluationStatus.launch]: {
          success: 'Lưu biểu mẫu thành công!',
          failed: 'Lưu biểu mẫu thất bại. Xin vui lòng thử lại!',
        }
      },
      [actionButton.approve]: {
        [evaluationStatus.launch]: {
          success: 'Biểu mẫu đã được gửi tới QLTT đánh giá!',
          failed: 'Gửi biểu mẫu thất bại. Xin vui lòng thử lại!',
        },
        [evaluationStatus.selfAssessment]: {
          success: 'Đánh giá biểu mẫu thành công!',
          failed: 'Đánh giá biểu mẫu thất bại. Xin vui lòng thử lại!',
        },
        [evaluationStatus.qlttAssessment]: {
          success: 'Phê duyệt biểu mẫu thành công!',
          failed: 'Phê duyệt biểu mẫu thất bại. Xin vui lòng thử lại!',
        }
      },
      [actionButton.reject]: {
        [evaluationStatus.selfAssessment]: {
          success: 'Biểu mẫu đã được gửi lại CBNV thành công!',
          failed: 'Biểu mẫu chưa được gửi lại CBNV. Xin vui lòng thử lại!',
        },
        [evaluationStatus.qlttAssessment]: {
          success: 'Biểu mẫu đã được gửi lại QLTT thành công!',
          failed: 'Biểu mẫu chưa được gửi lại QLTT. Xin vui lòng thử lại!',
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
          if (!Number(subCurrent[keyData])) {
            subInitial[`${indexParent}_${subIndex}_${keyData}`] = t("Required")
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
        const response = await axios.post(`${process.env.REACT_APP_HRDX_PMS_URL}api/targetform/update`, payload, config)
        SetIsLoading(false)
        statusModalTemp.isShow = true
        if (response && response.data) {
          const result = response.data.result
          if (result.code == Constants.PMS_API_SUCCESS_CODE) {
            statusModalTemp.isSuccess = true
            statusModalTemp.content = getResponseMessages(payload.status, actionCode, 'success')
          } else {
            statusModalTemp.isSuccess = false
            statusModalTemp.content = result?.message
          }
        } else {
          statusModalTemp.isSuccess = false
          statusModalTemp.content = getResponseMessages(payload.status, actionCode, 'failed')
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
          evaluationFormDetail ?
            <>
              <h1 className="content-page-header">{`${evaluationFormDetail?.checkPhaseFormName} của ${evaluationFormDetail?.fullName}`}</h1>
              <div>
                <EvaluationOverall evaluationFormDetail={evaluationFormDetail} showByManager={showByManager} />
                <EvaluationProcess evaluationFormDetail={evaluationFormDetail} showByManager={showByManager} errors={errors} updateData={updateData} />
                <div className="button-block">
                  {renderButtonBlock()}
                </div>
              </div>
            </>
            : <h6 className="alert alert-danger" role="alert">{t("NoDataFound")}</h6>
        }
      </div>
    </>
  )
}

export default EvaluationDetail

const testEvaluationData = {
  "id": 240,
  "listGroup": [
    {
      "id": 301,
      "listTarget": [
        {
          "id": 853,
          "targetGuiId": "7bdcf123-c4ff-420a-9984-8c5279c9b8b9",
          "targetId": 1092,
          "target": null,
          "realResult": "",
          "targetName": "Khả năng thúc đẩy, tạo động lực và gắn kết nhân viên",
          "metric1": null,
          "metric2": null,
          "metric3": null,
          "metric4": null,
          "metric5": null,
          "seftPoint": null,
          "leadReviewPoint": null,
          "seftOpinion": null,
          "leaderReviewOpinion": null,
          "groupTargetId": 0,
          "groupTargetCode": "G1",
          "groupName": "Tinh thần thái độ",
          "groupWeight": 30,
          "subGroupTargetCode": "G1.1",
          "subGroupName": "Con người",
          "weight": 10,
          "checkPhaseFormId": 0,
          "employeeCode": null,
          "formCode": "A00240",
          "createDate": "2022-07-29T14:55:52.005171",
          "listTarget": null
        },
        {
          "id": 854,
          "targetGuiId": "b2d00259-7fa1-4ebe-bfc6-9190c5d9f5b7",
          "targetId": 1091,
          "target": null,
          "realResult": "",
          "targetName": "Khả năng giao việc, kiểm soát công việc và đào tạo, phát triển nhân viên",
          "metric1": null,
          "metric2": null,
          "metric3": null,
          "metric4": null,
          "metric5": null,
          "seftPoint": null,
          "leadReviewPoint": null,
          "seftOpinion": null,
          "leaderReviewOpinion": null,
          "groupTargetId": 0,
          "groupTargetCode": "G1",
          "groupName": "Tinh thần thái độ",
          "groupWeight": 20,
          "subGroupTargetCode": "G1.1",
          "subGroupName": "Con người",
          "weight": 25,
          "checkPhaseFormId": 0,
          "employeeCode": null,
          "formCode": "A00240",
          "createDate": "2022-07-29T14:55:52.005171",
          "listTarget": null
        },
        {
          "id": 858,
          "targetGuiId": "a005df1d-1fff-40b0-83cd-9ff594dbfd69",
          "targetId": 1089,
          "target": null,
          "realResult": "",
          "targetName": "Mức độ tin tưởng và sử dụng các sản phẩm/ dịch vụ Tập đoàn",
          "metric1": null,
          "metric2": null,
          "metric3": null,
          "metric4": null,
          "metric5": null,
          "seftPoint": null,
          "leadReviewPoint": null,
          "seftOpinion": null,
          "leaderReviewOpinion": null,
          "groupTargetId": 0,
          "groupTargetCode": "G1",
          "groupName": "Tinh thần thái độ",
          "groupWeight": 20,
          "subGroupTargetCode": "G1.2",
          "subGroupName": "Thương hiệu",
          "weight": 25,
          "checkPhaseFormId": 0,
          "employeeCode": null,
          "formCode": "A00240",
          "createDate": "2022-07-29T14:55:52.005171",
          "listTarget": null
        },
        {
          "id": 859,
          "targetGuiId": "a005df1d-1fff-40b0-83cd-9ff594dbfd69",
          "targetId": 1089,
          "target": null,
          "realResult": "",
          "targetName": "Mức độ lan tỏa các giá trị văn hóa/ thương hiệu (Đánh giá bằng số lượng người thân, bạn bè, cấp dưới sử dụng các sản phẩm của Tập đoàn)",
          "metric1": null,
          "metric2": null,
          "metric3": null,
          "metric4": null,
          "metric5": null,
          "seftPoint": null,
          "leadReviewPoint": null,
          "seftOpinion": null,
          "leaderReviewOpinion": null,
          "groupTargetId": 0,
          "groupTargetCode": "G1",
          "groupName": "Tinh thần thái độ",
          "groupWeight": 20,
          "subGroupTargetCode": "G1.2",
          "subGroupName": "Thương hiệu",
          "weight": 25,
          "checkPhaseFormId": 0,
          "employeeCode": null,
          "formCode": "A00240",
          "createDate": "2022-07-29T14:55:52.005171",
          "listTarget": null
        },
        {
          "id": 860,
          "targetGuiId": "a005df1d-1fff-40b0-83cd-9ff594dbfd69",
          "targetId": 1090,
          "target": null,
          "realResult": "",
          "targetName": "Khả năng Quản lý tài sản của Công ty/Bộ phận một cách sát sao, hiệu quả",
          "metric1": null,
          "metric2": null,
          "metric3": null,
          "metric4": null,
          "metric5": null,
          "seftPoint": null,
          "leadReviewPoint": null,
          "seftOpinion": null,
          "leaderReviewOpinion": null,
          "groupTargetId": 0,
          "groupTargetCode": "G1",
          "groupName": "Tinh thần thái độ",
          "groupWeight": 20,
          "subGroupTargetCode": "G1.3",
          "subGroupName": "Tài sản",
          "weight": 25,
          "checkPhaseFormId": 0,
          "employeeCode": null,
          "formCode": "A00240",
          "createDate": "2022-07-29T14:55:52.005171",
          "listTarget": null
        },
        {
          "id": 861,
          "targetGuiId": "a005df1d-1fff-40b0-83cd-9ff594dbfd69",
          "targetId": 1091,
          "target": null,
          "realResult": "",
          "targetName": "Đấu tranh với hành vi lãng phí tài sản của công ty",
          "metric1": null,
          "metric2": null,
          "metric3": null,
          "metric4": null,
          "metric5": null,
          "seftPoint": null,
          "leadReviewPoint": null,
          "seftOpinion": null,
          "leaderReviewOpinion": null,
          "groupTargetId": 0,
          "groupTargetCode": "G1",
          "groupName": "Tinh thần thái độ",
          "groupWeight": 20,
          "subGroupTargetCode": "G1.3",
          "subGroupName": "Tài sản",
          "weight": 25,
          "checkPhaseFormId": 0,
          "employeeCode": null,
          "formCode": "A00240",
          "createDate": "2022-07-29T14:55:52.005171",
          "listTarget": null
        }
      ],
      "checkPhaseFormId": 130,
      "groupWeight": 20,
      "groupName": "Tinh thần thái độ",
      "listGroupConfig": [
        {
          "id": 1,
          "groupTargetCode": "G1",
          "weight": "0% - 10%",
          "description": "Không thể hiện"
        },
        {
          "id": 2,
          "groupTargetCode": "G1",
          "weight": "11% - 49% ",
          "description": "Thể hiện còn ít"
        },
        {
          "id": 3,
          "groupTargetCode": "G1",
          "weight": "50% - 69%",
          "description": "Thể hiện nhưng chưa rõ nét hoặc chỉ thể hiện những khi thực sự cần,hoặc khi được yêu cầu"
        },
        {
          "id": 4,
          "groupTargetCode": "G1",
          "weight": "70% - 89%",
          "description": "Thường xuyên thể hiện"
        },
        {
          "id": 5,
          "groupTargetCode": "G1",
          "weight": "90% - 100%",
          "description": "Luôn luôn chủ động thể hiện và là tấm gương cho người khác học tập"
        }
      ],
      "groupTargetId": 1,
      "groupTargetCode": "G1",
      "groupOrder": 1,
      "groupSeftPoint": null,
      "groupLeadReviewPoint": null,
      "isDeleted": false
    },
    {
      "id": 300,
      "listTarget": [
        {
          "id": 851,
          "targetGuiId": "KPI05",
          "targetId": 1115,
          "target": "100",
          "realResult": "",
          "targetName": "KPI5",
          "metric1": "0%-10%",
          "metric2": "11%-49%",
          "metric3": "50%-69%",
          "metric4": "70%-89%",
          "metric5": "90%-100%",
          "seftPoint": null,
          "leadReviewPoint": null,
          "seftOpinion": null,
          "leaderReviewOpinion": null,
          "groupTargetId": 0,
          "groupTargetCode": "G2",
          "groupName": "Kết quả công việc",
          "groupWeight": 80,
          "weight": 20,
          "checkPhaseFormId": 0,
          "employeeCode": null,
          "formCode": "A00240",
          "createDate": "2022-07-29T14:55:52.005171",
          "listTarget": null
        },
        {
          "id": 850,
          "targetGuiId": "KPI04",
          "targetId": 1114,
          "target": "100",
          "realResult": "",
          "targetName": "KPI4",
          "metric1": "0%-10%",
          "metric2": "11%-49%",
          "metric3": "50%-69%",
          "metric4": "70%-89%",
          "metric5": "90%-100%",
          "seftPoint": null,
          "leadReviewPoint": null,
          "seftOpinion": null,
          "leaderReviewOpinion": null,
          "groupTargetId": 0,
          "groupTargetCode": "G2",
          "groupName": "Kết quả công việc",
          "groupWeight": 80,
          "weight": 20,
          "checkPhaseFormId": 0,
          "employeeCode": null,
          "formCode": "A00240",
          "createDate": "2022-07-29T14:55:52.005171",
          "listTarget": null
        },
        {
          "id": 857,
          "targetGuiId": "KPI03",
          "targetId": 1113,
          "target": "100",
          "realResult": "",
          "targetName": "KPI3",
          "metric1": "0%-10%",
          "metric2": "11%-49%",
          "metric3": "50%-69%",
          "metric4": "70%-89%",
          "metric5": "90%-100%",
          "seftPoint": null,
          "leadReviewPoint": null,
          "seftOpinion": null,
          "leaderReviewOpinion": null,
          "groupTargetId": 0,
          "groupTargetCode": "G2",
          "groupName": "Kết quả công việc",
          "groupWeight": 80,
          "weight": 20,
          "checkPhaseFormId": 0,
          "employeeCode": null,
          "formCode": "A00240",
          "createDate": "2022-07-29T14:55:52.005171",
          "listTarget": null
        },
        {
          "id": 852,
          "targetGuiId": "KPI02",
          "targetId": 1112,
          "target": "100",
          "realResult": "",
          "targetName": "KPI2",
          "metric1": "0%-10%",
          "metric2": "11%-49%",
          "metric3": "50%-69%",
          "metric4": "70%-89%",
          "metric5": "90%-100%",
          "seftPoint": null,
          "leadReviewPoint": null,
          "seftOpinion": null,
          "leaderReviewOpinion": null,
          "groupTargetId": 0,
          "groupTargetCode": "G2",
          "groupName": "Kết quả công việc",
          "groupWeight": 80,
          "weight": 20,
          "checkPhaseFormId": 0,
          "employeeCode": null,
          "formCode": "A00240",
          "createDate": "2022-07-29T14:55:52.005171",
          "listTarget": null
        },
        {
          "id": 856,
          "targetGuiId": "KPI01",
          "targetId": 1111,
          "target": "100",
          "realResult": "",
          "targetName": "KPI1",
          "metric1": "0%-10%",
          "metric2": "11%-49%",
          "metric3": "50%-69%",
          "metric4": "70%-89%",
          "metric5": "90%-100%",
          "seftPoint": null,
          "leadReviewPoint": null,
          "seftOpinion": null,
          "leaderReviewOpinion": null,
          "groupTargetId": 0,
          "groupTargetCode": "G2",
          "groupName": "Kết quả công việc",
          "groupWeight": 80,
          "weight": 20,
          "checkPhaseFormId": 0,
          "employeeCode": null,
          "formCode": "A00240",
          "createDate": "2022-07-29T14:55:52.005171",
          "listTarget": null
        }
      ],
      "checkPhaseFormId": 130,
      "groupWeight": 80,
      "groupName": "Kết quả công việc",
      "listGroupConfig": [],
      "groupTargetId": 2,
      "groupTargetCode": "G2",
      "groupOrder": 2,
      "groupSeftPoint": null,
      "groupLeadReviewPoint": null,
      "isDeleted": false
    }
  ],
  "checkPhaseFormId": 130,
  "employeeCode": "3644798",
  "createDate": "2022-07-29T14:55:52.005171",
  "checkPhaseFormName": "Biểu mẫu 13/07",
  "fullName": "Khương Văn Minh",
  "position": "Chuyên viên Phát triển sản phẩm",
  "employeeLevel": "CV",
  "organization_lv3": null,
  "organization_lv4": null,
  "status": 2,
  "isDeleted": false,
  "seftTotalComplete": 0,
  "leadReviewTotalComplete": 0,
  "reviewer": "{\"uid\":\"3529661\",\"fullname\":\"DD_Truongkhoa_03\",\"job_code\":\"61T323400001\",\"username\":\"VM.TEST65\",\"company_email\":\"VM.TEST65@VINGROUP.NET\",\"position_title\":\"Chuyên viên Hành chính Nhân sự\",\"work_localtion\":null,\"pnl\":\"Vin3S\",\"division\":null,\"department\":null,\"unit\":null,\"part\":null,\"avatar\":null,\"status\":\"3\"}",
  "approver": "null",
  "formCode": "A00240",
  "totalSeftPoint": 0,
  "totalLeadReviewPoint": 0,
  "reviewPoolId": 5352,
  "adCode": "MINHKV1",
  "description": null,
  "hrAdmin": "Nguyễn Văn VinMec - Quản lý Tuyển dụng",
  "hrAccount": "3644797",
  "nextStep": 0,
  "totalTarget": 9,
  "reviewStreamCode": "1NF",
  "sendDateLv1": "2022-07-29T14:55:52.005171",
  "formType": null
}