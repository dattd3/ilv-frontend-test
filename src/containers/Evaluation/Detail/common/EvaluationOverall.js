import { useTranslation } from "react-i18next"
import { Doughnut } from 'react-chartjs-2'
import { formatEvaluationNumber } from '../../Utils'
import { evaluationStatus, processStep, languageCodeMapping } from '../../Constants'

const EvaluationOverall = (props) => {
    const currentLocale = localStorage.getItem("locale")
    const { t } = useTranslation()
    const { status, reviewStreamCode, formType, showByManager, totalTarget, listGroup, seftTotalComplete, leadReviewTotalComplete, totalSeftPoint, totalLeadReviewPoint } = props
    const isOffLineType = formType === 'OFF'
    const totalCompleted = showByManager ? leadReviewTotalComplete || 0 : seftTotalComplete || 0
    const isDifferentZeroLevel = reviewStreamCode !== processStep.zeroLevel
    const overallData = {
        datasets: [
            {
                data: [totalTarget - totalCompleted, totalCompleted],
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
            report: `${formatEvaluationNumber((totalCompleted / totalTarget * 100))}%`
        }
    }
    
    return (
        <div className="block-overall">
            <div className="card shadow card-completed" style={isOffLineType ? { display: 'none' } : {}} >
                <h6 className="text-center text-uppercase chart-title">{t("EvaluationDetailAccomplished")}: <span className="font-weight-bold">{totalCompleted || 0}/{totalTarget}</span></h6>
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
                        {
                            (
                                (
                                    status == evaluationStatus.launch 
                                    || (status == evaluationStatus.selfAssessment && !showByManager) 
                                    || reviewStreamCode === processStep.zeroLevel
                                )
                                && !isOffLineType
                            )
                            ? formatEvaluationNumber(totalSeftPoint)
                            : formatEvaluationNumber(totalLeadReviewPoint)
                        }
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
                            (listGroup || []).map((item, i) => {
                                return (
                                    <tr key={i}>
                                        <td className='c-criteria'><div className='criteria'>{JSON.parse(item?.groupName || '{}')[languageCodeMapping[currentLocale]]}</div></td>
                                        <td className='c-self-assessment text-center'>{(item?.groupSeftPoint || 0).toFixed(2)}</td>
                                        {isDifferentZeroLevel && <td className='c-manager-assessment text-center color-red'>{(item?.groupLeadReviewPoint || 0).toFixed(2)}</td>}
                                    </tr>
                                )
                            })
                        }

                        {/* Row điểm tổng thể */}
                        <tr className="highlight">
                            <td className='c-criteria'><div className='font-weight-bold text-uppercase criteria'>{t("EvaluationDetailOverallScore")}</div></td>
                            <td className='c-self-assessment text-center font-weight-bold'>{(totalSeftPoint || 0).toFixed(2)}</td>
                            {isDifferentZeroLevel && <td className='c-manager-assessment text-center font-weight-bold color-red'>{(totalLeadReviewPoint || 0).toFixed(2)}</td>}
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
    )
}

export default EvaluationOverall
