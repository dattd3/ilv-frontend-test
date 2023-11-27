import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next';
import Select from 'react-select'
import CreateConvalesInsurance from './InsuranceComponents/CreateConvalesInsurance';
import CreateMaternityInsurance from './InsuranceComponents/CreateMaternityInsurance';
import CreateSickInsurance from './InsuranceComponents/CreateSickInsurance';
import moment from 'moment';
import axios from 'axios';
import { getMuleSoftHeaderConfigurations, getRequestConfigurations, removeAccents } from '../../commons/Utils';
import { toast } from "react-toastify";
import ResultModal from '../Registration/ResultModal';
import HOCComponent from '../../components/Common/HOCComponent'
import Constants from '../../commons/Constants';
import LoadingModal from 'components/Common/LoadingModal';

const CreateInsuranceSocial = (props) => {
    const { t } = props;
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
    const [loading, setLoading] = useState(false);
    const [disabledSubmitButton, setdisabledSubmitButton] = useState(false);

    useEffect(() => {
        const listDates = getDateOffset();
        const muleSoftConfig = getMuleSoftHeaderConfigurations()
        const getProfile = axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/profile`, muleSoftConfig)
        const getPersionalInfo = axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/personalinfo`, muleSoftConfig);
        const getShiftInfo = axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/timeoverview?from_date=${listDates[0]}&to_date=${listDates[listDates.length - 1]}`, muleSoftConfig);
        const getLinkDocument = axios.get(`${process.env.REACT_APP_REQUEST_SERVICE_URL}benefitclaim/download-updated-template?type=1`, getRequestConfigurations())

        setLoading(true);
        Promise.allSettled([getProfile, getPersionalInfo, getShiftInfo, getLinkDocument]).then(res => {
            if (res && res[0].value && res[1].value) {
                let userProfile = res[0].value.data.data[0];
                let userDetail = res[1].value.data.data[0];
                let shiftInfo = res[2].value?.data?.data || [];
                let documentLink = res[3].value?.data?.data;
                setLoading(false);
                setUserInfo({
                    ...userInfo,
                    socialId: userProfile.insurance_number || '',
                    healthId: userProfile.health_insurance_number || '',
                    fullName: userProfile.fullname || '',
                    employeeNo: userProfile.uid || '',
                    IndentifiD: userDetail.personal_id_no || ''
                })
                let infoBank = {
                    receiveType:  { value: '2', label: 'Chi trả qua ATM' },
                    accountNumber: userDetail.bank_number && userDetail.bank_number != '#' ? userDetail.bank_number : '',
                    accountName: userDetail.fullname && userDetail.fullname != '#' ? removeAccents(userDetail.fullname).toUpperCase() : '',
                    bankId: userDetail.bank_name_id && userDetail.bank_name_id != '#' ? userDetail.bank_name_id : '',
                    bankName: userDetail.bank_name && userDetail.bank_name != '#' ? userDetail.bank_name : '',
                };
                const days = ['t2', 't3', 't4', 't5', 't6', 't7', 'cn'];
                const dayOffs = [];
                if(shiftInfo?.length > 0) {
                    shiftInfo.map(shift => {
                        if(shift.shift_id == 'OFF') {
                            const index = listDates.indexOf(moment(shift.date, 'DD-MM-YYYY').format('YYYYMMDD'));
                            dayOffs.push(days[index]);
                        }
                    })
                }
                setData({
                    sickData: {
                        ...data.sickData,
                        ...infoBank,
                        leaveOfWeek: dayOffs.join('; ') || '',
                        documentLink: documentLink
                    },
                    convalesData: {
                        ...data.convalesData,
                        ...infoBank,
                        leaveOfWeek: dayOffs.join('; ') || '',
                        documentLink: documentLink
                    },
                    maternityData: {
                        ...data.maternityData,
                        ...infoBank,
                        leaveOfWeek: dayOffs.join('; ') || '',
                        documentLink: documentLink
                    },
                })
            }
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        })
    }, []);

    const getDayOffset = (currentDate, offset) => {
        const tomorrow = new Date(currentDate.getTime());
        tomorrow.setDate(currentDate.getDate()+ offset);
        return tomorrow;
      }

    const getDateOffset = () => {
        const currentDate = moment().toDate();
        // Lấy số thứ tự của ngày hiện tại
        const fromDate_day = currentDate.getDay() == 0 ? 7 : currentDate.getDay();
        const toDate_day = currentDate.getDay() == 0 ? 7 : currentDate.getDay();
        const firstArray = Array.from({length:fromDate_day - 1}).map((x, index) => {
            return moment( getDayOffset(currentDate, -1 *(fromDate_day - index - 1))).format('YYYYMMDD');
        })
        const lastArray = Array.from({length:7 - toDate_day}).map((x, index) => {
            return moment( getDayOffset(currentDate, index + 1)).format('YYYYMMDD')
        });
        return [...firstArray, moment(currentDate).format('YYYYMMDD'), ...lastArray]
    }

    const handleTextInputChange = (e, name, subName) => {
        const candidateInfos = { ...data }
        let value = e?.target?.value;
        if(subName == 'total' && value) {
            value = value.replace(/[^0-9a-zA-Z]/g,'');
        }
        candidateInfos[name][subName] = e != null ? value : "";
        setData(candidateInfos);
    }

    const handleChangeSelectInputs = (e, name, subName) => {
        const candidateInfos = { ...data }
        candidateInfos[name][subName] = e != null ? { value: e.value, label: e.label } : {}
        setData(candidateInfos);
    }

    const handleDatePickerInputChange = async (value, name, subname) => {
        const candidateInfos = { ...data }
        if (moment(value, 'DD/MM/YYYY').isValid()) {
            const date = moment(value).format('DD/MM/YYYY')
            candidateInfos[name][subname] = date

        } else {
            candidateInfos[name][subname] = null
        }
        if(['fromDate', 'toDate'].includes(subname) && candidateInfos[name]['fromDate'] && candidateInfos[name]['toDate']) {
            const totalDay = await getTotalLeaveDay(name, candidateInfos[name]['fromDate'], candidateInfos[name]['toDate']);
            candidateInfos[name]['total'] = totalDay + '';
        }
        setData(candidateInfos)
    }

    const getTotalLeaveDay = async (name, fromDate, toDate) => {
        const muleSoftConfig = getMuleSoftHeaderConfigurations()
        try {
            setLoading(true);
            fromDate = moment(fromDate, 'DD/MM/YYYY');
            toDate = moment(toDate, 'DD/MM/YYYY');
            const totalDays = toDate.diff(fromDate, 'days') + 1;
            if(name == 'maternityData') return totalDays;

            const result = await axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/timeoverview?from_date=${fromDate.format('YYYYMMDD')}&to_date=${toDate.format('YYYYMMDD')}`, muleSoftConfig);
            const timesheets = result.data?.data;
            let totalOffDays = 0;
            if(timesheets?.length > 0) {
                timesheets.map((day) => {
                    if(day.shift_id == 'OFF' || day.is_holiday == '1') {
                        totalOffDays++;
                    }
                })
            }
            return totalDays - totalOffDays;
        } catch(err) {
            return '';
        } finally {
            setLoading(false);
        }
    }

    const removeFile = (index) => {
        const _files = [...files.slice(0, index), ...files.slice(index + 1)];
        updateFiles(_files);
    }

    const onSubmit = (data) => {
        setdisabledSubmitButton(true);
        setLoading(true);
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_SERVICE_URL}BenefitClaim`,
            data: data,
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response && response.data && response.data.result && response.data.result.code == '000000') {
                    showStatusModal(t("Successful"), t("RequestSent"), true)
                    setdisabledSubmitButton(false)
                }
                else {
                    notifyMessage(response.data.result.message || t("Error"))
                    setdisabledSubmitButton(false)
                }
                setLoading(false);
            })
            .catch(response => {
                notifyMessage(t("Error"));
                setdisabledSubmitButton(false);
                setLoading(false);
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
            ...resultModal,
            isShowStatusModal: false
        })
        if(resultModal.isSuccess) {
            window.location.href = '/tasks?requestTypes=14,15,20';
        }
    }

    const showStatusModal = (title, message, isSuccess = false) => {
        setresultModal({
            isShowStatusModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess
        })
    };

    return (
        <div className="registration-insurance-section">
            <ResultModal show={resultModal.isShowStatusModal} title={resultModal.titleModal} message={resultModal.messageModal} isSuccess={resultModal.isSuccess} onHide={hideStatusModal} />
            {loading ? <LoadingModal show={loading}/> : null}
            {
                type == null ?
                    <>
                        <h5>{t('social_insurance_claim')}</h5>
                        <div className="box shadow cbnv">
                            <div className="row">
                                <div className="col-4">
                                {t('TypeOfRequest')}<span className="required">(*)</span>
                                    <Select placeholder={t('option')} options={InsuranceOptions} isClearable={false}
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
                            supervisors={supervisors}
                            setSupervisors={setSupervisors}
                            approver={approver}
                            setApprover={setApprover}
                            updateFiles={updateFiles}
                            files={files}
                            removeFile={removeFile}
                        />
                        : type.value == 2 ?
                            <CreateMaternityInsurance type={type} setType={setType}
                                data={data.maternityData}
                                errors={errors.maternityData}
                                setLoading={setLoading}
                                userInfo={userInfo}
                                disabledSubmitButton={disabledSubmitButton}
                                handleTextInputChange={(e, key) => handleTextInputChange(e, 'maternityData', key)}
                                handleChangeSelectInputs={(e, key) => handleChangeSelectInputs(e, 'maternityData', key)}
                                handleDatePickerInputChange={(value, key) => handleDatePickerInputChange(value, 'maternityData', key)}
                                onSend={(data) => onSubmit(data)}
                                supervisors={supervisors}
                                setSupervisors={setSupervisors}
                                approver={approver}
                                setApprover={setApprover}
                                updateFiles={updateFiles}
                                files={files}
                                removeFile={removeFile}
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
                                    supervisors={supervisors}
                                    setSupervisors={setSupervisors}
                                    approver={approver}
                                    setApprover={setApprover}
                                    updateFiles={updateFiles}
                                    files={files}
                                    removeFile={removeFile}
                                    notifyMessage={notifyMessage} />
                                : null
            }



        </div>
    )
}

export default HOCComponent(withTranslation()(CreateInsuranceSocial))
