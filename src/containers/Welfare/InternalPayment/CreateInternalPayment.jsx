import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import ServiceRequest from "./ServiceRequest";
import IconAdd from "assets/img/ic-add-green.svg";
import { Image } from "react-bootstrap";

function CreateInternalPayment(props) {
  const { t } = props;
  const type = { label: t("RequestInternalPayment"), value: 1 };
  const userInfo = {},
    OPTIONS = [{ label: "test data", value: "aa" }];
  const [data, setData] = useState({});
  const [requests, setRequests] = useState([]);
  const [isAddMore, setIsAddMore] = useState(false);

  const handleTextInputChange = (e, key) => {};
  const handleChangeSelectInputs = (e, key) => {};
  const addMoreRequest = () => {
    if (isAddMore) return;
    setIsAddMore(true);
    setRequests([
      ...requests,
      {
        name: "yêu cầu " + (requests.length + 1),
        isDeleted: false,
        isCreateMode: true,
        services: [],
      },
    ]);
  };
  const cancelRequest = () => {
    if (isAddMore == false) return;
    setIsAddMore(false);
    const _requests = [...requests];
    _requests.splice(-1);
    setRequests(_requests);
  };

  const updateRequest = (index, request) => {
    const _request = [...requests];
    _request[index] = request;
    setRequests(_request);
  }

  const addMoreSevice = () => {
    const lastRequest = requests[requests.length - 1];
    lastRequest.services.push({
      name: "Dich vu " + (lastRequest.services.length + 1),
    });
    setRequests([...requests]);
  };
  

  return (
    <div className="registration-insurance-section">
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
      <h5 style={{ color: "#000000" }}>{t("ManagerInfo")}</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            {t("FullName")}
            <div className="detail1">{userInfo.fullName}</div>
          </div>
          <div className="col-4">
            {t("EmployeeNo")}
            <div className="detail1">{userInfo.socialId}</div>
          </div>
          <div className="col-4">
            {t("Grade")}
            <div className="detail1">{userInfo.IndentifiD}</div>
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {t("CompanyName")}
            <div className="detail1">{userInfo.employeeNo}</div>
          </div>

          <div className="col-4">
            {t("DepartmentManage")}
            <input
              type="text"
              value={data.leaveOfWeek}
              onChange={(e) => handleTextInputChange(e, "leaveOfWeek")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
          <div className="col-4">
            {t("Cost Center")}
            <div className="detail1">{userInfo.employeeNo}</div>
          </div>
        </div>
      </div>
      {/* thông tin chế độ phúc lợi */}
      <h5 style={{ color: "#000000" }}>{t("WelfareInfo")}</h5>
      <div className="box shadow cbnv">
        <div className="row">
          <div className="col-4">
            {t("lua_chon_nam")}
            <Select
              placeholder={t("option")}
              options={OPTIONS}
              isClearable={false}
              value={data.workingCondition}
              onChange={(e) => handleChangeSelectInputs(e, "workingCondition")}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
          <div className="col-4">
            {t("FreeNightNotClaim")}
            <input
              type="text"
              placeholder={t("import")}
              value={data.leaveOfWeek}
              onChange={(e) => handleTextInputChange(e, "leaveOfWeek")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
          <div className="col-4">
            {t("DepartmentManage")}
            <input
              type="text"
              placeholder={t("import")}
              value={data.leaveOfWeek}
              onChange={(e) => handleTextInputChange(e, "leaveOfWeek")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {t("FreeNightRemain")}
            <input
              type="text"
              placeholder={t("import")}
              value={data.leaveOfWeek}
              onChange={(e) => handleTextInputChange(e, "leaveOfWeek")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
          <div className="col-4">
            {t("DiscountNightNotClaim")}
            <input
              type="text"
              placeholder={t("import")}
              value={data.leaveOfWeek}
              onChange={(e) => handleTextInputChange(e, "leaveOfWeek")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
          <div className="col-4">
            {t("DiscountNightClaim")}
            <input
              type="text"
              placeholder={t("import")}
              value={data.leaveOfWeek}
              onChange={(e) => handleTextInputChange(e, "leaveOfWeek")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="row mv-10">
          <div className="col-4">
            {t("DiscountNightRemain")}
            <input
              type="text"
              placeholder={t("import")}
              value={data.leaveOfWeek}
              onChange={(e) => handleTextInputChange(e, "leaveOfWeek")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
          <div className="col-4">
            {t("FreeExamCanUse")}
            <input
              type="text"
              placeholder={t("import")}
              value={data.leaveOfWeek}
              onChange={(e) => handleTextInputChange(e, "leaveOfWeek")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
          <div className="col-4">
            {t("FreeExamUsed")}
            <input
              type="text"
              placeholder={t("import")}
              value={data.leaveOfWeek}
              onChange={(e) => handleTextInputChange(e, "leaveOfWeek")}
              className="form-control input mv-10 w-100"
              name="inputName"
              autoComplete="off"
            />
          </div>
        </div>
      </div>
      {/* Dịch vụ nội bộ đã sử dung */}
      <h5 style={{ color: "#000000" }}>{t("WelfareServiceUsed")}</h5>
      {(requests || []).map((request, index) => {
        return (
          <ServiceRequest
            key={index}
            index={index}
            t={t}
            request={request}
            isCreateMode={request.isCreateMode}
            headerTitle={request.name}
            cancelRequest={cancelRequest}
            addMoreSevice={addMoreSevice}
            updateRequest={req => updateRequest(index, req)}
          />
        );
      })}

      {isAddMore == false && (
        <button
          className="btn btn-success btn-lg w-fit-content mt-3 d-flex align-items-center"
          style={{ gap: "4px", fontSize: "14px" }}
          onClick={addMoreRequest}
        >
          <i
            className="fas fa-plus"
            style={{ fontSize: 12, fontWeight: 600 }}
          ></i>
          {t("AddService")}
        </button>
      )}
    </div>
  );
}

export default withTranslation()(CreateInternalPayment);
