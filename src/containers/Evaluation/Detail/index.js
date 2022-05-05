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
import map from '../../map.config'

function EvaluationDetail(props) {
    const { t } = useTranslation()
    const [evaluationFormDetail, SetEvaluationFormDetail] = useState(null)
    const [isLoading, SetIsLoading] = useState(false)

    const guard = useGuardStore()
    const user = guard.getCurentUser()
    const evaluationFormId = props.match.params.id
    const formCode = props.match.params.formCode

    const stepStatusMapping = {
        [evaluationStatus.launch]: 0,
        [evaluationStatus.selfAssessment]: 1,
        [evaluationStatus.qlttAssessment]: 2,
        [evaluationStatus.cbldApproved]: 3,
    }
    
    useEffect(() => {
        const processEvaluationFormDetailData = response => {
            if (response && response.data) {
                const result = response.data.result
                if (result && result.code == Constants.PMS_API_SUCCESS_CODE) {
                    SetEvaluationFormDetail(response.data?.data)
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

    const handleStatusClick = (projectId, statusId) => {
        // window.location.replace(`/project/${projectId}`)
    }

    const onChangePage = (page) => {
        // const pagingTemp = {...paging}
        // pagingTemp.pageIndex = page
        // SetPaging({...paging, pageIndex: page})
    }

    const renderListProjects = () => {
        // return (
        //     (projectData.projects || []).map((item, index) => {
        //         return <React.Fragment key={index}>
        //             <ProjectRowItem item={item} index={index + 1} handleStatusClick={handleStatusClick} />
        //         </React.Fragment>
        //     })
        // )
    }

    const handleChangeSelectInput = e => {

    }

    const handleOnSubmit = e => {}

    const data = {
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

    console.log("ahehehhehhe")
    console.log(evaluationFormDetail)

    const renderEvaluationStep = () => {
        const stepEvaluationConfig = ['CBNV tự đánh giá', 'CBQL đánh giá', 'CBLĐ có thẩm quyền phê duyệt', 'Hoàn thành']
        return stepEvaluationConfig.map((item, index) => {
            let activeClass = index === stepStatusMapping[evaluationFormDetail?.status] ? 'active' : ''
            return (
                <div className="wrap-item" key={index}>
                    <div className="line"><hr /></div>
                    <div className={`info ${activeClass}`}>
                        <div className="item">
                            <span className="no"><span>{index + 1}</span></span>
                            <span className="name">{item}</span>
                            <Image src={IconArrowRightGray} alt="Next" className="next" />
                        </div>
                    </div>
                </div>
            )
        })
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

    // const { listGroup } = evaluationFormDetail

    // console.log("RRRRRRRRRRRRRRR")
    // console.log(listGroup)

    const listGroupToShow = (evaluationFormDetail?.listGroup || []).sort((pre, next) => pre.groupOrder - next.groupOrder)

    return (
        <>
        <LoadingModal show={isLoading} />
        <div className="evaluation-detail-page">
            {
                evaluationFormDetail ? 
                <>
                    <h1 className="content-page-header">{`${evaluationFormDetail?.checkPhaseFormName} của ${evaluationFormDetail?.fullName}`}</h1>
                    <div>
                        <div className="block-overall">
                            <div className="card shadow card-completed">
                                <h6 className="text-center">Đã hoàn thành: 10/20</h6>
                                <div className="chart">
                                    <div className="detail">
                                        <div className="result">
                                            <Doughnut data={data} />
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
                                        <tr>
                                            <td className='c-criteria'><div className='criteria'>Tinh thần thái độ</div></td>
                                            <td className='c-self-assessment text-center'>80</td>
                                            <td className='c-manager-assessment text-center color-red'>90</td>
                                        </tr>
                                        <tr>
                                            <td className='c-criteria'><div className='criteria'>Kết quả công việc</div></td>
                                            <td className='c-self-assessment text-center'>80</td>
                                            <td className='c-manager-assessment text-center color-red'>90</td>
                                        </tr>
                                        <tr>
                                            <td className='c-criteria'><div className='font-weight-bold text-uppercase criteria'>Điểm tổng thể</div></td>
                                            <td className='c-self-assessment text-center font-weight-bold'>80</td>
                                            <td className='c-manager-assessment text-center font-weight-bold color-red'>90</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card shadow evaluation-process">
                            <div className="title">Quy trình đánh giá</div>
                            <div className="step-block">
                                { renderEvaluationStep() }
                            </div>
                            <div className="employee-info-block">
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
                                            <span className="value">Nguyễn Đình Long - Kế toán trưởng</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label"><span className="font-weight-bold">CBLĐ phê duyệt</span><span>:</span></span>
                                            <span className="value">Nguyễn Hải Yến - CEO</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label"><span className="font-weight-bold">HR Admin</span><span>:</span></span>
                                            <span className="value">Phạm Thu Trang - Chuyên viên Nhân sự</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                listGroupToShow.map((item, index) => {
                                    let indexText = formatIndexText(index + 1)
                                    return <div className="part-block attitude" key={index}>
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
                                                                    {/* <th><span className="milestones">1</span></th>
                                                                    <th><span className="milestones">2</span></th>
                                                                    <th><span className="milestones">3</span></th>
                                                                    <th><span className="milestones">4</span></th>
                                                                    <th><span className="milestones">5</span></th> */}
                                                                </tr>
                                                                <tr>
                                                                    <th>%</th>
                                                                    {
                                                                        item?.listGroupConfig?.map((sub, subIndex) => {
                                                                            return <th key={subIndex}><span>{sub?.weight}</span></th>
                                                                        })
                                                                    }
                                                                    {/* <th><span>0% - 10%</span></th>
                                                                    <th><span>11% - 49%</span></th>
                                                                    <th><span>50% - 69%</span></th>
                                                                    <th><span>70% - 89%</span></th>
                                                                    <th><span>90% - 100%</span></th> */}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>Mức độ thể hiện</td>
                                                                    {
                                                                        item?.listGroupConfig?.map((sub, subIndex) => {
                                                                            return <td key={subIndex}><div>{sub?.description}</div></td>
                                                                            // return <th key={subIndex}><span>{sub?.weight}</span></th>
                                                                        })
                                                                    }
                                                                    {/* <td><div>Không thể hiện</div></td>
                                                                    <td><div>Không thể hiện</div></td>
                                                                    <td><div>Thể hiện nhưng chưa rõ nét hoặc chỉ thể hiện những khi cần hoặc khi được yêu cầu</div></td>
                                                                    <td><div>Thường xuyên thể hiện</div></td>
                                                                    <td><div>Luôn luôn chủ động thể hiện và là tấm gương cho người khác học tập</div></td> */}
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                }
                                                
                                                <div className="list-attitudes">
                                                    <div className="attitude-item">
                                                        <div className="title">1. Luôn tuân thủ các nội quy, quy định, quy chế của Tập đoàn</div>
                                                        <div className="score-block">
                                                            <div className="self">
                                                                <span className="red label">Điểm tự đánh giá</span>
                                                                <select>
                                                                    <option>Chọn điểm</option>
                                                                    <option>10</option>
                                                                </select>
                                                            </div>
                                                            <div className="qltt">
                                                                <span className="red label">Điểm QLTT đánh giá</span>
                                                                <input type="text" value={""} disabled />
                                                            </div>
                                                            <div className="deviant">
                                                                <span className="red label">Điểm chênh lệch</span>
                                                                <input type="text" value={"aa"} disabled />
                                                            </div>
                                                        </div>
                                                        <div className="comment">
                                                            <div className="self">
                                                                <p>Ý kiến của CBNV tự đánh giá</p>
                                                                <textarea rows={1} placeholder="Nhập thông tin" />
                                                            </div>
                                                            <div className="qltt">
                                                                <p>Ý kiến của QLTT đánh giá</p>
                                                                <textarea rows={1} disabled />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="attitude-item">
                                                        <div className="title">2. Luôn thể hiện bản lĩnh, sự khẩn trương, quyết liệt trong công việc, làm việc có trách nhiệm cao, chủ động, không né tránh, ỷ lại</div>
                                                        <div className="score-block">
                                                            <div className="self">
                                                                <span className="red label">Điểm tự đánh giá</span>
                                                                <select>
                                                                    <option>Chọn điểm</option>
                                                                    <option>10</option>
                                                                </select>
                                                            </div>
                                                            <div className="qltt">
                                                                <span className="red label">Điểm QLTT đánh giá</span>
                                                                <input type="text" value={""} disabled />
                                                            </div>
                                                            <div className="deviant">
                                                                <span className="red label">Điểm chênh lệch</span>
                                                                <input type="text" value={"aa"} disabled />
                                                            </div>
                                                        </div>
                                                        <div className="comment">
                                                            <div className="self">
                                                                <p>Ý kiến của CBNV tự đánh giá</p>
                                                                <textarea rows={1} placeholder="Nhập thông tin" />
                                                            </div>
                                                            <div className="qltt">
                                                                <p>Ý kiến của QLTT đánh giá</p>
                                                                <textarea rows={1} disabled />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="attitude-item">
                                                        <div className="title">3. Luôn làm việc khẩn trương với tinh thần phục vụ cao, giải quyết nhanh, dứt điểm thỏa đáng các vấn đề của đồng nghiệp, đối tác, khách hàng</div>
                                                        <div className="score-block">
                                                            <div className="self">
                                                                <span className="red label">Điểm tự đánh giá</span>
                                                                <select>
                                                                    <option>Chọn điểm</option>
                                                                    <option>10</option>
                                                                </select>
                                                            </div>
                                                            <div className="qltt">
                                                                <span className="red label">Điểm QLTT đánh giá</span>
                                                                <input type="text" value={""} disabled />
                                                            </div>
                                                            <div className="deviant">
                                                                <span className="red label">Điểm chênh lệch</span>
                                                                <input type="text" value={"aa"} disabled />
                                                            </div>
                                                        </div>
                                                        <div className="comment">
                                                            <div className="self">
                                                                <p>Ý kiến của CBNV tự đánh giá</p>
                                                                <textarea rows={1} placeholder="Nhập thông tin" />
                                                            </div>
                                                            <div className="qltt">
                                                                <p>Ý kiến của QLTT đánh giá</p>
                                                                <textarea rows={1} disabled />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="attitude-item">
                                                        <div className="title">4. Công bằng, quyết liệt đấu tranh với những hành vi không phù hợp với văn hóa và các quy định của Tập đoàn</div>
                                                        <div className="score-block">
                                                            <div className="self">
                                                                <span className="red label">Điểm tự đánh giá</span>
                                                                <select>
                                                                    <option>Chọn điểm</option>
                                                                    <option>10</option>
                                                                </select>
                                                            </div>
                                                            <div className="qltt">
                                                                <span className="red label">Điểm QLTT đánh giá</span>
                                                                <input type="text" value={""} disabled />
                                                            </div>
                                                            <div className="deviant">
                                                                <span className="red label">Điểm chênh lệch</span>
                                                                <input type="text" value={"aa"} disabled />
                                                            </div>
                                                        </div>
                                                        <div className="comment">
                                                            <div className="self">
                                                                <p>Ý kiến của CBNV tự đánh giá</p>
                                                                <textarea rows={1} placeholder="Nhập thông tin" />
                                                            </div>
                                                            <div className="qltt">
                                                                <p>Ý kiến của QLTT đánh giá</p>
                                                                <textarea rows={1} disabled />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                })
                            }


                            <div className="part-block work-result">
                                <div className="title">Phần II - Kết quả công việc<span className="red">(80%)</span></div>
                                <div className="list-work-result">
                                    <div className="work-result-item">
                                        <div className="title">1. Luôn tuân thủ các nội quy, quy định, quy chế của Tập đoàn</div>
                                        <div className="wrap-score-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th className="measurement"><span>Cách đo lường<span>(Tính theo điểm)</span></span></th>
                                                        <th className="proportion"><span>Tỷ trọng</span></th>
                                                        <th className="target"><span>Mục tiêu</span></th>
                                                        <th className="actual-results"><span>Kết quả thực tế</span></th>
                                                        <th className="self-assessment"><span>Điểm tự đánh giá</span></th>
                                                        <th className="qltt-assessment"><span>Điểm QLTT đánh giá</span></th>
                                                        <th className="deviant"><span>Điểm chênh lệch</span></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="measurement">
                                                            <ul>
                                                                <li>{"5 điểm: Đạt 100%"}</li>
                                                                <li>{"4 điểm: Đạt 90% - dưới 100%"}</li>
                                                                <li>{"3 điểm: Đạt 80% < 90%"}</li>
                                                                <li>{"2 điểm: Đạt 70% < 80%"}</li>
                                                                <li>{"1 điểm: Đạt 60% < 70%"}</li>
                                                            </ul>
                                                        </td>
                                                        <td className="proportion"><div>Không thể hiện</div></td>
                                                        <td className="target"><div>Không thể hiện</div></td>
                                                        <td><div>Thể hiện nhưng chưa rõ nét hoặc chỉ thể hiện những khi cần hoặc khi được yêu cầu</div></td>
                                                        <td><div>Thường xuyên thể hiện</div></td>
                                                        <td className="deviant"><div>Luôn luôn chủ động thể hiện và là tấm gương cho người khác học tập</div></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="comment">
                                            <div className="self">
                                                <p>Ý kiến của CBNV tự đánh giá</p>
                                                <textarea rows={1} placeholder="Nhập thông tin" />
                                            </div>
                                            <div className="qltt">
                                                <p>Ý kiến của QLTT đánh giá</p>
                                                <textarea rows={1} disabled />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="work-result-item">
                                        <div className="title">2. Tham gia đầy đủ các khóa đào tạo, huấn luyện theo yêu cầu</div>
                                        <div className="wrap-score-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th className="measurement"><span>Cách đo lường<span>(Tính theo điểm)</span></span></th>
                                                        <th className="proportion"><span>Tỷ trọng</span></th>
                                                        <th className="target"><span>Mục tiêu</span></th>
                                                        <th className="actual-results"><span>Kết quả thực tế</span></th>
                                                        <th className="self-assessment"><span>Điểm tự đánh giá</span></th>
                                                        <th className="qltt-assessment"><span>Điểm QLTT đánh giá</span></th>
                                                        <th className="deviant"><span>Điểm chênh lệch</span></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="measurement">
                                                            <ul>
                                                                <li>{"5 điểm: Đạt 100%"}</li>
                                                                <li>{"4 điểm: Đạt 90% - dưới 100%"}</li>
                                                                <li>{"3 điểm: Đạt 80% < 90%"}</li>
                                                                <li>{"2 điểm: Đạt 70% < 80%"}</li>
                                                                <li>{"1 điểm: Đạt 60% < 70%"}</li>
                                                            </ul>
                                                        </td>
                                                        <td className="proportion"><div>Không thể hiện</div></td>
                                                        <td className="target"><div>Không thể hiện</div></td>
                                                        <td><div>Thể hiện nhưng chưa rõ nét hoặc chỉ thể hiện những khi cần hoặc khi được yêu cầu</div></td>
                                                        <td><div>Thường xuyên thể hiện</div></td>
                                                        <td className="deviant"><div>Luôn luôn chủ động thể hiện và là tấm gương cho người khác học tập</div></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="comment">
                                            <div className="self">
                                                <p>Ý kiến của CBNV tự đánh giá</p>
                                                <textarea rows={1} placeholder="Nhập thông tin" />
                                            </div>
                                            <div className="qltt">
                                                <p>Ý kiến của QLTT đánh giá</p>
                                                <textarea rows={1} disabled />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
