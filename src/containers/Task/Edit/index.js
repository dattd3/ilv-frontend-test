import React from 'react'
import { Form } from 'react-bootstrap'
import { withTranslation } from "react-i18next"
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
import * as actions from '../../../actions'
import { t } from 'i18next'

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
        update: {
          userProfileHistoryMainInfo: {
            OldMainInfo: {},
            NewMainInfo: {}
          },
          userProfileHistoryEducation: []
        },
        create: {
          educations: []
        }
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
    let regx = /\/tasks-request\/(?<id>\d+)\/edit/;
    const pathName = window.location.pathname;
    let idMatch = pathName.match(regx);
    if (idMatch && idMatch.groups) {
      return idMatch.groups.id;
    }
    return '';
    // const pathNameArr = pathName.split('/');
    // return pathNameArr[pathNameArr.length - 1];
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
      modalMessage: `${t("Note")} ${t("NonRequired")}`,
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

  updatePersonalInfo(name, old, value, displayText) {
    let oldMainInfo = this.state.OldMainInfo;
    if (this.state.OldMainInfo[name] === undefined) {
      oldMainInfo = { ...this.state.OldMainInfo, [name]: old };
      if (displayText && displayText != "") {
        oldMainInfo[name + 'Text'] = displayText;
      }
    }

    let newMainInfo = { ...this.state.NewMainInfo, [name]: value };
    if (displayText && displayText != "") {
      newMainInfo[name + 'Text'] = displayText;
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
    if (this.state.personalUpdating.NewMainInfo && this.state.personalUpdating.NewMainInfo[name] && this.state.personalUpdating.OldMainInfo && this.state.personalUpdating.OldMainInfo[name]) {
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

  formatSapData(st, updatedFieldName_arr) {
    let dt = st.data;
    let sapData = {};
    let pernr = localStorage.getItem('employeeNo');
    let usernamelc = localStorage.getItem('email').split("@")[0];
    let addressKeyNames = ['StreetName', 'Wards', 'District', 'Province', 'Country'];
    let addressKeyNameTemps = ['TempProvince', 'TempDistrict', 'TempWards', 'TempStreetName', 'TempCountry'];
    let informationKeyNames = ['Birthday', 'Nationality', 'BirthCountry', 'BirthProvince', 'MaritalStatus', 'MarriageDate', 'Gender', 'Religion'];
    let contactKeyNames = ['PersonalEmail', 'CellPhoneNo', 'UrgentContactNo'];
    let documentKeyNames = ['PersonalIdentifyNumber', 'PersonalIdentifyDate', 'PersonalIdentifyPlace', 'PassportNumber', 'PassportDate', 'PassportPlace'];
    let bankKeyNames = ['BankAccountNumber', 'Bank'];
    //let educationKeyNames = ['SchoolCode', 'SchoolName', 'DegreeType', 'MajorCode', 'FromTime', 'ToTime'];
    let raceKeyNames = ['Ethinic'];

    let shouldUpdateAddress = updatedFieldName_arr.some(u => addressKeyNames.indexOf(u) >= 0);
    let shouldUpdateAddressTemp = updatedFieldName_arr.some(u => addressKeyNameTemps.indexOf(u) >= 0);

    if (shouldUpdateAddress || shouldUpdateAddressTemp) {
      sapData.address = [];
      if (shouldUpdateAddress) {
        let actio = 'MOD';
        if (!st.userDetail.country_id && !st.userDetail.province_id && !st.userDetail.street_name && !st.userDetail.district_id && !st.userDetail.ward_id) {
          actio = 'INS';
        }
        if (localStorage.getItem("companyCode") != "V030") {
          actio = 'INS';
        }
        sapData.address.push({
          actio: actio,
          anssa: 1,
          state: dt.update.userProfileHistoryMainInfo.NewMainInfo.Province === undefined ? st.userDetail.province_id : dt.update.userProfileHistoryMainInfo.NewMainInfo.Province,
          stras: dt.update.userProfileHistoryMainInfo.NewMainInfo.StreetName === undefined ? st.userDetail.street_name : dt.update.userProfileHistoryMainInfo.NewMainInfo.StreetName,
          zdistrict_id: dt.update.userProfileHistoryMainInfo.NewMainInfo.District === undefined ? st.userDetail.district_id : dt.update.userProfileHistoryMainInfo.NewMainInfo.District,
          zwards_id: dt.update.userProfileHistoryMainInfo.NewMainInfo.Wards === undefined ? st.userDetail.ward_id : dt.update.userProfileHistoryMainInfo.NewMainInfo.Wards,
          land1: dt.update.userProfileHistoryMainInfo.NewMainInfo.Country === undefined ? st.userDetail.country_id : dt.update.userProfileHistoryMainInfo.NewMainInfo.Country,
          kdate: '',
          pernr: pernr,
          user_name: usernamelc,
          myvp_id: ''
        });
      }

      if (shouldUpdateAddressTemp) {
        let actio = 'MOD';
        if (!st.userDetail.tmp_province_id && !st.userDetail.tmp_street_name && !st.userDetail.temp_district_id && !st.userDetail.tmp_ward_id) {
          actio = 'INS';
        }
        if (localStorage.getItem("companyCode") != "V030") {
          actio = 'INS';
        }
        sapData.address.push({
          actio: actio,
          anssa: 2,
          state: dt.update.userProfileHistoryMainInfo.NewMainInfo.TempProvince === undefined ? st.userDetail.tmp_province_id : dt.update.userProfileHistoryMainInfo.NewMainInfo.TempProvince,
          stras: dt.update.userProfileHistoryMainInfo.NewMainInfo.TempStreetName === undefined ? st.userDetail.tmp_street_name : dt.update.userProfileHistoryMainInfo.NewMainInfo.TempStreetName,
          zdistrict_id: dt.update.userProfileHistoryMainInfo.NewMainInfo.TempDistrict === undefined ? st.userDetail.temp_district_id : dt.update.userProfileHistoryMainInfo.NewMainInfo.TempDistrict,
          zwards_id: dt.update.userProfileHistoryMainInfo.NewMainInfo.TempWards === undefined ? st.userDetail.tmp_ward_id : dt.update.userProfileHistoryMainInfo.NewMainInfo.TempWards,
          land1: dt.update.userProfileHistoryMainInfo.NewMainInfo.TempCountry === undefined ? st.userDetail.tmp_country_id : dt.update.userProfileHistoryMainInfo.NewMainInfo.TempCountry,
          kdate: '',
          pernr: pernr,
          user_name: usernamelc,
          myvp_id: ''
        });
      }
    }
    let shouldUpdateRace = updatedFieldName_arr.some(u => raceKeyNames.indexOf(u) >= 0);
    if (shouldUpdateRace) {
      let actio = 'MOD';
      if (!st.userDetail.race_id) {
        actio = 'INS';
      }
      if (localStorage.getItem("companyCode") != "V030") {
        actio = 'INS';
      }
      sapData.race = [{
        actio: actio,
        racky: dt.update.userProfileHistoryMainInfo.NewMainInfo.Ethinic === undefined ? st.userDetail.race_id : dt.update.userProfileHistoryMainInfo.NewMainInfo.Ethinic,
        kdate: '',
        pernr: pernr,
        user_name: usernamelc,
        myvp_id: ''
      }];
    }

    let shouldUpdateContact = updatedFieldName_arr.some(u => contactKeyNames.indexOf(u) >= 0);
    if (shouldUpdateContact) {
      sapData.contact = [];
      if (updatedFieldName_arr.some(u => u === 'PersonalEmail')) {
        let actio = 'MOD';
        if (!st.userDetail.personal_email) {
          actio = 'INS';
        }
        if (localStorage.getItem("companyCode") != "V030") {
          actio = 'INS';
        }
        sapData.contact.push({
          actio: actio,
          subty: '0030',
          kdate: '',
          pernr: pernr,
          usrid_long: dt.update.userProfileHistoryMainInfo.NewMainInfo.PersonalEmail === undefined ? st.userDetail.personal_email : dt.update.userProfileHistoryMainInfo.NewMainInfo.PersonalEmail,
          user_name: usernamelc,
          myvp_id: ''
        });
      }
      if (updatedFieldName_arr.some(u => u === 'CellPhoneNo')) {
        let actio = 'MOD';
        if (!st.userDetail.cell_phone_no) {
          actio = 'INS';
        }
        if (localStorage.getItem("companyCode") != "V030") {
          actio = 'INS';
        }
        sapData.contact.push({
          actio: actio,
          subty: 'CELL',
          kdate: '',
          pernr: pernr,
          usrid_long: dt.update.userProfileHistoryMainInfo.NewMainInfo.CellPhoneNo === undefined ? st.userDetail.cell_phone_no : dt.update.userProfileHistoryMainInfo.NewMainInfo.CellPhoneNo,
          user_name: usernamelc,
          myvp_id: ''
        });
      }
      if (updatedFieldName_arr.some(u => u === 'UrgentContactNo')) {
        let actio = 'MOD';
        if (!st.userDetail.urgent_contact_no) {
          actio = 'INS';
        }
        if (localStorage.getItem("companyCode") != "V030") {
          actio = 'INS';
        }
        sapData.contact.push({
          actio: actio,
          subty: 'V002',
          kdate: '',
          pernr: pernr,
          usrid_long: dt.update.userProfileHistoryMainInfo.NewMainInfo.UrgentContactNo === undefined ? st.userDetail.urgent_contact_no : dt.update.userProfileHistoryMainInfo.NewMainInfo.UrgentContactNo,
          user_name: usernamelc,
          myvp_id: ''
        });
      }
    }
    let shouldUpdateInformation = updatedFieldName_arr.some(u => informationKeyNames.indexOf(u) >= 0);
    if (shouldUpdateInformation) {
      let actio = 'MOD';
      if (localStorage.getItem("companyCode") != "V030") {
        actio = 'INS';
      }
      // thông tin cá nhân luôn luôn là update
      // if (!st.userDetail.birthday && !st.userDetail.nationality_id && !st.userDetail.birth_country_id && !st.userDetail.race_id && !st.userDetail.birth_province_id && !st.userDetail.marital_status_code && !st.userDetail.gender) {
      //   actio = 'INS';
      // } 

      let _date_of_birth = dt.update.userProfileHistoryMainInfo.NewMainInfo.Birthday === undefined ? st.userDetail.birthday : dt.update.userProfileHistoryMainInfo.NewMainInfo.Birthday;
      _date_of_birth = moment(_date_of_birth, 'DD-MM-YYYY');
      if (_date_of_birth._isValid) {
        _date_of_birth = _date_of_birth.format("YYYYMMDD");
      }
      else {
        return "Ngày sinh không hợp lệ";
      }

      sapData.information = [{
        actio: actio,
        pernr: pernr,
        gbdat: _date_of_birth,
        natio: dt.update.userProfileHistoryMainInfo.NewMainInfo.Nationality === undefined ? st.userDetail.nationality_id : dt.update.userProfileHistoryMainInfo.NewMainInfo.Nationality,
        gblnd: dt.update.userProfileHistoryMainInfo.NewMainInfo.BirthCountry === undefined ? st.userDetail.birth_country_id : dt.update.userProfileHistoryMainInfo.NewMainInfo.BirthCountry,
        konfe: dt.update.userProfileHistoryMainInfo.NewMainInfo.Religion === undefined ? st.userDetail.race_id : dt.update.userProfileHistoryMainInfo.NewMainInfo.Religion,
        gbdep: dt.update.userProfileHistoryMainInfo.NewMainInfo.BirthProvince === undefined ? st.userDetail.birth_province_id : dt.update.userProfileHistoryMainInfo.NewMainInfo.BirthProvince,
        famst: dt.update.userProfileHistoryMainInfo.NewMainInfo.MaritalStatus === undefined ? st.userDetail.marital_status_code : dt.update.userProfileHistoryMainInfo.NewMainInfo.MaritalStatus,
        gesch: dt.update.userProfileHistoryMainInfo.NewMainInfo.Gender === undefined ? st.userDetail.gender : dt.update.userProfileHistoryMainInfo.NewMainInfo.Gender,
        kdate: '',
        user_name: usernamelc,
        myvp_id: '',
        famdt: ''
      }];
      if (sapData.information[0].famst == '1' || sapData.information[0].famst == '2') {
        let _marital_date = dt.update.userProfileHistoryMainInfo.NewMainInfo.MarriageDate === undefined ? st.userDetail.marital_date : dt.update.userProfileHistoryMainInfo.NewMainInfo.MarriageDate;
        _marital_date = moment(_marital_date, 'DD-MM-YYYY');
        if (_marital_date._isValid) {
          _marital_date = _marital_date.format("YYYYMMDD");
        }
        else {
          return "Ngày tình trạng hôn nhân không hợp lệ";
        }
        sapData.information[0].famdt = _marital_date;
      }
    }

    //let shouldUpdateEducation = updatedFieldName_arr.some(u => educationKeyNames.indexOf(u) >= 0);
    if ((dt.update.userProfileHistoryEducation && dt.update.userProfileHistoryEducation.length > 0) || (dt.create.educations && dt.create.educations.length > 0)) {
      let actio = 'MOD';
      if (localStorage.getItem("companyCode") != "V030") {
        actio = 'INS';
      }
      sapData.education = [];

      if (dt.update.userProfileHistoryEducation && dt.update.userProfileHistoryEducation.length > 0) {
        dt.update.userProfileHistoryEducation.map((item, index) => {
          let _from_time = item.newMainInfo.FromTime === undefined ? '' : item.NewMainInfo.FromTime;
          _from_time = moment(_from_time, 'DD-MM-YYYY');
          if (_from_time._isValid) {
            _from_time = _from_time.format("YYYYMMDD");
          }
          else {
            _from_time = '';
          }

          let _to_time = item.newMainInfo.ToTime === undefined ? '' : item.NewMainInfo.ToTime;
          _to_time = moment(_to_time, 'DD-MM-YYYY');
          if (_to_time._isValid) {
            _to_time = _to_time.format("YYYYMMDD");
          }
          else {
            _to_time = '';
          }

          sapData.education.push({
            actio: actio,
            pernr: pernr,
            slart: item.newMainInfo.DegreeType === undefined ? '' : item.NewMainInfo.DegreeType,
            zausbi: item.newMainInfo.MajorCode === undefined ? '' : item.NewMainInfo.MajorCode,
            zinstitute: item.newMainInfo.SchoolCode === undefined ? '' : item.NewMainInfo.SchoolCode,
            zortherinst: item.newMainInfo.SchoolName === undefined ? '' : item.NewMainInfo.SchoolName,
            begda: _from_time,
            endda: _to_time,
            kdate: '',
            user_name: usernamelc,
            myvp_id: ''
          });
        });
      }
      if (dt.create.educations.length > 0) {
        actio = 'INS';
        dt.create.educations.map((item, index) => {
          let _from_time = item.FromTime;
          _from_time = moment(_from_time, 'DD-MM-YYYY');
          if (_from_time._isValid) {
            _from_time = _from_time.format("YYYYMMDD");
          }
          else {
            _from_time = '';
          }

          let _to_time = item.ToTime;
          _to_time = moment(_to_time, 'DD-MM-YYYY');
          if (_to_time._isValid) {
            _to_time = _to_time.format("YYYYMMDD");
          }
          else {
            _to_time = '';
          }
          sapData.education.push({
            actio: 'INS',
            slart: item.DegreeType || '',
            zausbi: item.MajorCode || '',
            zinstitute: item.SchoolCode || '',
            zortherinst: item.SchoolName || '',
            begda: _from_time,
            endda: _to_time,
            pernr: pernr,
            kdate: '',
            user_name: usernamelc,
            myvp_id: '',
            slabs: ''
          });
        });
      }
    }

    let shouldUpdateDocument = updatedFieldName_arr.some(u => documentKeyNames.indexOf(u) >= 0);
    if (shouldUpdateDocument) {
      sapData.document = [];
      if (updatedFieldName_arr.some(u => u === 'PersonalIdentifyNumber' || u === 'PersonalIdentifyDate' || u === 'PersonalIdentifyPlace')) {
        let actio = 'MOD';
        if (!st.userDetail.personal_id_no || st.userDetail.pid_date_of_issue || st.userDetail.pid_place_of_issue) {
          actio = 'INS';
        }
        if (localStorage.getItem("companyCode") != "V030") {
          actio = 'INS';
        }
        let _pid_date_of_issue = dt.update.userProfileHistoryMainInfo.NewMainInfo.PersonalIdentifyDate === undefined ? st.userDetail.pid_date_of_issue : dt.update.userProfileHistoryMainInfo.NewMainInfo.PersonalIdentifyDate;
        _pid_date_of_issue = moment(_pid_date_of_issue, 'DD-MM-YYYY');
        if (_pid_date_of_issue._isValid) {
          _pid_date_of_issue = _pid_date_of_issue.format("YYYYMMDD");
        }
        else {
          return "Ngày cấp CMND/ CCCD không hợp lệ";
        }

        sapData.document.push({
          actio: actio,
          kdate: '',
          pernr: pernr,
          icnum: dt.update.userProfileHistoryMainInfo.NewMainInfo.PersonalIdentifyNumber === undefined ? st.userDetail.personal_id_no : dt.update.userProfileHistoryMainInfo.NewMainInfo.PersonalIdentifyNumber,
          ictyp: '01',
          user_name: usernamelc,
          myvp_id: '',
          fpdat: _pid_date_of_issue,
          isspl: dt.update.userProfileHistoryMainInfo.NewMainInfo.PersonalIdentifyPlace === undefined ? st.userDetail.pid_place_of_issue : dt.update.userProfileHistoryMainInfo.NewMainInfo.PersonalIdentifyPlace,
          expid: '',
          zznote: ''
        });
      }
      if (updatedFieldName_arr.some(u => u === 'PassportNumber' || u === 'PassportDate' || u === 'PassportPlace')) {
        let actio = 'MOD';
        if (!st.userDetail.passport_id_no || !st.userDetail.passport_date_of_issue || !st.userDetail.passport_place_of_issue) {
          actio = 'INS';
        }
        if (localStorage.getItem("companyCode") != "V030") {
          actio = 'INS';
        }
        let _passport_date_of_issue = dt.update.userProfileHistoryMainInfo.NewMainInfo.PassportDate === undefined ? st.userDetail.passport_date_of_issue : dt.update.userProfileHistoryMainInfo.NewMainInfo.PassportDate;
        _passport_date_of_issue = moment(_passport_date_of_issue, 'DD-MM-YYYY');
        if (_passport_date_of_issue._isValid) {
          _passport_date_of_issue = _passport_date_of_issue.format("YYYYMMDD");
        }
        else {
          return "Ngày cấp hộ chiếu không hợp lệ";
        }

        sapData.document.push({
          actio: actio,
          kdate: '',
          pernr: pernr,
          icnum: dt.update.userProfileHistoryMainInfo.NewMainInfo.PassportNumber === undefined ? st.userDetail.passport_id_no : dt.update.userProfileHistoryMainInfo.NewMainInfo.PassportNumber,
          ictyp: '02',
          user_name: usernamelc,
          myvp_id: '',
          fpdat: _passport_date_of_issue,
          isspl: dt.update.userProfileHistoryMainInfo.NewMainInfo.PassportPlace === undefined ? st.userDetail.passport_place_of_issue : dt.update.userProfileHistoryMainInfo.NewMainInfo.PassportPlace,
          expid: '',
          zznote: ''
        });
      }
    }

    let shouldUpdateBank = updatedFieldName_arr.some(u => bankKeyNames.indexOf(u) >= 0);
    if (shouldUpdateBank) {
      sapData.bank = [];
      let actio = 'MOD';
      if (!st.userDetail.bank_number) {
        actio = 'INS';
      }
      if (localStorage.getItem("companyCode") != "V030") {
        actio = 'INS';
      }
      sapData.bank.push({
        actio: actio,
        kdate: '',
        pernr: pernr,
        bankl: dt.update.userProfileHistoryMainInfo.NewMainInfo.Bank === undefined ? st.userDetail.bank_name_id : dt.update.userProfileHistoryMainInfo.NewMainInfo.Bank,
        bankn: dt.update.userProfileHistoryMainInfo.NewMainInfo.BankAccountNumber === undefined ? st.userDetail.bank_number : dt.update.userProfileHistoryMainInfo.NewMainInfo.BankAccountNumber,
        user_name: usernamelc,
        myvp_id: ''
      });
    }
    return sapData;
  }
  
  sendRequest = () => {
    const updateFields = this.getFieldUpdates();
    const { t } = this.props;
    let bodyFormData = new FormData();
    bodyFormData.append('Name', this.getNameFromData(this.state.data));
    bodyFormData.append('Comment', "Tôi muốn update thông tin Họ tên");
    bodyFormData.append('UserProfileInfo', JSON.stringify(this.state.data));
    let sapData = "";
    if (updateFields && Array.isArray(updateFields.UpdateField) && updateFields.UpdateField.length > 0) {
      sapData = this.formatSapData(this.state, updateFields.UpdateField);
      sapData = JSON.stringify(sapData);
    }
    bodyFormData.append('UserProfileInfoToSap', sapData);
    bodyFormData.append('UpdateField', JSON.stringify(updateFields));
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
        if (response && response.data && response.data.result) {
          const code = response.data.result.code;
          if (code == "999") {
            this.handleShowModal(t("Notification"), "Thông tin đang trong quá trình xử lý !", "error");
          } else {
            this.handleShowModal(t("Successful"), "Cập nhật thông tin đã được lưu !", "success");
          }
        }
      })
      .catch(response => {
        this.handleShowModal(t("Notification"), t("Error"), "error");
      });
  }

  fileUploadInputChange = () => {
    const files = Object.keys(this.inputReference.current.files).map((key) => this.inputReference.current.files[key])
    this.setState({ files: this.state.files.concat(files) })
  }

  fileUploadAction = () => {
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

  populateEducation = (data) => {
    const fromTime = data.from_time;
    const toTime = data.to_time;
    return {
      SchoolCode: data.school_id || '',
      SchoolName: data.university_name || data.other_uni_name || '',
      DegreeType: data.education_level_id || '',
      MajorCode: data.major_id || '',
      MajorCodeText: data.major || '',
      FromTime: fromTime,
      ToTime: toTime,
      Seqnr: data.seqnr
    }
  }

  updateEducation = (educationNew) => {
    const educationOriginal = this.state.userEducation;
    let userProfileHistoryEducation = [];
    educationNew.forEach((element, index) => {
      educationOriginal[index].other_uni_name === '#' && (educationOriginal[index].other_uni_name = '');
      let orig = educationOriginal[index];
      if (!(element.education_level_id == orig.education_level_id
        && element.school_id == orig.school_id
        && element.from_time == orig.from_time
        && element.to_time == orig.to_time
        && element.seqnr == orig.seqnr
        && element.major_id == orig.major_id
        && element.other_uni_name == orig.other_uni_name)) {
        const oldObj = this.populateEducation(educationOriginal[index]);
        const newObj = this.populateEducation(element);
        const obj =
        {
          OldEducation: oldObj,
          NewEducation: newObj
        }
        userProfileHistoryEducation = userProfileHistoryEducation.concat(...userProfileHistoryEducation, obj);
        this.setState({
          userProfileHistoryEducation: userProfileHistoryEducation
        }, () => {
          this.setState({
            update: {
              ...this.state.update,
              userProfileHistoryEducation: this.state.userProfileHistoryEducation
            }
          }, () => {
            this.setState({
              data: {
                ...this.state.data,
                update: this.state.update
              }
            });
          })
        });
      }
    });
  }

  updateNewEducation = (value, index) => {
    let educationData = {
      SchoolCode: "",
      SchoolName: "",
      DegreeType: "",
      MajorCode: "",
      MajorCode: "",
      FromTime: "",
      ToTime: ""
    };
    let educations = this.state.data.create.educations;
    value.forEach(element => {
      educationData = this.populateEducation(element);
      educations[index] = educationData;
    });

    this.setState({
      data: {
        ...this.state.data,
        create: { educations: educations }
      }
    });
  }

  getNameFromData = (data) => {
    const { t } = this.props
    const nameArray = {
      FullName: t("FullName"),
      InsuranceNumber: "Số sổ bảo hiểm",
      TaxNumber: t('PitNo'),
      Birthday: t("DateOfBirth"),
      Gender: t("Gender"),
      Ethinic: t("Ethnic"),
      Religion: t("Religion"),
      PassportNo: "Số CMND/CCCD/Hộ chiếu",
      DateOfIssue: "Ngày cấp",
      PlaceOfIssue: "Nơi cấp",
      Nationality: t("Nationality"),
      MaritalStatus: t("MaritalStatus"),
      WorkPermitNo: t("WorkPermitNo"),
      ExpiryDate: t("ExpiryDate"),
      PersonalEmail: t("PersonalEmail"),
      CellPhoneNo: t("MobileNo"),
      UrgentContactNo: t("EmergencyPhoneNo"),
      BankAccountNumber: t("BankAccountNumber")
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
    const { t } = this.props
    this.setState({
      modalTitle: t("ConfirmSend"),
      modalMessage: t("ReasonModify"),
      typeRequest: 2
    });
    this.onShowModalConfirm();
  }

  onShowModalConfirm = () => {
    this.setState({ isShowModalConfirm: true });
  }

  mappingFields = key => {
    switch (key) {
      //#region education
      case "DegreeType":
        return "education_level_id";
      case "SchoolCode":
        return "school_id";
      case "SchoolName":
        return "other_uni_name";
      case "MajorCode":
        return "major_id";
      case "FromTime":
        return "from_time";
      case "ToTime":
        return "to_time";
      case "EducationId":
        return "education_id";
      case "Seqnr":
        return "seqnr";
      //#endregion
      //#region personal info
      case "Birthday":
        return "birthday";
      case "DateOfIssue":
        return "date_of_issue";
      case "Gender":
        return "gender";
      case "PersonalEmail":
        return "personal_email";
      case "CellPhoneNo":
        return "cell_phone_no";
      case "UrgentContactNo":
        return "urgent_contact_no";
      case "BankAccountNumber":
        return "bank_number";
      case "PlaceOfIssue":
        return "place_of_issue";
      case "Ethinic":
        return "race_id";
      case "Religion":
        return "religion_id";
      case "BirthProvince":
        return "birth_province_id";
      case "Province":
        return "province_id";
      case "Nationality":
        return "nationality_id";
      case "MaritalStatus":
        return "marital_status_code";
      case "Bank":
        return "bank_name_id";
      case "DocumentTypeId":
        return "document_type_id";
      case "DocumentTypeValue":
        return "passport_no";
      case "PassportNo":
        return "passport_no";
      case "District":
        return "district_id";
      case "Wards":
        return "ward_id";
      case "TempProvince":
        return "tmp_province_id";
      case "TempDistrict":
        return "tmp_district_id";
      case "TempWards":
        return "tmp_ward_id";
      case "StreetName":
        return "street_name";
      case "TempStreetName":
        return "tmp_street_name";
      case "BankCode":
        return "bank_name_id";
      case "PersonalIdentifyNumber":
        return "personal_id_no";
      case "PersonalIdentifyDate":
        return "pid_date_of_issue";
      case "PersonalIdentifyPlace":
        return "pid_place_of_issue";
      case "PassportNumber":
        return "passport_id_no";
      case "PassportDate":
        return "passport_date_of_issue";
      case "PassportPlace":
        return "passport_place_of_issue";
      case "CountryCode":
        return "country_id";
      case "BirthCountry":
        return "birth_country_id";
      case "MarriageDate":
        return "marital_date";
      //#endregion
      default: return key;
    }
  }

  mappingDataToProps = (props) => {
    if ((props && props.education && props.education.length > 0) || (props && props.newEducation && props.newEducation.length > 0) || (props.information)) {
      let st = { information: {}, education: [], newEducation: [] };
      if (props.education) {
        let educations = [];
        props.education.forEach((item, index) => {
          let educationItem = Object.keys(item.NewEducation).reduce((pre, curr) => (pre[this.mappingFields(curr)] = item.NewEducation[curr], pre), {});
          //let curreducationItem = Object.keys(item.OldEducation).reduce((pre, curr) => (pre[this.mappingFields(curr)] = item.OldEducation[curr], pre), {});
          //let educationItem = {NewEducation: editededucationItem, OldEducation: curreducationItem};
          educationItem.school_id && (educationItem.other_uni_name = '');
          educations.push(educationItem);
        });
        st.education = educations;
      }
      if (props.newEducation && props.newEducation.length > 0) {
        let newUserEducation = [];
        props.newEducation.forEach((item, index) => {
          let newEducationItem = Object.keys(item).reduce((pre, curr) => (pre[this.mappingFields(curr)] = item[curr], pre), {});
          newUserEducation.push(newEducationItem);
        });
        st.newEducation = newUserEducation;
      }
      if (props.information) {
        st.information = Object.keys(props.information).reduce((pre, curr) => (pre[this.mappingFields(curr)] = props.information[curr], pre), {});
      }
      return st;
    }
  }
  processProfile = (res) => {
    if (res && res.data && res.data.data) {
      let userProfile = res.data.data[0];
      this.setState({ userProfile: userProfile })
    }
  }

  processPersonalInfo = (res) => {
    if (res && res.data && res.data.data) {
      let userDetail = res.data.data[0];
      this.store.dispatch(actions.updateInformationDataAction(userDetail));
      this.setState({ userDetail: userDetail });
    }
  }

  processEducation = (res) => {
    if (res && res.data && res.data.data) {
      let userEducation = res.data.data;
      this.setState({ userEducation: userEducation })
    }
  }
  //#endregion private function ============

  async componentDidMount() {

    let configWithinSecretKey = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
        'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
      }
    }
    const profileEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/profile`;
    const personalInfoEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/personalinfo`;
    const personalEducationEnpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/education`;
    const requestProfile = axios.get(profileEndpoint, configWithinSecretKey);
    const requestPersonalInfo = axios.get(personalInfoEndpoint, configWithinSecretKey);
    const requestEducation = axios.get(personalEducationEnpoint, configWithinSecretKey);
    await axios.all([requestProfile, requestPersonalInfo, requestEducation]).then(axios.spread((...responses) => {
      this.processProfile(responses[0]);
      this.processPersonalInfo(responses[1]);
      this.processEducation(responses[2]);
    })).catch(errors => {

    })

    let config = {
      headers: {
        'Authorization': localStorage.getItem('accessToken'),
        'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
        'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
      }
    }
    await axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/masterdata/provinces?country_id=${this.store.getState().requestDetail.information.country_id}`, configWithinSecretKey)
      .then(res => {
        if (res && res.data && res.data.data) {
          const data = res.data.data;
          this.store.dispatch(actions.updateProvinceAction({
            provinces: data
          }));
        }
      }).catch(error => {

      })
    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/masterdata/profileinfobase`, config)
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
      });

    axios.get(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.getUserProfileHistoryId()}`, config).then(changingData => {
      if (changingData && changingData.data && changingData.data.data && changingData.data.data.userProfileInfo) {
        let dt = { information: {}, education: [], newEducation: [] };
        if (changingData.data.data.userProfileInfo.update && changingData.data.data.userProfileInfo.update.userProfileHistoryMainInfo && changingData.data.data.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo) {
          dt.information = changingData.data.data.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo;
        }
        let updatedData = {};
        let newMainInfo = {};
        let oldMainInfo = {};
        if (changingData.data.data.userProfileInfo) {
          if (changingData.data.data.userProfileInfo.update) {
            updatedData = {
              userProfileHistoryMainInfo: {
                OldMainInfo: changingData.data.data.userProfileInfo.update.OldMainInfo || {},
                NewMainInfo: changingData.data.data.userProfileInfo.update.NewMainInfo || {}
              },
              userProfileHistoryEducation: changingData.data.data.userProfileInfo.update.userProfileHistoryEducation || []
            };
            if (changingData.data.data.userProfileInfo.update.userProfileHistoryMainInfo && changingData.data.data.userProfileInfo.update.userProfileHistoryMainInfo.OldMainInfo) {
              oldMainInfo = changingData.data.data.userProfileInfo.update.userProfileHistoryMainInfo.OldMainInfo;
            }
            if (changingData.data.data.userProfileInfo.update.userProfileHistoryMainInfo && changingData.data.data.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo) {
              newMainInfo = changingData.data.data.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo;
            }
          }

        }
        if (changingData.data.data.userProfileInfo.update && changingData.data.data.userProfileInfo.update.userProfileHistoryEducation) {
          dt.education = changingData.data.data.userProfileInfo.update.userProfileHistoryEducation;
        }
        if (changingData.data.data.userProfileInfo.create && changingData.data.data.userProfileInfo.create.educations) {
          dt.newEducation = changingData.data.data.userProfileInfo.create.educations;
        }
        this.setState({
          data: { ...this.state.data, create: { educations: dt.newEducation }, update: updatedData },
          update: updatedData,
          OldMainInfo: oldMainInfo,
          NewMainInfo: newMainInfo
        });
        let dataMappingToProps = this.mappingDataToProps(dt);
        this.store.dispatch(updatePersonalDataAction(dataMappingToProps));
      }
    }).catch(error => {

    });

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
              mappingFieldFn={this.mappingFields.bind(this)}
              setState={this.setState.bind(this)}
              genders={this.state.genders}
              races={this.state.races}
              marriages={this.state.marriages}
              nations={this.state.nations}
              banks={this.state.banks}
              countries={this.state.countries}
              religions={this.state.religions}
              documentTypes={this.state.documentTypes}
            />
            <EducationComponent
              userEducation={this.state.userEducation}
              setState={this.setState.bind(this)}
              certificates={this.state.certificates}
              educationLevels={this.state.educationLevels}
              majors={this.state.majors}
              schools={this.state.schools}
              updateEducation={this.updateEducation.bind(this)}
              mappingFieldFn={this.mappingFields.bind(this)}
              updateNewEducation={this.updateNewEducation.bind(this)}
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
              <button type="button" className="btn btn-primary float-right ml-3 shadow" onClick={this.sendRequest}><i className="fa fa-paper-plane" aria-hidden="true"></i> {t("Send")}</button>
              <input type="file" hidden ref={this.inputReference} id="file-upload" name="file-upload[]" onChange={this.fileUploadInputChange.bind(this)} multiple />
              <button type="button" className="btn btn-light float-right shadow" onClick={this.fileUploadAction.bind(this)}><i className="fas fa-paperclip"></i> Đính kèm tệp tin</button>
            </div>
          </Form>
        </div>
      </Provider>
    )
  }
}
export default withTranslation()(PersonalInfoEdit)
