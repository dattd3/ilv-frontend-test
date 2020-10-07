import React from 'react'

class PersonalComponent extends React.Component {
    constructor(props) {
        super();
    }

    getLabel = (key) => {
        switch (key) {
            case "Birthday":
                return "Ngày sinh";
            case "BirthCountry":
                return "Mã quốc gia sinh";
            case "BirthCountryText":
                return "Quốc gia sinh";
            case "BirthProvince":
                return "Mã nơi sinh";
            case "BirthProvinceText":
                return "Nơi sinh";
            case "Gender":
                return "Mã giới tính";
            case "GenderText":
                return "Giới tính";
            case "Ethinic":
                return "Mã dân tộc";
            case "EthinicText":
                return "Dân tộc";
            case "Religion":
                return "Mã tôn giáo";
            case "ReligionText":
                return "Tôn giáo";
            case "DocumentTypeId":
                return "Mã loại giấy tờ";
            case "DocumentTypeIdText":
                return "Loại giấy tờ";
            case "DocumentTypeValue":
                return "Số giấy tờ";
            case "DateOfIssue":
                return "Ngày cấp";
            case "PlaceOfIssue":
                return "Mã nơi cấp";
            case "PlaceOfIssueText":
                return "Nơi cấp";
            case "Nationality":
                return "Mã quốc tịch";
            case "NationalityText":
                return "Quốc tịch";
            case "MaritalStatus":
                return "Mã tình trạng hôn nhân";
            case "MaritalStatusText":
                return "Tình trạng hôn nhân";
            case "PersonalEmail":
                return "Email cá nhân";
            case "CellPhoneNo":
                return "Điện thoại di động";
            case "UrgentContactNo":
                return "Điện thoại khẩn cấp";
            case "BankAccountNumber":
                return "Số tài khoản ngân hàng";
            case "Bank":
                return "Mã ngân hàng";
            case "BankText":
                return "Tên ngân hàng";
            case "Education":
                return "Bằng cấp/Chứng chỉ chuyên môn";
            case "Province":
                return "Mã Tỉnh/TP - Địa chỉ thường trú";
            case "ProvinceText":
                return "Tỉnh/TP - Địa chỉ thường trú";
            case "District":
                return "Mã Quận/Huyện - Địa chỉ thường trú";
            case "DistrictText":
                return "Quận/Huyện - Địa chỉ thường trú";
            case "Wards":
                return "Mã Xã/Phường - Địa chỉ thường trú";
            case "WardsText":
                return "Xã/Phường - Địa chỉ thường trú";
            case "StreetName":
                return "Tên đường - Địa chỉ thường trú";
            case "TempProvince":
                return "Mã Tỉnh/TP - Địa chỉ tạm trú";
            case "TempProvinceText":
                return "Tỉnh/TP - Địa chỉ tạm trú";
            case "TempDistrict":
                return "Mã Quận/Huyện - Địa chỉ tạm trú";
            case "TempDistrictText":
                return "Quận/Huyện - Địa chỉ tạm trú";
            case "TempWards":
                return "Mã Xã/Phường - Địa chỉ tạm trú";
            case "TempWardsText":
                return "Xã/Phường - Địa chỉ tạm trú";
            case "StreetName":
                return "Tên đường - Địa chỉ thường trú";
            case "TempStreetName":
                return "Tên đường - Địa chỉ tạm trú";
        }
    }

    render() {
        const userMainInfo = this.props.userMainInfo;

        return (
            <div className="info">
                <div className="box shadow">
                    <div className="row">
                        <div className="col"><i className="note note-old"></i> Thông tin cũ</div>
                        <div className="col"><i className="note note-new"></i> Thông tin điều chỉnh</div>
                    </div>
                    <hr/>
                    {
                        (userMainInfo || []).map((item, i) => {
                            const key = Object.keys(item)[0];
                            const label = this.getLabel(key);
                            if (label && !label.includes("Mã")) {
                                return <div className="row" key={i}>
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

export default PersonalComponent
