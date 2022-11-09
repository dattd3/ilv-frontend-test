/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from 'react-router';
import moment from "moment";
import { forEach } from 'lodash';
import Select from 'react-select';
import Spinner from 'react-bootstrap/Spinner';
import { withTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FilterMember from "../../ShareComponents/FilterMember";
import ConfirmationModal from '../../../Registration/ConfirmationModal';
import ResultModal from "./ResultModal";
import HumanForReviewSalaryComponent from "../../../Registration/HumanForReviewSalaryComponent";
import ConfirmPasswordModal from '../../../Registration/ContractEvaluation/SalaryPropose/ConfirmPasswordModal';
import StatusModal from '../../../../components/Common/StatusModal'
import ResizableTextarea from '../../../Registration/TextareaComponent';
import Constants from '../.../../../../../commons/Constants';
import CurrencyInput from 'react-currency-input-field';
import IconDelete from '../../../../assets/img/icon/Icon_Cancel.svg';
import IconEye from '../../../../assets/img/icon/eye.svg';
import IconNotEye from '../../../../assets/img/icon/not-eye.svg';
import { useApi } from '../../../../modules/api';
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

const InsuranceOptions = [
  { value: 1, label: 'Đề xuất Điều chỉnh thu nhập' },
];
const ListTypeContract = [
  { value: 'VA', label: 'HĐLĐ XĐ thời hạn' },
  { value: 'VB', label: 'HĐLĐ KXĐ thời hạn' },
  { value: 'VC', label: 'HĐLĐ theo mùa vụ' },
  { value: 'VD', label: 'Hợp đồng tập nghề' },
  { value: 'VE', label: 'Hợp đồng thử việc' },
  { value: 'VF', label: 'HĐDV theo tháng' },
  { value: 'VG', label: 'HĐDV theo giờ' },
  { value: 'VH', label: 'HĐDV khoán' }
]

const SalaryAdjustmentPropse = (props) => {
  const { t } = props;
  const api = useApi();
  const history = useHistory();
  const [resultModal, setResultModal] = useState({
    show: false,
    title: '',
    message: '',
    isSuccess: false,
  });
  const [modalStatus, setModalStatus] = useState({
    isShowStatusModal: false,
    content: '',
    isSuccess: true,
    url: '',
  });

  const [confirmModal, setConfirmModal] = useState({
    isShowModalConfirm: false,
    modalTitle: "",
    typeRequest: "",
    modalMessage: "",
    confirmStatus: ""
  });

  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [modalConfirmPassword, setModalConfirmPassword] = useState(false);
  const [accessToken, setAccessToken] = useState(new URLSearchParams(props.history.location.search).get('accesstoken') || null);
  const [type, setType] = useState(InsuranceOptions[0]);
  const [listFiles, setListFiles] = useState([]);
  const [selectMembers, setSelectMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [dataSalary, setDataSalary] = useState(undefined);
  const [currencySalary, setCurrencySalary] = useState('VND');

  const [coordinator, setCoordinator] = useState(null); // Nhân sự hỗ trợ xin quyền xem lương
  const [supervisor, setSupervisor] = useState(null); // CBQL cấp cơ sở
  const [appraiser, setAppraiser] = useState(null); // HR thẩm định quyền điều chỉnh lương
  const [approver, setApprover] = useState(null); // CBLĐ phê duyệt

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
      showCBQL: false, // Hien thi CBQL CẤP CƠ SỞ
      showHrAssessment: false, // Hien thi Nhân sự thẩm định quyền điều chỉnh lương
      showOfficerApproved: false, // Hien thi CBLĐ PHÊ DUYỆT
      showRemoveFile: false, // Hien thi icon remove file
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
    },
  });

  useEffect(() => {
    if (props.match.params.id) {
      if (props.match.params.id !== 'create') {
        // Review mode
        setIsCreateMode(false);
        getDataSalary();
      } else {
        // Create mode
        setIsCreateMode(true);
        checkViewCreate();
      }
    } else {
      props.history.push('proposal-management')
    }

    const queryParams = new URLSearchParams(props.history.location.search)
    if (queryParams.has('accesstoken')) {
      queryParams.delete('accesstoken')
      props.history.replace({
        search: queryParams.toString(),
      })
    }
    // eslint-disable-next-line
  }, []);

  const getDataSalary = async () => {
    try {
      const { data: { data: response } } = await api.fetchSalaryPropose(props.match.params.id);
      await setDataSalary(response)
      await checkAuthorize(response);
    } catch (error) {
      console.log(error);
    }
  }

  const checkViewCreate = () => {
    let viewSettingTmp = { ...viewSetting };
    viewSettingTmp.showComponent.btnAttachFile = true;
    viewSettingTmp.showComponent.btnSendRequest = true;
    viewSettingTmp.showComponent.showHrSupportViewSalary = true;
    viewSettingTmp.showComponent.showRemoveFile = true;
    viewSettingTmp.disableComponent.editSubjectApply = true;
    viewSettingTmp.disableComponent.selectHrSupportViewSalary = true;

    viewSettingTmp.proposedStaff.avatar = localStorage.getItem('avatar') || ""
    viewSettingTmp.proposedStaff.account = localStorage.getItem('email').split('@')[0] || ""
    viewSettingTmp.proposedStaff.email = localStorage.getItem('email') || ""
    viewSettingTmp.proposedStaff.company_email = localStorage.getItem('plEmail') || ""
    viewSettingTmp.proposedStaff.employeeNo = localStorage.getItem('employeeNo') || ""
    viewSettingTmp.proposedStaff.employeeLevel = localStorage.getItem('employeeLevel') || ""
    viewSettingTmp.proposedStaff.fullName = localStorage.getItem('fullName') || ""
    viewSettingTmp.proposedStaff.jobTitle = localStorage.getItem('jobTitle') || ""
    viewSettingTmp.proposedStaff.department = localStorage.getItem('department') || ""
    viewSettingTmp.proposedStaff.orgLv2Id = localStorage.getItem('organizationLv2') || ""
    viewSettingTmp.proposedStaff.orgLv3Id = localStorage.getItem('organizationLv3') || ""
    viewSettingTmp.proposedStaff.orgLv4Id = localStorage.getItem('organizationLv4') || ""
    viewSettingTmp.proposedStaff.orgLv5Id = localStorage.getItem('organizationLv5') || ""
    viewSettingTmp.proposedStaff.orgLv6Id = localStorage.getItem('organizationLv6') || ""
    viewSettingTmp.proposedStaff.orgLv2Text = localStorage.getItem('company') || ""
    viewSettingTmp.proposedStaff.orgLv3Text = localStorage.getItem('division') || ""
    viewSettingTmp.proposedStaff.orgLv4Text = localStorage.getItem('region') || ""
    viewSettingTmp.proposedStaff.orgLv5Text = localStorage.getItem('unit') || ""
    viewSettingTmp.proposedStaff.orgLv6Text = localStorage.getItem('part') || ""
    viewSettingTmp.proposedStaff.companyCode = localStorage.getItem('companyCode') || ""
    setViewSetting(viewSettingTmp)
  }

  const checkAuthorize = (dataSalaryInfo) => {
    const currentEmail = localStorage.getItem('email');
    let viewSettingTmp = { ...viewSetting };
    switch (dataSalaryInfo?.processStatusId) {
      // Đang chờ nhân sự điều phối & Đang chờ nhân sự thẩm định người xem lương
      case 21:
      case 22:
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        if (accessToken) {
          viewSettingTmp.disableComponent.showCurrentSalary = true;
          viewSettingTmp.disableComponent.showSuggestedSalary = true;
        }
        break;
      // Đang chờ QLTT nhập lương đề xuất, xem lương hiện tại
      case 23:
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        if (currentEmail.toLowerCase() === dataSalaryInfo?.userId?.toLowerCase()
          && props.match.params.type === 'request') {
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
        break;
      // Đang chờ CBQL Cấp cơ sở thẩm định
      case 8:
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        if (currentEmail.toLowerCase() === dataSalaryInfo?.appraiserId?.toLowerCase()
          && props.match.params.type === 'access'
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
      // Đang chờ nhân sự thẩm định lương đề xuất
      case 24:
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        if (currentEmail.toLowerCase() === dataSalaryInfo?.supervisorId?.toLowerCase()
          && props.match.params.type === 'access'
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
        if (currentEmail.toLowerCase() === dataSalaryInfo?.approverId?.toLowerCase()
          && props.match.params.type === 'approval'
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
      // Case từ chối
      case 7:
      // Case không phê duyệt
      case 1:
        viewSettingTmp.showComponent.stateProcess = true;
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        break;
      default:
        break;
    }
    viewSettingTmp.proposedStaff.fullName = dataSalaryInfo?.user?.fullName
    viewSettingTmp.proposedStaff.jobTitle = dataSalaryInfo?.user?.jobTitle
    viewSettingTmp.proposedStaff.department = dataSalaryInfo?.user?.department

    if (dataSalaryInfo?.requestInfo.length !== 0) {
      const requestInfo = dataSalaryInfo?.requestInfo[0];
      // Nhân sự điều phối
      if (requestInfo?.coordinatorInfo)
        setCoordinator({
          fullName: JSON.parse(requestInfo?.coordinatorInfo)?.fullName,
          account: JSON.parse(requestInfo?.coordinatorInfo)?.account,
          current_position: JSON.parse(requestInfo?.coordinatorInfo)?.current_position,
          department: JSON.parse(requestInfo?.coordinatorInfo)?.department
        })
      // Thong tin CBNV
      const employeeLists = dataSalaryInfo?.requestInfo.map(u => {
        const requestTmp = JSON.parse(u?.employeeInfo)
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
          currentSalary: "0",
          suggestedSalary: "0",
          effectiveTime: u?.startDate ? moment(u?.startDate).format(Constants.LEAVE_DATE_FORMAT) : "",
          strength: u?.staffStrengths,
          weakness: u?.staffWknesses,
        }
      })
      setSelectedMembers(employeeLists)
    }

    // CBQL cấp cơ sở
    if (dataSalaryInfo?.supervisorInfo)
      setSupervisor({
        fullName: JSON.parse(dataSalaryInfo?.supervisorInfo)?.fullName,
        account: JSON.parse(dataSalaryInfo?.supervisorInfo)?.account,
        current_position: JSON.parse(dataSalaryInfo?.supervisorInfo)?.current_position,
        department: JSON.parse(dataSalaryInfo?.supervisorInfo)?.department
      })
    // HR thẩm định quyền điều chỉnh lương
    if (dataSalaryInfo?.appraiserInfo)
      setAppraiser({
        fullName: JSON.parse(dataSalaryInfo?.appraiserInfo)?.fullName,
        account: JSON.parse(dataSalaryInfo?.appraiserInfo)?.account,
        current_position: JSON.parse(dataSalaryInfo?.appraiserInfo)?.current_position,
        department: JSON.parse(dataSalaryInfo?.appraiserInfo)?.department
      })
    // CBLĐ phê duyệt
    if (dataSalaryInfo?.approverInfo)
      setApprover({
        fullName: JSON.parse(dataSalaryInfo?.approverInfo)?.fullName,
        account: JSON.parse(dataSalaryInfo?.approverInfo)?.account,
        current_position: JSON.parse(dataSalaryInfo?.approverInfo)?.current_position,
        department: JSON.parse(dataSalaryInfo?.approverInfo)?.department
      })

    const requestDocuments = dataSalaryInfo?.requestDocuments.map(u => ({ id: u.id, name: u.fileName, link: u.fileUrl }))
    setListFiles(requestDocuments)
    setViewSetting(viewSettingTmp)
  }

  const handleSelectMembers = (members) => {
    const membersMapping = members.map(u => ({
      uid: u?.uid,
      employeeNo: u?.uid,
      account: u?.username.toLowerCase(),
      fullName: u?.fullname,
      jobTitle: u?.title,
      startDate: '',
      expireDate: '',
      contractName: u?.contractName,
      contractType: u?.contractType,
      department: u?.department,
      currentSalary: '',
      suggestedSalary: '',
      effectiveTime: '',
      strength: '',
      weakness: '',
    }))
    setSelectMembers(membersMapping)
  }

  const handleSelectedMembers = (members) => {
    const membersMapping = members.map(u => ({
      uid: u?.uid,
      employeeNo: u?.uid,
      account: u?.username.toLowerCase(),
      fullName: u?.fullname,
      jobTitle: u?.job_name,
      startDate: '',
      expireDate: '',
      contractName: u?.contractName,
      contractType: u?.contractType,
      department: u?.department,
      currentSalary: '',
      suggestedSalary: '',
      effectiveTime: '',
      strength: '',
      weakness: '',
    }))
    setSelectedMembers(membersMapping)
  }

  const handleTextInputChange = (value, uid, objName) => {
    const selectedMembersTmp = [...selectedMembers];
    selectedMembersTmp.forEach(item => {
      if (item.uid === uid) {
        item[objName] = value
      }
    })
    setSelectedMembers(selectedMembersTmp)
  }

  const handleDatePickerInputChange = (value, uid, objName) => {
    const selectedMembersTmp = [...selectedMembers];
    selectedMembersTmp.forEach(item => {
      if (item.uid === uid) {
        if (moment(value, 'DD-MM-YYYY').isValid()) {
          const date = moment(value, Constants.LEAVE_DATE_FORMAT);
          item[objName] = date;
        } else {
          item[objName] = '';
        }
      }
    })
    setSelectedMembers(selectedMembersTmp)
  }

  const handleShowCurrentSalary = () => {
    if (!accessToken) {
      setModalConfirmPassword(true)
    } else if (!viewSetting.disableComponent.showCurrentSalary) {
      getSalary(accessToken)
    }
  }

  const handleShowSuggestedSalary = () => {
    if (!accessToken) {
      setModalConfirmPassword(true)
    } else if (!viewSetting.disableComponent.showSuggestedSalary) {
      getSalary(accessToken)
    }
  }

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
          id: props.match.params.id,
          requestTypeId: 12,
          sub: [
            {
              id: props.match.params.id,
              processStatusId: 7,
              comment: "",
              status: "",
            }
          ],
        }
      ],
    })
  }

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
          id: props.match.params.id,
          requestTypeId: 12,
          sub: [
            {
              id: props.match.params.id,
              processStatusId: 1,
              comment: "",
              status: "",
            }
          ],
        }
      ],
    })
  }

  // Hủy
  const handleCancel = () => {
    history.push('/tasks');
  }

  // Attach file
  const handleAttachFile = (e) => {
    const files = Object.values(e.target.files)
    const listFilesTmp = [...listFiles, ...files];
    setListFiles(listFilesTmp)
  }

  const removeFiles = (id, index) => {
    // Todo: handle remove file
    const listFilesTmp = [...listFiles].filter((item, i) => i !== index)
    setListFiles(listFilesTmp)
  }

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
          id: props.match.params.id,
          requestTypeId: 12,
          sub: [
            {
              id: props.match.params.id,
              processStatusId: 5,
              comment: "",
              status: "",
            }
          ],
        }
      ],
    })
  }

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
          id: props.match.params.id,
          requestTypeId: 12,
          sub: [
            {
              id: props.match.params.id,
              processStatusId: 2,
              comment: "",
              status: "",
            }
          ],
        }
      ],
    })
  }

  // Gửi yêu cầu
  const handleSendForm = () => {
    // Create
    if (isCreateMode) {
      if (selectMembers.length === 0) {
        showStatusModal(t("ProposedEmployeeValidate"), false)
        return;
      }
      if (!coordinator) {
        showStatusModal(t("HumanForReviewSalaryValidate"), false)
        return;
      }
      setIsLoading(true)
      const bodyFormData = prepareDataToSubmit()
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_REQUEST_URL}salaryAdjustment/create`,
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      })
        .then(response => {
          if (response.data.result && response.data.result.code === '000000') {
            showStatusModal(t("RequestSent"), true, '/tasks')
            return;
          }
          showStatusModal(response.data.result.message || t("Error"), false)
        })
        .catch(response => {
          showStatusModal(t("Error"), false)
        }).finally(() => {
          setIsLoading(false)
        })
    } else {
      // Review
      if (dataSalary?.processStatusId === 23) {
        const listErrors = validation();
        if (listErrors.length !== 0) {
          setResultModal({
            show: true,
            title: t("InformationRequired"),
            message: listErrors[0],
            isSuccess: false,
          })
          return;
        } else {
          setIsLoading(true)
          const dataSend = {
            requestHistoryId: props.match.params.id,
            companyCode: localStorage.getItem('companyCode') || "",
            staffSalaryUpdate: selectedMembers.map(u => ({
              salaryAdjustmentId: u?.id,
              employeeNo: u?.employeeNo,
              currentSalary: u?.currentSalary,
              suggestedSalary: u?.suggestedSalary,
              contractType: u?.contractType,
              staffStrengths: u?.strength,
              staffWknesses: u?.weakness,
              startDate: moment(u?.effectiveTime, Constants.LEAVE_DATE_FORMAT).format('YYYY-MM-DD')
            }))
          }
          axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_URL}SalaryAdjustment/submitsalary`,
            data: dataSend,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
          })
            .then(response => {
              if (response.data.result && response.data.result.code === '000000') {
                showStatusModal(t("RequestSent"), true, '/tasks')
                return;
              }
              showStatusModal(response.data.result.message || t("Error"), false)
            })
            .catch(response => {
              showStatusModal(t("Error"), false)
            })
            .finally(() => {
              setIsLoading(false)
            })
        }
      }
    }
  };

  const prepareDataToSubmit = () => {
    if (isCreateMode) {
      let bodyFormData = new FormData();
      const employeeInfoLst = selectMembers.map(u => ({
        employeeNo: u?.employeeNo,
        account: u?.account.toLowerCase() + "@vingroup.net",
        fullName: u?.fullName,
        jobTitle: u?.jobTitle,
        department: u?.department,
        startDate: u?.startDate,
        expireDate: u?.expireDate,
        contractName: u?.contractName,
        contractType: u?.contractType,
      }))
      bodyFormData.append('userId', viewSetting.proposedStaff.email);
      bodyFormData.append('userInfo', JSON.stringify({
        employeeNo: viewSetting.proposedStaff.employeeNo,
        avatar: viewSetting.proposedStaff.avatar,
        account: viewSetting.proposedStaff.account.toLowerCase() + "@vingroup.net",
        fullName: viewSetting.proposedStaff.fullName,
        employeeLevel: viewSetting.proposedStaff.employeeLevel,
        orglv2Id: viewSetting.proposedStaff.orgLv2Id,
        jobTitle: viewSetting.proposedStaff.jobTitle,
        department: viewSetting.proposedStaff.department,
        company_email: viewSetting.proposedStaff.company_email,
      }));
      bodyFormData.append('coordinatorId', coordinator?.account.toLowerCase() + "@vingroup.net");
      bodyFormData.append('coordinatorInfo', JSON.stringify({
        avatar: coordinator?.avatar,
        account: coordinator?.account.toLowerCase() + "@vingroup.net",
        fullName: coordinator?.fullName,
        employeeLevel: coordinator?.employeeLevel,
        pnl: coordinator?.pnl,
        orglv2Id: coordinator?.orglv2Id,
        current_position: coordinator?.current_position,
        department: coordinator?.department,
        company_email: coordinator?.company_email.toLowerCase(),
      }));
      bodyFormData.append('employeeInfoLst', JSON.stringify(employeeInfoLst));
      bodyFormData.append('orgLv2Id', viewSetting.proposedStaff.orgLv2Id);
      bodyFormData.append('orgLv3Id', viewSetting.proposedStaff.orgLv3Id);
      bodyFormData.append('orgLv4Id', viewSetting.proposedStaff.orgLv4Id);
      bodyFormData.append('orgLv5Id', viewSetting.proposedStaff.orgLv5Id);
      bodyFormData.append('orgLv6Id', viewSetting.proposedStaff.orgLv6Id);
      bodyFormData.append('orgLv2Text', viewSetting.proposedStaff.orgLv2Text);
      bodyFormData.append('orgLv3Text', viewSetting.proposedStaff.orgLv3Text);
      bodyFormData.append('orgLv4Text', viewSetting.proposedStaff.orgLv4Text);
      bodyFormData.append('orgLv5Text', viewSetting.proposedStaff.orgLv5Text);
      bodyFormData.append('orgLv6Text', viewSetting.proposedStaff.orgLv6Text);
      bodyFormData.append('companyCode', viewSetting.proposedStaff.companyCode);

      if (listFiles.length > 0) {
        listFiles.forEach(file => {
          bodyFormData.append('attachedFiles', file)
        })
      }

      return bodyFormData
    }
  }

  const showStatusModal = (message, isSuccess = false, url = null) => {
    setModalStatus({
      isShowStatusModal: true,
      content: message,
      isSuccess: isSuccess,
      url: url,
    })
  }

  const hideStatusModal = () => {
    setModalStatus({
      ...modalStatus,
      isShowStatusModal: false,
    })
    if (modalStatus.url) {
      window.location.href = modalStatus.url;
    }
  }

  const handleUpdateCoordinator = (approver, isApprover) => {
    setCoordinator(approver)
  }

  const validation = () => {
    const selectedMembersTmp = [...selectedMembers];
    let errors = [];
    selectedMembersTmp.forEach(u => {
      if (!u.currentSalary) errors.push(t("CurrentSalaryValidate"))
      if (!u.suggestedSalary) errors.push(t("SuggestedSalaryValidate"))
      if (!u.effectiveTime) errors.push(t("SelecTimePeriodValidate"))
    })
    return errors;
  }

  const handleChangeModalConfirmPassword = (token) => {
    setAccessToken(token)
    setModalConfirmPassword(false)
    getSalary(token)
  }

  const getSalary = (token) => {
    const dataSend = {
      requestHistoryId: props.match.params.id,
      token: token,
    }
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_REQUEST_URL}SalaryAdjustment/getsalarystaff`,
      data: dataSend,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
      .then((response) => {
        if (response.data.result && response.data.result.code === '000000') {
          const selectedMembersTmp = [...selectedMembers]
          let currencySalaryTmp = 'VND'
          forEach(response.data.data, (value, key) => {
            selectedMembersTmp.forEach(u => {
              if (u.id == key) {
                u.currentSalary = value?.currentSalary || ""
                u.suggestedSalary = value?.suggestedSalary || ""
                currencySalaryTmp = value?.currentCurrency || 'VND'
              }
            })
          });
          setSelectedMembers(selectedMembersTmp)
          setCurrencySalary(currencySalaryTmp)

          let viewSettingTmp = { ...viewSetting };
          viewSettingTmp.disableComponent.showSuggestedSalary = !viewSettingTmp.disableComponent.showSuggestedSalary
          viewSettingTmp.disableComponent.showCurrentSalary = !viewSettingTmp.disableComponent.showCurrentSalary
          setViewSetting(viewSettingTmp)
          return;
        }
        showStatusModal(response.data.result.message || t("Error"), false)
      })
      .catch(response => {
        showStatusModal(t("Error"), false)
      })
  }

  const hideResultModal = () => {
    setResultModal({
      show: false,
      title: '',
      message: '',
      isSuccess: false,
    })
  }

  const onHideModalConfirm = () => {
    setConfirmModal({
      ...confirmModal,
      isShowModalConfirm: false
    })
  }

  function renderCurrency() {
    let currencySalaryTmp = {}
    if (currencySalary === 'VND') {
      currencySalaryTmp = { locale: 'vi-VN', currency: 'VND' }
    } else {
      currencySalaryTmp = { locale: 'en-US', currency: 'USD' }
    }
    return currencySalaryTmp
  }

  const renderListMember = (members) => {
    return (
      members.map((item, index) => {
        return <tr key={index}>
          <td className="text-center"><span className="same-width">{item?.fullName}</span></td>
          <td className="text-center"><span className="same-width">{item?.jobTitle}</span></td>
          <td className="text-center"><span className="same-width">{item?.department}</span></td>
          <td className="text-center">
            <span className="same-width">
              {ListTypeContract.find(u => u?.value === item?.contractType)?.label}
            </span>
          </td>
          <td className="text-center">
            <span className="same-width">
              {!isCreateMode ?
                <div className="d-flex w-100">
                  <div style={{ width: viewSetting.disableComponent.showEye ? '90%' : '100%' }}>
                    {viewSetting.disableComponent.showCurrentSalary && accessToken ?
                      <CurrencyInput
                        disabled={true}
                        intlConfig={renderCurrency()}
                        className="no-vborder"
                        value={item?.currentSalary}
                        placeholder="Nhập"
                        style={{ width: '100%', background: '#fff' }}
                      />
                      : <span>{'**********'}</span>
                    }
                  </div>
                  {viewSetting.disableComponent.showEye &&
                    <div
                      style={{ width: '10%', cursor: 'pointer' }}
                      onClick={() => handleShowCurrentSalary()}
                    >
                      <img src={viewSetting.disableComponent.showCurrentSalary ? IconEye : IconNotEye} alt='eye' />
                    </div>
                  }
                </div>
                : <></>
              }
            </span>
          </td>
          <td className="text-center">
            <span className="same-width">
              {viewSetting.disableComponent.editSubjectApply && !isCreateMode ?
                <CurrencyInput
                  disabled={false}
                  intlConfig={renderCurrency()}
                  className="form-control"
                  value={item?.suggestedSalary}
                  onValueChange={(value) => { handleTextInputChange(value, item?.uid, 'suggestedSalary') }}
                  placeholder="Nhập"
                />
                :
                <>
                  {!isCreateMode && item?.suggestedSalary &&
                    <div className="d-flex w-100">
                      <div style={{ width: viewSetting.disableComponent.showEye ? '90%' : '100%' }}>
                        {accessToken && viewSetting.disableComponent.showSuggestedSalary ?
                          <CurrencyInput
                            disabled={true}
                            intlConfig={renderCurrency()}
                            className="no-vborder"
                            value={item?.suggestedSalary}
                            placeholder="Nhập"
                            style={{ width: '100%', background: '#fff' }}
                          />
                          : '**********'
                        }
                      </div>
                      {viewSetting.disableComponent.showEye &&
                        <div
                          style={{ width: '10%', cursor: 'pointer' }}
                          onClick={() => handleShowSuggestedSalary()}
                        >
                          <img src={viewSetting.disableComponent.showSuggestedSalary ? IconEye : IconNotEye} alt='eye' />
                        </div>
                      }
                    </div>
                  }
                </>
              }
            </span>
          </td>
          <td className="same-width text-center">
            <span className="same-width">
              {viewSetting.disableComponent.editSubjectApply && !isCreateMode ?
                <DatePicker
                  name="startDate"
                  autoComplete="off"
                  selected={
                    item?.effectiveTime
                      ? moment(item?.effectiveTime, Constants.LEAVE_DATE_FORMAT).toDate()
                      : null
                  }
                  onChange={(date) => handleDatePickerInputChange(date, item?.uid, "effectiveTime")}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={t("Select")}
                  locale={t("locale")}
                  className="form-control input"
                  styles={{ width: "100%" }}
                />
                : <>{item?.effectiveTime}</>
              }
            </span>
          </td>
          <td>
            <span className="same-width text-center">
              {viewSetting.disableComponent.editSubjectApply && !isCreateMode ?
                <ResizableTextarea
                  placeholder={"Nhập"}
                  value={item?.strength}
                  onChange={(e) => handleTextInputChange(e.target.value, item?.uid, "strength")}
                  className="form-control input mv-10 w-100"
                />
                : <>{item?.strength}</>
              }
            </span>
          </td>
          <td>
            <span className="same-width text-center">
              {viewSetting.disableComponent.editSubjectApply && !isCreateMode ?
                <ResizableTextarea
                  placeholder={"Nhập"}
                  value={item?.weakness}
                  onChange={(e) => handleTextInputChange(e.target.value, item?.uid, "weakness")}
                  className="form-control input mv-10 w-100"
                />
                : <>{item?.weakness}</>
              }
            </span>
          </td>
        </tr>
      })
    )
  }
  const salaryState = `salaryadjustment_${props.match.params?.id}_${props.match.params?.type}`;
  return (
    <div className="timesheet-section proposal-management">
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
      {/* ĐỀ XUẤT ĐIỀU CHỈNH LƯƠNG */}
      <h5 className="content-page-header">{t("SalaryAdjustmentPropse")}</h5>
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
              onChange={e => setType(e)} className="input mv-10"
              styles={{ menu: provided => ({ ...provided, zIndex: 2 }) }} />
          </div>
        </div>
      </div>
      {/* I. THÔNG TIN CÁN BỘ ĐỀ XUẤT */}
      <h5 className="content-page-header">{"I. THÔNG TIN CÁN BỘ ĐỀ XUẤT"}</h5>
      <div className="timesheet-box1 shadow">
        <div className="row">
          <div className="col-4">{t("FullName")}
            <div className="detail">{viewSetting.proposedStaff.fullName}</div>
          </div>
          <div className="col-4">{t("Title")}
            <div className="detail">{viewSetting.proposedStaff.jobTitle}</div>
          </div>
          <div className="col-4">{t("DepartmentManage")}
            <div className="detail">{viewSetting.proposedStaff.department}</div>
          </div>
        </div>
      </div>
      {/* II. THÔNG TIN CBNV ĐƯỢC ĐỀ XUẤT */}
      <h5 className="content-page-header">{"II. THÔNG TIN CBNV ĐƯỢC ĐỀ XUẤT"}</h5>
      {isCreateMode &&
        <>
          <div className="timesheet-box1 timesheet-box shadow">
            <div className="row">
              <div className="col-12">
                {isCreateMode ?
                  <FilterMember
                    {...props}
                    isEdit={true}
                    selectedMembers={[]}
                    handleSelectMembers={handleSelectMembers}
                  />
                  :
                  <FilterMember
                    {...props}
                    isEdit={false}
                    selectedMembers={selectedMembers}
                    handleSelectMembers={handleSelectedMembers}
                  />
                }
              </div>
            </div>
          </div>
          <br />
        </>
      }
      <div className="timesheet-box1 shadow">
        <div className="result-wrap-table">
          <table className="result-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <td rowSpan="2" className="min-width text-center font-weight-bold">Họ và tên</td>
                <td rowSpan="2" className="min-width text-center font-weight-bold">Chức danh</td>
                <td rowSpan="2" className="min-width text-center font-weight-bold">Khối/Phòng/Bộ phận</td>
                <td rowSpan="2" className="min-width text-center font-weight-bold">Loại HĐ hiện tại</td>
                <td rowSpan="2" className="min-width1 text-center"><strong>Thu nhập hiện tại</strong><span> (Gross)</span></td>
                <td rowSpan="2" className="min-width1 text-center"><strong>Mức lương đề xuất</strong><span> (Gross)</span></td>
                <td rowSpan="2" className="min-width text-center font-weight-bold">Thời gian hiệu lực</td>
                <th colSpan="2" scope="colgroup" className="min-width text-center font-weight-bold">Đánh giá chung</th>
              </tr>
              <tr>
                <th scope="col" className="min-width3 text-center">Điểm mạnh</th>
                <th scope="col" className="min-width3 text-center">Điểm yếu</th>
              </tr>
            </thead>
            <tbody>
              {props.match.params.id !== 'create' ?
                <>{renderListMember(selectedMembers)}</>
                : <>{renderListMember(selectMembers)}</>
              }
            </tbody>
          </table>
        </div>
      </div>
      {/* Nhân sự hỗ trợ quyền xem lương */}
      {viewSetting.showComponent.showHrSupportViewSalary &&
        <>
          <h5 className="content-page-header">{"Nhân sự hỗ trợ quyền xem lương"}</h5>
          <div className="timesheet-box1 timesheet-box shadow">
            <HumanForReviewSalaryComponent
              isEdit={!viewSetting.disableComponent.selectHrSupportViewSalary}
              approver={coordinator}
              updateApprover={(approver, isApprover) => handleUpdateCoordinator(approver, isApprover)}
            />
          </div>
        </>
      }
      {/* CBQL CẤP CƠ SỞ */}
      {viewSetting.showComponent.showCBQL && supervisor &&
        <>
          <h5 className="content-page-header">{"CBQL CẤP CƠ SỞ"}</h5>
          <div className="timesheet-box1 timesheet-box shadow">
            <HumanForReviewSalaryComponent isEdit={true} approver={supervisor} />
          </div>
        </>
      }
      {/* Nhân sự thẩm định quyền điều chỉnh lương */}
      {viewSetting.showComponent.showHrAssessment && appraiser &&
        <>
          <h5 className="content-page-header">{"Nhân sự thẩm định quyền điều chỉnh lương"}</h5>
          <div className="timesheet-box1 timesheet-box shadow">
            <HumanForReviewSalaryComponent isEdit={true} approver={appraiser} />
          </div>
        </>
      }
      {/* CBLĐ PHÊ DUYỆT */}
      {viewSetting.showComponent.showOfficerApproved &&
        <>
          <h5 className="content-page-header">{"CBLĐ PHÊ DUYỆT"}</h5>
          <div className="timesheet-box1 timesheet-box shadow">
            <HumanForReviewSalaryComponent isEdit={true} approver={approver} />
          </div>
        </>
      }
      <br />
      {/* List file */}
      <ul className="list-inline">
        {listFiles.map((file, index) => {
          return <li className="list-inline-item" key={index}>
            <span className="file-name">
              <a title={file.name} href={file.link} download={file.name} target="_blank" style={{ color: '#858796' }}>{file.name}</a>
              {viewSetting.showComponent.showRemoveFile ?
                <i className="fa fa-times remove" aria-hidden="true" onClick={e => removeFiles(file.id, index)}></i>
                : null}
            </span>
          </li>
        })}
      </ul>
      {/* Show status */}
      {viewSetting.showComponent.stateProcess &&
        <div className="block-status">
          <span className={`status ${Constants.mappingStatusRequest[dataSalary?.processStatusId].className}`}>
            {t(Constants.mappingStatusRequest[dataSalary?.processStatusId].label)}
          </span>
        </div>
      }
      <div className='d-flex justify-content-end mb-5'>
        {/* Đính kèm tệp */}
        {viewSetting.showComponent.btnAttachFile &&
          <>
            <input type="file" hidden id="i_files" name="i_files" onChange={(e) => handleAttachFile(e)} accept=".xls, .xlsx, .doc, .docx, .jpg, .png, .pdf" multiple />
            <label htmlFor="i_files" className="btn btn-light float-right shadow" style={{ marginBottom: '0px' }}>
              <i className="fas fa-paperclip"></i> {t('AttachmentFile')}
            </label>
          </>
        }
        {/* Hủy */}
        {viewSetting.showComponent.btnCancel &&
          <button type='button' className='btn btn-secondary ml-3 shadow' onClick={() => handleCancel()}  >
            <img src={IconDelete} className='mr-1' alt="cancel" /> {t('CancelSearch')}
          </button>
        }

        {/* Gửi yêu cầu */}
        {viewSetting.showComponent.btnSendRequest &&
          <button type='button' className='btn btn-primary ml-3 shadow' disabled={isLoading} onClick={() => handleSendForm()} >
            {isLoading ?
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              :
              <i className='fa fa-paper-plane mr-1' aria-hidden='true'></i>
            }
            {" "}{t('Send')}
          </button>
        }
        {/* Từ chối */}
        {viewSetting.showComponent.btnRefuse &&
          <button type='button' className='btn btn-danger' onClick={() => handleRefuse()}   >
            <img src={IconDelete} className='mr-1' alt="delete" /> {t('RejectQuestionButtonLabel')}
          </button>
        }
        {/* Thẩm định */}
        {viewSetting.showComponent.btnExpertise &&
          <button type='button' className='btn btn-primary float-right ml-3 shadow' onClick={() => handleConsent()} >
            <i className='fas fa-check' aria-hidden='true'></i> {t('Consent')}
          </button>
        }
        {/* Không phê duyệt */}
        {viewSetting.showComponent.btnNotApprove &&
          <button type='button' className='btn btn-danger' onClick={() => handleReject()} >
            <img src={IconDelete} className='mr-1' alt="delete" /> {t('Reject')}
          </button>
        }
        {/* Phê duyệt */}
        {viewSetting.showComponent.btnApprove &&
          <button type='button' className='btn btn-success float-right ml-3 shadow' onClick={() => handleApprove()} >
            <i className='fas fa-check' aria-hidden='true'></i> {t('Approval')}
          </button>
        }
      </div>
    </div>
  );
}

export default withTranslation()(SalaryAdjustmentPropse);