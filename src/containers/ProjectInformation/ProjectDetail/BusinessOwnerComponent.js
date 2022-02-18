import React from "react"
import { useTranslation } from "react-i18next"
import { levelColorMapping } from '../Constants'

function BusinessOwnerComponent(props) {
    const { t } = useTranslation()
    const { rsmBusinessOwners } = props

    console.log(44444444444)
    console.log(rsmBusinessOwners)

    return (
        <div className="business-owner-block">
            <div className="business-owner">Thông tin Business owner</div>
            <div className="business-owner-table-wrapper">
                {
                    (!rsmBusinessOwners || rsmBusinessOwners?.length === 0)
                    ? <h6 className="alert alert-danger" role="alert">{t("NoDataFound")}</h6>
                    : <table className="business-owner-table">
                        <thead>
                            <tr>
                                <th className='c-no'><div className='no'>#</div></th>
                                <th className='c-pnl'><div className='pnl'>P&L</div></th>
                                <th className='c-full-name'><div className='full-name'>Họ và tên</div></th>
                                <th className='c-email'><div className='email'>Địa chỉ Email</div></th>
                                <th className='c-interest-level'><div className='interest-level text-center'>Mức độ quan tâm</div></th>
                                <th className='c-affect-level'><div className='affect-level text-center'>Mức độ ảnh hưởng</div></th>
                                <th className='c-role-in-project'><div className='role-in-project'>Vai trò trong dự án</div></th>
                                <th className='c-note'><div className='note'>Ghi chú</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                rsmBusinessOwners.map((item, index) => {
                                    return <tr key={index}>
                                        <td className='c-no'><div className='no'>{index + 1}</div></td>
                                        <td className='c-pnl'><div className='pnl'>{item?.pnL || ""}</div></td>
                                        <td className='c-full-name'><div className='full-name'>{item?.fullName || ""}</div></td>
                                        <td className='c-email'><div className='email'>{item?.email || ""}</div></td>
                                        <td className='c-interest-level'><div className='interest-level text-center'><span className={`level-style ${levelColorMapping[item?.influenceLevel]?.className}`}>{item?.influenceLevel || ""}</span></div></td>
                                        <td className='c-affect-level'><div className='affect-level text-center'><span className={`level-style ${levelColorMapping[item?.criticalLevel]?.className}`}>{item?.criticalLevel || ""}</span></div></td>
                                        <td className='c-role-in-project'><div className='role-in-project'>{item?.ownerRole || ""}</div></td>
                                        <td className='c-note'><div className='note'>{item?.note || ""}</div></td>
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

export default BusinessOwnerComponent
