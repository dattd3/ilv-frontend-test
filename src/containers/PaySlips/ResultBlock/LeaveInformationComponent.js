import React from "react"
import { useTranslation} from "react-i18next"

function LeaveInformationComponent(props) {
    const leaveInformation = props.payslip.leave_information
    const { t } = useTranslation()

    const annualLeaveTextVie = "Phép năm (Ngày)"
    const convertedOTHoursToToilTextVie = "OT quy bù (Giờ)"
    const paidOTHoursTextVie = "OT thanh toán (Giờ)"

    const removeMultiToSingleSpaceByValue = val => {
        return (val === null || val === undefined) ? '' : val?.toString()?.replace(/\s+/g, " ")
    }

    const annualLeave = (leaveInformation || []).find(item => removeMultiToSingleSpaceByValue(item?.leave_type)?.trim()?.toLowerCase() === removeMultiToSingleSpaceByValue(annualLeaveTextVie)?.trim()?.toLowerCase())
    const OTHoursToToil = (leaveInformation || []).find(item => removeMultiToSingleSpaceByValue(item?.leave_type)?.trim()?.toLowerCase() === removeMultiToSingleSpaceByValue(convertedOTHoursToToilTextVie)?.trim()?.toLowerCase())
    const paidOTHours = (leaveInformation || []).find(item => removeMultiToSingleSpaceByValue(item?.leave_type)?.trim()?.toLowerCase() === removeMultiToSingleSpaceByValue(paidOTHoursTextVie)?.trim()?.toLowerCase())

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
                        <td className="same-width">{annualLeave?.total_leave_entitlement || 0}</td>
                        <td className="same-width">{annualLeave?.used_leave || 0}</td>
                        <td className="same-width">{annualLeave?.unused_leave || 0}</td>
                    </tr>
                    <tr>
                        <td className="same-width">{t('ConvertedOtHoursToToil')}</td>
                        <td className="same-width">{OTHoursToToil?.total_leave_entitlement || 0}</td>
                        <td className="same-width">{OTHoursToToil?.used_leave || 0}</td>
                        <td className="same-width">{OTHoursToToil?.unused_leave || 0}</td>
                    </tr>
                    <tr>
                        <td className="same-width">{t("PaidOtHours")}</td>
                        <td className="same-width">{paidOTHours?.total_leave_entitlement || 0}</td>
                        <td className="same-width">{paidOTHours?.used_leave || 0}</td>
                        <td className="same-width">{paidOTHours?.unused_leave || 0}</td>
                    </tr>
                </tbody>
            </table>
            <div className="clear"></div>
        </>
    )
}

export default LeaveInformationComponent
