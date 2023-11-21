import React from 'react'
import { withTranslation } from "react-i18next"
class PersonalComponent extends React.Component {
    constructor(props) {
        super();
    }

    getLabel = (key) => {
        const { t } = this.props
        switch (key) {
            case "Birthday":
                return t("DateOfBirth");
            case "BirthCountry":
                return t("CountryCodeOfBirth");
            case "BirthCountryText":
                return t("CountryOfBirth");
            case "BirthProvince":
                return t("PlaceOfBirthCode");
            case "BirthProvinceText":
                return t("PlaceOfBirth");
            case "Gender":
                return t("GenderCode");
            case "GenderText":
                return t("Gender");
            case "Ethinic":
                return t("EthnicCode");
            case "EthinicText":
                return t("Ethnic");
            case "Religion":
                return  t("ReligionCode");
            case "ReligionText":
                return t("Religion");
            case "PersonalIdentifyNumber":
                return t("IdNo");
            case "PersonalIdentifyDate":
                return t("IdDateOfIssue");
            case "PersonalIdentifyPlace":
                return t("IdPlaceOfIssue");
            case "PassportNumber":
                return t("PassportNo");
            case "PassportDate":
                return t("PassportDateOfIssue");
            case "PassportPlace":
                return t("PassportPlaceOfIssue");
            case "Nationality":
                return t("NationalityCode");
            case "NationalityText":
                return t("Nationality");
            case "MaritalStatus":
                return t("MaritalStatusCode");
            case "MaritalStatusText":
                return t("MaritalStatus");
            case "PersonalEmail":
                return t("PersonalEmail");
            case "CellPhoneNo":
                return t("MobileNo");
            case "UrgentContactNo":
                return t("EmergencyPhoneNo");
            case "BankAccountNumber":
                return t("BankAccountNumber");
            case "Bank":
                return t("BankCode");
            case "BankText":
                return t("Bank");
            case "Education":
                return t("Certification");
            case "Province":
                return `${t("Province_City_Code")} - ${t("PermanentAddress")}`;
            case "ProvinceText":
                return `${t("Province_City")} - ${t("PermanentAddress")}`;
            case "District":
                return `${t("District_Code")} - ${t("PermanentAddress")}`;
            case "DistrictText":
                return `${t("District")} - ${t("PermanentAddress")}`;
            case "Wards":
                return `${t("Ward_Code")} - ${t("PermanentAddress")}`;
            case "WardsText":
                return `${t("Ward")} - ${t("PermanentAddress")}`;
            case "StreetName":
                return `${t("Street")} - ${t("PermanentAddress")}`;
            case "TempProvince":
                return `${t("Province_City_Code")} - ${t("TemporaryAddress")}`;
            case "TempProvinceText":
                return `${t("Province_City")} - ${t("TemporaryAddress")}`;
            case "TempDistrict":
                return `${t("District_Code")} - ${t("TemporaryAddress")}`;
            case "TempDistrictText":
                return `${t("District")} - ${t("TemporaryAddress")}`;
            case "TempWards":
                return `${t("Ward_Code")} - ${t("TemporaryAddress")}`;
            case "TempWardsText":
                return `${t("Ward")} - ${t("TemporaryAddress")}`;
            case "TempStreetNameText":
                return `${t("Street")} - ${t("TemporaryAddress")}`;
            case "MarriageDate":
                return t("MarriageDate");
        }
    }

    render() {
        const { t, userMainInfo } = this.props;

        return (
            <div className="info">
                <div className="box shadow wrap-item">
                    <div className="row">
                        <div className="col"><i className="note note-old"></i> {t("Record")}</div>
                        <div className="col"><i className="note note-new"></i> {t("NewInformation")}</div>
                    </div>
                    <hr />
                    {
                        (userMainInfo || []).map((item, i) => {
                            const key = Object.keys(item)[0];
                            const label = this.getLabel(key);
                            let addressClass = ""
                            if (key == "ProvinceText") {
                                addressClass = "province"
                            } else if (key == "DistrictText") {
                                addressClass = "district"
                            } else if (key == "WardsText") {
                                addressClass = "wards"
                            } else if (key == "StreetName") {
                                addressClass = "street"
                            } else if (key == "TempProvinceText") {
                                addressClass = "temp-province"
                            } else if (key == "TempDistrictText") {
                                addressClass = "temp-district"
                            } else if (key == "TempWardsText") {
                                addressClass = "temp-wards"
                            } else if (key == "TempStreetName") {
                                addressClass = "temp-street"
                            }
                            if (label && !label.includes("Mã")) {
                                return <div className={`row ${addressClass}`} key={i}>
                                    <div className="col-2">
                                        <div className="label">{label}</div>
                                    </div>
                                    <div className="col-4 old">
                                        <div className="detail">{item[key][0][0]}</div>
                                    </div>
                                    <div className="col-6 new">
                                        <div className="detail">{item[key][0][1]}</div>
                                    </div>
                                </div>
                            }
                        })
                    }
                </div>
            </div>
        )
    }
}

export default withTranslation()(PersonalComponent)
