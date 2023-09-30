import React, { FC, useEffect, useState } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import Select from "react-select";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi, enUS } from "date-fns/locale";
import moment from "moment";
import Constants from "../../../commons/Constants";
import _ from "lodash";
import { Image } from "react-bootstrap";
import {
  DECLARE_FORM_OPTIONS,
  HOSPITAL_LINE,
  RECEIVE_TYPE,
  SICK_PLAN,
  WORKING_CONDITION,
} from "../InsuranceComponents/InsuranceData";
import { Spinner } from "react-bootstrap";
import AssessorInfoComponent from "../InternalPayment/component/AssessorInfoComponent";
import ButtonComponent from "containers/Registration/ButtonComponent";
import DocumentRequired from "../InsuranceComponents/DocumentRequired";
import { IMemberInfo, ISocialContributeModel } from "models/welfare/SocialContributeModel";
import MemberInfo from "./MemberInfo";
import IconAdd from "assets/img/ic-add-green.svg";
import { STATUS, socialNumberType } from "./SocialContributeData";
import { IDropdownValue } from "models/CommonModel";
import { getMuleSoftHeaderConfigurations } from "commons/Utils";
import axios from "axios";
import IconClear from 'assets/img/icon/icon_x.svg'

interface ICreateSocialContributeInfoProps {
  t: any;
  data?: ISocialContributeModel;
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
  onSubmit: Function
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
  onSubmit
}) => {
  const [provinces, setprovinces] = useState<IDropdownValue[]>([]);
  const [districts, setdistricts] = useState<IDropdownValue[]>([]);
  const [wards, setwards] = useState<IDropdownValue[]>([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if(isCreateMode) {
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
    }
  }, [isCreateMode]);

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
    candidateInfos[name] = e != null ? e.target.value : "";
    setData(candidateInfos);
}

const handleChangeSelectInputs = (e, name) => {
    const candidateInfos = { ...data }
    candidateInfos[name] = e != null ? { value: e.value, label: e.label, code: e.code } : {}
    setData(candidateInfos);
}

const handleRemoveInput = (key) => {

}

const handleDatePickerInputChange = (value, name) => {
    const candidateInfos = { ...data }
    if (moment(value, 'DD/MM/YYYY').isValid()) {
        const date = moment(value).format('DD/MM/YYYY')
        candidateInfos[name] = date

    } else {
        candidateInfos[name]= null
    }
    setData(candidateInfos)
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

  return (
    <div className="registration-insurance-section social-contribute input-style">
      {
        !isCreateMode ?
        <>
          <h5 className="pt-0">{'NGÀY CHỈNH SỬA CUỐI CÙNG'}</h5>
          <div className="box shadow-sm cbnv">
            <span style={{ fontWeight: "700" }}>{"Cập nhật: "}</span>
            <span style={{ fontWeight: "100" }}>20/09/2023 10:00:00</span>
            <span style={{ fontWeight: "700" }}>
              {" | Bởi "  + ": "}
            </span>
            <span style={{ fontWeight: "100" }}>annv8</span>
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
            {"Số sổ BHXH"}
            {
              data?.socialNumberType?.code != undefined ?
              <label className="input-container">
                <input
                  type="text"
                  value={data.socialNumberType.code}
                  onChange={(e) => handleChangeSelectInputs({...data.socialNumberType, code: e?.target?.value}, "socialNumberType")}
                  className="form-control input mv-10 w-100"
                  name="inputName"
                  autoComplete="off"
                  disabled={!isCreateMode}
                />
                <span className="input-group-addon input-img">
                  <img src={IconClear} alt='Clear' className='remove-input cursor-pointer' title='Exit' onClick={() => handleChangeSelectInputs(null, 'socialNumberType')} />
                </span>
              </label>
                 :
                <Select
                  placeholder={"Lựa chọn"}
                  options={socialNumberType}
                  isClearable={false}
                  value={data?.socialNumberType}
                  onChange={(e) => handleChangeSelectInputs(e, "socialNumberType")}
                  className="input mv-10"
                  isDisabled={!isCreateMode}
                  styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
                />
            }
          </div>
        </div>

        
        <div className="col-6">
          <h5 className={`${isCreateMode ? 'pt-0' : ''}`}>{"NƠI ĐĂNG KÝ KCB"}</h5>
          <div className="box shadow-sm cbnv">
            {"Tên cơ sở đăng ký KCB"}
            <Select
              placeholder={"Lựa chọn"}
              options={SICK_PLAN}
              isClearable={true}
              value={data?.facilityRegisterName || ''}
              onChange={(e) => handleChangeSelectInputs(e, "facilityRegisterName")}
              className="input mv-10"
              isDisabled={!isCreateMode}
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
            />
          </div>
        </div>
      </div>

    {/* ĐỊA CHỈ THEO HỘ KHẨU THƯỜNG TRÚ */}
      <h5>{'ĐỊA CHỈ THEO HỘ KHẨU THƯỜNG TRÚ'}</h5>
      <div className="box shadow-sm cbnv">
        <div className="row">
          <div className="col-4">
            {'Số sổ hộ khẩu/số sổ tạm trú'}
            <input
              type="text"
              value={data?.houseHoldNumber || ''}
              onChange={(e) => handleTextInputChange(e, "houseHoldNumber")}
              className="form-control input mv-10 w-100"
              name="houseHoldNumber"
              autoComplete="off"
              disabled={!isCreateMode}
            />
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
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {'Xã/Phường'}
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
          </div>

          <div className="col-8">
            {'Số nhà, đường phố, xóm'}
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
          </div>
        </div>
      </div>

      <h5>{'THÔNG TIN HỘ GIA ĐÌNH'}</h5>
      <div className="box shadow-sm cbnv">
        {(members || []).map((request: IMemberInfo, index: number) => {
          if(request.status == STATUS.DELETE) return null;
          return (
            <>
              <MemberInfo
                key={index}
                t={t}
                request={request}
                canDelete={members?.length > 0 ? true : false}
                isCreateMode={isCreateMode}
                provinces = {provinces}
                cancelRequest={() => removeMember(index)}
                updateRequest={(req: IMemberInfo) => updateMember(index, req)}
              />
              <div className="mv-10"></div>
            </>
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
            <input
              type="text"
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

      <AssessorInfoComponent
        t={t}
        isCreateMode={isCreateMode}
        setSupervisors={setSupervisors}
        supervisors={supervisors}
        approver={approver}
        setApprover={setApprover}
        errors={errors}
      />

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
          submit={() => onSubmit()} 
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
