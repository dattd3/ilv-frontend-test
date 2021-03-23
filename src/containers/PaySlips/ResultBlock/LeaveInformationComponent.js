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
                    <tr>
                        <td className="same-width">{t("AnnualLeaveDays")}</td>
                        <td className="same-width">{leaveInformation[0] ? leaveInformation[0].total_leave_entitlement : 0}</td>
                        <td className="same-width">{leaveInformation[0] ? leaveInformation[0].used_leave : 0}</td>
                        <td className="same-width">{leaveInformation[0] ? leaveInformation[0].unused_leave : 0}</td>
                    </tr>
                    <tr>
                        <td className="same-width">{t('ConvertedOtHoursToToil')}</td>
                        <td className="same-width">{leaveInformation[1] ? leaveInformation[1].total_leave_entitlement : 0}</td>
                        <td className="same-width">{leaveInformation[1] ? leaveInformation[1].used_leave : 0}</td>
                        <td className="same-width">{leaveInformation[1] ? leaveInformation[1].unused_leave : 0}</td>
                    </tr>
                    <tr>
                        <td className="same-width">{t("PaidOtHours")}</td>
                        <td className="same-width">{leaveInformation[2] ? leaveInformation[2].total_leave_entitlement : 0}</td>
                        <td className="same-width">{leaveInformation[2] ? leaveInformation[2].used_leave : 0}</td>
                        <td className="same-width">{leaveInformation[2] ? leaveInformation[2].unused_leave : 0}</td>
                    </tr>
                </tbody>
            </table>
            <div className="clear"></div>
        </>
    )
}

export default LeaveInformationComponent
