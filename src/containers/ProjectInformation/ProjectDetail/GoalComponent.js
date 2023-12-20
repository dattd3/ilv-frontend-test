import React from "react"
import { useTranslation } from "react-i18next"
import { levelColorMapping } from '../Constants'

function GoalComponent(props) {
    const { t } = useTranslation()
    const { rsmTargets } = props

    return (
        <div className="goal">
            <h2 className="title-block">II. {t("EvaluationDetailPartTarget")}</h2>
            <hr className="line-seperate"></hr>
            <div className="goal-table-wrapper">
                {
                    (!rsmTargets || rsmTargets?.length === 0)
                    ? <h6 className="alert alert-danger" role="alert">{t("NoDataFound")}</h6>
                    : <table className="goal-table">
                        <thead>
                            <tr>
                                <th rowSpan={2} className='c-no'><div className='no'>#</div></th>
                                <th rowSpan={2} className='c-goal-title'><div className='goal-title'>{t("EvaluationDetailPartTarget")}</div></th>
                                <th rowSpan={2} className='c-unit'><div className='unit'>Đơn vị</div></th>
                                <th rowSpan={2} className='c-detail'><div className='detail'>Giải thích chi tiết</div></th>
                                <th rowSpan={2} className='c-priority'><div className='priority text-center'>Ưu tiên</div></th>
                                <th colSpan={2} className='c-threshold'><div className='threshold text-center'>Threshold</div></th>
                            </tr>
                            <tr>
                                <th className='c-lsl'><div className='text-center lsl'>LSL</div></th>
                                <th className='c-usl'><div className='text-center usl'>USL</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (rsmTargets || []).map((item, index) => {
                                    return <tr key={index}>
                                        <td className='c-no'><div className='no'>{index + 1}</div></td>
                                        <td className='c-goal-title'><div className='goal-title'>{item?.targetName || ""}</div></td>
                                        <td className='c-unit'><div className='unit'>{item?.unit || ""}</div></td>
                                        <td className='c-detail'><div className='detail'>{item?.explainDetails || ''}</div></td>
                                        <td className='c-priority'><div className='priority text-center status'><span className={`level-style ${levelColorMapping[item?.prioritize]?.className}`}>{item?.prioritize || ""}</span></div></td>
                                        <td><div className='lsl text-center'>{item?.lsl || ''}</div></td>
                                        <td><div className='usl text-center'>{item?.usl || ''}</div></td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                }
            </div>
        </div>
    )
}

export default GoalComponent
