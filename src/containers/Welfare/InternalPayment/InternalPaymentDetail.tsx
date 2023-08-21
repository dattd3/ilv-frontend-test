import React, { useEffect, useState } from "react";
import PaymentUserInfo from "./component/PaymentUserInfo";
import { withTranslation } from "react-i18next";
import {
  IPaymentRequest,
  IPaymentService,
  IPaymentUserInfo,
  IQuota,
} from "models/welfare/PaymentModel";
import moment from "moment";
import ServiceRequest from "./ServiceRequest";
import PaymentBenefitInfo from "./component/PaymentBenefitInfo";
import { IDropdownValue } from "models/CommonModel";
import Constants from "commons/Constants";
import DetailButtonComponent from "containers/Registration/DetailButtonComponent";

interface IInternalPaymentDetailProps {
  action: any;
  data: any;
  viewPopup: boolean;
  t?: any;
}
const InternalPaymentDetail = (props: any) => {
  const { t, data } = props;
  const [userInfo, setUserInfo] = useState<IPaymentUserInfo>({});
  const [requests, setRequests] = useState<IPaymentRequest[]>([]);
  const [yearSelected, setYearSelected] = useState<IDropdownValue>();
  const [quota, setQuota] = useState<IQuota>({
    freeNightTotal: 0,
    discountNightTotal: 0,
    freeNightClaimed: 0,
    discountNightClaimed: 0,
    examTimesUseable: 0,
    examTimesUsed: 0,
    discountNightNeedClaim: 0,
    freeNightNeedClaim: 0,
  });
  useEffect(() => {
    if (data) {
      const user = data.user || {};

      setUserInfo({
        fullName: user.fullName || "",
        employeeNo: user.employeeNo || "",
        companyName: user.companyName || "",
        departmentName: [user.orgLv3Text, user.orgLv4Text, user.orgLv5Text]
          .filter((text) => text)
          .join("/"),
        benefitLevel: user.benefitLevel || "",
        costCenter: user.costCenter || "",
        employeeEmail: "",
      });
      if (data.requestInfo) {
        const _request: IPaymentRequest[] = (
          data.requestInfo.benefitRefundItem || []
        ).map((it) => {
          const _services: IPaymentService[] = (
            it.benefitRefundService || []
          ).map((_se, index) => ({
            DateUse: moment(_se.date, "YYYYMMDD").format("DD/MM/YYYY"),
            UseWelfareType: _se.serviceName || "",
            UseFor: _se.userType || "",
            FeePayment: _se.amountPaid,
            FeeUpgrade: _se.upgradeRoomFee,
            name: t("ServicePayment", { id: index + 1 }),
            Detail: _se.detail,
            PnlDiscountPercent: _se.pnlDiscountPercent,
            QuotedPrice: _se.quotedPrice,
            FeeBenefit: _se.benefitDiscountPercent,
            FeeReturn: _se.refundAmount,
          }));
          return {
            DateCome: moment(it.startDate, "YYYYMMDD").format("DD/MM/YYYY"),
            DateLeave: moment(it.endDate, "YYYYMMDD").format("DD/MM/YYYY"),
            TripAddress: it.place,
            TripCode: it.code,
            name: t("RequestPayment", { id: it.requestHistoryID }),
            TotalRefund: it.totalRefund,
            isCreateMode: false,
            services: _services,
            requestHistory: {
              processStatusId: data.processStatusId == 5 ? 100 : data.processStatusId,
              approverId: data.approverId,
            },
            documentFileUrl: it.documentFileUrl,
          };
        });
        setRequests(_request);
        setYearSelected({
          value: data.requestInfo.year,
          label: data.requestInfo.year,
        });
        const freeNightNeedClaim = data.requestInfo.benefitRefundItem?.length > 0
        ? data.requestInfo.benefitRefundItem[0].freeNightsToClaim
        : 0;
        const discountNightNeedClaim = data.requestInfo.benefitRefundItem?.length > 0
        ? data.requestInfo.benefitRefundItem[0].discountNightsToClaim
        : 0;
        setQuota({
          ...quota,
          freeNightTotal: data.requestInfo.freeNightTotal,
          discountNightTotal: data.requestInfo.discountNightTotal,
          freeNightClaimed: data.requestInfo.freeNightClaimed - (data.processStatusId == 2 ? freeNightNeedClaim : 0),
          discountNightClaimed: data.requestInfo.discountNightClaimed - (data.processStatusId == 2 ? discountNightNeedClaim : 0),
          examTimesUseable: 0,
          examTimesUsed: 0,
          discountNightNeedClaim: discountNightNeedClaim,
          freeNightNeedClaim: freeNightNeedClaim,
        });
      }
    }
  }, [data]);
  return (
    <div
      className="registration-insurance-section input-style"
      style={{ marginTop: "-30px" }}
    >
      <PaymentUserInfo t={t} userInfo={userInfo} />

      {/* thông tin chế độ phúc lợi */}
      <PaymentBenefitInfo
        t={t}
        quota={quota}
        yearSelected={yearSelected}
        setYearSelected={() => {}}
        isCreateMode={false}
        options={[]}
      />

      {/* Dịch vụ nội bộ đã sử dung */}
      <h5 style={{ color: "#000000" }} className="mb-3">
        {t("WelfareServiceUsed")}
      </h5>
      {(requests || []).map((request: IPaymentRequest, index: number) => {
        return (
          <ServiceRequest
            key={index}
            t={t}
            request={request}
            isCreateMode={false}
            headerTitle={request.name}
            typeServices={[]}
            cancelRequest={() => {}}
            updateRequest={(req: IPaymentRequest) => {}}
          />
        );
      })}
      {props.action != "consent" && data.processStatusId === 5 ? (
        <DetailButtonComponent
          dataToSap={[
            {
              id: data.id,
              requestTypeId: Constants.WELFARE_REFUND,
              sub: [
                {
                  id: data.id,
                },
              ],
            },
          ]}
          isShowRevocationOfApproval={false}
          isShowApproval={data.processStatusId === Constants.STATUS_WAITING}
          isShowConsent={
            false
          }
          isShowRevocationOfConsent={
            false
          }
          id={data.id}
          urlName={"requestattendance"}
          requestTypeId={data.requestTypeId}
          action={props.action}
        />
      ) : null}
    </div>
  );
};

export default withTranslation()(InternalPaymentDetail);
