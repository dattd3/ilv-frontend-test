import React, { useState } from "react";
import Select from 'react-select'
import { withTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import { checkVersionPnLSameAsVinhome } from "../../../../commons/commonFunctions";
import Constants from "../../../../commons/Constants";

const ProposalManagement = (props) => {
  const { t } = props;
  const [type, setType] = useState(null);
  const InsuranceOptions = [
  ];
  if(checkVersionPnLSameAsVinhome(Constants.MODULE.DEXUATLUONG)) {
    InsuranceOptions.push({ value: 1, label: t('SalaryAdjustmentPropse')});
  }
  if(checkVersionPnLSameAsVinhome(Constants.MODULE.DIEUCHUYEN)) {
    InsuranceOptions.push({ value: 2, label: t('ProposalTransfer') });
  }
  if(checkVersionPnLSameAsVinhome(Constants.MODULE.NGHIVIEC)) {
    InsuranceOptions.push({ value: 3, label: t('ProposeForEmployeesResignation') });
  }

  const handleChangeType = (e) => {
    setType(e)
    if (e.value === 1) {
      props.history.push(`/salaryadjustment/create/request`)
    } else if(e.value === 2) {
      props.history.push(`/transfer-appoint/create/request`)
    } else if(e.value === 3) {
      props.history.push(`/proposed-resignation`)
    }
  }

  return (
    <div className="timesheet-section proposal-management">
      <h1 className="content-page-header">{t("CreateProposal")}</h1>
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