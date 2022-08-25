/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router';
import axios from "axios";
import moment from "moment";
import Select from 'react-select'
import { withTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FilterMember from "../../ShareComponents/FilterMember";
import ModalConsent from "../../ShareComponents/ModalConsent";
import ResultModal from "./ResultModal";
import ApproverComponent from "../../ShareComponents/HrReviewSalaryComponent";
import ConfirmPasswordModal from '../../../Registration/ContractEvaluation/SalaryPropose/ConfirmPasswordModal';
import StatusModal from '../../../../components/Common/StatusModal'
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
  const [modal, setModal] = useState({
    visible: false,
    header: '',
    title: '',
    content: '',
  });
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
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [modalConfirmPassword, setModalConfirmPassword] = useState(false);
  const [acessToken, setAcessToken] = useState(null);
  const [type, setType] = useState(InsuranceOptions[0]);
  const [listFiles, setListFiles] = useState([]);
  const [selectMembers, setSelectMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [dataSalary, setDataSalary] = useState(undefined);

  const [coordinator, setCoordinator] = useState(null); // Nhân sự hỗ trợ xin quyền xem lương
  const [supervisor, setSupervisor] = useState(null); // CBQL cấp cơ sở
  const [appraiser, setAppraiser] = useState(null); // HR thẩm định quyền điều chỉnh lương
  const [approver, setApprover] = useState(null); // CBLĐ phê duyệt

  const [viewSetting, setViewSetting] = useState({
    showComponent: {
      stateProcess: false, // Button trang thai
      btnAttachFile: false, // Button Hủy
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
    console.log(props.location.state);
    if (props.location.state) {
      if (props.location.state?.id) {
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
    // eslint-disable-next-line
  }, []);

  const getDataSalary = async () => {
    try {
      const { data: { data: response } } = await api.fetchSalaryPropose(props.location.state?.id);
      await setDataSalary(response)
      await checkAuthorize(response);
    } catch (error) {
      console.log(error);
    }
  }

  const checkViewCreate = () => {
    console.log('checkViewCreate');
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
    viewSettingTmp.proposedStaff.employeeNo = localStorage.getItem('employeeNo') || ""
    viewSettingTmp.proposedStaff.employeeLevel = localStorage.getItem('employeeLevel') || ""
    viewSettingTmp.proposedStaff.orglv2Id = localStorage.getItem('organizationLv2') || ""
    viewSettingTmp.proposedStaff.fullName = localStorage.getItem('fullName') || ""
    viewSettingTmp.proposedStaff.jobTitle = localStorage.getItem('jobTitle') || ""
    viewSettingTmp.proposedStaff.department = localStorage.getItem('department') || ""
    viewSettingTmp.proposedStaff.orgLv2Id = localStorage.getItem('organizationLv2') || ""
    viewSettingTmp.proposedStaff.orgLv3Id = localStorage.getItem('organizationLv3') || ""
    viewSettingTmp.proposedStaff.orgLv4Id = localStorage.getItem('organizationLv4') || ""
    viewSettingTmp.proposedStaff.orgLv5Id = localStorage.getItem('organizationLv5') || ""
    viewSettingTmp.proposedStaff.orgLv6Id = localStorage.getItem('organizationLv6') || ""
    viewSettingTmp.proposedStaff.orgLv2Text = ""
    viewSettingTmp.proposedStaff.orgLv3Text = ""
    viewSettingTmp.proposedStaff.orgLv4Text = ""
    viewSettingTmp.proposedStaff.orgLv5Text = ""
    viewSettingTmp.proposedStaff.orgLv6Text = ""
    viewSettingTmp.proposedStaff.companyCode = localStorage.getItem('companyCode') || ""
    setViewSetting(viewSettingTmp)
  }

  const checkAuthorize = (dataSalaryInfo) => {
    console.log('checkAuthorize');
    // const currentEmployeeNo = localStorage.getItem('email');
    let viewSettingTmp = { ...viewSetting };
    switch (dataSalaryInfo?.processStatusId) {
      // Đang chờ nhân sự điều phối & Đang chờ nhân sự thẩm định người xem lương
      case 21:
      case 22:
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        break;
      // Đang chờ QLTT nhập lương đề xuất, xem lương hiện tại
      case 23:
        // Todo: kiem tra ai la nguoi view
        // if(!data.nguoipheduyet || !data.nguoipheduyet.account || (data.nguoipheduyet.account.toLowerCase()  + '@vingroup.net') != currentEmployeeNo.toLowerCase()){
        //   viewSettingTmp.disableComponent.disableAll = true;
        // }
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        viewSettingTmp.showComponent.btnAttachFile = true;
        viewSettingTmp.showComponent.btnSendRequest = true;
        viewSettingTmp.disableComponent.editSubjectApply = true;
        break;
      // Đang chờ CBQL Cấp cơ sở thẩm định
      case 8:
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        viewSettingTmp.showComponent.btnRefuse = true;
        viewSettingTmp.showComponent.btnExpertise = true;
        break;
      // Đang chờ nhân sự thẩm định lương đề xuất
      case 24:
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        viewSettingTmp.showComponent.btnRefuse = true;
        viewSettingTmp.showComponent.btnExpertise = true;
        break;
      // Đang chờ CBLĐ phê duyệt 
      case 5:
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        viewSettingTmp.showComponent.btnNotApprove = true;
        viewSettingTmp.showComponent.btnApprove = true;
        break;
      // View phe duyet thanh cong
      case 2:
        viewSetting.showComponent.stateProcess = true;
        viewSettingTmp.showComponent.showHrSupportViewSalary = true;
        viewSettingTmp.showComponent.showCBQL = true;
        viewSettingTmp.showComponent.showHrAssessment = true;
        viewSettingTmp.showComponent.showOfficerApproved = true;
        break;
      // Case từ chối, không phê duyệt
      case 1:
        viewSetting.showComponent.stateProcess = true;
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
      // Thong tin nguoi phe duyet
      if (requestInfo?.coordinatorInfo)
        setCoordinator({
          fullName: JSON.parse(requestInfo?.coordinatorInfo)?.FullName,
          account: requestInfo?.coordinatorInfo?.coordinatorId,
          current_position: JSON.parse(requestInfo?.coordinatorInfo)?.JobTitle,
          department: JSON.parse(requestInfo?.coordinatorInfo)?.Department
        })
      if (requestInfo?.supervisorInfo)
        setSupervisor({
          fullName: JSON.parse(requestInfo?.supervisorInfo)?.FullName,
          account: requestInfo?.supervisorInfo?.supervisorId,
          current_position: JSON.parse(requestInfo?.supervisorInfo)?.JobTitle,
          department: JSON.parse(requestInfo?.supervisorInfo)?.Department
        })
      if (requestInfo?.appraiserInfo)
        setAppraiser({
          fullName: JSON.parse(requestInfo?.appraiserInfo)?.FullName,
          account: requestInfo?.appraiserInfo?.appraiserId,
          current_position: JSON.parse(requestInfo?.appraiserInfo)?.JobTitle,
          department: JSON.parse(requestInfo?.appraiserInfo)?.Department
        })
      if (requestInfo?.approverInfo)
        setApprover({
          fullName: JSON.parse(requestInfo?.approverInfo)?.FullName,
          account: requestInfo?.approverInfo?.approverId,
          current_position: JSON.parse(requestInfo?.approverInfo)?.JobTitle,
          department: JSON.parse(requestInfo?.approverInfo)?.Department
        })
      // Thong tin CBNV
      const employeeInfo = JSON.parse(requestInfo?.employeeInfo)
      setSelectedMembers([{
        uid: employeeInfo?.employeeNo,
        employeeNo: employeeInfo?.employeeNo,
        account: employeeInfo?.account,
        fullName: employeeInfo?.fullName,
        fullname: employeeInfo?.fullName,
        jobTitle: employeeInfo?.jobTitle,
        startDate: employeeInfo?.startDate,
        expireDate: employeeInfo?.expireDate,
        contractName: employeeInfo?.contractName,
        contractType: employeeInfo?.contractType,
        department: employeeInfo?.department,
        currentSalary: '',
        proposedSalary: '',
        effectiveTime: '',
        strength: '',
        weakness: '',
      }])
    }

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
      jobTitle: u?.job_name,
      startDate: '',
      expireDate: '',
      contractName: u?.contractName,
      contractType: u?.contractType,
      department: u?.department,
      currentSalary: '',
      proposedSalary: '',
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
      proposedSalary: '',
      effectiveTime: '',
      strength: '',
      weakness: '',
    }))
    setSelectedMembers(membersMapping)
  }

  // const handleChangeSelectInputs = (e, uid, objName) => {
  //   const selectedMembersTmp = [...selectedMembers];
  //   selectedMembersTmp.forEach(item => {
  //     if (item.uid === uid) {
  //       item[objName] = e.value
  //     }
  //   })
  //   setSelectedMembers(selectedMembersTmp)
  // }

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
        if (moment(value, "DD/MM/YYYY").isValid()) {
          if (moment(value).year() > 9999) {
            const year = (moment(value).year() + '').substring(0, 4);
            value = moment(value).set('year', year).format("DD/MM/YYYY")
          }
          const date = moment(value, "DD/MM/YYYY").format("DD/MM/YYYY");
          item[objName] = date;
        } else {
          item[objName] = '';
        }
      }
    })
    setSelectedMembers(selectedMembersTmp)
  }

  const handleShowCurrentSalary = () => {
    setModalConfirmPassword(true)
  }

  const handleShowSuggestedSalary = () => {
    setModalConfirmPassword(true)
  }

  const handleCloseModal = () => {
    console.log('data', modal.content);
    const modalTmp = { ...modal }
    modalTmp.visible = !modalTmp.visible
    setModal(modalTmp)
  }

  // Từ chối
  const handleRefuse = () => {
    setModal({
      visible: true,
      header: t('ConfirmCancleConsent'),
      title: t('ReasonCancleConsent'),
      content: '',
    })
  }

  // Không phê duyệt
  const handleReject = () => {
    setModal({
      visible: true,
      header: t('ConfirmNotApprove'),
      title: t('ReasonNotApprove'),
      content: '',
    })
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
    console.log('handleConsent');
  }

  // Phê duyệt
  const handleApprove = () => {
    console.log('handleApprove');
  }

  // Gửi yêu cầu
  const handleSendForm = () => {
    // Create
    if (isCreateMode) {
      console.log(selectMembers);
      if (selectMembers.length === 0) {
        showStatusModal("CBNV được đề xuất chưa được chọn!", false)
        return;
      }
      if (!coordinator) {
        showStatusModal("Nhân sự hỗ trợ quyền xem lương chưa được nhập!", false)
        return;
      }
      const bodyFormData = prepareDataToSubmit()
      console.log(...bodyFormData);
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
          showStatusModal(response.data.result.message || 'Có lỗi xảy ra trong quá trình cập nhật thông tin!', false)
        })
        .catch(response => {
          showStatusModal("Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
        })
    } else {
      // Review
      if (dataSalary?.processStatusId === 23) {
        const listErrors = validation();
        if (listErrors.length !== 0) {
          setResultModal({
            show: true,
            title: 'Yêu cầu nhập thông tin',
            message: listErrors[0],
            isSuccess: false,
          })
          return;
        }
      }
    }
  };

  const prepareDataToSubmit = () => {
    if (isCreateMode) {
      let bodyFormData = new FormData();
      const employeeInfoLst = selectMembers.map(u => ({
        employeeNo: u?.employeeNo,
        account: u?.account,
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
        account: viewSetting.proposedStaff.account,
        fullName: viewSetting.proposedStaff.fullName,
        employeeLevel: viewSetting.proposedStaff.employeeLevel,
        orglv2Id: viewSetting.proposedStaff.orgLv2Id,
        jobTitle: viewSetting.proposedStaff.jobTitle,
        department: viewSetting.proposedStaff.department,
      }));
      bodyFormData.append('coordinatorId', coordinator?.account.toLowerCase() + "@vingroup.net");
      bodyFormData.append('coordinatorInfo', JSON.stringify({
        avatar: coordinator?.avatar,
        account: coordinator?.account.toLowerCase(),
        fullName: coordinator?.fullName,
        employeeLevel: coordinator?.employeeLevel,
        pnl: coordinator?.pnl,
        orglv2Id: coordinator?.orglv2Id,
        current_position: coordinator?.current_position,
        department: coordinator?.department,
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
      if (!u.proposedSalary) errors.push('Bắt buộc nhập mức lương đề xuất!')
      if (!u.effectiveTime) errors.push('Bắt buộc chọn thời gian có hiệu lực!')
    })
    return errors;
  }

  const handleChangeModalConfirmPassword = (acessToken) => {
    console.log(acessToken);
    const viewSettingTmp = [...viewSetting];
    viewSettingTmp.disableComponent.showSuggestedSalary = !viewSettingTmp.disableComponent.showSuggestedSalary
    setAcessToken(acessToken)
    setModalConfirmPassword(false)
    setViewSetting(viewSettingTmp)
  }

  const hideResultModal = () => {
    setResultModal({
      show: false,
      title: '',
      message: '',
      isSuccess: false,
    })
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
                  <div style={{ width: '90%' }}>
                    {item?.currentSalary && acessToken ?
                      <CurrencyInput
                        disabled={true}
                        intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
                        className="no-vborder"
                        value={item?.currentSalary}
                        placeholder="Nhập"
                      />
                      : <span>{'**********'}</span>
                    }
                  </div>
                  <div
                    style={{ width: '10%', cursor: 'pointer' }}
                    onClick={() => handleShowCurrentSalary()}
                  >
                    <img src={viewSetting.disableComponent.showCurrentSalary ? IconEye : IconNotEye} alt='eye' />
                  </div>
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
                  intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
                  className="form-control"
                  value={item?.proposedSalary}
                  onValueChange={(value) => { handleTextInputChange(value, item?.uid, 'proposedSalary') }}
                  placeholder="Nhập"
                />
                :
                <>
                  {!isCreateMode &&
                    <div className="d-flex w-100">
                      <div style={{ width: '90%' }}>
                        {item?.proposedSalary && acessToken ? item?.proposedSalary : '**********'}
                      </div>
                      <div
                        style={{ width: '10%', cursor: 'pointer' }}
                        onClick={() => handleShowSuggestedSalary()}
                      >
                        <img src={viewSetting.disableComponent.showSuggestedSalary ? IconEye : IconNotEye} alt='eye' />
                      </div>
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
                <input
                  type="text"
                  value={item?.strength}
                  onChange={(e) => handleTextInputChange(e.target.value, item?.uid, "strength")}
                  className="form-control input mv-10 w-100"
                  name="strength"
                  autoComplete="off"
                  placeholder="Nhập"
                />
                : <>{item?.strength}</>
              }
            </span>
          </td>
          <td>
            <span className="same-width text-center">
              {viewSetting.disableComponent.editSubjectApply && !isCreateMode ?
                <input
                  type="text"
                  value={item?.weakness}
                  onChange={(e) => handleTextInputChange(e.target.value, item?.uid, "weakness")}
                  className="form-control input mv-10 w-100"
                  name="weakness"
                  autoComplete="off"
                  placeholder="Nhập"
                />
                : <>{item?.weakness}</>
              }
            </span>
          </td>
        </tr>
      })
    )
  }

  return (
    <div className="timesheet-section proposal-management">
      <ConfirmPasswordModal
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
      <div className="eval-heading">ĐỀ XUẤT ĐIỀU CHỈNH THU NHẬP</div>
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
      <div className="timesheet-box1 shadow">
        <div className="result-wrap-table">
          <table className="result-table">
            <thead>
              <tr>
                <td rowSpan="2" className="min-width text-center font-weight-bold">Họ và tên</td>
                <td rowSpan="2" className="min-width text-center font-weight-bold">Chức danh</td>
                <td rowSpan="2" className="min-width text-center font-weight-bold">Khối/Phòng/Bộ phận</td>
                <td rowSpan="2" className="min-width text-center font-weight-bold">Loại HĐ hiện tại</td>
                <td rowSpan="2" className="min-width1 text-center"><strong>Thu nhập hiện tại</strong><span> (Gross)</span></td>
                <td rowSpan="2" className="min-width1 text-center"><strong>Mức lương đề xuất</strong><span> (Gross)</span></td>
                <td rowSpan="2" className="min-width text-center font-weight-bold"><strong>Thời gian hiệu lực</strong></td>
                <th colSpan="2" scope="colgroup" className="min-width text-center font-weight-bold">Đánh giá chung</th>
              </tr>
              <tr>
                <th scope="col" className="min-width3 text-center">Điểm mạnh</th>
                <th scope="col" className="min-width3 text-center">Điểm yếu</th>
              </tr>
            </thead>
            <tbody>
              {props.location.state?.id ?
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
            <ApproverComponent
              isEdit={!viewSetting.disableComponent.selectHrSupportViewSalary}
              approver={coordinator}
              updateApprover={(approver, isApprover) => handleUpdateCoordinator(approver, isApprover)}
            />
          </div>
        </>
      }
      {/* CBQL CẤP CƠ SỞ */}
      {viewSetting.showComponent.showCBQL &&
        <>
          <h5 className="content-page-header">{"CBQL CẤP CƠ SỞ"}</h5>
          <div className="timesheet-box1 timesheet-box shadow">
            <ApproverComponent isEdit={true} approver={supervisor} />
          </div>
        </>
      }
      {/* Nhân sự thẩm định quyền điều chỉnh lương */}
      {viewSetting.showComponent.showHrAssessment &&
        <>
          <h5 className="content-page-header">{"Nhân sự thẩm định quyền điều chỉnh lương"}</h5>
          <div className="timesheet-box1 timesheet-box shadow">
            <ApproverComponent isEdit={true} approver={appraiser} />
          </div>
        </>
      }
      {/* CBLĐ PHÊ DUYỆT */}
      {viewSetting.showComponent.showOfficerApproved &&
        <>
          <h5 className="content-page-header">{"CBLĐ PHÊ DUYỆT"}</h5>
          <div className="timesheet-box1 timesheet-box shadow">
            <ApproverComponent isEdit={true} approver={approver} />
          </div>
        </>
      }
      <br />
      {/* List file */}
      <ul className="list-inline">
        {listFiles.map((file, index) => {
          return <li className="list-inline-item" key={index}>
            <span className="file-name">
              <a title={file.name} href={file.link} download={file.name} target="_blank">{file.name}</a>
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
        {/* Gửi yêu cầu */}
        {viewSetting.showComponent.btnSendRequest &&
          <button type='button' className='btn btn-primary ml-3 shadow' onClick={() => handleSendForm()} >
            <i className='fa fa-paper-plane mr-1' aria-hidden='true'></i> {t('Send')}
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
      <ModalConsent
        show={modal.visible}
        header={modal.header}
        title={modal.title}
        onHide={() => setModal({ ...modal, visible: false })}
        data={modal.content}
        setData={(val) => setModal({ ...modal, content: val })}
        onConfirm={() => handleCloseModal()}
      />
    </div>
  );
}

export default withTranslation()(SalaryAdjustmentPropse);