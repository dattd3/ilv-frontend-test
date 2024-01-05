import { TaxAuthorizationOptions, getTaxAuthrizationOptions, getTaxIncomeOptions } from "containers/Registration/TaxFinalization/TaxConstants";
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
  templates: any;
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
  templates = {}
}: ITaxAuthrizationComponent) => {
  const linkTemplate = templates[data.typeRequest?.value];
  const taskAvaible = localStorage.getItem('taxEnable')?.startsWith('true') == true ? localStorage.getItem('taxEnable')!.split('_') : [0,0,0];
  return (
    <>
      <div className="d-flex flex-row">
        {
          getTaxAuthrizationOptions(t).map((option, index) => (
            <React.Fragment key={index}>
              <span className="d-flex flex-row align-items-center">
              <input
                type="radio"
                id={"action_accept" + option.value}
                name={"action" + option.value}
                disabled={taskAvaible[index + 1] != '1'}
                checked={data.typeRequest?.value == option.value}
                onChange={(e) => {
                  setData({
                    ...data,
                    typeRequest: option
                  });
                }}
              />
              <label
                htmlFor={"action_accept" + option.value}
                className="ml-1"
              >
                {option.label}
              </label>
            </span>
            <div className="mr-3" />
            </React.Fragment>
          ))
        }
      </div>
      {errors["typeRequest"] ? (
          <p className="text-danger">{errors["typeRequest"]}</p>
        ) : null}

      {
      data.typeRequest?.value == TaxAuthorizationOptions.AUTHORIZE_TAX ? (
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
          <div >
            {
              getTaxIncomeOptions(t).map((option, index) => (
                <div key={index} className="row mv-10 mx-4">
                  <span className="d-flex flex-col align-items-center">
                  <input
                    type="radio"
                    id={"action_income_accept" + option.value}
                    name={"action_income" + option.value}
                    checked={data.incomeType?.value == option.value}
                    onChange={(e) => {
                      setData({
                        ...data,
                        incomeType: option
                      });
                    }}
                  />
                  <label
                    htmlFor={"action_income_accept" + option.value}
                    className="ml-1"
                  >
                    {option.label}
                  </label>
                </span>
                </div>
              ))
            }
            {errors["incomeType"] ? (
              <p className="text-danger">{errors["incomeType"]}</p>
            ) : null}
          </div>
        </>
      ) : 
      data.typeRequest?.value == TaxAuthorizationOptions.EXPOSE_TAX ? (
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
              {t('email_nhan_chung_tu')} <span className="required">(*)</span>
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
        <a href={linkTemplate} target="_blank">{t("Here")}</a>.
      </div>
    </>
  );
};

export default TaxAuthrizationComponent;
