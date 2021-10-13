import React from "react"
import { useTranslation} from "react-i18next"

function LeaveInformationComponent(props) {
    const leaveInformation = props.payslip.leave_information
    const { t } = useTranslation()

    return (
        <>
            <table className="leave-days-information-table">
                <thead>
                    <tr>
                        <th className="title top-title" colSpan="4">b. {t("LeavesAndToil")}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="same-width title">{t("TypeOfLeavesAndToil")}</td>
                        <td className="same-width title">{t("TotalIncurredDaysAndHours")}</td>
                        <td className="same-width title">{t("TotalUsed")}</td>
                        <td className="same-width title">{t("TotalRemainingDaysAndHours")}</td>
                    </tr>
                    {
                        (leaveInformation || []).map((item, index) => {
                            return <tr key={index}>
                                        <td className="same-width">{t(item.leave_type || "")}</td>
                                        <td className="same-width">{item.total_leave_entitlement || 0}</td>
                                        <td className="same-width">{item.used_leave || 0}</td>
                                        <td className="same-width">{item.unused_leave || 0}</td>
                                    </tr>
                        })
                    }
                </tbody>
            </table>
            <div className="clear"></div>
        </>
    )
}

export default LeaveInformationComponent
