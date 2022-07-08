import React, {useState} from 'react';
import { Modal } from 'react-bootstrap';
import IconDelete from '../../../../assets/img/icon/Icon_Cancel.svg';
import IconX from '../../../../assets/img/icon/icon_x.svg';
import { useTranslation } from 'react-i18next';
import './styles.scss';
const ModalConsent = ({ show, onHide, data, setData, onConfirm }) => {
  const { t } = useTranslation();
  const [error, setError] = useState(false)
  return (
    <Modal centered show={show} onHide={onHide} className='modal-consent'>
      <Modal.Header className='modal-consent__header'>
        <p className='modal-consent__title'>{t('confirmCancleConsent')}</p>
        <img
          src={IconX}
          className='mr-1 cursor-pointer icon-delete'
          onClick={onHide}
        />
      </Modal.Header>
      <Modal.Body className='modal-consent__body'>
        <div className='content'>
          <div>
            <p className='modal-consent__textlabel'>
              Lý do từ chối thẩm định <span className='text-danger'>(*)</span>
            </p>
            <textarea
              className='modal-consent__textarea'
              rows={3}
              placeholder=' Không điều chỉnh lương'
              value={data}
              onChange={(val) => {
                if (val.target.value !== '') {
                  setError(false);
                }
                setData(val.target.value);
              }}
            ></textarea>
            {error &&<span className='text-danger text-xs'>{t('RequiredInput')}</span>}
          </div>
          <div className='d-flex justify-content-end mt-3'>
            <button
              type='button'
              className='btn btn-secondary ml-3 shadow'
              onClick={onHide}
            >
              <img src={IconDelete} className='mr-1' />
              {t('CancelSearch')}
            </button>
            <button
              type='button'
              className='btn btn-danger ml-3 shadow'
              onClick={() => {
                if (data.trim().length === 0) {
                  setError(true);
                  return;
                }
                setError(false);
                onConfirm()
              }}
            >
              <i className='fa fa-check mr-1' aria-hidden='true'></i>
              {t('Oke')}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalConsent;
