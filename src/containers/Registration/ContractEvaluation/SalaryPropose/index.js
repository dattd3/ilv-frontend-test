import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router';
import './styles.scss';
import { useTranslation } from 'react-i18next';
import IconEye from '../../../../assets/img/icon/eye.svg';
import IconNotEye from '../../../../assets/img/icon/not-eye.svg';
import { useApi } from '../../../../modules/api';
import IconDelete from '../../../../assets/img/icon/Icon_Cancel.svg';
import ModalConsent from './ModalConsent';
import moment from 'moment';
import HumanForReviewSalaryComponent from '../../HumanForReviewSalaryComponent';

function SalaryPropse() {
  const { t } = useTranslation();
  const api = useApi();
  const { id } = useParams();
  const history = useHistory();
  const [visibleInput, setVisibleInput] = useState(false);
  const [data, setData] = useState();
  const FullName = localStorage.getItem('fullName');
  const Title = localStorage.getItem('jobTitle');
  const Department = localStorage.getItem('department');
  const [formData, setFormData] = useState({
    salaryRequest: '',
  });

  const [error, setError] = useState({
    salaryRequest: false,
  });

  const [modal, setModal] = useState({
    visible: false,
    content: '',
  });

  useEffect(() => {
    async function getData() {
      try {
        const {
          data: { data: response },
        } = await api.fetchSalaryPropose(id);
        setData(response);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, [id]);

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
  const handleSendForm = () => {
    validation();
  };
  return (
    <div className='container-salary'>
      <div className='block-content-salary'>
        <h6 className='block-content-salary__title'>{t('ManagerEvaluate')}</h6>
        <div className='block-content-salary__content'>
          <div className='main-content'>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('FullName')}
              </label>
              <input className='form-control' value={FullName} disabled />
            </div>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('Title')}
              </label>
              <input className='form-control' value={Title} disabled />
            </div>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('DepartmentManage')}
              </label>
              <input className='form-control' disabled value={Department} />
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
                value={data?.staffContracts?.fullName}
                disabled
              />
            </div>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('Title')}
              </label>
              <input
                className='form-control'
                value={data?.staffContracts?.positionName}
                disabled
              />
            </div>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('DepartmentManage')}
              </label>
              <input
                className='form-control'
                value={data?.staffContracts?.departmentName}
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
                  data?.staffContracts.startDate &&
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
                  data?.staffContracts.expireDate &&
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
              <input
                className='form-control'
                type={`${visibleInput ? 'text' : 'password'}`}
                value={928129000}
              />
              <div
                className='col-input__icon'
                onClick={() => setVisibleInput(!visibleInput)}
              >
                <img src={visibleInput ? IconEye : IconNotEye} alt='eye' />
              </div>
            </div>
            <div className='col-input'>
              <label className='block-content-salary__content--label'>
                {t('SalaryRequest')}
              </label>
              <input
                type='number'
                className='form-control'
                value={formData.salaryRequest}
                onChange={(val) => {
                  setError({
                    ...error,
                    salaryRequest: val.target.value.trim().length === 0,
                  });
                  setFormData({
                    ...formData,
                    salaryRequest: val.target.value,
                  });
                }}
              />
              {error.salaryRequest && (
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
                history.push(`/propose-salary/${id}`);
              }}
            >
              {t('ViewDetail')} {'>>'}
            </div>
          </div>
        </div>
      </div>

      <div className='block-content-salary'>
        <h6 className='block-content-salary__title'> {t('AssetmentInfo')}</h6>
        <div className='block-content-salary__content'>
          <HumanForReviewSalaryComponent />
        </div>
      </div>

      <div className='d-flex justify-content-end mb-2'>
        <button type='button' className='btn btn-secondary ml-3 shadow'>
          <img src={IconDelete} className='mr-1' />
          {t('CancelSearch')}
        </button>
        <button
          type='button'
          className='btn btn-primary ml-3 shadow'
          onClick={handleSendForm}
        >
          <i className='fa fa-paper-plane mr-1' aria-hidden='true'></i>
          {t('Send')}
        </button>
      </div>
      <div className='d-flex justify-content-end mb-5'>
        <button
          type='button'
          className='btn btn-danger'
          onClick={() => {
            setModal({
              ...modal,
              visible: true,
            });
          }}
        >
          <img src={IconDelete} className='mr-1' />
          {t('RejectQuestionButtonLabel')}
        </button>
        <button
          type='button'
          className='btn btn-primary float-right ml-3 shadow'
        >
          <i className='fas fa-check' aria-hidden='true'></i> {t('Consent')}
        </button>
      </div>
      <ModalConsent
        show={modal.visible}
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
        onConfirm={() => {
          console.log('data', modal.content);
        }}
      />
    </div>
  );
}

export default SalaryPropse;
