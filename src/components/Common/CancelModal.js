import { Fragment, useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import IconClose from "assets/img/icon/icon_x.svg"

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
      className="guide-line-ticket-modal"
      show={dataModal?.isShow}
      onHide={dataModal?.onHide}
    >
      <Modal.Body className='rounded'>
        <div className="header">
          <div className='text-title text-uppercase'>{dataModal?.titleModal}</div>
          <span className="close" onClick={dataModal?.onHide}><img src={IconClose} alt="Close" /></span>
        </div>
        <div className='content'>
          {
            (dataModal?.fields || []).map((item, index) => {
              return (
                <div className="row-items" key={`row-${index}`}>
                  <label>{item?.labelText}</label>
                  {
                    item?.inputType === 'text'
                    ? (
                      <input 
                        type={item?.inputType} 
                        placeholder={item?.placeholderText}
                        name={item?.inputName}
                        value={inputData[item?.inputName] || ''}
                        onChange={e => handleInputChange(item?.inputName, item?.inputType, e)}
                      />
                    )
                    : (
                      <textarea 
                        rows={3} 
                        placeholder={item?.placeholderText} 
                        value={inputData[item?.inputName] || ''} 
                        onChange={e => handleInputChange(item?.inputName, item?.inputType, e)} 
                      />
                    )
                  }
                </div>
              )
            })
          }
        </div>
      </Modal.Body>
    </Modal>
  );
}