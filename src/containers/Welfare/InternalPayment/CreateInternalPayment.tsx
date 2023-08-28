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
import StatusModal from 'components/Common/StatusModal'
import _ from 'lodash';
import { toast } from "react-toastify";
import Constants from 'commons/Constants'
import HOCComponent from "components/Common/HOCComponent";

function CreateInternalPayment(props: any) {
  const { t, year} = props;
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
  const [statusModal, setStatusModal] = useState({
    isShowStatusModal: false,
    content: '',
    isSuccess: false
  })
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
    const _year = 2023;
    setOPTIONS([
      { label: _year, value: _year },
      { label: _year + 1, value: _year + 1 },
      { label: _year + 2, value: _year + 2 },
    ]);
    setYearSelected({label: year || moment().year(), value: year || moment().year()});
    initData(localStorage.getItem("companyCode") || "", year || moment().year());
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
                code: it.serviceCode
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
    if (!_requestInfo) {
      setRequests([]);
      return;
    }
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
        requestHistory: it.requestHistory,
        documentFileUrl: it.documentFileUrl
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
        processBenefitInfoResponse(_benefitInfo, typeServices);
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
      TotalRefund: 0,
      services: [
        {
          name: t("ServicePayment", { id: 1 }),
          FeeBenefit: 0,
        }
      ],
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
    let nightFree = 0, nightDiscount = 0;
    request.services.map(ser => {
      if(ser.Detail == 'LT') {
        nightFree += ser.FeeBenefit == 100 ? 1 : 0;
        nightDiscount += ser.FeeBenefit < 100 && ser.FeeBenefit > 0 ? 1 : 0;
      }
    })
    if(quota.discountNightNeedClaim != nightDiscount || quota.freeNightNeedClaim != nightFree) {
      const _qouta: IQuota = {...quota, discountNightNeedClaim: nightDiscount, freeNightNeedClaim: nightFree};
      setQuota(_qouta);
    }
  };

  const verifyError= () => {
    const candidateInfos = { ...newRequest };
    const requireFieldRequest = [
      "DateLeave",
      "DateCome",
      "TripCode",
    ];
    const requiredFields = [
      "FeePayment",
      "UseFor",
      "UseWelfareType",
      "DateUse",
    ];
    const notCheckServices: number[] = [];
    const optionFields = ["UseWelfareType", "UseFor"];
    let _error: string | null = null;
    (candidateInfos.services || []).map((ser, index) => {
      requiredFields.forEach((name) => {
        if (
          _.isEmpty(ser[name]) ||
          (!ser[name].value && optionFields.includes(name))
        ) {
          _error = t('PleaseEnter') + ' ' + t(name) + ` (${ser.name})`;
        }
      });
      if(!ser.Detail) {
        notCheckServices.push(index + 1);
      }
      if(candidateInfos.DateCome && candidateInfos.DateLeave && ser.DateUse) {
        let compareDate = moment(ser.DateUse, "DD/MM/YYYY").format('YYYYMMDD');
        let startDate   = moment(candidateInfos.DateCome, "DD/MM/YYYY").format('YYYYMMDD');
        let endDate     = moment(candidateInfos.DateLeave, "DD/MM/YYYY").format('YYYYMMDD');
        if(compareDate < startDate || compareDate > endDate) {
          _error = t('outDateRange', {name: ser.name});
        }
      }
    });
    if(_error == null && notCheckServices.length > 0) {
      _error = t('notCheckPayment', {id: notCheckServices.join(',')})
    }

    requireFieldRequest.forEach((name) => {
      if (
        _.isEmpty(candidateInfos[name]) ||
        (!candidateInfos[name].value && optionFields.includes(name))
      ) {
        _error = t('PleaseEnter') + ' ' + t(name);
      }
    });
    return _error;
  };

  const notifyMessage = (message, isError = true) => {
    if (isError) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const handleSubmit = () => {
    const message = verifyError();
    if(message) {
      notifyMessage(message);
      return;
    }
    
    const _services = newRequest?.services.map(item => {
      return {
        date:                   moment(item.DateUse, 'DD/MM/YYYY').format('YYYYMMDD'),
        serviceTypeId:          item .UseWelfareType?.value,
        userType:               item.UseFor?.value,
        amountPaid:             item.FeePayment || 0,
        upgradeRoomFee:         item.FeeUpgrade || 0,
        detail:                 item.Detail || '',
        quotedPrice:            item.QuotedPrice || 0,
        pnlDiscountPercent:     item.PnlDiscountPercent || 0,
        benefitDiscountPercent: item.FeeBenefit || 0,
        refundAmount:           item.FeeReturn || 0
      }
    });
    const _requestInfo = {
      year:              yearSelected?.value,
      freeNightsToClaim: quota.freeNightNeedClaim || 0,
      discountNightsToClaim: quota.discountNightNeedClaim || 0,
      code:              newRequest?.TripCode || '',
      startDate:         moment(newRequest?.DateCome, 'DD/MM/YYYY').format('YYYYMMDD'),
      endDate:           moment(newRequest?.DateLeave, 'DD/MM/YYYY').format('YYYYMMDD'),
      totalRefund:       newRequest?.TotalRefund,
      place:             newRequest?.TripAddress || '',
      services:          _services
    }
    const formData = new FormData();
    formData.append("divisionId", localStorage.getItem("divisionId") || '');
    formData.append("division", localStorage.getItem("division") || '');
    formData.append("regionId", localStorage.getItem("regionId") || '');
    formData.append("region", localStorage.getItem("region") || '');
    formData.append("unitId", localStorage.getItem("unitId") || '');
    formData.append("unit", localStorage.getItem("unit") || '');
    formData.append("partId", localStorage.getItem("partId") || '');
    formData.append("part", localStorage.getItem("part") || '');
    formData.append("companyCode", localStorage.getItem("companyCode") || '')
    formData.append("benefitRank", localStorage.getItem("benefitLevel") || '');
    formData.append('requestInfo', JSON.stringify(_requestInfo));
    files.forEach(file => {
      formData.append('files', file)
    })
    setLoading(true);
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_REQUEST_URL}Request/benefit-refund`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `${localStorage.getItem('accessToken')}` }
  })
  .then(response => {
      setLoading(false);
      if (response && response.data && response.data.result && response.data.result.code != Constants.API_ERROR_CODE) {
          setStatusModal({
            isShowStatusModal: true,
            content: t("RequestSent"),
            isSuccess: true
          });
      }
      else {
          setStatusModal({
            isShowStatusModal: true,
            content: response.data.result.message || '',
            isSuccess: false
          });
      }
  })
  .catch(error => {
    console.log(error);
      let message = t("Error")
      if (error?.response?.data?.result?.code == Constants.API_ERROR_CODE) {
        message = error?.response?.data?.result?.message
      }
      setStatusModal({
        isShowStatusModal: true,
        content: message,
        isSuccess: false
      });
  })
  .finally(() => {
      setLoading(false);
  })
  };

  const hideStatusModal = () => {
    if(statusModal.isSuccess == true) {
      window.location.reload();
    } else {
      setStatusModal({
        ...statusModal,
        isShowStatusModal: false
      });
    }
  }

  return (
    <div className="registration-insurance-section input-style">
      <LoadingModal show={loading}/>
      <StatusModal show={statusModal.isShowStatusModal} content={statusModal.content} isSuccess={statusModal.isSuccess} onHide={hideStatusModal} />
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
      <h5 style={{ color: "#000000" }} className="mb-3">{t("WelfareServiceUsed")}</h5>
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
            setLoading={setLoading}
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

export default HOCComponent(withTranslation()(CreateInternalPayment));
