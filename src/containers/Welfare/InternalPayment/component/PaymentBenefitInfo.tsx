import React from "react";
import Select from "react-select";
import moment from "moment";
import { IDropdownValue } from "models/CommonModel";
import { IQuota } from "models/welfare/PaymentModel";
interface IPaymentBenefitInfoProps {
  t: any;
  data?: any;
  options: IDropdownValue[];
  isCreateMode: boolean;
  setYearSelected: Function;
  yearSelected?: IDropdownValue;
  quota: IQuota;
}

function PaymentBenefitInfo({
  t,
  data,
  options = [],
  isCreateMode = false,
  setYearSelected,
  yearSelected,
  quota,
}: IPaymentBenefitInfoProps) {
  return (
    <>
      <h5 style={{ color: "#000000" }}>{t("WelfareInfo")}</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            {t("lua_chon_nam")}
            <Select
              placeholder={t("option")}
              options={options}
              isClearable={false}
              value={yearSelected}
              onChange={(e) => setYearSelected(e)}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
              isDisabled={!isCreateMode}
            />
          </div>
          <div className="col-4">
            {t("FreeNightNotClaim")}
            <div className="detail1">
              {quota.freeNightTotal - quota.freeNightClaimed}
            </div>
          </div>
          <div className="col-4">
            {t("FreeNightClaim")}
            <div className="detail1">{quota?.freeNightNeedClaim}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {t("FreeNightRemain")}
            <div className="detail1">
              {quota.freeNightTotal -
                quota.freeNightClaimed -
                quota.freeNightNeedClaim}
            </div>
          </div>
          <div className="col-4">
            {t("DiscountNightNotClaim")}
            <div className="detail1">
              {quota?.discountNightTotal - quota.discountNightClaimed}
            </div>
          </div>
          <div className="col-4">
            {t("DiscountNightClaim")}
            <div className="detail1">{quota.discountNightNeedClaim}</div>
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-4">
            {t("DiscountNightRemain")}
            <div className="detail1">
              {quota?.discountNightTotal -
                quota.discountNightClaimed -
                quota.discountNightNeedClaim}
            </div>
          </div>
          {isCreateMode ? (
            <>
              <div className="col-4">
                {t("FreeExamCanUse")}
                <div className="detail1">{quota.examTimesUseable}</div>
              </div>
              <div className="col-4">
                {t("FreeExamUsed")}
                <div className="detail1">{quota.examTimesUsed}</div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default PaymentBenefitInfo;
