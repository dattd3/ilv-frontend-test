import React, { useState, useEffect } from "react"
import Select from 'react-select'
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { Doughnut } from 'react-chartjs-2'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
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
    const { evaluationFormDetail } = props
    const totalCompleted = evaluationFormDetail?.totalComplete || 0

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
        tooltips: {enabled: false},
        hover: {mode: null},
        cutoutPercentage: 70
    }

    return <div className="block-overall">
                <div className="card shadow card-completed">
                    <h6 className="text-center">Đã hoàn thành: {totalCompleted || 0}/{evaluationFormDetail?.totalTarget}</h6>
                    <div className="chart">
                        <div className="detail">
                            <div className="result">
                                <span className="percent">{`${(totalCompleted/evaluationFormDetail?.totalTarget*100).toFixed(2)}%`}</span>
                                <Doughnut data={overallData} options={chartOption} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card shadow card-overall">
                    <h6 className="text-center chart-title">Điểm tổng thể</h6>
                    <div className="chart">
                        <div className="detail">{evaluationFormDetail?.status == evaluationStatus.launch  ? evaluationFormDetail?.totalSeftPoint || 0 : evaluationFormDetail?.totalLeadReviewPoint || 0}</div>
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
                                    // let assessment = calculateAssessment(item?.listTarget)
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
                                                                <div className="qltt">
                                                                    <span className="red label">Điểm QLTT đánh giá</span>
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
                                                                                { !showByManager && evaluationFormDetail.status == evaluationStatus.launch ? <input type="text" placeholder="Nhập" value={target?.realResult || ""} onChange={(e) => handleInputChange(i, index, 'realResult', e)} /> : <span>{target?.realResult}</span> }
                                                                            </td>
                                                                            <td className="text-center self-assessment">
                                                                                { !showByManager && evaluationFormDetail.status == evaluationStatus.launch ? <input type="text" placeholder="Nhập" value={target?.seftPoint || ""} onChange={(e) => handleInputChange(i, index, 'seftPoint', e)} /> : <span>{target?.seftPoint}</span> }
                                                                            </td>
                                                                            <td className="text-center qltt-assessment">
                                                                                {
                                                                                    showByManager && evaluationFormDetail.status == evaluationStatus.selfAssessment 
                                                                                    ? <input type="text" placeholder="Nhập" value={target?.leadReviewPoint || ""} onChange={(e) => handleInputChange(i, index, 'leadReviewPoint', e)} />
                                                                                    : <span>{target?.leadReviewPoint}</span>
                                                                                }
                                                                            </td>
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
                                                                <textarea rows={1} placeholder="Nhập thông tin" value={target?.seftOpinion || ""} onChange={(e) => handleInputChange(i, index, 'seftOpinion', e)} disabled={showByManager || evaluationFormDetail.status != evaluationStatus.launch} />
                                                            </div>
                                                            <div className="qltt">
                                                                <p>Ý kiến của QLTT đánh giá</p>
                                                                <textarea rows={1} value={target?.leaderReviewOpinion || ""} onChange={(e) => handleInputChange(i, index, 'leaderReviewOpinion', e)} disabled={!showByManager || (showByManager && Number(evaluationFormDetail.status) >= Number(evaluationStatus.qlttAssessment))} />
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
    const [statusModal, SetStatusModal] = useState({isShow: false, isSuccess: true, content: ""})
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
                    evaluationFormDetailTemp.listGroup = ([...evaluationFormDetailTemp?.listGroup] || []).sort((pre, next) => pre.groupOrder - next.groupOrder)
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
                const response = await axios.get(`${process.env.REACT_APP_HRDX_URL}api/targetform/formbyuser`, config)
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
        }, {selfAssessment: 0, managerAssessment: 0})
        return assessment
    }

    const getTotalInfoByListGroup = (listGroup) => {
        const result = (listGroup || []).reduce((initial, current) => {
            let assessment = calculateAssessment(current?.listTarget)
            initial.self += assessment?.selfAssessment * Number(current?.groupWeight) / 100
            initial.manager += assessment?.managerAssessment * Number(current?.groupWeight) / 100
            return initial
        }, {self: 0, manager: 0})
        return result
    }

    const updateData = (subIndex, parentIndex, stateName, value) => {
        const evaluationFormDetailTemp = {...evaluationFormDetail}
        evaluationFormDetailTemp.listGroup[parentIndex].listTarget[subIndex][stateName] = value
        const totalQuestionsAnswered = (evaluationFormDetailTemp?.listGroup || []).reduce((initial, current) => {
            let questionsAnswered = (current?.listTarget || []).reduce((subInitial, subCurrent) => {
                subInitial += subCurrent?.seftPoint ? 1 : 0
                return subInitial
            }, 0)
            initial += questionsAnswered
            return initial
        }, 0)
        evaluationFormDetailTemp.listGroup = [...evaluationFormDetailTemp.listGroup || []].map(item => {
            return {
                ...item,
                groupSeftPoint: calculateAssessment(item?.listTarget)?.selfAssessment || 0,
                groupLeadReviewPoint: calculateAssessment(item?.listTarget)?.managerAssessment || 0
            }
        })
        const totalInfos = getTotalInfoByListGroup(evaluationFormDetailTemp.listGroup)
        evaluationFormDetailTemp.totalComplete = totalQuestionsAnswered
        evaluationFormDetailTemp.totalSeftPoint = totalInfos?.self || 0
        evaluationFormDetailTemp.totalLeadReviewPoint = totalInfos?.manager || 0
        SetEvaluationFormDetail(evaluationFormDetailTemp)
    }
    
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

    const renderButtonBlock = () => {
        switch (evaluationFormDetail?.status) {
            case evaluationStatus.launch:
                return  (
                    <>
                        <button className="btn-action save" onClick={() => handleSubmit(actionButton.save)}><Image src={IconSave} alt="Save" />Lưu</button>
                        <button className="btn-action send" onClick={() => handleSubmit(actionButton.approve)}><Image src={IconSendRequest} alt="Send" />Gửi tới bước tiếp theo</button>
                    </>
                )
            case evaluationStatus.selfAssessment:
                if (showByManager) {
                    return  (
                        <>
                            <button className="btn-action reject" onClick={() => handleSubmit(actionButton.reject)}><Image src={IconReject} alt="Reject" />Từ chối</button>
                            <button className="btn-action confirm" onClick={() => handleSubmit(actionButton.approve)}><Image src={IconApprove} alt="Confirm" />Xác nhận</button>
                        </>
                    )
                }
                return null
            case evaluationStatus.qlttAssessment:
                if (showByManager) {
                    return  (
                        <>
                            <button className="btn-action reject" onClick={() => handleSubmit(actionButton.reject)}><Image src={IconReject} alt="Reject" />Từ chối</button>
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
        const statusModalTemp = {...statusModal}
        statusModalTemp.isShow = false
        statusModalTemp.isSuccess = true
        statusModalTemp.content = ""
        SetStatusModal(statusModalTemp)
        window.location.reload()
    } 

    const handleSubmit = async (actionCode, isApprove) => {
        SetIsLoading(true)
        const statusModalTemp = {...statusModal}
        try {
            const config = getRequestConfigurations()
            if (actionCode == actionButton.reject || isApprove) { // Từ chối hoặc Phê duyệt
                const payload = {
                    ListFormCode : [evaluationFormDetail?.formCode],
                    type: actionCode,
                    CurrentStatus: evaluationFormDetail?.status
                }
                const response = await axios.post(`${process.env.REACT_APP_HRDX_URL}api/form/ApproveBothReject`, payload, config)
                SetIsLoading(false)
                statusModalTemp.isShow = true
                if (response && response.data) {
                    const result = response.data.result
                    if (result.code == Constants.PMS_API_SUCCESS_CODE) {
                        statusModalTemp.isSuccess = true
                        statusModalTemp.content = getResponseMessages(evaluationFormDetail?.status, actionCode, 'success')
                    } else {
                        statusModalTemp.isSuccess = false
                        statusModalTemp.content = getResponseMessages(evaluationFormDetail?.status, actionCode, 'failed')
                    }
                } else {
                    statusModalTemp.isSuccess = false
                    statusModalTemp.content = getResponseMessages(evaluationFormDetail?.status, actionCode, 'failed')
                }
                SetStatusModal(statusModalTemp)
            } else { // Lưu, CBNV Gửi tới bước tiếp theo, CBQLTT xác nhận
                const payload = {...evaluationFormDetail}
                payload.nextStep = actionCode
                const response = await axios.post(`${process.env.REACT_APP_HRDX_URL}api/targetform/update`, payload, config)
                SetIsLoading(false)
                statusModalTemp.isShow = true
                if (response && response.data) {
                    const result = response.data.result
                    if (result.code == Constants.PMS_API_SUCCESS_CODE) {
                        statusModalTemp.isSuccess = true
                        statusModalTemp.content = getResponseMessages(payload.status, actionCode, 'success')
                    } else {
                        statusModalTemp.isSuccess = false
                        statusModalTemp.content = getResponseMessages(payload.status, actionCode, 'failed')
                    }
                } else {
                    statusModalTemp.isSuccess = false
                    statusModalTemp.content = getResponseMessages(payload.status, actionCode, 'failed')
                }
                SetStatusModal(statusModalTemp)
            }
        } catch (e) {
            SetIsLoading(false)
            statusModalTemp.isShow = false
            statusModalTemp.isSuccess = false
            statusModalTemp.content = t("AnErrorOccurred")
            SetStatusModal(statusModalTemp)
        }
    }

    return (
        <>
        <LoadingModal show={isLoading} />
        <StatusModal show={statusModal.isShow} isSuccess={statusModal.isSuccess} content={statusModal.content} onHide={onHideStatusModal} />
        <div className="evaluation-detail-page">
            {
                evaluationFormDetail ? 
                <>
                    <h1 className="content-page-header">{`${evaluationFormDetail?.checkPhaseFormName} của ${evaluationFormDetail?.fullName}`}</h1>
                    <div>
                        <EvaluationOverall evaluationFormDetail={evaluationFormDetail} showByManager={showByManager} />
                        <EvaluationProcess evaluationFormDetail={evaluationFormDetail} showByManager={showByManager} updateData={updateData} />
                        <div className="button-block">
                            { renderButtonBlock() }
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
