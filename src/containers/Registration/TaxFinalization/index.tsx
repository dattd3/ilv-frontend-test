import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import _ from "lodash";
import { toast } from "react-toastify";
import moment from "moment";
import Constants from "commons/Constants";
import axios from "axios";
import ResultModal from "containers/Registration/ResultModal";
import LoadingModal from "components/Common/LoadingModal";
import {
  formatStringByMuleValue,
  getMuleSoftHeaderConfigurations,
  getRequestConfigurationsWithCulture,
} from "commons/Utils";
import {
  TAX_TYPE_CONSTANT,
  STATUS,
  getTaxAuthrizationOptions,
} from "./TaxConstants";
import { ITaxInfoModel, ITaxMemberInfo } from "./TaxModel.types";
import CreateTaxFinalizationComponent from "./CreateTaxFinalizationComponent";

const SocialContributeInfo = (props: any) => {
  const { t } = props;
  const type = TAX_TYPE_CONSTANT.CREATE;
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [changeData, setChangeData] = useState<any>({});
  const [oldData, setOldData] = useState<ITaxInfoModel>({});
  const [data, setData] = useState<ITaxInfoModel>({});
  const [oldMembers, setOldMembers] = useState<ITaxMemberInfo[]>([]);
  const [members, setMembers] = useState<ITaxMemberInfo[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [approver, setApprover] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [userprofile, setUserProfile] = useState<any>({});
  const [lastModified, setLastModified] = useState<any>({});
  const [templates, setTemplates] = useState<any>({});
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
    getTaxTemplate();
    initData();
  }, []);

  const initData = async () => {
    setLoading(true);
    const members = await getFamilyInfo();
    const profile = await getPersonalInfo();

    //data
    //let _oldData = {};
    const _data: ITaxInfoModel = {};
    _data.PitNo = convertDataExtract(profile?.tax_number) as string;
    _data.dependentNumber = members.length + "";

    _data.email = convertDataExtract(profile.personal_email) as string;
    _data.address = convertDataExtract(
      SummaryAddress([
        formatStringByMuleValue(profile?.tmp_street_name),
        formatStringByMuleValue(profile?.tmp_wards),
        formatStringByMuleValue(profile?.tmp_district),
        formatStringByMuleValue(profile?.tmp_province),
        formatStringByMuleValue(profile?.tmp_nation),
      ]) ||
        SummaryAddress([
          formatStringByMuleValue(profile?.street_name),
          formatStringByMuleValue(profile?.wards),
          formatStringByMuleValue(profile?.district),
          formatStringByMuleValue(profile?.province),
          formatStringByMuleValue(profile?.nation),
        ])
    ) as string;
    _data.idNumber = convertDataExtract(profile?.personal_id_no) as string;
    _data.dateIssue = convertDataExtract(
      profile?.date_of_issue
        ? moment(profile.date_of_issue, "DD-MM-YYYY").format("DD/MM/YYYY")
        : ""
    ) as string;
    _data.placeIssue = convertDataExtract(profile?.place_of_issue) as string;
    _data.typeRequest = getTaxAuthrizationOptions(t)[0];

    setOldData({
      ..._data,
    });
    setData(_data);
    let _oldmember = members.map((mem) => {
      return {
        ...mem,
        status: STATUS.OLD,
      };
    });
    setOldMembers(_oldmember);
    setMembers(members);
    setLoading(false);
  };

  const SummaryAddress = (lstLocation: any[] = []) => {
    const address = lstLocation.filter((item) => item).join(", ");
    return address || "";
  };

  const getTaxTemplate = async () => {
    const config = getRequestConfigurationsWithCulture();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_REQUEST_SERVICE_URL}common/getTemplateDocumentByTypes`,
        [2301, 2302],
        config
      );
      if (res && res.data && res.data.data) {
        setTemplates(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const getFamilyInfo = async () => {
    const config = getMuleSoftHeaderConfigurations();
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/family`,
        config
      );
      if (res && res.data && res.data.data) {
        let userFamily = res.data.data || [];
        userFamily = userFamily
          ?.filter((fam) => fam.is_reduced == "X")
          .map((fam) => convertMemberFamily(fam));
        return userFamily;
      }
      return [];
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const getPersonalInfo = async () => {
    const config = getMuleSoftHeaderConfigurations();
    let profile: any = {},
      _userInfo;
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/personalinfo`,
        config
      );
      profile = res.data.data[0];
      _userInfo = {
        idNumber: profile?.personal_id_no || "",
        dateOfIssue: profile?.date_of_issue
          ? moment(profile.date_of_issue, "DD-MM-YYYY").format("YYYY-MM-DD")
          : "",
        placeOfIssue: profile?.place_of_issue || "",
        employeeNo: localStorage.getItem("employeeNo"),
        fullName: localStorage.getItem("fullName"),
      };
      setUserProfile(_userInfo);
    } catch (err) {
      _userInfo = {
        idNumber: "",
        dateOfIssue: "",
        placeOfIssue: "",
        employeeNo: localStorage.getItem("employeeNo"),
        fullName: localStorage.getItem("fullName"),
      };
      setUserProfile(_userInfo);
    } finally {
      return profile;
    }
  };

  //get detail data

  const convertDataExtract = (value: any) => {
    if (!value || value == "#") return "";
    if (typeof value == "object" && value.name) {
      return {
        value: value.id,
        label: value.name || "",
      };
    } else if (typeof value == "string" || typeof value == "number")
      return value;
    return "";
  };

  const convertMemberFamily = (value: any) => {
    if (!value) return {};
    const result: ITaxMemberInfo = {
      fullName: value.full_name,
      relation: {
        value: value.relation_code,
        label: value.relation,
      },
      fromDate: value.from_date
        ? moment(value.from_date, "DD-MM-YYYY").format("DD/MM/YYYY")
        : "",
      toDate: value.to_date
        ? moment(value.to_date, "DD-MM-YYYY").format("DD/MM/YYYY")
        : "",
    };
    return result;
  };

  //end get detail data

  const checkDataChange = () => {
    const change = {};
    const memberChange: any[] = [];
    const keyDropDown = ["socialNumberType"];

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
            (mem[key].value != oldMembers[index][key]?.value ||
              mem[key].label != oldMembers[index][key]?.label)
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

  const convertData = (value: any, type = '') => {
    if (!value) return "";
    if (typeof value == "object" && value.label) {
      return {
        id: value.value,
        name: value.label,
      };
    } else if (type == 'date' && value?.indexOf('/') != -1) {
      return moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD');
    } else if (typeof value == "string" || typeof value == "number")
      return value;
    return "";
  };

  const convertFamilyItem = (value: ITaxMemberInfo | null | undefined) => {
    if (!value) return "";
    return {
      fullName: value.fullName,
      relationshipCode: value.relation?.value,
      relationshipText: value.relation?.label,
      fromDate: value.fromDate
        ? moment(value.fromDate, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "",
      toDate: value.toDate
        ? moment(value.toDate, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "",
    };
  };

  const prepareSubmitData = (dataChange, memberChange) => {
    //addressData
    const familyData = memberChange
      .map((change, index) => {
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
        if (_oldmember) {
          familyItem.oldFamily = convertFamilyItem(_oldmember);
        }
        if (_newmember) {
          familyItem.family = convertFamilyItem(_newmember);
        }
        if (!_oldmember && !_newmember) familyItem = null;
        return familyItem;
      })
      .filter((mem) => mem != null)
      .map((mem, index) => {
        return {
          ...mem,
          order: index + 1,
        };
      });
    const result = {
      familyDatas: familyData,
      type: {
        id: data.typeRequest?.value,
        name: data.typeRequest?.label
      },
      taxCode: {
        displayType: dataChange.PitNo || STATUS.OLD,
        new: convertData(data.PitNo),
        old: convertData(oldData.PitNo),
      },
      numberOfDependents: {
        displayType: dataChange.dependentNumber || STATUS.OLD,
        new: convertData(data.dependentNumber),
        old: convertData(oldData.dependentNumber),
      },
      userEmail: {
        displayType: dataChange.email || STATUS.OLD,
        new: convertData(data.email),
        old: convertData(oldData.email),
      },
      userAddress: {
        displayType: dataChange.address || STATUS.OLD,
        new: convertData(data.address),
        old: convertData(oldData.address),
      },
      idNumber: {
        displayType: dataChange.idNumber || STATUS.OLD,
        new: convertData(data.idNumber),
        old: convertData(oldData.idNumber),
      },
      userDateOfIssue: {
        displayType: dataChange.dateIssue || STATUS.OLD,
        new: convertData(data.dateIssue, 'date'),
        old: convertData(oldData.dateIssue, 'date'),
      },
      userPlaceOfIssue: {
        displayType: dataChange.placeIssue || STATUS.OLD,
        new: convertData(data.placeIssue),
        old: convertData(oldData.placeIssue),
      },
    };
    return result;
  };

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
      ...userprofile,
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
    formData.append("requestInfo", JSON.stringify(userProfileInfo));
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
      url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}taxsettlement`,
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
  };

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
        <CreateTaxFinalizationComponent
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
          userprofile={userprofile}
          isCreateMode={isCreateMode}
          lastModified={lastModified}
          templates={templates}
          notifyMessage={notifyMessage}
        />
      </div>
    </>
  );
};
export default withTranslation()(SocialContributeInfo);
