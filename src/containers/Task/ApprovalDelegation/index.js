import React from "react"
import { useTranslation } from "react-i18next"

function ApprovalDelegationList(props) {
    const { t } = useTranslation()
    const { userApprovalDelegation, cancelApprovalDelegation } = props

    return (
        <>
        <div className="shadow approval-delegation-list">
            {
                !userApprovalDelegation ?
                <div className="data-not-found">{t("NoDataFound")}</div>
                :
                <>
                    <h6 className="text-uppercase">{t("DelegateTo")}</h6>
                    <div className="row user-info">
                        <div className="col-4">
                            <label>{t("DelegateTo")}</label>
                            <p className="text-truncate value full-name">{userApprovalDelegation.fullName}</p>
                        </div>
                        <div className="col-4">
                            <label>{t("Title")}</label>
                            <p className="text-truncate value other">{userApprovalDelegation.title}</p>
                        </div>
                        <div className="col-4">
                            <label>{t("DepartmentManage")}</label>
                            <p className="text-truncate value other">{userApprovalDelegation.division}</p>
                        </div>
                    </div>
                </>
            }
        </div>
        {
            userApprovalDelegation ?
            <div className="end-delegation">
                <button className="btn-end-delegation" onClick={() => cancelApprovalDelegation()}>{t("EndDelegation")}</button>
            </div>
            : null
        }
        </>
    )
}

export default ApprovalDelegationList
