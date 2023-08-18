import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import ServiceRequest from "./ServiceRequest";
import PaymentUserInfo from "./component/PaymentUserInfo";
import moment from "moment";
import { IDropdownValue } from "../../../models/CommonModel";
import {
  IPaymentRequest,
  IPaymentService,
  IPaymentUserInfo,
  IQuota,
  IResponseBenefitInfo,
  IResponseServices,
} from "../../../models/welfare/PaymentModel";
import PaymentBenefitInfo from "./component/PaymentBenefitInfo";
import PaymentActionButtons from "./component/PaymentActionButton";
import { getRequestConfigurations } from "commons/Utils";
import axios from "axios";
import { getPaymentObjects } from "./PaymentData";
import LoadingModal from "components/Common/LoadingModal";

function CreateInternalPayment(props: any) {
  const { t } = props;
  const type = { label: t("RequestInternalPayment"), value: 1 };
  const locale = localStorage.getItem("locale") == "vi-VN" ? "vi" : "en";
  //const OPTIONS = [{ label: "test data", value: "aa" }];
  const [data, setData] = useState({});
  const [requests, setRequests] = useState<IPaymentRequest[]>([]);
  const [newRequest, setNewRequest] = useState<IPaymentRequest | null>(null);
  const [isAddMore, setIsAddMore] = useState(false);
  const [userInfo, setUserInfo] = useState<IPaymentUserInfo>({});
  const [OPTIONS, setOPTIONS] = useState<IDropdownValue[]>([]);
  const [yearSelected, setYearSelected] = useState<
    IDropdownValue | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [typeServices, setTypeServices] = useState<IDropdownValue[]>([]);
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
    setUserInfo({
      fullName: localStorage.getItem("fullName") || "",
      employeeNo: localStorage.getItem("employeeNo") || "",
      companyName: localStorage.getItem("company") || "",
      departmentName: localStorage.getItem("department") || "",
      benefitLevel: localStorage.getItem("benefitLevel") || "",
      costCenter: localStorage.getItem("cost_center") || "",
      employeeEmail: localStorage.getItem("plEmail") || "",
    });
    const year = moment().year();
    setOPTIONS([
      { label: year, value: year },
      { label: year + 1, value: year + 1 },
      { label: year + 2, value: year + 2 },
    ]);
    setYearSelected({ label: year, value: year });
    initData(localStorage.getItem("companyCode") || "", year);
  }, []);

  const initData = async (companyCode: string, year: number) => {
    setLoading(true);
    const config = getRequestConfigurations();
    const benefitRefundInfoEndpoint = `${process.env.REACT_APP_REQUEST_URL}benefit-refund/info`;
    const benefitRefundServicesEndpoint = `${process.env.REACT_APP_REQUEST_URL}benefit-refund/services`;

    const benefitRefundInfo = axios.get(benefitRefundInfoEndpoint, {
      ...config,
      params: { year: year, culture: locale},
    });
    const benefitRefundServices = axios.get(benefitRefundServicesEndpoint, {
      ...config,
      params: { pnlCode: companyCode, culture: locale },
    });

    Promise.allSettled([benefitRefundInfo, benefitRefundServices])
      .then(
        axios.spread((...responses) => {
          let _typeServices: IDropdownValue[] = [];
          if (responses[1].status == "fulfilled") {
            const _benefitService: IResponseServices = responses[1].value?.data
              ?.data as IResponseServices;
            _typeServices = (_benefitService?.services || []).map((it) => {
              return {
                label: locale == "vi" ? it.serviceName : it.serviceNameEn,
                value: it.id,
              };
            });
            setTypeServices(_typeServices);
          }
          if (responses[0].status == "fulfilled") {
            processBenefitInfoResponse(
              responses[0].value?.data?.data as IResponseBenefitInfo,
              _typeServices
            );
          }
        })
      )
      .finally(() => {
        setLoading(false);
      });
  };

  const processBenefitInfoResponse = (
    _benefitInfo: IResponseBenefitInfo,
    listService: IDropdownValue[]
  ) => {
    const ObjectInfos = getPaymentObjects();
    setQuota({ ...quota, ..._benefitInfo.quota });
    const _requestInfo = _benefitInfo.info;
    if (!_requestInfo) return;
    const _request: IPaymentRequest[] = (
      _requestInfo.benefitRefundItem || []
    ).map((it) => {
      const _services: IPaymentService[] = (it.benefitRefundService || []).map(
        (_se, index) => ({
          DateUse: moment(_se.date, "YYYYMMDD").format("DD/MM/YYYY"),
          UseWelfareType: listService.find(
            (_type) => _type.value == _se.serviceTypeId
          ),
          UseFor: ObjectInfos.find((_us) => _us.value == _se.userType),
          FeePayment: _se.amountPaid,
          FeeUpgrade: _se.upgradeRoomFee,
          name: t('ServicePayment', {id: index + 1}),
          Detail: _se.detail,
          PnlDiscountPercent: _se.pnlDiscountPercent,
          QuotedPrice: _se.quotedPrice,
          FeeBenefit: _se.benefitDiscountPercent,
          FeeReturn: _se.refundAmount
        })
      );
      return {
        DateCome: moment(it.startDate, "YYYYMMDD").format("DD/MM/YYYY"),
        DateLeave: moment(it.endDate, "YYYYMMDD").format("DD/MM/YYYY"),
        TripAddress: it.place,
        TripCode: it.code,
        name: t('RequestPayment', {id: it.requestHistoryID}),
        TotalRefund: it.totalRefund,
        isCreateMode: false,
        services: _services,
      };
    });
    setRequests(_request);
  };

  const onYearChange = async (yearDropDown: IDropdownValue) => {
    setLoading(true);
    const config = getRequestConfigurations();
    const benefitRefundInfoEndpoint = `${process.env.REACT_APP_REQUEST_URL}benefit-refund/info`;
    try {
      const result = await axios.get(benefitRefundInfoEndpoint, {
        params: {
          year: yearDropDown.value,
          culture: locale
        },
        ...config,
      });
      if (result.data?.data) {
        const _benefitInfo: IResponseBenefitInfo = result.data.data;
        setQuota({ ...quota, ..._benefitInfo.quota });
      }
      setYearSelected(yearDropDown);
    } catch (err) {
      console.log("onYearChange api fail");
    } finally {
      setLoading(false);
    }
  };

  const addMoreRequest = () => {
    if (isAddMore) return;
    setIsAddMore(true);
    setNewRequest({
      name: t('NewRequest'),
      isDeleted: false,
      isCreateMode: true,
      services: [],
    });
  };
  const cancelRequest = () => {
    if (isAddMore == false) return;
    setIsAddMore(false);
    setNewRequest(null);
    setFiles([]);
  };

  const updateRequest = (request: IPaymentRequest) => {
    setNewRequest(request);
  };

  const handleSubmit = () => {
    //TODO handle submit new request
  };

  return (
    <div className="registration-insurance-section input-style">
      <LoadingModal show={loading}/>
      {/* loại yêu cầu */}
      <h5 style={{ color: "#000000" }}>{t("QUẢN LÝ YÊU CẦU")}</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-12">
            {t("TypeOfRequest")}
            <Select
              options={[type]}
              isClearable={false}
              value={type}
              isDisabled={true}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
        </div>
      </div>
      {/* Thông tin CBLĐ */}
      <PaymentUserInfo t={t} userInfo={userInfo} />
      {/* thông tin chế độ phúc lợi */}
      <PaymentBenefitInfo
        t={t}
        data={data}
        quota={quota}
        yearSelected={yearSelected}
        setYearSelected={onYearChange}
        isCreateMode={true}
        options={OPTIONS}
      />

      {/* Dịch vụ nội bộ đã sử dung */}
      <h5 style={{ color: "#000000" }}>{t("WelfareServiceUsed")}</h5>
      {(requests || []).map((request: IPaymentRequest, index: number) => {
        return (
          <ServiceRequest
            key={index}
            t={t}
            request={request}
            isCreateMode={false}
            headerTitle={request.name}
            typeServices={typeServices}
            cancelRequest={cancelRequest}
            updateRequest={(req: IPaymentRequest) => updateRequest(req)}
          />
        );
      })}

      <div className="mv-10"></div>
      {isAddMore && newRequest ? (
        <>
          <ServiceRequest
            t={t}
            request={newRequest}
            isCreateMode={true}
            headerTitle={newRequest.name}
            typeServices={typeServices}
            cancelRequest={cancelRequest}
            updateRequest={(req: IPaymentRequest) => updateRequest(req)}
          />
          <PaymentActionButtons
            errors={{}}
            t={t}
            sendRequests={() => handleSubmit()}
            updateFilesToParent={(_files) => {
              setFiles(_files);
            }}
          />
        </>
      ) : (
        <button
          className="btn btn-success btn-lg w-fit-content mt-3 d-flex align-items-center"
          style={{ gap: "4px", fontSize: "14px" }}
          onClick={addMoreRequest}
        >
          <i
            className="fas fa-plus"
            style={{ fontSize: 12, fontWeight: 600 }}
          ></i>
          {t("AddRequest")}
        </button>
      )}
    </div>
  );
}

export default withTranslation()(CreateInternalPayment);
