import React, { useState } from "react";
import Select from 'react-select'
import { withTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";

const ProposalManagement = (props) => {
  const { t } = props;
  const [type, setType] = useState(null);
  const InsuranceOptions = [
    { value: 1, label: 'Đề xuất Điều chỉnh thu nhập' },
  ];

  const handleChangeType = (e) => {
    setType(e)
    if (e.value === 1) {
      props.history.push(`/salary-adjustment-propse/create`)
    }
  }

  return (
    <div className="timesheet-section proposal-management">
      <h1 className="content-page-header">{t("MenuProposalManagement")}</h1>
      <div className="timesheet-box shadow">
        <div className="row">
          <div className="col-12">
            <div className="title">{t("TypeOfRequest")}</div>
            <Select placeholder={t("Select")}
              options={InsuranceOptions}
              isClearable={false}
              value={type}
              onChange={e => handleChangeType(e)} className="input mv-10"
              styles={{ menu: provided => ({ ...provided, zIndex: 2 }) }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(ProposalManagement);