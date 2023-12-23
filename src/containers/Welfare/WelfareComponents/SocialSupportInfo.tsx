import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import _ from "lodash";
import {
  IMemberInfo,
  ISocialSupportModel,
} from "models/welfare/SocialContributeModel";
import {
  GENDER_LIST,
} from "../InsuranceSocialContribute/SocialContributeData";
import { toast } from "react-toastify";
import moment from "moment";
import Constants from "commons/Constants";
import axios from "axios";
import ResultModal from "containers/Registration/ResultModal";
import LoadingModal from "components/Common/LoadingModal";
import { getMuleSoftHeaderConfigurations, getRequestConfigurations} from "commons/Utils";
import SocialSupportListComponent from "../InsuranceSocialSupport/SocialSupportListComponent";
import CreateSocialSupportInfo from "../InsuranceSocialSupport/CreateSocialSupportInfo";

const SocialSupportInfo = (props: any) => {
  const { t } = props;
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [data, setData] = useState<ISocialSupportModel>({});
  const [members, setMembers] = useState<IMemberInfo[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [approver, setApprover] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [userprofile, setUserProfile] = useState<any>({});
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
  const [templates, setTemplates] = useState<any>({});

  useEffect(() => {
    getPersonalInfo();
    getTemplateFile();
  }, []);

  const getTemplateFile = async () => {
    try {
      setLoading(true);
      const requestConfig = getRequestConfigurations();
      const getInfoDetail = await axios.post(`${process.env.REACT_APP_REQUEST_SERVICE_URL}common/getTemplateByTypes`, [1, 2, 3, 4, 5, 6, 7], requestConfig)
      if(getInfoDetail?.data?.data) {
        setTemplates(getInfoDetail.data.data);
      }
    } catch(error) {

    } finally {
      setLoading(false);
    }
  }

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
    formData.append("typeId", data.type?.value);
    formData.append("typeName", data.type?.label + '');
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
      url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}insurancesupport`,
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
      window.location.href = "/tasks?requestTypes=14,15,20,21,22,22,23";
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
        <h5 style={{fontSize: '16px'}} className="mt-3 mb-3">{t('ListRequestCreated')}</h5>
        <SocialSupportListComponent
            t={t}
        />
          <CreateSocialSupportInfo
            t={t}
            data={data}
            setData={setData}
            supervisors={supervisors}
            setSupervisors={setSupervisors}
            approver={approver}
            setApprover={setApprover}
            files={files}
            templates={templates}
            updateFiles={setFiles}
            removeFile={removeFile}
            members={members}
            setMembers={setMembers}
            onSubmit={onSubmit}
            isCreateMode={isCreateMode}
            notifyMessage={notifyMessage}
          />
      </div>
    </>
  );
};
export default withTranslation()(SocialSupportInfo);
