import React from "react";
import { IPaymentUserInfo } from "../../../../models/welfare/PaymentModel";

interface PaymentUserInfoProps {
  t: any;
  userInfo: IPaymentUserInfo;
}
function PaymentUserInfo({ t, userInfo }: PaymentUserInfoProps) {
  return (
    <>
      <h5 style={{ color: "#000000" }}>{t("ManagerInfo")}</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            {t("FullName")}
            <div className="detail1">{userInfo.fullName}</div>
          </div>
          <div className="col-4">
            {t("EmployeeNo")}
            <div className="detail1">{userInfo.employeeNo}</div>
          </div>
          <div className="col-4">
            {t("Grade")}
            <div className="detail1">{userInfo.benefitLevel}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {t("CompanyName")}
            <div className="detail1">{userInfo.companyName}</div>
          </div>

          <div className="col-4">
            {t("DepartmentManage")}
            <div className="detail1">{userInfo.departmentName}</div>
          </div>
          <div className="col-4">
            {t("Cost Center")}
            <div className="detail1">{userInfo.costCenter}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentUserInfo;
