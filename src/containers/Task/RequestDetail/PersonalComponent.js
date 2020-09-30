import React from 'react'
import axios from 'axios'

class PersonalComponent extends React.Component {
    constructor(props) {
        super();
        // this.state = {
        //     userDetail: {}
        // }
    }

    componentDidMount() {
        
    }

    // isNotNull(input) {
    //     if (input !== undefined && input !== null && input !== 'null' && input !== '#' && input !== '') {
    //       return true;
    //     }
    //     return false;
    // }

    getLabel = (key) => {
        switch (key) {
            case "Birthday":
                return "Ngày sinh";
            case "BirthProvince":
                return "Nơi sinh";
            case "Gender":
                return "Giới tính";
            case "Ethinic":
                return "Dân tộc";
            case "Religion":
                return "Tôn giáo";
            case "PassportNo":
                return "Số CMND/CCCD/Hộ chiếu";
            case "DateOfIssue":
                return "Ngày cấp";
            case "PlaceOfIssue":
                return "Nơi cấp";
            case "Nationality":
                return "Quốc tịch";
            case "MaritalStatus":
                return "Tình trạng hôn nhân";
            case "WorkPermitNo":
                return "Số giấy phép lao động";
            case "ExpiryDate":
                return "Ngày hết hạn";
            case "PersonalEmail":
                return "Email cá nhân";
            case "CellPhoneNo":
                return "Điện thoại di động";
            case "UrgentContactNo":
                return "Điện thoại khẩn cấp";
            case "BankAccountNumber":
                return "Số tài khoản ngân hàng";
            case "BankName":
                return "Tên ngân hàng";
        }
    }

    handleTextInputChange(event) {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name;

        // if(value !== this.props.userDetail[this.mappingFields(name)]) {
        //     this.props.updateInfo(name, this.props.userDetail[this.mappingFields(name)], value)
        // } else {
        //     this.props.removeInfo(name)
        // }
        // this.setState({
        //     userDetail : {
        //         ...this.state.userDetail,
        //         [this.mappingFields(name)]: value
        //     }
        // })
    }

    render() {
        const userMainInfo = this.props.userMainInfo
        return (
            <div className="info">
                <h4 className="title text-uppercase">Thông tin cá nhân</h4>
                <div className="box shadow">
                    <div className="row">
                        <div className="col"><i className="note note-old"></i> Thông tin cũ</div>
                        <div className="col"><i className="note note-new"></i> Thông tin điều chỉnh</div>
                    </div>
                    <hr/>
                    {
                        (userMainInfo || []).map((item, i) => {
                            const key = Object.keys(item)[0];
                            return <div className="row" key={i}>
                                <div className="col-2">
                                    <div className="label">{this.getLabel(key)}</div> 
                                </div>
                                <div className="col-4 old">
                                    <div className="detail">{item[key][0][0]}</div>
                                </div>
                                <div className="col-6 new">
                                    {
                                        this.props.page == "request" ? 
                                        <input className="form-control" type="text" name="FullName" value={item[key][0][1] || ""} onChange={this.handleTextInputChange.bind(this)} />
                                        : <div className="detail">{item[key][0][1]}</div>
                                    }
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        )
    }
}

export default PersonalComponent
