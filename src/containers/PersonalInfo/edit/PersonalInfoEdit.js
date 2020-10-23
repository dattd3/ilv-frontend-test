import React from 'react'
import { Form } from 'react-bootstrap'
import PersonalComponent from './PersonalComponent'
import EducationComponent from './EducationComponent'
import FamilyComponent from './FamilyComponent'
import ConfirmationModal from './ConfirmationModal'
import ResultModal from './ResultModal'
import axios from 'axios'
import _ from 'lodash'
import moment from 'moment'

const code = localStorage.getItem('employeeNo') || "";
const fullName = localStorage.getItem('fullName') || "";
const title = localStorage.getItem('jobTitle') || "";
const department = localStorage.getItem('department') || "";

class PersonalInfoEdit extends React.Component {
    constructor() {
        super();
        const staff = {
          code: code,
          fullName: fullName,
          title: title,
          department: department
        }
        this.state = {
            id: null,
            isEdit: false,
            requestedUserProfile: null,
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
            create: [],
            userProfileHistoryMainInfo: {},
            userProfileHistoryEducation: [],
            educations: [],
            OldMainInfo: {},
            NewMainInfo: {},
            data: {
              staff: staff,
              manager: {}
            },
            isShowModalConfirm: false,
            isShowResultConfirm: false,
            modalTitle: "",
            modalMessage: "",
            confirmStatus: "",
            isSuccess: true,
            errors: {},
        }
        this.inputReference = React.createRef()

        this.objectToSap = {
          myvp_id: "",
          user_name: localStorage.getItem('email').split("@")[0] || "",
          kdate: "",
          pernr: localStorage.getItem('employeeNo')
        };
    }

    componentDidMount() {
      let config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
          'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
        }
      }
  
      axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/profileinfobase`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          const data = res.data.data
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
      }).catch(error => {
        
      })

      axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/education`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          this.setState({ userEducation: res.data.data });
        }
      }).catch(error => {

      })

      if (this.props.requestedUserProfile) {
        const userProfileInfo = this.props.requestedUserProfile.userProfileInfo;
        let oldMainInfo = {}
        let newMainInfo = {}
        if (userProfileInfo && userProfileInfo.update && userProfileInfo.update.userProfileHistoryMainInfo) {
          oldMainInfo = userProfileInfo.update.userProfileHistoryMainInfo.OldMainInfo
          newMainInfo = userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo
        }

        this.setState({
          isEdit: true,
          id: this.props.requestedUserProfile.id,
          requestedUserProfile: this.props.requestedUserProfile,
          data: userProfileInfo,
          OldMainInfo: oldMainInfo,
          NewMainInfo: newMainInfo
        })
      }
    }

    updateAddress(oldAddress, newAddress) {
      let data = {...this.state.data}
      if (data && data.update && data.update.userProfileHistoryMainInfo) {
        const userProfileHistoryMainInfo = data.update.userProfileHistoryMainInfo
        const oldMainInfo = userProfileHistoryMainInfo.OldMainInfo
        const newMainInfo = userProfileHistoryMainInfo.NewMainInfo
        data.update.userProfileHistoryMainInfo.OldMainInfo = Object.assign(oldMainInfo, oldAddress)
        data.update.userProfileHistoryMainInfo.NewMainInfo = Object.assign(newMainInfo, newAddress)
        this.setState({ data : data})
      } else {
        let data = {...this.state.data}
        data.update = {
          userProfileHistoryMainInfo : {
            OldMainInfo: oldAddress,
            NewMainInfo: newAddress
          }
        }
        this.setState({ data : data})
      }
    }

    updatePersonalInfo(name, old, value, textOld, textNew) {
      let textForSelectOption = name + "Text";
      let oldMainInfo = {};
      let newMainInfo = {};
      if (textOld != null && textOld != "" && textNew != null && textNew != "") {
        oldMainInfo = { ...this.state.OldMainInfo, [name]: old, [textForSelectOption]: textOld };
        newMainInfo = { ...this.state.NewMainInfo, [name]: value, [textForSelectOption]: textNew };
      } else {
        oldMainInfo = { ...this.state.OldMainInfo, [name]: old };
        newMainInfo = { ...this.state.NewMainInfo, [name]: value };
      }
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
      if (this.state.personalUpdating && this.state.personalUpdating.NewMainInfo && this.state.personalUpdating.NewMainInfo[name] && this.state.personalUpdating.OldMainInfo[name]) {
        let personalUpdating = Object.assign({}, this.state.personalUpdating)
        delete personalUpdating.NewMainInfo[name];
        delete personalUpdating.OldMainInfo[name];
        this.setState({personalUpdating: Object.assign({}, personalUpdating)})
      }
    }

    showConfirm(name) {
      this.setState({[name]: true})
    }

    hideConfirm(name) {
      this.setState({[name]: false})
    }

    fileUploadAction() {
      this.inputReference.current.click()
    }

    fileUploadInputChange() {
      const files = Object.keys(this.inputReference.current.files).map((key) => this.inputReference.current.files[key])
      this.setState({files: this.state.files.concat(files) })
    }

    removeFile(index) {
      this.setState({ files: [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1) ] })
    }

    error = (name) => {
      return this.state.errors[name] ? <p className="text-danger">{this.state.errors[name]}</p> : null
    }

    isValidFileUpload = (data) => {
      const dataPostToSAP = this.getDataPostToSap(data);
      if (dataPostToSAP && dataPostToSAP.contact && _.size(dataPostToSAP.contact) > 0 && _.size(dataPostToSAP.information) == 0 && _.size(dataPostToSAP.address) == 0 
        && _.size(dataPostToSAP.bank) == 0 && _.size(dataPostToSAP.education) == 0 && _.size(dataPostToSAP.race) == 0 && _.size(dataPostToSAP.document) == 0) {
          return true
      } else {
        if (_.size(this.state.files) === 0) {
          return false
        }
        return true;
      }
    }

    isValidEmail = (email) => {
      const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
      return filter.test(email) ? true : false
    }

    isValidPhoneNumber = (phone) => {
      const filter = /[^a-zA-Z]+/
      return phone.search(filter) ? false : true
    }

    getValidationEducationItem = (education) => {
      let obj = {}
      if ((education.FromTime || education.ToTime || education.MajorCode || education.OtherMajor || education.OtherSchool || education.SchoolCode) && !education.DegreeType) {
        obj.degreeType = '(Loại bằng cấp là bắt buộc)'
      }
      if ((education.DegreeType || education.ToTime || education.MajorCode || education.OtherMajor || education.OtherSchool || education.SchoolCode) && !education.FromTime) {
        obj.fromTime = '(Thời gian bắt đầu là bắt buộc)'
      }
      if ((education.DegreeType || education.FromTime || education.MajorCode || education.OtherMajor || education.OtherSchool || education.SchoolCode) && !education.ToTime) {
        obj.toTime = '(Thời gian kết thúc là bắt buộc)'
      }
      if ((education.FromTime || education.ToTime || education.MajorCode || education.OtherMajor || education.DegreeType) && (!education.OtherSchool && !education.SchoolCode)) {
        obj.school = '(Trường học là bắt buộc)'
      }
      if ((education.FromTime || education.ToTime || education.OtherSchool || education.SchoolCode || education.DegreeType) && (!education.MajorCode && !education.OtherMajor)) {
        obj.major = '(Chuyên môn là bắt buộc)'
      }
      return obj
    }

    getValidationEducationObj = (education, type) => {
      let obj = {}
      if (type === "create") {
        obj = this.getValidationEducationItem(education)
      } else if (type === "update") {
        const educationUpdate = education.NewEducation
        obj = this.getValidationEducationItem(educationUpdate)
      }
      return obj
    }

    verifyInput = (data) => {
      let errors = {}
      let newMainInfo = {}
      const isValidFileUpload = this.isValidFileUpload(data)
  
      if (!isValidFileUpload) {
        errors.fileUpload = '(Thông tin file đính kèm là bắt buộc)'
      }

      if (data && data.update) {
        const update = data.update
        if (update.userProfileHistoryMainInfo) {
          newMainInfo = update.userProfileHistoryMainInfo.NewMainInfo
          if (newMainInfo.PersonalEmail && !this.isValidEmail(newMainInfo.PersonalEmail)) {
            errors.personalEmail = '(Email cá nhân không đúng định dạng)'
          }
          if (newMainInfo.CellPhoneNo && !this.isValidPhoneNumber(newMainInfo.CellPhoneNo)) {
            errors.cellPhoneNo = '(Điện thoại di động không đúng định dạng)'
          }
          if (newMainInfo.BirthCountry && !newMainInfo.BirthProvince) {
            errors.birthProvince = '(Nơi sinh là bắt buộc)'
          }
          if ((newMainInfo.MaritalStatus && newMainInfo.MaritalStatus !== "") && !newMainInfo.MarriageDate) {
            errors.maritalDate = '(Ngày của TT hôn nhân là bắt buộc)'
          } else if ((newMainInfo.MaritalStatus == null || newMainInfo.MaritalStatus === "" ) && newMainInfo.MarriageDate) {
            errors.maritalStatus = '(Tình trạng hôn nhân là bắt buộc)'
          }
          if (newMainInfo.Bank && !newMainInfo.BankAccountNumber) {
            errors.bankAccountNumber = '(Số TK ngân hàng là bắt buộc)'
          } else if (newMainInfo.BankAccountNumber && !newMainInfo.Bank) {
            errors.bank = '(Tên ngân hàng là bắt buộc)'
          }
          if ((newMainInfo.PassportNumber || newMainInfo.PassportPlace) && !newMainInfo.PassportDate) {
            errors.passportDate = '(Ngày cấp hộ chiếu là bắt buộc)'
          }
          if ((newMainInfo.PassportDate || newMainInfo.PassportPlace) && !newMainInfo.PassportNumber) {
            errors.passportNumber = '(Số hộ chiếu là bắt buộc)'
          }
          if ((newMainInfo.PassportDate || newMainInfo.PassportNumber) && !newMainInfo.PassportPlace) {
            errors.passportPlace = '(Nơi cấp hộ chiếu là bắt buộc)'
          }
          if ((newMainInfo.PersonalIdentifyNumber || newMainInfo.PersonalIdentifyPlace) && !newMainInfo.PersonalIdentifyDate) {
            errors.personalIdentifyDate = '(Ngày cấp CMND/CCCD là bắt buộc)'
          }
          if ((newMainInfo.PersonalIdentifyDate || newMainInfo.PersonalIdentifyPlace) && !newMainInfo.PersonalIdentifyNumber) {
            errors.personalIdentifyNumber = '(Số CMND/CCCD là bắt buộc)'
          }
          if ((newMainInfo.PersonalIdentifyDate || newMainInfo.PersonalIdentifyNumber) && !newMainInfo.PersonalIdentifyPlace) {
            errors.personalIdentifyPlace = '(Nơi cấp CMND/CCCD là bắt buộc)'
          }
        }
        if (update.userProfileHistoryEducation) {
          const educationUpdated = update.userProfileHistoryEducation
          errors.update = []
          for (let i = 0, len = educationUpdated.length; i < len; i++) {
            const education = educationUpdated[i]
            let obj = this.getValidationEducationObj(education, "update")
            errors.update = errors.update.concat(obj)
          }
        }
      }

      if (data && data.create && data.create.educations && data.create.educations.length > 0) {
        const educationCreated = data.create.educations
        errors.create = []
        for (let i = 0, len = educationCreated.length; i < len; i++) {
          const education = educationCreated[i]
          let obj = this.getValidationEducationObj(education, "create")
          errors.create = errors.create.concat(obj)
        }
      }
      this.setState({ errors: errors })
      return errors
  }

    submitRequest = (comment) => {
      const errors = this.verifyInput(this.state.data)
      if (!_.isEmpty(errors)) {
        return
      }

      const updateFields = this.getFieldUpdates();
      const dataPostToSAP = this.getDataPostToSap(this.state.data);
      let bodyFormData = new FormData();
      bodyFormData.append('Name', this.getNameFromData(this.state.data));
      bodyFormData.append('Comment', comment);
      bodyFormData.append('UserProfileInfo', JSON.stringify(this.state.data));
      bodyFormData.append('UpdateField', JSON.stringify(updateFields));
      bodyFormData.append('Region', localStorage.getItem('region'));
      bodyFormData.append('UserProfileInfoToSap', JSON.stringify(dataPostToSAP));
      const fileSelected = this.state.files;
      for(let key in fileSelected) {
        bodyFormData.append('Files', fileSelected[key]);
      }
      const urlSubmit = this.state.isEdit ? `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.state.id}/update` : `${process.env.REACT_APP_REQUEST_URL}user-profile-histories`;

      axios({
        method: 'POST',
        url: urlSubmit,
        data: bodyFormData,
        headers: {'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
      })
      .then(response => {
        this.setState({isShowModalConfirm: false});
        if (response && response.data && response.data.result) {
          const code = response.data.result.code;
          if (code == "999") {
            this.handleShowResultModal("Lỗi", response.data.result.message, false);
          } else {
            this.handleShowResultModal("Thành công", "Yêu cầu của bạn đã được gửi đi!", true);
          }
        }
      })
      .catch(response => {
        this.handleShowResultModal("Lỗi", "Có lỗi xảy ra trong quá trình cập nhật thông tin !", false);
      });
    }

    resetValueInValid = value => {
      return (value == undefined || value == null || value == 'null' || value == '#') ? "" : value;
    }

    isNullCustomize = value => {
      return (value == undefined || value == null || value == 'null' || value == '#' || value == "" || value == "00000000")
    }

    prepareNationalityAndBirthCountry = (newMainInfo, userDetail) => {
      return [
        newMainInfo.BirthCountry ? newMainInfo.BirthCountry : this.resetValueInValid(userDetail.birth_country_id),
        newMainInfo.Nationality ? newMainInfo.Nationality : this.resetValueInValid(userDetail.nationality_id)
      ]
    }

    prepareBirthday = (newMainInfo, userDetail) => {
      return newMainInfo.Birthday ? moment(newMainInfo.Birthday, 'DD-MM-YYYY').format('YYYYMMDD') : moment(this.resetValueInValid(userDetail.birthday), 'DD-MM-YYYY').format('YYYYMMDD')
    }

    prepareBirthProvince = (newMainInfo, userDetail) => {
      return newMainInfo.BirthProvince ? newMainInfo.BirthProvince : this.resetValueInValid(userDetail.province_id);
    }

    getMaritalDateForStatus = (status, newMaritalDate, oldMaritalDate) => {
      if (status == 0) { // Single
        return "";
      } else { // #Single
        return this.isNullCustomize(newMaritalDate) ? moment(oldMaritalDate, 'DD-MM-YYYY').format('YYYYMMDD') : moment(newMaritalDate, 'DD-MM-YYYY').format('YYYYMMDD');
      }
    }

    prepareMaritalInfo = (newMainInfo, userDetail) => {
      let data = [];
      if (newMainInfo.MaritalStatus) {
        const maritalStatus = newMainInfo.MaritalStatus;
        data[0] = maritalStatus;
        data[1] = this.getMaritalDateForStatus(maritalStatus, newMainInfo.MarriageDate, userDetail.marital_date);
      } else {
        data[0] = userDetail.marital_status_code;
        data[1] = this.getMaritalDateForStatus(userDetail.marital_status_code, newMainInfo.MarriageDate, userDetail.marital_date);
      }
      return data;
    }

    getDataSpecificFields = (newValue, oldValue) => {
      return newValue ? newValue : this.resetValueInValid(oldValue);
    }

    prepareInformationToSap = (data) => {
      if (data && data.update) {
        const update = data.update;
        if (update && update.userProfileHistoryMainInfo && update.userProfileHistoryMainInfo.NewMainInfo) {
          const newMainInfo = update.userProfileHistoryMainInfo.NewMainInfo;
          if (newMainInfo.Religion || newMainInfo.Birthday || newMainInfo.Nationality || newMainInfo.BirthProvince || newMainInfo.MaritalStatus || newMainInfo.Religion || newMainInfo.Gender) {
            const userDetail = this.state.userDetail;
            let obj = {...this.objectToSap};
            obj.actio = "MOD";
            obj.gbdat = this.prepareBirthday(newMainInfo, userDetail);
            const nationalityAndBirthCountry = this.prepareNationalityAndBirthCountry(newMainInfo, userDetail);
            obj.natio = nationalityAndBirthCountry[1];
            obj.gblnd = nationalityAndBirthCountry[0];
            obj.gbdep = this.prepareBirthProvince(newMainInfo, userDetail)
            const maritalInfo = this.prepareMaritalInfo(newMainInfo, userDetail);
            obj.famst = maritalInfo[0];
            obj.famdt = maritalInfo[1];
            obj.konfe = this.getDataSpecificFields(newMainInfo.Religion, userDetail.religion_id);
            obj.gesch = this.getDataSpecificFields(newMainInfo.Gender, userDetail.gender);
            return [obj];
          }
          return null;
        }
        return null;
      }
      return null;
    }

    prepareBankToSap = (data) => {
      if (data && data.update) {
        const update = data.update;
        if (update && update.userProfileHistoryMainInfo && update.userProfileHistoryMainInfo.NewMainInfo) {
          const newMainInfo = update.userProfileHistoryMainInfo.NewMainInfo;
          if (newMainInfo.BankAccountNumber || newMainInfo.Bank) {
            const userDetail = this.state.userDetail;
            let obj = {...this.objectToSap};
            obj.actio = "MOD";
            obj.bankn = this.getDataSpecificFields(newMainInfo.BankAccountNumber, userDetail.bank_number);
            obj.bankl = this.getDataSpecificFields(newMainInfo.Bank, userDetail.bank_name_id);
            return [obj];
          }
          return null;
        }
        return null;
      }
      return null;
    }

    prepareRaceToSap = (data) => {
      if (data && data.update) {
        const update = data.update;
        if (update && update.userProfileHistoryMainInfo && update.userProfileHistoryMainInfo.NewMainInfo) {
          const newMainInfo = update.userProfileHistoryMainInfo.NewMainInfo;
          if (newMainInfo.Ethinic) {
            const userDetail = this.state.userDetail;
            let obj = {...this.objectToSap};
            obj.actio = "MOD";
            obj.racky = this.getDataSpecificFields(newMainInfo.Ethinic, userDetail.race_id);
            return [obj];
          }
          return null;
        }
        return null;
      }
      return null;
    }

    prepareContactToSap = (data) => {
      if (data && data.update) {
        const update = data.update;
        if (update && update.userProfileHistoryMainInfo && update.userProfileHistoryMainInfo.NewMainInfo) {
          const newMainInfo = update.userProfileHistoryMainInfo.NewMainInfo;
          let listObj = [];
          const userDetail = this.state.userDetail;
          const that = this;
          Object.keys(newMainInfo).forEach(function(key) {
            if (key == "PersonalEmail" || key == "CellPhoneNo" || key == "UrgentContactNo") {
              let obj = {...that.objectToSap};
              obj.usrid_long = newMainInfo[key];
              if (key == "PersonalEmail") {
                if (that.isNullCustomize(userDetail.personal_email)) {
                  obj.actio = "INS";
                } else {
                  obj.actio = "MOD";
                }
                obj.subty = "0030";
              }else if (key == "CellPhoneNo") {
                if (that.isNullCustomize(userDetail.cell_phone_no)) {
                  obj.actio = "INS";
                } else {
                  obj.actio = "MOD";
                }
                obj.subty = "CELL";
              } else if (key == "UrgentContactNo") {
                if (that.isNullCustomize(userDetail.urgent_contact_no)) {
                  obj.actio = "INS";
                } else {
                  obj.actio = "MOD";
                }
                obj.subty = "V002";
              }
              listObj = [...listObj, obj];
            }
          });
          if (listObj.length > 0) {
            return listObj;
          }
          return null;
        }
        return null;
      }
      return null;
    }

    getOnlyAddress = (newMainInfo) => {
      return [
        newMainInfo.Province || "",
        newMainInfo.District || "",
        newMainInfo.Wards || "",
        newMainInfo.StreetName || "",
        newMainInfo.TempProvince || "",
        newMainInfo.TempDistrict || "",
        newMainInfo.TempWards || "",
        newMainInfo.TempStreetName || ""
      ]
    }

    prepareAddressToSap = (data) => {
      if (data && data.update) {
        const update = data.update;
        if (update && update.userProfileHistoryMainInfo && update.userProfileHistoryMainInfo.NewMainInfo) {
          const newMainInfo = update.userProfileHistoryMainInfo.NewMainInfo;
          if (newMainInfo.District || newMainInfo.Province || newMainInfo.Wards || newMainInfo.StreetName) {
            let addressArr = this.getOnlyAddress(newMainInfo);
            addressArr = _.chunk(addressArr, 4);
            let listObj = [];
            addressArr.forEach((item, index) => {
              let obj = {...this.objectToSap};
              obj.actio = "MOD";
              if (index == 0) {
                obj.anssa = "1";
                obj.land1 = "VN";
                obj.state = item[0];
                obj.zdistrict_id = item[1];
                obj.zwards_id = item[2];
                obj.stras = item[3];
                listObj = [...listObj, obj];
              } else {
                obj.anssa = "2";
                obj.land1 = "VN";
                obj.state = item[0];
                obj.zdistrict_id = item[1];
                obj.zwards_id = item[2];
                obj.stras = item[3];
                listObj = [...listObj, obj];
              }
            })
            if (listObj.length > 0) {
              return listObj;
            }
            return null;
          }
          return null;
        }
        return null;
      }
      return null;
    }

    prepareEducationToSap = (data) => {
      let listObj = [];
      if (data && data.update) {
        const update = data.update;
        if (update && update.userProfileHistoryEducation && update.userProfileHistoryEducation[0].NewEducation) {
          let educationUpdate = update.userProfileHistoryEducation;
          for (let i = 0, len = educationUpdate.length; i < len; i++) {
            const item = educationUpdate[i];
            if (item.NewEducation.SchoolCode || item.NewEducation.DegreeType || item.NewEducation.MajorCode || item.NewEducation.FromTime || item.NewEducation.ToTime) {
              const userEducation = this.state.userEducation;
              const subItem = userEducation[i];
              const schoolCode = item.NewEducation.SchoolCode;
              const majorCode = item.NewEducation.MajorCode;
              let obj = {...this.objectToSap};
              obj.actio = "MOD";
              if (userEducation && userEducation.length > 0) {
                obj.pre_begda = (subItem && subItem.from_time) ? moment(subItem.from_time, 'DD-MM-YYYY').format('YYYYMMDD') : "";
                obj.pre_endda = (subItem && subItem.to_time) ? moment(subItem.to_time, 'DD-MM-YYYY').format('YYYYMMDD') : "";
                obj.pre_seqnr = subItem ? subItem.seqnr : 0;
                obj.pre_slart = subItem ? subItem.education_level_id : "";
              }
              obj.begda = item.NewEducation.FromTime ? moment(item.NewEducation.FromTime, 'DD-MM-YYYY').format('YYYYMMDD') : "";
              obj.endda = item.NewEducation.ToTime ? moment(item.NewEducation.ToTime, 'DD-MM-YYYY').format('YYYYMMDD') : "";
              obj.slart = item.NewEducation.DegreeType;
              obj.zausbi = item.NewEducation.MajorCode;
              if (this.isNullCustomize(schoolCode)) {
                obj.zinstitute = "";
                obj.zortherinst = item.NewEducation.SchoolName || "";
              } else {
                obj.zinstitute = schoolCode;
                obj.zortherinst = "";
              }
              if (this.isNullCustomize(majorCode)) {
                obj.zausbi = "";
                obj.zzotherausbi = item.OtherMajor || "";
              } else {
                obj.zausbi = majorCode;
                obj.zzotherausbi = "";
              }
              listObj = [...listObj, obj];
            }
          }
        }
      }
      if (data && data.create && data.create.educations) {
        let create = data.create.educations;
        create.forEach(item => {
          let obj = {...this.objectToSap};
          const schoolCode = item.SchoolCode;
          const majorCode = item.MajorCode;
          obj.actio = "INS";
          obj.begda = item.FromTime ? moment(item.FromTime, 'DD-MM-YYYY').format('YYYYMMDD') : "";
          obj.endda = item.ToTime ? moment(item.ToTime, 'DD-MM-YYYY').format('YYYYMMDD') : "";
          obj.slart = item.DegreeType;
          if (this.isNullCustomize(schoolCode)) {
            obj.zortherinst = item.SchoolName || "";
          } else {
            obj.zinstitute = schoolCode;
          }
          if (this.isNullCustomize(majorCode)) {
            obj.zzotherausbi = item.OtherMajor || "";
          } else {
            obj.zausbi = majorCode;
          }
          listObj = [...listObj, obj];
        })
      }
      if (listObj.length > 0) {
        return listObj;
      }
      return null;
    }

    prepareDocumentToSap = (data) => {
      if (data && data.update) {
        const update = data.update;
        if (update && update.userProfileHistoryMainInfo) {
          const userProfileHistoryMainInfo = update.userProfileHistoryMainInfo;
          const passportInfo = this.preparePassportInfo(userProfileHistoryMainInfo);
          const personalIdentifyInfo = this.preparePersonalIdentifyInfo(userProfileHistoryMainInfo);
          if (passportInfo == null && personalIdentifyInfo == null) {
            return null;
          }
          let listObjDocuments = [];
          if (passportInfo) {
            listObjDocuments = listObjDocuments.concat(passportInfo);
          }
          if (personalIdentifyInfo) {
            listObjDocuments = listObjDocuments.concat(personalIdentifyInfo);
          }
          if (listObjDocuments && listObjDocuments.length > 0) {
            return listObjDocuments;
          }
          return null;
        }
        return null;
      }
      return null;
    }

    preparePassportInfo = (data) => {
      const newMainInfo = data.NewMainInfo;
      if (newMainInfo.PassportNumber || newMainInfo.PassportDate || newMainInfo.PassportPlace) {
        const userDetail = this.state.userDetail;
        const passportIdNo = userDetail.passport_id_no;
        let obj = {...this.objectToSap};
        obj.ictyp = "02";
        if (this.isNullCustomize(passportIdNo)) {
          obj.actio = "INS";
          obj.icnum = this.resetValueInValid(newMainInfo.PassportNumber) || "";
          obj.fpdat = newMainInfo.PassportDate ? moment(newMainInfo.PassportDate, 'DD-MM-YYYY').format('YYYYMMDD') : moment().format('YYYYMMDD');
          obj.isspl = this.resetValueInValid(newMainInfo.PassportPlace) || "";
        } else {
          obj.actio = "MOD";
          obj.icnum = this.resetValueInValid(newMainInfo.PassportNumber) || passportIdNo;
          obj.fpdat = newMainInfo.PassportDate ? moment(newMainInfo.PassportDate, 'DD-MM-YYYY').format('YYYYMMDD') : moment(userDetail.passport_date_of_issue, 'DD-MM-YYYY').format('YYYYMMDD');
          obj.isspl = this.resetValueInValid(newMainInfo.PassportPlace) || this.resetValueInValid(userDetail.passport_place_of_issue);
        }
        return obj;
      }
      return null;
    }

    preparePersonalIdentifyInfo = (data) => {
      const newMainInfo = data.NewMainInfo;
      if (newMainInfo.PersonalIdentifyNumber || newMainInfo.PersonalIdentifyDate || newMainInfo.PersonalIdentifyPlace) {
        const userDetail = this.state.userDetail;
        const personalIdNo = userDetail.personal_id_no;
        let obj = {...this.objectToSap};
        obj.ictyp = "01";
        if (this.isNullCustomize(personalIdNo)) {
          obj.actio = "INS";
          obj.icnum = this.resetValueInValid(newMainInfo.PersonalIdentifyNumber) || "";
          obj.fpdat = newMainInfo.PersonalIdentifyDate ? moment(newMainInfo.PersonalIdentifyDate, 'DD-MM-YYYY').format('YYYYMMDD') : moment().format('YYYYMMDD');
          obj.isspl = this.resetValueInValid(newMainInfo.PersonalIdentifyPlace) || "";
        } else {
          obj.actio = "MOD";
          obj.icnum = this.resetValueInValid(newMainInfo.PersonalIdentifyNumber) || personalIdNo;
          obj.fpdat = newMainInfo.PersonalIdentifyDate ? moment(newMainInfo.PersonalIdentifyDate, 'DD-MM-YYYY').format('YYYYMMDD') : moment(userDetail.pid_date_of_issue, 'DD-MM-YYYY').format('YYYYMMDD');
          obj.isspl = this.resetValueInValid(newMainInfo.PersonalIdentifyPlace) || this.resetValueInValid(userDetail.pid_place_of_issue);
        }
        return obj;
      }
      return null;
    }

    getDataPostToSap = (data) => {
      let model = {};
      const info = this.prepareInformationToSap(data);
      const addr = this.prepareAddressToSap(data);
      const bank = this.prepareBankToSap(data);
      const educ = this.prepareEducationToSap(data);
      const race = this.prepareRaceToSap(data);
      const cont = this.prepareContactToSap(data);
      const docu = this.prepareDocumentToSap(data);

      if (info != null) {
        model.information = info;
      }
      if (addr != null) {
        model.address = addr;
      }
      if (bank != null) {
        model.bank = bank;
      }
      if (educ != null) {
        model.education = educ;
      }
      if (race != null) {
        model.race = race;
      }
      if (cont != null) {
        model.contact = cont;
      }
      if (docu != null) {
        model.document = docu;
      }
      return model;
    }

    handleShowResultModal = (title, message, status) => {
      this.setState({
        isShowResultConfirm: true,
        modalTitle: title,
        modalMessage: message,
        isSuccess: status
      });
    }

    getFieldUpdates = () => {
      const data = this.state.data;
      if (data && data.update) {
        const fieldsUpdate = this.state.data.update;
        const mainInfos = (fieldsUpdate && fieldsUpdate.userProfileHistoryMainInfo) ? fieldsUpdate.userProfileHistoryMainInfo.NewMainInfo : {};
        let educations = {};
        if (fieldsUpdate.userProfileHistoryEducation && fieldsUpdate.userProfileHistoryEducation.length > 0) {
          educations = {Education: "Education"}
        }
        const mainInfoKeys = this.convertObjectKeyToArray(mainInfos);
        const educationKeys = this.convertObjectKeyToArray(educations);
        return { UpdateField: [].concat(mainInfoKeys, educationKeys) };
      }
    }

    convertObjectKeyToArray = (obj) => {
      if (Object.keys(obj).length > 0) {
        return Object.keys(obj);
      }
      return [];
    }

    prepareEducationModel = (data, action, type) => {
      let obj = {
        SchoolCode: data.school_id || "",
        SchoolName: data.university_name,
        OtherSchool: data.other_uni_name,
        DegreeType: data.education_level_id || "",
        MajorCode: data.major_id || "",
        OtherMajor: data.other_major || "",
        FromTime: data.from_time || "",
        ToTime: data.to_time || ""
      }
      let objClone = {...obj};
      if (action === "insert" || (action === "update" && type === "new")) {
        objClone.DegreeTypeText = data.degree_text || data.academic_level;
        objClone.MajorCodeText = data.major_name || "";
      } else {
        objClone.EducationId = data.education_id || "";
        objClone.PreBeginDate = data.old_from_time || data.from_time;
        objClone.PreEndDate = data.old_to_time || data.to_time;
        objClone.Seqnr = data.seqnr || 0;
        objClone.PreEducationLevelId = data.old_education_level_id || data.education_level_id;
        objClone.DegreeTypeText = data.academic_level || "";
        objClone.MajorCodeText = data.major || "";
      }
      return objClone;
    }

    preparePreEducation = (education) => {
      if (education && _.size(education) > 0) {
        return {
          schoolId: education.school_id,
          otherSchool: this.resetValueInValid(education.other_uni_name),
          majorId: education.major_id,
          otherMajor: this.resetValueInValid(education.other_major),
          degreeType: education.education_level_id,
          fromTime: education.from_time,
          toTime: education.to_time
        }
      }
      return null
    }

    updateEducation(educationNew) {
      const educationOriginal = this.state.userEducation;
      let userProfileHistoryEducation = [];

      educationNew.forEach((element, index) => {
        let oldEdu = this.preparePreEducation(educationOriginal[index])
        let newEdu = this.preparePreEducation(element)

        if (oldEdu != null && newEdu != null && !_.isEqual(oldEdu, newEdu)) {
          const oldObj = this.prepareEducationModel(educationOriginal[index], "update", "old");
          const newObj = this.prepareEducationModel(element, "update", "new");
          const obj =
          {
            OldEducation: oldObj,
            NewEducation: newObj
          }
          userProfileHistoryEducation = userProfileHistoryEducation.concat(...userProfileHistoryEducation, obj);
          this.setState({
            userProfileHistoryEducation : userProfileHistoryEducation
          }, () => {
            this.setState({
              update : {
                ...this.state.update,
                userProfileHistoryEducation: this.state.userProfileHistoryEducation
              }
            }, () => {
              this.setState({data : {
                ...this.state.data,
                update: this.state.update
              }});
            })
          });
        }
      });
    }

    addEducation(value) {
      let tempEducationArr = [];
      value.forEach(element => {
        const educations = this.prepareEducationModel(element, "insert", "");
        tempEducationArr = tempEducationArr.concat(educations);
      });
      const educations = {
        educations: tempEducationArr
      }
      this.setState(state => ({
        create: educations
      }), () => {
        this.setState({data : {
          ...this.state.data,
          create: this.state.create
        }});
      });
    }

    getInfoUpdate = (newItems, fieldsMapping) => {
      let labelArray = [];
      Object.keys(newItems).forEach(function(key) {
        if (key == "BirthCountry" || key == "BirthCountryText") {
          labelArray.push(fieldsMapping.BirthCountry);
        } else if (key == "BirthProvince" || key == "BirthProvinceText") {
          labelArray.push(fieldsMapping.BirthProvince);
        } else if (key == "Gender" || key == "GenderText") {
          labelArray.push(fieldsMapping.Gender);
        } else if (key == "Ethinic" || key == "EthinicText") {
          labelArray.push(fieldsMapping.Ethinic);
        } else if (key == "Religion" || key == "ReligionText") {
          labelArray.push(fieldsMapping.Religion);
        } else if (key == "Nationality" || key == "NationalityText") {
          labelArray.push(fieldsMapping.Nationality);
        } else if (key == "Country" || key == "CountryText" || key == "Province" || key == "ProvinceText" || key == "District" || key == "DistrictText" 
        || key == "Wards" || key == "WardsText" || key == "StreetName") {
          labelArray.push(fieldsMapping.PermanentAddress);
        } else if (key == "TempCountry" || key == "TempCountryText" || key == "TempProvince" || key == "TempProvinceText" 
        || key == "TempDistrict" || key == "TempDistrictText" || key == "TempWards" || key == "TempWardsText" || key == "TempStreetName") {
          labelArray.push(fieldsMapping.TemporaryAddress);
        } else if (key == "MaritalStatus" || key == "MaritalStatusText") {
          labelArray.push(fieldsMapping.MaritalStatus);
        } else if (key == "Bank" || key == "BankText") {
          labelArray.push(fieldsMapping.Bank);
        } else {
          labelArray.push(fieldsMapping[key]);
        }
      });
      return labelArray;
    }
    
    getNameFromData = (data) => {
      const nameArray = {
        Birthday: "Ngày sinh",
        BirthCountry: "Quốc gia sinh",
        BirthProvince: "Nơi sinh",
        Gender: "Giới tính",
        Ethinic: "Dân tộc",
        Religion: "Tôn giáo",
        Nationality: "Quốc tịch",
        PermanentAddress: "Địa chỉ thường trú",
        TemporaryAddress: "Địa chỉ tạm trú",
        MaritalStatus: "Tình trạng hôn nhân",
        MarriageDate: "Ngày TT hôn nhân",
        PersonalEmail: "Email cá nhân",
        CellPhoneNo: "Điện thoại di động",
        UrgentContactNo: "Điện thoại khẩn cấp",
        BankAccountNumber: "Số tài khoản ngân hàng",
        Bank: "Tên ngân hàng",
        Education: "Bằng cấp/Chứng chỉ chuyên môn",
        PersonalIdentifyNumber: "Số CMND/CCCD",
        PersonalIdentifyDate: "Ngày cấp CMND/CCCD",
        PersonalIdentifyPlace: "Nơi cấp CMND/CCCD",
        PassportNumber: "Số Hộ chiếu",
        PassportDate: "Ngày cấp Hộ chiếu",
        PassportPlace: "Nơi cấp Hộ chiếu"
      }
      let labelArray = [];
      if (data) {
        if (data.create && data.create.educations && data.create.educations.length > 0) {
          labelArray.push(nameArray.Education);
        }
        if (data.update) {
          if (data.update.userProfileHistoryEducation && data.update.userProfileHistoryEducation.length > 0) {
            labelArray.push(nameArray.Education);
          }
          if (data.update.userProfileHistoryMainInfo) {
            const userProfileHistoryMainInfo = data.update.userProfileHistoryMainInfo;
            const newItems = userProfileHistoryMainInfo.NewMainInfo || {};
            labelArray = labelArray.concat(this.getInfoUpdate(newItems, nameArray));
          }
        }
      }
      return _.uniq(labelArray).join(" - ");
    }

    onHideModalConfirm = () => {
      this.setState({isShowModalConfirm: false});
    }

    onHideResultModal = () => {
      this.setState({isShowResultConfirm: false});
    }

    sendRequest = () => {
      this.setState({
        modalTitle: "Xác nhận gửi yêu cầu",
        modalMessage: "Lý do sửa đổi",
        typeRequest: 4
      });
      this.onShowModalConfirm();
    }
  
    onShowModalConfirm = () => {
      this.setState({isShowModalConfirm: true});
    }

    getMessageFromModal = (message) => {
      this.submitRequest(message);
    }
    
    render() {
      return (
      <div className="edit-personal">
        <ConfirmationModal show={this.state.isShowModalConfirm} title={this.state.modalTitle} type={this.state.typeRequest} message={this.state.modalMessage} confirmStatus={this.state.confirmStatus}
        sendData={this.getMessageFromModal} onHide={this.onHideModalConfirm} />
        <ResultModal show={this.state.isShowResultConfirm} title={this.state.modalTitle} message={this.state.modalMessage} isSuccess={this.state.isSuccess} onHide={this.onHideResultModal} />
        <Form className="create-notification-form" id="create-notification-form" encType="multipart/form-data">
          <PersonalComponent userDetail={this.state.userDetail} 
            userProfile={this.state.userProfile} 
            removeInfo={this.removePersonalInfo.bind(this)} 
            updateInfo={this.updatePersonalInfo.bind(this)}
            updateAddress={this.updateAddress.bind(this)}
            setState={this.setState.bind(this)}
            genders={this.state.genders}
            races={this.state.races}
            marriages={this.state.marriages}
            nations={this.state.nations}
            banks={this.state.banks}
            countries={this.state.countries}
            religions={this.state.religions}
            documentTypes={this.state.documentTypes}
            requestedUserProfile={this.state.requestedUserProfile}
            isEdit={this.state.isEdit}
            birthCountry={this.props.birthCountry}
            validationMessages={this.state.errors}
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
            requestedUserProfile={this.state.requestedUserProfile}
            isEdit={this.state.isEdit}
            validationMessages={this.state.errors}
          />
          {/* <FamilyComponent userFamily={this.state.userFamily} setState={this.setState.bind(this)}/> */}

          <ul className="list-inline">
            {this.state.files.map((file, index) => {
              return <li className="list-inline-item" key={index}>
                  <span className="file-name">{file.name} <i className="fa fa-times remove" aria-hidden="true" onClick={this.removeFile.bind(this, index)}></i></span>
                </li>
            })}
          </ul>
          {this.error('fileUpload')}
          
          <div className="clearfix mb-5">
            {/* <button type="button" className="btn btn-primary float-right ml-3 shadow" onClick={this.showConfirm.bind(this, 'isConfirm')}><i className="fa fa-paper-plane" aria-hidden="true"></i>  Gửi yêu cầu</button> */}
            <button type="button" className="btn btn-primary float-right ml-3 shadow" onClick={this.sendRequest}><i className="fa fa-paper-plane" aria-hidden="true"></i>  Gửi yêu cầu</button>
            <input type="file" hidden ref={this.inputReference} id="file-upload" name="file-upload[]" onChange={this.fileUploadInputChange.bind(this)} multiple/>
            <button type="button" className="btn btn-light float-right shadow" onClick={this.fileUploadAction.bind(this)}><i className="fas fa-paperclip"></i> Đính kèm tệp tin</button>
          </div>
        </Form>
      </div>)
    }
  }
export default PersonalInfoEdit