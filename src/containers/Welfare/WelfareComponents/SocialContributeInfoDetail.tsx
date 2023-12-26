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
import { getMuleSoftHeaderConfigurations, getRequestConfigurationsWithCulture } from "commons/Utils";
import { IDropdownValue } from "models/CommonModel";
import InsuranceApproveActionButtons from "../InsuranceComponents/InsuranceApproveActionButtons";
import ProcessHistoryComponent from "containers/WorkflowManagement/DepartmentManagement/ProposalManagement/ProcessHistoryComponent";

const SocialContributeDetailInfo = (props: any) => {
  const { t } = props;
  const action = props.match.params.type;
  const requestId = props.match.params.id;
  const [changeData, setChangeData] = useState<any>({});
  const [oldData, setOldData] = useState<ISocialContributeModel>({});
  const [data, setData] = useState<ISocialContributeModel>({});
  const [oldMembers, setOldMembers] = useState<IMemberInfo[]>([]);
  const [members, setMembers] = useState<IMemberInfo[]>([]);
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [lastModified, setLastModified] = useState<any>({});
  const [approver, setApprover] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [timeRequest, setTimerRequest] = useState<any>({});
  const [useInfo, setUserInfo] = useState<any>({});
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
    }
  });
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    getSocialInfoData();
  }, []);

  const getSocialInfoData = async () => {
    setLoading(true);
    const requestConfig = getRequestConfigurationsWithCulture();
    const getInfoDetail = axios.get(`${process.env.REACT_APP_REQUEST_SERVICE_URL}request/${requestId}`, requestConfig)
    Promise.allSettled([ getInfoDetail]).then((res: any) => {
        if (res && res[0].value) {
            let data = res[0].value.data.data;
            prepareDetailData(data);
            checkAuthorize(data);
            setLoading(false);
        }
    })
    .catch(err => {
        setLoading(false);
        console.log(err);
    })
  }

  const convertData = (value: any) => {
    if (!value) return "";
    if (typeof value == "object" && value.name) {
      return {
        value: value.id,
        label: value.name,
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
        identityId: convertData(value.idNumber) as IDropdownValue
    };
    return result;
  }

  const prepareDetailData = (requestInfo: any) => {
    //address data 
    let _oldData = {...oldData}, _data = {...data}, _dataChange: any={};
    const extractRequestInfo = JSON.parse(requestInfo.requestInfo) || {};
    const addressData = extractRequestInfo.addressData || {};
    _oldData.province = convertData(addressData.provinceData.oldProvince) as IDropdownValue;
    _data.province = convertData(addressData.provinceData.province) as IDropdownValue;
    _dataChange.province = addressData.provinceData.displayType
    _dataChange.province_value = _data.province

    _oldData.district = convertData(addressData.districtData.oldDistrict) as IDropdownValue;
    _data.district = convertData(addressData.districtData.district) as IDropdownValue;
    _dataChange.district = addressData.districtData.displayType
    _dataChange.district_value = _data.district

    _oldData.ward = convertData(addressData.wardData.oldWard) as IDropdownValue;
    _data.ward = convertData(addressData.wardData.ward) as IDropdownValue;
    _dataChange.ward = addressData.wardData.displayType
    _dataChange.ward_value = _data.ward

    _oldData.houseHoldNumber = convertData(addressData.householdBookNumberData.oldHouseholdBookNumber) as string;
    _data.houseHoldNumber = convertData(addressData.householdBookNumberData.householdBookNumber) as string;
    _dataChange.houseHoldNumber = addressData.householdBookNumberData.displayType
    _dataChange.houseHoldNumber_value = _data.houseHoldNumber

    _oldData.street = convertData(addressData.streetData.oldStreet) as string;
    _data.street = convertData(addressData.streetData.street) as string;
    _dataChange.street = addressData.streetData.displayType
    _dataChange.street_value = _data.street
    _oldData.socialNumberType = convertData(extractRequestInfo.socialInsuranceBookData.oldSocialInsuranceBook) as IDropdownValue;
    _data.socialNumberType = convertData(extractRequestInfo.socialInsuranceBookData.socialInsuranceBook) as IDropdownValue;
    _dataChange.socialNumberType = extractRequestInfo.socialInsuranceBookData.displayType
    _dataChange.socialNumberType_value = _data.socialNumberType

    _oldData.facilityRegisterName = convertData(extractRequestInfo.healthcarePlaceData.oldHealthcarePlace) as IDropdownValue;
    _data.facilityRegisterName = convertData(extractRequestInfo.healthcarePlaceData.healthcarePlace) as IDropdownValue;
    _dataChange.facilityRegisterName = extractRequestInfo.healthcarePlaceData.displayType
    _dataChange.facilityRegisterName_value = _data.facilityRegisterName
    
    _oldData.note = convertData(extractRequestInfo.noteData.oldNote) as string;
    _data.note = convertData(extractRequestInfo.noteData.note) as string;
    _dataChange.note = extractRequestInfo.noteData.displayType
    _dataChange.note_value = _data.note

    //family
    const _oldmember: any = [], _memberChange: any = []
    const familyData = extractRequestInfo.familyDatas || [];
    
    _.sortBy(familyData, 'order').map(familyItem => {
        const displayType = parseInt(familyItem.displayType);
        if(displayType != STATUS.NEW) {
            _oldmember.push(convertMemberFamily(familyItem.oldFamily));
        }
        _memberChange.push({
            status: displayType, value: convertMemberFamily(familyItem.family)
        })
    });
    setData(_data);
    setOldData(_oldData);
    setChangeData({
        data: _dataChange,
        member: _memberChange
    });
    setOldMembers(_oldmember);
    setLastModified({
        date: requestInfo.socialInsuranceInfo?.updatedDate ? moment(requestInfo.socialInsuranceInfo?.updatedDate).format('DD/MM/YYYY HH:mm:ss') : '',
        by: requestInfo.socialInsuranceInfo?.updatedInfo ? JSON.parse(requestInfo.socialInsuranceInfo?.updatedInfo).account?.replace('@vingroup.net', '') : ''
    })

    //appraiser
    const requestAppraisers = requestInfo?.requestAppraisers;
    let dateAppraiser = null;

        if (requestAppraisers?.length > 0) {
            const _supervisors: any = [];
            requestAppraisers.map((item) => {
              const _itemInfo: any = JSON.parse(item.appraiserInfo);
              if (
                _itemInfo.type === Constants.STATUS_PROPOSAL.LEADER_APPRAISER
              ) {
                _supervisors.push({
                  ..._itemInfo,
                  uid: _itemInfo?.employeeNo,
                  employeeNo: _itemInfo?.employeeNo,
                  requestHistoryId: item.requestHistoryId,
                  appraiserComment: item?.appraiserComment,
                  appraisalDate: item.appraisalDate
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
              approvalData = JSON.parse(approverRes?.appraiserInfo || '{}');
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
        if(requestInfo?.userInfo) {
          setUserInfo(JSON.parse(requestInfo.userInfo));
        }
  }


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
    if (action == 'request') {
      return Constants.mappingStatusRequest[status]?.label;
    } 
    return (action == "assess" && status == 5 && hasAppraiser) ? Constants.mappingStatusRequest[20].label : Constants.mappingStatusRequest[status]?.label
  }

  const checkAuthorize = (data: any) => {
    const currentEmail = localStorage.getItem('email') || '',
      {
        requestAppraisers,
        processStatusId,
      } = data,
      hasAppraiser = requestAppraisers.some(app => app.type == Constants.STATUS_PROPOSAL.LEADER_APPRAISER),
      indexAppraiser = requestAppraisers?.findIndex(
        (app: any) => app.status === Constants.SALARY_APPRAISER_STATUS.WAITING
      ),

      isCurrentAppraiser =
        indexAppraiser !== -1 &&
        currentEmail.toLowerCase() ===
          requestAppraisers[indexAppraiser].appraiserId?.toLowerCase(),
      typeAppraise =
        indexAppraiser !== -1 && requestAppraisers[indexAppraiser].type;

    let viewSettingTmp = { ...viewSetting};
        
    viewSettingTmp.showComponent.stateProcess = true;
    viewSettingTmp.showComponent.processStatusId = processStatusId;
    viewSettingTmp.showComponent.processLabel = showStatus(processStatusId, hasAppraiser);
    
    switch (processStatusId) {
      case 8: // Đang chờ CBQL Cấp cơ sở thẩm định
        if (isCurrentAppraiser && action === 'assess') {
            viewSettingTmp.showComponent.btnRefuse = true;
            viewSettingTmp.showComponent.btnExpertise = true;
        } else if (action !== 'request') {
          //currentStatus = 20;
        }
        break;
      case 5: // Đang chờ CBLĐ phê duyệt
        if (isCurrentAppraiser && action === 'approval') {
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
        <DetailSocailContributeComponent
        t={t}
        data={oldData}
        lastModified ={lastModified}
        change={changeData}
        supervisors={supervisors}
        approver={approver}
        files={files}
        members={oldMembers}
        onSubmit={() => {}}
        isCreateMode={false}
        timeRequest={timeRequest}
        userInfo={useInfo}
        />
        <div className="mv-10"/>
        <InsuranceApproveActionButtons
                showComponent={viewSetting.showComponent}
                t={t}
                id={requestId}
                requestTypeId ={Constants.INSURANCE_SOCIAL_INFO}
            />
      </div>
    </>
  );
};
export default withTranslation()(SocialContributeDetailInfo);
