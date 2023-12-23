import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import _ from "lodash";
import CreateSocialContributeInfo from "../InsuranceSocialContribute/CreateSocialContributeInfo";
import {
  IMemberInfo,
  ISocialContributeModel,
} from "models/welfare/SocialContributeModel";
import {
  GENDER_LIST,
  ROLE_TYPE,
  SOCIAL_NUMBER_INPUT,
  STATUS,
} from "../InsuranceSocialContribute/SocialContributeData";
import DetailSocailContributeComponent from "../InsuranceSocialContribute/DetailSocialContributeInfoComponent";
import { toast } from "react-toastify";
import moment from "moment";
import Constants from "commons/Constants";
import axios from "axios";
import ResultModal from "containers/Registration/ResultModal";
import LoadingModal from "components/Common/LoadingModal";
import { getMuleSoftHeaderConfigurations, getRequestConfigurations } from "commons/Utils";
import { IDropdownValue } from "models/CommonModel";
import IconEdit from 'assets/img/icon/ic_edit_information_white.svg'
import IconHistory from 'assets/img/icon/ic_history_white.svg'

const SocialContributeInfo = (props: any) => {
  const { t } = props;
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [changeData, setChangeData] = useState<any>({});
  const [oldData, setOldData] = useState<ISocialContributeModel>({});
  const [data, setData] = useState<ISocialContributeModel>({});
  const [oldMembers, setOldMembers] = useState<IMemberInfo[]>([]);
  const [members, setMembers] = useState<IMemberInfo[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [approver, setApprover] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [userprofile, setUserProfile] = useState<any>({});
  const [lastModified, setLastModified] = useState<any>({});
  const [resultModal, setresultModal] = useState({
    isShowStatusModal: false,
    titleModal: "",
    messageModal: "",
    isSuccess: false,
  });
  const [statusModal, setStatusModal] = useState({
    isShowStatusModal: false,
    content: "",
    isSuccess: false,
  });
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    getSocialInfoData();
  }, []);
  
  //get detail data

  const getSocialInfoData = async () => {
    setLoading(true);
    const requestConfig = getRequestConfigurations();
    const getInfoDetail = axios.get(`${process.env.REACT_APP_REQUEST_SERVICE_URL}socialinsurance/detail`, requestConfig)
    Promise.allSettled([ getInfoDetail]).then((res: any) => {
        if (res && res[0].value) {
            let data = res[0].value.data.data;
            prepareDetailData(data?.socialInsuranceInfo);
            setLoading(false);
        }
    })
    .catch(err => {
        setLoading(false);
        console.log(err);
    })
  }

  const convertDataExtract = (value: any) => {
    if (!value) return "";
    if (typeof value == "object" && value.name) {
      return {
        value: value.id,
        label: value.name || '',
      };
    } else if (typeof value == "string" || typeof value == "number")
      return value;
    return "";
  };

  const convertMemberFamily = (value: any) => {
    if(!value) return {};
    const result: IMemberInfo = {
        fullName: value.fullName,
        relation: {value: value.relationshipCode, label: value.relationshipText},
        sex: {value: value.genderCode, label: value.genderText},
        birthDate: moment(value.birthday, "YYYY-MM-DD").format("DD/MM/YYYY"),
        type: value.isHouseholdOwner ? ROLE_TYPE[0] : ROLE_TYPE[1],
        identityId: convertDataExtract(value.idNumber) as IDropdownValue
    };
    return result;
  }

  const prepareDetailData = (requestInfo: any) => {
    //address data 
    const processStatusId  = requestInfo?.processStatusId;
    const extractRequestInfo = JSON.parse(requestInfo.requestInfo) || {};
    const addressData = extractRequestInfo.addressData || {};

    let _oldData = {...data};
    const _oldmember: any = [];
    if(processStatusId == Constants.STATUS_APPROVED) {
      _oldData.province = convertDataExtract(addressData.provinceData.province) as IDropdownValue;
      _oldData.district = convertDataExtract(addressData.districtData.district) as IDropdownValue;
      _oldData.ward = convertDataExtract(addressData.wardData.ward) as IDropdownValue;
      _oldData.houseHoldNumber = convertDataExtract(addressData.householdBookNumberData.householdBookNumber) as string;
      _oldData.street = convertDataExtract(addressData.streetData.street) as string;
      _oldData.socialNumberType = convertDataExtract(extractRequestInfo.socialInsuranceBookData.socialInsuranceBook) as IDropdownValue;
      _oldData.facilityRegisterName = convertDataExtract(extractRequestInfo.healthcarePlaceData.healthcarePlace) as IDropdownValue;
      _oldData.note = convertDataExtract(extractRequestInfo.noteData.note) as string;
      //family
      const familyData = extractRequestInfo.familyDatas || [];
      _.sortBy(familyData, 'order').map(familyItem => {
          const displayType = parseInt(familyItem.displayType);
          if(displayType != STATUS.DELETE) {
            _oldmember.push(convertMemberFamily(familyItem.family));
          }
      });
    } else {
      _oldData.province = convertDataExtract(addressData.provinceData.oldProvince) as IDropdownValue;
      _oldData.district = convertDataExtract(addressData.districtData.oldDistrict) as IDropdownValue;
      _oldData.ward = convertDataExtract(addressData.wardData.oldWard) as IDropdownValue;
      _oldData.houseHoldNumber = convertDataExtract(addressData.householdBookNumberData.oldHouseholdBookNumber) as string;
      _oldData.street = convertDataExtract(addressData.streetData.oldStreet) as string;
      _oldData.socialNumberType = convertDataExtract(extractRequestInfo.socialInsuranceBookData.oldSocialInsuranceBook) as IDropdownValue;
      _oldData.facilityRegisterName = convertDataExtract(extractRequestInfo.healthcarePlaceData.oldHealthcarePlace) as IDropdownValue;
      _oldData.note = convertDataExtract(extractRequestInfo.noteData.oldNote) as string;
      //family
      const familyData = extractRequestInfo.familyDatas || [];
      _.sortBy(familyData, 'order').map(familyItem => {
          const displayType = parseInt(familyItem.displayType);
          if(displayType != STATUS.NEW) {
              _oldmember.push(convertMemberFamily(familyItem.oldFamily));
          }
      });
    }
    
    setData(_oldData);
    setMembers(_oldmember);
    setLastModified({
        date: requestInfo.updatedDate ? moment(requestInfo?.updatedDate).format('DD/MM/YYYY HH:mm:ss') : '',
        by: requestInfo.updatedInfo ? JSON.parse(requestInfo.updatedInfo)?.account.replace('@vingroup.net', '') : ''
    })
    }

  //end get detail data

  const checkDataChange = () => {
    const change = {};
    const memberChange: any[] = [];
    const keyDropDown = [
      "socialNumberType",
      "province",
      "district",
      "ward",
      "facilityRegisterName",
    ];

    Object.keys(data).forEach((key) => {
      if (data[key] && !oldData[key]) {
        change[key] = STATUS.NEW;
      } else if (!data[key] && oldData[key]) {
        change[key] = STATUS.DELETE;
      } else if (data[key] && keyDropDown.includes(key)) {
        if (
          oldData[key].value != data[key].value ||
          oldData[key].label != data[key].label
        ) {
          change[key] = STATUS.UPDATE;
        }
      } else if (data[key] && !keyDropDown.includes(key)) {
        if (data[key] != oldData[key]) {
          change[key] = STATUS.UPDATE;
        }
      }
      if (change[key]) {
        change[key + "_value"] = data[key];
      }
    });
    members.map((mem, index) => {
      if (mem.status == STATUS.OLD || mem.status == undefined) {
        memberChange.push({ status: STATUS.OLD });
      }
      if (mem.status == STATUS.NEW) {
        memberChange.push({ status: STATUS.NEW, value: mem });
      }
      if (mem.status == STATUS.DELETE) {
        memberChange.push({ status: STATUS.DELETE });
      }
      if (mem.status == STATUS.UPDATE) {
        let _newMem = {};
        Object.keys(mem).map((key) => {
          if (key == "status") return;
          if (
            typeof mem[key] == "string" &&
            mem[key] != oldMembers[index][key]
          ) {
            _newMem[key] = mem[key];
          }
          if (
            typeof mem[key] == "object" &&
            (mem[key].value != oldMembers[index][key]?.value || mem[key].label != oldMembers[index][key]?.label)
          ) {
            _newMem[key] = mem[key];
          }
        });
        memberChange.push({ status: STATUS.UPDATE, value: _newMem });
      }
    });
    setChangeData({
      data: change,
      member: memberChange,
    });
    return {
      data: change,
      member: memberChange,
    };
  };

  const convertData = (value: any) => {
    if (!value) return "";
    if (typeof value == "object" && value.label) {
      return {
        id: value.value,
        name: value.label,
      };
    } else if (typeof value == "string" || typeof value == "number")
      return value;
    return "";
  };

  const convertFamilyItem = (value: IMemberInfo | null | undefined) => {
    if (!value) return "";
    return {
      fullName: value.fullName,
      relationshipCode: value.relation?.value,
      relationshipText: value.relation?.label,
      genderCode: value.sex?.value,
      genderText: value.sex?.label,
      birthday: value.birthDate ? moment(value.birthDate, "DD/MM/YYYY").format("YYYY-MM-DD") : '',
      isHouseholdOwner: value.type?.value == ROLE_TYPE[0].value,
      idNumber: convertData(value.identityId)
    };
  };

  const prepareSubmitData = (dataChange, memberChange) => {
    //addressData
    const addressData: any = {
      provinceData: {
        displayType: dataChange.province || STATUS.OLD,
        oldProvince: convertData(oldData.province),
        province: convertData(data.province),
      },
      districtData: {
        displayType: dataChange.district || STATUS.OLD,
        oldDistrict: convertData(oldData.district),
        district: convertData(data.district),
      },
      wardData: {
        displayType: dataChange.ward || STATUS.OLD,
        ward: convertData(data.ward),
        oldWard: convertData(oldData.ward),
      },
      householdBookNumberData: {
        displayType: dataChange.houseHoldNumber || STATUS.OLD,
        householdBookNumber: convertData(data.houseHoldNumber),
        oldHouseholdBookNumber: convertData(oldData.houseHoldNumber),
      },
      streetData: {
        displayType: dataChange.street || STATUS.OLD,
        street: convertData(data.street),
        oldStreet: convertData(oldData.street),
      },
    };
    const familyData = memberChange.map((change, index) => {
      let familyItem: any = { displayType: change.status, order: index + 1 };
      let _oldmember: any = null,
        _newmember: any = null;
      if (change.status == STATUS.NEW) {
        _newmember = change.value;
      }
      if (change.status == STATUS.DELETE) {
        _oldmember = oldMembers[index];
      }
      if (change.status == STATUS.UPDATE) {
        _oldmember = oldMembers[index];
        _newmember = { ...oldMembers[index], ...change.value };
      }
      if (change.status == STATUS.OLD) {
        _oldmember = oldMembers[index];
        _newmember = oldMembers[index];
      }
      if(_oldmember) {
        familyItem.oldFamily = convertFamilyItem(_oldmember);
      }
      if(_newmember) {
        familyItem.family = convertFamilyItem(_newmember);
      }
      if(!_oldmember && !_newmember) familyItem = null;
      return familyItem;
    }).filter(mem => mem != null).map((mem, index) => {
      return {
        ...mem,
        order: index + 1
      }
    });
    const result = {
      addressData: addressData,
      familyDatas: familyData,
      noteData: {
        displayType: dataChange.note || STATUS.OLD,
        note: convertData(data.note),
        oldNote: convertData(oldData.note),
      },
      socialInsuranceBookData: {
        displayType: dataChange.socialNumberType || STATUS.OLD,
        socialInsuranceBook: convertData(data.socialNumberType),
        oldSocialInsuranceBook: convertData(oldData.socialNumberType),
      },
      healthcarePlaceData: {
        displayType: dataChange.facilityRegisterName || STATUS.OLD,
        healthcarePlace: convertData(data.facilityRegisterName),
        oldHealthcarePlace: convertData(oldData.facilityRegisterName),
      },
    };
    return result;
  };

  const onEdit = () => {
    if(isCreateMode) return;
    let newEditable = !isCreateMode;
    if (newEditable) {
      setOldData({
        ...data,
      });
      let _oldmember = members.map((mem) => {
        return {
          ...mem,
          status: STATUS.OLD,
        };
      });
      setOldMembers(_oldmember);
    }
    if(!data.socialNumberType && localStorage.getItem('insurance_number')) {
      setData({
        ...data,
        socialNumberType: {value: SOCIAL_NUMBER_INPUT, label: localStorage.getItem('insurance_number') || ''}
      })
    }
    getPersonalInfo();
    setIsCreateMode(newEditable);
  };

  const getPersonalInfo = () => {
    const config = getMuleSoftHeaderConfigurations()
    setLoading(true);
    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/personalinfo`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          let profile = res.data.data[0];
          const _userInfo = {
            "gender": GENDER_LIST.find(u => u?.value == profile?.gender)?.label || '',
            "birthday": profile?.birthday ? moment(profile.birthday, 'DD-MM-YYYY').format('YYYY-MM-DD') : '',
            "permanentAddress": [profile?.street_name, profile?.wards, profile?.district, profile?.province ].filter(val => val).join(', '),
            "streetName": [profile?.tmp_street_name, profile?.tmp_wards, profile?.tmp_district, profile?.tmp_province ].filter(val => val).join(', '),
            "ethinicCode": profile?.race_id || '',
            "ethinic": profile?.ethinic || '',
            "idNumber": profile?.personal_id_no || '',
            "dateOfIssue": profile?.date_of_issue ? moment(profile.date_of_issue, 'DD-MM-YYYY').format('YYYY-MM-DD') : '',
            "pidPlaceOfIssue": profile?.place_of_issue || '',
            "cellPhoneNo": profile?.cell_phone_no || ''
          };
          setUserProfile(_userInfo);
        }
      }).catch(error => {
        const _userInfo = {
          "gender": '',
          "birthday": '',
          "permanentAddress": '',
          "streetName": '',
          "ethinicCode": '',
          "ethinic": '',
          "idNumber": '',
          "dateOfIssue": '',
          "pidPlaceOfIssue": '',
          "cellPhoneNo": ''

        };
        setUserProfile(_userInfo);
      }).finally(() => {
        setLoading(false);
      });
  }

  const notifyMessage = (message, isError = true) => {
    if (isError) {
      toast.error(message, {
        onClose: () => {},
      });
    } else {
      toast.success(message, {
        onClose: () => {},
      });
    }
  };

  const onSubmit = () => {
    const change = checkDataChange();
    const userProfileInfo = prepareSubmitData(change.data, change.member);
    const employeeInfo = {
      employeeNo: localStorage.getItem("employeeNo"),
      username: localStorage.getItem("ad")?.toLowerCase(),
      account: localStorage.getItem("email"),
      fullName: localStorage.getItem("fullName"),
      jobTitle: localStorage.getItem("jobTitle"),
      employeeLevel: localStorage.getItem("employeeLevel"),
      department: localStorage.getItem("department"),
      ...userprofile
    };
    const userEmployeeInfo = {
      employeeNo: localStorage.getItem("employeeNo"),
      fullName: localStorage.getItem("fullName"),
      jobTitle: localStorage.getItem("jobTitle"),
      department: localStorage.getItem("department"),
      company_email: localStorage.getItem("plEmail"),
      costCenter: localStorage.getItem("cost_center"),
    };

    let appIndex = 1;
    const appraiserInfoLst = supervisors
      .filter((item) => item != null)
      .map((item, index) => ({
        avatar: "",
        account: item?.username.toLowerCase() + "@vingroup.net",
        fullName: item?.fullName,
        employeeLevel: item?.employeeLevel,
        pnl: item?.pnl,
        orglv2Id: item?.orglv2Id,
        current_position: item?.current_position,
        department: item?.department,
        order: appIndex++,
        company_email: item?.company_email?.toLowerCase(),
        type: Constants.STATUS_PROPOSAL.LEADER_APPRAISER,
        employeeNo: item?.uid || item?.employeeNo,
        username: item?.username.toLowerCase(),
      }));

    const approverInfoLst = [approver].map((ele, i) => ({
      avatar: "",
      account: ele?.username?.toLowerCase() + "@vingroup.net",
      fullName: ele?.fullName,
      employeeLevel: ele?.employeeLevel,
      pnl: ele?.pnl,
      orglv2Id: ele?.orglv2Id,
      current_position: ele?.current_position,
      department: ele?.department,
      order: appIndex++,
      company_email: ele?.company_email?.toLowerCase(),
      type: Constants.STATUS_PROPOSAL.CONSENTER,
      employeeNo: ele?.uid || ele?.employeeNo,
      username: ele?.username?.toLowerCase(),
    }));

    const formData = new FormData();
    formData.append("userProfileInfo", JSON.stringify(userProfileInfo));
    formData.append("orgLv2Id", localStorage.getItem("organizationLv2") || "");
    formData.append("orgLv3Id", localStorage.getItem("divisionId") || "");
    formData.append("orgLv3Text", localStorage.getItem("division") || "");
    formData.append("orgLv4Id", localStorage.getItem("regionId") || "");
    formData.append("orgLv4Text", localStorage.getItem("region") || "");
    formData.append("orgLv5Id", localStorage.getItem("unitId") || "");
    formData.append("orgLv5Text", localStorage.getItem("unit") || "");
    formData.append("orgLv6Id", localStorage.getItem("partId") || "");
    formData.append("orgLv6Text", localStorage.getItem("part") || "");
    formData.append("companyCode", localStorage.getItem("companyCode") || "");
    formData.append("staffInfo", JSON.stringify(employeeInfo));
    formData.append("UserInfo", JSON.stringify(userEmployeeInfo));

    formData.append("appraiserInfoLst", JSON.stringify(appraiserInfoLst));
    formData.append("approverInfoLst", JSON.stringify(approverInfoLst));
    if (files?.filter((item) => item.id == undefined).length > 0) {
      files
        .filter((item) => item.id == undefined)
        .forEach((file) => {
          formData.append("attachedFiles", file);
        });
    }
    setLoading(true);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}socialinsurance`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `${localStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => {
        if (
          response &&
          response.data &&
          response.data.result &&
          response.data.result.code == "000000"
        ) {
          showStatusModal(t("Successful"), t("RequestSent"), true);
        } else {
          notifyMessage(response.data.result.message || t("Error"));
        }
        setLoading(false);
      })
      .catch((response) => {
        notifyMessage(t("Error"));
        setLoading(false);
      });
  };

  const showStatusModal = (title, message, isSuccess = false) => {
    setresultModal({
      isShowStatusModal: true,
      titleModal: title,
      messageModal: message,
      isSuccess: isSuccess,
    });
  };
  const hideStatusModal = () => {
    setresultModal({
      ...resultModal,
      isShowStatusModal: false,
    });
    if (resultModal.isSuccess) {
      window.location.href = "/tasks?requestTypes=14,15,20,21,22,23";
    }
  };

  const removeFile = (index) => {
    const _files = [...files.slice(0, index), ...files.slice(index + 1)];
    setFiles(_files);
  }

  return (
    <>
      <ResultModal
        show={resultModal.isShowStatusModal}
        title={resultModal.titleModal}
        message={resultModal.messageModal}
        isSuccess={resultModal.isSuccess}
        onHide={hideStatusModal}
      />
      {loading ? <LoadingModal show={loading} /> : null}
      <div className="health-info-page">
        <div className="clearfix edit-button w-100 pb-2">
          {/* <a href="/insurance-manager/social-contribute-info"><div className="btn bg-white btn-create"
                    ><i className="fas fa-plus"></i> {t('createRequest')}</div></a> */}
          <a href="/tasks?requestTypes=14,15,20,21,22,23" className="btn btn-info shadow-customize d-flex align-items-center"><img src={IconHistory} alt='History' style={{marginRight: '4px'}}/>{t("History")}</a>

          <a onClick={() => onEdit()}>
            <div className="btn shadow-customize ml-3 d-flex align-items-center" style={{backgroundColor: '#FF7F00', color: 'white'}}>
            <img src={IconEdit} alt='Edit' style={{marginRight: '4px'}} />{t("Edit")}
            </div>
          </a>
        </div>
          <CreateSocialContributeInfo
            t={t}
            data={data}
            setData={setData}
            supervisors={supervisors}
            setSupervisors={setSupervisors}
            approver={approver}
            setApprover={setApprover}
            files={files}
            updateFiles={setFiles}
            removeFile={removeFile}
            members={members}
            setMembers={setMembers}
            onSubmit={onSubmit}
            isCreateMode={isCreateMode}
            lastModified ={lastModified}
            notifyMessage={notifyMessage}
          />
      </div>
    </>
  );
};
export default withTranslation()(SocialContributeInfo);
