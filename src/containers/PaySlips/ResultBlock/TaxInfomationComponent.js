import React from "react"
import { useTranslation } from "react-i18next"

function TaxInformationComponent(props) {
    const { t } = useTranslation()
    const { payslip } = props
    const workingInformations = payslip.working_information

    return (
        <div className="tax-infomation shadow-customize">
            <div className="top-title">{t("tax_finalization_infomation")}</div>
            <div className="table-contain">
            <table className="table workday-information-table">
                <tbody>
                    <tr className="second-title bg-gray">
                        <td className="title same-width title-second title-tax" rowSpan="2">{t("mst")}</td>
                        <td className="title same-width title-second title-tax" rowSpan="2">{t("indenfy_number_3")}</td>
                        <td className="title same-width title-second title-tax" rowSpan="2">{t("ca_nhan_uy_quyen")}</td>
                        <td className="title same-width title-second title-tax" rowSpan="2">{t("ca_nhan_foreign_uy_quyen")}</td>
                        <td className="title  title-second title-tax" colSpan="2">{t("IncomeTaxInclude")}</td>
                        <td className="title  title-second title-tax" colSpan="3">{t("tax_reduce")}</td>
                    </tr>
                    <tr className="three-title bg-gray">
                        <td className="title same-width title-second title-tax">{t("total")}</td>
                        <td className="title same-width title-second title-tax">{t("tax_before_transfer")}</td>
                        <td className="title same-width title-second title-tax">{t("total_dependency_numbers")}</td>
                        <td className="title same-width title-second title-tax">{t("totaldependency_amount")}</td>
                        <td className="title same-width title-second title-tax">{t("insurance_reduce")}</td>
                    </tr>

                    {(workingInformations || []).map((workingInformation, key) => {
                        return <tr className="data-row" key={key}>
                            <td className="same-width tn">{'0123456789'}</td>
                            <td className="same-width dn">{'0123456789'}</td>
                            <td className="same-width lcb">{'Có'}</td>
                            <td className="same-width">{'Không'}</td>
                            <td className="same-width ttn">{ '100.000.000' }</td>
                            <td className="same-width cc">{ '100.000.000' }</td>
                            <td className="same-width snnchl">{ '2' }</td>
                            <td className="same-width clvtt">{ '237.600.000' }</td>
                            <td className="same-width snnkhl">{ '237.700.000' }</td>
                        </tr>
                    })}
                </tbody>
            </table>
            <div className="clear"></div>

            <table className="table workday-information-table">
                <tbody>
                    <tr className="second-title bg-gray">
                        <td className="title title-second title-tax" colSpan="2">{t("thue_ca_nhan_da_tru")}</td>
                        <td className="title title-second title-tax" colSpan="3">{t("chi_tiet_quyet_toan_thue")}</td>
                        <td className="title same-width title-second title-tax" rowSpan="2" style={{width: '17%'}}>
                            {t("dien_giai_neu_co")}
                        </td>
                    </tr>
                    <tr className="three-title bg-gray">
                        <td className="title same-width title-second title-tax">{t("total_tax_reduce")}</td>
                        <td className="title same-width title-second title-tax">{t("total_tax_reduce_before_transfer")}</td>
                        <td className="title same-width title-second title-tax">{t("total_tax_pay")}</td>
                        <td className="title same-width title-second title-tax">{t("total_tax_overpaid")}</td>
                        <td className="title same-width title-second title-tax" >{t("total_tax_addition")}</td>
                    </tr>

                    {(workingInformations || []).map((workingInformation, key) => {
                        return <tr className="data-row" key={key}>
                            <td className="same-width tn">{'100.000.000'}</td>
                            <td className="same-width dn">{'100.000.000'}</td>
                            <td className="same-width ttn">{ '100.000.000' }</td>
                            <td className="same-width cc">{ '100.000.000' }</td>
                            <td className="same-width clvtt">{ '237.600.000' }</td>
                            <td className="same-width snnkhl" style={{width: '17%'}}>{ '237.700.000' }</td>
                        </tr>
                    })}
                </tbody>
            </table>
            </div>
        </div>
    );
}

export default TaxInformationComponent;
