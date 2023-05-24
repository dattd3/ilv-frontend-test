import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import "./styles.scss";
import { useTranslation } from "react-i18next";
import { forEach } from "lodash";
import CurrencyInput from "react-currency-input-field";
import IconEye from "../../../../assets/img/icon/eye.svg";
import IconNotEye from "../../../../assets/img/icon/not-eye.svg";
import IconRemove from "../../../../assets/img/ic-remove.svg";
import IconAdd from "../../../../assets/img/ic-add-green.svg";
import { useApi } from "../../../../modules/api";
import IconDelete from "../../../../assets/img/icon/Icon_Cancel.svg";
import ConfirmationModal from "../../ConfirmationModal";
import moment from "moment";
import HumanForReviewSalaryComponent from "../../HumanForReviewSalaryComponent";
import ConfirmPasswordModal from "./ConfirmPasswordModal";
import Constants from "../.../../../../../commons/Constants";
import StatusModal from "../../../../components/Common/StatusModal";
import Spinner from "react-bootstrap/Spinner";
import { Image } from "react-bootstrap";
import { validateFileMimeType, validateTotalFileSize } from "../../../../utils/file";
import LoadingModal from "../../../../components/Common/LoadingModal";
import { getCulture } from "commons/Utils";

function SalaryPropse(props) {
  const { t } = useTranslation();
  const api = useApi();
  const history = useHistory();
  const [dataContract, setDataContract] = useState(undefined);
  const [dataSalary, setDataSalary] = useState(undefined);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [currentSalary, setCurrentSalary] = useState("");
  const [suggestedSalary, setSuggestedSalary] = useState("");
  const [modalConfirmPassword, setModalConfirmPassword] = useState(false);
  const [accessToken, setAccessToken] = useState(
    new URLSearchParams(props.history.location.search).get("accesstoken") ||
      null
  );
  const [listFiles, setListFiles] = useState([]);
  const[listFileDeleted, setListFileDeleted] = useState([]);
  const [currencySalary, setCurrencySalary] = useState("VND");
  const [isLoading, setIsLoading] = useState(false);
  const [callSalary, setCalledSalary] = useState(false);

  const [modalStatus, setModalStatus] = useState({
    isShowStatusModal: false,
    content: "",
    isSuccess: true,
    url: "",
  });

  const [confirmModal, setConfirmModal] = useState({
    isShowModalConfirm: false,
    modalTitle: "",
    typeRequest: "",
    modalMessage: "",
    confirmStatus: "",
    dataToUpdate: [],
  });

  const [coordinator, setCoordinator] = useState(null); // Nhân sự hỗ trợ xin quyền xem lương
  const [supervisor, setSupervisor] = useState(null); // CBQL cấp cơ sở
  const [supervisors, setSupervisors] = useState([null]);
  const [appraiser, setAppraiser] = useState(null); // HR thẩm định quyền điều chỉnh lương
  const [approver, setApprover] = useState(null); // CBLĐ phê duyệt

  const [viewSetting, setViewSetting] = useState({
    showComponent: {
      humanForReviewSalary: false, //NHÂN SỰ HỖ TRỢ XIN QUYỀN XEM LƯƠNG
      humanResourceChangeSalary: true, //NHÂN SỰ THẨM ĐỊNH QUYỀN ĐIỀU CHỈNH LƯƠNG
      managerApproved: true, //CBQL CẤP CƠ SỞ
      bossApproved: true, //CBLĐ PHÊ DUYỆT
      stateProcess: false, // Button trang thai Từ chối
      btnAttachFile: false, // Button Dinh kem tep
      btnCancel: false, // Button Hủy
      btnSendRequest: false, // Button Gửi yêu cầu
      btnRefuse: false, // Button Từ chối
      btnExpertise: false, // Button Thẩm định
      btnNotApprove: false, // Button Không phê duyệt
      btnApprove: false, // Button phê duyệt
      showRemoveFile: false, // Hien thi icon remove file
    },
    disableComponent: {
      selectHrSupportViewSalary: false, // Cho phep chon Nhân sự hỗ trợ quyền xem lương
      currentSalary: true, //Mức lương hiện tại (GROSS) - Disable/Enable Input
      showCurrentSalary: false, //Change type text & password
      viewCurrentSalary: false, //Hiển thị eye
      suggestedSalary: true, //Mức lương đề xuất - Disable/Enable Input
      // disableAll: false,
    },
    proposedStaff: {
      avatar: "",
      account: "",
      email: "",
      employeeNo: "",
      employeeLevel: "",
      fullName: "",
      jobTitle: "",
      department: "",
      orgLv2Id: "",
      orgLv3Id: "",
      orgLv4Id: "",
      orgLv5Id: "",
      orgLv2Text: "",
      orgLv3Text: "",
      orgLv4Text: "",
      orgLv5Text: "",
      companyCode: "",
    },
  });

  useEffect(() => {
    getDataContract();
    if (props.match.params?.idContract) {
      if (props.match.params?.idSalary !== "create") {
        // Review mode
        setIsCreateMode(false);
        getDataSalary();
      } else {
        // Create mode
        setIsCreateMode(true);
        checkViewCreate();
      }
    } else {
      props.history.push("/tasks");
    }

    const queryParams = new URLSearchParams(props.history.location.search);
    if (queryParams.has("accesstoken")) {
      queryParams.delete("accesstoken");
      props.history.replace({
        search: queryParams.toString(),
      });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (dataContract && callSalary == false && accessToken) {
      getSalary(accessToken);
    }
  }, [dataContract]);

  const getDataContract = async () => {
    try {
      setIsLoading(true);
      const {
        data: { data: response },
      } = await api.fetchStaffContract(props.match.params?.idContract);
      if (response?.requestHistorys?.processStatusId) {
        let statusOriginal = response?.requestHistorys?.processStatusId;
        let child = response?.requestHistorys;
        if ([10, 11, 13].indexOf(statusOriginal) != -1) {
          if (child.processStatusId == 11 || child.processStatusId == 10) {
            statusOriginal = 8;
          } else if (child.processStatusId == 13) {
            statusOriginal = 5;
          }
        }
        response.requestHistorys.processStatusId = statusOriginal;
      }
      setDataContract(response);
    } catch (error) {
      console.log(error);
    }finally {
      setIsLoading(false);
    }
  };

  const getDataSalary = async () => {
    try {
      setIsLoading(true);
      const {
        data: { data: response },
      } = await api.fetchSalaryPropose(props.match.params?.idSalary);
      await setDataSalary(response);
      await checkAuthorize(response);
    } catch (error) {
      console.log(error);
    }finally {
      setIsLoading(false);
    }
  };

  const checkViewCreate = () => {
    let viewSettingTmp = { ...viewSetting };
    viewSettingTmp.showComponent.humanForReviewSalary = true;
    viewSettingTmp.showComponent.btnAttachFile = true;
    viewSettingTmp.showComponent.showRemoveFile = true;
    viewSettingTmp.showComponent.btnSendRequest = true;
    viewSettingTmp.disableComponent.selectHrSupportViewSalary = true;

    viewSettingTmp.proposedStaff.avatar = localStorage.getItem("avatar") || "";
    viewSettingTmp.proposedStaff.account =
      localStorage.getItem("email").split("@")[0] || "";
    viewSettingTmp.proposedStaff.email = localStorage.getItem("email") || "";
    viewSettingTmp.proposedStaff.employeeNo =
      localStorage.getItem("employeeNo") || "";
    viewSettingTmp.proposedStaff.employeeLevel =
      localStorage.getItem("employeeLevel") || "";
    viewSettingTmp.proposedStaff.fullName =
      localStorage.getItem("fullName") || "";
    viewSettingTmp.proposedStaff.jobTitle =
      localStorage.getItem("jobTitle") || "";
    viewSettingTmp.proposedStaff.department =
      localStorage.getItem("department") || "";
    viewSettingTmp.proposedStaff.orgLv2Id =
      localStorage.getItem("organizationLv2") || "";
    viewSettingTmp.proposedStaff.orgLv3Id =
      localStorage.getItem("organizationLv3") || "";
    viewSettingTmp.proposedStaff.orgLv4Id =
      localStorage.getItem("organizationLv4") || "";
    viewSettingTmp.proposedStaff.orgLv5Id =
      localStorage.getItem("organizationLv5") || "";
    viewSettingTmp.proposedStaff.orgLv6Id =
      localStorage.getItem("organizationLv6") || "";
    viewSettingTmp.proposedStaff.orgLv2Text =
      localStorage.getItem("company") || "";
    viewSettingTmp.proposedStaff.orgLv3Text =
      localStorage.getItem("division") || "";
    viewSettingTmp.proposedStaff.orgLv4Text =
      localStorage.getItem("region") || "";
    viewSettingTmp.proposedStaff.orgLv5Text =
      localStorage.getItem("unit") || "";
    viewSettingTmp.proposedStaff.orgLv6Text =
      localStorage.getItem("part") || "";
    viewSettingTmp.proposedStaff.companyCode =
      localStorage.getItem("companyCode") || "";
    setViewSetting(viewSettingTmp);
  };

  const checkAuthorize = (dataSalaryInfo) => {
    const currentEmail = localStorage.getItem("email");
    const currentEmployeeNo = localStorage.getItem("employeeNo");
    let viewSettingTmp = { ...viewSetting };
    viewSettingTmp.showComponent.stateProcess = true;
    let currentStatus = dataSalaryInfo?.processStatusId;
    // Todo: check nguoi danh gia
    switch (dataSalaryInfo?.processStatusId) {
      //Nhân sự điều phối gửi lại yêu cầu
      case 20:
        setIsCreateMode(true);
        viewSettingTmp.showComponent.stateProcess = false;
        viewSettingTmp.showComponent.btnAttachFile = true;
        viewSettingTmp.showComponent.btnSendRequest = true;
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        viewSettingTmp.showComponent.showRemoveFile = true;
        viewSettingTmp.disableComponent.editSubjectApply = true;
        viewSettingTmp.disableComponent.selectHrSupportViewSalary = true;
        viewSettingTmp.proposedStaff.avatar = localStorage.getItem("avatar") || "";
        viewSettingTmp.proposedStaff.account =
          localStorage.getItem("email").split("@")[0] || "";
        viewSettingTmp.proposedStaff.email = localStorage.getItem("email") || "";
        viewSettingTmp.proposedStaff.company_email =
          localStorage.getItem("plEmail") || "";
        viewSettingTmp.proposedStaff.employeeNo =
          localStorage.getItem("employeeNo") || "";
        viewSettingTmp.proposedStaff.employeeLevel =
          localStorage.getItem("employeeLevel") || "";
        viewSettingTmp.proposedStaff.fullName =
          localStorage.getItem("fullName") || "";
        viewSettingTmp.proposedStaff.jobTitle =
          localStorage.getItem("jobTitle") || "";
        viewSettingTmp.proposedStaff.department =
          localStorage.getItem("department") || "";
        viewSettingTmp.proposedStaff.orgLv2Id =
          localStorage.getItem("organizationLv2") || "";
        viewSettingTmp.proposedStaff.orgLv3Id =
          localStorage.getItem("organizationLv3") || "";
        viewSettingTmp.proposedStaff.orgLv4Id =
          localStorage.getItem("organizationLv4") || "";
        viewSettingTmp.proposedStaff.orgLv5Id =
          localStorage.getItem("organizationLv5") || "";
        viewSettingTmp.proposedStaff.orgLv6Id =
          localStorage.getItem("organizationLv6") || "";
        viewSettingTmp.proposedStaff.orgLv2Text =
          localStorage.getItem("company") || "";
        viewSettingTmp.proposedStaff.orgLv3Text =
          localStorage.getItem("division") || "";
        viewSettingTmp.proposedStaff.orgLv4Text =
          localStorage.getItem("region") || "";
        viewSettingTmp.proposedStaff.orgLv5Text =
          localStorage.getItem("unit") || "";
        viewSettingTmp.proposedStaff.orgLv6Text =
          localStorage.getItem("part") || "";
        viewSettingTmp.proposedStaff.companyCode =
          localStorage.getItem("companyCode") || "";
        currentStatus = 0; 
        break;
      case 21:
        viewSettingTmp.showComponent.humanForReviewSalary = true;
        if (accessToken) {
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
        }
        currentStatus = 0; 
        break;
      case 22:
        // Todo: kiem tra ai la nguoi view
        viewSettingTmp.showComponent.humanForReviewSalary = true;
        viewSettingTmp.showComponent.humanResourceChangeSalary = true;
        viewSettingTmp.showComponent.managerApproved = true;
        viewSettingTmp.showComponent.bossApproved = true;
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
        if (
          currentEmail.toLowerCase() === dataSalaryInfo?.userId.toLowerCase() &&
          props.match.params.type === "request"
        ) {
          viewSettingTmp.disableComponent.viewCurrentSalary = true;
          viewSettingTmp.disableComponent.suggestedSalary = false;
          viewSettingTmp.showComponent.btnCancel = true;
          viewSettingTmp.showComponent.btnSendRequest = true;
        }
        if (accessToken) {
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
        }
        currentStatus = 0; 
        break;
      case 8:
        viewSettingTmp.showComponent.humanForReviewSalary = true;
        viewSettingTmp.showComponent.humanResourceChangeSalary = true;
        viewSettingTmp.showComponent.managerApproved = true;
        viewSettingTmp.showComponent.bossApproved = true;
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
        let currentAppraiserIndex = dataSalaryInfo?.requestAppraisers?.findIndex(app => app.status == Constants.SALARY_APPRAISER_STATUS.WAITING);
        if (
          currentEmail.toLowerCase() ===
          dataSalaryInfo?.requestAppraisers[currentAppraiserIndex].appraiserId?.toLowerCase() &&
          props.match.params.type === "assess"
        ) {
          viewSettingTmp.disableComponent.viewCurrentSalary = true;
          viewSettingTmp.showComponent.btnRefuse = true;
          viewSettingTmp.showComponent.btnExpertise = true;
        } else if(props.match.params.type != "request") {
          currentStatus = 20;
        }
        if (accessToken) {
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
        }
        break;
      case 24:
        viewSettingTmp.showComponent.humanForReviewSalary = true;
        viewSettingTmp.showComponent.humanResourceChangeSalary = true;
        viewSettingTmp.showComponent.managerApproved = true;
        viewSettingTmp.showComponent.bossApproved = true;
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
        if (
          currentEmail.toLowerCase() ===
            dataSalaryInfo?.supervisorId.toLowerCase() &&
          props.match.params.type === "assess"
        ) {
          viewSettingTmp.disableComponent.viewCurrentSalary = true;
          viewSettingTmp.showComponent.btnRefuse = true;
          viewSettingTmp.showComponent.btnExpertise = true;
        }
        if (accessToken) {
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
        }
        break;
      case 5:
        viewSettingTmp.showComponent.humanForReviewSalary = true;
        viewSettingTmp.showComponent.humanResourceChangeSalary = true;
        viewSettingTmp.showComponent.managerApproved = true;
        viewSettingTmp.showComponent.bossApproved = true;
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
        if (
          currentEmail.toLowerCase() ===
            dataSalaryInfo?.approverId.toLowerCase() &&
          props.match.params.type === "approval"
        ) {
          viewSettingTmp.disableComponent.viewCurrentSalary = true;
          viewSettingTmp.showComponent.btnNotApprove = true;
          viewSettingTmp.showComponent.btnApprove = true;
        }
        if (accessToken) {
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
        }
        break;
      // View phe duyet thanh cong
      case 2:
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
      // Case không phê duyệt
      case 7:
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
      // Case tu choi
      case 1:
        viewSettingTmp.showComponent.stateProcess = true;
        viewSettingTmp.showComponent.humanForReviewSalary = true;
        viewSettingTmp.showComponent.humanResourceChangeSalary = true;
        viewSettingTmp.showComponent.managerApproved = true;
        viewSettingTmp.showComponent.bossApproved = true;
        break;
      default:
        break;
    }
    // Cán bộ đề xuất
    // viewSettingTmp.proposedStaff.fullName = dataSalaryInfo?.user?.fullName;
    // viewSettingTmp.proposedStaff.jobTitle = dataSalaryInfo?.user?.jobTitle;
    // viewSettingTmp.proposedStaff.department = dataSalaryInfo?.user?.department;
    viewSettingTmp.currentStatus = currentStatus; 
    //QLTT
    const requestInfo = dataSalaryInfo;
    if(requestInfo.requestInfo && dataSalaryInfo?.processStatusId != 20) {
      const userInfo = JSON.parse(requestInfo.userInfo);
      viewSettingTmp.proposedStaff = {...userInfo};
    }

    // Nhân sự điều phối
    if (requestInfo?.coordinatorInfo)
      setCoordinator({
        ...JSON.parse(requestInfo?.coordinatorInfo)
      });

    // CBQL cấp cơ sở
    if (dataSalaryInfo?.requestAppraisers?.length > 0) {
      const _supervisors = [];
      dataSalaryInfo.requestAppraisers.map(item => {
        const _itemInfo = JSON.parse(item.appraiserInfo);
        if(_itemInfo.type) { // HR thẩm định quyền điều chỉnh lương
          setAppraiser({
            ..._itemInfo,
            uid: _itemInfo?.employeeNo,
            employeeNo: _itemInfo?.employeeNo,
            requestHistoryId: item.requestHistoryId
          });
        } else {
          _supervisors.push({
            ..._itemInfo,
            uid: _itemInfo?.employeeNo,
            employeeNo: _itemInfo?.employeeNo,
            requestHistoryId: item.requestHistoryId
          })
        }
      })
      setSupervisors(_supervisors);
    }
    // HR thẩm định quyền điều chỉnh lương
    if (dataSalaryInfo?.appraiserInfo)
      setAppraiser({
        fullName: JSON.parse(dataSalaryInfo?.appraiserInfo)?.fullName,
        account: JSON.parse(dataSalaryInfo?.appraiserInfo)?.account,
        current_position: JSON.parse(dataSalaryInfo?.appraiserInfo)
          ?.current_position,
        department: JSON.parse(dataSalaryInfo?.appraiserInfo)?.department,
      });
    
      // CBLĐ phê duyệt
    if (dataSalaryInfo?.approverInfo) {
      const approvalData = JSON.parse(requestInfo?.approverInfo);
      setApprover({
        ...approvalData,
        uid: approvalData?.employeeNo,
        employeeNo: approvalData?.employeeNo,
      });
    }

    const requestDocuments = (dataSalaryInfo?.userProfileDocuments || []).map((u) => ({
      id: u.id,
      name: u.fileName,
      link: u.fileUrl,
    })) || [];
    setListFiles(requestDocuments);
    setViewSetting(viewSettingTmp);
  };

  const handleShowCurrentSalary = () => {
    if (callSalary) {
      setViewSetting({
        ...viewSetting,
        disableComponent: {
          ...viewSetting.disableComponent,
          showCurrentSalary: !viewSetting.disableComponent.showCurrentSalary,
        },
      });
      return;
    }

    if (!accessToken) {
      setModalConfirmPassword(true);
      return;
    } else if (!viewSetting.disableComponent.showCurrentSalary) {
      getSalary(accessToken);
    }
  };

  // Từ chối
  const handleRefuse = () => {
    setConfirmModal({
      isShowModalConfirm: true,
      modalTitle: t("RejectConsenterRequest"),
      modalMessage: t("ReasonRejectRequest"),
      typeRequest: Constants.STATUS_NO_CONSENTED,
      confirmStatus: "",
      dataToUpdate: [
        {
          id: props.match.params?.idSalary,
          requestTypeId: 12,
          sub: [
            {
              id: props.match.params?.idSalary,
              processStatusId: 7,
              comment: "",
              status: "",
            },
          ],
        },
      ],
    });
  };

  // Không phê duyệt
  const handleReject = () => {
    setConfirmModal({
      isShowModalConfirm: true,
      modalTitle: t("ConfirmNotApprove"),
      modalMessage: `${t("ReasonNotApprove")}`,
      typeRequest: Constants.STATUS_NOT_APPROVED,
      confirmStatus: "",
      dataToUpdate: [
        {
          id: props.match.params?.idSalary,
          requestTypeId: 12,
          sub: [
            {
              id: props.match.params?.idSalary,
              processStatusId: 1,
              comment: "",
              status: "",
            },
          ],
        },
      ],
    });
  };

  // Hủy
  const handleCancel = () => {
    history.push("/tasks");
  };

  // Attach file
  const handleAttachFile = (e) => {
    const files = Object.values(e.target.files);
    if (validateFileMimeType(e, files, t)) {
      const listFilesTmp = [...listFiles, ...files];
      if (validateTotalFileSize(e, listFilesTmp, t)) {
        setListFiles(listFilesTmp);
      }
    }
  };

  const removeFiles = (id, index) => {
    let listFilesTmp = [...listFiles].filter((item, i) => i !== index);
    if(id) {
      setListFileDeleted([...listFileDeleted, id]);
    }
    setListFiles(listFilesTmp);
  };

  // Thẩm định
  const handleConsent = () => {
    // const processStatusId = appraiser ? 24 : 5
    setConfirmModal({
      isShowModalConfirm: true,
      modalTitle: t("ConsentConfirmation"),
      modalMessage: t("ConfirmConsentRequest"),
      typeRequest: Constants.STATUS_CONSENTED,
      confirmStatus: "",
      dataToUpdate: [
        {
          id: props.match.params?.idSalary,
          requestTypeId: 12,
          sub: [
            {
              id: props.match.params?.idSalary,
              processStatusId: 5,
              comment: "",
              status: "",
            },
          ],
        },
      ],
    });
  };

  // Phê duyệt
  const handleApprove = () => {
    setConfirmModal({
      isShowModalConfirm: true,
      modalTitle: t("ApproveRequest"),
      modalMessage: t("ConfirmApproveChangeRequest"),
      typeRequest: Constants.STATUS_APPROVED,
      confirmStatus: "",
      dataToUpdate: [
        {
          id: props.match.params?.idSalary,
          requestTypeId: 12,
          sub: [
            {
              id: props.match.params?.idSalary,
              processStatusId: 2,
              comment: "",
              status: "",
            },
          ],
        },
      ],
    });
  };

  // Gửi yêu cầu
  const handleSendForm = () => {
    // Create
    if (isCreateMode) {
      if (!coordinator) {
        showStatusModal(t("HumanForReviewSalaryValidate"), false);
        return;
      }
      if (!appraiser) {
        showStatusModal(t("HumanForChangeSalaryValidate"), false);
        return;
      }
      if (!approver) {
        showStatusModal(t("PleaseInputApprover"), false);
        return;
      }
      const isUpdate = props.match.params.idSalary !== "create";
      setIsLoading(true);
      const bodyFormData = prepareDataToSubmit(isUpdate ? props.match.params.idSalary : null);
      (isUpdate ? //update yêu cầu salaryadjustment
        axios({
          method: "PUT",
          url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}salaryadjustment`,
          data: bodyFormData,
          params: {
            culture: getCulture()
          },
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        : 
        axios({ // Tạo mới yêu cầu đề xuất
        method: "POST",
        url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}request`,
        params: {
          culture: getCulture()
        },
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }))
        .then((response) => {
          if (response.data.result && response.data.result.code === "000000") {
            showStatusModal(t("RequestSent"), true, "/tasks");
            return;
          }
          showStatusModal(response.data.result.message || t("Error"), false);
        })
        .catch((response) => {
          showStatusModal(t("Error"), false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Review
      if (dataSalary?.processStatusId === 22) {
        if (!currentSalary) {
          showStatusModal(t("CurrentSalaryValidate"), false);
          return;
        }
        if (!suggestedSalary) {
          showStatusModal(t("SuggestedSalaryValidate"), false);
          return;
        }
        if (currentSalary && suggestedSalary) {
          const requestInfoSalary = dataContract?.staffContracts;
          const dataSend = {
            requestHistoryId: props.match.params?.idSalary,
            companyCode: localStorage.getItem("companyCode") || "",
            staffSalaryUpdate: [
              {
                salaryAdjustmentId:
                  dataSalary?.salaryAdjustments?.length !== 0
                    ? dataSalary?.salaryAdjustments[0].id
                    : "",
                employeeNo: requestInfoSalary?.employeeNo,
                currentSalary: currentSalary,
                suggestedSalary: suggestedSalary,
                contractType: requestInfoSalary?.contractType,
                staffStrengths: "",
                staffWknesses: "",
                startDate: "",
              },
            ],
          };
          setIsLoading(true);
          axios({
            method: "POST",
            url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}salaryadjustment/submitsalary`,
            params: {
              culture: getCulture()
            },
            data: dataSend,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          })
            .then((response) => {
              if (
                response.data.result &&
                response.data.result.code === "000000"
              ) {
                showStatusModal(t("RequestSent"), true, "/tasks");
                return;
              }
              showStatusModal(
                response.data.result.message || t("Error"),
                false
              );
            })
            .catch((response) => {
              showStatusModal(t("Error"), false);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      }
    }
  };

  const prepareDataToSubmit = (id) => {
    if (isCreateMode) {
      let bodyFormData = new FormData();
      bodyFormData.append("requestHistoryId", props.match.params?.idContract);
      bodyFormData.append("userId", viewSetting.proposedStaff.email);
      bodyFormData.append(
        "userInfo",
        JSON.stringify({
          employeeNo: viewSetting.proposedStaff.employeeNo,
          avatar: viewSetting.proposedStaff.avatar,
          account:
            viewSetting.proposedStaff.account.toLowerCase() + "@vingroup.net",
          fullName: viewSetting.proposedStaff.fullName,
          employeeLevel: viewSetting.proposedStaff.employeeLevel,
          orglv2Id: viewSetting.proposedStaff.orgLv2Id,
          jobTitle: viewSetting.proposedStaff.jobTitle,
          department: viewSetting.proposedStaff.department,
          company_email: viewSetting.proposedStaff.email,
        })
      );
      bodyFormData.append(
        "coordinatorId",
        coordinator?.username.toLowerCase() + "@vingroup.net"
      );
      bodyFormData.append(
        "coordinatorInfo",
        JSON.stringify({
          avatar: "",
          account: coordinator?.username.toLowerCase() + "@vingroup.net",
          fullName: coordinator?.fullName,
          employeeLevel: coordinator?.employeeLevel,
          pnl: coordinator?.pnl,
          orglv2Id: coordinator?.orglv2Id,
          current_position: coordinator?.current_position,
          department: coordinator?.department,
          company_email: coordinator?.company_email?.toLowerCase(),
          employeeNo: coordinator?.uid || coordinator?.employeeNo,
          username: coordinator?.username?.toLowerCase(),
        })
      );

      const appraiserInfoLst = supervisors
      .filter((item) => item != null)
      .map((item, index) => {
        return {
          avatar: "",
          account: item?.username.toLowerCase() + "@vingroup.net",
          fullName: item?.fullName,
          employeeLevel: item?.employeeLevel,
          pnl: item?.pnl,
          orglv2Id: item?.orglv2Id,
          current_position: item?.current_position,
          department: item?.department,
          order: index + 1,
          company_email: item?.company_email?.toLowerCase(),
          type: 0,
          employeeNo: item?.uid || item?.employeeNo,
          username: item?.username.toLowerCase(),
        };
      });

      if (appraiser) {
        appraiserInfoLst.push({
          avatar: "",
          account: appraiser?.username?.toLowerCase() + "@vingroup.net",
          fullName: appraiser?.fullName,
          employeeLevel: appraiser?.employeeLevel,
          pnl: appraiser?.pnl,
          orglv2Id: appraiser?.orglv2Id,
          current_position: appraiser?.current_position,
          department: appraiser?.department,
          order: appraiserInfoLst.length + 1,
          company_email: appraiser?.company_email?.toLowerCase(),
          type: 1,
          employeeNo: appraiser?.uid || appraiser?.employeeNo,
          username: appraiser?.username?.toLowerCase(),
        });
      }
      bodyFormData.append("appraiserInfoLst", JSON.stringify(appraiserInfoLst));

      bodyFormData.append(
        "approverId",
        approver?.username.toLowerCase() + "@vingroup.net"
      );
      bodyFormData.append(
        "approverInfo",
        JSON.stringify({
          avatar: "",
          account: approver?.username?.toLowerCase() + "@vingroup.net",
          fullName: approver?.fullName,
          employeeLevel: approver?.employeeLevel,
          pnl: approver?.pnl,
          orglv2Id: approver?.orglv2Id,
          current_position: approver?.current_position,
          department: approver?.department,
          company_email: approver?.company_email?.toLowerCase(),
          employeeNo: approver?.uid || approver?.employeeNo,
          username: approver?.username?.toLowerCase(),
        })
      );

      bodyFormData.append(
        "employeeInfoLst",
        JSON.stringify([
          {
            employeeNo: dataContract?.staffContracts?.employeeCode,
            account: dataContract?.staffContracts?.employeeEmail,
            fullName: dataContract?.staffContracts?.fullName,
            jobTitle: dataContract?.staffContracts?.positionName,
            department: dataContract?.staffContracts?.departmentName,
            startDate: dataContract?.staffContracts?.startDate,
            expireDate: dataContract?.staffContracts?.expireDate,
            contractName: dataContract?.staffContracts?.contractName,
            contractType: dataContract?.staffContracts?.contractType,
          },
        ])
      );
      bodyFormData.append("orgLv2Id", viewSetting.proposedStaff.orgLv2Id);
      bodyFormData.append("orgLv3Id", viewSetting.proposedStaff.orgLv3Id);
      bodyFormData.append("orgLv4Id", viewSetting.proposedStaff.orgLv4Id);
      bodyFormData.append("orgLv5Id", viewSetting.proposedStaff.orgLv5Id);
      bodyFormData.append("orgLv6Id", viewSetting.proposedStaff.orgLv6Id);
      bodyFormData.append("orgLv2Text", viewSetting.proposedStaff.orgLv2Text);
      bodyFormData.append("orgLv3Text", viewSetting.proposedStaff.orgLv3Text);
      bodyFormData.append("orgLv4Text", viewSetting.proposedStaff.orgLv4Text);
      bodyFormData.append("orgLv5Text", viewSetting.proposedStaff.orgLv5Text);
      bodyFormData.append("orgLv6Text", viewSetting.proposedStaff.orgLv6Text);
      bodyFormData.append("companyCode", viewSetting.proposedStaff.companyCode);

      if(id) {
        bodyFormData.append("id", id);
      }

      if (listFiles.filter(item=> item.id == undefined).length > 0) {
        listFiles.filter(item=> item.id == undefined).forEach((file) => {
          bodyFormData.append("attachedFiles", file);
        });
      }
      bodyFormData.append('deletedDocumentIds', listFileDeleted.join(','));

      return bodyFormData;
    }
  };

  const showStatusModal = (message, isSuccess = false, url = null) => {
    setModalStatus({
      isShowStatusModal: true,
      content: message,
      isSuccess: isSuccess,
      url: url,
    });
  };

  const hideStatusModal = () => {
    setModalStatus({
      ...modalStatus,
      isShowStatusModal: false,
    });
    if (modalStatus.url) {
      window.location.href = modalStatus.url;
    }
  };

  const handleChangeModalConfirmPassword = (token) => {
    setAccessToken(token);
    setModalConfirmPassword(false);
    getSalary(token);
  };

  const getSalary = (token) => {
    const dataSend = {
      requestHistoryId: props.match.params?.idSalary,
      token: token,
    };
    setIsLoading(true);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}salaryadjustment/getsalarystaff`,
      params: {
        culture: getCulture()
      },
      data: dataSend,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => {
        if (response.data.result && response.data.result.code === "000000") {
          forEach(response.data.data, (value, key) => {
            setCurrentSalary(value?.currentSalary || "");
            setSuggestedSalary(value?.suggestedSalary || "");
            setCurrencySalary(value?.currentCurrency || "VND");
          });

          let viewSettingTmp = { ...viewSetting };
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          setViewSetting(viewSettingTmp);
          setCalledSalary(true);
          return;
        }
        showStatusModal(response.data.result.message || t("Error"), false);
      })
      .catch((response) => {
        showStatusModal(t("Error"), false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTextInputChange = (value) => {
    setSuggestedSalary(value);
  };

  const handleUpdateCoordinator = (approver, isApprover) => {
    setCoordinator(approver);
  };

  const removeSupervisorItem = (index) => {
    const newData = [...supervisors];
    newData.splice(index, 1);
    setSupervisors(newData);
  };
  const handleUpdateSupervisors = (approver, index) => {
    let userExist = supervisors.findIndex(
      (item) => approver?.uid && item?.uid == approver?.uid
    );
    if (userExist != -1) {
      showStatusModal(t("AppraiserExisted"), false);
      return;
    }
    const newData = [...supervisors];
    newData[index] = approver;
    setSupervisors(newData);
  };

  const handleUpdateHrChangeSalary = (approver) => {
    setAppraiser(approver);
  };

  const handleUpdateApprovalSalary = (approver) => {
    setApprover(approver);
  };

  const onHideModalConfirm = () => {
    setConfirmModal({
      ...confirmModal,
      isShowModalConfirm: false,
    });
  };

  function renderCurrency() {
    let currencySalaryTmp = {};
    if (currencySalary === "VND") {
      currencySalaryTmp = { locale: "vi-VN", currency: "VND" };
    } else {
      currencySalaryTmp = { locale: "en-US", currency: "USD" };
    }
    return currencySalaryTmp;
  }

  const salaryState = `salarypropse_${props.match.params?.idContract}_${props.match.params?.idSalary}_${props.match.params?.type}`;

  return (
    <div className="timesheet-section container-salary ">
      <LoadingModal show={isLoading} />
      <ConfirmPasswordModal
        state={salaryState}
        show={modalConfirmPassword}
        onUpdateToken={handleChangeModalConfirmPassword}
        onHide={() => setModalConfirmPassword(false)}
      />
      <StatusModal
        show={modalStatus.isShowStatusModal}
        content={modalStatus.content}
        isSuccess={modalStatus.isSuccess}
        onHide={hideStatusModal}
      />
      <ConfirmationModal
        show={confirmModal.isShowModalConfirm}
        title={confirmModal.modalTitle}
        type={confirmModal.typeRequest}
        message={confirmModal.modalMessage}
        confirmStatus={confirmModal.confirmStatus}
        dataToSap={confirmModal.dataToUpdate}
        onHide={onHideModalConfirm}
      />
      <div className="eval-heading">{t("SalaryPropse")}</div>
      <div className="block-content-salary">
        <h6 className="block-content-salary__title">{t("ManagerEvaluate")}</h6>
        <div className="block-content-salary__content">
          <div className="main-content">
            <div className="col-input">
              <label className="block-content-salary__content--label">
                {t("FullName")}
              </label>
              <input
                className="form-control"
                value={viewSetting.proposedStaff.fullName}
                disabled
              />
            </div>
            <div className="col-input">
              <label className="block-content-salary__content--label">
                {t("Title")}
              </label>
              <input
                className="form-control"
                value={viewSetting.proposedStaff.jobTitle}
                disabled
              />
            </div>
            <div className="col-input">
              <label className="block-content-salary__content--label">
                {t("DepartmentManage")}
              </label>
              <input
                className="form-control"
                value={viewSetting.proposedStaff.department}
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <div className="block-content-salary">
        <h6 className="block-content-salary__title">{t("ProposeInfo")}</h6>
        <div className="block-content-salary__content">
          <div className="main-content">
            <div className="col-input">
              <label className="block-content-salary__content--label">
                {t("FullName")}
              </label>
              <input
                className="form-control"
                value={dataContract?.staffContracts?.fullName || ""}
                disabled
              />
            </div>
            <div className="col-input">
              <label className="block-content-salary__content--label">
                {t("Title")}
              </label>
              <input
                className="form-control"
                value={dataContract?.staffContracts?.positionName || ""}
                disabled
              />
            </div>
            <div className="col-input">
              <label className="block-content-salary__content--label">
                {t("DepartmentManage")}
              </label>
              <input
                className="form-control"
                value={dataContract?.staffContracts?.departmentName || ""}
                disabled
              />
            </div>
            <div className="col-input">
              <label className="block-content-salary__content--label">
                {t("DateWork")}
              </label>
              <input
                className="form-control"
                value={
                  dataContract?.staffContracts?.startDate
                    ? moment(dataContract.staffContracts.startDate).format(
                        "DD/MM/YYYY"
                      )
                    : ""
                }
                disabled
              />
            </div>
            <div className="col-input">
              <label className="block-content-salary__content--label">
                {t("ExpriseDate")}
              </label>
              <input
                className="form-control"
                value={
                  dataContract?.staffContracts?.expireDate
                    ? moment(dataContract.staffContracts.expireDate).format(
                        "DD/MM/YYYY"
                      )
                    : ""
                }
                disabled
              />
            </div>
          </div>
          <div className="divide" />
          <div className="bottom-content">
            <div className="col-input">
              <label className="block-content-salary__content--label">
                {t("SalaryNow")}
              </label>
              {viewSetting.disableComponent.showCurrentSalary ? (
                <CurrencyInput
                  disabled={viewSetting.disableComponent.currentSalary}
                  intlConfig={renderCurrency()}
                  className="form-control"
                  value={currentSalary}
                  placeholder="Nhập"
                />
              ) : (
                <input
                  className="form-control"
                  type={"password"}
                  value={"**********"}
                  disabled={viewSetting.disableComponent.currentSalary}
                />
              )}
              {viewSetting.disableComponent.viewCurrentSalary && (
                <div
                  className="col-input__icon"
                  onClick={() => handleShowCurrentSalary()}
                >
                  <img
                    src={
                      viewSetting.disableComponent.showCurrentSalary
                        ? IconEye
                        : IconNotEye
                    }
                    alt="eye"
                  />
                </div>
              )}
            </div>
            <div className="col-input">
              <label className="block-content-salary__content--label">
                {t("SalaryRequest")}
              </label>
              {viewSetting.disableComponent.suggestedSalary ? (
                accessToken ? (
                  <CurrencyInput
                    disabled={true}
                    intlConfig={renderCurrency()}
                    className="form-control"
                    value={suggestedSalary}
                    placeholder="Nhập"
                  />
                ) : (
                  <input
                    className="form-control"
                    type={"password"}
                    value={"**********"}
                    disabled={viewSetting.disableComponent.currentSalary}
                  />
                )
              ) : (
                <CurrencyInput
                  disabled={false}
                  intlConfig={renderCurrency()}
                  className="form-control"
                  value={suggestedSalary}
                  onValueChange={(value) => {
                    handleTextInputChange(value);
                  }}
                  placeholder="Nhập"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="block-content-salary">
        <h6 className="block-content-salary__title"> {t("AssetmentInfo")}</h6>
        <div className="block-content-salary__content">
          <div className="block-content-salary__content--vote">
            <div className="wrapper-status">
              <p className="font-normal">{t("Status_1")}: </p>
              {Constants.mappingStatusRequest[
                dataContract?.requestHistorys?.processStatusId
              ]?.label && (
                <div>
                  {t(
                    Constants.mappingStatusRequest[
                      dataContract?.requestHistorys?.processStatusId
                    ]?.label
                  )}
                </div>
              )}
            </div>
            <div
              className="detail"
              onClick={() => {
                history.push(
                  `/evaluation/${props.match.params?.idContract}/salary`
                );
              }}
            >
              {t("ViewDetail")} {">>"}
            </div>
          </div>
        </div>
      </div>

      {/* NHÂN SỰ HỖ TRỢ XIN QUYỀN XEM LƯƠNG */}
      
        <div className="block-content-salary">
          <h6 className="block-content-salary__title">
            {" "}
            {t("HumanForReviewSalary")}
          </h6>
          <div className="block-content-salary__content">
            <HumanForReviewSalaryComponent
              isEdit={!viewSetting.disableComponent.selectHrSupportViewSalary}
              approver={coordinator}
              isHR={true}
              updateApprover={(approver, isApprover) =>
                handleUpdateCoordinator(approver, isApprover)
              }
            />
          </div>
        </div>
      

      {/* CBQL CẤP CƠ SỞ */}
      {viewSetting.showComponent.managerApproved && (
        <div className="block-content-salary">
          <h6 className="block-content-salary__title">
            {t("Consenter")}
            <span className="font-weight-normal ml-1 text-lowercase">
              ({t("if_any")})
            </span>
          </h6>
          <div className="timesheet-box1 timesheet-box shadow">
            {supervisors.map((item, key) => {
              return (
                <div
                  key={key}
                  className="appraiser d-flex flex-column position-relative"
                  style={key > 0 ? { marginTop: "20px" } : {}}
                >
                  {isCreateMode && key > 0 ? (
                    <button
                      className="btn btn-outline-danger position-absolute d-flex align-items-center btn-sm"
                      style={{ gap: "4px", top: 0, right: 0 }}
                      onClick={() => removeSupervisorItem(key)}
                    >
                      <Image src={IconRemove} />
                      {t("delete")}
                    </button>
                  ) : null}
                  <HumanForReviewSalaryComponent
                    isEdit={
                      !viewSetting.disableComponent.selectHrSupportViewSalary
                    }
                    approver={item}
                    updateApprover={(sup) => handleUpdateSupervisors(sup, key)}
                  />
                </div>
              );
            })}
            {isCreateMode ? (
              <button
                className="btn btn-outline-success btn-lg w-fit-content mt-3 d-flex align-items-center"
                style={{ gap: "4px", fontSize: "14px" }}
                onClick={() => setSupervisors([...supervisors, null])}
              >
                <Image src={IconAdd} />
                {t("Add")}
              </button>
            ) : null}
          </div>
        </div>
      )}
      {/* NHÂN SỰ THẨM ĐỊNH QUYỀN ĐIỀU CHỈNH LƯƠNG */}
      {viewSetting.showComponent.humanResourceChangeSalary && (
        <div className="block-content-salary">
          <h6 className="block-content-salary__title">
            {" "}
            {t("HumanResourceChangeSalary")}
          </h6>
          <div className="block-content-salary__content">
            <HumanForReviewSalaryComponent
              isEdit={!viewSetting.disableComponent.selectHrSupportViewSalary}
              approver={appraiser}
              isHR={true}
              updateApprover={(sup) =>
                handleUpdateHrChangeSalary(sup)
              }
            />
          </div>
        </div>
      )}
      {/* CBLĐ PHÊ DUYỆT */}
      {viewSetting.showComponent.bossApproved && (
        <div className="block-content-salary">
          <h6 className="block-content-salary__title"> {t("BossApproved")}</h6>
          <div className="block-content-salary__content">
            <HumanForReviewSalaryComponent
              isEdit={!viewSetting.disableComponent.selectHrSupportViewSalary}
              approver={approver}
              updateApprover={(sup) => handleUpdateApprovalSalary(sup)}
            />
          </div>
        </div>
      )}
      {/* List file */}
      <ul className="list-inline">
        {listFiles.map((file, index) => {
          return (
            <li className="list-inline-item" key={index}>
              <span className="file-name">
                <a
                  title={file.name}
                  href={file.link}
                  download={file.name}
                  target="_blank"
                  style={{ color: "#858796" }}
                >
                  {file.name}
                </a>
                {viewSetting.showComponent.showRemoveFile ? (
                  <i
                    className="fa fa-times remove"
                    aria-hidden="true"
                    onClick={(e) => removeFiles(file.id, index)}
                  ></i>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>
      {/* Show status */}
      {viewSetting.showComponent.stateProcess && (
        <div className="block-status">
          <span
            className={`status ${
              Constants.mappingStatusRequest[viewSetting?.currentStatus]
                ?.className
            }`}
          >
            {t(
              Constants.mappingStatusRequest[viewSetting?.currentStatus]?.label
            )}
          </span>
        </div>
      )}
      <div className="d-flex justify-content-end mb-5">
        {/* Đính kèm tệp */}
        {viewSetting.showComponent.btnAttachFile && (
          <>
            <input
              type="file"
              hidden
              id="i_files"
              name="i_files"
              onChange={(e) => handleAttachFile(e)}
              accept=".xls, .xlsx, .doc, .docx, .jpg, .png, .pdf"
              multiple
            />
            <label
              htmlFor="i_files"
              className="btn btn-light float-right shadow"
              style={{ marginBottom: "0px" }}
            >
              <i className="fas fa-paperclip"></i> {t("AttachmentFile")}
            </label>
          </>
        )}
        {/* Hủy */}
        {viewSetting.showComponent.btnCancel && (
          <button
            type="button"
            className="btn btn-secondary ml-3 shadow"
            onClick={() => handleCancel()}
          >
            <img src={IconDelete} className="mr-1" alt="cancel" />{" "}
            {t("CancelSearch")}
          </button>
        )}
        {/* Gửi yêu cầu */}
        {viewSetting.showComponent.btnSendRequest && (
          <button
            type="button"
            className="btn btn-primary ml-3 shadow"
            disabled={isLoading}
            onClick={() => handleSendForm()}
          >
            {isLoading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              <i className="fa fa-paper-plane mr-1" aria-hidden="true"></i>
            )}{" "}
            {t("Send")}
          </button>
        )}
        {/* Từ chối */}
        {viewSetting.showComponent.btnRefuse && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => handleRefuse()}
          >
            <img src={IconDelete} className="mr-1" alt="delete" />{" "}
            {t("RejectQuestionButtonLabel")}
          </button>
        )}
        {/* Thẩm định */}
        {viewSetting.showComponent.btnExpertise && (
          <button
            type="button"
            className="btn btn-primary float-right ml-3 shadow"
            onClick={() => handleConsent()}
          >
            <i className="fas fa-check" aria-hidden="true"></i> {t("Consent")}
          </button>
        )}
        {/* Không phê duyệt */}
        {viewSetting.showComponent.btnNotApprove && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => handleReject()}
          >
            <img src={IconDelete} className="mr-1" alt="reject" /> {t("Reject")}
          </button>
        )}
        {/* Phê duyệt */}
        {viewSetting.showComponent.btnApprove && (
          <button
            type="button"
            className="btn btn-success float-right ml-3 shadow"
            onClick={() => handleApprove()}
          >
            <i className="fas fa-check" aria-hidden="true"></i> {t("Approval")}
          </button>
        )}
      </div>
    </div>
  );
}

export default SalaryPropse;
