import React from 'react'
import { Form } from 'react-bootstrap'
import PersonalComponent from './PersonalComponent'
import EducationComponent from './EducationComponent'
import axios from 'axios'
import Constants from '../../../commons/Constants'
import ConfirmationModal from '../../PersonalInfo/edit/ConfirmationModal'
import _ from 'lodash'
// import {connect} from 'react-redux'
import st from '../../../store'
import { Provider } from 'react-redux'
import { updatePersonalDataAction } from '../../../actions'
import { convertObjectkeyToCamelCase } from '../../Utils/ObjectHelpers'
import moment from 'moment'

class PersonalInfoEdit extends React.Component {
  constructor() {
    super();
    this.store = st;
    this.state = {
      userProfile: {},
      userDetail: {},
      userEducation: [],
      userFamily: [],
      personalUpdating: {},
      educationUpdating: [],
      isConfirm: false,
      files: [],
      banks: [],
      nations: [],
      races: [],
      certificates: [],
      countries: [],
      educationLevels: [],
      genders: [],
      majors: [],
      marriages: [],
      religions: [],
      schools: [],
      documentTypes: [],
      update: {},
      userProfileHistoryMainInfo: {},
      OldMainInfo: {},
      NewMainInfo: {},
      data: {
        update: null
      },
      isShowModalConfirm: false,
      modalTitle: "",
      modalMessage: "",
      confirmStatus: ""
    }
    this.inputReference = React.createRef()
  }

  //#region private function =====================
  getUserProfileHistoryId = () => {
    const pathName = window.location.pathname;
    const pathNameArr = pathName.split('/');
    return pathNameArr[pathNameArr.length - 1];
  }

  processBlockStatuses = (response) => {
    if (response && response.result) {
      const data = response.data;
      const code = response.result.code;
      if (code != Constants.API_ERROR_CODE) {
        if ((data.userProfileInfo.create && data.userProfileInfo.create.educations && data.userProfileInfo.create.educations.length > 0)
          || (data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryEducation && data.userProfileInfo.update.userProfileHistoryEducation.NewEducation)) {
          this.setState({ isShowEducationComponent: true });
        }
        if ((data.userProfileInfo.create && data.userProfileInfo.create.families && data.userProfileInfo.create.families.length > 0) || (data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryFamily && data.userProfileInfo.update.userProfileHistoryFamily.NewFamily)) {
          this.setState({ isShowFamilyComponent: true });
        }
        if (data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryMainInfo && data.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo != null) {
          this.setState({ isShowPersonalComponent: true });
        }
        if (data.userProfileInfoDocuments && data.userProfileInfoDocuments.length > 0) {
          this.setState({ isShowDocumentComponent: true });
        }
      }
    }
  }

  processEducationInfo = response => {
    if (response && response.data) {
      const data = response.data;
      if (data && data.userProfileInfo.create && data.userProfileInfo.create.educations && data.userProfileInfo.create.educations.length > 0) {
        this.setState({ userEducationCreate: response.data.userProfileInfo.create.educations });
      }
      if (data && data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryEducation && data.userProfileInfo.update.userProfileHistoryEducation.length > 0) {
        this.setState({ userEducationUpdate: data.userProfileInfo.update.userProfileHistoryEducation });
      }
    }
  }

  processFamilyInfo = response => {
    if (response && response.data) {
      const data = response.data;
      if (data && data.userProfileInfo.create && data.userProfileInfo.create.families && data.userProfileInfo.create.families.length > 0) {
        this.setState({ userFamilyCreate: response.data.userProfileInfo.create.families });
      }
      if (data && data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryFamily && data.userProfileInfo.update.userProfileHistoryFamily.length > 0) {
        this.setState({ userFamilyUpdate: data.userProfileInfo.update.userProfileHistoryFamily });
      }
    }
  }

  processMainInfo = response => {
    if (response && response.data) {
      const data = response.data;
      if (data && data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryMainInfo && data.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo != null) {
        const mainInfos = this.prepareMainInfo(data.userProfileInfo.update.userProfileHistoryMainInfo);
        this.setState({ userMainInfo: mainInfos });
      }
    }
  }

  processDocumentInfo = response => {
    if (response && response.data) {
      const data = response.data;
      if (data && data.userProfileInfoDocuments) {
        this.setState({ documents: data.userProfileInfoDocuments });
      }
    }
  }

  prepareMainInfo = data => {
    if (data) {
      const oldMainInfo = data.OldMainInfo;
      const newMainInfo = data.NewMainInfo;
      const mainInfo = new Array(oldMainInfo, newMainInfo);
      let mainInfoData = [];
      Object.keys(oldMainInfo).forEach(key => {
        mainInfoData = mainInfoData.concat({ [key]: [_.map(mainInfo, key)] });
      })
      return mainInfoData;
    }
  }

  disApproval = () => {
    this.setState({
      modalTitle: "Xác nhận không duyệt",
      modalMessage: "Thêm ghi chú (Không bắt buộc)",
      typeRequest: 1
    });
    this.onShowModalConfirm();
  }

  approval = () => {
    this.setState({
      modalTitle: "Xác nhận phê duyệt",
      modalMessage: "Bạn có đồng ý phê duyệt thay đổi này ?",
      typeRequest: 2
    });
    this.onShowModalConfirm();
  }

  onShowModalConfirm = () => {
    this.setState({ isShowModalConfirm: true });
  }

  onHideModalConfirm = () => {
    this.setState({ isShowModalConfirm: false });
  }

  updatePersonalInfo(name, old, value) {
    let oldMainInfo = { ...this.state.OldMainInfo, [name]: old };
    let newMainInfo = { ...this.state.NewMainInfo, [name]: value };
    let userProfileHistoryMainInfo = {
      ...this.state.userProfileHistoryMainInfo,
      OldMainInfo: oldMainInfo,
      NewMainInfo: newMainInfo
    };
    let updatedData = {
      ...this.state.update,
      userProfileHistoryMainInfo: userProfileHistoryMainInfo
    };
    this.setState({
      data: {
        ...this.state.data,
        update: updatedData
      },
      update: updatedData,
      userProfileHistoryMainInfo: userProfileHistoryMainInfo,
      NewMainInfo: newMainInfo,
      OldMainInfo: oldMainInfo
    });
    let personalUpdating = Object.assign(this.state.personalUpdating, userProfileHistoryMainInfo);
    this.setState({ personalUpdating: personalUpdating });
  }
  removePersonalInfo(name) {
    if (this.state.personalUpdating.NewMainInfo[name] && this.state.personalUpdating.OldMainInfo[name]) {
      let personalUpdating = Object.assign({}, this.state.personalUpdating)
      delete personalUpdating.NewMainInfo[name];
      delete personalUpdating.OldMainInfo[name];
      this.setState({ personalUpdating: Object.assign({}, personalUpdating) })
    }
  }

  showConfirm(name) {
    this.setState({ [name]: true })
  }

  hideConfirm(name) {
    this.setState({ [name]: false })
  }

  formatSapData(dt, updatedFieldName_arr) {
    let sapData = {};
    let addressKeyNames = ['Nationality', 'Province', 'District', 'Wards', 'StreetName'];
    let addressKeyNameTemps = ['TempProvince', 'TempDistrict', 'TempWards', 'TempStreetName'];
    let informationKeyNames = ['Birthday', 'BirthProvince', 'Gender', 'Religion', 'PassportNo', 'DateOfIssue', 'PlaceOfIssue', 'Nationality'];
    let contactKeyNames = ['PersonalEmail', 'CellPhoneNo', 'UrgentContactNo'];
    let educationKeyNames = ['SchoolCode', 'SchoolName', 'DegreeType', 'MajorCode', 'FromTime', 'ToTime'];
    let raceKeyNames = ['Ethinic'];

    let shouldUpdateAddress = updatedFieldName_arr.some(u => addressKeyNames.indexOf(u) >= 0);
    let shouldUpdateAddressTemp = updatedFieldName_arr.some(u => addressKeyNameTemps.indexOf(u) >= 0);
    if (shouldUpdateAddress || shouldUpdateAddressTemp) {
      sapData.address = [];
      if (shouldUpdateAddress) {
        sapData.address.push({
          actio: 'MOD',
          anssa: 1,
          state: dt.update.userProfileHistoryMainInfo.newMainInfo.Province == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.Province : dt.update.userProfileHistoryMainInfo.newMainInfo.Province,
          stras: dt.update.userProfileHistoryMainInfo.newMainInfo.StreetName == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.StreetName : dt.update.userProfileHistoryMainInfo.newMainInfo.StreetName,
          zdistrict_id: dt.update.userProfileHistoryMainInfo.newMainInfo.District == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.District : dt.update.userProfileHistoryMainInfo.newMainInfo.District,
          zwards_id: dt.update.userProfileHistoryMainInfo.newMainInfo.Wards == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.Wards : dt.update.userProfileHistoryMainInfo.newMainInfo.Wards,
          kdate: moment().format('YYYYMMDD')
        });
      }
      if (shouldUpdateAddressTemp) {
        sapData.address.push({
          actio: 'MOD',
          anssa: 2,
          state: dt.update.userProfileHistoryMainInfo.newMainInfo.TempProvince == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.TempProvince : dt.update.userProfileHistoryMainInfo.newMainInfo.TempProvince,
          stras: dt.update.userProfileHistoryMainInfo.newMainInfo.TempStreetName == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.TempStreetName : dt.update.userProfileHistoryMainInfo.newMainInfo.TempStreetName,
          zdistrict_id: dt.update.userProfileHistoryMainInfo.newMainInfo.TempDistrict == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.TempDistrict : dt.update.userProfileHistoryMainInfo.newMainInfo.TempDistrict,
          zwards_id: dt.update.userProfileHistoryMainInfo.newMainInfo.TempWards == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.TempWards : dt.update.userProfileHistoryMainInfo.newMainInfo.TempWards,
          kdate: moment().format('YYYYMMDD')
        });
      }
    }
    let shouldUpdateRace = updatedFieldName_arr.some(u => raceKeyNames.indexOf(u) >= 0);
    if (shouldUpdateRace) {
      sapData.race = [{
        actio: 'MOD',
        racky: dt.update.userProfileHistoryMainInfo.newMainInfo.Ethinic == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.Ethinic : dt.update.userProfileHistoryMainInfo.newMainInfo.Ethinic,
        kdate: moment().format('YYYYMMDD')
      }];
    }

    let shouldUpdateContact = updatedFieldName_arr.some(u => contactKeyNames.indexOf(u) >= 0);
    if (shouldUpdateContact) {
      sapData.contact = [];
      if (updatedFieldName_arr.some(u => u === 'PersonalEmail')) {
        sapData.contact.push({
          actio: 'MOD',
          subty: '0030',
          kdate: moment().format('YYYYMMDD'),
          usrid_long: dt.update.userProfileHistoryMainInfo.newMainInfo.PersonalEmail == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.PersonalEmail : dt.update.userProfileHistoryMainInfo.newMainInfo.PersonalEmail
        });
      }
      if (updatedFieldName_arr.some(u => u === 'CellPhoneNo')) {
        sapData.contact.push({
          actio: 'MOD',
          subty: 'CELL',
          kdate: moment().format('YYYYMMDD'),
          usrid_long: dt.update.userProfileHistoryMainInfo.newMainInfo.CellPhoneNo == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.CellPhoneNo : dt.update.userProfileHistoryMainInfo.newMainInfo.CellPhoneNo
        });
        if (updatedFieldName_arr.some(u => u === 'UrgentContactNo')) {
          sapData.contact.push({
            actio: 'MOD',
            subty: 'V002',
            kdate: moment().format('YYYYMMDD'),
            usrid_long: dt.update.userProfileHistoryMainInfo.newMainInfo.UrgentContactNo == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.UrgentContactNo : dt.update.userProfileHistoryMainInfo.newMainInfo.UrgentContactNo
          });
        }
      }

      let shouldUpdateInformation = updatedFieldName_arr.some(u => informationKeyNames.indexOf(u) >= 0);
      if (shouldUpdateInformation) {
        sapData.information = [{
          actio: 'MOD',
          natio: dt.update.userProfileHistoryMainInfo.newMainInfo.Nationality == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.Nationality : dt.update.userProfileHistoryMainInfo.newMainInfo.Nationality,
          gblnd: dt.update.userProfileHistoryMainInfo.newMainInfo.Nationality == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.Nationality : dt.update.userProfileHistoryMainInfo.newMainInfo.Nationality,
          konfe: dt.update.userProfileHistoryMainInfo.newMainInfo.Religion == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.Religion : dt.update.userProfileHistoryMainInfo.newMainInfo.Religion,
          gbdep: dt.update.userProfileHistoryMainInfo.newMainInfo.Province == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.Province : dt.update.userProfileHistoryMainInfo.newMainInfo.Province,
          famst: dt.update.userProfileHistoryMainInfo.newMainInfo.MaritalStatus == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.MaritalStatus : dt.update.userProfileHistoryMainInfo.newMainInfo.MaritalStatus,
          gesch: dt.update.userProfileHistoryMainInfo.newMainInfo.Gender == undefined ? dt.update.userProfileHistoryMainInfo.oldMainInfo.Gender : dt.update.userProfileHistoryMainInfo.newMainInfo.Gender,
          kdate: moment().format('YYYYMMDD')
        }];
      }

      let shouldUpdateEducation = updatedFieldName_arr.some(u => educationKeyNames.indexOf(u) >= 0);
      if (shouldUpdateEducation) {
        sapData.education = [];
        if (dt.update.userProfileHistoryEducation.length > 0) {
          dt.update.userProfileHistoryEducation.map((item, index) => {
            sapData.education.push({
              actio: 'MOD',
              slart: item.newMainInfo.DegreeType == undefined ? item.oldMainInfo.DegreeType : item.newMainInfo.DegreeType,
              zausbi: item.newMainInfo.MajorCode == undefined ? dt.item.oldMainInfo.MajorCode : dt.newMainInfo.MajorCode,
              zinstitute: item.newMainInfo.SchoolCode == undefined ? dt.item.oldMainInfo.SchoolCode : dt.newMainInfo.SchoolCode,
              zortherinst: item.newMainInfo.SchoolName == undefined ? dt.item.oldMainInfo.SchoolName : dt.newMainInfo.SchoolName,
              begda: item.newMainInfo.FromTime == undefined ? dt.item.oldMainInfo.FromTime : dt.newMainInfo.FromTime,
              endda: item.newMainInfo.ToTime == undefined ? dt.item.oldMainInfo.ToTime : dt.newMainInfo.ToTime,
              kdate: moment().format('YYYYMMDD')
            });
          });
        }
        if (dt.create.educations.length > 0) {
          dt.create.educations.map((item, index) => {
            sapData.education.push({
              actio: 'INS',
              slart: item.DegreeType,
              zausbi: item.MajorCode,
              zinstitute: item.SchoolCode,
              zortherinst: item.SchoolName,
              begda: item.FromTime,
              endda: item.ToTime,
              kdate: moment().format('YYYYMMDD')
            });
          });
        }
      }
      return sapData;
    }
  }
    sendRequest = () => {
      const updateFields = this.getFieldUpdates();
      let bodyFormData = new FormData();
      bodyFormData.append('Name', this.getNameFromData(this.state.data));
      bodyFormData.append('Comment', "Tôi muốn update thông tin Họ tên");
      bodyFormData.append('UserProfileInfo', JSON.stringify(this.state.data));
      let sapData = this.formatSapData(this.state.data, updateFields);
      bodyFormData.append('UserProfileInfoToSap', JSON.stringify(sapData));
      bodyFormData.append('UpdateField', JSON.stringify(updateFields));
      //bodyFormData.append('Region', localStorage.getItem('region'));
      const fileSelected = this.state.files;
      for (let key in fileSelected) {
        bodyFormData.append('Files', fileSelected[key]);
      }
      let url = `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.getUserProfileHistoryId()}/update`;
      axios({
        method: 'POST',
        url: url,
        data: bodyFormData,
        headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
      })
        .then(response => {
          console.log(response);
          if (response && response.data && response.data.result) {
            const code = response.data.result.code;
            if (code == "999") {
              this.handleShowModal("Lỗi", "Thông tin đang trong quá trình xử lý !", "error");
            } else {
              this.handleShowModal("Thành công", "Cập nhật thông tin đã được lưu !", "success");
            }
          }
        })
        .catch(response => {
          this.handleShowModal("Lỗi", "Có lỗi xảy ra trong quá trình cập nhật thông tin !", "error");
        });
    }

    fileUploadInputChange = () => {
      const files = Object.keys(this.inputReference.current.files).map((key) => this.inputReference.current.files[key])
      this.setState({ files: this.state.files.concat(files) })
    }

    fileUploadAction =() => {
      this.inputReference.current.click()
    }

    removeFile = (index) => {
      this.setState({ files: [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1)] })
    }

    handleShowModal = (title, message, status) => {
      this.setState({
        isShowModalConfirm: true,
        modalTitle: title,
        modalMessage: message,
        confirmStatus: status
      });
    }

    getFieldUpdates = () => {
      const fieldsUpdate = this.state.data.update;
      const mainInfos = fieldsUpdate.userProfileHistoryMainInfo.NewMainInfo || {};
      let educations = {};
      if (fieldsUpdate.userProfileHistoryEducation && fieldsUpdate.userProfileHistoryEducation.NewEducation) {
        educations = fieldsUpdate.userProfileHistoryEducation.NewEducation;
      }
      let families = {}
      if (fieldsUpdate.userProfileHistoryFamily && fieldsUpdate.userProfileHistoryFamily.NewFamily) {
        families = fieldsUpdate.userProfileHistoryFamily.NewFamily;
      }
      const mainInfoKeys = this.convertObjectKeyToArray(mainInfos);
      const educationKeys = this.convertObjectKeyToArray(educations);
      const familyKeys = this.convertObjectKeyToArray(families);

      return { UpdateField: mainInfoKeys.concat(educationKeys, familyKeys) };
    }

    convertObjectKeyToArray = (obj) => {
      if (Object.keys(obj).length > 0) {
        return Object.keys(obj);
      }
      return [];
    }

    updateEducation = (educationNew) => {
      // this.setState({
      //   data: {
      //     ...this.state.data,
      //     create: {
      //       educations: [...educationNew]
      //     }
      // });
      console.log('new ======================');
      console.log(educationNew);
      console.log('old ======================');
      console.log(this.state.userEducation);
    }

    addEducation = (value) => {
      this.setState({
        data: {
          ...this.state.data,
          create: {
            educations: [...value]
          }
        }
      });
      console.log('new')
      console.log(value)
    }

    getNameFromData = (data) => {
      const nameArray = {
        FullName: "Họ và tên",
        InsuranceNumber: "Số sổ bảo hiểm",
        TaxNumber: "Mã số thuế",
        Birthday: "Ngày sinh",
        Gender: "Giới tính",
        Ethinic: "Dân tộc",
        Religion: "Tôn giáo",
        PassportNo: "Số CMND/CCCD/Hộ chiếu",
        DateOfIssue: "Ngày cấp",
        PlaceOfIssue: "Nơi cấp",
        Nationality: "Quốc tịch",
        MaritalStatus: "Tình trạng hôn nhân",
        WorkPermitNo: "Số giấy phép lao động",
        ExpiryDate: "Ngày hết hạn",
        PersonalEmail: "Email cá nhân",
        CellPhoneNo: "Điện thoại di động",
        UrgentContactNo: "Điện thoại khẩn cấp",
        BankAccountNumber: "Số tài khoản ngân hàng"
      }
      const userProfileHistoryMainInfo = data.update.userProfileHistoryMainInfo || {};
      const newItems = userProfileHistoryMainInfo.NewMainInfo || {};
      let labelArray = [];

      Object.keys(newItems).forEach(function (key) {
        labelArray.push(nameArray[key]);
      });

      return labelArray.join(" - ");
    }

    onHideModalConfirm = () => {
      this.setState({ isShowModalConfirm: false });
    }

    approval = () => {
      this.setState({
        modalTitle: "Xác nhận gửi yêu cầu",
        modalMessage: "Thêm ghi chú (Không bắt buộc)",
        typeRequest: 2
      });
      this.onShowModalConfirm();
    }

    onShowModalConfirm = () => {
      this.setState({ isShowModalConfirm: true });
    }

    mappingDataToProps = (props) => {
      if ((props && props.education && props.education.length > 0) || (props && props.newEducation && props.newEducation.length > 0) || (props.information)) {
        let st = { information: {}, education: [], newEducation: [] };
        if (props.education) {
          let educations = [];
          props.education.forEach((item, index) => {
            let educationItem = {};
            if (item.DegreeType) {
              educationItem.education_level_id = item.DegreeType;
            }
            if (item.SchoolCode) {
              educationItem.school_id = item.SchoolCode;
            }
            if (item.SchoolName) {
              educationItem.other_uni_name = item.SchoolName;
            }
            if (item.MajorCode) {
              educationItem.major_id = item.MajorCode;
            }
            if (item.FromTime) {
              educationItem.from_time = item.FromTime;
            }
            if (item.ToTime) {
              educationItem.to_time = item.ToTime;
            }
            educations.push(educationItem);
          });
          st.education = educations;
        }
        if (props.newEducation && props.newEducation.length > 0) {
          let newUserEducation = [];
          props.newEducation.forEach((item, index) => {
            let newEducationItem = {};
            if (item.DegreeType) {
              newEducationItem.education_level_id = item.DegreeType;
            }
            if (item.SchoolCode) {
              newEducationItem.school_id = item.SchoolCode;
            }
            if (item.SchoolName) {
              newEducationItem.other_uni_name = item.SchoolName;
            }
            if (item.MajorCode) {
              newEducationItem.major_id = item.MajorCode;
            }
            if (item.FromTime) {
              newEducationItem.from_time = item.FromTime;
            }
            if (item.ToTime) {
              newEducationItem.to_time = item.ToTime;
            }
            newUserEducation.push(newEducationItem);
          });
          st.newEducation = newUserEducation;
        }

        if (props.information) {
          {
            let changingDataWithCamelCase = convertObjectkeyToCamelCase(props.information);
            if (changingDataWithCamelCase.birthProvince) {
              changingDataWithCamelCase.province_id = changingDataWithCamelCase.birthProvince;
            }
            if (changingDataWithCamelCase.ethinic) {
              changingDataWithCamelCase.race_id = changingDataWithCamelCase.ethinic;
            }
            // if (changingDataWithCamelCase.religion) {
            //     changingDataWithCamelCase.religion = changingDataWithCamelCase.religion;
            // }
            if (changingDataWithCamelCase.passportNo) {
              changingDataWithCamelCase.passport_no = changingDataWithCamelCase.passportNo;
            }
            if (changingDataWithCamelCase.dateOfIssue) {
              changingDataWithCamelCase.date_of_issue = changingDataWithCamelCase.dateOfIssue;
            }
            if (changingDataWithCamelCase.placeOfIssue) {
              changingDataWithCamelCase.place_of_issue = changingDataWithCamelCase.placeOfIssue;
            }
            if (changingDataWithCamelCase.streetName) {
              changingDataWithCamelCase.street_name = changingDataWithCamelCase.streetName;
            }
            if (changingDataWithCamelCase.wards) {
              changingDataWithCamelCase.ward_id = changingDataWithCamelCase.wards;
            }
            if (changingDataWithCamelCase.district) {
              changingDataWithCamelCase.district_id = changingDataWithCamelCase.district;
            }
            if (changingDataWithCamelCase.province) {
              changingDataWithCamelCase.province_id = changingDataWithCamelCase.province;
            }
            if (changingDataWithCamelCase.nationality) {
              changingDataWithCamelCase.country_id = changingDataWithCamelCase.nationality;
            }
            if (changingDataWithCamelCase.tempStreetName) {
              changingDataWithCamelCase.tmp_street_name = changingDataWithCamelCase.tempStreetName;
            }
            if (changingDataWithCamelCase.tempWards) {
              changingDataWithCamelCase.tmp_ward_id = changingDataWithCamelCase.tempWards;
            }
            if (changingDataWithCamelCase.tempDistrict) {
              changingDataWithCamelCase.tmp_district_id = changingDataWithCamelCase.tempDistrict;
            }
            if (changingDataWithCamelCase.tempProvince) {
              changingDataWithCamelCase.tmp_province_id = changingDataWithCamelCase.tempProvince;
            }
            if (changingDataWithCamelCase.nationality) {
              changingDataWithCamelCase.tmp_country_id = changingDataWithCamelCase.nationality;
            }
            if (changingDataWithCamelCase.maritalStatus) {
              changingDataWithCamelCase.marital_status_code = changingDataWithCamelCase.maritalStatus;
            }
            if (changingDataWithCamelCase.personalEmail) {
              changingDataWithCamelCase.personal_email = changingDataWithCamelCase.personalEmail;
            }
            if (changingDataWithCamelCase.cellPhoneNo) {
              changingDataWithCamelCase.cell_phone_no = changingDataWithCamelCase.cellPhoneNo;
            }
            if (changingDataWithCamelCase.urgentContactNo) {
              changingDataWithCamelCase.urgent_contact_no = changingDataWithCamelCase.urgentContactNo;
            }
            if (changingDataWithCamelCase.bankAccountNumber) {
              changingDataWithCamelCase.bank_number = changingDataWithCamelCase.bankAccountNumber;
            }
            if (changingDataWithCamelCase.bankCode) {
              changingDataWithCamelCase.bank_name_id = changingDataWithCamelCase.bankCode;
            }
            st.information = changingDataWithCamelCase;
          }
          return st;
        }
      }
    }
    //#endregion private function ============

    async componentDidMount() {
      let config = {
        headers: {
          'Authorization': localStorage.getItem('accessToken')
        }
      }

      try {
        let masterData = await axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/profileinfobase`, config);
        let changingData = await axios.get(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.getUserProfileHistoryId()}`, config);
        if (changingData && changingData.data && changingData.data.data && changingData.data.data.userProfileInfo) {
          let dt = { information: {}, education: [], newEducation: [] };
          if (changingData.data.data.userProfileInfo.update && changingData.data.data.userProfileInfo.update.userProfileHistoryMainInfo && changingData.data.data.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo) {
            dt.information = changingData.data.data.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo;
          }
          if (changingData.data.data.userProfileInfo) {
            this.setState({
              data: changingData.data.data.userProfileInfo
            });
          }
          if (changingData.data.data.userProfileInfo.update && changingData.data.data.userProfileInfo.update.userProfileHistoryEducation && changingData.data.data.userProfileInfo.update.userProfileHistoryEducation.NewEducation) {
            dt.education = changingData.data.data.userProfileInfo.update.userProfileHistoryEducation.NewEducation;
          }
          if (changingData.data.data.userProfileInfo.create && changingData.data.data.userProfileInfo.create.educations) {
            dt.newEducation.push(changingData.data.data.userProfileInfo.create.educations);
          }

          let dataMappingToProps = this.mappingDataToProps(dt);
          this.store.dispatch(updatePersonalDataAction(dataMappingToProps));
        }

        if (masterData && masterData.data && masterData.data.data) {
          const data = masterData.data.data
          const banks = data.filter(d => d.TYPE === 'BANK')
          const nations = data.filter(d => d.TYPE === 'NATION')
          const countries = data.filter(d => d.TYPE === 'COUNTRY')
          const educationLevels = data.filter(d => d.TYPE === 'EDUCATION_LEVEL')
          const races = data.filter(d => d.TYPE === 'RACE')
          const certificates = data.filter(d => d.TYPE === 'CERTIFICATE')
          const genders = data.filter(d => d.TYPE === 'GENDER')
          const majors = data.filter(d => d.TYPE === 'MAJOR')
          const marriages = data.filter(d => d.TYPE === 'MARRIAGE')
          const religions = data.filter(d => d.TYPE === 'RELIGION')
          const schools = data.filter(d => d.TYPE === 'SCHOOL')
          const documentTypes = data.filter(d => d.TYPE === 'PERSONALDOCUMENT')

          this.setState({
            banks: banks,
            nations: nations,
            races: races,
            certificates: certificates,
            countries: countries,
            educationLevels: educationLevels,
            genders: genders,
            majors: majors,
            marriages: marriages,
            religions: religions,
            schools: schools,
            documentTypes: documentTypes
          })
        }
      }
      catch (e) {
        console.log(e);
      }

      // axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/profileinfobase`, config)
      //   .then(res => {
      //     if (res && res.data && res.data.data) {
      //       const data = res.data.data
      //       const banks = data.filter(d => d.TYPE === 'BANK')
      //       const nations = data.filter(d => d.TYPE === 'NATION')
      //       const countries = data.filter(d => d.TYPE === 'COUNTRY')
      //       const educationLevels = data.filter(d => d.TYPE === 'EDUCATION_LEVEL')
      //       const races = data.filter(d => d.TYPE === 'RACE')
      //       const certificates = data.filter(d => d.TYPE === 'CERTIFICATE')
      //       const genders = data.filter(d => d.TYPE === 'GENDER')
      //       const majors = data.filter(d => d.TYPE === 'MAJOR')
      //       const marriages = data.filter(d => d.TYPE === 'MARRIAGE')
      //       const religions = data.filter(d => d.TYPE === 'RELIGION')
      //       const schools = data.filter(d => d.TYPE === 'SCHOOL')
      //       const documentTypes = data.filter(d => d.TYPE === 'PERSONALDOCUMENT')

      //       this.setState({
      //         banks: banks,
      //         nations: nations,
      //         races: races,
      //         certificates: certificates,
      //         countries: countries,
      //         educationLevels: educationLevels,
      //         genders: genders,
      //         majors: majors,
      //         marriages: marriages,
      //         religions: religions,
      //         schools: schools,
      //         documentTypes: documentTypes
      //       })
      //     }
      //   }).catch(error => {
      //   });
    }

    render() {
      return (
        <Provider store={this.store}>
          <div className="edit-personal-detail-request">
            <ConfirmationModal show={this.state.isShowModalConfirm} title={this.state.modalTitle} type={this.state.typeRequest} message={this.state.modalMessage}
              confirmStatus={this.state.confirmStatus} onHide={this.onHideModalConfirm} />
            <Form className="create-notification-form" id="create-notification-form" encType="multipart/form-data">

              <PersonalComponent userDetail={this.state.userDetail}
                userProfile={this.state.userProfile}
                removeInfo={this.removePersonalInfo.bind(this)}
                updateInfo={this.updatePersonalInfo.bind(this)}
                setState={this.setState.bind(this)}
                genders={this.state.genders}
                races={this.state.races}
                marriages={this.state.marriages}
                nations={this.state.nations}
                banks={this.state.banks}
                countries={this.state.countries}
                religions={this.state.religions}
                documentTypes={this.state.documentTypes}
                mappingFieldsToGetSapKey={this.mappingFieldsToGetSapKey}
              />
              <EducationComponent
                userEducation={this.state.userEducation}
                setState={this.setState.bind(this)}
                certificates={this.state.certificates}
                educationLevels={this.state.educationLevels}
                majors={this.state.majors}
                schools={this.state.schools}
                updateEducation={this.updateEducation.bind(this)}
                addEducation={this.addEducation.bind(this)}
                mappingFieldsToGetSapKey={this.mappingFieldsToGetSapKey}
              />

              <ul className="list-inline">
                {this.state.files.map((file, index) => {
                  return <li className="list-inline-item" key={index}>
                    <span className="file-name">{file.name} <i className="fa fa-times remove" aria-hidden="true" onClick={this.removeFile.bind(this, index)}></i></span>
                  </li>
                })}
              </ul>

              <div className="clearfix mb-5">
                {/* <button type="button" className="btn btn-primary float-right ml-3 shadow" onClick={this.showConfirm.bind(this, 'isConfirm')}><i className="fa fa-paper-plane" aria-hidden="true"></i>  Gửi yêu cầu</button> */}
                <button type="button" className="btn btn-primary float-right ml-3 shadow" onClick={this.sendRequest}><i className="fa fa-paper-plane" aria-hidden="true"></i>  Gửi yêu cầu</button>
                <input type="file" hidden ref={this.inputReference} id="file-upload" name="file-upload[]" onChange={this.fileUploadInputChange.bind(this)} multiple />
                <button type="button" className="btn btn-light float-right shadow" onClick={this.fileUploadAction.bind(this)}><i className="fas fa-paperclip"></i> Đính kèm tệp tin</button>
              </div>
            </Form>
          </div>
        </Provider>
      )
    }
  }
  export default PersonalInfoEdit

// const mapStateToProps = (state, ownProps) => {
//   return {

//   }
// }

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {

//   }
// }
// export default connect(mapStateToProps, mapDispatchToProps)(PersonalInfoEdit);
