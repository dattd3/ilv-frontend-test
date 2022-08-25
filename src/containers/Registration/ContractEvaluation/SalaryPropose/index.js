import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useHistory } from 'react-router';
import './styles.scss';
import { useTranslation } from 'react-i18next';
import CurrencyInput from 'react-currency-input-field';
import IconEye from '../../../../assets/img/icon/eye.svg';
import IconNotEye from '../../../../assets/img/icon/not-eye.svg';
import { useApi } from '../../../../modules/api';
import IconDelete from '../../../../assets/img/icon/Icon_Cancel.svg';
import ModalConsent from './ModalConsent';
import moment from 'moment';
import HumanForReviewSalaryComponent from '../../HumanForReviewSalaryComponent';
import ConfirmPasswordModal from './ConfirmPasswordModal';
import Constants from '../.../../../../../commons/Constants';
import StatusModal from '../../../../components/Common/StatusModal'

function SalaryPropse(props) {
  const { t } = useTranslation();
  const api = useApi();
  const history = useHistory();
  const [dataContract, setDataContract] = useState(undefined);
  const [dataSalary, setDataSalary] = useState(undefined);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [currentSalary, setCurrentSalary] = useState('0978978');
  const [modalConfirmPassword, setModalConfirmPassword] = useState(false);
  const [acessToken, setAcessToken] = useState(null);
  const [formData, setFormData] = useState({
    suggestedSalary: '',
  });

  const [error, setError] = useState({
    suggestedSalary: false,
  });

  const [modal, setModal] = useState({
    visible: false,
    type: '',
    header: '',
    title: '',
    content: '',
  });

  const [modalStatus, setModalStatus] = useState({
    isShowStatusModal: false,
    content: '',
    isSuccess: true,
    url: '',
  });

  const [coordinator, setCoordinator] = useState(null); // Nhân sự hỗ trợ xin quyền xem lương
  const [supervisor, setSupervisor] = useState(null); // CBQL cấp cơ sở
  const [appraiser, setAppraiser] = useState(null); // HR thẩm định quyền điều chỉnh lương
  const [approver, setApprover] = useState(null); // CBLĐ phê duyệt

  const [viewSetting, setViewSetting] = useState({
    showComponent: {
      humanForReviewSalary: false, //NHÂN SỰ HỖ TRỢ XIN QUYỀN XEM LƯƠNG
      humanResourceChangeSalary: false, //NHÂN SỰ THẨM ĐỊNH QUYỀN ĐIỀU CHỈNH LƯƠNG
      managerApproved: false, //CBQL CẤP CƠ SỞ
      bossApproved: false, //CBLĐ PHÊ DUYỆT
      stateProcess: false, // Button trang thai Từ chối
      btnCancel: false, // Button Hủy
      btnSendRequest: false, // Button Gửi yêu cầu
      btnRefuse: false, // Button Từ chối
      btnExpertise: false, // Button Thẩm định
      btnNotApprove: false, // Button Không phê duyệt
      btnApprove: false, // Button phê duyệt
    },
    disableComponent: {
      selectHrSupportViewSalary: false, // Cho phep chon Nhân sự hỗ trợ quyền xem lương
      currentSalary: true, //Mức lương hiện tại (GROSS) - Disable/Enable Input
      showCurrentSalary: false, //Change type text & password
      viewCurrentSalary: false, //Hiển thị eye
      suggestedSalary: true, //Mức lương đề xuất - Disable/Enable Input
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
    getDataContract();
    if (props.location.state) {
      if (props.location.state?.idSalary) {
        // Review mode
        setIsCreateMode(false);
        getDataSalary();

      } else {
        // Create mode
        setIsCreateMode(true);
        checkViewCreate();
      }
    }
    // eslint-disable-next-line
  }, []);

  const getDataContract = async () => {
    try {
      const { data: { data: response } } = await api.fetchStaffContract(props.location.state?.idContract);
      setDataContract(response);
    } catch (error) {
      console.log(error);
    }
  }

  const getDataSalary = async () => {
    try {
      const { data: { data: response } } = await api.fetchSalaryPropose(props.location.state?.idSalary);
      await setDataSalary(response)
      await checkAuthorize(response);
    } catch (error) {
      console.log(error);
    }
  }

  const checkViewCreate = () => {
    let viewSettingTmp = { ...viewSetting };
    viewSettingTmp.showComponent.humanForReviewSalary = true;
    viewSettingTmp.showComponent.btnCancel = true;
    viewSettingTmp.showComponent.btnSendRequest = true;
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
    // const currentEmployeeNo = localStorage.getItem('email');
    let viewSettingTmp = { ...viewSetting };
    // Todo: check nguoi danh gia
    switch (dataSalaryInfo?.processStatusId) {
      case 21:
      case 22:
        viewSettingTmp.showComponent.humanForReviewSalary = true;
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
        break;
      case 23:
        // Todo: kiem tra ai la nguoi view
        viewSettingTmp.showComponent.humanForReviewSalary = true;
        viewSettingTmp.showComponent.humanResourceChangeSalary = true;
        viewSettingTmp.showComponent.managerApproved = true;
        viewSettingTmp.showComponent.bossApproved = true;
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
        viewSettingTmp.disableComponent.suggestedSalary = false;
        viewSettingTmp.showComponent.btnCancel = true;
        viewSettingTmp.showComponent.btnSendRequest = true;
        break;
      case 8:
        viewSettingTmp.showComponent.humanForReviewSalary = true;
        viewSettingTmp.showComponent.humanResourceChangeSalary = true;
        viewSettingTmp.showComponent.managerApproved = true;
        viewSettingTmp.showComponent.bossApproved = true;
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
        viewSettingTmp.showComponent.btnRefuse = true;
        viewSettingTmp.showComponent.btnExpertise = true;
        break;
      case 24:
        viewSettingTmp.showComponent.humanForReviewSalary = true;
        viewSettingTmp.showComponent.humanResourceChangeSalary = true;
        viewSettingTmp.showComponent.managerApproved = true;
        viewSettingTmp.showComponent.bossApproved = true;
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
        viewSetting.showComponent.btnRefuse = true;
        viewSettingTmp.showComponent.btnExpertise = true;
        break;
      case 5:
        viewSettingTmp.showComponent.humanForReviewSalary = true;
        viewSettingTmp.showComponent.humanResourceChangeSalary = true;
        viewSettingTmp.showComponent.managerApproved = true;
        viewSettingTmp.showComponent.bossApproved = true;
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
        viewSettingTmp.showComponent.btnNotApprove = true;
        viewSettingTmp.showComponent.btnApprove = true;
        break;
      case 2:
        viewSettingTmp.showComponent.humanForReviewSalary = true;
        viewSettingTmp.showComponent.humanResourceChangeSalary = true;
        viewSettingTmp.showComponent.managerApproved = true;
        viewSettingTmp.showComponent.bossApproved = true;
        viewSettingTmp.showComponent.stateProcess = true;
        break;
      // case tu choi, khong phe duyet
      case 1:
        viewSettingTmp.showComponent.stateProcess = true;
        break;
      default:
        break;
    }

    // Cán bộ đề xuất
    viewSettingTmp.proposedStaff.fullName = dataSalaryInfo?.user?.fullName
    viewSettingTmp.proposedStaff.jobTitle = dataSalaryInfo?.user?.jobTitle
    viewSettingTmp.proposedStaff.department = dataSalaryInfo?.user?.department

    // Nhân sự điều phối
    if (dataSalaryInfo?.requestInfo.length !== 0) {
      const requestInfo = dataSalaryInfo?.requestInfo[0];
      if (requestInfo?.coordinatorInfo)
        setCoordinator({
          fullName: JSON.parse(requestInfo?.coordinatorInfo)?.FullName,
          account: requestInfo?.coordinatorInfo?.coordinatorId,
          current_position: JSON.parse(requestInfo?.coordinatorInfo)?.JobTitle,
          department: JSON.parse(requestInfo?.coordinatorInfo)?.Department
        })
    }

    // CBQL cấp cơ sở
    if (dataSalaryInfo?.supervisorInfo)
      setSupervisor({
        fullName: JSON.parse(dataSalaryInfo?.supervisorInfo)?.FullName,
        account: dataSalaryInfo?.supervisorId,
        current_position: JSON.parse(dataSalaryInfo?.supervisorInfo)?.JobTitle,
        department: JSON.parse(dataSalaryInfo?.supervisorInfo)?.Department
      })
    // HR thẩm định quyền điều chỉnh lương
    if (dataSalaryInfo?.appraiserInfo)
      setAppraiser({
        fullName: JSON.parse(dataSalaryInfo?.appraiserInfo)?.FullName,
        account: dataSalaryInfo?.appraiserId,
        current_position: JSON.parse(dataSalaryInfo?.appraiserInfo)?.JobTitle,
        department: JSON.parse(dataSalaryInfo?.appraiserInfo)?.Department
      })
    // CBLĐ phê duyệt
    if (dataSalaryInfo?.approverInfo)
      setApprover({
        fullName: JSON.parse(dataSalaryInfo?.approverInfo)?.FullName,
        account: dataSalaryInfo?.approverId,
        current_position: JSON.parse(dataSalaryInfo?.approverInfo)?.JobTitle,
        department: JSON.parse(dataSalaryInfo?.approverInfo)?.Department
      })

    setViewSetting(viewSettingTmp)
  }

  const handleShowCurrentSalary = () => {
    if (!acessToken) {
      setModalConfirmPassword(true)
      return;
    }
    let viewSettingTmp = { ...viewSetting };
    viewSettingTmp.disableComponent.showCurrentSalary = !viewSettingTmp.disableComponent.showCurrentSalary;
    setViewSetting(viewSettingTmp)
  }

  // Từ chối
  const handleRefuse = () => {
    setModal({
      visible: true,
      type: 'refuse',
      header: t('ConfirmCancleConsent'),
      title: t('ReasonCancleConsent'),
      content: '',
    })
  }

  // Không phê duyệt
  const handleReject = () => {
    setModal({
      visible: true,
      type: 'approve',
      header: t('ConfirmNotApprove'),
      title: t('ReasonNotApprove'),
      content: '',
    })
  }

  // Hủy
  const handleCancel = () => {
    console.log('handleCancel');
    if (isCreateMode) {
      history.push('/tasks');
    }
  }

  // Thẩm định
  const handleConsent = () => {
    console.log('handleConsent');
  }

  // Phê duyệt
  const handleApprove = () => { console.log('handleApprove'); }

  // Gửi yêu cầu
  const handleSendForm = () => {
    console.log('Gửi yêu cầu');
    // Create
    if (isCreateMode) {
      if (!coordinator) {
        showStatusModal("Nhân sự hỗ trợ quyền xem lương chưa được nhập!", false)
        return;
      }
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
          showStatusModal(response.data.result.message || 'Có lỗi xảy ra trong quá trình cập nhật thông tin!', false)
        })
        .catch(response => {
          showStatusModal("Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
        })
    } else {
      // Review
      if (dataSalary?.processStatusId === 23) {
        validation();
      }
      // Todo
    }
  };

  const prepareDataToSubmit = () => {
    if (isCreateMode) {
      let bodyFormData = new FormData();
      bodyFormData.append('requestHistoryId', props.location.state?.idContract);
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
      bodyFormData.append('employeeInfoLst', JSON.stringify([{
        employeeNo: dataContract?.staffContracts?.employeeCode,
        account: dataContract?.staffContracts?.employeeEmail,
        fullName: dataContract?.staffContracts?.fullName,
        jobTitle: dataContract?.staffContracts?.positionName,
        department: dataContract?.staffContracts?.departmentName,
        startDate: dataContract?.staffContracts?.startDate,
        expireDate: dataContract?.staffContracts?.expireDate,
        contractName: dataContract?.staffContracts?.contractName,
        contractType: dataContract?.staffContracts?.contractType,
      }]));
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

  const handleChangeModalConfirmPassword = (acessToken) => {
    setAcessToken(acessToken)
    setModalConfirmPassword(false)
    let viewSettingTmp = { ...viewSetting };
    viewSettingTmp.disableComponent.showCurrentSalary = !viewSettingTmp.disableComponent.showCurrentSalary;
    setViewSetting(viewSettingTmp)
  }

  const validation = () => {
    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim().length === 0) {
        setError((prev) => {
          return {
            ...prev,
            [key]: true,
          };
        });
        return;
      }
      setError((prev) => {
        return {
          ...prev,
          [key]: false,
        };
      });
    });
  };

  const handleTextInputChange = (value, objName) => {
    setError({
      ...error,
      suggestedSalary: value ? value.length === 0 : true,
    });
    setFormData({
      ...formData,
      suggestedSalary: value ? value : '',
    });
  }

  const handleUpdateCoordinator = (approver, isApprover) => {
    setCoordinator(approver)
  }

  const handleCloseModal = () => {
    console.log('data', modal.content);
    const modalTmp = { ...modal }
    modalTmp.visible = !modalTmp.visible
    setModal(modalTmp)
  }

  return (
    <div className='container-salary'>
      <ConfirmPasswordModal
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
      <div className="eval-heading">ĐỀ XUẤT ĐIỀU CHỈNH THU NHẬP</div>
      <div className='block-content-salary'>
        <h6 className='block-content-salary__title'>{t('ManagerEvaluate')}</h6>
        <div className='block-content-salary__content'>
          <div className='main-content'>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('FullName')}
              </label>
              <input className='form-control' value={viewSetting.proposedStaff.fullName || ''} disabled />
            </div>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('Title')}
              </label>
              <input className='form-control' value={viewSetting.proposedStaff.jobTitle || ''} disabled />
            </div>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('DepartmentManage')}
              </label>
              <input className='form-control' value={viewSetting.proposedStaff.department || ''} disabled />
            </div>
          </div>
        </div>
      </div>

      <div className='block-content-salary'>
        <h6 className='block-content-salary__title'>{t('ProposeInfo')}</h6>
        <div className='block-content-salary__content'>
          <div className='main-content'>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('FullName')}
              </label>
              <input
                className='form-control'
                value={dataContract?.staffContracts?.fullName || ''}
                disabled
              />
            </div>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('Title')}
              </label>
              <input
                className='form-control'
                value={dataContract?.staffContracts?.positionName || ''}
                disabled
              />
            </div>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('DepartmentManage')}
              </label>
              <input
                className='form-control'
                value={dataContract?.staffContracts?.departmentName || ''}
                disabled
              />
            </div>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('DateWork')}
              </label>
              <input
                className='form-control'
                value={
                  dataContract?.staffContracts?.startDate &&
                  moment(dataContract.staffContracts.startDate).format('MM/DD/YYYY')
                }
                disabled
              />
            </div>

            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('ExpriseDate')}
              </label>
              <input
                className='form-control'
                value={
                  dataContract?.staffContracts?.expireDate &&
                  moment(dataContract.staffContracts.expireDate).format('MM/DD/YYYY')
                }
                disabled
              />
            </div>
          </div>
          <div className='divide' />
          <div className='bottom-content'>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('SalaryNow')}
              </label>
              {viewSetting.disableComponent.showCurrentSalary ?
                <CurrencyInput
                  disabled={viewSetting.disableComponent.currentSalary}
                  intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
                  className="form-control"
                  value={currentSalary}
                  placeholder="Nhập"
                />
                :
                <input
                  className='form-control'
                  type={'password'}
                  value={'**********'}
                  disabled={viewSetting.disableComponent.currentSalary}
                />
              }
              {viewSetting.disableComponent.viewCurrentSalary &&
                <div
                  className='col-input__icon'
                  onClick={() => handleShowCurrentSalary()}
                >
                  <img src={viewSetting.disableComponent.showCurrentSalary ? IconEye : IconNotEye} alt='eye' />
                </div>
              }
            </div>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('SalaryRequest')}
              </label>
              {viewSetting.disableComponent.suggestedSalary ?
                <CurrencyInput
                  disabled={true}
                  intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
                  className="form-control"
                  value={formData.suggestedSalary}
                  placeholder="Nhập"
                />
                :
                <CurrencyInput
                  disabled={false}
                  intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
                  className="form-control"
                  value={formData.suggestedSalary}
                  onValueChange={(value) => { handleTextInputChange(value, 'suggestedSalary') }}
                  placeholder="Nhập"
                />
              }
              {error.suggestedSalary && (
                <span className='text-danger text-xs'>
                  {t('RequiredInput')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='block-content-salary'>
        <h6 className='block-content-salary__title'> {t('AssetmentInfo')}</h6>
        <div className='block-content-salary__content'>
          <div className='block-content-salary__content--vote'>
            <div className='wrapper-status'>
              <p className='font-normal'>{t('Status_1')}: </p>
              <div>Đang chờ phê duyệt</div>
            </div>
            <div
              className='detail'
              onClick={() => {
                history.push(`/evaluation/${props.location.state?.idContract}/salary`);
              }}
            >
              {t('ViewDetail')} {'>>'}
            </div>
          </div>
        </div>
      </div>

      {/* NHÂN SỰ HỖ TRỢ XIN QUYỀN XEM LƯƠNG */}
      {viewSetting.showComponent.humanForReviewSalary &&
        <div className='block-content-salary'>
          <h6 className='block-content-salary__title'> {t('HumanForReviewSalary')}</h6>
          <div className='block-content-salary__content'>
            <HumanForReviewSalaryComponent
              isEdit={!viewSetting.disableComponent.selectHrSupportViewSalary}
              approver={coordinator}
              updateApprover={(approver, isApprover) => handleUpdateCoordinator(approver, isApprover)}
            />
          </div>
        </div>
      }
      {/* CBQL CẤP CƠ SỞ */}
      {viewSetting.showComponent.managerApproved &&
        <div className='block-content-salary'>
          <h6 className='block-content-salary__title'> {t('ManagerApproved')}</h6>
          <div className='block-content-salary__content'>
            <HumanForReviewSalaryComponent isEdit={true} approver={supervisor} />
          </div>
        </div>
      }
      {/* NHÂN SỰ THẨM ĐỊNH QUYỀN ĐIỀU CHỈNH LƯƠNG */}
      {viewSetting.showComponent.humanResourceChangeSalary && appraiser &&
        <div className='block-content-salary'>
          <h6 className='block-content-salary__title'> {t('HumanResourceChangeSalary')}</h6>
          <div className='block-content-salary__content'>
            <HumanForReviewSalaryComponent isEdit={true} approver={appraiser} />
          </div>
        </div>
      }
      {/* CBLĐ PHÊ DUYỆT */}
      {viewSetting.showComponent.bossApproved &&
        <div className='block-content-salary'>
          <h6 className='block-content-salary__title'> {t('BossApproved')}</h6>
          <div className='block-content-salary__content'>
            <HumanForReviewSalaryComponent isEdit={true} approver={approver} />
          </div>
        </div>
      }
      {/* Show status */}
      {viewSetting.showComponent.stateProcess &&
        <div className="block-status">
          <span className={`status ${Constants.mappingStatusRequest[dataSalary?.processStatusId].className}`}>
            {t(Constants.mappingStatusRequest[dataSalary?.processStatusId].label)}
          </span>
        </div>
      }
      <div className='d-flex justify-content-end mb-5'>
        {/* Hủy */}
        {viewSetting.showComponent.btnCancel &&
          <button type='button' className='btn btn-secondary ml-3 shadow' onClick={() => handleCancel()}  >
            <img src={IconDelete} className='mr-1' alt="cancel" /> {t('CancelSearch')}
          </button>
        }
        {/* Gửi yêu cầu */}
        {viewSetting.showComponent.btnSendRequest &&
          <button type='button' className='btn btn-primary ml-3 shadow' onClick={() => handleSendForm()}>
            <i className='fa fa-paper-plane mr-1' aria-hidden='true'></i> {t('Send')}
          </button>
        }
        {/* Từ chối */}
        {viewSetting.showComponent.btnRefuse &&
          <button type='button' className='btn btn-danger' onClick={() => handleRefuse()}  >
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
            <img src={IconDelete} className='mr-1' alt="reject" /> {t('Reject')}
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
        type={modal.type}
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

export default SalaryPropse;
