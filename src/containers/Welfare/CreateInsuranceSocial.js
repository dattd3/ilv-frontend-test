import React, { useState } from 'react'
import { withTranslation } from 'react-i18next';
import Select from 'react-select'
import CreateConvalesInsurance from './InsuranceComponents/CreateConvalesInsurance';
import CreateMaternityInsurance from './InsuranceComponents/CreateMaternityInsurance';
import CreateSickInsurance from './InsuranceComponents/CreateSickInsurance';
import moment from 'moment';

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

    const [errors, setErrors] = useState({
        sickData: {

        },
        convalesData: {

        },
        maternityData: {

        }
    })

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

    const onSubmit = () => {
        
    }

    return (
        <div className="registration-insurance-section">
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
                            handleTextInputChange={(e, key) => handleTextInputChange(e, 'sickData', key)}
                            handleChangeSelectInputs={(e, key) => handleChangeSelectInputs(e, 'sickData', key)}
                            handleDatePickerInputChange={(value, key) => handleDatePickerInputChange(value, 'sickData', key)}
                        />
                        : type.value == 2 ?
                            <CreateMaternityInsurance type={type} setType={setType}
                                data={data.maternityData}
                                errors={errors.maternityData}
                                handleTextInputChange={(e, key) => handleTextInputChange(e, 'maternityData', key)}
                                handleChangeSelectInputs={(e, key) => handleChangeSelectInputs(e, 'maternityData', key)}
                                handleDatePickerInputChange={(value, key) => handleDatePickerInputChange(value, 'maternityData', key)} />
                            : type.value == 3 ?
                                <CreateConvalesInsurance type={type} setType={setType}
                                    data={data.convalesData}
                                    errors={errors.convalesData}
                                    handleTextInputChange={(e, key) => handleTextInputChange(e, 'convalesData', key)}
                                    handleChangeSelectInputs={(e, key) => handleChangeSelectInputs(e, 'convalesData', key)}
                                    handleDatePickerInputChange={(value, key) => handleDatePickerInputChange(value, 'convalesData', key)} />
                                : null
            }
            


        </div>
    )
}

export default withTranslation()(CreateInsuranceSocial);