import React, { FC, Fragment, useEffect, useState } from "react";
import moment from "moment";
import _ from "lodash";
import { Image } from "react-bootstrap";
import ButtonComponent from "containers/Registration/ButtonComponent";
import IconAdd from "assets/img/ic-add-green.svg";
import { IDropdownValue } from "models/CommonModel";
import TaxMemberInfo from "./TaxMemberInfo";
import TaxAuthrizationComponent from "./TaxAuthrizationComponent";
import { STATUS, TaxAuthorizationOptions } from "./TaxConstants";
import { ITaxInfoModel, ITaxMemberInfo } from "./TaxModel.types";
import AssessorInfoComponent from "containers/Welfare/InternalPayment/component/AssessorInfoComponent";

interface ICreateSocialContributeInfoProps {
  t: any;
  data: ITaxInfoModel;
  setData: Function;
  supervisors: any[];
  setSupervisors: Function;
  approver: any;
  setApprover?: Function;
  files: any[];
  updateFiles: Function;
  removeFile: Function;
  members: ITaxMemberInfo[];
  setMembers: Function;
  isCreateMode: boolean;
  onSubmit: Function;
  notifyMessage: Function;
  lastModified?: any;
  userprofile: any;
}

const CreateTaxFinalizationComponent: FC<ICreateSocialContributeInfoProps> = ({
  t,
  data,
  setData,
  supervisors = [],
  setSupervisors = () => {},
  approver,
  setApprover = () => {},
  files = [],
  updateFiles = () => {},
  removeFile = () => {},
  members = [{}],
  setMembers = () => {},
  isCreateMode = true,
  onSubmit,
  lastModified,
  userprofile,
  notifyMessage = () => {},
}) => {
  const [provinces, setprovinces] = useState<IDropdownValue[]>([]);
  const [districts, setdistricts] = useState<IDropdownValue[]>([]);
  const [wards, setwards] = useState<IDropdownValue[]>([]);
  const [hospitals, setHospitals] = useState<IDropdownValue[]>([]);
  const [errors, setErrors] = useState({});

  const handleTextInputChange = (e, name) => {
    const candidateInfos = { ...data };
    let value = e?.target?.value;
    if (name == "dependentNumber" && value) {
      value = value.replace(/[^0-9]/g, "");
    }
    candidateInfos[name] = e != null ? value : "";
    setData(candidateInfos);
  };

  const addMoreMember = () => {
    const lastRequest = [...members];
    lastRequest.push({
      status: STATUS.NEW,
    });
    setMembers(lastRequest);
  };

  const updateMember = (index: number, request: ITaxMemberInfo) => {
    const _members = [...members];
    _members[index] = {
      ...request,
      status: !request.status ? STATUS.UPDATE : request.status,
    };
    setMembers(_members);
  };

  const removeMember = (index: number) => {
    const lastRequest = [...members].map((mem, _index) => {
      if (_index != index) return mem;
      return {
        ...mem,
        status: STATUS.DELETE,
      };
    });
    setMembers(lastRequest);
  };

  const verifyData = () => {
    let _errors: any = {};
    const requiredFields = [
     'PitNo',
     'dependentNumber',
     'typeRequest'
    ];

    const optionFields: any = [
      
    ];

    if(data.typeRequest == TaxAuthorizationOptions.EXPOSE_TAX) {
        requiredFields.push('email', 'address', 'idNumber', 'dateIssue', 'placeIssue');
    }
    //check người thẩm định
    // if (supervisors?.length == 0 || !supervisors.every((sup) => sup != null)) {
    //   _errors["supervisors"] = t("PleaseEnterInfo");
    // }
    if (!approver) {
      _errors["approver"] = t("PleaseEnterInfo");
    }

    requiredFields.forEach((name: string) => {
      if (
        _.isEmpty(data[name]) ||
        (optionFields.includes(name) &&
          (!data[name].value || !data[name].label))
      ) {
        _errors[name] = t("PleaseEnterInfo");
      }
    });
    if (
      !_errors["PitNo"] &&
      (data['PitNo']?.length != 10 && data['PitNo']?.length != 13)
    ) {
      _errors["PitNo"] = "Yêu cầu độ dài 10 hoặc 13 ký tự";
    }
    if (
        !_errors["idNumber"] &&
        data.typeRequest == TaxAuthorizationOptions.EXPOSE_TAX &&
        (data['idNumber']?.length != 10 && data['idNumber']?.length != 13)
      ) {
        _errors["idNumber"] =
          "Yêu cầu độ dài 9 hoặc 12 ký tự";
      }
    const memberRequirer = [
      "relation",
      "fullName",
      "fromDate",
      "toDate"
    ];
    members.map((mem, index) => {
      if (mem.status == STATUS.DELETE) return;
      memberRequirer.forEach((key) => {
        if (_.isEmpty(mem[key])) {
          _errors["member_" + index + "_" + key] = t("PleaseEnterInfo");
        }
      });
    });
    setErrors(_errors);

    let hasErrors = !Object.values(_errors).every(
      (item) => item === null || item === undefined
    );
    if (hasErrors) {
      notifyMessage(t("PleaseEnterInfo"), true);
    }

    //check files
    if(!hasErrors) {
      let checkfiles = (!files || files?.length === 0) ? t("Required") + ' ' + t('AttachmentFile') : null
      if(checkfiles) {
        notifyMessage(checkfiles);
        hasErrors = true;
      }
    }
    return hasErrors ? false : true;
  };

  const submitData = () => {
    if (verifyData() == false) {
      return;
    }
    onSubmit();
  };
  return (
    <div className="registration-insurance-section social-contribute input-style">
      {!isCreateMode && lastModified?.date ? (
        <>
          <h5 className="pt-0">{"NGÀY CHỈNH SỬA CUỐI CÙNG"}</h5>
          <div className="box shadow-sm cbnv">
            <span style={{ fontWeight: "700" }}>{"Cập nhật: "}</span>
            <span style={{ fontWeight: "100" }}>{lastModified?.date}</span>
            <span style={{ fontWeight: "700" }}>{" | Bởi " + ": "}</span>
            <span style={{ fontWeight: "100" }}>{lastModified?.by}</span>
          </div>
        </>
      ) : null}

      {/* ĐỊA CHỈ THEO HỘ KHẨU THƯỜNG TRÚ */}
      <h5>{t("EmployeeInfomation")}</h5>
      <div className="box shadow-sm cbnv">
        <div className="row">
          <div className="col-4">
            {t("FullName")}
            <input
              type="text"
              value={userprofile.fullName || ""}
              className="form-control input mv-10 w-100"
              name="houseHoldNumber"
              autoComplete="off"
              maxLength={15}
              disabled={true}
            />
          </div>
          <div className="col-4">
            {t("EmployeeNo")}
            <input
              type="text"
              value={userprofile.employeeNo || ""}
              className="form-control input mv-10 w-100"
              name="houseHoldNumber"
              autoComplete="off"
              maxLength={15}
              disabled={true}
            />
          </div>

          <div className="col-4">
            {t("PitNo")} <span className="required">(*)</span>
            <input
              type="text"
              value={data?.PitNo || ""}
              onChange={(e) => handleTextInputChange(e, "PitNo")}
              className="form-control input mv-10 w-100"
              name="PitNo"
              autoComplete="off"
              maxLength={255}
              disabled={!isCreateMode}
            />
            {errors["PitNo"] ? (
              <p className="text-danger">{errors["PitNo"]}</p>
            ) : null}
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {t("IdNo")}
            <input
              type="text"
              value={userprofile.idNumber || ""}
              className="form-control input mv-10 w-100"
              name="houseHoldNumber"
              autoComplete="off"
              maxLength={15}
              disabled={true}
            />
          </div>

          <div className="col-4">
            {t("DateIssue")}
            <input
              type="text"
              value={userprofile.dateOfIssue ? moment(userprofile.dateOfIssue, 'YYYY-MM-DD').format('DD/MM/YYYY') : ''}
              className="form-control input mv-10 w-100"
              name="houseHoldNumber"
              autoComplete="off"
              maxLength={15}
              disabled={true}
            />
          </div>

          <div className="col-4">
            {t("PlaceIssue")}
            <input
              type="text"
              value={userprofile.pidPlaceOfIssue || ""}
              className="form-control input mv-10 w-100"
              name="houseHoldNumber"
              autoComplete="off"
              maxLength={15}
              disabled={true}
            />
          </div>
        </div>
        <div className="row mv-10">
          <div className="col-4">
            {t("so_nguoi_phu_thuoc")} <span className="required">(*)</span>
            <input
              type="text"
              value={data?.dependentNumber || ""}
              onChange={(e) => handleTextInputChange(e, "dependentNumber")}
              className="form-control input mv-10 w-100"
              name="dependentNumber"
              autoComplete="off"
              maxLength={255}
              disabled={!isCreateMode}
            />
            {errors["dependentNumber"] ? (
              <p className="text-danger">{errors["dependentNumber"]}</p>
            ) : null}
          </div>
        </div>
      </div>

      <h5>{t('thong_tin_nguoi_phu_thuoc')}</h5>
      <div className="box shadow-sm cbnv">
        {(members || []).map((request: ITaxMemberInfo, index: number) => {
          if (request.status == STATUS.DELETE) return null;
          return (
            <Fragment key={index}>
              <TaxMemberInfo
                t={t}
                request={request}
                index={index}
                errors={errors}
                canDelete={members?.length > 0 ? true : false}
                isCreateMode={isCreateMode}
                cancelRequest={() => removeMember(index)}
                updateRequest={(req: ITaxMemberInfo) => updateMember(index, req)}
              />
              <div style={{height: '20px'}}></div>
            </Fragment>
          );
        })}
        {isCreateMode ? (
          <button
            className="btn btn-outline-success btn-lg w-fit-content d-flex align-items-center"
            style={{ gap: "4px", fontSize: "14px" }}
            onClick={addMoreMember}
          >
            <Image src={IconAdd} />
            {"Thêm"}
          </button>
        ) : null}
      </div>

      <h5>{t('Request')}</h5>
      <div  className="box shadow-sm cbnv">
        <TaxAuthrizationComponent isCreateMode={isCreateMode} t={t} setData ={setData} handleTextInputChange={handleTextInputChange} data = {data} errors = {errors}/>
      </div>

      {isCreateMode ? (
        <AssessorInfoComponent
          t={t}
          isCreateMode={isCreateMode}
          setSupervisors={setSupervisors}
          supervisors={supervisors}
          approver={approver}
          setApprover={setApprover}
          errors={errors}
        />
      ) : null}

      <div className="registration-section">
        <ul className="list-inline">
          {files.map((file, index) => {
            return (
              <li className="list-inline-item" key={index}>
                <span className="file-name">
                  <a
                    title={file.name}
                    href={file.fileUrl}
                    download={file.name}
                    target="_blank"
                  >
                    {file.name}
                  </a>
                  {isCreateMode ? (
                    <i
                      className="fa fa-times remove"
                      aria-hidden="true"
                      onClick={() => removeFile(index)}
                    ></i>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
        {isCreateMode ? (
          <ButtonComponent
            isEdit={false}
            files={files}
            updateFiles={updateFiles}
            submit={() => submitData()}
            isUpdateFiles={() => {}}
            disabledSubmitButton={false}
            validating={false}
          />
        ) : null}
      </div>
    </div>
  );
};

export default CreateTaxFinalizationComponent;
