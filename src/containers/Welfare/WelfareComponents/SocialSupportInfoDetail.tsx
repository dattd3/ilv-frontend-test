import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import _ from "lodash";
import {
  ISocialSupportModel,
} from "models/welfare/SocialContributeModel";
import Constants from "commons/Constants";
import axios from "axios";
import ResultModal from "containers/Registration/ResultModal";
import LoadingModal from "components/Common/LoadingModal";
import InsuranceApproveActionButtons from "../InsuranceComponents/InsuranceApproveActionButtons";
import DetailSocailSupportComponent from "../InsuranceSocialSupport/DetailSocialSupportInfoComponent";
import { getRequestConfigurations } from "commons/Utils";

const SocialInfoDetailInfo = (props: any) => {
  const { t } = props;
  const action = props.match.params.type;
  const requestId = props.match.params.id;
  const [data, setData] = useState<ISocialSupportModel>({});
  const [supervisors, setSupervisors] = useState<any[]>([]);
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
    }
  });
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    getSocialInfoData();
    getTemplateFile();
  }, []);

  const getTemplateFile = async () => {
    try {
      const requestConfig = getRequestConfigurations();
      const getInfoDetail = await axios.post(`${process.env.REACT_APP_REQUEST_SERVICE_URL}common/getTemplateByTypes`, [1, 2, 3, 4, 5, 6, 7], requestConfig)
      if(getInfoDetail?.data?.data) {
        setTemplates(getInfoDetail.data.data);
      }
    } catch(error) {

    }
  }

  const getSocialInfoData = async () => {
    setLoading(true);
    const requestConfig = getRequestConfigurations();
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

  const prepareDetailData = (requestInfo: any) => {
    const extractRequestInfo = JSON.parse(requestInfo.requestInfo) || {};
    setData({
      type: {
        value: extractRequestInfo.typeId,
        label: extractRequestInfo.typeName
      }
    });

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
        <DetailSocailSupportComponent
        t={t}
        data={data}
        supervisors={supervisors}
        approver={approver}
        files={files}
        templates={templates}
        timeRequest={timeRequest}
        userInfo={useInfo}
        />
        <div className="mv-10"/>
        <InsuranceApproveActionButtons
                showComponent={viewSetting.showComponent}
                t={t}
                id={requestId}
                requestTypeId ={Constants.SOCIAL_SUPPORT}
            />
      </div>
    </>
  );
};
export default withTranslation()(SocialInfoDetailInfo);
