import React, { FC, Fragment, useEffect, useState } from "react";
import Select from "react-select";
import _ from "lodash";
import AssessorInfoComponent from "../InternalPayment/component/AssessorInfoComponent";
import ButtonComponent from "containers/Registration/ButtonComponent";
import { IMemberInfo, ISocialSupportModel } from "models/welfare/SocialContributeModel";
import { SOCIAL_SUPPORT_TYPE} from "../InsuranceSocialContribute/SocialContributeData";

interface ICreateSocialSupportInfoProps {
  t: any;
  data: ISocialSupportModel;
  setData: Function;
  supervisors: any[],
  setSupervisors: Function,
  approver: any,
  setApprover?: Function,
  files: any[],
  updateFiles: Function,
  removeFile: Function ,
  members: IMemberInfo[], 
  setMembers: Function,
  isCreateMode: boolean,
  onSubmit: Function;
  notifyMessage: Function;
  lastModified?: any;
  templates: any
};

const CreateSocialSupportInfo: FC<ICreateSocialSupportInfoProps> = ({
  t,
  data,
  setData,
  supervisors = [],
  setSupervisors=()=>{},
  approver,
  setApprover=()=>{},
  files = [],
  updateFiles=()=>{},
  removeFile=()=>{},
  members = [{}], 
  setMembers=()=>{},
  isCreateMode = true,
  onSubmit,
  notifyMessage =() => {},
  templates = {}
}) => {
  const [errors, setErrors] = useState({});

  const handleChangeSelectInputs = (e, name) => {
      const candidateInfos = { ...data }
      let shouldReset = false;
      candidateInfos[name] = e != null ? { value: e.value, label: shouldReset ? '' : e.label} : null
      setData(candidateInfos);
  }

  const onDownloadTemplate = () => {
    if(!data?.type?.value) {
      notifyMessage('Yêu cầu chọn loại yêu cầu', true);
      return;
    }
    if(!templates[data.type.value]) {
      notifyMessage('Không có tài liệu');
      return;
    }
    const link = document.createElement('a');
    link.href = templates[data.type.value];
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  }

  const verifyData = () => {
    let _errors = {};
    const requiredFields = [
      "type"
    ];
    const optionFields = [
      "type"
    ]
    //check người thẩm định
    if(supervisors?.length == 0 || !supervisors.every(sup => sup != null)) {
      _errors['supervisors'] = t('PleaseEnterInfo');
    }
    if(!approver) {
      _errors['approver'] = t('PleaseEnterInfo');
    }

    requiredFields.forEach((name) => {
      if (
        _.isEmpty(data[name]) ||
        (optionFields.includes(name) && (!data[name].value || !data[name].label))
      ) {
        _errors[name] = t('PleaseEnterInfo');
      }
    });
    
    setErrors(_errors);

    let hasErrors = !Object.values(_errors).every(
      (item) => item === null || item === undefined
    );
    if (hasErrors) {
      notifyMessage(t('PleaseEnterInfo'), true);
    }
   
    //check files
    if(!hasErrors) {
      let checkfiles = (!files || files?.length === 0) ? t("Required") + ' ' + t('AttachmentFile') : null
      if(checkfiles) {
        notifyMessage(checkfiles);
        hasErrors = true;
      }
    }
    console.log(_errors);
    return hasErrors ? false : true;
  };

  const submitData = () => {
    if(verifyData() == false) {
      return;
    }
    onSubmit();
  }
  return (
    <div className="registration-insurance-section social-contribute input-style mt-4">
      <div className="row">
        <div className="col-12">
          <h5>
            {t('createRequest')}
          </h5>
          <div className="box shadow-sm cbnv">
            {t('TypeOfRequest')} <span className="required">(*)</span>
            <Select
              placeholder={"Lựa chọn"}
              options={SOCIAL_SUPPORT_TYPE}
              isClearable={false}
              value={data?.type}
              onChange={(value, name) => handleChangeSelectInputs(value, 'type')}
              className="input mv-10"
              isDisabled={!isCreateMode}
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
            {errors["type"] ? (
              <p className="text-danger">{errors["type"]}</p>
            ) : null}
          </div>
        </div>
      </div>

      <h5>{t('ListDocumentNeedSend')}</h5>
      <div className="box shadow-sm cbnv">
        {t('RequestDownloadDocument')}
        <a style={{color: '#007bff', cursor: 'pointer'}} onClick={() => onDownloadTemplate()}>{t('Here')}</a>
      </div>

      {
        isCreateMode ?
        <AssessorInfoComponent
          t={t}
          isCreateMode={isCreateMode}
          setSupervisors={setSupervisors}
          supervisors={supervisors}
          approver={approver}
          setApprover={setApprover}
          errors={errors}
          notifyMessage={notifyMessage}
        /> : null
      }

      <div className="registration-section">
        <ul className="list-inline">
          {files.map((file, index) => {
              return <li className="list-inline-item" key={index}>
                  <span className="file-name">
                      <a title={file.name} href={file.fileUrl} download={file.name} target="_blank">{file.name}</a>
                      {
                        isCreateMode ? <i className="fa fa-times remove" aria-hidden="true" onClick={() => removeFile(index)}></i> : null
                      }
                  </span>
              </li>
          })}
        </ul>
        {
          isCreateMode ?
          <ButtonComponent
          isEdit={false} 
          files={files} 
          updateFiles={updateFiles} 
          submit={() => submitData()} 
          isUpdateFiles={()=>{}} 
          disabledSubmitButton={false} 
          validating={false}/> 
          : null
        }
      </div>
    </div>
  );
};

export default CreateSocialSupportInfo;
