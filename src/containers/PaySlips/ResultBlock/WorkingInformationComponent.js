import React from "react"
import { useTranslation } from "react-i18next"
import { currencyKeyMapping, currencyUnitMapping } from './IncomeComponent'

function WorkingInformationComponent(props) {
    const { t } = useTranslation()
    const { payslip, currencySelected } = props
    const currentCompanyCode = localStorage.getItem("companyCode")
    const workingInformations = payslip.working_information

    return (
        <>
            <table className="table workday-information-table">
                <thead>
                    <tr>
                        <th className="title top-title" colSpan={currentCompanyCode === "V070" ? 15 : 14}>a. {t("TimesheetDetails")}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="second-title">
                        <td className="title title-second kcc" colSpan="2">{t("Period")}</td>
                        <td className="title title-second" colSpan={ !['V096','V060'].includes(currentCompanyCode) ? 5 : 3}>{t("IncomeInContract")}</td>
                        <td className="title title-second cc" rowSpan="2">{t("StandardWorkingDays")}</td>
                        <td className="title title-second" colSpan="4">{t("TimesheetDetailsOfDay")}</td>
                        <td className="title same-width title-second tchl" rowSpan="2">{t("TotalPaidDays")}</td>
                        {
                            currentCompanyCode === "V070" && 
                            <>
                                <td className="title same-width title-second sgcd" rowSpan="2">{t("TotalPaidMeals")}</td>
                            </>
                        }
                        {
                            !['V096','V060'].includes(currentCompanyCode) && 
                            <>
                                <td className="title same-width title-second sgcd" rowSpan="2">{t("NightWorkingHours")}</td>
                            </>
                        }
                    </tr>
                    <tr className="three-title">
                        <td className="title same-width title-second tn">{t("From")}</td>
                        <td className="title same-width title-second dn">{t("To")}</td>
                        <td className="title same-width title-second lcb">{t("BaseSalary")}</td>
                        <td className="title same-width title-second">{t("BehaviorAndAttitudeBonus")}</td>
                        {
                            !['V096','V060'].includes(currentCompanyCode) ? <>
                                <td className="title same-width title-second ttng">{t("ProficiencyBonus")}</td>
                                <td className="title same-width title-second">{t("ServiceChargeAndCaddieFee")}</td>
                            </> : null
                        }
                        <td className="title same-width title-second ttn">{t("Total")}</td>
                        <td className="title same-width title-second clvtt">{t("ActualWorkingDays")}</td>
                        <td className="title same-width title-second snnchl">{t("PaidLeaveDays")}</td>
                        <td className="title same-width title-second cnv">{t("SuspensionDay")}</td>
                        <td className="title same-width title-second snnkhl">{t("UnpaidLeaveDays")}</td>
                    </tr>
                    {(workingInformations || []).map((workingInformation, key) => {
                        let baseSalary = Number(workingInformation[`base_salary${currencyKeyMapping[currencySelected]}`] || 0)
                        let behaviorBonus = Number(workingInformation[`behaviour_bonus${currencyKeyMapping[currencySelected]}`] || 0)
                        let vpProficiencyBonus = Number(workingInformation[`vp_proficiency_bonus${currencyKeyMapping[currencySelected]}`] || 0)
                        let serviceChargeBonus = Number(workingInformation[`service_charge_bonus${currencyKeyMapping[currencySelected]}`] || 0)
                        let totalBaseSalary = baseSalary + behaviorBonus + vpProficiencyBonus + serviceChargeBonus

                        return <tr className="data-row" key={key}>
                            <td className="same-width tn">{workingInformation?.start_date}</td>
                            <td className="same-width dn">{workingInformation?.end_date}</td>
                            <td className="same-width lcb">{ baseSalary.toLocaleString(currencyUnitMapping[currencySelected]) }</td>
                            <td className="same-width">{ behaviorBonus.toLocaleString(currencyUnitMapping[currencySelected]) }</td>
                            {
                                !['V096','V060'].includes(currentCompanyCode) 
                                ? <>
                                    <td className="same-width ttng">{ vpProficiencyBonus.toLocaleString(currencyUnitMapping[currencySelected]) }</td>
                                    <td className="same-width">{ serviceChargeBonus.toLocaleString(currencyUnitMapping[currencySelected]) }</td>
                                </> 
                                : null
                            }
                            <td className="same-width ttn">{ totalBaseSalary.toLocaleString(currencyUnitMapping[currencySelected]) }</td>
                            <td className="same-width cc">{ workingInformation?.standard_day || 0 }</td>
                            <td className="same-width clvtt">{ workingInformation?.actual_day || 0 }</td>
                            <td className="same-width snnchl">{ workingInformation?.leave_day || 0 }</td>
                            <td className="same-width clvtt">{ workingInformation?.suspension_day || 0 }</td>
                            <td className="same-width snnkhl">{ workingInformation?.unpaid_day || 0 }</td>
                            <td className="same-width cnv">{ workingInformation?.total_paid_working_days || 0 }</td>
                            { currentCompanyCode === "V070" && <td className="same-width sgcd">{ workingInformation.actual_day || 0 }</td> }
                            { !['V096','V060'].includes(currentCompanyCode) && <td className="same-width sgcd">{ workingInformation?.night_shift_hours || 0 }</td> }
                        </tr>
                    })}
                </tbody>
            </table>
            <div className="clear"></div>
        </>
    );
}

export default WorkingInformationComponent;
