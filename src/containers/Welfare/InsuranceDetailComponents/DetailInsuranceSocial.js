import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next';
import Select from 'react-select'
import CreateConvalesInsurance from '../InsuranceComponents/CreateConvalesInsurance';
import CreateMaternityInsurance from '../InsuranceComponents/CreateMaternityInsurance';
import CreateSickInsurance from '../InsuranceComponents/CreateSickInsurance';
import moment from 'moment';
import axios from 'axios';
import { getMuleSoftHeaderConfigurations, getRequestConfigurations, removeAccents } from '../../../commons/Utils';
import { toast } from "react-toastify";
import ResultModal from '../../Registration/ResultModal';
import HOCComponent from '../../../components/Common/HOCComponent'
import Constants from '../../../commons/Constants';
import LoadingModal from 'components/Common/LoadingModal';
import InsuranceApproveActionButtons from '../InsuranceComponents/InsuranceApproveActionButtons';
import ProcessHistoryComponent from 'containers/WorkflowManagement/DepartmentManagement/ProposalManagement/ProcessHistoryComponent';

const DetailInsuranceSocial = (props) => {
    const { t } = props;
    const { id, action } = props?.match?.params;
    
    const InsuranceOptions = [
        {
            label: t('sick'),
            value: 1,
          },
          {
            label: t('maternity'),
            value: 2,
          },
          {
            label: t('convales'),
            value: 3,
          },
    ];
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState(null);
    const [timeRequest, setTimerRequest] = useState({});
    const [data, setData] = useState({
        sickData: {
            declareForm: null,
            dateRequest: null,
            dateLastResolved: null,
            plan: null,
            note: '',
            workingCondition: null,
            leaveOfWeek: '',
            hospitalLine: null,
            seri: '',
            fromDate: null,
            toDate: null,
            total: '',
            childBirth: null,
            childInsuranceNumber: '',
            childSickNumbers: '',
            sickId: '',
            sickName: '',
            resolveContent: '',
            resolveDate: null,
            addtionContent: '',
            addtionDate: null,
            receiveType: null,
            accountNumber: '',
            accountName: '',
            bankId: '',
            bankName: ''
        },
        convalesData: {
            declareForm: null,
            dateRequest: null,
            dateLastResolved: null,
            plan: null,
            note: '',
            startWork: null,
            seri: '',
            fromDate: null,
            toDate: null,
            total: '',
            declineRate: '',
            assessmentDate: null,
            resolveContent: '',
            resolveDate: null,
            addtionContent: '',
            addtionDate: null,
            receiveType: null,
            accountNumber: '',
            accountName: '',
            bankId: '',
            bankName: ''
        },
        maternityData: {
            declareForm: null,
            maternityRegime: null,
            dateRequest: null,
            dateLastResolved: null,
            maternityCondition: null,
            birthCondition: null,
            raiserInsuranceNumber: '',
            dadCare: null,
            plan: null,
            reason: '',
            note: '',
            leaveOfWeek: '',
            startWork: null,
            seri: '',
            fromDate: null,
            toDate: null,
            total: '',
            childInsuranceNumber: '',
            childHealthNumber: '',
            age: '',
            childBirth: null,
            childDead: null,
            childNumbers: '',
            childDeadNumbers: '',
            childReceiveDate: null,
            childRaiseDate: null,
            momInsuranceNumber: '',
            momHealthNumber: '',
            momIdNumber: '',
            maternityLeave: null,
            hasRainser: null,
            hasSurgery: null,
            momDeadDate: null,
            resultDate: null,
            assessment: '',
            resolveContent: '',
            resolveDate: null,
            addtionContent: '',
            addtionDate: null,
            receiveType: null,
            accountNumber: '',
            accountName: '',
            bankId: '',
            bankName: ''
        },

    });

    const [viewSetting, setViewSetting] = useState({
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
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        socialId: '',
        healthId: '',
        IndentifiD: '',
        employeeNo: ''
    });
    const [supervisors, setSupervisors] = useState([]);
    const [approver, setApprover] = useState(null); // CBLĐ phê duyệt
    const [files, updateFiles] = useState([]);
    const [errors, setErrors] = useState({
        sickData: {

        },
        convalesData: {

        },
        maternityData: {

        }
    });
    const [resultModal, setresultModal] = useState({
        isShowStatusModal: false, titleModal: '', messageModal: '', isSuccess: false
    });
    const [disabledSubmitButton, setdisabledSubmitButton] = useState(false);

    useEffect(() => {
        setLoading(true);
        const requestId = props.match.params.id;
        const requestConfig = getRequestConfigurations();
        const getInfoDetail = axios.get(`${process.env.REACT_APP_REQUEST_SERVICE_URL}request/${requestId}`, requestConfig)
        Promise.allSettled([ getInfoDetail]).then(res => {
            if (res && res[0].value) {
                let infoDetail = res[0].value.data.data;
                prepareDetailData(infoDetail);
                setLoading(false);
            }
        })
        .catch(err => {
            setLoading(false);
            console.log(err);
        })
    }, []);

    const convertFormalDropdrowValue =(jsonString) => {
        if(!jsonString) return null;
        try{
            if(jsonString && typeof jsonString == 'string' && JSON.parse(jsonString)?.name) {
                return {value: JSON.parse(jsonString).id, label: JSON.parse(jsonString).name};
            }
        } catch(err) {
            return null;
        }
        if(typeof jsonString == 'object') return {value: jsonString.id, label: jsonString.name};;
        return null;
    }

    const prepareDetailData = (data) => {
        const infoDetail = data.benefitClaim;
        const requestInfo = JSON.parse(data.requestInfo || '{}');
        setUserInfo({
            socialId: infoDetail.insuranceNumber || '',
            healthId: '',
            fullName: infoDetail.fullName || '',
            employeeNo: infoDetail.employeeCode || '',
            IndentifiD: infoDetail.idNumber || '',
        })
        setTimerRequest({
          createdDate: data.createdDate,
          approvedDate: data.approvedDate
        })
        setType(InsuranceOptions.find(is => is.value == infoDetail.claimType));
        if (infoDetail.claimType == 3) {
            const receiveBenefitsUnitInfo = infoDetail.receiveBenefitsUnitInfo ? JSON.parse(infoDetail.receiveBenefitsUnitInfo) : {};
            const inspectionDataInfo = infoDetail.inspectionDataInfo ? JSON.parse(infoDetail.inspectionDataInfo) : {}
            const receiveSubsidiesInfo = infoDetail.receiveSubsidiesInfo ? JSON.parse(infoDetail.receiveSubsidiesInfo) : {};
            setData({
                ...data,
                convalesData: {
                    hrComment: requestInfo.hrComment,
                    updatedKeys: JSON.parse(requestInfo.updatedKeys || '[]'),
                    declareForm: convertFormalDropdrowValue(infoDetail.formTypeInfo),
                    dateRequest: infoDetail.recommendEnjoyDate ? moment(infoDetail.recommendEnjoyDate).format('DD/MM/YYYY') : '',
                    dateLastResolved: infoDetail.solvedFirstDate ? moment(infoDetail.solvedFirstDate).format('DD/MM/YYYY') : '',
                    plan: convertFormalDropdrowValue(infoDetail.planInfo),
                    note: infoDetail.description || '',
                    startWork: infoDetail.backToWorkDate ? moment(infoDetail.backToWorkDate).format('DD/MM/YYYY') : '',
                    seri: receiveBenefitsUnitInfo.seriNumber || '',
                    fromDate: receiveBenefitsUnitInfo.fromDate ? moment(receiveBenefitsUnitInfo.fromDate).format('DD/MM/YYYY') : '',
                    toDate: receiveBenefitsUnitInfo.toDate ? moment(receiveBenefitsUnitInfo.toDate).format('DD/MM/YYYY') : '',
                    total: receiveBenefitsUnitInfo.total || '',
                    declineRate: inspectionDataInfo.rateOfDecline || '',
                    assessmentDate: inspectionDataInfo.inspectionDate ? moment(inspectionDataInfo.inspectionDate).format('DD/MM/YYYY') : '',
                    resolveContent: infoDetail.settlementContent || '',
                    resolveDate: infoDetail.settlementPeriod ? moment(infoDetail.settlementPeriod).format('DD/MM/YYYY') : '',
                    addtionContent: infoDetail.additionalPhaseContent || '',
                    addtionDate: infoDetail.additionalPhasePeriod ? moment(infoDetail.additionalPhasePeriod).format('DD/MM/YYYY') : '',
                    receiveType: convertFormalDropdrowValue(receiveSubsidiesInfo.receivingForm),
                    accountNumber: receiveSubsidiesInfo.bankAccountNumber || '',
                    accountName: receiveSubsidiesInfo.accountName || '',
                    bankId: receiveSubsidiesInfo.bankCode || '',
                    bankName: receiveSubsidiesInfo.bankName || ''
                },
            })

        } else if (infoDetail.claimType == 2) {
            const childrenDataInfo = infoDetail.childrenDataInfo ? JSON.parse(infoDetail.childrenDataInfo) : {};
            const certificateInsuranceBenefit = infoDetail.certificateInsuranceBenefit ? JSON.parse(infoDetail.certificateInsuranceBenefit) : {}
            const motherDataInfo = infoDetail.motherDataInfo ? JSON.parse(infoDetail.motherDataInfo) : {};
            const receiveSubsidiesInfo = infoDetail.receiveSubsidiesInfo ? JSON.parse(infoDetail.receiveSubsidiesInfo) : {};

            setData({
                ...data,
                maternityData: {
                    hrComment: requestInfo.hrComment,
                    updatedKeys: JSON.parse(requestInfo.updatedKeys || '[]'),
                    declareForm: convertFormalDropdrowValue(infoDetail.formTypeInfo),
                    maternityRegime: convertFormalDropdrowValue(infoDetail.maternityRegimeInfo),
                    dateRequest: infoDetail.recommendEnjoyDate ? moment(infoDetail.recommendEnjoyDate).format('DD/MM/YYYY') : '',
                    dateLastResolved: infoDetail.solvedFirstDate ? moment(infoDetail.solvedFirstDate).format('DD/MM/YYYY') : '',
                    maternityCondition: convertFormalDropdrowValue(infoDetail.pregnancyCheckUpInfo),
                    birthCondition: convertFormalDropdrowValue(infoDetail.conditionsChildbirth),
                    raiserInsuranceNumber: infoDetail.nurturerInsuranceNumber || '',
                    dadCare: convertFormalDropdrowValue(infoDetail.childcareLeaveInfo),
                    plan: convertFormalDropdrowValue(infoDetail.planInfo),
                    reason: infoDetail.reasonRequestingAdjustment || '',
                    note:  infoDetail.description || '',
                    leaveOfWeek: infoDetail.weeklyRestDay || '',
                    startWork: infoDetail.backToWorkDate ? moment(infoDetail.backToWorkDate).format('DD/MM/YYYY') : '',
                    seri: certificateInsuranceBenefit.seriNumber || '',
                    fromDate: certificateInsuranceBenefit.fromDate ? moment(certificateInsuranceBenefit.fromDate).format('DD/MM/YYYY') : '',
                    toDate: certificateInsuranceBenefit.toDate ? moment(certificateInsuranceBenefit.toDate).format('DD/MM/YYYY') : '',
                    total: certificateInsuranceBenefit.total || '',
                    childInsuranceNumber: childrenDataInfo.socialInsuranceNumber || '',
                    childHealthNumber: childrenDataInfo.healthInsuranceNumber || '',
                    age: childrenDataInfo.ageOfFetus || '',
                    childBirth: childrenDataInfo.childDob ? moment(childrenDataInfo.childDob).format('DD/MM/YYYY') : '',
                    childDead: childrenDataInfo.childDiedDate ? moment(childrenDataInfo.childDiedDate).format('DD/MM/YYYY') : '',
                    childNumbers: childrenDataInfo.numberOfChildren || '',
                    childDeadNumbers: childrenDataInfo.numberOfDeadChildren || '',
                    childReceiveDate: childrenDataInfo.adoptionDate ? moment(childrenDataInfo.adoptionDate).format('DD/MM/YYYY') : '',
                    childRaiseDate: childrenDataInfo.dateReceivingBiologicalChild ? moment(childrenDataInfo.dateReceivingBiologicalChild).format('DD/MM/YYYY') : '',
                    momInsuranceNumber: motherDataInfo.socialInsuranceNumber || '',
                    momHealthNumber: motherDataInfo.healthInsuranceNumber || '',
                    momIdNumber: motherDataInfo.motherIdNumber || '',
                    maternityLeave: convertFormalDropdrowValue(motherDataInfo.pregnancyVacation),
                    hasRainser: convertFormalDropdrowValue(motherDataInfo.surrogacy),
                    hasSurgery: convertFormalDropdrowValue(motherDataInfo.surgeryOrPregnancy),
                    momDeadDate: motherDataInfo.motherDiedDate ? moment(motherDataInfo.motherDiedDate).format('DD/MM/YYYY') : '',
                    resultDate: motherDataInfo.conclusionDate ? moment(motherDataInfo.conclusionDate).format('DD/MM/YYYY') : '',
                    assessment: motherDataInfo.medicalAssessmentFee || '',
                    resolveContent: infoDetail.settlementContent || '',
                    resolveDate: infoDetail.settlementPeriod ? moment(infoDetail.settlementPeriod).format('DD/MM/YYYY') : '',
                    addtionContent: infoDetail.additionalPhaseContent || '',
                    addtionDate: infoDetail.additionalPhasePeriod ? moment(infoDetail.additionalPhasePeriod).format('DD/MM/YYYY') : '',
                    receiveType: convertFormalDropdrowValue(receiveSubsidiesInfo.receivingForm),
                    accountNumber: receiveSubsidiesInfo.bankAccountNumber || '',
                    accountName: receiveSubsidiesInfo.accountName || '',
                    bankId: receiveSubsidiesInfo.bankCode || '',
                    bankName: receiveSubsidiesInfo.bankName || ''
                }
            })
        } else if (infoDetail.claimType == 1) {
            const sickChildrenInfo = infoDetail.sickChildrenInfo ? JSON.parse(infoDetail.sickChildrenInfo) : {};
            const certificateInsuranceBenefit = infoDetail.certificateInsuranceBenefit ? JSON.parse(infoDetail.certificateInsuranceBenefit) : {}
            const diagnosisDiseaseInfo = infoDetail.diagnosisDiseaseInfo ? JSON.parse(infoDetail.diagnosisDiseaseInfo) : {};
            const receiveSubsidiesInfo = infoDetail.receiveSubsidiesInfo ? JSON.parse(infoDetail.receiveSubsidiesInfo) : {};
            setData({
                ...data,
                sickData: {
                    hrComment: requestInfo.hrComment,
                    updatedKeys: JSON.parse(requestInfo.updatedKeys || '[]'),
                    declareForm: convertFormalDropdrowValue(infoDetail.formTypeInfo),
                    dateRequest: infoDetail.recommendEnjoyDate ? moment(infoDetail.recommendEnjoyDate).format('DD/MM/YYYY') : '',
                    dateLastResolved: infoDetail.solvedFirstDate ? moment(infoDetail.solvedFirstDate).format('DD/MM/YYYY') : '',
                    plan: convertFormalDropdrowValue(infoDetail.planInfo),
                    note: infoDetail.description || '',
                    workingCondition: convertFormalDropdrowValue(infoDetail.workingConditionInfo),
                    leaveOfWeek: infoDetail.weeklyRestDay || '',
                    hospitalLine: convertFormalDropdrowValue(certificateInsuranceBenefit.hospitalLine),
                    seri: certificateInsuranceBenefit.seriNumber || '',
                    fromDate: certificateInsuranceBenefit.fromDate ? moment(certificateInsuranceBenefit.fromDate).format('DD/MM/YYYY') : '',
                    toDate: certificateInsuranceBenefit.toDate ? moment(certificateInsuranceBenefit.toDate).format('DD/MM/YYYY') : '',
                    total: certificateInsuranceBenefit.total || '',
                    childBirth: sickChildrenInfo.childDob ? moment(sickChildrenInfo.childDob).format('DD/MM/YYYY') : '',
                    childInsuranceNumber: sickChildrenInfo.healthInsuranceNumber || '',
                    childSickNumbers: sickChildrenInfo.sickChildrenNumber || '',
                    sickId: diagnosisDiseaseInfo.diseaseCode || '',
                    sickName: diagnosisDiseaseInfo.diseaseName || '',
                    resolveContent: infoDetail.settlementContent,
                    resolveDate: infoDetail.settlementPeriod ? moment(infoDetail.settlementPeriod).format('DD/MM/YYYY') : '',
                    addtionContent: infoDetail.additionalPhaseContent || '',
                    addtionDate: infoDetail.additionalPhasePeriod ? moment(infoDetail.additionalPhasePeriod).format('DD/MM/YYYY') : '',
                    receiveType: convertFormalDropdrowValue(receiveSubsidiesInfo.receivingForm),
                    accountNumber: receiveSubsidiesInfo.bankAccountNumber || '',
                    accountName: receiveSubsidiesInfo.accountName || '',
                    bankId: receiveSubsidiesInfo.bankCode,
                    bankName: receiveSubsidiesInfo.bankName
                }
            })
        }
        const requestAppraisers = data?.requestAppraisers;

        if (requestAppraisers?.length > 0) {
            const _supervisors = [];
            requestAppraisers.map((item) => {
              const _itemInfo = JSON.parse(item.appraiserInfo);
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
            (data?.userProfileDocuments || []).map((u) => ({
              id: u.id,
              name: u.fileName,
              fileUrl: u.fileUrl,
            })) || [];
      
        updateFiles(requestDocuments);
        checkAuthorize(data);
        setLoading(false);
    }

    const showStatus = (status, hasAppraiser) => {
      if (action == 'request') {
        return Constants.mappingStatusRequest[status]?.label;
      } 
      return (action == "assess" && status == 5 && hasAppraiser) ? Constants.mappingStatusRequest[20].label : Constants.mappingStatusRequest[status]?.label
    }

    const checkAuthorize = (data) => {
        const currentEmail = localStorage.getItem('email'),
          {
            requestAppraisers,
            processStatusId,
          } = data,
          hasAppraiser = requestAppraisers.some(app => app.type == Constants.STATUS_PROPOSAL.LEADER_APPRAISER),
          indexAppraiser = requestAppraisers?.findIndex(
            (app) => app.status === Constants.SALARY_APPRAISER_STATUS.WAITING
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

    const hideStatusModal = () => {
        setresultModal({
            isShowStatusModal: false
        })
        window.location.reload();
    }

    const showStatusModal = (title, message, isSuccess = false) => {
        setresultModal({
            isShowStatusModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess
        })
    };


    return (
        <div className="registration-insurance-section input-style">
            <ResultModal show={resultModal.isShowStatusModal} title={resultModal.titleModal} message={resultModal.messageModal} isSuccess={resultModal.isSuccess} onHide={hideStatusModal} />
            {
                type == null ?
                    <>
                        <LoadingModal show={loading}/>
                    </>
                    : type.value == 1 ?
                        <CreateSickInsurance type={type} setType={setType}
                            data={data.sickData}
                            errors={errors.sickData}
                            userInfo={userInfo}
                            disabledSubmitButton={disabledSubmitButton}
                            handleTextInputChange={(e, key) => {}}
                            handleChangeSelectInputs={(e, key) => {}}
                            handleDatePickerInputChange={(value, key) => {}}
                            onSend={(data) => {}}
                            notifyMessage={()=>{}}
                            supervisors={supervisors}
                            setSupervisors={setSupervisors}
                            approver={approver}
                            setApprover={setApprover}
                            updateFiles={()=>{}}
                            files={files}
                            removeFile={()=>{}}
                            isCreateMode={false} 
                        />
                        : type.value == 2 ?
                            <CreateMaternityInsurance type={type} setType={setType}
                                data={data.maternityData}
                                errors={errors.maternityData}
                                userInfo={userInfo}
                                disabledSubmitButton={disabledSubmitButton}
                                handleTextInputChange={(e, key) => {}}
                                handleChangeSelectInputs={(e, key) => {}}
                                handleDatePickerInputChange={(value, key) => {}}
                                onSend={(data) => {}}
                                notifyMessage={()=>{}}
                                supervisors={supervisors}
                                setSupervisors={setSupervisors}
                                approver={approver}
                                setApprover={setApprover}
                                updateFiles={()=>{}}
                                files={files}
                                removeFile={()=>{}}
                                isCreateMode={false} />
                            : type.value == 3 ?
                                <CreateConvalesInsurance type={type} setType={setType}
                                    data={data.convalesData}
                                    userInfo={userInfo}
                                    errors={errors.convalesData}
                                    disabledSubmitButton={disabledSubmitButton}
                                    handleTextInputChange={(e, key) => {}}
                                    handleChangeSelectInputs={(e, key) => {}}
                                    handleDatePickerInputChange={(value, key) => {}}
                                    onSend={(data) => {}}
                                    notifyMessage={()=>{}}
                                    supervisors={supervisors}
                                    setSupervisors={setSupervisors}
                                    approver={approver}
                                    setApprover={setApprover}
                                    updateFiles={()=>{}}
                                    files={files}
                                    removeFile={()=>{}}
                                    isCreateMode={false} />
                                : null
            }
            <h5 style={{paddingTop: '16px'}}>
              {t("RequestHistory").toUpperCase()}
            </h5>
            <div className="timesheet-section">
              <div className="timesheet-box1 timesheet-box shadow">
                <ProcessHistoryComponent
                  createdDate={timeRequest?.createdDate}
                  coordinatorDate={null}
                  requestAppraisers={supervisors}
                  approvedDate={timeRequest.approvedDate}
                />
              </div>
            </div>
            
            <InsuranceApproveActionButtons
                showComponent={viewSetting.showComponent}
                t={t}
                id={id}
            />



        </div>
    )
}

export default HOCComponent(withTranslation()(DetailInsuranceSocial))
