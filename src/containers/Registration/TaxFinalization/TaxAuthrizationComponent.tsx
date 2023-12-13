import { TaxAuthorizationOptions } from "containers/Registration/TaxFinalization/TaxConstants";
import React from "react";
import IconDatePicker from "assets/img/icon/Icon_DatePicker.svg";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from "moment";
import { ITaxInfoModel } from "./TaxModel.types";

interface ITaxAuthrizationComponent {
  isCreateMode: boolean;
  t: any;
  data: ITaxInfoModel;
  errors: any;
  setData: Function;
  handleTextInputChange: Function;
}
const TaxAuthrizationComponent = ({
  t,
  data,
  setData,
  handleTextInputChange,
  isCreateMode,
  errors,
}: ITaxAuthrizationComponent) => {
  return (
    <>
      <div className="d-flex flex-row">
        <span className="d-flex flex-row align-items-center">
          <input
            type="radio"
            id={"action_accept" + TaxAuthorizationOptions.AUTHORIZE_TAX}
            name={"action" + TaxAuthorizationOptions.AUTHORIZE_TAX}
            checked={data.typeRequest == TaxAuthorizationOptions.AUTHORIZE_TAX}
            onChange={(e) => {
              setData({
                ...data,
                typeRequest: TaxAuthorizationOptions.AUTHORIZE_TAX,
              });
            }}
          />
          <label
            htmlFor={"action_accept" + TaxAuthorizationOptions.AUTHORIZE_TAX}
            className="ml-1"
          >
            {t("uy_quyen_thue")}
          </label>
        </span>
        <div className="mr-3" />
        <span className="d-flex flex-row align-items-center">
          <input
            type="radio"
            id={"action_accept" + TaxAuthorizationOptions.EXPOSE_TAX}
            name={"action" + TaxAuthorizationOptions.EXPOSE_TAX}
            checked={data.typeRequest == TaxAuthorizationOptions.EXPOSE_TAX}
            onChange={(e) => {
              setData({
                ...data,
                typeRequest: TaxAuthorizationOptions.EXPOSE_TAX,
              });
            }}
          />
          <label
            htmlFor={"action_accept" + TaxAuthorizationOptions.EXPOSE_TAX}
            className="ml-1"
          >
            {t("xuat_chung_tu_thue")}
          </label>
        </span>
      </div>

      {data.typeRequest == TaxAuthorizationOptions.EXPOSE_TAX ? (
        <>
          <div
            className="w-100 "
            style={{
              height: "1px",
              width: "100%",
              backgroundColor: "#DEE2E6",
              margin: "12px 0",
            }}
          ></div>
          <div className="row mv-10">
            <div className="col-6">
              {"Email"} <span className="required">(*)</span>
              <input
                type="text"
                value={data?.email || ""}
                onChange={(e) => handleTextInputChange(e, "email")}
                className="form-control input mv-10 w-100"
                name="email"
                autoComplete="off"
                maxLength={255}
                disabled={!isCreateMode}
              />
              {errors["email"] ? (
                <p className="text-danger">{errors["email"]}</p>
              ) : null}
            </div>
            <div className="col-6">
              {t("noi_nhan_chung_tu")} <span className="required">(*)</span>
              <input
                type="text"
                value={data?.address || ""}
                onChange={(e) => handleTextInputChange(e, "address")}
                className="form-control input mv-10 w-100"
                name="address"
                autoComplete="off"
                maxLength={255}
                disabled={!isCreateMode}
              />
              {errors["address"] ? (
                <p className="text-danger">{errors["address"]}</p>
              ) : null}
            </div>
          </div>
          <div className="row mv-10">
            <div className="col-4">
              {t("IdNo")} <span className="required">(*)</span>
              <input
                type="text"
                value={data?.idNumber || ""}
                onChange={(e) => handleTextInputChange(e, "idNumber")}
                className="form-control input mv-10 w-100"
                name="idNumber"
                autoComplete="off"
                maxLength={255}
                disabled={!isCreateMode}
              />
              {errors["idNumber"] ? (
                <p className="text-danger">{errors["idNumber"]}</p>
              ) : null}
            </div>
            <div className="col-2">
              {t("DateIssue")} <span className="required">(*)</span>
              <div className="content input-container">
                <label style={{ position: "relative" }}>
                  <DatePicker
                    name="endDate"
                    selectsEnd
                    autoComplete="off"
                    selected={
                      data.dateIssue
                        ? moment(data.dateIssue, "DD/MM/YYYY").toDate()
                        : undefined
                    }
                    onChange={(date) => {
                      if(date) {
                        setData({
                          ...data,
                          dateIssue: moment(date).format("DD/MM/YYYY"),
                        });
                      }
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={t("Select")}
                    locale={t("locale")}
                    className="form-control input"
                    disabled={!isCreateMode}
                  />
                  <span className="input-group-addon input-img">
                    <img src={IconDatePicker} alt="Date" />
                  </span>
                </label>
                {errors["dateIssue"] ? (
                  <p className="text-danger">{errors["dateIssue"]}</p>
                ) : null}
              </div>
            </div>
            <div className="col-6">
              {t("PlaceIssue")} <span className="required">(*)</span>
              <input
                type="text"
                value={data?.placeIssue || ""}
                onChange={(e) => handleTextInputChange(e, "placeIssue")}
                className="form-control input mv-10 w-100"
                name="placeIssue"
                autoComplete="off"
                maxLength={255}
                disabled={!isCreateMode}
              />
              {errors["placeIssue"] ? (
                <p className="text-danger">{errors["placeIssue"]}</p>
              ) : null}
            </div>
          </div>
        </>
      ) : null}

      <div
        className="w-100 "
        style={{
          height: "1px",
          width: "100%",
          backgroundColor: "#DEE2E6",
          margin: "12px 0",
        }}
      ></div>

      <div className="d-flex flex-row">
        <span>{t("tax_document_guide")} </span>
        <span style={{ width: "5px" }} />
        <a href="#">{t("Here")}</a>.
      </div>
    </>
  );
};

export default TaxAuthrizationComponent;
