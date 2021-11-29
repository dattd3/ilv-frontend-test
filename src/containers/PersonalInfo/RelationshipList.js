import React from "react"
import { useTranslation } from "react-i18next"
import moment from 'moment'
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
                                <div className="col-item full-name">{formatStringByMuleValue(item.full_name)}</div>
                                <div className="col-item relationship">{formatStringByMuleValue(item.relation)}</div>
                                <div className="col-item birthday">{formatStringByMuleValue(item.dob) ? moment(item.dob, 'DD-MM-YYYY').format('DD/MM/YYYY') : ""}</div>
                                <div className="col-item tax-no">{formatStringByMuleValue(item.tax_number)}</div>
                                <div className="col-item allowances"><input type="checkbox" className="check-box" defaultChecked={formatStringByMuleValue(item.is_reduced) ? true : false} disabled={true} /></div>
                                <div className="col-item allowances-date">{formatStringByMuleValue(item.is_reduced) ? (moment(item.from_date, 'DD-MM-YYYY').format('DD/MM/YYYY') + ` - ` + moment(item.to_date, 'DD-MM-YYYY').format('DD/MM/YYYY')) : ""}</div>
                            </div>
                }) : t("NoDataFound")
            }
      </div>
    )
}

export default RelationshipList
