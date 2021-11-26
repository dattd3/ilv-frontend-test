import React from "react"
import { useTranslation } from "react-i18next"
import { formatStringByMuleValue } from "../../commons/Utils"

function RelationshipList(props) {
    const { t } = useTranslation()
    const { relationships } = props

    return (
        <div className="relationship-item">
            <div className="info-label">
                <div className="col-item full-name">{t("FullName")}</div>
                <div className="col-item relationship">{t("Relationship")}</div>
                <div className="col-item birthday">{t("DateOfBirth")}</div>
                <div className="col-item tax-no">{t("AllowancesTaxNo")}</div>
                <div className="col-item allowances">{t("FamilyAllowances")}</div>
                <div className="col-item allowances-date">{t("AllowancesDate")}</div>
            </div>
            {
                relationships && relationships.length > 0 ?
                (relationships).map((item, i) => {
                    return <div className="info-value" key={i}>
                                <div className="col-item full-name">{item.full_name || ""}</div>
                                <div className="col-item relationship">{item.relation || ""}</div>
                                <div className="col-item birthday">{item.dob || ""}</div>
                                <div className="col-item tax-no">{item.tax_number || ""}</div>
                                <div className="col-item allowances"><input type="checkbox" className="check-box" defaultChecked={true} value={formatStringByMuleValue(item.is_reduced)} disabled={true} /></div>
                                <div className="col-item allowances-date">{formatStringByMuleValue(item.is_reduced) ? (item.from_date + ` - ` + item.to_date) : ""}</div>
                            </div>
                }) : t("NoDataFound")
            }
      </div>
    )
}

export default RelationshipList
