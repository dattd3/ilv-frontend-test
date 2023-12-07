import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next';
import Select from 'react-select'
import CreateConvalesInsurance from './CreateConvalesInsurance';
import CreateMaternityInsurance from './CreateMaternityInsurance';
import CreateSickInsurance from './CreateSickInsurance';
import moment from 'moment';
import axios from 'axios';
import { exportToPDF, getMuleSoftHeaderConfigurations, getRequestConfigurations } from '../../../commons/Utils';
import { toast } from "react-toastify";
import LoadingModal from '../../../components/Common/LoadingModal';
import { Image } from 'react-bootstrap';
import HOCComponent from '../../../components/Common/HOCComponent'
import { UPDATE_KEYS_MAP } from '../InsuranceComponents/InsuranceData';

const ExportInsuranceSocial = (props) => {
    const { t } = props;
    const InsuranceOptions = [
        { value: 1, label: 'Ốm đau' },
        { value: 2, label: 'Thai sản' },
        { value: 3, label: 'Dưỡng sức' }
    ];
    const [type, setType] = useState(null);
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
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        socialId: '',
        healthId: '',
        IndentifiD: '',
        employeeNo: ''
    });

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
            }
        })
            .catch(err => {
                setLoading(false);
                console.log(err);
            })
    }, []);

    const prepareDetailData = (_data) => {
        const infoDetail = _data.benefitClaim || {};
        const requestInfoChange = JSON.parse(infoDetail.requestInfo || '{}');
        let result = {};
        if (infoDetail.claimType == 3) {
            setType({ value: 3, label: 'Dưỡng sức' });
            const receiveBenefitsUnitInfo = infoDetail.receiveBenefitsUnitInfo ? JSON.parse(infoDetail.receiveBenefitsUnitInfo) : {};
            const inspectionDataInfo = infoDetail.inspectionDataInfo ? JSON.parse(infoDetail.inspectionDataInfo) : {}
            const receiveSubsidiesInfo = infoDetail.receiveSubsidiesInfo ? JSON.parse(infoDetail.receiveSubsidiesInfo) : {};
            result = {
                ...data,
                convalesData: {
                    hrComment: infoDetail.hrComment,
                    updatedKeys: JSON.parse(infoDetail.updatedKeys || '[]'),
                    socialId: infoDetail.insuranceNumber || '',
                    healthId: '',
                    fullName: infoDetail.fullName || '',
                    employeeNo: infoDetail.employeeCode || '',
                    IndentifiD: infoDetail.idNumber || '',
                    declareForm: infoDetail.formTypeInfo ? JSON.parse(infoDetail.formTypeInfo).name : '',
                    dateRequest: infoDetail.recommendEnjoyDate ? moment(infoDetail.recommendEnjoyDate).format('DD/MM/YYYY') : '',
                    dateLastResolved: infoDetail.solvedFirstDate ? moment(infoDetail.solvedFirstDate).format('DD/MM/YYYY') : '',
                    plan: infoDetail.planInfo ? JSON.parse(infoDetail.planInfo).name : '',
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
                    receiveType: receiveSubsidiesInfo.receivingForm || '',
                    accountNumber: receiveSubsidiesInfo.bankAccountNumber || '',
                    accountName: receiveSubsidiesInfo.accountName || '',
                    bankId: receiveSubsidiesInfo.bankCode || '',
                    bankName: receiveSubsidiesInfo.bankName || ''
                },
            };
            result = fillDataChange(result, 'convalesData', infoDetail.updatedKeys, requestInfoChange);

        } else if (infoDetail.claimType == 2) {
            setType({ value: 2, label: 'Thai sản' });
            const childrenDataInfo = infoDetail.childrenDataInfo ? JSON.parse(infoDetail.childrenDataInfo) : {};
            const certificateInsuranceBenefit = infoDetail.certificateInsuranceBenefit ? JSON.parse(infoDetail.certificateInsuranceBenefit) : {}
            const motherDataInfo = infoDetail.motherDataInfo ? JSON.parse(infoDetail.motherDataInfo) : {};
            const receiveSubsidiesInfo = infoDetail.receiveSubsidiesInfo ? JSON.parse(infoDetail.receiveSubsidiesInfo) : {};
            result = {
                ...data,
                maternityData: {
                    hrComment: infoDetail.hrComment,
                    updatedKeys: JSON.parse(infoDetail.updatedKeys || '[]'),
                    socialId: infoDetail.insuranceNumber || '',
                    healthId: '',
                    fullName: infoDetail.fullName || '',
                    employeeNo: infoDetail.employeeCode || '',
                    IndentifiD: infoDetail.idNumber || '',
                    declareForm: infoDetail.formTypeInfo ? JSON.parse(infoDetail.formTypeInfo).name : '',
                    maternityRegime: infoDetail.maternityRegimeInfo ? JSON.parse(infoDetail.maternityRegimeInfo).name : '',
                    dateRequest: infoDetail.recommendEnjoyDate ? moment(infoDetail.recommendEnjoyDate).format('DD/MM/YYYY') : '',
                    dateLastResolved: infoDetail.solvedFirstDate ? moment(infoDetail.solvedFirstDate).format('DD/MM/YYYY') : '',
                    maternityCondition: infoDetail.pregnancyCheckUpInfo ? JSON.parse(infoDetail.pregnancyCheckUpInfo).name : '',
                    birthCondition: infoDetail.conditionsChildbirth ? JSON.parse(infoDetail.conditionsChildbirth).name : '',
                    raiserInsuranceNumber: infoDetail.nurturerInsuranceNumber || '',
                    dadCare: infoDetail.childcareLeaveInfo ? JSON.parse(infoDetail.childcareLeaveInfo).name : '',
                    plan: infoDetail.planInfo ? JSON.parse(infoDetail.planInfo).name : '',
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
                    maternityLeave: motherDataInfo.pregnancyVacation ? motherDataInfo.pregnancyVacation.name : '',
                    hasRainser: motherDataInfo.surrogacy ? motherDataInfo.surrogacy.name : '',
                    hasSurgery: motherDataInfo.surgeryOrPregnancy ? motherDataInfo.surgeryOrPregnancy.name : '',
                    momDeadDate: motherDataInfo.motherDiedDate ? moment(motherDataInfo.motherDiedDate).format('DD/MM/YYYY') : '',
                    resultDate: motherDataInfo.conclusionDate ? moment(motherDataInfo.conclusionDate).format('DD/MM/YYYY') : '',
                    assessment: motherDataInfo.medicalAssessmentFee || '',
                    resolveContent: infoDetail.settlementContent || '',
                    resolveDate: infoDetail.settlementPeriod ? moment(infoDetail.settlementPeriod).format('DD/MM/YYYY') : '',
                    addtionContent: infoDetail.additionalPhaseContent || '',
                    addtionDate: infoDetail.additionalPhasePeriod ? moment(infoDetail.additionalPhasePeriod).format('DD/MM/YYYY') : '',
                    receiveType: receiveSubsidiesInfo.receivingForm || '',
                    accountNumber: receiveSubsidiesInfo.bankAccountNumber || '',
                    accountName: receiveSubsidiesInfo.accountName || '',
                    bankId: receiveSubsidiesInfo.bankCode || '',
                    bankName: receiveSubsidiesInfo.bankName || ''
                }
            };
            result = fillDataChange(result, 'maternityData', infoDetail.updatedKeys, requestInfoChange);
            
        } else if (infoDetail.claimType == 1) {
            setType({ value: 1, label: 'Ốm đau' });
            const sickChildrenInfo = infoDetail.sickChildrenInfo ? JSON.parse(infoDetail.sickChildrenInfo) : {};
            const certificateInsuranceBenefit = infoDetail.certificateInsuranceBenefit ? JSON.parse(infoDetail.certificateInsuranceBenefit) : {}
            const workingConditionInfo = infoDetail.workingConditionInfo ? JSON.parse(infoDetail.workingConditionInfo) : {};
            const diagnosisDiseaseInfo = infoDetail.diagnosisDiseaseInfo ? JSON.parse(infoDetail.diagnosisDiseaseInfo) : {};
            const receiveSubsidiesInfo = infoDetail.receiveSubsidiesInfo ? JSON.parse(infoDetail.receiveSubsidiesInfo) : {};
            
            result = {
                ...data,
                sickData: {
                    hrComment: infoDetail.hrComment,
                    updatedKeys: JSON.parse(infoDetail.updatedKeys || '[]'),
                    socialId: infoDetail.insuranceNumber || '',
                    healthId: '',
                    fullName: infoDetail.fullName || '',
                    employeeNo: infoDetail.employeeCode || '',
                    IndentifiD: infoDetail.idNumber || '',
                    declareForm: infoDetail.formTypeInfo ? JSON.parse(infoDetail.formTypeInfo).name : '',
                    dateRequest: infoDetail.recommendEnjoyDate ? moment(infoDetail.recommendEnjoyDate).format('DD/MM/YYYY') : '',
                    dateLastResolved: infoDetail.solvedFirstDate ? moment(infoDetail.solvedFirstDate).format('DD/MM/YYYY') : '',
                    plan: infoDetail.planInfo ? JSON.parse(infoDetail.planInfo).name : '',
                    note: infoDetail.description || '',
                    workingCondition: workingConditionInfo.name || '',
                    leaveOfWeek: infoDetail.weeklyRestDay || '',
                    hospitalLine: certificateInsuranceBenefit.hospitalLine || '',
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
                    receiveType: receiveSubsidiesInfo.receivingForm || '',
                    accountNumber: receiveSubsidiesInfo.bankAccountNumber || '',
                    accountName: receiveSubsidiesInfo.accountName || '',
                    bankId: receiveSubsidiesInfo.bankCode,
                    bankName: receiveSubsidiesInfo.bankName
                }
            }
            result = fillDataChange(result, 'sickData', infoDetail.updatedKeys, requestInfoChange);
        }
        setData(result);
        setLoading(false);
    }

    const fillDataChange = (result, type,  updatedKeysString, requestInfoChange) => {
        const updatedKeys = JSON.parse(updatedKeysString || '[]');
        const clientMapping = [];
        Object.keys(UPDATE_KEYS_MAP).map(keyClient => {
            if(keyClient.startsWith(type) && updatedKeys.includes(UPDATE_KEYS_MAP[keyClient])) {
                clientMapping.push({client: keyClient, be: UPDATE_KEYS_MAP[keyClient]});
            }
        });
        clientMapping.map(mapping => {
            if(mapping.client && mapping.be) {
                let valueBE = _.get(requestInfoChange, mapping.be);
                if(typeof valueBE == 'string') {
                    if(moment(valueBE).isValid()) {
                        valueBE = moment(valueBE).format('DD/MM/YYYY')
                    } else if(valueBE.indexOf('{') != -1){ //check is JSON
                        try {
                            valueBE = JSON.parse(valueBE);
                        }catch(err) {}
                    }
                }
                if(typeof valueBE == 'object') {
                    valueBE = valueBE.name;
                } 
                _.set(result, mapping.client, valueBE);
            }
        })
        return result;
    }

    const handleTextInputChange = (e, name, subName) => {
        const candidateInfos = { ...data }
        candidateInfos[name][subName] = e != null ? e.target.value : "";
        //setData(candidateInfos);
    }

    const handleChangeSelectInputs = (e, name, subName) => {
        const candidateInfos = { ...data }
        candidateInfos[name][subName] = e != null ? { value: e.value, label: e.label } : {}
        //setData(candidateInfos);
    }

    const handleDatePickerInputChange = (value, name, subname) => {
        const candidateInfos = { ...data }
        if (moment(value, 'DD/MM/YYYY').isValid()) {
            const date = moment(value).format('DD/MM/YYYY')
            candidateInfos[name][subname] = date

        } else {
            candidateInfos[name][subname] = null
        }
        //setData(candidateInfos)
    }

    const onSubmit = (data) => {
        setdisabledSubmitButton(true);
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_HRDX_URL}api/BenefitClaim`,
            data: data,
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response && response.data && response.data.result && response.data.result.code == 200) {
                    showStatusModal(t("Successful"), t("RequestSent"), true)
                    setdisabledSubmitButton(false)
                }
                else {
                    notifyMessage(response.data.result.message || t("Error"))
                    setdisabledSubmitButton(false)
                }
            })
            .catch(response => {
                notifyMessage(t("Error"));
                setdisabledSubmitButton(false);
            })
    }

    const notifyMessage = (message, isError = true) => {
        if (isError) {
            toast.error(message, {
                onClose: () => {
                }
            });
        } else {
            toast.success(message, {
                onClose: () => {
                }
            })
        }
    }

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

    const exportToPDF1 = (type, name) => {
        const elementView = document.getElementById('frame-for-export')
        exportToPDF(elementView, `BHXH_${type}`, false)
    }
    return (
        <div className="registration-insurance-section">
            <LoadingModal show={loading} />
            <div className="block-buttons">
            <button className="btn-download download-pdf" onClick={() => exportToPDF1(type?.label || '')}>Tải PDF</button>
            </div>
            <div id="frame-for-export">
            {
                type?.value == 1 ?
                    <CreateSickInsurance type={type} setType={setType}
                        data={data.sickData}
                        errors={errors.sickData}
                        userInfo={userInfo}
                        disabledSubmitButton={disabledSubmitButton}
                        handleTextInputChange={(e, key) => handleTextInputChange(e, 'sickData', key)}
                        handleChangeSelectInputs={(e, key) => handleChangeSelectInputs(e, 'sickData', key)}
                        handleDatePickerInputChange={(value, key) => handleDatePickerInputChange(value, 'sickData', key)}
                        onSend={(data) => onSubmit(data)}
                        notifyMessage={notifyMessage}
                    />
                    : type?.value == 2 ?
                        <CreateMaternityInsurance type={type} setType={setType}
                            data={data.maternityData}
                            errors={errors.maternityData}
                            userInfo={userInfo}
                            disabledSubmitButton={disabledSubmitButton}
                            handleTextInputChange={(e, key) => handleTextInputChange(e, 'maternityData', key)}
                            handleChangeSelectInputs={(e, key) => handleChangeSelectInputs(e, 'maternityData', key)}
                            handleDatePickerInputChange={(value, key) => handleDatePickerInputChange(value, 'maternityData', key)}
                            onSend={(data) => onSubmit(data)}
                            notifyMessage={notifyMessage} />
                        : type?.value == 3 ?
                            <CreateConvalesInsurance type={type} setType={setType}
                                data={data.convalesData}
                                userInfo={userInfo}
                                errors={errors.convalesData}
                                disabledSubmitButton={disabledSubmitButton}
                                handleTextInputChange={(e, key) => handleTextInputChange(e, 'convalesData', key)}
                                handleChangeSelectInputs={(e, key) => handleChangeSelectInputs(e, 'convalesData', key)}
                                handleDatePickerInputChange={(value, key) => handleDatePickerInputChange(value, 'convalesData', key)}
                                onSend={(data) => onSubmit(data)}
                                notifyMessage={notifyMessage} />
                            : null
            }
            </div>

        </div>
    )
}

export default HOCComponent(withTranslation()(ExportInsuranceSocial))
