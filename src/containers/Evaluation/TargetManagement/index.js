import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { Button, Table } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import moment from "moment";
import { debounce } from "lodash";
import { Link, useLocation, useHistory } from "react-router-dom";

import { ReactComponent as IconFilter } from "assets/img/ic-filter.svg";
import { ReactComponent as IconSearch } from "assets/img/icon/ic_search.svg";
import { ReactComponent as IconReason } from "assets/img/ic-reason.svg";
import { ReactComponent as IconRemove } from "assets/img/icon-delete.svg";
import { ReactComponent as IconEdit } from "assets/img/icon/Icon-edit.svg";
import { ReactComponent as IconRecall } from "assets/img/Icon-recall.svg";

import HOCComponent from "components/Common/HOCComponent";
import CustomPaging from "components/Common/CustomPagingNew";
import { getRequestConfigurations } from "commons/Utils";
import LoadingModal from "components/Common/LoadingModal";
import RegisterTargetFromLibraryModal from "./RegisterTargetFromLibraryModal";
import {
  STATUS_DELETEABLE,
  STATUS_EDITABLE,
  TABS,
  CHECK_PHASE_LIST_ENDPOINT,
  FETCH_TARGET_LIST_ENDPOINT,
  UPDATE_STATUS_TARGET_ENDPOINT,
  STATUS_EDITABLE_APPROVE_TAB,
  MODAL_TYPES,
  STATUS_TYPES,
  REGISTER_TYPES,
  REQUEST_STATUS,
  STATUS_RECALLABLE,
  STATUS_RECALLABLE_APPROVE_TAB,
} from "./Constant";
import TargetRegistrationManualModal from "./RegisterTargetManualModal";
import ConfirmModal from "components/Common/ConfirmModalNew";
import StatusModal from "components/Common/StatusModal";
import RejectConfirmModal from "./RejectConfirmModal";
import Constants from "commons/Constants";
import { getValueParamByQueryString } from "commons/Utils";

const filterPlaceholder = (text) => (
  <div>
    <span className="icon-filter">
      <IconFilter />
    </span>
    {text}
  </div>
);

const searchPlaceholder = (text) => (
  <div>
    <span className="icon-filter">
      <IconSearch />
    </span>
    {text}
  </div>
);

const getStatusTagStyle = (value) => {
  switch (value) {
    case REQUEST_STATUS.DRAFT:
      return {
        color: "#000",
        backgroundColor: "#F2F2F2",
        border: "none",
      };

    case REQUEST_STATUS.APPROVED:
      return {
        color: "#05BD29",
        border: "1px solid #05BD29",
      };
    case REQUEST_STATUS.REJECT:
      return {
        color: "#FF0000",
        border: "1px solid #FF0000",
      };

    default:
      return {
        color: "#000",
        border: "1px solid #dee2e6",
      };
  }
};

const EmployeeOption = (props) => {
  const { innerProps, innerRef } = props;
  const addDefaultSrc = (ev) => {
    ev.target.src =
      "data:image/png;base64,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";
  };

  return (
    <div ref={innerRef} {...innerProps} className="approver">
      <div className="d-block clearfix">
        <div className="float-left mr-2 w-20">
          <img
            className="avatar"
            src={`data:image/png;base64,${props.data.avatar}`}
            onError={addDefaultSrc}
            alt="avatar"
          />
        </div>
        <div className="float-left text-wrap w-75">
          {/* {props.isSearch === false && <div className="title font-weight-bold text-dark">{t('ApproverRecently')}</div>} */}
          <div className="title">{props.data.fullname}</div>
          <div className="comment">
            <i>
              ({props.data.username}) {props.data.position_name}
            </i>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderReasonTooltipTitle = (item) => {
  const { userInfo, approverInfo, lastRecallBy, rejectReson } = item,
    user = JSON.parse(userInfo || "{}"),
    approverUser = JSON.parse(approverInfo || "{}");
  if (item.status === REQUEST_STATUS.REJECT && rejectReson) {
    return "Lý do từ chối";
  }
  if (
    lastRecallBy
      ?.toLowerCase()
      ?.includes(approverUser?.account?.toLowerCase()) && rejectReson
  )
    return "Lý do thu hồi của CBQL";
  if (lastRecallBy?.toLowerCase()?.includes(user?.account?.toLowerCase()) && rejectReson)
    return "Lý do thu hồi của CBNV";

  return "Ý kiến của CBQL phê duyệt"; // status = 2/3/4 : từ chối
};

function TargetManagement() {
  // const [currentTab, setCurrentTab] = useState(TABS.OWNER);
  const [loading, setLoading] = useState(false);
  const [phaseOptions, setPhaseOptions] = useState([]);
  const [employeeSearchOptions, setEmployeeSearchOptions] = useState([]);
  const [targetRegistration, setTargetRegistration] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [employeeSelected, setEmployeeSelected] = useState(null);
  const [employeeSearchLoading, setEmployeeSearchLoading] = useState(false);
  const [phaseIdSelected, setPhaseIdSelected] = useState(undefined);
  const [statusSelected, setStatusSelected] = useState(undefined);
  const [totalRecords, setTotalRecords] = useState(0);
  const [openMenuRegistration, setOpenMenuRegistration] = useState(false);
  const [modalManagement, setModalManagement] = useState({
    type: null,
    data: null,
  });
  const history = useHistory();
  const location = useLocation();

  const currentTab =
    getValueParamByQueryString(window.location.search, "tab") || TABS.OWNER;
  const requestId =
    getValueParamByQueryString(window.location.search, "id") || 0;

  const { t } = useTranslation();
  const config = getRequestConfigurations();

  useEffect(() => {
    fetchInitData();
    if (requestId) {
      setModalManagement({
        type: MODAL_TYPES.REGISTER_MANUAL,
        data: requestId,
        viewOnly: true,
      });
    }
  }, []);

  useEffect(() => {
    if (pageSize && pageIndex) {
      fetchTargetList();
    }
  }, [pageSize, pageIndex, currentTab]);

  useEffect(() => {
    setPageIndex(1);
  }, [currentTab]);

  useEffect(() => {
    if (modalManagement.type !== null && openMenuRegistration) {
      setOpenMenuRegistration(false);
    }
  }, [modalManagement, openMenuRegistration]);

  const fetchInitData = () => {
    const bodyFormData = new FormData();
    bodyFormData.append("nopaging", true);
    axios
      .post(CHECK_PHASE_LIST_ENDPOINT, bodyFormData, config)
      .then((res) => {
        if (res?.data?.data) {
          const options = [
            ...res.data.data.map((item) => ({
              ...item,
              value: item.id,
              label: item.name,
            })),
          ];
          setPhaseOptions(options);
        }
      })
      .catch((error) => {});
  };

  const fetchTargetList = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        FETCH_TARGET_LIST_ENDPOINT,
        {
          pageIndex,
          pageSize,
          checkPhaseId: phaseIdSelected || 0,
          status: statusSelected || null,
          EmployeeCode:
            currentTab === TABS.OWNER
              ? localStorage.getItem("employeeNo")
              : employeeSelected,
          type: currentTab,
        },
        config
      );
      if (response?.data?.data) {
        setTargetRegistration(response.data.data?.requests || []);
        setTotalRecords(response.data.data?.total);
      } else {
        setTargetRegistration([]);
        setTotalRecords(0);
      }
    } catch (error) {}
    setLoading(false);
  };

  const onInputEmployeeSearchChange = debounce((keyword) => {
    if (keyword) {
      setEmployeeSearchLoading(true);
      const payload = {
        account: keyword,
        employee_type: "EMPLOYEE",
        status: Constants.statusUserActiveMulesoft,
      };
      axios
        .post(
          `${process.env.REACT_APP_REQUEST_URL}user/employee/search`,
          payload,
          config
        )
        .then((res) => {
          const data = res.data.data || [];
          setEmployeeSearchOptions(data);
          setEmployeeSearchLoading(false);
        })
        .catch(() => {
          setEmployeeSearchLoading(false);
        });
    }
  }, Constants.TIME_DEBOUNCE_FOR_SEARCH);

  const handleRegistrationAction = (
    optionCode = MODAL_TYPES.REGISTER_MANUAL
  ) => {
    setOpenMenuRegistration(false);
    setModalManagement({
      type: optionCode,
      data: null,
    });
  };

  const onHideModal = (shouldRefresh = false) => {
    setModalManagement({
      type: null,
      data: null,
    });
    if (requestId) {
      const queryParams = new URLSearchParams(location.search);
      queryParams.delete("id");
      history.replace({
        search: queryParams.toString(),
      });
    }
    if (shouldRefresh === true) {
      // setPageSize(10);
      // setPageIndex(1);
      fetchTargetList();
    }
  };

  const updateStatusTargetRegister = async (id, type, reason = "") => {
    if (id && type) {
      setLoading(true);
      let typeMessage = "Xoá yêu cầu ";
      if (type === STATUS_TYPES.APPROVE) {
        typeMessage = "Phê duyệt yêu cầu ";
      } else if (type === STATUS_TYPES.REJECT) {
        typeMessage = "Từ chối phê duyệt ";
      } else if (type === STATUS_TYPES.RECALL) {
        typeMessage = "Thu hồi yêu cầu ";
      }
      try {
        const response = await axios.post(
          UPDATE_STATUS_TARGET_ENDPOINT,
          {
            id,
            type,
            reason,
          },
          config
        );
        if (response.data?.result?.code !== "200") {
          setModalManagement({
            type: MODAL_TYPES.FAIL,
            data: response.data?.result?.message,
          });
        } else {
          setModalManagement({
            type: MODAL_TYPES.SUCCESS,
            data: `${typeMessage} thành công!`,
          });
        }
      } catch (error) {
        setModalManagement({
          type: MODAL_TYPES.FAIL,
          data: `${typeMessage} thất bại!`,
        });
      }
      setLoading(false);
    }
  };

  const onEditTargetRegisterClick = (event, item) => {
    event.stopPropagation();

    if (
      [REQUEST_STATUS.DRAFT, REQUEST_STATUS.REJECT].includes(
        Number(item?.status)
      ) &&
      item?.requestType === REGISTER_TYPES.LIBRARY
    ) {
      setModalManagement({
        type: MODAL_TYPES.REGISTER_LIBRARY,
        data: item,
      });
    } else {
      setModalManagement({
        type: MODAL_TYPES.REGISTER_MANUAL,
        data: item.id,
        viewOnly: false,
      });
    }
  };

  const onDeleteTargetRegisterClick = (event, item) => {
    event.stopPropagation();
    setModalManagement({
      type: MODAL_TYPES.DELETE_CONFIRM,
      data: item,
    });
  };

  const onRecallTargetRegisterClick = (event, item) => {
    event.stopPropagation();
    setModalManagement({
      type: MODAL_TYPES.RECALL_REQUEST_CONFIRM,
      data: item,
    });
  };

  const modalShow = () => {
    if (!modalManagement.type && modalManagement.type !== 0) return <></>;
    switch (modalManagement.type) {
      case MODAL_TYPES.SUCCESS:
        return (
          <StatusModal
            show={true}
            isSuccess={true}
            onHide={() => onHideModal(true)}
            content={modalManagement.data}
          />
        );

      case MODAL_TYPES.FAIL:
        return (
          <StatusModal
            isSuccess={false}
            show={true}
            onHide={() => onHideModal(true)}
            content={modalManagement.data}
          />
        );

      case MODAL_TYPES.REGISTER_MANUAL:
        return (
          <TargetRegistrationManualModal
            phaseOptions={phaseOptions}
            onHide={() => onHideModal(true)}
            id={modalManagement?.data}
            isApprover={currentTab === TABS.REQUEST && !!modalManagement.data}
            setModalManagement={setModalManagement}
            viewOnly={modalManagement.viewOnly}
            onRecallTargetRegisterClick={onRecallTargetRegisterClick}
          />
        );

      case MODAL_TYPES.REGISTER_LIBRARY:
        return (
          <RegisterTargetFromLibraryModal
            onHideRegisterTargetModal={onHideModal}
            registerType={MODAL_TYPES.REGISTER_LIBRARY}
            requestId={modalManagement?.data?.id}
            status={modalManagement?.data?.status}
            phaseOptions={phaseOptions}
            setModalManagement={setModalManagement}
          />
        );

      case MODAL_TYPES.DELETE_CONFIRM:
        return (
          <ConfirmModal
            show={true}
            confirmHeader="XÁC NHẬN XOÁ"
            confirmContent="Bạn chắc chắn muốn xoá yêu cầu này?"
            onHide={onHideModal}
            onCancelClick={onHideModal}
            onAcceptClick={() =>
              updateStatusTargetRegister(
                modalManagement.data?.id,
                STATUS_TYPES.DELETE
              )
            }
            tempButtonLabel="Hủy"
            mainButtonLabel="Đồng ý"
          />
        );

      case MODAL_TYPES.APPROVE_CONFIRM:
        return (
          <ConfirmModal
            show={true}
            confirmHeader="XÁC NHẬN PHÊ DUYỆT"
            confirmContent="Bạn có đồng ý phê duyệt yêu cầu này?"
            onHide={onHideModal}
            onCancelClick={onHideModal}
            onAcceptClick={() =>
              updateStatusTargetRegister(
                modalManagement.data?.id,
                STATUS_TYPES.APPROVE
              )
            }
            tempButtonLabel="Hủy"
            mainButtonLabel="Đồng ý"
          />
        );

      case MODAL_TYPES.REJECT_CONFIRM:
        return (
          <RejectConfirmModal
            show={true}
            onHide={onHideModal}
            onCancelClick={onHideModal}
            onReject={(reason) => {
              updateStatusTargetRegister(
                modalManagement.data?.id,
                STATUS_TYPES.REJECT,
                reason
              );
            }}
            modalClassName="reject-target-modal"
          />
        );

      case MODAL_TYPES.RECALL_REQUEST_CONFIRM:
        return (
          <RejectConfirmModal
            show={true}
            onHide={onHideModal}
            onCancelClick={onHideModal}
            type={MODAL_TYPES.RECALL_REQUEST_CONFIRM}
            onReject={(reason) => {
              updateStatusTargetRegister(
                modalManagement.data?.id,
                STATUS_TYPES.RECALL,
                reason
              );
            }}
            modalClassName="reject-target-modal"
          />
        );

      default:
        break;
    }
  };

  const REGISTER_TYPE_OPTIONS = [
    {
      label: t("Manually"),
      value: MODAL_TYPES.REGISTER_MANUAL,
    },
    {
      label: t("FromLibrary"),
      value: MODAL_TYPES.REGISTER_LIBRARY,
    },
  ];

  const STATUS_OPTIONS =
    currentTab === TABS.OWNER
      ? [
          {
            label: t("All"),
            value: null,
          },
          {
            label: t("Draft"),
            value: REQUEST_STATUS.DRAFT,
          },
          {
            label: t("PendingApproval"),
            value: REQUEST_STATUS.PROCESSING,
          },
          {
            label: t("Approved"),
            value: REQUEST_STATUS.APPROVED,
          },
          {
            label: t("Reject"),
            value: REQUEST_STATUS.REJECT,
          },
        ]
      : [
          {
            label: t("All"),
            value: null,
          },
          {
            label: t("PendingApproval"),
            value: REQUEST_STATUS.PROCESSING,
          },
          {
            label: t("Approved"),
            value: REQUEST_STATUS.APPROVED,
          },
          {
            label: t("Reject"),
            value: REQUEST_STATUS.REJECT,
          },
        ];

  const filterOptionEmployeeSelect = (option, inputValue) => {
    return (
      option.data?.fullname
        ?.toLowerCase()
        .includes(inputValue?.toLowerCase()) ||
      option.data?.username
        ?.toLowerCase()
        .includes(inputValue?.toLowerCase()) ||
      option.data?.uid?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };

  return (
    <div
      className="target-management-page"
      onClick={() => setOpenMenuRegistration(false)}
    >
      <LoadingModal show={loading} />
      {modalShow()}
      <div className="menu-btns">
        <Link to={`/target-management?tab=${TABS.OWNER}`}>
          <Button
            className={`button ${
              currentTab === TABS.OWNER && "primary-button"
            }`}
          >
            {t("Request")}
          </Button>
        </Link>
        <Link to={`/target-management?tab=${TABS.REQUEST}`}>
          <Button
            className={`button ${
              currentTab === TABS.REQUEST && "primary-button"
            }`}
          >
            {t("Menu_Task_Approval")}
          </Button>
        </Link>
      </div>
      <div className="filter-container">
        <div className="menu-registration-container">
          {currentTab === TABS.OWNER && (
            <Button
              className="button add-button"
              variant="info"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuRegistration(!openMenuRegistration);
              }}
            >
              + {t("TargetRegistration")}
            </Button>
          )}
          {openMenuRegistration && (
            <div className="menu-registration">
              <div
                className="menu-registration-option"
                onClick={() =>
                  handleRegistrationAction(MODAL_TYPES.REGISTER_MANUAL)
                }
              >
                {t("TargetRegistrationManual")}
              </div>
              <div
                className="menu-registration-option"
                onClick={() =>
                  handleRegistrationAction(MODAL_TYPES.REGISTER_LIBRARY)
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
          options={[
            {
              value: 0,
              label: t("All"),
            },
            ...phaseOptions,
          ]}
          onChange={(val) => setPhaseIdSelected(val?.value)}
          value={[
            {
              value: 0,
              label: t("All"),
            },
            ...phaseOptions,
          ].find((item) => item.value === phaseIdSelected)}
        />
        <Select
          className="select-container"
          classNamePrefix="filter-select"
          placeholder={filterPlaceholder(t("Status"))}
          options={STATUS_OPTIONS}
          onChange={(val) => setStatusSelected(val?.value)}
          value={STATUS_OPTIONS.find((item) => item.value === statusSelected)}
        />
        {currentTab === TABS.REQUEST && (
          <Select
            onInputChange={onInputEmployeeSearchChange}
            className="select-container"
            classNamePrefix="filter-select"
            placeholder={searchPlaceholder(t("EvaluationSearchForEmployees"))}
            options={employeeSearchOptions}
            onChange={(val) => setEmployeeSelected(val?.uid || null)}
            components={{ Option: (e) => EmployeeOption(e) }}
            value={employeeSearchOptions.find(
              (emp) => emp.uid === employeeSelected
            )}
            getOptionLabel={(option) => option.fullname}
            getOptionValue={(option) => option.username}
            isClearable
            isLoading={employeeSearchLoading}
            filterOption={filterOptionEmployeeSelect}
          />
        )}

        <Button
          className="button search-button"
          variant="warning"
          onClick={fetchTargetList}
        >
          {t("Search")}
        </Button>
      </div>
      <div className="table-title">{t("MenuTargetManagement")}</div>
      <div className="table-container target-register-table">
        <Table className="table table-borderless" responsive>
          <thead className="target-register-thead">
            <tr>
              <th>{t("RequestNo")}</th>
              <th>{t("RegistrationType")}</th>
              <th>{t("AssessmentPeriod")}</th>
              <th className="text-center">{t("TotalTarget")}</th>
              <th>{t("Requestor")}</th>
              <th className="text-center">{t("RequestDate")}</th>
              <th>{t("ADCode")}</th>
              <th className="text-center">{t("Status")}</th>
              <th className="text-center">{t("Reason")}</th>
              <th className="text-center sticky-col">{t("action")}</th>
            </tr>
          </thead>
          <tbody className="target-register-tbody">
            {targetRegistration?.map((item) => (
              <tr
                key={item.id}
                onClick={() =>
                  setModalManagement({
                    type: MODAL_TYPES.REGISTER_MANUAL,
                    data: item.id,
                    viewOnly: true,
                  })
                }
              >
                <td>{item.id}</td>
                <td>
                  {
                    REGISTER_TYPE_OPTIONS.find(
                      (it) => it.value === item.requestType
                    )?.label
                  }
                </td>
                <td>{item.checkPhaseName}</td>
                <td className="text-center">{item.totalTarget}</td>
                <td>{JSON.parse(item.userInfo)?.fullName}</td>
                <td className="text-center">
                  {item.sendDate && item.sendDate !== "0001-01-01T00:00:00"
                    ? moment(item.sendDate).format("DD/MM/YYYY")
                    : ""}
                </td>
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
                  {(!!item.rejectReson || !!item.reviewComment) && (
                      <>
                        <a data-tip data-for={`reason-${item.id}`}>
                          <IconReason width={20} height={20} />
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
                              {renderReasonTooltipTitle(item)}
                            </div>
                            <div className="tooltip-body">{item.rejectReson || item.reviewComment}</div>
                          </div>
                        </ReactTooltip>
                      </>
                    )}
                </td>
                <td className="text-center sticky-col">
                  {STATUS_DELETEABLE.includes(item.status) &&
                    currentTab === TABS.OWNER && (
                      <span title={t("Cancel2")}>
                        <IconRemove
                          className="rm-icon action-icon"
                          onClick={(event) =>
                            onDeleteTargetRegisterClick(event, item)
                          }
                          alt={t("Cancel2")}
                        />
                      </span>
                    )}
                  {((currentTab === TABS.OWNER &&
                    STATUS_RECALLABLE.includes(item.status)) ||
                    (currentTab === TABS.REQUEST &&
                      STATUS_RECALLABLE_APPROVE_TAB.includes(item.status))) && (
                    <span title={t("Recall")}>
                      <IconRecall
                        onClick={(event) =>
                          onRecallTargetRegisterClick(event, item)
                        }
                      />
                    </span>
                  )}
                  {((currentTab === TABS.OWNER &&
                    STATUS_EDITABLE.includes(item.status)) ||
                    (currentTab === TABS.REQUEST &&
                      STATUS_EDITABLE_APPROVE_TAB.includes(item.status))) && (
                    <span title={t("Edit")}>
                      <IconEdit
                        className="action-icon"
                        onClick={(event) =>
                          onEditTargetRegisterClick(event, item)
                        }
                      />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
