import React, { useState } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import { ReactComponent as IconFilter } from "assets/img/ic-filter.svg";
import HOCComponent from "components/Common/HOCComponent";
import CustomPaging from "components/Common/CustomPagingNew";

const filterPlaceholder = (text) => (
  <div>
    <span className="icon-filter">
      <IconFilter />
    </span>
    {text}
  </div>
);

function TargetManagement() {
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [openMenuRegistration, setOpenMenuRegistration] = useState(false);

  const { t } = useTranslation();

  return (
    <div className="target-management-page">
      <div className="menu-btns">
        <Button className="button primary-button">{t("Request")}</Button>
        <Button className="button">{t("Menu_Task_Approval")}</Button>
      </div>
      <div className="filter-container">
        <div className="menu-registration-container">
          <Button
            className="button add-button"
            variant="info"
            onClick={() => {
              setOpenMenuRegistration(!openMenuRegistration);
            }}
          >
            + {t("TargetRegistration")}
          </Button>
          {openMenuRegistration && (
            <div
              className="menu-registration"
            >
              <div className="menu-registration-option">{t('TargetRegistrationManual')}</div>
              <div className="menu-registration-option">{t('TargetRegistrationLibrary')}</div>
            </div>
          )}
        </div>
        <Select
          className="select-container"
          classNamePrefix="filter-select"
          placeholder={filterPlaceholder(t("AssessmentPeriod"))}
        />
        <Select
          className="select-container"
          classNamePrefix="filter-select"
          placeholder={filterPlaceholder(t("Status"))}
        />
        <Button className="button search-button" variant="warning">
          {t("Search")}
        </Button>
      </div>
      <div className="table-title">{t("MenuTargetManagement")}</div>
      <div className="table-container">
        <table className="table table-borderless">
          <thead>
            <tr>
              <th>{t("RequestNo")}</th>
              <th>{t("RegistrationType")}</th>
              <th>{t("AssessmentPeriod")}</th>
              <th>{t("Requestor")}</th>
              <th>{t("ADCode")}</th>
              <th>{t("Status")}</th>
              <th>{t("Reason")}</th>
              <th>{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
              <td>7</td>
            </tr>
          </tbody>
        </table>
        <div className="table-footer">
          <CustomPaging
            onChangePageSize={(page) => {
              setPageSize(page);
            }}
            onChangePageIndex={(size) => {
              setPageIndex(size);
            }}
            totalRecords={totalRecords}
            pageSize={pageSize}
            pageIndex={pageIndex}
          />
        </div>
      </div>
    </div>
  );
}

export default HOCComponent(TargetManagement);
