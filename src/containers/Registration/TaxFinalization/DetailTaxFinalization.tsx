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
  getRequestConfigurationsWithCulture,
} from "commons/Utils";
import { IDropdownValue } from "models/CommonModel";
import ProcessHistoryComponent from "containers/WorkflowManagement/DepartmentManagement/ProposalManagement/ProcessHistoryComponent";
import {
  ITaxInfoModel,
  ITaxMemberInfo,
} from "containers/Registration/TaxFinalization/TaxModel.types";
import { STATUS } from "./TaxConstants";
import InsuranceApproveActionButtons from "containers/Welfare/InsuranceComponents/InsuranceApproveActionButtons";
import DetailTaxFinalizationComponent from "./DetailTaxFinalizationComponent";

const DetailTaxFinalization = (props: any) => {
  const { t } = props;
  const action = props.match.params.type;
  const requestId = props.match.params.id;
  const [changeData, setChangeData] = useState<any>({});
  const [oldData, setOldData] = useState<ITaxInfoModel>({});
  const [data, setData] = useState<ITaxInfoModel>({});
  const [oldMembers, setOldMembers] = useState<ITaxMemberInfo[]>([]);
  const [members, setMembers] = useState<ITaxMemberInfo[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [lastModified, setLastModified] = useState<any>({});
  const [approver, setApprover] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [timeRequest, setTimerRequest] = useState<any>({});
  const [useInfo, setUserInfo] = useState<any>({});
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
  const [viewSetting, setViewSetting] = useState<any>({
    showComponent: {
      btnCancel: false, // Button Hủy
      btnRefuse: false, // Button Từ chối
      btnApprove: false, // Button phê duyệt
      btnExpertise: false, // Button Thẩm định
      btnAttachFile: false, // Button Dinh kem tep
      btnSendRequest: false, // Button Gửi yêu cầu
      btnNotApprove: false, // Button Không phê duyệt
      stateProcess: false, // Button trang thai
    },
  });
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    getTaxTemplate();
    getSocialInfoData();
  }, []);

  const getSocialInfoData = async () => {
    setLoading(true);
    const requestConfig = getRequestConfigurationsWithCulture();
    const getInfoDetail = axios.get(
      `${process.env.REACT_APP_REQUEST_SERVICE_URL}request/${requestId}`,
      requestConfig
    );
    Promise.allSettled([getInfoDetail])
      .then((res: any) => {
        if (res && res[0].value) {
          let data = res[0].value.data.data;
          prepareDetailData(data);
          checkAuthorize(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
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

  const convertData = (value: any, type = "") => {
    if (!value) return "";
    if (typeof value == "object" && value.name) {
      return {
        value: value.id,
        label: value.name,
      };
    } else if (type == "date" && value.indexOf("-") != -1) {
      return moment(value, "YYYY-MM-DD").format("DD/MM/YYYY");
    } else if (typeof value == "string" || typeof value == "number")
      return value;
    return "";
  };

  const convertMemberFamily = (value: any) => {
    if (!value) return {};
    const result: ITaxMemberInfo = {
      fullName: value.fullName,
      relation: {
        value: value.relationshipCode,
        label: value.relationshipText,
      },
      fromDate: convertData(value.fromDate, "date") as string,
      toDate: convertData(value.toDate, "date") as string,
    };
    return result;
  };

  const prepareDetailData = (requestInfo: any) => {
    //address data
    let _oldData = { ...oldData },
      _data = { ...data },
      _dataChange: any = {};
    const extractRequestInfo = JSON.parse(requestInfo.requestInfo) || {};
    //type
    _oldData.typeRequest = convertData(
      extractRequestInfo.type
    ) as IDropdownValue;
    //income type
    if (requestInfo?.taxSettlement?.authorizationTypeInfo) {
      _oldData.incomeType = convertData(JSON.parse(requestInfo?.taxSettlement.authorizationTypeInfo)) as IDropdownValue;
    }
    _oldData.PitNo = convertData(extractRequestInfo.taxCode.old) as string;
    _data.PitNo = convertData(extractRequestInfo.taxCode.new) as string;
    _dataChange.PitNo = extractRequestInfo.taxCode.displayType;
    _dataChange.PitNo_value = _data.PitNo;

    _oldData.dependentNumber = convertData(
      extractRequestInfo.numberOfDependents.old
    ) as string;
    _data.dependentNumber = convertData(
      extractRequestInfo.numberOfDependents.new
    ) as string;
    _dataChange.dependentNumber =
      extractRequestInfo.numberOfDependents.displayType;
    _dataChange.dependentNumber_value = _data.dependentNumber;

    _oldData.email = convertData(extractRequestInfo.userEmail.old) as string;
    _data.email = convertData(extractRequestInfo.userEmail.new) as string;
    _dataChange.email = extractRequestInfo.userEmail.displayType;
    _dataChange.email_value = _data.email;

    _oldData.address = convertData(
      extractRequestInfo.userAddress.old
    ) as string;
    _data.address = convertData(extractRequestInfo.userAddress.new) as string;
    _dataChange.address = extractRequestInfo.userAddress.displayType;
    _dataChange.address_value = _data.address;

    _oldData.idNumber = convertData(extractRequestInfo.idNumber.old) as string;
    _data.idNumber = convertData(extractRequestInfo.idNumber.new) as string;
    _dataChange.idNumber = extractRequestInfo.idNumber.displayType;
    _dataChange.idNumber_value = _data.idNumber;

    _oldData.dateIssue = convertData(
      extractRequestInfo.userDateOfIssue.old,
      "date"
    ) as string;
    _data.dateIssue = convertData(
      extractRequestInfo.userDateOfIssue.new,
      "date"
    ) as string;
    _dataChange.dateIssue = extractRequestInfo.userDateOfIssue.displayType;
    _dataChange.dateIssue_value = _data.dateIssue;

    _oldData.placeIssue = convertData(
      extractRequestInfo.userPlaceOfIssue.old
    ) as string;
    _data.placeIssue = convertData(
      extractRequestInfo.userPlaceOfIssue.new
    ) as string;
    _dataChange.placeIssue = extractRequestInfo.userPlaceOfIssue.displayType;
    _dataChange.placeIssue_value = _data.placeIssue;

    //family
    const _oldmember: any = [],
      _memberChange: any = [];
    const familyData = extractRequestInfo.familyDatas || [];

    _.sortBy(familyData, "order").map((familyItem) => {
      const displayType = parseInt(familyItem.displayType);
      if (displayType != STATUS.NEW) {
        _oldmember.push(convertMemberFamily(familyItem.oldFamily));
      }
      _memberChange.push({
        status: displayType,
        value: convertMemberFamily(familyItem.family),
      });
    });
    setData(_data);
    setOldData(_oldData);
    setChangeData({
      data: _dataChange,
      member: _memberChange,
    });
    setOldMembers(_oldmember);
    // setLastModified({
    //     date: requestInfo.socialInsuranceInfo?.updatedDate ? moment(requestInfo.socialInsuranceInfo?.updatedDate).format('DD/MM/YYYY HH:mm:ss') : '',
    //     by: requestInfo.socialInsuranceInfo?.updatedInfo ? JSON.parse(requestInfo.socialInsuranceInfo?.updatedInfo).account?.replace('@vingroup.net', '') : ''
    // })

    //appraiser
    const requestAppraisers = requestInfo?.requestAppraisers;
    let dateAppraiser = null;

    if (requestAppraisers?.length > 0) {
      const _supervisors: any = [];
      requestAppraisers.map((item) => {
        const _itemInfo: any = JSON.parse(item.appraiserInfo);
        if (_itemInfo.type === Constants.STATUS_PROPOSAL.LEADER_APPRAISER) {
          _supervisors.push({
            ..._itemInfo,
            uid: _itemInfo?.employeeNo,
            employeeNo: _itemInfo?.employeeNo,
            requestHistoryId: item.requestHistoryId,
            appraiserComment: item?.appraiserComment,
            appraisalDate: item.appraisalDate,
          });
          dateAppraiser = item.appraisalDate
            ? item.appraisalDate
            : dateAppraiser;
        }
      });
      setSupervisors(_supervisors);
    }
    // CBLĐ phê duyệt
    if (requestAppraisers?.length > 0) {
      const [approverRes, approverArriveRes] = requestAppraisers.filter(
          (ele) => ele.type === Constants.STATUS_PROPOSAL.CONSENTER
        ),
        approvalData = JSON.parse(approverRes?.appraiserInfo || "{}");
      setApprover({
        ...approvalData,
        uid: approvalData?.employeeNo,
        employeeNo: approvalData?.employeeNo,
        appraiserComment: approverRes?.appraiserComment,
      });
    }

    const requestDocuments =
      (requestInfo?.userProfileDocuments || []).map((u) => ({
        id: u.id,
        name: u.fileName,
        fileUrl: u.fileUrl,
      })) || [];

    setFiles(requestDocuments);
    setTimerRequest({
      createDate: requestInfo.createdDate,
      approvedDate: requestInfo.approvedDate,
      assessedDate: dateAppraiser,
    });
    if (requestInfo?.taxSettlement) {
      setUserInfo(JSON.parse(requestInfo.taxSettlement.employeeInfo));
    }
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

  const showStatus = (status, hasAppraiser) => {
    if (action == "request") {
      return Constants.mappingStatusRequest[status]?.label;
    }
    return action == "assess" && status == 5 && hasAppraiser
      ? Constants.mappingStatusRequest[20].label
      : Constants.mappingStatusRequest[status]?.label;
  };

  const checkAuthorize = (data: any) => {
    const currentEmail = localStorage.getItem("email") || "",
      { requestAppraisers, processStatusId } = data,
      hasAppraiser = requestAppraisers.some(
        (app) => app.type == Constants.STATUS_PROPOSAL.LEADER_APPRAISER
      ),
      indexAppraiser = requestAppraisers?.findIndex(
        (app: any) => app.status === Constants.SALARY_APPRAISER_STATUS.WAITING
      ),
      isCurrentAppraiser =
        indexAppraiser !== -1 &&
        currentEmail.toLowerCase() ===
          requestAppraisers[indexAppraiser].appraiserId?.toLowerCase(),
      typeAppraise =
        indexAppraiser !== -1 && requestAppraisers[indexAppraiser].type;

    let viewSettingTmp = { ...viewSetting };

    viewSettingTmp.showComponent.stateProcess = true;
    viewSettingTmp.showComponent.processStatusId = processStatusId;
    viewSettingTmp.showComponent.processLabel = showStatus(
      processStatusId,
      hasAppraiser
    );

    switch (processStatusId) {
      case 8: // Đang chờ CBQL Cấp cơ sở thẩm định
        if (isCurrentAppraiser && action === "assess") {
          viewSettingTmp.showComponent.btnRefuse = true;
          viewSettingTmp.showComponent.btnExpertise = true;
        } else if (action !== "request") {
          //currentStatus = 20;
        }
        break;
      case 5: // Đang chờ CBLĐ phê duyệt
        if (isCurrentAppraiser && action === "approval") {
          viewSettingTmp.showComponent.btnApprove = true;
          viewSettingTmp.showComponent.btnNotApprove = true;
        }
        break;
      case 2: // View phe duyet thanh cong
      // viewSettingTmp.disableComponent.showEye = true;
      // break;
      case 7: // Case từ chối
      // viewSettingTmp.disableComponent.showEye = true;
      // break;
      case 1: // Case không phê duyệt
        break;
      default:
        break;
    }

    setViewSetting(viewSettingTmp);
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
      <div className="health-info-page registration-section">
        <DetailTaxFinalizationComponent
          t={t}
          data={oldData}
          lastModified={lastModified}
          change={changeData}
          supervisors={supervisors}
          approver={approver}
          files={files}
          members={oldMembers}
          onSubmit={() => {}}
          isCreateMode={false}
          timeRequest={timeRequest}
          templates={templates}
          userInfo={useInfo}
        />
        <div className="mv-10" />
        <InsuranceApproveActionButtons
          showComponent={viewSetting.showComponent}
          t={t}
          id={requestId}
          requestTypeId={Constants.TAX_FINALIZATION}
        />
      </div>
    </>
  );
};
export default withTranslation()(DetailTaxFinalization);
