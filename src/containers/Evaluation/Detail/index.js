import React, { useState, useEffect } from "react"
import Select from 'react-select'
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { Doughnut } from 'react-chartjs-2'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import Constants from '../../../commons/Constants'
import { getRequestConfigurations } from '../../../commons/Utils'
import { evaluationStatus } from '../Constants'
import { useGuardStore } from '../../../modules'
import LoadingModal from '../../../components/Common/LoadingModal'

import IconArrowRightWhite from '../../../assets/img/icon/pms/arrow-right-white.svg'
import IconArrowRightGray from '../../../assets/img/icon/pms/arrow-right-gray.svg'
import IconUp from '../../../assets/img/icon/pms/icon-up.svg'
import IconDown from '../../../assets/img/icon/pms/icon-down.svg'
import IconSave from '../../../assets/img/ic-save.svg'
import IconSendRequest from '../../../assets/img/icon/Icon_send.svg'

import map from '../../map.config'

function EvaluationOverall(props) {
    const { overallData, evaluationFormDetail } = props

    console.log("RRRRRRRRRRRRRRRRR")
    console.log(evaluationFormDetail)

    const totalQuestions = (evaluationFormDetail?.listGroup || []).reduce((initial, current) => {
        initial += current?.listTarget?.length || 0
        return initial
    }, 0)

    const calculateAssessment = (listTarget) => {
        const assessmentScale = 5
        const assessment = (listTarget || []).reduce((initial, current) => {
            initial.selfAssessment += Number(current?.seftPoint || 0) / assessmentScale * Number(current?.weight || 0)
            initial.managerAssessment += Number(current?.leadReviewPoint || 0) / assessmentScale * Number(current?.weight || 0)
            return initial
        }, {selfAssessment: 0, managerAssessment: 0})

        return assessment
    }

    return <div className="block-overall">
                <div className="card shadow card-completed">
                    <h6 className="text-center">Đã hoàn thành: {evaluationFormDetail?.totalComplete || 0}/{totalQuestions}</h6>
                    <div className="chart">
                        <div className="detail">
                            <div className="result">
                                <Doughnut data={overallData} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card shadow card-overall">
                    <h6 className="text-center chart-title">Điểm tổng thể</h6>
                    <div className="chart">
                        <div className="detail">80</div>
                    </div>
                </div>
                <div className="card shadow card-detail">
                    <table className='table-list-evaluation'>
                        <thead>
                            <tr>
                                <th className='c-criteria'><div className='criteria'>Tên chí đánh giá</div></th>
                                <th className='c-self-assessment text-center'><div className='self-assessment'>Tự đánh giá</div></th>
                                <th className='c-manager-assessment text-center'><div className='manager-assessment color-red'>QLTT đánh giá</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (evaluationFormDetail?.listGroup || []).map((item, i) => {
                                    let assessment = calculateAssessment(item?.listTarget)

                                    return <tr key={i}>
                                                <td className='c-criteria'><div className='criteria'>{item?.groupName}</div></td>
                                                <td className='c-self-assessment text-center'>{assessment.selfAssessment}</td>
                                                <td className='c-manager-assessment text-center color-red'>{assessment.managerAssessment}</td>
                                            </tr>
                                })
                            }
                            <tr>
                                <td className='c-criteria'><div className='font-weight-bold text-uppercase criteria'>Điểm tổng thể</div></td>
                                <td className='c-self-assessment text-center font-weight-bold'>80</td>
                                <td className='c-manager-assessment text-center font-weight-bold color-red'>90</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
}

function EvaluationProcess(props) {
    const { evaluationFormDetail, showByManager, updateData } = props
    const stepStatusMapping = {
        [evaluationStatus.launch]: 0,
        [evaluationStatus.selfAssessment]: 1,
        [evaluationStatus.qlttAssessment]: 2,
        [evaluationStatus.cbldApproved]: 3,
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
        const stepEvaluationConfig = ['CBNV tự đánh giá', 'CBQLTT đánh giá', 'CBLĐ có thẩm quyền phê duyệt', 'Hoàn thành']
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
                            <span className="value">{evaluationFormDetail?.fullName}</span>
                        </div>
                        <div className="info-item">
                            <span className="label"><span className="font-weight-bold">Chức danh</span><span>:</span></span>
                            <span className="value">{evaluationFormDetail?.position}</span>
                        </div>
                        <div className="info-item">
                            <span className="label"><span className="font-weight-bold">Cấp bậc</span><span>:</span></span>
                            <span className="value">{evaluationFormDetail?.employeeLevel}</span>
                        </div>
                        <div className="info-item">
                            <span className="label"><span className="font-weight-bold">Ban/Chuỗi/Khối</span><span>:</span></span>
                            <span className="value">{evaluationFormDetail?.organization_lv3}</span>
                        </div>
                    </div>
                    <div className="right">
                        <div className="info-item">
                            <span className="label"><span className="font-weight-bold">Phòng/Vùng/Miền</span><span>:</span></span>
                            <span className="value">{evaluationFormDetail?.organization_lv4}</span>
                        </div>
                        <div className="info-item">
                            <span className="label"><span className="font-weight-bold">QLTT đánh giá</span><span>:</span></span>
                            <span className="value">{`${reviewerInfos?.fullname} - ${approverInfos?.position_title}`}</span>
                        </div>
                        <div className="info-item">
                            <span className="label"><span className="font-weight-bold">CBLĐ phê duyệt</span><span>:</span></span>
                            <span className="value">{`${approverInfos?.fullname} - ${approverInfos?.position_title}`}</span>
                        </div>
                        <div className="info-item">
                            <span className="label"><span className="font-weight-bold">HR Admin</span><span>:</span></span>
                            <span className="value">{`${evaluationFormDetail?.hrAdmin}`}</span>
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
        updateData(subIndex, parentIndex, stateName, element?.target?.value || "")
    }

    return <div className="card shadow evaluation-process">
                <div className="title">Quy trình đánh giá</div>
                <div className="step-block">
                    { renderEvaluationStep() }
                </div>
                <div className="employee-info-block">
                    { renderEmployeeInfos() }
                </div>

                {
                    (evaluationFormDetail?.listGroup || []).map((item, index) => {
                        let indexText = formatIndexText(index + 1)
                        let scores = prepareScores(item?.listGroupConfig)

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
                                        (item?.listTarget || []).map((target, i) => {
                                            let deviant = Number(target?.leadReviewPoint) - Number(target?.seftPoint)

                                            return <div className="evaluation-item" key={i}>
                                                        <div className="title">{`${i + 1}. ${target?.targetName}`}</div>
                                                        {
                                                            item?.listGroupConfig && item?.listGroupConfig?.length > 0 ? 
                                                            <div className="score-block">
                                                                <div className="self">
                                                                    <span className="red label">Điểm tự đánh giá</span>
                                                                    {
                                                                        showByManager 
                                                                        ? <input type="text" value={target?.seftPoint || ''} disabled /> 
                                                                        : 
                                                                        <select onChange={(e) => handleInputChange(i, index, 'seftPoint', e)} value={target?.seftPoint || ''}>
                                                                            <option value=''>Chọn điểm</option>
                                                                            {
                                                                                (scores || []).map((score, i) => {
                                                                                    return <option value={score} key={i}>{score}</option>
                                                                                })
                                                                            }
                                                                        </select>
                                                                    }
                                                                </div>
                                                                <div className="qltt">
                                                                    <span className="red label">Điểm QLTT đánh giá</span>
                                                                    {
                                                                        showByManager 
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
                                                                <div className="deviant">
                                                                    <span className="red label">Điểm chênh lệch</span>
                                                                    <span className={`value ${deviant > 0 ? 'up' : deviant < 0 ? 'down' : ''}`}>{`${deviant > 0 ? '+' : ''}${deviant}`}{deviant != 0 && <Image alt='Note' src={deviant > 0 ? IconUp : deviant < 0 ? IconDown : ''} />}</span>
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
                                                                            <th className="text-center actual-results"><span>Kết quả thực tế</span></th>
                                                                            <th className="text-center self-assessment"><span>Điểm tự đánh giá</span></th>
                                                                            <th className="text-center qltt-assessment"><span>Điểm QLTT đánh giá</span></th>
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
                                                                            <td className="text-center target"><span>{target?.target}%</span></td>
                                                                            <td className="text-center actual-results">
                                                                                { !showByManager ? <input type="text" placeholder="Nhập" value={target?.realResult || ""} onChange={(e) => handleInputChange(i, index, 'realResult', e)} /> : <span>{target?.realResult}</span> }
                                                                            </td>
                                                                            <td className="text-center self-assessment">
                                                                                { !showByManager ? <input type="text" placeholder="Nhập" value={target?.seftPoint || ""} onChange={(e) => handleInputChange(i, index, 'seftPoint', e)} /> : <span>{target?.seftPoint}</span> }
                                                                            </td>
                                                                            <td className="text-center qltt-assessment"><span>{target?.leadReviewPoint}</span></td>
                                                                            <td className="text-center deviant">
                                                                                <span className={`value ${deviant > 0 ? 'up' : deviant < 0 ? 'down' : ''}`}>{`${deviant > 0 ? '+' : ''}${deviant}`}{deviant != 0 && <Image alt='Note' src={deviant > 0 ? IconUp : deviant < 0 ? IconDown : ''} />}</span>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        }
                                                        <div className="comment">
                                                            <div className="self">
                                                                <p>Ý kiến của CBNV tự đánh giá</p>
                                                                <textarea rows={1} placeholder="Nhập thông tin" value={target?.seftOpinion || ""} onChange={(e) => handleInputChange(i, index, 'seftOpinion', e)} disabled={showByManager} />
                                                            </div>
                                                            <div className="qltt">
                                                                <p>Ý kiến của QLTT đánh giá</p>
                                                                <textarea rows={1} value={target?.leaderReviewOpinion || ""} onChange={(e) => handleInputChange(i, index, 'leaderReviewOpinion', e)} disabled={!showByManager} />
                                                            </div>
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

    const guard = useGuardStore()
    const user = guard.getCurentUser()
    const evaluationFormId = props.match.params.id
    const formCode = props.match.params.formCode
    const showByManager = props.showByManager
    
    useEffect(() => {
        const processEvaluationFormDetailData = response => {
            if (response && response.data) {
                const result = response.data.result
                if (result && result.code == Constants.PMS_API_SUCCESS_CODE) {
                    const evaluationFormDetailTemp = response.data?.data
                    evaluationFormDetailTemp.listGroup = ([...evaluationFormDetailTemp?.listGroup] || []).sort((pre, next) => pre.groupOrder - next.groupOrder)
                    SetEvaluationFormDetail(evaluationFormDetailTemp)
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
                    EmployeeCode: user?.employeeNo,
                    FormCode: formCode
                }
                const response = await axios.get(`${process.env.REACT_APP_HRDX_URL}api/targetform/formbyuser`, config)
                processEvaluationFormDetailData(response)
            } catch (e) {
                console.error(e)
                SetIsLoading(false)
            }
        }

        fetchEvaluationFormDetails()
    }, [])

    const updateData = (subIndex, parentIndex, stateName, value) => {
        const evaluationFormDetailTemp = {...evaluationFormDetail}
        evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex][stateName] = value
        SetEvaluationFormDetail(evaluationFormDetailTemp)
    }

    const overallData = {
        // labels: ["Red", "Green", "Yellow"],
        datasets: [
          {
            data: [5, 5],
            backgroundColor: ["#DEE2E6", "#7AD731"],
            hoverBackgroundColor: ["#DEE2E6", "#7AD731"],
            borderWidth: 0
          }
        ]
    };

    // const annualLeaveData = (canvas) => {
    //     const ctx = canvas.getContext("2d")
    //     const grdGreen = ctx.createLinearGradient(500, 0, 100, 0);
    //     grdGreen.addColorStop(0, "#91DD33");
    //     grdGreen.addColorStop(0.5, "#05BD29");
    //     grdGreen.addColorStop(1, "#91DD33");
    //     return {
    //       datasets: [{
    //         data: [1  , 1],
    //         title: {
    //           display: true
    //         }, 
    //         backgroundColor: [
    //           '#F4F3F8',
    //           grdGreen
    //         ]
    //       }]
    //     }
    //   }

    // const chartOption = {
    //     legend: {
    //       display: false
    //     },
    //     maintainAspectRatio: false,
    //     pieceLabel: {
    //       render: function (args) {
    //         return args.value + '%';
    //       },
    //       fontSize: 15,
    //       fontColor: '#DEE2E6'
    //     },
    //     rotation: -45
    //   }

    return (
        <>
        <LoadingModal show={isLoading} />
        <div className="evaluation-detail-page">
            {
                evaluationFormDetail ? 
                <>
                    <h1 className="content-page-header">{`${evaluationFormDetail?.checkPhaseFormName} của ${evaluationFormDetail?.fullName}`}</h1>
                    <div>
                        <EvaluationOverall overallData={overallData} evaluationFormDetail={evaluationFormDetail} showByManager={showByManager} />
                        <EvaluationProcess evaluationFormDetail={evaluationFormDetail} showByManager={showByManager} updateData={updateData} />
                        <div className="button-block">
                            <>
                            <button className="btn-action save"><Image src={IconSave} alt="Reject" />Lưu</button>
                            <button className="btn-action send"><Image src={IconSendRequest} alt="Approve" />Gửi tới bước tiếp theo</button>
                            </>
                            <>
                            <button className="btn-action reject"><Image src={IconSave} alt="Reject" />Từ chối</button>
                            <button className="btn-action confirm"><Image src={IconSendRequest} alt="Approve" />Xác nhận</button>
                            </>
                            <>
                            <button className="btn-action reject"><Image src={IconSave} alt="Reject" />Từ chối</button>
                            <button className="btn-action approve"><Image src={IconSendRequest} alt="Approve" />Phê duyệt</button>
                            </>
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
