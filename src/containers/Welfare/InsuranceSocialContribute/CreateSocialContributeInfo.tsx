import React, { FC, Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { vi, enUS } from "date-fns/locale";
import moment from "moment";
import _ from "lodash";
import { Image } from "react-bootstrap";
import AssessorInfoComponent from "../InternalPayment/component/AssessorInfoComponent";
import ButtonComponent from "containers/Registration/ButtonComponent";
import { IMemberInfo, ISocialContributeModel } from "models/welfare/SocialContributeModel";
import MemberInfo from "./MemberInfo";
import IconAdd from "assets/img/ic-add-green.svg";
import { SOCIAL_NUMBER_INPUT, STATUS, socialNumberType } from "./SocialContributeData";
import { IDropdownValue } from "models/CommonModel";
import { getMuleSoftHeaderConfigurations } from "commons/Utils";
import axios from "axios";
import IconClear from 'assets/img/icon/icon_x.svg'
import { getRequestConfigs } from "commons/commonFunctions";
import SelectInputComponent from "../InternalPayment/component/SelectInputComponent";

interface ICreateSocialContributeInfoProps {
  t: any;
  data: ISocialContributeModel;
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
};

const CreateSocialContributeInfo: FC<ICreateSocialContributeInfoProps> = ({
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
  lastModified,
  notifyMessage =() => {}
}) => {
  const [provinces, setprovinces] = useState<IDropdownValue[]>([]);
  const [districts, setdistricts] = useState<IDropdownValue[]>([]);
  const [wards, setwards] = useState<IDropdownValue[]>([]);
  const [hospitals, setHospitals] = useState<IDropdownValue[]>([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if(isCreateMode) {
      getHospitalList();
      getProvices('VN');
      if(data?.province?.value) {
        getDistricts(data.province.value);
      }
      if(data?.district?.value) {
        getWards(data.district.value);
      }
    } else {
      if(data?.province?.value) {
        setprovinces([data.province]);
      }
      if(data?.district?.value) {
        setdistricts([data.district]);
      }
      if(data?.ward?.value) {
        setwards([data.ward]);
      }
      if(data?.facilityRegisterName?.value) {
        setHospitals([data.facilityRegisterName]);
      }
    }
  }, [isCreateMode]);

  const getHospitalList = () => {
    const config = getRequestConfigs()
    axios.get(`${process.env.REACT_APP_REQUEST_SERVICE_URL}socialinsurance/get-hospitals`, config)
        .then(res => {
            if (res && res.data && res.data.data) {
                let _hospitals = res.data.data?.map(item => {
                  return {
                      value: item.code,
                      label: item.name
                  };
              });
              setHospitals(_hospitals);
            }
        }).catch(error => { })
  }

  const getProvices = (country_id) =>{
    const config = getMuleSoftHeaderConfigurations()
    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/provinces?country_id=${country_id}`, config)
        .then(res => {
            if (res && res.data && res.data.data) {
                let _provinces = res.data.data?.map(item => {
                  return {
                      value: item.ID,
                      label: item.TEXT
                  };
              });
              setprovinces(_provinces);
            }
        }).catch(error => { })
  }

  const getDistricts = (province_id) => {
    const config = getMuleSoftHeaderConfigurations()
    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/districts?province_id=${province_id}`, config)
        .then(res => {
            if (res && res.data && res.data.data) {
                let _districts = res.data.data?.map(item => {
                    return {
                        value: item.ID,
                        label: item.TEXT
                    };
                });
                setdistricts(_districts);
            }
        }).catch(error => { })
}

    const getWards = (district_id) => {
        const config = getMuleSoftHeaderConfigurations()
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/wards?district_id=${district_id}`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    let _wards = res.data.data?.map(item => {
                        return {
                            value: item.ID,
                            label: item.TEXT
                        };
                    });
                    setwards(_wards)
                }
            }).catch(error => { })
    }

  const handleTextInputChange = (e, name) => {
    const candidateInfos = { ...data }
    let value = e?.target?.value;
    if(name == 'houseHoldNumber' && value) {
      value = value.replace(/[^0-9a-zA-Z]/g,'');
    }
    candidateInfos[name] = e != null ? value : "";
    setData(candidateInfos);
}

  const handleChangeSelectInputs = (e, name) => {
      const candidateInfos = { ...data }
      let shouldReset = false;
      if(name == 'socialNumberType' && e?.value == SOCIAL_NUMBER_INPUT && candidateInfos[name]?.value != SOCIAL_NUMBER_INPUT) {
        shouldReset = true;
      }
      candidateInfos[name] = e != null ? { value: e.value, label: shouldReset ? '' : e.label} : null
      setData(candidateInfos);
  }

  const addMoreMember = () => {
    const lastRequest = [...members];
    lastRequest.push({
      status: STATUS.NEW
    });
    setMembers(lastRequest);
  };

  const updateMember = (index: number, request: IMemberInfo) => {
    const _members = [...members];
    _members[index] = {
      ...request,
      status: !request.status ?  STATUS.UPDATE : request.status
    };
    setMembers(_members);
  };

  const removeMember = (index: number) => {
    const lastRequest = [...members ].map((mem, _index) => {
      if(_index != index) return mem;
      return {
        ...mem,
        status: STATUS.DELETE
      }
    }
    );
    setMembers(lastRequest);
  };

  const updateProvice = (e) => {
    if(e?.value && e?.value != data?.province?.value) {
      setdistricts([]);
      setwards([]);
      setData({
        ...data,
        'province' : e,
        'district': null,
        'ward': null,
        'street': ''
      })
      getDistricts(e.value);
    }
  }

  const updateDistrict = (e) => {
    if(e?.value && e?.value != data?.district?.value) {
      setwards([]);
      setData({
        ...data,
        'district': e,
        'ward': null,
        'street': ''
      })
      getWards(e.value);
    }
  }

  const updateWard = (e) => {
    if(e?.value && e?.value != data?.ward?.value) {
      setData({
        ...data,
        'ward': e,
        'street': ''
      })
    }
  }

  const verifyData = () => {
    let _errors = {};
    const requiredFields = [
      "socialNumberType",
      "facilityRegisterName",
      "houseHoldNumber",
      "province",
      "district",
      "ward",
      "street"
    ];
    const optionFields = [
      "socialNumberType",
      "facilityRegisterName",
      "province",
      "district",
      "ward"
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
    if(!_errors['socialNumberType'] && data['socialNumberType']?.value == SOCIAL_NUMBER_INPUT && (data['socialNumberType'].label + '')?.length != 10) {
      _errors['socialNumberType'] = 'Yêu cầu độ dài 10 ký tự';
    }
    const memberRequirer = ["relation", "fullName", "sex", "birthDate", "identityId", "type"];
    let countMainFamily = 0;
    members.map((mem, index) => {
      if(mem.status == STATUS.DELETE) return;
      memberRequirer.forEach(key => {
        if(_.isEmpty(mem[key])) {
          _errors['member_' + index + '_' + key] = t('PleaseEnterInfo');
        }
        if(key == 'identityId' && !_.isEmpty(mem[key]) && (mem[key]?.value == SOCIAL_NUMBER_INPUT &&  (mem[key]?.label + '').length != 9 && (mem[key]?.label + '')?.length != 12)) {
          _errors['member_' + index + '_' + key] = 'Yêu cầu độ dài 9 hoặc 12 ký tự';
        }
      });
      if(mem.type?.value == '1') countMainFamily++;
    })
    setErrors(_errors);

    let hasErrors = !Object.values(_errors).every(
      (item) => item === null || item === undefined
    );
    if (hasErrors) {
      notifyMessage(t('PleaseEnterInfo'), true);
    }
    if(!hasErrors && countMainFamily != 1) {
      notifyMessage('Vui lòng chọn 1 chủ hộ!');
      hasErrors = true;
    }
    //check files
    // if(!hasErrors) {
    //   let checkfiles = (!files || files?.length === 0) ? t("Required") + ' ' + t('AttachmentFile') : null
    //   if(checkfiles) {
    //     notifyMessage(checkfiles);
    //     hasErrors = true;
    //   }
    // }
    return hasErrors ? false : true;
  };

  const submitData = () => {
    if(verifyData() == false) {
      return;
    }
    onSubmit();
  }
  return (
    <div className="registration-insurance-section social-contribute input-style">
      {
        !isCreateMode && lastModified?.date?
        <>
          <h5 className="pt-0">{'NGÀY CHỈNH SỬA CUỐI CÙNG'}</h5>
          <div className="box shadow-sm cbnv">
            <span style={{ fontWeight: "700" }}>{"Cập nhật: "}</span>
            <span style={{ fontWeight: "100" }}>{lastModified?.date}</span>
            <span style={{ fontWeight: "700" }}>
              {" | Bởi "  + ": "}
            </span>
            <span style={{ fontWeight: "100" }}>{lastModified?.by}</span>
          </div>
        </> : null
      }

      <div className="row">
        <div className="col-6">
          <h5 className={`${isCreateMode ? 'pt-0' : ''}`}>
            {"SỐ SỔ BHXH "}
            <span
              style={{
                fontSize: "14px",
                fontStyle: "italic",
                fontWeight: "300",
                textTransform: "none",
              }}
            >
              (Nếu cấp mới thì để là “Đề nghị cấp sổ”)
            </span>
          </h5>
          <div className="box shadow-sm cbnv">
            {"Số sổ BHXH"} <span className="required">(*)</span>
            <SelectInputComponent
              options={socialNumberType}
              handleInputChange={(text) => {return text?.replace(/[^0-9]/g, '')}}
              maxLeng={10}
              otherValueDefault={SOCIAL_NUMBER_INPUT}
              name="socialNumberType"
              value={data?.socialNumberType}
              onChange={(value, name) => handleChangeSelectInputs(value, name)}
              placeholder={t("import")}
              className="form-control input mv-10 w-100"
              disabled={!isCreateMode}
            />
            {errors["socialNumberType"] ? (
              <p className="text-danger">{errors["socialNumberType"]}</p>
            ) : null}
          </div>
        </div>

        
        <div className="col-6">
          <h5 className={`${isCreateMode ? 'pt-0' : ''}`}>{"NƠI ĐĂNG KÝ KCB"}</h5>
          <div className="box shadow-sm cbnv">
            {"Tên cơ sở đăng ký KCB"} <span className="required">(*)</span>
            <Select
              placeholder={"Lựa chọn"}
              options={hospitals}
              isClearable={true}
              value={data?.facilityRegisterName || ''}
              onChange={(e) => handleChangeSelectInputs(e, "facilityRegisterName")}
              className="input mv-10"
              isDisabled={!isCreateMode}
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
            {errors["facilityRegisterName"] ? (
              <p className="text-danger">{errors["facilityRegisterName"]}</p>
            ) : null}
          </div>
        </div>
      </div>

    {/* ĐỊA CHỈ THEO HỘ KHẨU THƯỜNG TRÚ */}
      <h5>{'ĐỊA CHỈ THEO HỘ KHẨU THƯỜNG TRÚ'}</h5>
      <div className="box shadow-sm cbnv">
        <div className="row">
          <div className="col-4">
            {'Số sổ hộ khẩu/số sổ tạm trú'} <span className="required">(*)</span>
            <input
              type="text"
              value={data?.houseHoldNumber || ''}
              onChange={(e) => handleTextInputChange(e, "houseHoldNumber")}
              className="form-control input mv-10 w-100"
              name="houseHoldNumber"
              autoComplete="off"
              maxLength={15}
              disabled={!isCreateMode}
            />
            {errors["houseHoldNumber"] ? (
              <p className="text-danger">{errors["houseHoldNumber"]}</p>
            ) : null}
          </div>
          <div className="col-4">
            {'Tỉnh/Thành phố'}
            <span className="required">(*)</span>
            <Select
              placeholder={"Lựa chọn"}
              options={provinces}
              isClearable={false}
              value={data?.province}
              onChange={(e) => updateProvice(e)}
              className="input mv-10"
              isDisabled={!isCreateMode}
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
            {errors["province"] ? (
              <p className="text-danger">{errors["province"]}</p>
            ) : null}
          </div>
          <div className="col-4">
            {'Quận/Huyện'}
            <span className="required">(*)</span>
            <Select
              placeholder={"Lựa chọn"}
              options={districts}
              isClearable={false}
              value={data?.district}
              onChange={(e) => updateDistrict(e)}
              className="input mv-10"
              isDisabled={!isCreateMode}
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
            {errors["district"] ? (
              <p className="text-danger">{errors["district"]}</p>
            ) : null}
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {'Xã/Phường'} <span className="required">(*)</span>
            <Select
              placeholder={"Lựa chọn"}
              options={wards}
              isClearable={false}
              value={data?.ward}
              onChange={(e) => updateWard(e)}
              className="input mv-10"
              isDisabled={!isCreateMode}
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
            {errors["ward"] ? (
              <p className="text-danger">{errors["ward"]}</p>
            ) : null}
          </div>

          <div className="col-8">
            {'Số nhà, đường phố, xóm'} <span className="required">(*)</span>
            <input
              type="text"
              value={data?.street || ''}
              onChange={(e) => handleTextInputChange(e, "street")}
              className="form-control input mv-10 w-100"
              name="street"
              autoComplete="off"
              maxLength={255}
              disabled={!isCreateMode}
            />
            {errors["street"] ? (
              <p className="text-danger">{errors["street"]}</p>
            ) : null}
          </div>
        </div>
      </div>

      <h5>{'THÔNG TIN HỘ GIA ĐÌNH'}</h5>
      <div className="box shadow-sm cbnv">
        {(members || []).map((request: IMemberInfo, index: number) => {
          if(request.status == STATUS.DELETE) return null;
          return (
            <Fragment key={index}>
              <MemberInfo
                t={t}
                request={request}
                index={index}
                errors={errors}
                canDelete={members?.length > 0 ? true : false}
                isCreateMode={isCreateMode}
                cancelRequest={() => removeMember(index)}
                updateRequest={(req: IMemberInfo) => updateMember(index, req)}
              />
              <div className="mv-10"></div>
            </Fragment>
          );
        })}
        {isCreateMode ? (
            <button
              className="btn btn-outline-success btn-lg w-fit-content mt-3 d-flex align-items-center"
              style={{ gap: "4px", fontSize: "14px" }}
              onClick={addMoreMember}
            >
              <Image src={IconAdd} />
              {'Thêm'}
            </button>
          ) : null}
      </div>
      
      <h5>{'GHI CHÚ'}</h5>
      <div className="box shadow-sm cbnv">
        <div className="row">
          <div className="col-12">
            {'Nội dung'}
            <textarea
              rows={4}
              value={data?.note || ''}
              onChange={(e) => handleTextInputChange(e, "note")}
              className="form-control input mv-10 w-100"
              name="note"
              autoComplete="off"
              disabled={!isCreateMode}
              maxLength={255}
            />
          </div>
        </div>
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

export default CreateSocialContributeInfo;
