import React from 'react'

class PersonalComponent extends React.Component {

    isNotNull(input) {
        if (input !== undefined && input !== null && input !== 'null' && input !== '#' && input !== '') {
          return true;
        }
        return false;
    }

    SummaryAddress(obj) {
        let result = '';
        if (typeof (obj) == 'object' && obj.length > 0) {
            for (let i = 0; i < obj.length; i++) {
            const element = obj[i];
            if (this.isNotNull(element)) {
                result += element + ', '
            }
            }
        }
        result = result.trim();
        if (result.length > 0) { result = result.substring(0, result.length - 1); }
        return result;
    }
    
    render() {
        const userDetail = this.props.userDetail
        const userProfile = this.props.userProfile
      return (
      <div className="info">
        <h4 className="title text-uppercase">Thông tin cá nhân</h4>
        <div className="box shadow">
            <div class="row">
                <div class="col">
                    <i className="note-old"> </i> Thông tin cũ
                </div>
                <div class="col">
                <i className="note-new"> </i> Nhập thông tin điều chỉnh
                </div>
            </div>

            <hr/>

            <div class="row">
                <div class="col-2">
                   <div className="label">Họ và tên</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.fullname}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" type="text" name="fullname" value={userDetail.fullname}/>
                </div>
            </div>
            <div class="row">
                <div class="col-2">
                   <div className="label">Số sổ bảo hiểm</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userProfile.insurance_number}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" type="text" name="insurance_number" value={userProfile.insurance_number} />
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Mã số thuế</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.tax_number}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" type="text" name="tax_number" value={userDetail.tax_number}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Ngày sinh</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.birthday}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="birthday" type="text" value={userDetail.birthday}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Nơi sinh</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.birth_province}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="birth_province" type="text" value={userDetail.birth_province}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Giới tính</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{(userDetail.gender !== undefined && userDetail.gender !== '2') ? 'Male' : 'Female'}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="gender" type="text" value={userDetail.gender}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Dân tộc</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.ethinic}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="ethinic" type="text" value={userDetail.ethinic}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Tôn giáo</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.religion ? userDetail.religion : 'Không'}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="religion" type="text" value={userDetail.religion}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Số CMND/CCCD/Hộ chiếu</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.passport_no}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="passport_no" type="text" value={userDetail.passport_no}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Ngày cấp</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.date_of_issue}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="date_of_issue" type="text" value={userDetail.date_of_issue}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Nơi cấp</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.place_of_issue}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="place_of_issue" type="text" value={userDetail.place_of_issue}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Quốc tịch</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.nationality}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="nationality" type="text" value={userDetail.nationality}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Địa chỉ thường trú</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{this.SummaryAddress([userDetail.street_name, userDetail.wards, userDetail.district, userDetail.province])}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="street_name" type="text" value={this.SummaryAddress([userDetail.street_name, userDetail.wards, userDetail.district, userDetail.province])}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Địa chỉ tạm trú</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{this.SummaryAddress([userDetail.tmp_street_name, userDetail.tmp_wards, userDetail.tmp_district, userDetail.tmp_province])}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="tmp_street_name" type="text" value={this.SummaryAddress([userDetail.tmp_street_name, userDetail.tmp_wards, userDetail.tmp_district, userDetail.tmp_province])}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Tình trạng hôn nhân</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.marital_status_code === "1" ? 'Đã kết hôn' : 'Độc thân'}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="marital_status_code" type="text" value={userDetail.marital_status_code}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Giấy phép lao động</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.work_permit_no}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="work_permit_no" type="text" value={userDetail.work_permit_no}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Ngày hết hạn</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.expiry_date}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="expiry_date" type="text" value={userDetail.expiry_date}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Email cá nhân</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.personal_email}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="personal_email" type="text" value={userDetail.personal_email}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Điện thoại di động</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.cell_phone_no}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="cell_phone_no" type="text" value={userDetail.cell_phone_no}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Điện thoại khẩn cấp</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.urgent_contact_no}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="urgent_contact_no" type="text" value={userDetail.urgent_contact_no}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Số TK ngân hàng</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.bank_number}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="bank_number" type="text" value={userDetail.bank_number}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Ngân hàng</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.bank_name}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="bank_name" type="text" value={userDetail.bank_name}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Chi nhánh</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.bank_branch}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="bank_branch" type="text" value={userDetail.bank_branch}/>
                </div>
            </div>
        </div>
      </div>)
    }
  }
export default PersonalComponent