import React, { Fragment } from "react"
import { useTranslation } from "react-i18next"
import { formatStringByMuleValue } from "../../commons/Utils"

function RelationshipListEdit(props) {
    const { t } = useTranslation()
    const { relationships } = props

    return (
        <div className="editing-section">
            <div className="old-new-flag">
                <span className="flag old">
                    <span className="box"></span>
                    <span>Thông tin cũ</span>
                </span>
                <span className="flag new">
                    <span className="box"></span>
                    <span>Nhập thông tin điều chỉnh</span>
                </span>
            </div>
            <div className="detail-info">
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
                    (relationships || []).map((item, i) => {
                    return <Fragment key={i}>
                            <div className="info-value">
                                <div className="col-item full-name">{item.full_name || ""}</div>
                                <div className="col-item relationship">{item.relation || ""}</div>
                                <div className="col-item birthday">{item.dob || ""}</div>
                                <div className="col-item tax-no">{item.tax_number || ""}</div>
                                <div className="col-item allowances"><input type="checkbox" className="check-box" defaultChecked={true} value={formatStringByMuleValue(item.is_reduced)} disabled={true} /></div>
                                <div className="col-item allowances-date">{formatStringByMuleValue(item.is_reduced) ? (item.from_date + ` - ` + item.to_date) : ""}</div>
                            </div>
                            <div className="edit-value">
                                <div className="col-item first-name">
                                    <label>Họ và tên đệm</label>
                                    <input type="text" className="text-box" value={item.full_name || ""} />
                                </div>
                                <div className="col-item last-name">
                                    <label>Tên</label>
                                    <input type="text" className="text-box" value={item.relation || ""} />
                                </div>
                                <div className="col-item relationship">
                                    <label>Mối quan hệ</label>
                                    <input type="text" className="text-box" value={item.relation || ""} />
                                </div>
                                <div className="col-item gender">
                                    <label>Giới tính</label>
                                    <input type="text" className="text-box" value={item.relation || ""} />
                                </div>
                                <div className="col-item birthday">
                                    <label>Ngày sinh</label>
                                    <input type="text" className="text-box" value={item.dob || ""} />
                                </div>
                            </div>
                        </Fragment>
                    })
                }
                </div>
            </div>
        </div>
    )
}

export default RelationshipListEdit
