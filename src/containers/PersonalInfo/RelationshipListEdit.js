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
    const { relationships } = props
    const [relationshipData, SetRelationshipData] = useState([])

    const genderOptions = {
        male: '1',
        female: '2'
    }
    const genders = [
        {value: genderOptions.male, label: 'Nam'},
        {value: genderOptions.female, label: 'Nữ'}
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
        {value: 'V001', label: 'Cha ruột', genders: getGenderByRelationshipTypes('V001')},
        {value: 'V002', label: 'Mẹ ruột', genders: getGenderByRelationshipTypes('V002')},
        {value: 'V003', label: 'Cha dượng', genders: getGenderByRelationshipTypes('V003')},
        {value: 'V004', label: 'Mẹ kế', genders: getGenderByRelationshipTypes('V004')},
        {value: 'V005', label: 'Vợ', genders: getGenderByRelationshipTypes('V005')},
        {value: 'V006', label: 'Cha chồng', genders: getGenderByRelationshipTypes('V006')},
        {value: 'V007', label: 'Mẹ chồng', genders: getGenderByRelationshipTypes('V007')},
        {value: 'V008', label: 'Cha vợ', genders: getGenderByRelationshipTypes('V008')},
        {value: 'V009', label: 'Mẹ vợ', genders: getGenderByRelationshipTypes('V009')},
        {value: 'V010', label: 'Anh ruột', genders: getGenderByRelationshipTypes('V010')},
        {value: 'V011', label: 'Chị ruột', genders: getGenderByRelationshipTypes('V011')},
        {value: 'V012', label: 'Em ruột', genders: getGenderByRelationshipTypes('V012')},
        {value: 'V013', label: 'Chồng', genders: getGenderByRelationshipTypes('V013')},
        {value: 'V014', label: 'Con trai', genders: getGenderByRelationshipTypes('V014')},
        {value: 'V015', label: 'Con gái', genders: getGenderByRelationshipTypes('V015')},
        {value: 'V016', label: 'Khác', genders: getGenderByRelationshipTypes('V016')}
    ]

    useEffect(() => {
        const prepareRelationships = () => {
            const relationshipsToUpdate = (relationships && relationships || []).map(item => {
                // let fullName = item.full_name?.trim()
                // let fullNameToArray = fullName.split(" ")
                // let firstName = ""
                // let lastName = ""
                // if (fullNameToArray.length === 1) {
                //     lastName = fullNameToArray.toString()
                // } else {
                //     fullNameToArray.unshift(fullNameToArray.pop())
                //     let [last, ...rest] = fullNameToArray
                //     firstName = rest?.join(" ")
                //     lastName = last
                // }

                let gender = genders.find(g => getGenderByRelationshipTypes(item.relation_code).includes(g.value))
                let newGenderOptions = genders.filter(g => getGenderByRelationshipTypes(item.relation_code).includes(g.value))

                return {
                    ...item,
                    new_firstname: item.firstname,
                    new_lastname: item.lastname,
                    new_dob: item.dob,
                    new_relation: {value: item.relation_code, label: item.relation, genders: getGenderByRelationshipTypes(item.relation_code)},
                    new_gender: {value: getGenderByRelationshipTypes(item.relation_code), label: gender?.label},
                    new_gender_options: newGenderOptions
                }
            })
            SetRelationshipData(relationshipsToUpdate)
        }
        prepareRelationships()
    }, [relationships])

    const handleInputTextChange = (e, index, type) => {
        const relationshipDataToUpdate = [...relationshipData]
        const val = e.target.value || ""
        relationshipDataToUpdate[index][[type]] = val
        SetRelationshipData(relationshipDataToUpdate)
        props.updateDataToParent(relationshipDataToUpdate)
    }

    const handleSelectInputChange = (e, index, type) => {
        const relationshipDataToUpdate = [...relationshipData]
        switch (type) {
            case 'new_relation':
                const newGenderOptions = genders.filter(g => e.genders?.includes(g.value))
                relationshipDataToUpdate[index]['new_relation'] = e
                relationshipDataToUpdate[index]['new_gender'] = newGenderOptions[0]
                relationshipDataToUpdate[index]['new_gender_options'] = newGenderOptions
                break;
            case 'new_gender':
                relationshipDataToUpdate[index]['new_gender'] = e
                break;
        }
        SetRelationshipData(relationshipDataToUpdate)
        props.updateDataToParent(relationshipDataToUpdate)
    }

    const handleDatePickerInputChange = (dateInput, index, type) => {
        const relationshipDataToUpdate = [...relationshipData]
        const date = dateInput && moment(dateInput).isValid() ? moment(dateInput).format('DD-MM-YYYY') : null
        relationshipDataToUpdate[index][[type]] = date
        SetRelationshipData(relationshipDataToUpdate)
        props.updateDataToParent(relationshipDataToUpdate)
    }

    const customStyles = {
        control: base => ({
            ...base,
            height: 35,
            minHeight: 35
        })
    }

    return (
        <div className="editing-section">
            <div className="old-new-flag">
                <span className="flag old">
                    <span className="box"></span>
                    <span>Thông tin cũ</span>
                </span>
                <span className="flag new">
                    <span className="box"></span>
                    <span>Nhập thông tin điều chỉnh</span>
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
                                    <label>Họ và tên đệm</label>
                                    <input type="text" className="text-box" value={item.new_firstname || ""} onChange={e => handleInputTextChange(e, i, 'new_firstname')} />
                                </div>
                                <div className="col-item last-name">
                                    <label>Tên</label>
                                    <input type="text" className="text-box" value={item.new_lastname || ""} onChange={e => handleInputTextChange(e, i, 'new_lastname')} />
                                </div>
                                <div className="col-item relationship">
                                    <label>{t("Relationship")}</label>
                                    <Select 
                                        options={relationshipTypes} 
                                        placeholder={`${t("Select")}`} 
                                        onChange={e => handleSelectInputChange(e, i, 'new_relation')} 
                                        value={item.new_relation} 
                                        styles={customStyles} />
                                </div>
                                <div className="col-item gender">
                                    <label>{t("Gender")}</label>
                                    <Select 
                                        options={item.new_gender_options} 
                                        placeholder={`${t("Select")}`} 
                                        onChange={e => handleSelectInputChange(e, i, 'new_gender')} 
                                        value={item.new_gender} 
                                        styles={customStyles} />
                                </div>
                                <div className="col-item birthday">
                                    <label>{t("DateOfBirth")}</label>
                                    <DatePicker
                                        maxDate={new Date()}
                                        selected={item.new_dob ? moment(item.new_dob, 'DD-MM-YYYY').toDate() : null}
                                        onChange={birthday => handleDatePickerInputChange(birthday, i, "new_dob")}
                                        dateFormat="dd/MM/yyyy"
                                        showMonthDropdown={true}
                                        showYearDropdown={true}
                                        locale="vi"
                                        className="form-control input" />
                                </div>
                            </div>
                        </Fragment>
                    })
                }
                </div>
            </div>
        </div>
    )
}

export default RelationshipListEdit
