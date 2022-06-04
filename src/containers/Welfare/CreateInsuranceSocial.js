import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next';
import Select from 'react-select'
import CreateConvalesInsurance from './InsuranceComponents/CreateConvalesInsurance';
import CreateMaternityInsurance from './InsuranceComponents/CreateMaternityInsurance';
import CreateSickInsurance from './InsuranceComponents/CreateSickInsurance';
import moment from 'moment';
import axios from 'axios';
import { getMuleSoftHeaderConfigurations } from '../../commons/Utils';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResultModal from '../Registration/ResultModal';
import Constants from '../../commons/Constants';

const CreateInsuranceSocial = (props) => {
    const { t } = props;
    const InsuranceOptions = [
        { value: 1, label: 'Ốm đau' },
        { value: 2, label: 'Thai sản' },
        { value: 3, label: 'Dưỡng sưc' }
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
        const muleSoftConfig = getMuleSoftHeaderConfigurations()
        const getProfile = axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/profile`, muleSoftConfig)
        const getPersionalInfo = axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/personalinfo`, muleSoftConfig);
        Promise.allSettled([getProfile, getPersionalInfo]).then(res => {
            if (res && res[0].value && res[1].value) {
                let userProfile = res[0].value.data.data[0];
                let userDetail = res[1].value.data.data[0];
                setUserInfo({
                    ...userInfo,
                    socialId: userProfile.insurance_number || '',
                    healthId: userProfile.health_insurance_number || '',
                    fullName: userProfile.fullname || '',
                    employeeNo: userProfile.uid || '',
                    IndentifiD: userDetail.personal_id_no || ''
                })
            }
        })
    }, []);

    const handleTextInputChange = (e, name, subName) => {
        const candidateInfos = { ...data }
        candidateInfos[name][subName] = e != null ? e.target.value : "";
        setData(candidateInfos);
    }

    const handleChangeSelectInputs = (e, name, subName) => {
        const candidateInfos = { ...data }
        candidateInfos[name][subName] = e != null ? { value: e.value, label: e.label } : {}
        setData(candidateInfos);
    }

    const handleDatePickerInputChange = (value, name, subname) => {
        const candidateInfos = { ...data }
        if (moment(value, 'DD/MM/YYYY').isValid()) {
            const date = moment(value).format('DD/MM/YYYY')
            candidateInfos[name][subname] = date

        } else {
            candidateInfos[name][subname] = null
        }
        setData(candidateInfos)
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
                    notifyMessage(response.data.result.message || "Có lỗi xảy ra trong quá trình cập nhật thông tin!")
                    setdisabledSubmitButton(false)
                }
            })
            .catch(response => {
                notifyMessage("Có lỗi xảy ra trong quá trình cập nhật thông tin!");
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


    return (
        <div className="registration-insurance-section">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <ResultModal show={resultModal.isShowStatusModal} title={resultModal.titleModal} message={resultModal.messageModal} isSuccess={resultModal.isSuccess} onHide={hideStatusModal} />
            {
                type == null ?
                    <>
                        <h5>YÊU CẦU BẢO HIỂM Y TẾ</h5>
                        <div className="box shadow cbnv">
                            <div className="row">
                                <div className="col-4">
                                    {"Loại yêu cầu"}<span className="required">(*)</span>
                                    <Select placeholder={"Lựa chọn loại hợp đồng"} options={InsuranceOptions} isClearable={false}
                                        value={type}
                                        onChange={e => setType(e)} className="input mv-10"
                                        styles={{ menu: provided => ({ ...provided, zIndex: 2 }) }} />
                                </div>
                            </div>
                        </div>
                    </>
                    : type.value == 1 ?
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
                        : type.value == 2 ?
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
                            : type.value == 3 ?
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
    )
}

export default withTranslation()(CreateInsuranceSocial);