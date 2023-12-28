import React, { useState } from "react";
import axios from "axios";
import FormSearchComponent from "./SearchBlock/FormSearchComponent";
import MainResultComponent from "./ResultBlock/MainResultComponent";
import IncomeComponent from "./ResultBlock/IncomeComponent";
import WorkingInformationComponent from "./ResultBlock/WorkingInformationComponent";
import LeaveInformationComponent from "./ResultBlock/LeaveInformationComponent";
import LoadingModal from "../../components/Common/LoadingModal";
import { exportToPDF } from "../../commons/Utils";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

interface IPaySlipsComponent {
    t: any;
    acessToken: string | null;
    setacessToken: Function
}
const PaySlipsComponent = (props: IPaySlipsComponent) => {
  const { t, acessToken, setacessToken } = props;
  const [payslip, setpayslip] = useState<any>(null);
  const [isSearch, setisSearch] = useState(false);
  const [currencySelected, setcurrencySelected] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const handleSubmitSearch = (month, year, currency) => {
    setisSearch(false);
    setisLoading(true);
    setcurrencySelected(currency);
    const config = {
      headers: {
        Authorization: `${localStorage.getItem("accessToken")}`,
        "Content-Type": "multipart/form-data",
        // "Accept-Language": "en-US,en;"
      },
    };

    let bodyFormData = new FormData();
    bodyFormData.append("month", month < 10 ? `0${month}` : `${month}`);
    bodyFormData.append("year", `${year}`);
    bodyFormData.append("PayslipAuth", acessToken || '');
    bodyFormData.append("pernr", `${localStorage.getItem("employeeNo")}`);
    bodyFormData.append(
      "companyCode",
      `${localStorage.getItem("companyCode")}`
    );

    axios
      .post(
        `${process.env.REACT_APP_REQUEST_URL}user/payslip`,
        bodyFormData,
        config
      )
      .then((res) => {
        if (res && res.data && res.data.data && res.data.data.payslips) {
          const paySlipInfos = res.data.data.payslips[0];
          setpayslip(paySlipInfos);
          setisSearch(true);
        } else if (res && res.data && res.data.data.error == "Invalid token.") {
          //this.setState({ acessToken: null, payslip: null, isSearch: false });
          setacessToken(null);
          setpayslip(null);
          setisSearch(false);
        } else {
          setpayslip(null);
          setisSearch(true);
        }
      })
      .catch((error) => {})
      .finally(() => {
        setisLoading(false);
      });
  };

  const downloadPDF = () => {
    const elementView = document.getElementById("result-block");
    exportToPDF(elementView, "payslip");
  };

  return (
    <>
      <LoadingModal show={isLoading} />
      <div className="payslips-section">
        <h1 className="content-page-header">{t("PaySlip")}</h1>
        <div className="card shadow-customize mb-4">
          <div className="card-body">
            <FormSearchComponent search={handleSubmitSearch} />
            {isSearch && !payslip && (
              <p
                className="text-danger"
                style={{ marginTop: 15, marginBottom: 0 }}
              >
                {t("NoDataFound")}
              </p>
            )}
          </div>
        </div>
        {isSearch && acessToken && payslip ? (
          <>
            <div className="block-buttons">
              <button
                className="btn-download download-pdf"
                onClick={downloadPDF}
              >
                {t("DownloadPDF")}
              </button>
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="btn btn-link pull-right download-excel"
                table="payslip-download"
                filename="SalaryInformation"
                sheet="SalaryInformation"
                buttonText={t("DownloadExcel")}
              />
            </div>
            <div className="result-block" id="result-block">
              <div className="card mb-4">
                <div className="card-body">
                  <MainResultComponent
                    personalInformation={payslip?.personal_information}
                  />
                </div>
              </div>
              <div className="other-result-section">
                <WorkingInformationComponent
                  payslip={payslip}
                  currencySelected={currencySelected}
                />
                <LeaveInformationComponent payslip={payslip} />
                <IncomeComponent
                  payslip={payslip}
                  currencySelected={currencySelected}
                />
              </div>
            </div>
            <div className="block-buttons">
              <button
                className="btn-download download-pdf"
                onClick={downloadPDF}
              >
                {t("DownloadPDF")}
              </button>
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="btn btn-link pull-right download-excel"
                table="payslip-download"
                filename="SalaryInformation"
                sheet="SalaryInformation"
                buttonText={t("DownloadExcel")}
              />
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default PaySlipsComponent;
