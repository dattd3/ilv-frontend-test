/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { forEach } from 'lodash';
import Select from 'react-select';
import { useHistory } from 'react-router';
import { withTranslation } from 'react-i18next';
import { Image, Spinner } from 'react-bootstrap';
import vi from 'date-fns/locale/vi';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import {
  validateFileMimeType,
  validateTotalFileSize,
} from '../../../utils/file';
import { Portal } from 'react-overlays';
import { useApi } from '../../../modules/api';
import ResizableTextarea from '../TextareaComponent';
import CurrencyInput from 'react-currency-input-field';
import Constants from '../../../commons/Constants';
import StatusModal from '../../../components/Common/StatusModal';
import LoadingModal from '../../../components/Common/LoadingModal';
import { getCulture, getRequestConfigurations } from 'commons/Utils';
import '../../WorkflowManagement/ShareComponents/SelectTab/select-tab.scss';
import HumanForReviewSalaryComponent from '../HumanForReviewSalaryComponent';
import ConfirmationModal from 'containers/PersonalInfo/edit/ConfirmationModal';
import ConfirmPasswordModal from '../ContractEvaluation/SalaryPropose/ConfirmPasswordModal';
import ResultModal from 'containers/WorkflowManagement/DepartmentManagement/ProposalManagement/ResultModal';
import ProposalModal from 'containers/WorkflowManagement/DepartmentManagement/ProposalManagement/ProposalModal';
// import ProcessHistoryComponent from 'containers/WorkflowManagement/DepartmentManagement/ProposalManagement/ProcessHistoryComponent';

import IconEye from '../../../assets/img/icon/eye.svg';
import IconRemove from '../../../assets/img/ic-remove.svg';
import IconAdd from '../../../assets/img/ic-add-green.svg';
import IconNotEye from '../../../assets/img/icon/not-eye.svg';
import IconDelete from '../../../assets/img/icon/Icon_Cancel.svg';

registerLocale('vi', vi);

const getStorage = (key) => localStorage.getItem(key) || '',
  CalendarContainer = ({ children }) => (
    <Portal container={document.getElementById('calendar-portal')}>
      {children}
    </Portal>
  );

const SalaryAdjustmentPropose = (props) => {
  const { t } = props,
    api = useApi(),
    history = useHistory(),
    InsuranceOptions = [
      { value: 12, label: t('RequestSalary'), requestLabel: t("SalaryAdjustmentPropse") },
      { value: 14, label: t('RequestTransfer'), requestLabel: t("Menu_RequestManage") },
      { value: 15, label: t('ProposalAppointment'), requestLabel: t("Menu_RequestManage") },
    ],
    isTransferProposal = window.location.href.includes(
      '/registration-transfer/'
    ),
    currentRequestTypeId = isTransferProposal ? 14 : 12,
    queryParams = new URLSearchParams(props.history.location.search);

  const [resultModal, setResultModal] = useState({
    title: '',
    message: '',
    show: false,
    isSuccess: false,
  });
  const [proposalModal, setProposalModal] = useState({
    show: false,
    index: -1,
    data: null,
  });
  const [modalStatus, setModalStatus] = useState({
    url: '',
    content: '',
    isSuccess: true,
    isShowStatusModal: false,
  });
  const [confirmModal, setConfirmModal] = useState({
    modalTitle: '',
    typeRequest: '',
    modalMessage: '',
    confirmStatus: '',
    isShowModalConfirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [modalConfirmPassword, setModalConfirmPassword] = useState(false);
  const [accessToken, setAccessToken] = useState(
    queryParams.get('accesstoken') || null
  );
  const [requestType, setRequestType] = useState(
    InsuranceOptions.find(ele => ele.value === currentRequestTypeId)
  );
  const [listFiles, setListFiles] = useState([]);
  const [selectMembers, setSelectMembers] = useState([]);
  const [listFileDeleted, setListFileDeleted] = useState([]);
  const [checkedMemberIds, setCheckedMemberIds] = useState({});
  const [selectedAll, setSelectedAll] = useState(false);
  const [dataSalary, setDataSalary] = useState(undefined);
  const [canSelectedAll, setCanSelectedAll] = useState(true);
  const [currencySalary, setCurrencySalary] = useState('VND');
  const [isSalaryAdjustment, setIsSalaryAdjustment] = useState(
    !isTransferProposal
  );

  const [coordinator, setCoordinator] = useState(null); // Nhân sự hỗ trợ xin quyền xem lương
  const [supervisors, setSupervisors] = useState([]);
  const [approver, setApprover] = useState(null); // CBLĐ phê duyệt setIsCallSalary
  const [appraiser, setAppraiser] = useState(null); // HR thẩm định quyền điều chỉnh lương
  const [enableSubmit, setEnableSubmit] = useState(true);
  const [isCallSalary, setIsCallSalary] = useState(false);
  const [approverArrive, setApproverArrive] = useState(null); // CBLĐ phê duyệt
  const [showCommentError, setShowCommentError] = useState(false);
  const [viewSetting, setViewSetting] = useState({
    showComponent: {
      btnCancel: false, // Button Hủy
      btnRefuse: false, // Button Từ chối
      btnApprove: false, // Button phê duyệt
      btnExpertise: false, // Button Thẩm định
      btnAttachFile: false, // Button Dinh kem tep
      btnSendRequest: false, // Button Gửi yêu cầu
      btnNotApprove: false, // Button Không phê duyệt
      stateProcess: false, // Button trang thai
      showCBQL: true, // Hien thi CBQL CẤP CƠ SỞ
      showWorkersConfirm: false, // Hien thị NLD xac nhan
      showRemoveFile: false, // Hien thi icon remove file
      showOfficerApproved: true, // Hien thi CBLĐ PHÊ DUYỆT
      showHrAssessment: true, // Hien thi Nhân sự thẩm định
      showHrSupportViewSalary: false, // Hien thi Nhân sự hỗ trợ quyền xem lương
    },
    disableComponent: {
      disableAll: false,
      showEye: false, // Hiển thị mắt xem lương
      editSubjectApply: false, // Cho phép xem, sửa thông tin đối tượng
      showCurrentSalary: false, // Change type text & password lương hiện tại
      showSuggestedSalary: false, // Change type text & password lương đề xuất
      selectHrSupportViewSalary: false, // Cho phep chon Nhân sự hỗ trợ quyền xem lương
    },
    proposedStaff: {
      avatar: '',
      account: '',
      email: '',
      employeeNo: '',
      employeeLevel: '',
      orglv2Id: '',
      fullName: '',
      jobTitle: '',
      department: '',
      orgLv2Id: '',
      orgLv3Id: '',
      orgLv4Id: '',
      orgLv5Id: '',
      orgLv2Text: '',
      orgLv3Text: '',
      orgLv4Text: '',
      orgLv5Text: '',
      companyCode: '',
      currentAppraiserEmail: '',
    },
  });
  const isSalaryPropose =
      dataSalary?.requestTypeId === Constants.SALARY_PROPOSE ||
      isSalaryAdjustment,
    { id, type } = props?.match?.params,
    isCreate = id === 'create';

  useEffect(() => {
    if (id) {
      setIsCreateMode(isCreate);
      if (isCreate) {
        checkViewCreate(); // Create mode
        getCurrentUserPropose();
      } else {
        getDataSalary(); // Review mode
      }
    } else {
      props.history.push('proposal-management');
    }

    if (queryParams.has('accesstoken')) {
      queryParams.delete('accesstoken');
      props.history.replace({ search: queryParams.toString() });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectMembers?.length > 0 && !isCallSalary && accessToken) {
      getSalary(accessToken);
    }
  }, [selectMembers]);

  const getDataSalary = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.fetchSalaryPropose(id),
        { data: response } = data;
      await setDataSalary(response);
      await checkAuthorize(response);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateViewSetting = (viewSettingTmp) => {
    viewSettingTmp.showComponent.btnAttachFile = true;
    viewSettingTmp.showComponent.btnSendRequest = true;
    viewSettingTmp.showComponent.showRemoveFile = true;
    viewSettingTmp.disableComponent.editSubjectApply = true;
    viewSettingTmp.showComponent.showHrSupportViewSalary = true;
    viewSettingTmp.disableComponent.selectHrSupportViewSalary = true;

    viewSettingTmp.proposedStaff.account =
      getStorage('email').split('@')[0] || '';
    viewSettingTmp.proposedStaff.email = getStorage('email');
    viewSettingTmp.proposedStaff.avatar = getStorage('avatar');
    viewSettingTmp.proposedStaff.fullName = getStorage('fullName');
    viewSettingTmp.proposedStaff.jobTitle = getStorage('jobTitle');
    viewSettingTmp.proposedStaff.employeeNo = getStorage('employeeNo');
    viewSettingTmp.proposedStaff.company_email = getStorage('plEmail');
    viewSettingTmp.proposedStaff.department = getStorage('department');
    viewSettingTmp.proposedStaff.employeeLevel = getStorage('employeeLevel');
    viewSettingTmp.proposedStaff.orgLv2Id = getStorage('organizationLv2');
    viewSettingTmp.proposedStaff.orgLv3Id = getStorage('organizationLv3');
    viewSettingTmp.proposedStaff.orgLv4Id = getStorage('organizationLv4');
    viewSettingTmp.proposedStaff.orgLv5Id = getStorage('organizationLv5');
    viewSettingTmp.proposedStaff.orgLv6Id = getStorage('organizationLv6');
    viewSettingTmp.proposedStaff.orgLv2Text = getStorage('company');
    viewSettingTmp.proposedStaff.orgLv3Text = getStorage('division');
    viewSettingTmp.proposedStaff.orgLv4Text = getStorage('region');
    viewSettingTmp.proposedStaff.orgLv5Text = getStorage('unit');
    viewSettingTmp.proposedStaff.orgLv6Text = getStorage('part');
    viewSettingTmp.proposedStaff.companyCode = getStorage('companyCode');
  };

  const checkViewCreate = () => {
    let viewSettingTmp = { ...viewSetting };
    handleUpdateViewSetting(viewSettingTmp);
    setViewSetting(viewSettingTmp);
  };

  const getCurrentUserPropose = async () => {
    const employeeNo = getStorage('employeeNo'),
      email = getStorage('email'),
      fullName = getStorage('fullName'),
      jobTitle = getStorage('jobTitle'),
      department = getStorage('department'),
      company = getStorage('company'),
      division = getStorage('division'),
      region = getStorage('region'),
      unit = getStorage('unit'),
      part = getStorage('part');

    try {
      const res = await axios.post(
          `${process.env.REACT_APP_REQUEST_URL}ReasonType/getadditionalinfo`,
          { employeeCode: employeeNo },
          getRequestConfigurations()
        ),
        result = res?.data?.data;

      if (result) {
        Object.values(result).map((item) => {
          const memberIds = [`${employeeNo}`],
            memberCheck = {
              [`${employeeNo}`]: {
                uid: employeeNo,
                checked: false,
                canChangeAction: false,
              },
            },
            members = [
              {
                uid: employeeNo,
                employeeNo: employeeNo,
                account: email.split('@')[0],
                username: email.split('@')[0],
                fullName: fullName,
                jobTitle: jobTitle,
                startDate: '',
                expireDate: '',
                contractName: item.lastestContractName,
                contractType: item.lastestContractType,
                department: department,
                division: division,
                unit: unit,
                organizationList: `${company}${
                  !!division ? `/${division}` : ''
                }${!!region ? `/${region}` : ''}${!!unit ? `/${unit}` : ''}${
                  !!part ? `/${part}` : ''
                }`,
                currentSalary: '',
                suggestedSalary: '',
                effectiveTime: '',
                strength: '',
                weakness: '',
                accepted: true,
              },
            ];

          setSelectMembers(members);
          setCheckedMemberIds(memberCheck);
          setSupervisors(
            supervisors.filter((sup) => !memberIds.includes(sup?.uid))
          );
        });
      }
    } catch (err) {}
  };

  const checkAuthorize = (dataSalaryInfo) => {
    const currentEmail = getStorage('email'),
      {
        requestAppraisers,
        processStatusId,
        userId,
        supervisorId,
        salaryAdjustments,
        userProfileDocuments,
      } = dataSalaryInfo,
      indexAppraiser = requestAppraisers?.findIndex(
        (app) => app.status === Constants.SALARY_APPRAISER_STATUS.WAITING
      ),
      isCurrentAppraiser =
        indexAppraiser !== -1 &&
        currentEmail.toLowerCase() ===
          requestAppraisers[indexAppraiser].appraiserId?.toLowerCase(),
      typeAppraise =
        indexAppraiser !== -1 && requestAppraisers[indexAppraiser].type;

    let viewSettingTmp = { ...viewSetting },
      currentStatus = processStatusId;

    viewSettingTmp.showComponent.stateProcess = true;

    switch (processStatusId) {
      case 20: //Nhân sự điều phối gửi lại yêu cầu
        currentStatus = 0;
        setIsCreateMode(true);
        viewSettingTmp.showComponent.stateProcess = false;
        handleUpdateViewSetting(viewSettingTmp);
        break;
      case 21: // Đang chờ nhân sự điều phối & Đang chờ nhân sự thẩm định người xem lương
        currentStatus = 0;
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        if (accessToken) {
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
        }
        break;
      case 22: // Đang chờ QLTT nhập lương đề xuất, xem lương hiện tại
        currentStatus = 0;
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.disableComponent.showEye = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        if (
          currentEmail.toLowerCase() === userId?.toLowerCase() &&
          type === 'request'
        ) {
          viewSettingTmp.showComponent.btnCancel = true;
          viewSettingTmp.disableComponent.showEye = true;
          viewSettingTmp.showComponent.btnSendRequest = true;
          viewSettingTmp.disableComponent.editSubjectApply = true;
        }
        if (accessToken) {
          viewSettingTmp.disableComponent.showEye = true;
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
        }
        break;
      case 8: // Đang chờ CBQL Cấp cơ sở thẩm định
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.disableComponent.showEye = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        if (isCurrentAppraiser && type === 'assess') {
          if (typeAppraise === 0) {
            // nhan vien tham dinh
            viewSettingTmp.showComponent.showWorkersConfirm = true;
            viewSettingTmp.proposedStaff.currentAppraiserEmail =
              requestAppraisers[indexAppraiser].appraiserId?.toLowerCase();
          } else {
            // CBLD tham dinh
            viewSettingTmp.showComponent.btnRefuse = true;
            viewSettingTmp.disableComponent.showEye = true;
            viewSettingTmp.showComponent.btnExpertise = true;
          }
        } else if (type !== 'request') {
          currentStatus = 20;
        }
        if (accessToken) {
          viewSettingTmp.disableComponent.showEye = true;
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
        }
        break;
      case 24: // Đang chờ nhân sự thẩm định lương đề xuất
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.disableComponent.showEye = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        if (
          currentEmail.toLowerCase() === supervisorId?.toLowerCase() &&
          type === 'assess'
        ) {
          viewSettingTmp.showComponent.btnRefuse = true;
          viewSettingTmp.disableComponent.showEye = true;
          viewSettingTmp.showComponent.btnExpertise = true;
        }
        if (accessToken) {
          viewSettingTmp.disableComponent.showEye = true;
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
        }
        break;
      case 5: // Đang chờ CBLĐ phê duyệt
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.disableComponent.showEye = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        if (isCurrentAppraiser && type === 'approval') {
          viewSettingTmp.showComponent.btnApprove = true;
          viewSettingTmp.disableComponent.showEye = true;
          viewSettingTmp.showComponent.btnNotApprove = true;
        }
        if (accessToken) {
          viewSettingTmp.disableComponent.showEye = true;
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
        }
        break;
      case 2: // View phe duyet thanh cong
      // viewSettingTmp.disableComponent.showEye = true;
      // break;
      case 7: // Case từ chối
      // viewSettingTmp.disableComponent.showEye = true;
      // break;
      case 1: // Case không phê duyệt
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.disableComponent.showEye = true;
        viewSettingTmp.showComponent.stateProcess = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        break;
      default:
        break;
    }
    viewSettingTmp.currentStatus = currentStatus;

    //QLTT
    if (dataSalaryInfo.requestInfo && processStatusId !== 20) {
      const userInfo = JSON.parse(dataSalaryInfo.userInfo);
      viewSettingTmp.proposedStaff = Object.assign(
        viewSettingTmp.proposedStaff,
        userInfo
      );
    }
    // Nhân sự điều phối
    if (dataSalaryInfo?.coordinatorInfo)
      setCoordinator({
        ...JSON.parse(dataSalaryInfo?.coordinatorInfo),
      });
    // Thong tin CBNV
    const memberCheck = {};
    let canCheckAll = false,
      userLoginNo = getStorage('employeeNo'),
      isEmployeeLogin = false,
      employeeLists = salaryAdjustments?.map((u) => {
        u.accepted = !!u.status;
        const requestTmp = JSON.parse(u?.employeeInfo);

        memberCheck[requestTmp?.employeeNo] = {
          uid: requestTmp?.employeeNo,
          checked: false,
          canChangeAction: u?.accepted === true,
        };
        if (userLoginNo === requestTmp?.employeeNo) {
          isEmployeeLogin = true;
        }
        canCheckAll = canCheckAll || u?.accepted === true;

        return {
          id: u?.id,
          uid: requestTmp?.employeeNo,
          employeeNo: requestTmp?.employeeNo,
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
          currentSalary: '0',
          suggestedSalary: '0',
          effectiveTime: u?.startDate
            ? moment(u?.startDate).format(Constants.LEAVE_DATE_FORMAT)
            : '',
          requestTypeId: u?.requestTypeId,
          proposedPosition: requestTmp?.proposedPosition,
          proposedPositionCode: requestTmp?.proposedPositionCode,
          proposedDepartment: requestTmp?.proposedDepartment,
          proposedDepartmentCode: requestTmp?.proposedDepartmentCode,
          strength: u?.staffStrengths || requestTmp?.staffStrengths,
          weakness: u?.staffWknesses || requestTmp?.staffWknesses,
          canChangeAction: !!u?.accepted,
          accepted: u?.accepted,
          comment: u.comment,
        };
      });

    if (isEmployeeLogin) {
      employeeLists = employeeLists.map((u) => ({
        ...u,
        shouldHide: userLoginNo !== u?.employeeNo,
      }));
    }

    setCanSelectedAll(canCheckAll);
    setSelectMembers(employeeLists);
    setCheckedMemberIds(memberCheck);

    // CBQL cấp cơ sở
    if (requestAppraisers?.length > 0) {
      const _supervisors = [];
      requestAppraisers.map((item) => {
        const _itemInfo = JSON.parse(item.appraiserInfo);
        if (_itemInfo.type === Constants.STATUS_PROPOSAL.EMPLOYEE_APPRAISER) {
          // HR thẩm định quyền điều chỉnh lương
          setAppraiser({
            ..._itemInfo,
            uid: _itemInfo?.employeeNo,
            employeeNo: _itemInfo?.employeeNo,
            requestHistoryId: item.requestHistoryId,
          });
        } else if (
          _itemInfo.type === Constants.STATUS_PROPOSAL.LEADER_APPRAISER
        ) {
          _supervisors.push({
            ..._itemInfo,
            uid: _itemInfo?.employeeNo,
            employeeNo: _itemInfo?.employeeNo,
            requestHistoryId: item.requestHistoryId,
          });
        }
      });

      setSupervisors(_supervisors);
    }
    // CBLĐ phê duyệt
    if (requestAppraisers?.length > 0) {
      const [approverRes, approverArriveRes] = requestAppraisers.filter(
          (ele) => ele.type === Constants.STATUS_PROPOSAL.CONSENTER
        ),
        approvalData = JSON.parse(approverRes?.appraiserInfo || '{}'),
        approverArriveData = JSON.parse(
          approverArriveRes?.appraiserInfo || '{}'
        );

      setApprover({
        ...approvalData,
        uid: approvalData?.employeeNo,
        employeeNo: approvalData?.employeeNo,
      });
      setApproverArrive({
        ...approverArriveData,
        uid: approverArriveData?.employeeNo,
        employeeNo: approverArriveData?.employeeNo,
      });
    }
    const requestDocuments =
      (userProfileDocuments || []).map((u) => ({
        id: u.id,
        name: u.fileName,
        link: u.fileUrl,
      })) || [];

    setListFiles(requestDocuments);
    setViewSetting(viewSettingTmp);
    setIsSalaryAdjustment(dataSalaryInfo?.isSalaryAdjustment || false);
  };

  const onSelectAll = (e) => {
    const value = e.target.checked,
      newCheckedMemeberIds = {};
    Object.values(checkedMemberIds).map((item) => {
      newCheckedMemeberIds[item.uid] = item.canChangeAction
        ? { ...item, checked: value }
        : item;
    });

    setSelectedAll(value);
    setCheckedMemberIds(newCheckedMemeberIds);
  };

  const onCheckboxSelectChange = (e, uid) => {
    let checkall = true;
    const checked = e.target.checked,
      newCheckedMemeberIds = {};

    Object.values(checkedMemberIds).map((item) => {
      newCheckedMemeberIds[item.uid] =
        item.uid === uid ? { ...item, checked } : item;
      checkall =
        checkall &&
        (newCheckedMemeberIds[item.uid].checked || !item.canChangeAction);
    });

    setSelectedAll(checkall);
    setCheckedMemberIds(newCheckedMemeberIds);
  };

  const onActionChangeAll = (accepted = true) => {
    let _enableSubmit = true;
    const _selectMembers = selectMembers.map((item) => {
      if (!!checkedMemberIds[item.uid]?.checked) {
        _enableSubmit = accepted;
        return { ...item, accepted };
      }
      return item;
    });

    setEnableSubmit(_enableSubmit);
    setSelectMembers(_selectMembers);
  };

  const onActionChange = (uid, accepted = true) => {
    let _enableSubmit = true;
    const _selectMembers = selectMembers.map((item) => {
      if (
        (viewSetting.showComponent.btnExpertise ||
          viewSetting.showComponent.btnApprove) &&
        !isCreateMode &&
        item.canChangeAction &&
        !accepted
      ) {
        _enableSubmit = false;
      }

      if (item.uid == uid) {
        return { ...item, accepted };
      }

      return item;
    });

    setEnableSubmit(_enableSubmit);
    setSelectMembers(_selectMembers);
  };

  const handleTextInputChange = (value, uid, objName) => {
    const selectMembersTmp = [...selectMembers];

    selectMembersTmp.forEach((item) => {
      if (item.uid === uid) item[objName] = value;
    });
    setSelectMembers(selectMembersTmp);
  };

  const handleDatePickerInputChange = (value, uid, objName) => {
    const selectMembersTmp = [...selectMembers];

    selectMembersTmp.forEach((item) => {
      if (item.uid === uid) {
        item[objName] = moment(value, 'DD-MM-YYYY').isValid()
          ? moment(value, Constants.LEAVE_DATE_FORMAT)
          : '';
      }
    });
    setSelectMembers(selectMembersTmp);
  };

  const handleShowCurrentSalary = () => {
    if (isCallSalary) {
      return setViewSetting({
        ...viewSetting,
        disableComponent: {
          ...viewSetting.disableComponent,
          showCurrentSalary: !viewSetting.disableComponent.showCurrentSalary,
        },
      });
    }
    if (!accessToken) {
      setModalConfirmPassword(true);
    } else if (!viewSetting.disableComponent.showCurrentSalary) {
      getSalary(accessToken);
    }
  };

  // Từ chối
  const handleRefuse = () => {
    setConfirmModal({
      isShowModalConfirm: true,
      modalTitle: t('RejectConsenterRequest'),
      modalMessage: t('ReasonRejectRequest'),
      typeRequest: Constants.STATUS_NO_CONSENTED,
      confirmStatus: '',
      dataToUpdate: [
        {
          id: id,
          requestTypeId: currentRequestTypeId,
          sub: [
            {
              id: id,
              processStatusId: 7,
              comment: '',
              status: '',
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
      modalTitle: t('ConfirmNotApprove'),
      modalMessage: `${t('ReasonNotApprove')}`,
      typeRequest: Constants.STATUS_NOT_APPROVED,
      confirmStatus: '',
      dataToUpdate: [
        {
          id: id,
          requestTypeId: currentRequestTypeId,
          sub: [
            {
              id: id,
              processStatusId: 1,
              comment: '',
              status: '',
            },
          ],
        },
      ],
    });
  };

  // Hủy
  const handleCancel = () => history.push('/tasks');

  // Attach file
  const handleAttachFile = (e) => {
    const files = Object.values(e.target.files);
    if (validateFileMimeType(e, files, t)) {
      const listFilesTmp = [...listFiles, ...files];
      if (validateTotalFileSize(e, listFilesTmp, t)) setListFiles(listFilesTmp);
    }
  };

  const removeFiles = (id, index) => {
    // Todo: handle remove file
    let listFilesTmp = [...listFiles].filter((item, i) => i !== index);
    if (id) {
      setListFileDeleted([...listFileDeleted, id]);
    }
    setListFiles(listFilesTmp);
  };

  // Thẩm định
  const handleConsent = () => {
    // const processStatusId = appraiser ? 24 : 5;
    if (
      selectMembers.some(
        (item) => item.canChangeAction && !item.accepted && !item.comment
      )
    ) {
      return setShowCommentError(true);
    }
    let staffRequestStatusList = selectMembers?.map((item) => ({
      employeeNo: item.uid,
      salaryAdjustmentId: item.id,
      status: item.accepted ? 1 : 0,
      comment: item.comment || '',
    }));

    setConfirmModal({
      isShowModalConfirm: true,
      modalTitle: t('ConsentConfirmation'),
      modalMessage: t('ConfirmConsentRequest'),
      typeRequest: Constants.STATUS_CONSENTED,
      confirmStatus: '',
      dataToUpdate: [
        {
          id: id,
          requestTypeId: currentRequestTypeId,
          sub: [
            {
              id: id,
              processStatusId: 5,
              comment: '',
              status: '',
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
      staffRequestStatusList = selectMembers?.map((item, index) => {
        if (currentAppraiserEmail === item.account) {
          indexCurrentAppraiser = index;
          item.accepted = isConsent;
        }

        return {
          employeeNo: item.uid,
          salaryAdjustmentId: item.id,
          status: item.accepted ? 1 : 0,
          comment: item.comment || '',
        };
      });

    setConfirmModal({
      isShowModalConfirm: true,
      modalTitle: t(
        isConsent ? 'ConsentConfirmation' : 'RejectConsenterRequest'
      ),
      modalMessage: t(
        isConsent ? 'ConfirmConsentRequest' : 'ReasonRejectRequest'
      ),
      typeRequest: isConsent
        ? Constants.STATUS_TRANSFER
        : Constants.STATUS_TRANSFER_REFUSE,
      confirmStatus: '',
      indexCurrentAppraiser,
      dataToUpdate: [
        {
          id: id,
          requestTypeId: currentRequestTypeId,
          sub: [
            {
              id: id,
              processStatusId: isConsent ? 5 : 7,
              comment: '',
              status: '',
              staffRequestStatusList,
            },
          ],
        },
      ],
    });
  };

  // Phê duyệt
  const handleApprove = () => {
    let staffRequestStatusList = selectMembers?.map((item) => ({
      employeeNo: item.uid,
      salaryAdjustmentId: item.id,
      status: item.accepted ? 1 : 0,
      comment: item.comment || '',
    }));

    setConfirmModal({
      isShowModalConfirm: true,
      modalTitle: t('ApproveRequest'),
      modalMessage: t('ConfirmApproveChangeRequest'),
      typeRequest: Constants.STATUS_APPROVED,
      confirmStatus: '',
      dataToUpdate: [
        {
          id: id,
          requestTypeId: currentRequestTypeId,
          sub: [
            {
              id: id,
              processStatusId: 2,
              comment: '',
              status: '',
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
      if (selectMembers.length === 0) {
        return showStatusModal(t('ProposedEmployeeValidate'), false);
      }
      if (!coordinator && isSalaryAdjustment) {
        return showStatusModal(t('HumanForReviewSalaryValidate'), false);
      }
      if (!appraiser) {
        return showStatusModal(t('HumanForChangeSalaryValidate'), false);
      }
      if (!approver) {
        return showStatusModal(
          `${t('PleaseInputApprover')} (${t('Sent')})`,
          false
        );
      }
      if (!approverArrive) {
        return showStatusModal(
          `${t('PleaseInputApprover')} (${t('Arrive')})`,
          false
        );
      }

      if (isTransferProposal) {
        const listErrors = validateAppoitment();
        if (listErrors.length !== 0) {
          return showStatusModal(listErrors[0], false);
        }
      }
      setIsLoading(true);

      const bodyFormData = prepareDataToSubmit(isCreate ? null : id),
        params = {
          data: bodyFormData,
          params: { culture: getCulture() },
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${getStorage('accessToken')}`,
          },
        };

      (isCreate
        ? axios({
            // Tạo mới yêu cầu isTransferProposal ? đề xuất điều chuyển : đề xuất lương
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}${
              isTransferProposal ? 'appointment' : 'request'
            }`,
            ...params,
          })
        : axios({
            //update yêu cầu salaryadjustment
            method: 'PUT',
            url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}salaryadjustment`,
            ...params,
          })
      )
        .then((response) => {
          if (response.data.result && response.data.result.code === '000000') {
            return showStatusModal(t('RequestSent'), true, '/tasks');
          }
          showStatusModal(response.data.result.message || t('Error'), false);
        })
        .catch((response) => showStatusModal(t('Error'), false))
        .finally(() => setIsLoading(false));
    } else {
      // Review
      if (dataSalary?.processStatusId === 22) {
        const listErrors = validation();

        if (listErrors.length !== 0) {
          return setResultModal({
            show: true,
            title: t('InformationRequired'),
            message: listErrors[0],
            isSuccess: false,
          });
        } else {
          setIsLoading(true);
          const dataSend = {
            requestHistoryId: id,
            companyCode: getStorage('companyCode'),
            staffSalaryUpdate: selectMembers.map((u) => ({
              salaryAdjustmentId: u?.id,
              employeeNo: u?.employeeNo,
              currentSalary: u?.currentSalary,
              suggestedSalary: u?.suggestedSalary,
              contractType: u?.contractType,
              ...(isTransferProposal
                ? {
                    proposedPositionCode: u?.proposedPositionCode,
                    proposedPosition: u?.proposedPosition,
                    proposedDepartment: u?.proposedDepartment,
                    proposedDepartmentCode: u?.proposedDepartmentCode,
                  }
                : {}),
              staffStrengths: u?.strength,
              staffWknesses: u?.weakness,
              startDate: moment(
                u?.effectiveTime,
                Constants.LEAVE_DATE_FORMAT
              ).format('YYYY-MM-DD'),
            })),
          };
          axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}salaryadjustment/submitsalary`,
            params: { culture: getCulture() },
            data: dataSend,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getStorage('accessToken')}`,
            },
          })
            .then((response) => {
              if (
                response.data.result &&
                response.data.result.code === '000000'
              ) {
                return showStatusModal(t('RequestSent'), true, '/tasks');
              }
              showStatusModal(
                response.data.result.message || t('Error'),
                false
              );
            })
            .catch((response) => showStatusModal(t('Error'), false))
            .finally(() => setIsLoading(false));
        }
      }
    }
  };

  const prepareDataToSubmit = (id) => {
    if (isCreateMode) {
      let bodyFormData = new FormData(),
        appIndex = 1;
      const employeeInfoLst = selectMembers.map((u) => ({
          employeeNo: u?.employeeNo,
          username: u?.account.toLowerCase(),
          account: u?.account.toLowerCase().includes('@vingroup.net')
            ? u?.account.toLowerCase()
            : u?.account.toLowerCase() + '@vingroup.net',
          fullName: u?.fullName,
          jobTitle: u?.jobTitle,
          department: u?.department,
          organizationList: u?.organizationList,
          startDate:
            u?.startDate ||
            moment(u?.effectiveTime, Constants.LEAVE_DATE_FORMAT).format(
              'YYYY-MM-DD'
            ) ||
            '',
          expireDate: u?.expireDate,
          contractName: u?.contractName,
          contractType: u?.contractType,
          ...(isTransferProposal
            ? {
                proposedPositionCode: u?.proposedPositionCode,
                proposedPosition: u?.proposedPosition,
                proposedDepartment: u?.proposedDepartment,
                proposedDepartmentCode: u?.proposedDepartmentCode,
              }
            : {}),
          staffStrengths: u?.strength,
          staffWknesses: u?.weakness,
        })),
        staffInfoLst = [],
        appraiserInfoLst = supervisors
          .filter((item) => item !== null)
          .map((item, index) => ({
            avatar: '',
            account: item?.username.toLowerCase() + '@vingroup.net',
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
          })),
        { proposedStaff } = viewSetting;

      if (appraiser) {
        appraiserInfoLst.push({
          avatar: '',
          account: appraiser?.username?.toLowerCase() + '@vingroup.net',
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

      const approverInfoLst = [approver, approverArrive].map((ele, i) => ({
        avatar: '',
        account: ele?.username?.toLowerCase() + '@vingroup.net',
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
      }));

      bodyFormData.append('userId', proposedStaff.email);
      bodyFormData.append(
        'userInfo',
        JSON.stringify({
          employeeNo: proposedStaff.employeeNo,
          avatar: proposedStaff.avatar,
          account: proposedStaff.account?.toLowerCase() + '@vingroup.net',
          fullName: proposedStaff.fullName,
          employeeLevel: proposedStaff.employeeLevel,
          orglv2Id: proposedStaff.orgLv2Id,
          jobTitle: proposedStaff.jobTitle,
          department: proposedStaff.department,
          company_email: proposedStaff.company_email,
        })
      );
      bodyFormData.append('employeeInfoLst', JSON.stringify(employeeInfoLst));
      bodyFormData.append('appraiserInfoLst', JSON.stringify(appraiserInfoLst));
      bodyFormData.append('orgLv2Id', proposedStaff.orgLv2Id);
      bodyFormData.append('orgLv3Id', proposedStaff.orgLv3Id);
      bodyFormData.append('orgLv4Id', proposedStaff.orgLv4Id);
      bodyFormData.append('orgLv5Id', proposedStaff.orgLv5Id);
      bodyFormData.append('orgLv6Id', proposedStaff.orgLv6Id);
      bodyFormData.append('orgLv2Text', proposedStaff.orgLv2Text);
      bodyFormData.append('orgLv3Text', proposedStaff.orgLv3Text);
      bodyFormData.append('orgLv4Text', proposedStaff.orgLv4Text);
      bodyFormData.append('orgLv5Text', proposedStaff.orgLv5Text);
      bodyFormData.append('orgLv6Text', proposedStaff.orgLv6Text);
      bodyFormData.append('companyCode', proposedStaff.companyCode);
      bodyFormData.append('culture', getCulture());
      bodyFormData.append('staffInfoLst', JSON.stringify(staffInfoLst));
      bodyFormData.append('approverInfoLst', JSON.stringify(approverInfoLst));
      bodyFormData.append('deletedDocumentIds', listFileDeleted.join(','));

      if (isSalaryPropose) {
        bodyFormData.append(
          'coordinatorId',
          coordinator?.username.toLowerCase() + '@vingroup.net'
        );
        bodyFormData.append(
          'coordinatorInfo',
          JSON.stringify({
            avatar: '',
            account: coordinator?.username.toLowerCase() + '@vingroup.net',
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

      if (!!id) {
        bodyFormData.append('id', id);
      } else {
        bodyFormData.append('formType', 1);
        bodyFormData.append('isSalaryAdjustment', isSalaryAdjustment);
      }

      if (listFiles.filter((item) => item.id === undefined).length > 0) {
        listFiles
          .filter((item) => item.id === undefined)
          .forEach((file) => {
            bodyFormData.append('attachedFiles', file);
          });
      }

      return bodyFormData;
    }
  };

  const showStatusModal = (content, isSuccess = false, url = null) => {
    setModalStatus({ url, isSuccess, content, isShowStatusModal: true });
  };

  const hideStatusModal = () => {
    setModalStatus({ ...modalStatus, isShowStatusModal: false });
    if (modalStatus.url) window.location.href = modalStatus.url;
  };

  const handleUpdateCoordinator = (approver) => setCoordinator(approver);

  const removeSupervisorItem = (index) => {
    const newData = [...supervisors];
    newData.splice(index, 1);

    setSupervisors(newData);
  };

  const handleUpdateSupervisors = (approver, index) => {
    const userExist = supervisors.findIndex(
        (item) => approver?.uid && item?.uid === approver?.uid
      ),
      newData = [...supervisors];

    if (userExist !== -1) {
      return showStatusModal(t('AppraiserExisted'), false);
    }
    newData[index] = approver;

    setSupervisors(newData);
  };

  const handleUpdateHrChangeSalary = (approver) => setAppraiser(approver);

  const handleUpdateApprovalSalary = (approver) => setApprover(approver);

  const handleUpdateApprovalArriveSalary = (approver) =>
    setApproverArrive(approver);

  const validation = () => {
    let errors = [];

    selectMembers.forEach((u) => {
      if (!u.currentSalary) errors.push(t('CurrentSalaryValidate'));
      if (!u.suggestedSalary) errors.push(t('SuggestedSalaryValidate'));
      if (!u.effectiveTime) errors.push(t('SelecTimePeriodValidate'));
    });
    return errors;
  };

  const validateAppoitment = () => {
    const proposedPositionCodes = selectMembers.map(ele => ele?.proposedPositionCode)
    let errors = [];

    selectMembers.forEach((u) => {
      if (!u.proposedPositionCode) {
        errors.push(t("ProposedEmployeeEmpty"));
      } else if (proposedPositionCodes.filter(ele => ele === u?.proposedPositionCode).length > 1) {
        errors.push(t("ProposedPositionCodeDuplicate"));
      }

      if (!u.effectiveTime) errors.push(t('SelecTimePeriodValidate'));
    });
    return errors;
  };

  const handleChangeModalConfirmPassword = (token) => {
    getSalary(token);
    setAccessToken(token);
    setModalConfirmPassword(false);
  };

  const getSalary = (token) => {
    setIsLoading(true);
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}salaryadjustment/getsalarystaff`,
      params: { culture: getCulture() },
      data: {
        requestHistoryId: id,
        token: token,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getStorage('accessToken')}`,
      },
    })
      .then((response) => {
        if (response.data.result && response.data.result.code === '000000') {
          const selectMembersTmp = [...selectMembers];
          let currencySalaryTmp = 'VND',
            viewSettingTmp = { ...viewSetting };

          forEach(response.data.data, (value, key) => {
            selectMembersTmp.forEach((u) => {
              if (u.id === key) {
                u.currentSalary = value?.currentSalary || '';
                u.suggestedSalary = value?.suggestedSalary || '';
                currencySalaryTmp = value?.currentCurrency || 'VND';
              }
            });
          });

          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;

          setViewSetting(viewSettingTmp);
          setSelectMembers(selectMembersTmp);
          setCurrencySalary(currencySalaryTmp);
          return;
        }
        showStatusModal(response.data.result.message || t('Error'), false);
      })
      .catch((response) => showStatusModal(t('Error'), false))
      .finally(() => {
        setIsLoading(false);
        setIsCallSalary(true);
      });
  };

  const hideResultModal = () => {
    setResultModal({ title: '', message: '', show: false, isSuccess: false });
  };

  const handleClickProposal = (index) => {
    setProposalModal({ show: true, index, data: selectMembers[index] });
  };

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
    selectMembers[index].proposedDepartment = proposedDepartment;
    selectMembers[index].proposedPositionCode = proposedPositionCode;
    selectMembers[index].proposedDepartmentCode = proposedDepartmentCode;

    setSelectMembers(selectMembers);
    setProposalModal({ show: false });
  };

  const onHideModalConfirm = () => {
    setConfirmModal({ ...confirmModal, isShowModalConfirm: false });
  };

  function renderCurrency() {
    return currencySalary === 'VND'
      ? { locale: 'vi-VN', currency: 'VND' }
      : { locale: 'en-US', currency: 'USD' };
  }

  const renderListMember = () => {
    return selectMembers.map((item, index) => {
      if (item.shouldHide) return null;
      const isProposalTransfer =
          item.requestTypeId === Constants.PROPOSAL_TRANSFER,
        { showComponent, disableComponent } = viewSetting;

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
                      showComponent.btnExpertise || showComponent.btnApprove
                        ? 'inline'
                        : 'none',
                  }}
                  checked={selectedAll}
                  disabled={!canSelectedAll}
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
            <td colSpan={2} className="min-width text-center font-weight-bold">
              {t('effective_time')}
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
                      showComponent.btnExpertise || showComponent.btnApprove
                        ? 'inline'
                        : 'none',
                  }}
                  checked={checkedMemberIds[item.uid]?.checked || false}
                  disabled={!item.canChangeAction}
                  onChange={(e) => onCheckboxSelectChange(e, item.uid)}
                />
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  <p className="mb-7px font-weight-bold">
                    {item?.fullName}{' '}
                    <span className="font-weight-normal">
                      {!!item?.employeeNo ? `(${item?.employeeNo})` : ''}
                    </span>
                  </p>
                  <p className="mb-7px">{item?.jobTitle}</p>
                  <p
                    style={{
                      marginBottom: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={item?.organizationList}
                  >
                    {item?.organizationList}
                  </p>
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
                            width: disableComponent.showEye ? '90%' : '100%',
                          }}
                        >
                          {disableComponent.showCurrentSalary && accessToken ? (
                            <CurrencyInput
                              disabled={true}
                              intlConfig={renderCurrency()}
                              className="no-vborder"
                              value={item?.currentSalary}
                              placeholder="Nhập"
                              style={{ width: '100%', background: '#fff' }}
                              maxLength={11}
                            />
                          ) : (
                            '**********'
                          )}
                        </div>
                        {disableComponent.showEye && (
                          <div
                            style={{ width: '10%', cursor: 'pointer' }}
                            onClick={handleShowCurrentSalary}
                          >
                            <img
                              src={
                                disableComponent.showCurrentSalary
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
                    {disableComponent.editSubjectApply && !isCreateMode ? (
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
                        placeholder="Nhập"
                        maxLength={11}
                      />
                    ) : (
                      <>
                        {!isCreateMode && item?.suggestedSalary && (
                          <div className="d-flex w-100">
                            <div
                              style={{
                                width: disableComponent.showEye
                                  ? '90%'
                                  : '100%',
                              }}
                            >
                              {accessToken &&
                              disableComponent.showCurrentSalary ? (
                                <CurrencyInput
                                  disabled={true}
                                  intlConfig={renderCurrency()}
                                  className="no-vborder"
                                  value={item?.suggestedSalary}
                                  placeholder="Nhập"
                                  style={{ width: '100%', background: '#fff' }}
                                  maxLength={11}
                                />
                              ) : (
                                '**********'
                              )}
                            </div>
                            {disableComponent.showEye && (
                              <div
                                style={{ width: '10%', cursor: 'pointer' }}
                                onClick={handleShowCurrentSalary}
                              >
                                <img
                                  src={
                                    disableComponent.showCurrentSalary
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
                {disableComponent.editSubjectApply ? (
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
                {(showComponent.btnExpertise || showComponent.btnApprove) &&
                !isCreateMode &&
                item.canChangeAction ? (
                  <>
                    <span>
                      <input
                        type="radio"
                        id={'action_accept' + item.uid}
                        name={'action' + item.uid}
                        checked={!!item.accepted}
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
                        checked={!item.accepted}
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
                        checked={!!item.accepted}
                        disabled={true}
                      />
                      <label htmlFor="action_accept">{t('accept')}</label>
                    </span>
                    <span>
                      <input
                        type="radio"
                        id="action_reject"
                        value="reject"
                        checked={!item.accepted}
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
              {(showComponent.btnExpertise || showComponent.btnApprove) &&
              !isCreateMode &&
              item.canChangeAction ? (
                <>
                  <ResizableTextarea
                    placeholder={'Nhập'}
                    value={item?.comment || ''}
                    onChange={(e) =>
                      handleTextInputChange(
                        e.target.value,
                        item?.uid,
                        'comment'
                      )
                    }
                    className="form-control input mv-10 w-100"
                  />
                  {showCommentError &&
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
            {(isTransferProposal || isProposalTransfer) && (
              <td colSpan={isSalaryPropose ? '12' : '8'}>
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
                      style={{ fontSize: '14px', paddingLeft: '8px' }}
                      disabled
                    >
                      <option>
                        {!!item.proposedPosition
                          ? `${item?.proposedPosition} (${item.proposedPositionCode})`
                          : t('Select')}
                      </option>
                    </select>
                  </span>
                </div>
                <div className="skill mt-2">
                  <span className="title font-weight-bold">{t('proposal_org')}:</span>
                  <span
                    className="input form-control mv-10 w-100 disabled"
                    style={{ fontSize: '14px' }}
                  >
                    {item?.proposedDepartment}
                  </span>
                </div>
              </td>
            )}
          </tr>
          <tr>
            <td colSpan={isSalaryPropose ? '12' : '8'}>
              <div className="skill">
                <span className="title font-weight-bold">{t('strength')}:</span>
                <span className="input">
                  {disableComponent.editSubjectApply ? (
                    <ResizableTextarea
                      placeholder={'Nhập'}
                      value={item?.strength || ''}
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
            <td colSpan={isSalaryPropose ? '12' : '8'}>
              <div className="skill">
                <span className="title font-weight-bold">{t('weakness')}:</span>
                <span className="input">
                  {disableComponent.editSubjectApply ? (
                    <ResizableTextarea
                      placeholder={'Nhập'}
                      value={item?.weakness || ''}
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

  const salaryState = `salaryadjustment_${id}_${type}`,
    { showComponent, proposedStaff, disableComponent } = viewSetting;

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
            <div className="title">{t('TypeOfRequest')}</div>
            <Select
              placeholder={t('Select')}
              options={InsuranceOptions}
              isClearable={false}
              value={requestType}
              isDisabled={true}
              onChange={(e) => setRequestType(e)}
              className="input mv-10"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
        </div>
      </div>
      {/* I. THÔNG TIN CÁN BỘ ĐỀ XUẤT */}
      <h5 className="content-page-header">{t('info_proposed_staff')}</h5>
      <div className="timesheet-box1 shadow">
        <div className="row">
          <div className="col-4">
            {t('FullName')}
            <div className="detail">{proposedStaff.fullName}</div>
          </div>
          <div className="col-4">
            {t('Title')}
            <div className="detail">{proposedStaff.jobTitle}</div>
          </div>
          <div className="col-4">
            {t('DepartmentManage')}
            <div className="detail">{proposedStaff.department}</div>
          </div>
        </div>
      </div>
      {/* II. THÔNG TIN CBNV ĐƯỢC ĐỀ XUẤT */}
      <h5 className="content-page-header">{t('proposed_employee_info')}</h5>
      <div className="timesheet-box1 shadow">
        <div className="user_header">
          <span className="title">{t('employee_selected')}</span>
          <div
            className="action"
            style={
              showComponent.btnExpertise || showComponent.btnApprove
                ? {}
                : { display: 'none' }
            }
          >
            <button
              className="btn btn-outline-success btn-lg d-flex align-items-center"
              style={{
                gap: '7px',
                paddingLeft: '24px',
                paddingRight: '24px',
                fontSize: '14px',
              }}
              onClick={(e) => onActionChangeAll(true)}
            >
              <i className="fas fa-check fa-lg"></i>
              {t('accept')}
            </button>
            <button
              className="btn btn-outline-danger btn-lg d-flex align-items-center"
              style={{
                gap: '7px',
                paddingLeft: '24px',
                paddingRight: '24px',
                fontSize: '14px',
              }}
              onClick={(e) => onActionChangeAll(false)}
            >
              <i className="fas fa-times fa-lg"></i>
              {t('RejectQuestionButtonLabel')}
            </button>
          </div>
        </div>
        <div className="result-wrap-table">
          <table className="result-table" style={{ width: '100%' }}>
            <tbody>{renderListMember()}</tbody>
          </table>
        </div>
      </div>
      {/* Nhân sự hỗ trợ quyền xem lương */}
      {showComponent.showHrSupportViewSalary && isSalaryPropose && (
        <>
          <h5 className="content-page-header">
            {t('support_human_respone_view_salary')}
          </h5>
          <div className="timesheet-box1 timesheet-box shadow">
            <HumanForReviewSalaryComponent
              isEdit={!disableComponent.selectHrSupportViewSalary}
              approver={coordinator}
              isHR={true}
              updateApprover={(approver, isApprover) =>
                handleUpdateCoordinator(approver)
              }
              comment={dataSalary?.coordinatorComment}
            />
          </div>
        </>
      )}
      {/* CBQL THẨM ĐỊNH */}
      {showComponent.showCBQL && (
        <>
          <h5 className="content-page-header">
            {t('Consenter')}
            <span className="font-weight-normal ml-1 text-lowercase">
              ({t('if_any')})
            </span>
          </h5>
          <div className="timesheet-box1 timesheet-box shadow">
            {supervisors.map((item, key) => (
              <div
                key={`supervisors-${key}`}
                className="appraiser d-flex flex-column position-relative"
                style={key > 0 ? { marginTop: '20px' } : {}}
              >
                {isCreateMode && (
                  <button
                    className="btn btn-outline-danger position-absolute d-flex align-items-center btn-sm"
                    style={{ gap: '4px', top: 0, right: 0 }}
                    onClick={() => removeSupervisorItem(key)}
                  >
                    <Image src={IconRemove} />
                    {t('delete')}
                  </button>
                )}
                <HumanForReviewSalaryComponent
                  isEdit={!disableComponent.selectHrSupportViewSalary}
                  isAppraiser={true}
                  approver={item}
                  updateApprover={(sup) => handleUpdateSupervisors(sup, key)}
                  comment={
                    dataSalary?.requestAppraisers?.find(
                      (_, index) => index === key
                    )?.appraiserComment
                  }
                />
              </div>
            ))}
            {isCreateMode && (
              <button
                className="btn btn-outline-success btn-lg w-fit-content mt-3 d-flex align-items-center"
                style={{ gap: '4px', fontSize: '14px' }}
                onClick={() => setSupervisors([...supervisors, null])}
              >
                <Image src={IconAdd} />
                {t('Add')}
              </button>
            )}
          </div>
        </>
      )}
      {/* Nhân sự thẩm định */}
      {showComponent.showHrAssessment && (
        <>
          <h5 className="content-page-header">
            {t('HumanResourceChangeSalary')}
          </h5>
          <div className="timesheet-box1 timesheet-box shadow">
            <HumanForReviewSalaryComponent
              isEdit={!disableComponent.selectHrSupportViewSalary}
              approver={appraiser}
              isHR={true}
              updateApprover={(sup) => handleUpdateHrChangeSalary(sup)}
              comment={
                dataSalary?.requestAppraisers?.[
                  dataSalary?.requestAppraisers?.length - 1
                ]?.appraiserComment
              }
            />
          </div>
        </>
      )}
      {/* CBLĐ PHÊ DUYỆT */}
      {showComponent.showOfficerApproved && (
        <>
          <h5 className="content-page-header">{`${t('BossApproved')} (${t(
            'Sent'
          )})`}</h5>
          <div className="timesheet-box1 timesheet-box shadow">
            <HumanForReviewSalaryComponent
              isEdit={!disableComponent.selectHrSupportViewSalary}
              approver={approver}
              updateApprover={handleUpdateApprovalSalary}
              comment={dataSalary?.approverComment}
            />
          </div>
          <h5 className="content-page-header">{`${t('BossApproved')} (${t(
            'Arrive'
          )})`}</h5>
          <div className="timesheet-box1 timesheet-box shadow">
            <HumanForReviewSalaryComponent
              isEdit={!disableComponent.selectHrSupportViewSalary}
              approver={approverArrive}
              updateApprover={handleUpdateApprovalArriveSalary}
              comment={dataSalary?.approverComment}
              isAppraiserNote={true}
            />
          </div>
        </>
      )}
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
                style={{ color: '#858796' }}
              >
                {file.name}
              </a>
              {showComponent.showRemoveFile && (
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
      {showComponent.stateProcess && (
        <div className="block-status">{renderStatusDetail()}</div>
      )}
      <div className="d-flex justify-content-end mb-5">
        {/* Đính kèm tệp */}
        {showComponent.btnAttachFile && (
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
              style={{ marginBottom: '0px' }}
            >
              <i className="fas fa-paperclip"></i> {t('AttachmentFile')}
            </label>
          </>
        )}
        {/* Hủy */}
        {showComponent.btnCancel && (
          <button
            type="button"
            className="btn btn-secondary ml-3 shadow"
            onClick={handleCancel}
          >
            <img src={IconDelete} className="mr-1" alt="cancel" />{' '}
            {t('CancelSearch')}
          </button>
        )}

        {/* Gửi yêu cầu */}
        {showComponent.btnSendRequest && (
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
            )}{' '}
            {t('Send')}
          </button>
        )}
        {/* Từ chối và xác nhận cho luồng NLĐ xác nhận */}
        {showComponent.showWorkersConfirm && (
          <>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => handleConfirmEmployee(false)}
            >
              <img src={IconDelete} className="mr-1" alt="delete" />{' '}
              {t('RejectQuestionButtonLabel')}
            </button>
            <button
              type="button"
              className="btn btn-primary float-right ml-3 shadow"
              onClick={() => handleConfirmEmployee(true)}
            >
              <i className="fas fa-check" aria-hidden="true"></i> {t('Confirm')}
            </button>
          </>
        )}
        {/* Từ chối */}
        {showComponent.btnRefuse && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleRefuse}
          >
            <img src={IconDelete} className="mr-1" alt="delete" />{' '}
            {t('RejectQuestionButtonLabel')}
          </button>
        )}
        {/* Thẩm định */}
        {showComponent.btnExpertise && (
          <button
            type="button"
            className="btn btn-primary float-right ml-3 shadow"
            style={enableSubmit ? {} : { opacity: 0.2 }}
            onClick={handleConsent}
            disabled={enableSubmit ? false : true}
          >
            <i className="fas fa-check" aria-hidden="true"></i> {t('Consent')}
          </button>
        )}
        {/* Không phê duyệt */}
        {showComponent.btnNotApprove && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleReject}
          >
            <img src={IconDelete} className="mr-1" alt="delete" /> {t('Reject')}
          </button>
        )}
        {/* Phê duyệt */}
        {showComponent.btnApprove && (
          <button
            type="button"
            className="btn btn-success float-right ml-3 shadow"
            disabled={enableSubmit ? false : true}
            style={enableSubmit ? {} : { opacity: 0.2 }}
            onClick={handleApprove}
          >
            <i className="fas fa-check" aria-hidden="true"></i> {t('Approval')}
          </button>
        )}
      </div>
    </div>
  );
};

export default withTranslation()(SalaryAdjustmentPropose);
