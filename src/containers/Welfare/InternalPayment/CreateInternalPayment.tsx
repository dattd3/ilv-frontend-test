import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import ServiceRequest from "./ServiceRequest";
import PaymentUserInfo from "./component/PaymentUserInfo";
import moment from "moment";
import { IDropdownValue } from "../../../models/CommonModel";
import {
  IPaymentRequest,
  IPaymentUserInfo,
} from "../../../models/welfare/PaymentModel";
import PaymentBenefitInfo from "./component/PaymentBenefitInfo";
import PaymentActionButtons from "./component/PaymentActionButton";

function CreateInternalPayment(props: any) {
  const { t } = props;
  const type = { label: t("RequestInternalPayment"), value: 1 };
  //const OPTIONS = [{ label: "test data", value: "aa" }];
  const [data, setData] = useState({});
  const [requests, setRequests] = useState([
    {
      name: "yêu cầu 1",
      services: [],
    },
  ]);
  const [newRequest, setNewRequest] = useState<IPaymentRequest | null>(null);
  const [isAddMore, setIsAddMore] = useState(false);
  const [userInfo, setUserInfo] = useState<IPaymentUserInfo>({});
  const [OPTIONS, setOPTIONS] = useState<IDropdownValue[]>([]);
  const [yearSelected, setYearSelected] = useState<
    IDropdownValue | undefined
  >();
  const [files, setFiles] = useState<any[]>([]);

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
  }, []);

  const addMoreRequest = () => {
    if (isAddMore) return;
    setIsAddMore(true);
    setNewRequest({
      name: "yêu cầu " + (requests.length + 1),
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
  }

  return (
    <div className="registration-insurance-section input-style">
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
        yearSelected={yearSelected}
        setYearSelected={setYearSelected}
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
            isCreateMode={request.isCreateMode || false}
            headerTitle={request.name}
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
            cancelRequest={cancelRequest}
            updateRequest={(req: IPaymentRequest) => updateRequest(req)}
          />
          <PaymentActionButtons
            errors={{}}
            t={t}
            sendRequests={() => handleSubmit()}
            updateFilesToParent={(_files) => {setFiles(_files)}}
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
