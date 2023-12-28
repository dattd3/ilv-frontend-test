import React, { useState } from "react";
import axios from "axios";
import TaxFormSearchComponent from "./SearchBlock/TaxFormSearchComponent";
import LoadingModal from "../../components/Common/LoadingModal";
import TaxInformationComponent from "./ResultBlock/TaxInfomationComponent";

interface IPaySlipsComponent {
  t: any;
  acessToken: string | null;
  setacessToken: Function;
}
const TaxReviewComponent = (props: IPaySlipsComponent) => {
  const { t, acessToken, setacessToken } = props;
  const [payslip, setpayslip] = useState<any>(null);
  const [isSearch, setisSearch] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const handleSubmitSearch = (month = 9, year) => {
    setisSearch(false);
    setisLoading(true);
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
    bodyFormData.append("PayslipAuth", acessToken || "");
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

  return (
    <>
      <LoadingModal show={isLoading} />
      <div className="payslips-section">
        <h1 className="content-page-header">{t("quyet_toan_thue")}</h1>
        <div className="card shadow-customize mb-4">
          <div className="card-body">
            <TaxFormSearchComponent search={handleSubmitSearch} />
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
        {isSearch && acessToken && payslip ?
         (
          <>
            <div className="block-buttons">
              <div className="result-block" id="result-block">
                <div className="other-result-section">
                  <TaxInformationComponent
                    payslip={payslip}
                  />
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default TaxReviewComponent;
