import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import { ReactComponent as IconFilter } from "assets/img/ic-filter.svg";
import { ReactComponent as IconReason } from "assets/img/ic-reason.svg";
import { ReactComponent as IconRemove } from "assets/img/icon-delete.svg";
import { ReactComponent as IconEdit } from "assets/img/Icon-edit-2.svg";

import HOCComponent from "components/Common/HOCComponent";
import CustomPaging from "components/Common/CustomPagingNew";
import { getRequestConfigurations } from "commons/Utils";
import LoadingModal from "components/Common/LoadingModal";
import RegisterTargetFromLibraryModal from './RegisterTargetFromLibraryModal'
import { STATUS_DELETEABLE, STATUS_EDITABLE, TABS, CHECK_PHASE_LIST_ENDPOINT, FETCH_TARGET_LIST_ENDPOINT } from './Constant';
import TargetRegistrationManualModal from "./RegisterTargetManualModal";

const filterPlaceholder = (text) => (
  <div>
    <span className="icon-filter">
      <IconFilter />
    </span>
    {text}
  </div>
);

const getStatusTagStyle = (value) => {
  switch (value) {
    case 3:
      return {
        color: "#05BD29",
        border: "1px solid #05BD2",
      };
    case 4:
      return {
        color: "#FF0000",
        border: "1px solid #FF0000",
      };

    default:
      return {
        color: "#000",
        border: "1px solid #DEE2E6",
      };
  }
};

function TargetManagement() {
  const [currentTab, setCurrentTab] = useState(TABS.OWNER);
  const [phaseOptions, setPhaseOptions] = useState([]);
  const [targetRegistration, setTargetRegistration] = useState([]);
  const [isShowLoadingModal, setIsShowLoadingModal] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(1);
  const [phaseIdSelected, setPhaseIdSelected] = useState(0);
  const [statusSelected, setStatusSelected] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [openMenuRegistration, setOpenMenuRegistration] = useState(false);
  const [registerTargetModalShow, setRegisterTargetModalShow] = useState(null);

  const { t } = useTranslation();
  const config = getRequestConfigurations();
  const registerActions = {
    manual: 0,
    fromLibrary: 1,
  };

  useEffect(() => {
    fetchInitData();
  }, []);

  useEffect(() => {
    if (pageSize && pageIndex) {
      fetchTargetList();
    }
  }, [pageSize, pageIndex, currentTab]);

  const fetchInitData = () => {
    const bodyFormData = new FormData();
    bodyFormData.append("nopaging", true);
    axios
      .post(CHECK_PHASE_LIST_ENDPOINT, bodyFormData, config)
      .then((res) => {
        if (res?.data?.data) {
          setPhaseOptions(
            res.data.data.map((item) => ({
              value: item.id,
              label: item.name,
            }))
          );
        }
      })
      .catch((error) => {});
  };

  const handleRegistrationAction = (optionCode = registerActions.manual) => {
    setOpenMenuRegistration(false);
    setRegisterTargetModalShow(optionCode);
  };

  const onHideRegisterTargetModal = () => {
    setRegisterTargetModalShow(null);
  };

  const fetchTargetList = async () => {
    setIsShowLoadingModal(true);
    try {
      const response = await axios.post(
        FETCH_TARGET_LIST_ENDPOINT,
        {
          pageIndex,
          pageSize,
          checkPhaseId: phaseIdSelected,
          status: statusSelected,
          EmployeeCode: localStorage.getItem("employeeNo") || 3644797,
          type: currentTab,
        },
        config
      );
      if (response?.data?.data) {
        setTargetRegistration(response.data.data?.requests);
      }
      if (response?.data?.result) {
        setTotalRecords(response.data.result.totalRecords);
      }
    } catch (error) {}
    setIsShowLoadingModal(false);
  };

  const STATUS_OPTIONS = [
    {
      label: t("Draft"),
      value: 1,
    },
    {
      label: t("Processing"),
      value: 2,
    },
    {
      label: t("Approved"),
      value: 3,
    },
    {
      label: t("Reject"),
      value: 4,
    },
  ];

  const REGISTER_TYPES = [
    {
      label: t("Manually"),
      value: 0,
    },
    {
      label: t("FromLibrary"),
      value: 1,
    },
  ];

  return (
    <div className="target-management-page">
      <LoadingModal show={isShowLoadingModal} />
      {registerTargetModalShow === registerActions.fromLibrary && (
        <RegisterTargetFromLibraryModal
          onHideRegisterTargetModal={onHideRegisterTargetModal}
        />
      )}
      {registerTargetModalShow === registerActions.manual && (
        <TargetRegistrationManualModal phaseOptions={phaseOptions} onHide={onHideRegisterTargetModal} />
      )}
      <div className="menu-btns">
        <Button
          className={`button ${currentTab === TABS.OWNER && "primary-button"}`}
          onClick={() => setCurrentTab(TABS.OWNER)}
        >
          {t("Request")}
        </Button>
        <Button
          className={`button ${
            currentTab === TABS.REQUEST && "primary-button"
          }`}
          onClick={() => setCurrentTab(TABS.REQUEST)}
        >
          {t("Menu_Task_Approval")}
        </Button>
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
            <div className="menu-registration">
              <div
                className="menu-registration-option"
                onClick={() => handleRegistrationAction(registerActions.manual)}
              >
                {t("TargetRegistrationManual")}
              </div>
              <div
                className="menu-registration-option"
                onClick={() =>
                  handleRegistrationAction(registerActions.fromLibrary)
                }
              >
                {t("TargetRegistrationLibrary")}
              </div>
            </div>
          )}
        </div>
        <Select
          className="select-container"
          classNamePrefix="filter-select"
          placeholder={filterPlaceholder(t("AssessmentPeriod"))}
          options={phaseOptions}
          onChange={(val) => setPhaseIdSelected(val?.value || 0)}
          isClearable
        />
        <Select
          className="select-container"
          classNamePrefix="filter-select"
          placeholder={filterPlaceholder(t("Status"))}
          options={STATUS_OPTIONS}
          onChange={(val) => setStatusSelected(val?.value || 0)}
          isClearable
        />
        <Button
          className="button search-button"
          variant="warning"
          onClick={fetchTargetList}
        >
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
              <th className="text-center">{t("TotalTarget")}</th>
              <th>{t("Requestor")}</th>
              <th>{t("ADCode")}</th>
              <th className="text-center">{t("Status")}</th>
              <th className="text-center">{t("Reason")}</th>
              <th className="text-center">{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {targetRegistration?.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  {
                    REGISTER_TYPES.find((it) => it.value === item.requestType)
                      ?.label
                  }
                </td>
                <td>{item.checkPhaseName}</td>
                <td className="text-center">{item.totalTarget}</td>
                <td>{JSON.parse(item.userInfo)?.fullName}</td>
                <td>{JSON.parse(item.userInfo)?.account}</td>
                <td className="text-center">
                  <div
                    className="status-tag"
                    style={getStatusTagStyle(item.status)}
                  >
                    {STATUS_OPTIONS.find((i) => i.value === item.status)?.label}
                  </div>
                </td>
                <td className="text-center">
                  {item.status === 4 && item.rejectReson && (
                    <>
                      <a data-tip data-for={`reason-${item.id}`}>
                        <IconReason />
                      </a>
                      <ReactTooltip
                        id={`reason-${item.id}`}
                        scrollHide
                        isCapture
                        clickable
                        place="left"
                        backgroundColor="#FFFFFF"
                        arrowColor="#FFFFFF"
                        className="tooltip"
                      >
                        <div className="tooltip-content">
                          <div className="tooltip-header">
                            Ý kiến của CBQL phê duyệt:
                          </div>
                          <div>{item.rejectReson}</div>
                        </div>
                      </ReactTooltip>
                    </>
                  )}
                </td>
                <td className="text-center">
                  {STATUS_DELETEABLE.includes(item.status) && (
                    <IconRemove
                      className="rm-icon action-icon"
                      // onClick={() => deleteTarget(item.id)}
                    />
                  )}
                  {STATUS_EDITABLE.includes(item.status) && (
                    <IconEdit className="action-icon" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-footer">
          <CustomPaging
            onChangePageSize={setPageSize}
            onChangePageIndex={setPageIndex}
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
