import React, { useState } from 'react';
import Select from 'react-select';
import { withTranslation } from 'react-i18next';
import Constants from '../../../commons/Constants';
import { checkVersionPnLSameAsVinhome } from '../../../commons/commonFunctions';

const RegistrationManagement = (props) => {
  const { t } = props,
    InsuranceOptions = [
      // ...(checkVersionPnLSameAsVinhome(Constants.MODULE.DEXUATLUONG)
      //   ? [{ value: 1, label: t('SalaryAdjustmentPropse') }]
      //   : []),
      ...(checkVersionPnLSameAsVinhome(Constants.MODULE.DIEUCHUYEN)
        ? [{ value: 2, label: t('RequestTransfer') }]
        : []),
      ...(checkVersionPnLSameAsVinhome(Constants.MODULE.NGHIVIEC)
        ? [{ value: 3, label: t('RequestContractTermination') }]
        : []),
      ...(checkVersionPnLSameAsVinhome(Constants.MODULE.THANHTOAN_NOIBO)
        ? [{ value: 4, label: t('RequestInternalPayment') }]
        : []),
      {value: 5, label: t('quyet_toan_thue')}
    ];
  const [type, setType] = useState(null);

  const handleChangeType = (e) => {
    setType(e);
    switch (e.value) {
      case 1:
      default:
        props.history.push(`/registration-salary-adjustment/create/request`);
        break;
      case 2:
        props.history.push(`/registration-transfer/create/request`);
        break;
      case 3:
        props.history.push(`/registration-employment-termination`);
        break;
      case 4:
        props.history.push('/benefit-claim-request');
        break;
      case 5: 
        props.history.push('/register-tax-finalization');
        break;
    }
  };

  return (
    <div className="timesheet-section proposal-management request-management">
      <h1 className="content-page-header">{t('Menu_RequestManage')}</h1>
      <div className="filter-box shadow-customize">
        <div className="row">
          <div className="col-12">
            <div className="title">{t('TypeOfRequest')}</div>
            <Select
              placeholder={t('Select')}
              options={InsuranceOptions}
              isClearable={false}
              value={type}
              onChange={handleChangeType}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(RegistrationManagement);
