import React, { Fragment, useState, useEffect } from "react"
import Select from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useTranslation } from "react-i18next"
import moment from 'moment'
import { formatStringByMuleValue } from "../../commons/Utils"

import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

function RelationshipListEdit(props) {
    const { t } = useTranslation()
    const { relationships, propsRelationshipDataToCreate } = props
    const [relationshipData, SetRelationshipData] = useState([])
    const [relationshipDataToCreate, SetRelationshipDataToCreate] = useState([])

    const genderOptions = {
        male: '1',
        female: '2'
    }
    const genders = [
        {value: genderOptions.male, label: t("Male")},
        {value: genderOptions.female, label: t("Female")}
    ]

    const getGenderByRelationshipTypes = relationshipTypes => {
        const relationshipTypesGendersMapping = {
            V001: [genderOptions.male],
            V002: [genderOptions.female],
            V003: [genderOptions.male],
            V004: [genderOptions.female],
            V005: [genderOptions.female],
            V006: [genderOptions.male],
            V007: [genderOptions.female],
            V008: [genderOptions.male],
            V009: [genderOptions.female],
            V010: [genderOptions.male],
            V011: [genderOptions.female],
            V012: [genderOptions.male, genderOptions.female],
            V013: [genderOptions.male],
            V014: [genderOptions.male],
            V015: [genderOptions.female],
            V016: [genderOptions.male, genderOptions.female]
        }
        return relationshipTypesGendersMapping[[relationshipTypes]]
    }

    const relationshipTypes = [
        {value: 'V001', label: t("RelationshipFather"), genders: getGenderByRelationshipTypes('V001')},
        {value: 'V002', label: t("RelationshipMother"), genders: getGenderByRelationshipTypes('V002')},
        {value: 'V003', label: t("RelationshipStepFather"), genders: getGenderByRelationshipTypes('V003')},
        {value: 'V004', label: t("RelationshipStepMother"), genders: getGenderByRelationshipTypes('V004')},
        {value: 'V005', label: t("RelationshipWife"), genders: getGenderByRelationshipTypes('V005')},
        {value: 'V006', label: t("RelationshipHusbandFather"), genders: getGenderByRelationshipTypes('V006')},
        {value: 'V007', label: t("RelationshipHusbandMother"), genders: getGenderByRelationshipTypes('V007')},
        {value: 'V008', label: t("RelationshipWifeFather"), genders: getGenderByRelationshipTypes('V008')},
        {value: 'V009', label: t("RelationshipWifeMother"), genders: getGenderByRelationshipTypes('V009')},
        {value: 'V010', label: t("RelationshipElderBrother"), genders: getGenderByRelationshipTypes('V010')},
        {value: 'V011', label: t("RelationshipElderSister"), genders: getGenderByRelationshipTypes('V011')},
        {value: 'V012', label: t("RelationshipYoungerSibling"), genders: getGenderByRelationshipTypes('V012')},
        {value: 'V013', label: t("RelationshipHusband"), genders: getGenderByRelationshipTypes('V013')},
        {value: 'V014', label: t("RelationshipSon"), genders: getGenderByRelationshipTypes('V014')},
        {value: 'V015', label: t("RelationshipDaughter"), genders: getGenderByRelationshipTypes('V015')},
        {value: 'V016', label: t("RelationshipOther"), genders: getGenderByRelationshipTypes('V016')}
    ]

    useEffect(() => {
        const prepareRelationships = () => {
            const relationshipsToUpdate = (relationships && relationships || []).map(item => {
                let gender = genders.find(g => getGenderByRelationshipTypes(item.relation_code).includes(g.value) && g.value == item.gender_code)
                let newGenderOptions = genders.filter(g => getGenderByRelationshipTypes(item.relation_code).includes(g.value))
                return {
                    ...item,
                    new_firstname: item.firstname,
                    new_lastname: item.lastname,
                    new_dob: item.dob,
                    new_relation: {value: item.relation_code, label: item.relation, genders: getGenderByRelationshipTypes(item.relation_code)},
                    new_gender: {value: gender.value, label: gender?.label},
                    new_gender_options: newGenderOptions
                }
            })
            SetRelationshipData(relationshipsToUpdate)
        }
        prepareRelationships()
    }, [relationships])

    useEffect(() => {
        SetRelationshipDataToCreate(propsRelationshipDataToCreate)
    }, [propsRelationshipDataToCreate])

    const handleInputTextChange = (e, index, type, isEdit) => {
        const val = e.target.value || ""
        const relationshipDataToUpdate = [...relationshipData]
        const relationshipDataToCreateNew = [...relationshipDataToCreate]

        if (isEdit) {
            relationshipDataToUpdate[index][[type]] = val
            SetRelationshipData(relationshipDataToUpdate)
        } else {
            relationshipDataToCreateNew[index][[type]] = val
            SetRelationshipDataToCreate(relationshipDataToCreateNew)
        }

        props.updateDataToParent({update: relationshipDataToUpdate, create: relationshipDataToCreateNew})
    }

    const handleSelectInputChange = (e, index, type, isEdit) => {
        const relationshipDataToUpdate = [...relationshipData]
        const relationshipDataToCreateNew = [...relationshipDataToCreate]
        switch (type) {
            case 'new_relation':
                const newGenderOptions = genders.filter(g => e.genders?.includes(g.value))
                if (isEdit) {
                    relationshipDataToUpdate[index]['new_relation'] = e
                    relationshipDataToUpdate[index]['new_gender'] = null
                    relationshipDataToUpdate[index]['new_gender_options'] = newGenderOptions
                } else {
                    relationshipDataToCreateNew[index]['new_relation'] = e
                    relationshipDataToCreateNew[index]['new_gender'] = newGenderOptions[0]
                    relationshipDataToCreateNew[index]['new_gender_options'] = newGenderOptions
                }
                break;
            case 'new_gender':
                if (isEdit) {
                    relationshipDataToUpdate[index]['new_gender'] = e
                } else {
                    relationshipDataToCreateNew[index]['new_gender'] = e
                }
                break;
        }
        SetRelationshipData(relationshipDataToUpdate)
        SetRelationshipDataToCreate(relationshipDataToCreateNew)
        props.updateDataToParent({update: relationshipDataToUpdate, create: relationshipDataToCreateNew})
    }

    const handleDatePickerInputChange = (dateInput, index, type, isEdit) => {
        const relationshipDataToUpdate = [...relationshipData]
        const relationshipDataToCreateNew = [...relationshipDataToCreate]
        const date = dateInput && moment(dateInput).isValid() ? moment(dateInput).format('DD-MM-YYYY') : null
        if (isEdit) {
            relationshipDataToUpdate[index][[type]] = date
            SetRelationshipData(relationshipDataToUpdate)
        } else {
            relationshipDataToCreateNew[index][[type]] = date
            SetRelationshipDataToCreate(relationshipDataToCreateNew)
        }
        props.updateDataToParent({update: relationshipDataToUpdate, create: relationshipDataToCreateNew})
    }

    const removeRelationshipCreated = index => {
        let relationships = [...relationshipDataToCreate]
        const relationshipsValid = [...relationships.slice(0, index), ...relationships.slice(index + 1)]
        SetRelationshipDataToCreate(relationshipsValid)
        props.updateDataToParent({update: relationshipData, create: relationshipsValid})
    }

    const customStyles = {
        control: base => ({
            ...base,
            height: 35,
            minHeight: 35
        })
    }

    const error = (index, action, name) => {
        const { errors } = props
        if (!errors) {
            return null
        }
        const validationKey = `${action}_${name}_${index}`
        return errors[[validationKey]] ? <div className="text-danger validation-message">{errors[[validationKey]]}</div> : null
    }

    return (
        <div className="editing-section">
            <div className="old-new-flag">
                <span className="flag old">
                    <span className="box"></span>
                    <span>{t("Record")}</span>
                </span>
                <span className="flag new">
                    <span className="box"></span>
                    <span>{t("UpdateInformation")}</span>
                </span>
            </div>
            <div className="detail-info">
                <div className="relationship-item">
                    <div className="info-label">
                        <div className="col-item full-name">{t("FullName")}</div>
                        <div className="col-item relationship">{t("Relationship")}</div>
                        <div className="col-item birthday">{t("DateOfBirth")}</div>
                        <div className="col-item tax-no">{t("AllowancesTaxNo")}</div>
                        <div className="col-item allowances">{t("FamilyAllowances")}</div>
                        <div className="col-item allowances-date">{t("AllowancesDate")}</div>
                    </div>
                    {
                        (relationshipData || []).map((item, i) => {
                            return <Fragment key={i}>
                                <div className="info-value">
                                    <div className="col-item full-name">{formatStringByMuleValue(item.full_name)}</div>
                                    <div className="col-item relationship">{formatStringByMuleValue(item.relation)}</div>
                                    <div className="col-item birthday">{formatStringByMuleValue(item.dob) ? moment(item.dob, 'DD-MM-YYYY').format('DD/MM/YYYY') : ""}</div>
                                    <div className="col-item tax-no">{formatStringByMuleValue(item.tax_number)}</div>
                                    <div className="col-item allowances"><input type="checkbox" className="check-box" defaultChecked={formatStringByMuleValue(item.is_reduced) ? true : false} value={formatStringByMuleValue(item.is_reduced)} disabled={true} /></div>
                                    <div className="col-item allowances-date">{formatStringByMuleValue(item.is_reduced) ? (moment(item.from_date, 'DD-MM-YYYY').format('DD/MM/YYYY') + ` - ` + moment(item.to_date, 'DD-MM-YYYY').format('DD/MM/YYYY')) : ""}</div>
                                </div>
                                <div className="edit-value">
                                    <div className="col-item first-name">
                                        <label>{t("FamilyLastName")}<span className="text-danger required">(*)</span></label>
                                        <input type="text" className="text-box" value={item.new_lastname || ""} onChange={e => handleInputTextChange(e, i, 'new_lastname', true)} />
                                        {error(i, 'update', 'new_lastname')}
                                    </div>
                                    <div className="col-item last-name">
                                        <label>{t("FamilyFirstName")}<span className="text-danger required">(*)</span></label>
                                        <input type="text" className="text-box" value={item.new_firstname || ""} onChange={e => handleInputTextChange(e, i, 'new_firstname', true)} />
                                        {error(i, 'update', 'new_firstname')}
                                    </div>
                                    <div className="col-item relationship">
                                        <label>{t("Relationship")}<span className="text-danger required">(*)</span></label>
                                        <Select 
                                            options={relationshipTypes} 
                                            placeholder={`${t("Select")}`} 
                                            onChange={e => handleSelectInputChange(e, i, 'new_relation', true)} 
                                            value={item.new_relation} 
                                            styles={customStyles} />
                                        {error(i, 'update', 'new_relation')}
                                    </div>
                                    <div className="col-item gender">
                                        <label>{t("Gender")}<span className="text-danger required">(*)</span></label>
                                        <Select 
                                            options={item.new_gender_options} 
                                            placeholder={`${t("Select")}`} 
                                            onChange={e => handleSelectInputChange(e, i, 'new_gender', true)} 
                                            value={item.new_gender} 
                                            styles={customStyles} />
                                        {error(i, 'update', 'new_gender')}
                                    </div>
                                    <div className="col-item birthday">
                                        <label>{t("DateOfBirth")}<span className="text-danger required">(*)</span></label>
                                        <DatePicker
                                            maxDate={new Date()}
                                            selected={item.new_dob ? moment(item.new_dob, 'DD-MM-YYYY').toDate() : null}
                                            onChange={birthday => handleDatePickerInputChange(birthday, i, "new_dob", true)}
                                            dateFormat="dd/MM/yyyy"
                                            showMonthDropdown={true}
                                            showYearDropdown={true}
                                            locale="vi"
                                            className="form-control input" />
                                        {error(i, 'update', 'new_dob')}
                                    </div>
                                </div>
                            </Fragment>
                        })
                    }
                </div>
                {
                    relationshipDataToCreate && relationshipDataToCreate.length > 0 ?
                    <div className="relationship-item-create">
                        {
                            (relationshipDataToCreate || []).map((item, i) => {
                                return <div className="edit-value" key={i}>
                                            <span className="btn-remove-relationship-item" onClick={() => removeRelationshipCreated(i)}><i className="fas fa-times"></i></span>
                                            <div className="col-item first-name">
                                                <label>{t("FamilyLastName")}<span className="text-danger required">(*)</span></label>
                                                <input type="text" className="text-box" value={item.new_lastname || ""} onChange={e => handleInputTextChange(e, i, 'new_lastname', false)} />
                                                {error(i, 'create', 'new_lastname')}
                                            </div>
                                            <div className="col-item last-name">
                                                <label>{t("FamilyFirstName")}<span className="text-danger required">(*)</span></label>
                                                <input type="text" className="text-box" value={item.new_firstname || ""} onChange={e => handleInputTextChange(e, i, 'new_firstname', false)} />
                                                {error(i, 'create', 'new_firstname')}
                                            </div>
                                            <div className="col-item relationship">
                                                <label>{t("Relationship")}<span className="text-danger required">(*)</span></label>
                                                <Select 
                                                    options={relationshipTypes} 
                                                    placeholder={`${t("Select")}`} 
                                                    onChange={e => handleSelectInputChange(e, i, 'new_relation', false)} 
                                                    value={item.new_relation} 
                                                    styles={customStyles} />
                                                {error(i, 'create', 'new_relation')}
                                            </div>
                                            <div className="col-item gender">
                                                <label>{t("Gender")}<span className="text-danger required">(*)</span></label>
                                                <Select 
                                                    options={item.new_gender_options} 
                                                    placeholder={`${t("Select")}`} 
                                                    onChange={e => handleSelectInputChange(e, i, 'new_gender', false)} 
                                                    value={item.new_gender} 
                                                    styles={customStyles} />
                                                {error(i, 'create', 'new_gender')}
                                            </div>
                                            <div className="col-item birthday">
                                                <label>{t("DateOfBirth")}<span className="text-danger required">(*)</span></label>
                                                <DatePicker
                                                    maxDate={new Date()}
                                                    selected={item.new_dob ? moment(item.new_dob, 'DD-MM-YYYY').toDate() : null}
                                                    onChange={birthday => handleDatePickerInputChange(birthday, i, "new_dob", false)}
                                                    dateFormat="dd/MM/yyyy"
                                                    showMonthDropdown={true}
                                                    showYearDropdown={true}
                                                    locale="vi"
                                                    className="form-control input" />
                                                {error(i, 'create', 'new_dob')}
                                            </div>
                                        </div>
                            })
                        }
                    </div>
                    : null
                }
            </div>
        </div>
    )
}

export default RelationshipListEdit
