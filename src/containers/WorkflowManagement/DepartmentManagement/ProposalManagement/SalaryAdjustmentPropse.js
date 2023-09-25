/* eslint-disable react/jsx-no-target-blank */
import axios from "axios";
import moment from "moment";
import { forEach } from "lodash";
import Select from "react-select";
import { useHistory } from "react-router";
import { withTranslation } from "react-i18next";
import { Image, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import vi from "date-fns/locale/vi";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import ResultModal from "./ResultModal";
import ProposalModal from "./ProposalModal";
import ResizableTextarea from "../../../Registration/TextareaComponent";
import ConfirmationModal from "../../../Registration/ConfirmationModal";
import HumanForReviewSalaryComponent from "../../../Registration/HumanForReviewSalaryComponent";
import ConfirmPasswordModal from "../../../Registration/ContractEvaluation/SalaryPropose/ConfirmPasswordModal";
import { getCulture } from "commons/Utils";
import { useApi } from "../../../../modules/api";
import CurrencyInput from "react-currency-input-field";
import Constants from "../.../../../../../commons/Constants";
// import ProcessHistoryComponent from "./ProcessHistoryComponent";
import FilterMember from "../../ShareComponents/FilterMember";
import StatusModal from "../../../../components/Common/StatusModal";
import LoadingModal from "../../../../components/Common/LoadingModal";
import { Portal } from 'react-overlays';
import { validateFileMimeType, validateTotalFileSize } from "../../../../utils/file";

import IconDelete from "../../../../assets/img/icon/Icon_Cancel.svg";
import IconEye from "../../../../assets/img/icon/eye.svg";
import IconNotEye from "../../../../assets/img/icon/not-eye.svg";
import IconRemove from "../../../../assets/img/ic-remove.svg";
import IconAdd from "../../../../assets/img/ic-add-green.svg";

registerLocale("vi", vi);

const getStorage = (key) => localStorage.getItem(key) || '',
  EMPLOYEE_SUB_GROUP_OPTIONS = [
    { value: 'T0', label: 'T0', parentId: 'I' },
    { value: 'T1', label: 'T1', parentId: 'I' },
    { value: 'T2', label: 'T2', parentId: 'I' },
    { value: 'T3', label: 'T3', parentId: 'J' },
    { value: 'T4', label: 'T4', parentId: 'J' },
    { value: 'T5', label: 'T5', parentId: 'K' },
    { value: 'T6', label: 'T6', parentId: 'K' },
    { value: 'T7', label: 'T7', parentId: 'M' },
    { value: 'T8', label: 'T8', parentId: 'N' },
    { value: 'C1', label: 'C1', parentId: 'K' },
    { value: 'P1', label: 'P1', parentId: 'K' },
    { value: 'P2', label: 'P2', parentId: 'K' },
    { value: 'L4', label: 'L4', parentId: 'L' },
    { value: 'L5', label: 'L5', parentId: 'L' },
    { value: 'M0', label: 'M0', parentId: 'M' },
    { value: 'N0', label: 'N0', parentId: 'N' },
  ],
  CalendarContainer = ({ children }) => (
    <Portal container={document.getElementById('calendar-portal')}>
      {children}
    </Portal>
  );

const SalaryAdjustmentPropse = (props) => {
  const { t } = props;
  const api = useApi(),
    history = useHistory(),
    EMPLOYEE_GROUP_OPTIONS = [
      { value: 'I', label: `I - ${t('HighLevelManager')}` },
      { value: 'J', label: `J - ${t('MidLevelManager')}` },
      { value: 'K', label: `K - ${t('BaseLevelManager')}` },
      { value: 'L', label: `L - ${t('SeniorSpecialist')}` },
      { value: 'M', label: `M - ${t('Specialist')}` },
      { value: 'N', label: `N - ${t('Staff')}` },
    ],
    InsuranceOptions = [
      { value: 12, label: t('SalaryPropse'), requestLabel : t("SalaryAdjustmentPropse") },
      { value: 14, label: t('ProposalTransfer'), requestLabel : t("MenuProposalManagement") },
      { value: 15, label: t('ProposalAppointment'), requestLabel: t("MenuProposalManagement") },
    ],
    currentLink = window.location.href,
    isTransferProposal = currentLink.includes('/proposed-transfer/'),
    isTransferAppointProposal =
      currentLink.includes('/proposed-transfer/') ||
      currentLink.includes('/proposed-appointment/'),
    currentRequestTypeId = isTransferAppointProposal
      ? isTransferProposal
        ? 14
        : 15
      : 12;
  const [resultModal, setResultModal] = useState({
    show: false,
    title: "",
    message: "",
    isSuccess: false,
  });
  const [proposalModal, setProposalModal] = useState({ show: false, index: -1, data: null });
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
  });

  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalConfirmPassword, setModalConfirmPassword] = useState(false);
  const [accessToken, setAccessToken] = useState(
    new URLSearchParams(props.history.location.search).get("accesstoken") ||
      null
  );
  const [type, setType] = useState(InsuranceOptions.find(ele => ele.value === currentRequestTypeId));
  const [listFiles, setListFiles] = useState([]);
  const [listFileDeleted, setListFileDeleted] = useState([]);
  const [selectMembers, setSelectMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [checkedMemberIds, setCheckedMemberIds] = useState({});
  const [selectedAll, setSelectedAll] = useState(false);
  const [canSelectedll, setCanSelectedAll] = useState(true);
  const [dataSalary, setDataSalary] = useState(undefined);
  const [currencySalary, setCurrencySalary] = useState("VND");

  const [coordinator, setCoordinator] = useState(null); // Nhân sự hỗ trợ xin quyền xem lương
  const [supervisors, setSupervisors] = useState([]);
  const [employeAppraisers, setEmployeeAppraisers] = useState([]);
  const [appraiser, setAppraiser] = useState(null); // HR thẩm định quyền điều chỉnh lương
  const [approver, setApprover] = useState(null); // CBLĐ phê duyệt
  const [approverArrive, setApproverArrive] = useState(null); // CBLĐ phê duyệt
  const [isCallSalary, setIsCallSalary] = useState(false);
  const [showCommentRequiredError, setShowCommentRequiredError] = useState(false);
  const [enableSubmit, setEnableSubmit] = useState(true);
  const [viewSetting, setViewSetting] = useState({
    showComponent: {
      stateProcess: false, // Button trang thai
      btnAttachFile: false, // Button Dinh kem tep
      btnCancel: false, // Button Hủy
      btnSendRequest: false, // Button Gửi yêu cầu
      btnRefuse: false, // Button Từ chối
      btnExpertise: false, // Button Thẩm định
      btnNotApprove: false, // Button Không phê duyệt
      btnApprove: false, // Button phê duyệt
      showHrSupportViewSalary: false, // Hien thi Nhân sự hỗ trợ quyền xem lương
      showCBQL: true, // Hien thi CBQL CẤP CƠ SỞ
      showHrAssessment: true, // Hien thi Nhân sự thẩm định
      showOfficerApproved: true, // Hien thi CBLĐ PHÊ DUYỆT
      showRemoveFile: false, // Hien thi icon remove file
      showWorkersConfirm: false // Hien thị NLD xac nhan
    },
    disableComponent: {
      editSubjectApply: false, // Cho phép xem, sửa thông tin đối tượng
      selectHrSupportViewSalary: false, // Cho phep chon Nhân sự hỗ trợ quyền xem lương
      showCurrentSalary: false, // Change type text & password lương hiện tại
      showSuggestedSalary: false, // Change type text & password lương đề xuất
      showEye: false, // Hiển thị mắt xem lương
      disableAll: false,
    },
    proposedStaff: {
      avatar: "",
      account: "",
      email: "",
      employeeNo: "",
      employeeLevel: "",
      orglv2Id: "",
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
      currentAppraiserEmail: "",
    },
  });
  const [isSalaryAdjustment, setIsSalaryAdjustment] = useState(!isTransferAppointProposal);
  const isSalaryPropose =
      dataSalary?.requestTypeId === Constants.SALARY_PROPOSE ||
      isSalaryAdjustment,
    id = props?.match?.params?.id,
    isCreate = id === "create";

  useEffect(() => {
    if (id) {
      if (!isCreate) { // Review mode
        setIsCreateMode(false);
        getDataSalary();
      } else { // Create mode
        setIsCreateMode(true);
        checkViewCreate();
      }
    } else {
      props.history.push("proposal-management");
    }

    const queryParams = new URLSearchParams(props.history.location.search);
    if (queryParams.has("accesstoken")) {
      queryParams.delete("accesstoken");
      props.history.replace({ search: queryParams.toString() });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedMembers?.length > 0 && isCallSalary == false && accessToken) {
      getSalary(accessToken);
    }
  }, [selectedMembers]);

  const getDataSalary = async () => {
    try {
      setIsLoading(true);
      const { data: { data: response } } = await api.fetchSalaryPropose(id);
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
    viewSettingTmp.showComponent.btnAttachFile = true;
    viewSettingTmp.showComponent.btnSendRequest = true;
    viewSettingTmp.showComponent.showHrSupportViewSalary = true;
    viewSettingTmp.showComponent.showRemoveFile = true;
    viewSettingTmp.disableComponent.editSubjectApply = true;
    viewSettingTmp.disableComponent.selectHrSupportViewSalary = true;

    viewSettingTmp.proposedStaff.avatar = getStorage("avatar");
    viewSettingTmp.proposedStaff.account = getStorage("email").split("@")[0] || "";
    viewSettingTmp.proposedStaff.email = getStorage("email");
    viewSettingTmp.proposedStaff.company_email = getStorage("plEmail");
    viewSettingTmp.proposedStaff.employeeNo = getStorage("employeeNo");
    viewSettingTmp.proposedStaff.employeeLevel = getStorage("employeeLevel");
    viewSettingTmp.proposedStaff.fullName = getStorage("fullName");
    viewSettingTmp.proposedStaff.jobTitle = getStorage("jobTitle");
    viewSettingTmp.proposedStaff.department = getStorage("department");
    viewSettingTmp.proposedStaff.orgLv2Id = getStorage("organizationLv2");
    viewSettingTmp.proposedStaff.orgLv3Id = getStorage("organizationLv3");
    viewSettingTmp.proposedStaff.orgLv4Id = getStorage("organizationLv4");
    viewSettingTmp.proposedStaff.orgLv5Id = getStorage("organizationLv5");
    viewSettingTmp.proposedStaff.orgLv6Id = getStorage("organizationLv6");
    viewSettingTmp.proposedStaff.orgLv2Text = getStorage("company");
    viewSettingTmp.proposedStaff.orgLv3Text = getStorage("division");
    viewSettingTmp.proposedStaff.orgLv4Text = getStorage("region");
    viewSettingTmp.proposedStaff.orgLv5Text = getStorage("unit");
    viewSettingTmp.proposedStaff.orgLv6Text = getStorage("part");
    viewSettingTmp.proposedStaff.companyCode = getStorage("companyCode");
    setViewSetting(viewSettingTmp);
  };

  const checkAuthorize = (dataSalaryInfo) => {
    const currentEmail = getStorage("email"),
      { requestAppraisers, processStatusId, userId, supervisorId, salaryAdjustments, userProfileDocuments } = dataSalaryInfo,
      indexAppraiser = requestAppraisers?.findIndex(app => app.status === Constants.SALARY_APPRAISER_STATUS.WAITING),
      isCurrentAppraiser = indexAppraiser !== -1 && currentEmail.toLowerCase() === requestAppraisers[indexAppraiser].appraiserId?.toLowerCase(),
      typeAppraise = indexAppraiser !== -1 && requestAppraisers[indexAppraiser].type,
      currentUserAppraiser = requestAppraisers?.find((ele) => ele.appraiserId?.toLowerCase() === currentEmail.toLowerCase() && [2, 3].includes(ele?.type));

    let viewSettingTmp = { ...viewSetting }, currentStatus = processStatusId;

    viewSettingTmp.showComponent.stateProcess = true;

    switch (processStatusId) {
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
        viewSettingTmp.proposedStaff.avatar = getStorage("avatar");
        viewSettingTmp.proposedStaff.account = getStorage("email").split("@")[0] || "";
        viewSettingTmp.proposedStaff.email = getStorage("email");
        viewSettingTmp.proposedStaff.company_email = getStorage("plEmail");
        viewSettingTmp.proposedStaff.employeeNo = getStorage("employeeNo");
        viewSettingTmp.proposedStaff.employeeLevel = getStorage("employeeLevel");
        viewSettingTmp.proposedStaff.fullName = getStorage("fullName");
        viewSettingTmp.proposedStaff.jobTitle = getStorage("jobTitle");
        viewSettingTmp.proposedStaff.department = getStorage("department");
        viewSettingTmp.proposedStaff.orgLv2Id = getStorage("organizationLv2");
        viewSettingTmp.proposedStaff.orgLv3Id = getStorage("organizationLv3");
        viewSettingTmp.proposedStaff.orgLv4Id = getStorage("organizationLv4");
        viewSettingTmp.proposedStaff.orgLv5Id = getStorage("organizationLv5");
        viewSettingTmp.proposedStaff.orgLv6Id = getStorage("organizationLv6");
        viewSettingTmp.proposedStaff.orgLv2Text = getStorage("company");
        viewSettingTmp.proposedStaff.orgLv3Text = getStorage("division");
        viewSettingTmp.proposedStaff.orgLv4Text = getStorage("region");
        viewSettingTmp.proposedStaff.orgLv5Text = getStorage("unit");
        viewSettingTmp.proposedStaff.orgLv6Text = getStorage("part");
        viewSettingTmp.proposedStaff.companyCode = getStorage("companyCode");
        currentStatus = 0; 
        break;
      // Đang chờ nhân sự điều phối & Đang chờ nhân sự thẩm định người xem lương
      case 21:
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        if (accessToken) {
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
        }
        currentStatus = 0
        break;
      // Đang chờ QLTT nhập lương đề xuất, xem lương hiện tại
      case 22:
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        viewSettingTmp.disableComponent.showEye = true;
        if (
          currentEmail.toLowerCase() === userId?.toLowerCase() &&
          props.match.params.type === "request"
        ) {
          viewSettingTmp.showComponent.btnCancel = true;
          viewSettingTmp.showComponent.btnSendRequest = true;
          viewSettingTmp.disableComponent.editSubjectApply = true;
          viewSettingTmp.disableComponent.showEye = true;
        }
        if (accessToken) {
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
          viewSettingTmp.disableComponent.showEye = true;
        }
        currentStatus = 0;
        break;
      // Đang chờ CBQL Cấp cơ sở thẩm định
      case 8:
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        viewSettingTmp.disableComponent.showEye = true;
        if (
          isCurrentAppraiser && props.match.params.type === "assess"
        ) {
          if( typeAppraise === 0 ) { // nhan vien tham dinh
            viewSettingTmp.showComponent.showWorkersConfirm = true;
            viewSettingTmp.proposedStaff.currentAppraiserEmail = requestAppraisers[indexAppraiser].appraiserId?.toLowerCase();
          } else { // CBLD tham dinh
            viewSettingTmp.showComponent.btnRefuse = true;
            viewSettingTmp.showComponent.btnExpertise = true;
            viewSettingTmp.disableComponent.showEye = true;
          }
        } else if(props.match.params.type != "request") {
            currentStatus = 20;
        }
        if (accessToken) {
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
          viewSettingTmp.disableComponent.showEye = true;
        }
        break;
      // Đang chờ nhân sự thẩm định lương đề xuất
      case 24:
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        viewSettingTmp.disableComponent.showEye = true;
        if (
          currentEmail.toLowerCase() === supervisorId?.toLowerCase() &&
          props.match.params.type === "assess"
        ) {
          viewSettingTmp.showComponent.btnRefuse = true;
          viewSettingTmp.showComponent.btnExpertise = true;
          viewSettingTmp.disableComponent.showEye = true;
        }
        if (accessToken) {
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
          viewSettingTmp.disableComponent.showEye = true;
        }
        break;
      // Đang chờ CBLĐ phê duyệt
      case 5:
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        viewSettingTmp.disableComponent.showEye = true;
        if (
          isCurrentAppraiser && props.match.params.type === "approval"
        ) {
          viewSettingTmp.showComponent.btnNotApprove = true;
          viewSettingTmp.showComponent.btnApprove = true;
          viewSettingTmp.disableComponent.showEye = true;
        }
        if (accessToken) {
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
          viewSettingTmp.disableComponent.showEye = true;
        }
        break;
      // View phe duyet thanh cong
      case 2:
        // viewSettingTmp.disableComponent.showEye = true;
        // break;
      // Case từ chối
      case 7:
        // viewSettingTmp.disableComponent.showEye = true;
        // break;
      // Case không phê duyệt
      case 1:
        viewSettingTmp.showComponent.stateProcess = true;
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        viewSettingTmp.disableComponent.showEye = true;
        break;
      default:
        break;
    }
    // viewSettingTmp.proposedStaff.fullName = dataSalaryInfo?.user?.fullName;
    // viewSettingTmp.proposedStaff.jobTitle = dataSalaryInfo?.user?.jobTitle;
    // viewSettingTmp.proposedStaff.department = dataSalaryInfo?.user?.department;
    viewSettingTmp.currentStatus = currentStatus; 
    const requestInfo = dataSalaryInfo;

    //QLTT
    if(requestInfo.requestInfo && processStatusId != 20) {
      const userInfo = JSON.parse(requestInfo.userInfo);
      viewSettingTmp.proposedStaff = Object.assign(viewSettingTmp.proposedStaff,userInfo);
    }
    // Nhân sự điều phối
    if (requestInfo?.coordinatorInfo)
      setCoordinator({
        ...JSON.parse(requestInfo?.coordinatorInfo)
      });
    // Thong tin CBNV
    const memberCheck = {};
    let canCheckAll = false;
    let userLoginNo = getStorage("employeeNo"), isEmployeeLogin = false;
    let employeeLists = salaryAdjustments?.map((u) => {
      u.accepted = u.status ? true : false;
      const requestTmp = JSON.parse(u?.employeeInfo);
      memberCheck[requestTmp?.employeeNo] = {
        uid: requestTmp?.employeeNo,
        checked: false,
        canChangeAction: u?.accepted == true,
      };
      canCheckAll = canCheckAll || u?.accepted == true;
      if (
        userLoginNo == requestTmp?.employeeNo &&
        !([2, 3].includes(currentUserAppraiser?.type))
      ) {
        isEmployeeLogin = true;
      }
      return {
        id: u?.id,
        uid: requestTmp?.employeeNo,
        employeeNo: requestTmp?.employeeNo,
        employeeLevel: requestTmp?.employeeLevel,
        account: requestTmp?.account,
        fullName: requestTmp?.fullName,
        fullname: requestTmp?.fullName,
        jobTitle: requestTmp?.jobTitle,
        startDate: requestTmp?.startDate,
        expireDate: requestTmp?.expireDate,
        contractName: requestTmp?.contractName,
        contractType: requestTmp?.contractType,
        department: requestTmp?.department,
        organizationList: requestTmp?.organizationList,
        currentSalary: "0",
        suggestedSalary: "0",
        effectiveTime: u?.startDate
          ? moment(u?.startDate).format(Constants.LEAVE_DATE_FORMAT)
          : "",
        requestTypeId: u?.requestTypeId,
        proposedPosition: requestTmp?.proposedPosition,
        proposedPositionCode: requestTmp?.proposedPositionCode,
        proposedDepartment: requestTmp?.proposedDepartment,
        proposedDepartmentCode: requestTmp?.proposedDepartmentCode,
        proposedLevel: EMPLOYEE_SUB_GROUP_OPTIONS.find(ele => ele.value === requestTmp?.proposedRank) || {},
        proposedLevelGroup: EMPLOYEE_GROUP_OPTIONS.find(ele => ele.value === requestTmp?.proposedRankGroupId) || {},
        strength: u?.staffStrengths || requestTmp?.staffStrengths,
        weakness: u?.staffWknesses || requestTmp?.staffWknesses,
        canChangeAction: u?.accepted == true,
        accepted: u?.accepted,
        comment: u.comment
      };
    });
    if(isEmployeeLogin) {
      employeeLists = employeeLists.map(u => {
        const shouldHide = userLoginNo != u?.employeeNo;
        return {
          ...u,
          shouldHide: shouldHide
        }
      })
    }
   
    setCanSelectedAll(canCheckAll);
    setCheckedMemberIds(memberCheck);
    setSelectedMembers(employeeLists);

    // CBQL cấp cơ sở
    if (requestAppraisers?.length > 0) {
      const _supervisors = [];
      const _employeeAppraiser = [];
      requestAppraisers.map(item => {
        const _itemInfo = JSON.parse(item.appraiserInfo);
        if(_itemInfo.type === Constants.STATUS_PROPOSAL.EMPLOYEE_APPRAISER) { // HR thẩm định quyền điều chỉnh lương
          setAppraiser({
            ..._itemInfo,
            uid: _itemInfo?.employeeNo,
            employeeNo: _itemInfo?.employeeNo,
            requestHistoryId: item.requestHistoryId,
            appraiserComment: item?.appraiserComment,
          });
        } else if(_itemInfo.type === Constants.STATUS_PROPOSAL.LEADER_APPRAISER) {
          _supervisors.push({
            ..._itemInfo,
            uid: _itemInfo?.employeeNo,
            employeeNo: _itemInfo?.employeeNo,
            requestHistoryId: item.requestHistoryId,
            appraiserComment: item?.appraiserComment,
          })
        } else if (_itemInfo.type == Constants.STATUS_PROPOSAL.EMPLOYEE) {
          const _employeeInfo = employeeLists.find((ele) => ele.uid == _itemInfo.employeeNo);
          if(_employeeInfo) {
            _employeeInfo.appraiserComment = item?.appraiserComment;
            _employeeAppraiser.push(_employeeInfo)
          }
        }
      })
      setSupervisors(_supervisors);
      setEmployeeAppraisers(_employeeAppraiser);
    }
    // CBLĐ phê duyệt
    if (requestAppraisers?.length > 0) {
      const [approverRes, approverArriveRes] = requestAppraisers.filter((ele) => ele.type === Constants.STATUS_PROPOSAL.CONSENTER);
      const approvalData = JSON.parse(approverRes?.appraiserInfo || "{}"),
        approverArriveData = JSON.parse(approverArriveRes?.appraiserInfo || "{}");

      setApprover({
        ...approvalData,
        uid: approvalData?.employeeNo,
        employeeNo: approvalData?.employeeNo,
        appraiserComment: approverRes?.appraiserComment,
      });
      setApproverArrive({
        ...approverArriveData,
        uid: approverArriveData?.employeeNo,
        employeeNo: approverArriveData?.employeeNo,
        appraiserComment: approverArriveRes?.appraiserComment,
      });
    }
    const requestDocuments = (userProfileDocuments || []).map((u) => ({
      id: u.id,
      name: u.fileName,
      link: u.fileUrl,
    })) || [];

    setIsSalaryAdjustment(dataSalaryInfo?.isSalaryAdjustment || false);
    setListFiles(requestDocuments);
    setViewSetting(viewSettingTmp);
  };

  const handleSelectMembers = (members) => {
    const memberCheck = {},
      orgsNames = ['division', 'department', 'unit', 'part'];
    let memberIds = [];
    const membersMapping = members.map((u) => {
      memberCheck[u.uid] = {
        uid: u.uid,
        checked: false,
        canChangeAction: u?.accepted == true,
      };

      let organizationList = u['pnl'];
       orgsNames.map((key) => {
         if (u[key] && u[key] != '#') organizationList += '/' + u[key];
       });
      memberIds.push(u?.uid + '');
      return {
        uid: u?.uid,
        employeeNo: u?.uid,
        employeeLevel: u?.employeeLevel,
        account: u?.username.toLowerCase(),
        username: u?.username.toLowerCase(),
        fullName: u?.fullname,
        jobTitle: u?.title,
        startDate: "",
        expireDate: "",
        contractName: u?.contractName,
        contractType: u?.contractType,
        department: u?.department,
        division: u?.division,
        unit: u?.unit,
        organizationList,
        currentSalary: "",
        suggestedSalary: "",
        effectiveTime: "",
        strength: "",
        weakness: "",
        accepted: true,
      }
    });
    setCheckedMemberIds(memberCheck);
    setSelectMembers(membersMapping);
    setEmployeeAppraisers(membersMapping.map(res => {
      res.department = res.division + (res.department ? '/' + res.department : '') + (res.unit ? '/' + res.unit : '');
      return res;
    }));
    let _supervisors = supervisors.filter(sup => !memberIds.includes(sup?.uid));
    setSupervisors(_supervisors);
  };

  const handleSelectedMembers = (members) => {
    const memberCheck = {};
    const membersMapping = members.map((u) => {
      memberCheck[u.uid] = {
        uid: u.uid,
        checked: false,
        canChangeAction: u?.accepted == true,
      };

      return {
        uid: u?.uid,
        employeeNo: u?.uid,
        employeeLevel: u?.employeeLevel,
        account: u?.username.toLowerCase(),
        fullName: u?.fullname,
        jobTitle: u?.job_name,
        startDate: "",
        expireDate: "",
        contractName: u?.contractName,
        contractType: u?.contractType,
        department: u?.department,
        currentSalary: "",
        suggestedSalary: "",
        effectiveTime: "",
        strength: "",
        weakness: "",
        accepted: true,
      }
    });
    setCheckedMemberIds(memberCheck);
    setSelectedMembers(membersMapping);
  };

  const onSelectAll = (e) => {
    const value = e.target.checked;
    const newCheckedMemeberIds = {};
    Object.values(checkedMemberIds).map((item) => {
      newCheckedMemeberIds[item.uid] = item.canChangeAction ? { ...item, checked: value } : item;
    });
    setCheckedMemberIds(newCheckedMemeberIds);
    setSelectedAll(value);
  };

  const onCheckboxSelectChange = (e, uid) => {
    const value = e.target.checked;
    let checkall = true;
    const newCheckedMemeberIds = {};
    Object.values(checkedMemberIds).map((item) => {
      newCheckedMemeberIds[item.uid] = item.uid == uid ? { ...item, checked: value } : item;
      checkall = checkall && (newCheckedMemeberIds[item.uid].checked || item.canChangeAction == false);
    });
    setCheckedMemberIds(newCheckedMemeberIds);
    setSelectedAll(checkall);
  };

  const onActionChangeAll = (accepted = true) => {
    let _enableSubmit = true;
    const _selectedMembers = selectedMembers.map((item) => {
      if (checkedMemberIds[item.uid]?.checked == true) {
        _enableSubmit = accepted;
        return { ...item, accepted };
      }
      return item;
    });
    setSelectedMembers(_selectedMembers);
    setEnableSubmit(_enableSubmit);
  };

  const onActionChange = (uid, accepted = true) => {
    const _selectedMembers = selectedMembers.map((item) =>
        item.uid == uid ? { ...item, accepted } : item
      ),
      _enableSubmit = _selectedMembers.some((item) => {
        return (
          (viewSetting.showComponent.btnExpertise ||
            viewSetting.showComponent.btnApprove) &&
          !isCreateMode &&
          item.canChangeAction &&
          item?.accepted
        );
      });

    setEnableSubmit(_enableSubmit);
    setSelectedMembers(_selectedMembers);
  };

  const handleTextInputChange = (value, uid, objName) => {
    if (isCreate) {
      const selectMembersTmp = [...selectMembers];
      selectMembersTmp.forEach((item) => {
        if (item.uid === uid) item[objName] = value;
      });
      setSelectMembers(selectMembersTmp);
    } else {
      const selectedMembersTmp = [...selectedMembers];
      selectedMembersTmp.forEach((item) => {
        if (item.uid === uid) item[objName] = value;
      });
      setSelectedMembers(selectedMembersTmp);
    }
  };

  const handleDatePickerInputChange = (value, uid, objName) => {
    if (isCreate) {
      const selectMembersTmp = [...selectMembers];
      selectMembersTmp.forEach((item) => {
        if (item.uid === uid) {
          item[objName] = moment(value, "DD-MM-YYYY").isValid() ? moment(value, Constants.LEAVE_DATE_FORMAT) : "";
        }
      });
      setSelectMembers(selectMembersTmp);
    } else {
      const selectedMembersTmp = [...selectedMembers];
      selectedMembersTmp.forEach((item) => {
        if (item.uid === uid) {
          item[objName] = moment(value, "DD-MM-YYYY").isValid() ? moment(value, Constants.LEAVE_DATE_FORMAT) : "";
        }
      });
      setSelectedMembers(selectedMembersTmp);
    }
  };

  const handleShowCurrentSalary = () => {
    if (isCallSalary) {
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
    } else if (!viewSetting.disableComponent.showCurrentSalary) {
      getSalary(accessToken);
    }
  };

  // const handleShowSuggestedSalary = () => {
  //   if (!accessToken) {
  //     setModalConfirmPassword(true);
  //   } else if (!viewSetting.disableComponent.showSuggestedSalary) {
  //     getSalary(accessToken);
  //   }
  // };

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
          id: id,
          requestTypeId: currentRequestTypeId,
          sub: [
            {
              id: id,
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
          id: id,
          requestTypeId: currentRequestTypeId,
          sub: [
            {
              id: id,
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
  const handleCancel = () => history.push("/tasks");

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
    // Todo: handle remove file
    let listFilesTmp = [...listFiles].filter((item, i) => i !== index);
    if(id) {
      setListFileDeleted([...listFileDeleted, id]);
    }
    setListFiles(listFilesTmp);
  };

  // Thẩm định
  const handleConsent = () => {
    if (selectedMembers.some(item => item.canChangeAction && !item.accepted && !item.comment)) {
      return setShowCommentRequiredError(true);
    }
    let staffRequestStatusList = selectedMembers?.map(item => ({
      employeeNo: item.uid,
      salaryAdjustmentId: item.id,
      status: item.accepted ? 1 : 0,
      comment: item.comment || ''
    }));
    setConfirmModal({
      isShowModalConfirm: true,
      modalTitle: t("ConsentConfirmation"),
      modalMessage: t("ConfirmConsentRequest"),
      typeRequest: Constants.STATUS_CONSENTED,
      confirmStatus: "",
      dataToUpdate: [
        {
          id: id,
          requestTypeId: currentRequestTypeId,
          sub: [
            {
              id: id,
              processStatusId: 5,
              comment: "",
              status: "",
              staffRequestStatusList,
            },
          ],
        },
      ],
    });
  };

  // luồng từ chối/ thẩm định cho NLD xac nhan
  const handleConfirmEmployee = (isConsent) => {
    let indexCurrentAppraiser = undefined;
    const { currentAppraiserEmail } = viewSetting?.proposedStaff,
      staffRequestStatusList = selectedMembers?.map((item, index) =>{
        if (currentAppraiserEmail === item.account) {
          indexCurrentAppraiser = index;
          item.accepted = isConsent;
        }

        return {
          employeeNo: item.uid,
          salaryAdjustmentId: item.id,
          status: item.accepted ? 1 : 0,
          comment: item.comment || ''
        };
      });
    setConfirmModal({
      isShowModalConfirm: true,
      modalTitle: isConsent ? t("ConsentConfirmation") : t("RejectConsenterRequest"),
      modalMessage: isConsent ? t("ConfirmConsentRequest") : t("ReasonRejectRequest"),
      typeRequest: isConsent ? Constants.STATUS_TRANSFER : Constants.STATUS_TRANSFER_REFUSE,
      confirmStatus: "",
      indexCurrentAppraiser,
      dataToUpdate: [
        {
          id: id,
          requestTypeId: currentRequestTypeId,
          sub: [
            {
              id: id,
              processStatusId: isConsent ? 5 : 7,
              comment: "",
              status: "",
              staffRequestStatusList,
            },
          ],
        },
      ],
    });
  }

  // Phê duyệt
  const handleApprove = () => {
    if (selectedMembers.some(item => item.canChangeAction && !item.accepted && !item.comment)) {
      return setShowCommentRequiredError(true);
    }
    let staffRequestStatusList = selectedMembers?.map(item => ({
      employeeNo: item.uid,
      salaryAdjustmentId: item.id,
      status: item.accepted ? 1 : 0,
      comment: item.comment || ''
    }))
    setConfirmModal({
      isShowModalConfirm: true,
      modalTitle: t("ApproveRequest"),
      modalMessage: t("ConfirmApproveChangeRequest"),
      typeRequest: Constants.STATUS_APPROVED,
      confirmStatus: "",
      dataToUpdate: [
        {
          id: id,
          requestTypeId: currentRequestTypeId,
          sub: [
            {
              id: id,
              processStatusId: 2,
              comment: "",
              status: "",
              staffRequestStatusList,
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
      if (selectMembers.length === 0 && selectedMembers.length == 0) {
        return showStatusModal(t("ProposedEmployeeValidate"), false);
      }
      if (!coordinator && isSalaryAdjustment) {
        return showStatusModal(t("HumanForReviewSalaryValidate"), false);
      }
      if (!appraiser) {
        return showStatusModal(t("HumanForChangeSalaryValidate"), false);
      }
      if (!approver) {
        return showStatusModal(isTransferProposal ? `${t("PleaseInputApprover")} (${t("Sent")})` : t("PleaseInputApprover"), false);
      }
      if (!approverArrive && isTransferProposal) {
        return showStatusModal(`${t("PleaseInputApprover")} (${t("Arrive")})`, false);
      }
      
      if(isTransferAppointProposal) {
        const listErrors = validateAppoitment();
        if (listErrors.length !== 0) {
          return showStatusModal(listErrors[0], false);
        }
      }
      setIsLoading(true);

      const bodyFormData = prepareDataToSubmit( isCreate ? null : id ),
        params = {
          data: bodyFormData,
          params: { culture: getCulture() },
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${getStorage('accessToken')}`,
          },
        };

      (isCreate ? 
        axios({ // Tạo mới yêu cầu isTransferAppointProposal ? đề xuất điều chuyển : đề xuất lương
          method: "POST",
          url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}${isTransferAppointProposal ? 'appointment' : 'request'}`,
          ...params,
        })
        :
        axios({ //update yêu cầu salaryadjustment
          method: "PUT",
          url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}salaryadjustment`,
          ...params,
        })
      )
        .then((response) => {
          if (response.data.result && response.data.result.code === "000000") {
            return showStatusModal(t("RequestSent"), true, "/tasks");
          }
          showStatusModal(response.data.result.message || t("Error"), false);
        })
        .catch((response) => showStatusModal(t("Error"), false))
        .finally(() => setIsLoading(false));
    } else {
      // Review
      if (dataSalary?.processStatusId === 22) {
        const listErrors = validation();
        if (listErrors.length !== 0) {
          return setResultModal({
            show: true,
            title: t("InformationRequired"),
            message: listErrors[0],
            isSuccess: false,
          });
        } else {
          setIsLoading(true);
          const dataSend = {
            requestHistoryId: id,
            companyCode: getStorage("companyCode"),
            staffSalaryUpdate: selectedMembers.map((u) => ({
              salaryAdjustmentId: u?.id,
              employeeNo: u?.employeeNo,
              currentSalary: u?.currentSalary,
              suggestedSalary: u?.suggestedSalary,
              contractType: u?.contractType,
              ...(isTransferAppointProposal ? {
                proposedPositionCode: u?.proposedPositionCode,
                proposedPosition: u?.proposedPosition,
                proposedDepartment: u?.proposedDepartment,
                proposedDepartmentCode: u?.proposedDepartmentCode,
                proposedRank: u?.proposedLevel?.value || "",
                proposedRankGroupId: u?.proposedLevelGroup?.value || "",
                proposedRankGroupName: u?.proposedLevelGroup?.label || "",
                current_position: u?.employeeLevel,
              } : {}),
              staffStrengths: u?.strength,
              staffWknesses: u?.weakness,
              startDate: moment(
                u?.effectiveTime,
                Constants.LEAVE_DATE_FORMAT
              ).format("YYYY-MM-DD"),
            })),
          };
          axios({
            method: "POST",
            url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}salaryadjustment/submitsalary`,
            params: {
              culture: getCulture()
            },
            data: dataSend,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getStorage("accessToken")}`,
            },
          })
            .then((response) => {
              if (
                response.data.result &&
                response.data.result.code === "000000"
              ) {
                return showStatusModal(t("RequestSent"), true, "/tasks");
              }
              showStatusModal(
                response.data.result.message || t("Error"),
                false
              );
            })
            .catch((response) => showStatusModal(t("Error"), false))
            .finally(() => setIsLoading(false));
        }
      }
    }
  };

  const prepareDataToSubmit = (id) => {
    if (isCreateMode) {
      let bodyFormData = new FormData(),
        appIndex = 1;
      const employeeInfoLst = (id ? selectedMembers : selectMembers).map((u) => ({
        employeeNo: u?.employeeNo,
        username: u?.account.toLowerCase(),
        account: u?.account.toLowerCase().includes('@vingroup.net') ? u?.account.toLowerCase() : u?.account.toLowerCase() + "@vingroup.net",
        fullName: u?.fullName,
        jobTitle: u?.jobTitle,
        employeeLevel: u?.employeeLevel,
        department: u?.department,
        organizationList: u?.organizationList,
        startDate: u?.startDate || moment(u?.effectiveTime, Constants.LEAVE_DATE_FORMAT).format("YYYY-MM-DD") || "",
        expireDate: u?.expireDate,
        contractName: u?.contractName,
        contractType: u?.contractType,
        ...(isTransferAppointProposal ? {
          proposedPositionCode: u?.proposedPositionCode,
          proposedPosition: u?.proposedPosition,
          proposedDepartment: u?.proposedDepartment,
          proposedDepartmentCode: u?.proposedDepartmentCode,
          proposedRank: u?.proposedLevel?.value || "",
          proposedRankGroupId: u?.proposedLevelGroup?.value || "",
          proposedRankGroupName: u?.proposedLevelGroup?.label || "",
          current_position: u?.employeeLevel,
        } : {}),
        staffStrengths: u?.strength,
        staffWknesses: u?.weakness,
      })),
      staffInfoLst = (employeAppraisers).map((u, i) => {
        return {
          avatar: '',
          account: `${u?.account}@vingroup.net`,
          fullName: u?.fullName,
          employeeLevel: u?.employeeLevel,
          pnl: u?.pnl,
          orglv2Id: u?.orglv2Id,
          current_position: u?.currentPosition || u?.jobTitle,
          department: u?.department,
          order: appIndex++,
          company_email: u?.companyEmail,
          type: Constants.STATUS_PROPOSAL.EMPLOYEE,
          employeeNo: u?.uid || u?.employeeNo,
          username: u?.username,
        };
      }),
      appraiserInfoLst = supervisors
        .filter((item) => item != null)
        .map((item, index) => ({
          avatar: "",
          account: item?.username.toLowerCase() + "@vingroup.net",
          fullName: item?.fullName,
          employeeLevel: item?.employeeLevel,
          pnl: item?.pnl,
          orglv2Id: item?.orglv2Id,
          current_position: item?.current_position,
          department: item?.department,
          order: appIndex++,
          company_email: item?.company_email?.toLowerCase(),
          type: Constants.STATUS_PROPOSAL.LEADER_APPRAISER,
          employeeNo: item?.uid || item?.employeeNo,
          username: item?.username.toLowerCase(),
        }));
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
          order: appIndex++,
          company_email: appraiser?.company_email?.toLowerCase(),
          type: Constants.STATUS_PROPOSAL.EMPLOYEE_APPRAISER,
          employeeNo: appraiser?.uid || appraiser?.employeeNo,
          username: appraiser?.username?.toLowerCase(),
        });
      }

      const approverInfoLst = [
        approver,
        ...(!!approverArrive ? [approverArrive] : []),
      ].map((ele, i) => ({
        avatar: "",
        account: ele?.username?.toLowerCase() + "@vingroup.net",
        fullName: ele?.fullName,
        employeeLevel: ele?.employeeLevel,
        pnl: ele?.pnl,
        orglv2Id: ele?.orglv2Id,
        current_position: ele?.current_position,
        department: ele?.department,
        order: appIndex++,
        company_email: ele?.company_email?.toLowerCase(),
        type: Constants.STATUS_PROPOSAL.CONSENTER,
        employeeNo: ele?.uid || ele?.employeeNo,
        username: ele?.username?.toLowerCase(),
      }))

      bodyFormData.append("userId", viewSetting.proposedStaff.email);
      bodyFormData.append(
        "userInfo",
        JSON.stringify({
          employeeNo: viewSetting.proposedStaff.employeeNo,
          avatar: viewSetting.proposedStaff.avatar,
          account:
            viewSetting.proposedStaff.account?.toLowerCase() + "@vingroup.net",
          fullName: viewSetting.proposedStaff.fullName,
          employeeLevel: viewSetting.proposedStaff.employeeLevel,
          orglv2Id: viewSetting.proposedStaff.orgLv2Id,
          jobTitle: viewSetting.proposedStaff.jobTitle,
          department: viewSetting.proposedStaff.department,
          company_email: viewSetting.proposedStaff.company_email,
        })
      );
      if(isSalaryPropose) {
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
      }
      bodyFormData.append("employeeInfoLst", JSON.stringify(employeeInfoLst));
      bodyFormData.append("appraiserInfoLst", JSON.stringify(appraiserInfoLst));
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
      bodyFormData.append("staffInfoLst", JSON.stringify(staffInfoLst));
      bodyFormData.append("approverInfoLst", JSON.stringify(approverInfoLst));
      bodyFormData.append("requestTypeId", currentRequestTypeId)

      if(!!id) {
        bodyFormData.append("id", id);
      } else {
        bodyFormData.append("isSalaryAdjustment", isSalaryAdjustment);
        bodyFormData.append("formType", 2);
      }

      if (listFiles.filter(item=> item.id == undefined).length > 0) {
        listFiles.filter(item=> item.id == undefined).forEach((file) => {
          bodyFormData.append("attachedFiles", file);
        });
      }
      bodyFormData.append('deletedDocumentIds', listFileDeleted.join(','));
      bodyFormData.append('culture', getCulture());

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

  const handleUpdateCoordinator = (approver, isApprover) => {
    setCoordinator(approver);
  };

  const removeEmployeAppraisers = (uid) => {
    setEmployeeAppraisers(employeAppraisers.filter(ele => ele.uid !== uid));
  }

  const removeSupervisorItem = (index) => {
    const newData = [...supervisors];
    newData.splice(index, 1);
    setSupervisors(newData);
  };

  const handleUpdateSupervisors = (approver, index) => {
    let userExist = [ ...employeAppraisers,...supervisors].findIndex(
      (item) => approver?.uid && item?.uid == approver?.uid
    );
    if (userExist != -1) {
      return showStatusModal(t("AppraiserExisted"), false);
    }
    const newData = [...supervisors];
    newData[index] = approver;
    setSupervisors(newData);
  };

  const handleUpdateHrChangeSalary = (approver) => setAppraiser(approver);

  const handleUpdateApprovalSalary = (approver) => setApprover(approver);

  const handleUpdateApprovalArriveSalary = (approver) => setApproverArrive(approver);

  const validation = () => {
    const selectedMembersTmp = [...selectedMembers];
    let errors = [];
    selectedMembersTmp.forEach((u) => {
      if (!u.currentSalary) errors.push(t("CurrentSalaryValidate"));
      if (!u.suggestedSalary) errors.push(t("SuggestedSalaryValidate"));
      if (!u.effectiveTime) errors.push(t("SelecTimePeriodValidate"));
    });
    return errors;
  };

  const validateAppoitment = () => {
    const selectedMembersTmp = [...selectMembers],
      proposedPositionCodes = selectedMembersTmp.map(ele => ele?.proposedPositionCode).filter(ele => ele !== undefined);
    let errors = [];
    selectedMembersTmp.forEach((u) => {
      if(isTransferAppointProposal) {
        if(isTransferProposal) {
          if (!u.proposedPositionCode) errors.push(t("ProposedEmployeeEmpty"));
          if (!!u.proposedLevelGroup && !u.proposedLevel) errors.push(t("ProposedEmployeeLevelRequired"));
        } else {
          if (!u.proposedLevelGroup || !u.proposedLevel) errors.push(t("ProposedEmployeeLevelEmpty"));
        }
      }

      if (!u.effectiveTime) errors.push(t("SelecTimePeriodValidate"));
      if (!!u?.proposedPositionCode && proposedPositionCodes.filter(ele => ele === u?.proposedPositionCode).length > 1) {
        errors.push(t("ProposedPositionCodeDuplicate"));
      }
    });
    return errors;
  }

  const handleChangeModalConfirmPassword = (token) => {
    setAccessToken(token);
    setModalConfirmPassword(false);
    getSalary(token);
  };

  const getSalary = (token) => {
    const dataSend = {
      requestHistoryId: id,
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
        Authorization: `Bearer ${getStorage("accessToken")}`,
      },
    })
      .then((response) => {
        if (response.data.result && response.data.result.code === "000000") {
          const selectedMembersTmp = [...selectedMembers];
          let currencySalaryTmp = "VND";
          forEach(response.data.data, (value, key) => {
            selectedMembersTmp.forEach((u) => {
              if (u.id == key) {
                u.currentSalary = value?.currentSalary || "";
                u.suggestedSalary = value?.suggestedSalary || "";
                currencySalaryTmp = value?.currentCurrency || "VND";
              }
            });
          });
          setSelectedMembers(selectedMembersTmp);
          setCurrencySalary(currencySalaryTmp);

          let viewSettingTmp = { ...viewSetting };
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          setViewSetting(viewSettingTmp);
          return;
        }
        showStatusModal(response.data.result.message || t("Error"), false);
      })
      .catch((response) => showStatusModal(t("Error"), false))
      .finally(() => {
        setIsLoading(false);
        setIsCallSalary(true);
      });
  };

  const hideResultModal = () => {
    setResultModal({
      show: false,
      title: "",
      message: "",
      isSuccess: false,
    });
  };

  const handleClickProposal = (index) => {
    setProposalModal({ show: true, index, data: selectMembers[index] });
  }

  const hideProposalModal = () => {
    setProposalModal({ show: false });
  };

  const handleAcceptProposal = ({
    proposedPosition,
    proposedPositionCode,
    proposedDepartment,
    proposedDepartmentCode,
  }) => {
    const { index } = proposalModal;
    selectMembers[index].proposedPosition = proposedPosition;
    selectMembers[index].proposedPositionCode = proposedPositionCode;
    selectMembers[index].proposedDepartment = proposedDepartment;
    selectMembers[index].proposedDepartmentCode = proposedDepartmentCode;

    setSelectMembers(selectMembers);
    setProposalModal({ show: false });
  };

  const handleProposeLevel = (index, val, key) => {
    const selectMembersTmp = [...selectMembers];
    selectMembersTmp[index][key] = val;
    if (key === 'proposedLevelGroup') selectMembersTmp[index]['proposedLevel'] = null;

    setSelectMembers(selectMembersTmp);
  }

  const onHideModalConfirm = () => {
    setConfirmModal({
      ...confirmModal,
      isShowModalConfirm: false,
    });
  };

  function renderCurrency() {
    let currencySalaryTmp =
      currencySalary === 'VND'
        ? { locale: 'vi-VN', currency: 'VND' }
        : { locale: 'en-US', currency: 'USD' };

    return currencySalaryTmp;
  }

  const renderListMember = () => {
    let members = isCreate ? selectMembers : selectedMembers;

    return members.map((item, index) => {
      if(item.shouldHide == true) return null;
      const isProposalTransfer = [Constants.PROPOSAL_TRANSFER, Constants.PROPOSAL_APPOINTMENT].includes(item.requestTypeId);

      return (
        <React.Fragment key={index}>
          <tr style={{ border: 'none', height: '20px' }} />
          <tr className="table-header">
            <td colSpan={3} className="min-width font-weight-bold">
              <div className="d-flex">
                <input
                  type="checkbox"
                  style={{
                    alignSelf: 'flex-start',
                    margin: '5px',
                    display:
                      viewSetting.showComponent.btnExpertise ||
                      viewSetting.showComponent.btnApprove
                        ? 'inline'
                        : 'none',
                  }}
                  checked={selectedAll}
                  disabled={!canSelectedll}
                  onChange={(e) => onSelectAll(e)}
                />
                <p className="mb-0">{t('FullName')}</p>
              </div>
            </td>
            {/* <td rowSpan="2" className="min-width text-center font-weight-bold">Chức danh</td>
            <td rowSpan="2" className="min-width text-center font-weight-bold">Khối/Phòng/Bộ phận</td> */}
            {/* <td rowSpan="2" className="min-width text-center font-weight-bold">Loại HĐ hiện tại</td> */}
            {isSalaryPropose && (
              <>
                <td colSpan={2} className="min-width1 text-center">
                  <strong>{t('current_income_gross')}</strong>
                </td>
                <td colSpan={2} className="min-width1 text-center">
                  <strong>{t('suggested_salary_gross')}</strong>
                </td>
              </>
            )}
            <td
              colSpan={2}
              className="min-width text-center font-weight-bold"
            >
              {t('EffectiveDate')}
            </td>
            <td colSpan={1} className="min-width text-center font-weight-bold">
              {t('Action')}
            </td>
            <th
              colSpan={2}
              scope="colgroup"
              className="min-width text-center font-weight-bold"
            >
              {t('Opinion')}
            </th>
          </tr>
          <tr key={index}>
            <td colSpan={3}>
              <div className="d-flex">
                <input
                  type="checkbox"
                  style={{
                    alignSelf: 'flex-start',
                    margin: '5px',
                    display:
                      viewSetting.showComponent.btnExpertise ||
                      viewSetting.showComponent.btnApprove
                        ? 'inline'
                        : 'none',
                  }}
                  checked={checkedMemberIds[item.uid].checked}
                  disabled={!item.canChangeAction}
                  onChange={(e) => onCheckboxSelectChange(e, item.uid)}
                />
                <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                  <p className="mb-7px font-weight-bold">
                    {item?.fullName}{' '}
                    <span className="font-weight-normal">{!!item?.employeeNo ? `(${item?.employeeNo})` : ""}</span>
                  </p>
                  <p className="mb-7px">{item?.jobTitle} ({item?.employeeLevel})</p>
                  <p style={{
                    marginBottom: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    }} title={item?.organizationList}>{item?.organizationList}</p>
                </div>
              </div>
            </td>
            {isSalaryPropose && (
              <>
                <td colSpan={2} className="text-center">
                  <span className="same-width">
                    {!isCreateMode && (
                      <div className="d-flex w-100">
                        <div
                          style={{
                            width: viewSetting.disableComponent.showEye
                              ? '90%'
                              : '100%',
                          }}                             
                        >
                          {viewSetting.disableComponent.showCurrentSalary &&
                          accessToken ? (
                            <CurrencyInput
                              disabled={true}
                              intlConfig={renderCurrency()}
                              className="no-vborder"
                              value={item?.currentSalary}
                              placeholder={t('EvaluationInput')}
                              style={{ width: '100%', background: '#fff' }}
                              maxLength={11}
                            />
                          ) : (
                            <span>{'**********'}</span>
                          )}
                        </div>
                        {viewSetting.disableComponent.showEye && (
                          <div
                            style={{ width: '10%', cursor: 'pointer' }}
                            onClick={handleShowCurrentSalary}
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
                    )}
                  </span>
                </td>
                <td colSpan={2} className="text-center">
                  <span className="same-width">
                    {viewSetting.disableComponent.editSubjectApply &&
                    !isCreateMode ? (
                      <CurrencyInput
                        disabled={false}
                        intlConfig={renderCurrency()}
                        className="form-control"
                        value={item?.suggestedSalary}
                        onValueChange={(value) => {
                          handleTextInputChange(
                            value,
                            item?.uid,
                            'suggestedSalary'
                          );
                        }}
                        placeholder={t('EvaluationInput')}
                        maxLength={11}
                      />
                    ) : (
                      <>
                        {!isCreateMode && item?.suggestedSalary && (
                          <div className="d-flex w-100">
                            <div
                              style={{
                                width: viewSetting.disableComponent.showEye
                                  ? '90%'
                                  : '100%',
                              }}
                            >
                              {accessToken &&
                              viewSetting.disableComponent.showCurrentSalary ? (
                                <CurrencyInput
                                  disabled={true}
                                  intlConfig={renderCurrency()}
                                  className="no-vborder"
                                  value={item?.suggestedSalary}
                                  placeholder={t('EvaluationInput')}
                                  style={{ width: '100%', background: '#fff' }}
                                  maxLength={11}
                                />
                              ) : (
                                '**********'
                              )}
                            </div>
                            {viewSetting.disableComponent.showEye && (
                              <div
                                style={{ width: '10%', cursor: 'pointer' }}
                                onClick={handleShowCurrentSalary}
                              >
                                <img
                                  src={
                                    viewSetting.disableComponent
                                      .showCurrentSalary
                                      ? IconEye
                                      : IconNotEye
                                  }
                                  alt="eye"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </span>
                </td>
              </>
            )}
            <td colSpan={2} className="same-width text-center">
              <span className="same-width">
                {viewSetting.disableComponent.editSubjectApply ? (
                  <DatePicker
                    name="startDate"
                    autoComplete="off"
                    selected={
                      item?.effectiveTime
                        ? moment(
                            item?.effectiveTime,
                            Constants.LEAVE_DATE_FORMAT
                          ).toDate()
                        : null
                    }
                    onChange={(date) =>
                      handleDatePickerInputChange(
                        date,
                        item?.uid,
                        'effectiveTime'
                      )
                    }
                    minDate={moment().add(1, 'day').toDate()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={t('Select')}
                    locale={t('locale')}
                    className="form-control input"
                    styles={{ width: '100%' }}
                    getPopupContainer={(trigger) => trigger.parentElement}
                    popperContainer={CalendarContainer}
                  />
                ) : (
                  <>{item?.effectiveTime}</>
                )}
              </span>
            </td>
            <td colSpan={1} className="same-width ">
              <div className="d-flex flex-column action">
                {(viewSetting.showComponent.btnExpertise ||
                  viewSetting.showComponent.btnApprove) &&
                !isCreateMode &&
                item.canChangeAction ? (
                  <>
                    <span>
                      <input
                        type="radio"
                        id={'action_accept' + item.uid}
                        name={'action' + item.uid}
                        checked={item.accepted == true}
                        onChange={(e) => onActionChange(item.uid, true)}
                      />
                      <label htmlFor={'action_accept' + item.uid}>
                        {t('accept')}
                      </label>
                    </span>
                    <span>
                      <input
                        type="radio"
                        id={'action_reject' + item.uid}
                        name={'action' + item.uid}
                        checked={item.accepted != true}
                        onChange={(e) => onActionChange(item.uid, false)}
                      />
                      <label htmlFor={'action_reject' + item.uid}>
                        {t('RejectQuestionButtonLabel')}
                      </label>
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      <input
                        type="radio"
                        id="action_accept"
                        value="accept"
                        checked={item.accepted == true}
                        disabled={true}
                      />
                      <label htmlFor="action_accept">{t('accept')}</label>
                    </span>
                    <span>
                      <input
                        type="radio"
                        id="action_reject"
                        value="reject"
                        checked={item.accepted != true}
                        disabled={true}
                      />
                      <label htmlFor="action_reject">
                        {t('RejectQuestionButtonLabel')}
                      </label>
                    </span>
                  </>
                )}
              </div>
            </td>
            <td colSpan={2}>
              {(viewSetting.showComponent.btnExpertise ||
                viewSetting.showComponent.btnApprove) &&
              !isCreateMode &&
              item.canChangeAction ? (
                <>
                  <ResizableTextarea
                    placeholder={t('EvaluationInput')}
                    value={item?.comment || ""}
                    onChange={(e) =>
                      handleTextInputChange(
                        e.target.value,
                        item?.uid,
                        'comment'
                      )
                    }
                    className="form-control input mv-10 w-100"
                  />
                  {showCommentRequiredError &&
                    item.canChangeAction &&
                    !item.accepted &&
                    !item.comment && (
                      <div className="text-danger">{t('Required')}</div>
                    )}
                </>
              ) : (
                <>{item?.comment}</>
              )}
            </td>
          </tr>
          <tr>
            {(isTransferAppointProposal || isProposalTransfer) && (
              <td colSpan={isSalaryPropose ? "12" : "8"}>
                <div className="skill">
                  <span className="title font-weight-bold">{t('proposal_title')}:</span>
                  <span
                    className="w-100 proposal-title"
                    onClick={() =>
                      isProposalTransfer ? {} : handleClickProposal(index)
                    }
                  >
                    <select
                      className={`form-control w-100 bg-white ${
                        isProposalTransfer ? 'disabled' : ''
                      }`}
                      style={{ fontSize: '14px', paddingLeft: '8px', pointerEvents: 'none' }}
                    >
                      <option
                      >
                        {
                          !!item.proposedPosition
                          ? `${item?.proposedPosition} (${item.proposedPositionCode})`
                          : t('Select')
                        }
                      </option>
                    </select>
                  </span>
                </div>
                <div className="skill mt-2">
                  <span className="title font-weight-bold">{t('proposal_org')}:</span>
                  <span className="input form-control mv-10 w-100 disabled" style={{fontSize: '14px'}}>
                    {item?.proposedDepartment}
                  </span>
                </div>
                <div className="skill mt-2">
                  <div className="col-6 d-flex align-items-center pl-0">
                    <span className="title font-weight-bold">{t('proposal_level_group')}:</span>
                    <Select
                      value={item?.proposedLevelGroup}
                      options={EMPLOYEE_GROUP_OPTIONS}
                      onChange={(e) => handleProposeLevel(index, e, 'proposedLevelGroup')}
                      isClearable={false}
                      isDisabled={isProposalTransfer}
                      className="input mv-10"
                      placeholder={t("Select")}
                      styles={{ 
                        menu: (provided) => ({ ...provided, zIndex: 2, fontSize: '14px' }),
                        control: (styles) => ({ ...styles, borderColor: "#ced4da" })
                      }}
                      menuShouldBlockScroll={true}
                      menuPortalTarget={document.getElementById('wrapper')}
                    />
                  </div>
                  <div className="col-6 d-flex align-items-center pr-0">
                    <span className="title font-weight-bold">{t('proposal_level')}:</span>
                    <Select
                      value={item?.proposedLevel}
                      options={EMPLOYEE_SUB_GROUP_OPTIONS.filter(ele => ele.parentId === item?.proposedLevelGroup?.value)}
                      onChange={(e) => handleProposeLevel(index, e, 'proposedLevel')}
                      isClearable={false}
                      isDisabled={isProposalTransfer}
                      className="input mv-10"
                      placeholder={t("Select")}
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 2, fontSize: '14px' }),
                        control: (styles) => ({ ...styles, borderColor: "#ced4da" })
                      }}
                      menuShouldBlockScroll={true}
                      menuPortalTarget={document.getElementById('wrapper')}
                    />
                  </div>
                </div>
              </td>
            )}
          </tr>
          <tr>
            <td colSpan={isSalaryPropose ? "12" : "8"}>
              <div className="skill">
                <span className="title font-weight-bold">{t('strength')}:</span>
                <span className="input">
                  {viewSetting.disableComponent.editSubjectApply ? (
                    <ResizableTextarea
                      placeholder={t('EvaluationInput')}
                      value={item?.strength || ""}
                      onChange={(e) =>
                        handleTextInputChange(
                          e.target.value,
                          item?.uid,
                          'strength'
                        )
                      }
                      className="form-control mv-10 w-100"
                    />
                  ) : (
                    <>{item?.strength}</>
                  )}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={isSalaryPropose ? "12" : "8"}>
              <div className="skill">
                <span className="title font-weight-bold">{t('weakness')}:</span>
                <span className="input">
                  {viewSetting.disableComponent.editSubjectApply ? (
                    <ResizableTextarea
                      placeholder={t('EvaluationInput')}
                      value={item?.weakness || ""}
                      onChange={(e) =>
                        handleTextInputChange(
                          e.target.value,
                          item?.uid,
                          'weakness'
                        )
                      }
                      className="form-control mv-10 w-100"
                    />
                  ) : (
                    <>{item?.weakness}</>
                  )}
                </span>
              </div>
            </td>
          </tr>
        </React.Fragment>
      );
    });
  };

  const renderStatusDetail = () => {
    let { processStatusId, requestTypeId, statusName } = dataSalary;
    const currentStatus = Constants.mappingStatusRequest[viewSetting?.currentStatus],
      STATUS_VALUES = {
        1: { label: t('Rejected'), className: 'fail' },
        2: { label: t('Approved'), className: 'success' },
        3: { label: t('Canceled'), className: '' },
        4: { label: t('Canceled'), className: '' },
        5: { label: t("PendingApproval"), className: '' },
        6: { label: t("PartiallySuccessful"), className: 'warning' },
        7: { label: t("Rejected"), className: 'fail' },
        8: { label: t("PendingConsent"), className: '' },
        20: { label: t("Consented"), className: '' },
        100: { label: t("Waiting"), className: '' }
      };

    if([Constants.SALARY_PROPOSE, Constants.PROPOSAL_TRANSFER, Constants.PROPOSAL_APPOINTMENT].includes(requestTypeId)) {
      if(statusName) {
        let statusLabel = t(statusName),
          tmp = Object.keys(STATUS_VALUES).filter(key => STATUS_VALUES[key].label == statusLabel );
        processStatusId = tmp?.length > 0 ? tmp[0] : processStatusId;
      } else {
        processStatusId = processStatusId == 21 || processStatusId == 22 ? 100 : processStatusId;
      }
    }

    return !!statusName ? (
      <span className={`request-status ${STATUS_VALUES[processStatusId]?.className}`} >{STATUS_VALUES[processStatusId]?.label}</span>
    ) : (
      <span className={`request-status ${currentStatus?.className}`} >{t(currentStatus?.label)}</span>
    )
  }

  const salaryState = `salaryadjustment_${id}_${props.match.params?.type}`;

  return (
    <div className="timesheet-section proposal-management status-contain">
      <LoadingModal show={isLoading} isloading />
      <ConfirmPasswordModal
        state={salaryState}
        show={modalConfirmPassword}
        onUpdateToken={handleChangeModalConfirmPassword}
        onHide={() => setModalConfirmPassword(false)}
      />
      <ResultModal
        show={resultModal.show}
        title={resultModal.title}
        message={resultModal.message}
        isSuccess={resultModal.resultModal}
        onHide={hideResultModal}
      />
      <ProposalModal
        modal={proposalModal}
        onHide={hideProposalModal}
        onAccept={handleAcceptProposal}
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
        indexCurrentAppraiser={confirmModal.indexCurrentAppraiser}
      />
      <div className="eval-heading">{InsuranceOptions.find(ele => ele.value === currentRequestTypeId)?.label}</div>
      {/* ĐỀ XUẤT ĐIỀU CHỈNH LƯƠNG */}
      <h5 className="content-page-header">{InsuranceOptions.find(ele => ele.value === currentRequestTypeId)?.requestLabel}</h5>
      <div className="timesheet-box1 shadow">
        <div className="row">
          <div className="col-12">
            <div className="title">{t("TypeOfRequest")}</div>
            <Select
              placeholder={t("Select")}
              options={InsuranceOptions}
              isClearable={false}
              value={type}
              isDisabled={true}
              onChange={(e) => setType(e)}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
        </div>
      </div>
      {/* I. THÔNG TIN CÁN BỘ ĐỀ XUẤT */}
      <h5 className="content-page-header">{t("info_proposed_staff")}</h5>
      <div className="timesheet-box1 shadow">
        <div className="row">
          <div className="col-4">
            {t("FullName")}
            <div className="detail">{viewSetting.proposedStaff.fullName}</div>
          </div>
          <div className="col-4">
            {t("Title")}
            <div className="detail">{viewSetting.proposedStaff.jobTitle}</div>
          </div>
          <div className="col-4">
            {t("DepartmentManage")}
            <div className="detail">{viewSetting.proposedStaff.department}</div>
          </div>
        </div>
      </div>
      {/* II. THÔNG TIN CBNV ĐƯỢC ĐỀ XUẤT */}
      <h5 className="content-page-header">{t("proposed_employee_info")}</h5>
      {isCreateMode && (
        <>
          <div className="timesheet-box1 timesheet-box shadow">
            <div className="row">
              <div className="col-12">
                <FilterMember
                  {...props}
                  isEdit={true}
                  selectedMembers={selectedMembers}
                  handleSelectMembers={isCreate ? handleSelectMembers : handleSelectedMembers}
                  isSalaryAdjustment={isSalaryAdjustment}
                  onChangeSalaryAdjustment={setIsSalaryAdjustment}
                />
              </div>
            </div>
          </div>
          <br />
        </>
      )}
      <div className="timesheet-box1 shadow">
        <div className="user_header">
          <span className="title">{t("employee_selected")}</span>
          <div
            className="action"
            style={
              viewSetting.showComponent.btnExpertise ||
              viewSetting.showComponent.btnApprove
                ? {}
                : { display: "none" }
            }
          >
            <button
              className="btn btn-outline-success btn-lg d-flex align-items-center"
              style={{
                gap: "7px",
                paddingLeft: "24px",
                paddingRight: "24px",
                fontSize: "14px",
              }}
              onClick={(e) => onActionChangeAll(true)}
            >
              <i className="fas fa-check fa-lg"></i>
              {t("accept")}
            </button>
            <button
              className="btn btn-outline-danger btn-lg d-flex align-items-center"
              style={{
                gap: "7px",
                paddingLeft: "24px",
                paddingRight: "24px",
                fontSize: "14px",
              }}
              onClick={(e) => onActionChangeAll(false)}
            >
              <i className="fas fa-times fa-lg"></i>
              {t("RejectQuestionButtonLabel")}
            </button>
          </div>
        </div>
        <div className="result-wrap-table">
          <table className="result-table" style={{ width: "100%" }}>
            <tbody>
              {renderListMember()}
            </tbody>
          </table>
        </div>
      </div>
      {/* Nhân sự hỗ trợ quyền xem lương */}
      {viewSetting.showComponent.showHrSupportViewSalary && isSalaryPropose && (
        <>
          <h5 className="content-page-header">
            {t("support_human_respone_view_salary")}
          </h5>
          <div className="timesheet-box1 timesheet-box shadow">
            <HumanForReviewSalaryComponent
              isEdit={!viewSetting.disableComponent.selectHrSupportViewSalary}
              approver={coordinator}
              isHR={true}
              updateApprover={(approver, isApprover) =>
                handleUpdateCoordinator(approver, isApprover)
              }
              comment={dataSalary?.coordinatorComment}
            />
          </div>
        </>
      )}
      {/* CBQL THẨM ĐỊNH/ NLĐ XÁC NHẬN */}
      {viewSetting.showComponent.showCBQL && (
        <>
          <h5 className="content-page-header">
            {t("ConsenterStaffConfirm")}
            <span className="font-weight-normal ml-1 text-lowercase">
              ({t("if_any")})
            </span>
          </h5>
          <div className="timesheet-box1 timesheet-box shadow">
            {(employeAppraisers).map((item, key) => (
              <div
                key={`selectMembers-${key}`}
                className="appraiser d-flex flex-column position-relative"
                style={key > 0 ? { marginTop: "20px" } : {}}
              >
                {isCreateMode && (
                  <button
                    className="btn btn-outline-danger position-absolute d-flex align-items-center btn-sm"
                    style={{ gap: "4px", top: 0, right: 0 }}
                    onClick={() => removeEmployeAppraisers(item?.uid)}
                  >
                    <Image src={IconRemove} />
                    {t("delete")}
                  </button>
                )}
                <HumanForReviewSalaryComponent
                  isEdit={true}
                  isAppraiser={true}
                  approver={item}
                  updateApprover={(sup) => {}}
                  comment={item?.appraiserComment}
                />
              </div>
            ))}
            {supervisors.map((item, key) => (
              <div
                key={`supervisors-${key}`}
                className="appraiser d-flex flex-column position-relative"
                style={(key > 0 || employeAppraisers.length > 0) ? { marginTop: "20px" } : {}}
              >
                {isCreateMode && (
                  <button
                    className="btn btn-outline-danger position-absolute d-flex align-items-center btn-sm"
                    style={{ gap: "4px", top: 0, right: 0 }}
                    onClick={() => removeSupervisorItem(key)}
                  >
                    <Image src={IconRemove} />
                    {t("delete")}
                  </button>
                )}
                <HumanForReviewSalaryComponent
                  isEdit={!viewSetting.disableComponent.selectHrSupportViewSalary}
                  isAppraiser={true}
                  approver={item}
                  updateApprover={(sup) => handleUpdateSupervisors(sup, key)}
                  comment={item?.appraiserComment}
                />
              </div>
            ))}
            {isCreateMode && (
              <button
                className="btn btn-outline-success btn-lg w-fit-content mt-3 d-flex align-items-center"
                style={{ gap: "4px", fontSize: "14px" }}
                onClick={() => setSupervisors([...supervisors, null])}
              >
                <Image src={IconAdd} />
                {t("Add")}
              </button>
            )}
          </div>
        </>
      )}
      {/* Nhân sự thẩm định */}
      {viewSetting.showComponent.showHrAssessment && (
        <>
          <h5 className="content-page-header">
            {t("HumanResourceChangeSalary")}
          </h5>
          <div className="timesheet-box1 timesheet-box shadow">
            <HumanForReviewSalaryComponent
              isEdit={!viewSetting.disableComponent.selectHrSupportViewSalary}
              approver={appraiser}
              isHR={true}
              updateApprover={(sup) => handleUpdateHrChangeSalary(sup)}
              comment={appraiser?.appraiserComment}
            />
          </div>
        </>
      )}
      {/* CBLĐ PHÊ DUYỆT */}
      {viewSetting.showComponent.showOfficerApproved &&
        (isTransferProposal ? (
          <>
            <h5 className="content-page-header">{`${t('BossApproved')} (${t(
              'Sent'
            )})`}</h5>
            <div className="timesheet-box1 timesheet-box shadow">
              <HumanForReviewSalaryComponent
                isEdit={!viewSetting.disableComponent.selectHrSupportViewSalary}
                approver={approver}
                updateApprover={handleUpdateApprovalSalary}
                comment={approver?.appraiserComment}
              />
            </div>
            <h5 className="content-page-header">{`${t('BossApproved')} (${t(
              'Arrive'
            )})`}</h5>
            <div className="timesheet-box1 timesheet-box shadow">
              <HumanForReviewSalaryComponent
                isEdit={!viewSetting.disableComponent.selectHrSupportViewSalary}
                approver={approverArrive}
                updateApprover={handleUpdateApprovalArriveSalary}
                comment={approverArrive?.appraiserComment}
                isAppraiserNote={true}
              />
            </div>
          </>
        ) : (
          <>
            <h5 className="content-page-header">{t('BossApproved')}</h5>
            <div className="timesheet-box1 timesheet-box shadow">
              <HumanForReviewSalaryComponent
                isEdit={!viewSetting.disableComponent.selectHrSupportViewSalary}
                approver={approver}
                updateApprover={handleUpdateApprovalSalary}
                comment={approver?.appraiserComment}
                isAppraiserNote={true}
              />
            </div>
          </>
        ))}
      {/* Proccess History */}
      {/* {!isCreateMode && (
        <>
          <h5 className="content-page-header">
            {t("RequestHistory").toUpperCase()}
          </h5>
          <div className="timesheet-box1 timesheet-box shadow">
            <ProcessHistoryComponent
              createdDate={dataSalary?.createdDate}
              coordinatorDate={dataSalary?.coordinatorDate}
              requestAppraisers={dataSalary?.requestAppraisers}
              approvedDate={dataSalary?.approvedDate}
            />
          </div>
        </>
      )} */}
      <br />
      {/* List file */}
      <ul className="list-inline">
        {listFiles.map((file, index) => (
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
              {viewSetting.showComponent.showRemoveFile && (
                <i
                  className="fa fa-times remove"
                  aria-hidden="true"
                  onClick={(e) => removeFiles(file.id, index)}
                ></i>
              )}
            </span>
          </li>
        ))}
      </ul>
      {/* Show status */}
      {viewSetting.showComponent.stateProcess && (
        <div className="block-status">{renderStatusDetail()}</div>
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
              onChange={handleAttachFile}
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
            onClick={handleCancel}
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
            onClick={handleSendForm}
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
        {/* Từ chối và xác nhận cho luồng NLĐ xác nhận */}
        {viewSetting.showComponent.showWorkersConfirm && (
          <>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => handleConfirmEmployee(false)}
            >
              <img src={IconDelete} className="mr-1" alt="delete" />{" "}
              {t("RejectQuestionButtonLabel")}
            </button>
            <button
              type="button"
              className="btn btn-primary float-right ml-3 shadow"
              onClick={() => handleConfirmEmployee(true)}
            >
              <i className="fas fa-check" aria-hidden="true"></i> {t("Confirm")}
            </button>
          </>
        )}
        {/* Từ chối */}
        {viewSetting.showComponent.btnRefuse && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleRefuse}
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
            style={enableSubmit ? {} : {opacity: 0.2}}
            onClick={handleConsent}
            disabled={enableSubmit ? false : true}
          >
            <i className="fas fa-check" aria-hidden="true"></i> {t("Consent")}
          </button>
        )}
        {/* Không phê duyệt */}
        {viewSetting.showComponent.btnNotApprove && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleReject}
          >
            <img src={IconDelete} className="mr-1" alt="delete" /> {t("Reject")}
          </button>
        )}
        {/* Phê duyệt */}
        {viewSetting.showComponent.btnApprove && (
          <button
            type="button"
            className="btn btn-success float-right ml-3 shadow"
            disabled={enableSubmit ? false : true}
            style={enableSubmit ? {} : {opacity: 0.2}}
            onClick={handleApprove}
          >
            <i className="fas fa-check" aria-hidden="true"></i> {t("Approval")}
          </button>
        )}
      </div>
    </div>
  );
};

export default withTranslation()(SalaryAdjustmentPropse);
