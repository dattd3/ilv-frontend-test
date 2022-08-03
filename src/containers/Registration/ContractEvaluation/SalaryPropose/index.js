import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router';
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

function SalaryPropse(props) {
  const { t } = useTranslation();
  const api = useApi();
  // 1739084
  const { id } = useParams();
  const history = useHistory();
  const [data, setData] = useState();
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

  const [approver, setApprover] = useState({
    fullName: 'Nguyễn Thu Hoài',
    account: 'nth',
    avatar: "",
    employeeLevel: "",
    pnl: "",
    orglv2Id: "",
    current_position: "Chuyên viên",
    department: "Phòng Phát triển Sản phẩm"
  });

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
      currentSalary: true, //Mức lương hiện tại (GROSS) - Disable/Enable Input
      showCurrentSalary: false, //Change type text & password
      viewCurrentSalary: false, //Hiển thị eye
      suggestedSalary: true, //Mức lương đề xuất - Disable/Enable Input
    }
  });

  const processStatus = 23;

  useEffect(() => {
    async function getData() {
      try {
        const { data: { data: response } } = await api.fetchSalaryPropose(id);
        setData(response);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
    checkAuthorize();
  }, [id]);

  const checkAuthorize = () => {
    const currentEmployeeNo = localStorage.getItem('email');
    let viewSettingTmp = { ...viewSetting };
    // Todo: check nguoi danh gia
    switch (processStatus) {
      case 21:
        viewSettingTmp.showComponent.humanForReviewSalary = true;
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
        viewSettingTmp.showComponent.btnCancel = true;
        viewSettingTmp.showComponent.btnSendRequest = true;
        break;
      case 22:
        viewSettingTmp.showComponent.humanForReviewSalary = true;
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
        break;
      case 23:
        viewSettingTmp.showComponent.humanResourceChangeSalary = true;
        viewSettingTmp.showComponent.bossApproved = true;
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
        viewSettingTmp.disableComponent.suggestedSalary = false;
        viewSettingTmp.showComponent.btnCancel = true;
        viewSettingTmp.showComponent.btnSendRequest = true;
        break;
      case 8:
        viewSettingTmp.showComponent.managerApproved = true;
        viewSettingTmp.showComponent.humanResourceChangeSalary = true;
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
        viewSettingTmp.showComponent.btnRefuse = true;
        viewSettingTmp.showComponent.btnExpertise = true;
        break;
      case 24:
        viewSetting.showComponent.humanResourceChangeSalary = true;
        viewSetting.showComponent.bossApproved = true;
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
        viewSetting.showComponent.btnRefuse = true;
        viewSettingTmp.showComponent.btnExpertise = true;
        break;
      case 5:
        viewSettingTmp.showComponent.humanResourceChangeSalary = true;
        viewSettingTmp.showComponent.bossApproved = true;
        viewSettingTmp.disableComponent.viewCurrentSalary = true;
        viewSettingTmp.showComponent.btnNotApprove = true;
        viewSettingTmp.showComponent.btnApprove = true;
        break;
      case 2:
        viewSettingTmp.showComponent.stateProcess = true;
        viewSettingTmp.showComponent.humanForReviewSalary = true;
        break;
      // case tu choi, khong phe duyet
      case 1:
        viewSettingTmp.showComponent.stateProcess = true;
        break;
      default:
        break;
    }
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
  const handleCancel = () => { console.log('handleCancel'); }

  // Thẩm định
  const handleConsent = () => {
    console.log('handleConsent');
  }

  // Phê duyệt
  const handleApprove = () => { console.log('handleApprove'); }

  // Gửi yêu cầu
  const handleSendForm = () => {
    if (processStatus === 23) {
      validation();
    }
    console.log('Submit');
  };

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

  const handleUpdateApprover = (approver, isApprover) => {
    console.log(approver, isApprover);
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
      <div className='block-content-salary'>
        <h6 className='block-content-salary__title'>{t('ManagerEvaluate')}</h6>
        <div className='block-content-salary__content'>
          <div className='main-content'>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('FullName')}
              </label>
              <input className='form-control' value={localStorage.getItem('fullName') || ''} disabled />
            </div>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('Title')}
              </label>
              <input className='form-control' value={localStorage.getItem('jobTitle') || ''} disabled />
            </div>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('DepartmentManage')}
              </label>
              <input className='form-control' disabled value={localStorage.getItem('department') || ''} />
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
                value={data?.staffContracts?.fullName || ''}
                disabled
              />
            </div>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('Title')}
              </label>
              <input
                className='form-control'
                value={data?.staffContracts?.positionName || ''}
                disabled
              />
            </div>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('DepartmentManage')}
              </label>
              <input
                className='form-control'
                value={data?.staffContracts?.departmentName || ''}
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
                  data?.staffContracts?.startDate &&
                  moment(data.staffContracts.startDate).format('MM/DD/YYYY')
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
                  data?.staffContracts?.expireDate &&
                  moment(data.staffContracts.expireDate).format('MM/DD/YYYY')
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
                  className="no-vborder"
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
                  className="no-vborder"
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
                history.push(`/evaluation/${id}/salary`);
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
              isEdit={processStatus !== 21}
              approver={approver}
              updateApprover={(approver, isApprover) => handleUpdateApprover(approver, isApprover)}
            />
          </div>
        </div>
      }
      {/* CBQL CẤP CƠ SỞ */}
      {viewSetting.showComponent.managerApproved &&
        <div className='block-content-salary'>
          <h6 className='block-content-salary__title'> {t('ManagerApproved')}</h6>
          <div className='block-content-salary__content'>
            <HumanForReviewSalaryComponent isEdit={true} approver={approver} />
          </div>
        </div>
      }
      {/* NHÂN SỰ THẨM ĐỊNH QUYỀN ĐIỀU CHỈNH LƯƠNG */}
      {viewSetting.showComponent.humanResourceChangeSalary &&
        <div className='block-content-salary'>
          <h6 className='block-content-salary__title'> {t('HumanResourceChangeSalary')}</h6>
          <div className='block-content-salary__content'>
            <HumanForReviewSalaryComponent isEdit={true} approver={approver} />
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
          <span className={`status ${Constants.mappingStatusRequest[processStatus].className}`}>
            {t(Constants.mappingStatusRequest[processStatus].label)}
          </span>
        </div>
      }
      <div className='d-flex justify-content-end mb-5'>
        {/* Hủy */}
        {viewSetting.showComponent.btnCancel &&
          <button type='button' className='btn btn-secondary ml-3 shadow' onClick={() => handleCancel()}  >
            <img src={IconDelete} className='mr-1' /> {t('CancelSearch')}
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
            <img src={IconDelete} className='mr-1' /> {t('RejectQuestionButtonLabel')}
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
            <img src={IconDelete} className='mr-1' /> {t('Reject')}
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
        onHide={() => {
          setModal({
            ...modal,
            visible: false,
          });
        }}
        data={modal.content}
        setData={(val) => {
          setModal({
            ...modal,
            content: val,
          });
        }}
        onConfirm={() => handleCloseModal()}
      />
    </div>
  );
}

export default SalaryPropse;
