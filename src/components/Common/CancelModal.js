import { Fragment, useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import IconClose from "assets/img/icon/icon_x.svg"
import IconOk from "assets/img/icon/Icon_Check_White.svg"
import IconCancel from "assets/img/icon/Icon_Cancel.svg"

export default function CancelModal({ dataModal }) {
  const [inputData, setInputData] = useState({})

  const handleInputChange = (inputName, inputType, e) => {
    setInputData({
      ...inputData,
      [inputName]: e?.target?.value || '',
    })
  }

  return (
    <Modal
      className="cancel-modal"
      show={dataModal?.isShow}
      onHide={dataModal?.onHide}
    >
      <Modal.Body className='rounded'>
        <div className="header">
          <div className='text-title text-uppercase'>{dataModal?.titleModal}</div>
          <span className="close" onClick={dataModal?.onHide}><img src={IconClose} alt="Close" /></span>
        </div>
        <div className='content'>
          <div className="row-items">
            <label>{dataModal?.field?.labelText}</label>
            {
              dataModal?.field?.inputType === 'text'
              ? (
                <input 
                  type={dataModal?.field?.inputType} 
                  className="input"
                  placeholder={dataModal?.field?.placeholderText}
                  value={inputData[dataModal?.field?.inputName] || ''}
                  onChange={e => handleInputChange(dataModal?.field?.inputName, dataModal?.field?.inputType, e)}
                />
              )
              : (
                <textarea 
                  rows={3} 
                  className="input"
                  placeholder={dataModal?.field?.placeholderText} 
                  value={inputData[dataModal?.field?.inputName] || ''} 
                  onChange={e => handleInputChange(dataModal?.field?.inputName, dataModal?.field?.inputType, e)} 
                />
              )
            }
          </div>
          <div className="d-flex justify-content-end button-block">
            <button type="button" className="btn cancel" onClick={dataModal?.onHide}>
              <img src={IconCancel} alt="Cancel" />
              Hủy
            </button>
            <button 
              type="button" 
              className="btn ok" 
              onClick={() => dataModal?.buttonOk?.submitButtonOk({id: dataModal?.id, [dataModal?.field?.inputName]: inputData[dataModal?.field?.inputName]})}
            >
              <img src={IconOk} alt="Close" />
              {dataModal?.buttonOk?.label}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}