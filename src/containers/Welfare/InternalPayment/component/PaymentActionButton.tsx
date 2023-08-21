import React, { useState } from "react";
import IconSend from "assets/img/icon/pms/icon-send.svg";
import { validateFileMimeType, validateTotalFileSize } from "utils/file";

interface IPaymentActionButtonsProps {
  t: any;
  errors: any;
  updateFilesToParent: Function;
  sendRequests: Function;
}
function PaymentActionButtons({
  t,
  errors,
  updateFilesToParent,
  sendRequests,
}: IPaymentActionButtonsProps) {
  const [files, SetFiles] = useState<any[]>([]);

  const handleChangeFileInput = (e) => {
    if (validateFileMimeType(e, e.target.files, t)) {
      const filesSelected: any[] = Object.values(e.target.files);
      let fileStates = [...files];
      fileStates = fileStates.concat(filesSelected);
      if (validateTotalFileSize(e, fileStates, t)) {
        SetFiles(fileStates);
        updateFilesToParent(fileStates);
      }
    }
  };

  const removeFiles = (index) => {
    let fileStates = [...files];
    const filesValid = [
      ...fileStates.slice(0, index),
      ...fileStates.slice(index + 1),
    ];
    SetFiles(filesValid);
    updateFilesToParent(filesValid);
  };

  const handleSendRequests = () => {
    sendRequests();
  };
  return (
    <div className="ot-request-container">
      {errors && errors.other && (
        <div className="text-danger validation-message validation-other">
          {errors.other}
        </div>
      )}
      <div className="list-files">
        {(files || []).map((file, i) => {
          return (
            <div
              className="item"
              key={i}
              style={{ border: "none", borderRadius: 4 }}
            >
              <span className="file-name">{file.name}</span>
              <span className="btn-remove">
                <i
                  className="fa fa-times remove"
                  aria-hidden="true"
                  onClick={() => removeFiles(i)}
                ></i>
              </span>
            </div>
          );
        })}
      </div>
      <div className="block-button-actions">
        <div className="block-buttons">
          <span className="btn-action btn-attachment">
            <label htmlFor="i_files" className="custom-file-upload">
              <i className="fas fa-paperclip" style={{ fontWeight: 700 }}></i>
              {t("AttachFile")}
            </label>
            <input
              id="i_files"
              type="file"
              name="i_files"
              onChange={handleChangeFileInput}
              accept=".xls, .xlsx, .doc, .docx, .jpg, .png, .pdf"
              multiple
            />
          </span>
          <button
            type="button"
            className="btn btn-primary ml-3 shadow"
            style={{
              backgroundColor: "#007bff",
              width: "unset",
              paddingLeft: "15px",
              paddingRight: "15px",
            }}
            onClick={handleSendRequests}
          >
            <img src={IconSend} alt="Send" />
            {t("Send")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentActionButtons;
