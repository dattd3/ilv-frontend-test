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

class PersonalInfoEdit extends React.Component {
    constructor() {
        super();
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
            create: {},
            userProfileHistoryMainInfo: {},
            userProfileHistoryEducation: [],
            educations: [],
            OldMainInfo: {},
            NewMainInfo: {},
            data: {},
            isShowModalConfirm: false,
            isShowResultConfirm: false,
            modalTitle: "",
            modalMessage: "",
            confirmStatus: ""
        }
        this.inputReference = React.createRef()
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
    }

    updatePersonalInfo(name, old, value) {
      this.setState({
        OldMainInfo: { ...this.state.OldMainInfo, [name]: old },
        NewMainInfo: { ...this.state.NewMainInfo, [name]: value }
      }, () => {
        this.setState({
          userProfileHistoryMainInfo : {
            ...this.state.userProfileHistoryMainInfo,
            OldMainInfo: this.state.OldMainInfo,
            NewMainInfo: this.state.NewMainInfo
        }}, () => {
          this.setState({ update : { ...this.state.update, userProfileHistoryMainInfo: this.state.userProfileHistoryMainInfo }}, () => {
            this.setState({data : { ...this.state.data, update: this.state.update }});
            let personalUpdating = Object.assign(this.state.personalUpdating, this.state.userProfileHistoryMainInfo)
            this.setState({ personalUpdating: personalUpdating })
          })
        });
      });
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

    submitRequest = (comment) => {
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

      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_REQUEST_URL}user-profile-histories`,
        data: bodyFormData,
        headers: {'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
      })
      .then(response => {
        this.setState({isShowModalConfirm: false});
        if (response && response.data && response.data.result) {
          const code = response.data.result.code;
          if (code == "999") {
            this.handleShowResultModal("Lỗi", "Thông tin đang trong quá trình xử lý !");
          } else {
            this.handleShowResultModal("Thành công", "Cập nhật thông tin đã được lưu !");
          }
        }
      })
      .catch(response => {
        this.handleShowResultModal("Lỗi", "Có lỗi xảy ra trong quá trình cập nhật thông tin !");
      });
    }

    prepareInformationToSap = (data) => {
      if (data && data.update) {
        const update = data.update;
        if (update && update.userProfileHistoryMainInfo && update.userProfileHistoryMainInfo.NewMainInfo) {
          const newMainInfo = update.userProfileHistoryMainInfo.NewMainInfo;
          if (newMainInfo.Religion || newMainInfo.Birthday || newMainInfo.Nationality || newMainInfo.BirthProvince 
          || newMainInfo.MaritalStatus || newMainInfo.Religion 
          || newMainInfo.Gender) {
            const userDetail = this.state.userDetail;
            let obj = {};
            obj.myvp_id = "";
            obj.user_name = localStorage.getItem('email').split("@")[0];
            obj.kdate = "";
            obj.actio = "MOD";
            obj.pernr = localStorage.getItem('employeeNo');

            if (newMainInfo.Birthday) {
              obj.gbdat = moment(newMainInfo.Birthday, 'DD-MM-YYYY').format('YYYYMMDD')
            } else {
              obj.gbdat = moment(userDetail.birthday, 'DD-MM-YYYY').format('YYYYMMDD')
            }
            if (newMainInfo.Nationality) {
              obj.natio = newMainInfo.Nationality;
              obj.gblnd = newMainInfo.Nationality;
            } else {
              obj.natio = userDetail.country_id;
              obj.gblnd = userDetail.country_id;
            }
            if (newMainInfo.BirthProvince) {
              obj.gbdep = newMainInfo.BirthProvince;
            } else {
              obj.gbdep = userDetail.province_id;
            }
            if (newMainInfo.MaritalStatus) {
              obj.famst = newMainInfo.MaritalStatus;
            } else {
              obj.famst = userDetail.marital_status_code;
            }
            if (newMainInfo.Religion) {
              obj.konfe = newMainInfo.Religion;
            } else {
              obj.konfe = userDetail.religion_id;
            }
            if (newMainInfo.Gender) {
              obj.gesch = newMainInfo.Gender;
            } else {
              obj.gesch = userDetail.gender;
            }
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
            let obj = {};
            obj.myvp_id = "";
            obj.user_name = localStorage.getItem('email').split("@")[0];
            obj.kdate = "";
            obj.actio = "MOD";
            obj.pernr = localStorage.getItem('employeeNo');
            if (newMainInfo.BankAccountNumber) {
              obj.bankn = newMainInfo.BankAccountNumber;
            } else {
              obj.bankn = userDetail.bank_number;
            }
            if (newMainInfo.Bank) {
              obj.bankl = newMainInfo.Bank;
            } else {
              obj.bankl = newMainInfo.bank_name_id;
            }
            return [obj]
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
            let obj = {};
            obj.myvp_id = "";
            obj.user_name = localStorage.getItem('email').split("@")[0];
            obj.kdate = "";
            obj.actio = "MOD";
            obj.pernr = localStorage.getItem('employeeNo');
            if (newMainInfo.Ethinic) {
              obj.racky = newMainInfo.Ethinic;
            } else {
              obj.racky = userDetail.race_id;
            }
            return [obj];
          }
          return null;
        }
        return null;
      }
      return null;
    }

    prepareContactToSap = (data, dateSendRequest) => {
      if (data && data.update) {
        const update = data.update;
        if (update && update.userProfileHistoryMainInfo && update.userProfileHistoryMainInfo.NewMainInfo) {
          const newMainInfo = update.userProfileHistoryMainInfo.NewMainInfo;
          if (newMainInfo.PersonalEmail || newMainInfo.CellPhoneNo || newMainInfo.UrgentContactNo) {
            let listObj = [];
            let obj = {};
            obj.myvp_id = "";
            obj.user_name = localStorage.getItem('email').split("@")[0];
            obj.kdate = "";
            obj.actio = "MOD";
            obj.pernr = localStorage.getItem('employeeNo');

            if (newMainInfo.PersonalEmail) {
              obj.subty = "0030";
              obj.usrid_long = newMainInfo.PersonalEmail;
              listObj = listObj.concat(obj);
            }
            if (newMainInfo.CellPhoneNo) {
              obj.subty = "CELL";
              obj.usrid_long = newMainInfo.CellPhoneNo;
              listObj = listObj.concat(obj);
            }
            if (newMainInfo.UrgentContactNo) {
              obj.subty = "V002";
              obj.usrid_long = newMainInfo.UrgentContactNo;
              listObj = listObj.concat(obj);
            }
            return listObj;
          }
          return null;
        }
        return null;
      }
      return null;
    }

    prepareAddressToSap = (data) => {
      if (data && data.update) {
        const update = data.update;
        if (update && update.userProfileHistoryMainInfo && update.userProfileHistoryMainInfo.NewMainInfo) {
          const newMainInfo = update.userProfileHistoryMainInfo.NewMainInfo;
          if ((newMainInfo.Province || newMainInfo.District || newMainInfo.Wards || newMainInfo.StreetName) 
          || (newMainInfo.TempProvince || newMainInfo.TempDistrict || newMainInfo.TempWards || newMainInfo.TempStreetName)) {
            let listObj = [];
            let obj = {};
            obj.myvp_id = "";
            obj.user_name = localStorage.getItem('email').split("@")[0];
            obj.kdate = "";
            obj.actio = "MOD";
            obj.pernr = localStorage.getItem('employeeNo');

            if (newMainInfo.Province || newMainInfo.District || newMainInfo.Wards || newMainInfo.StreetName) {
              obj.anssa = "1";
              obj.land1 = "VN";
              obj.state = newMainInfo.Province;
              obj.zdistrict_id = newMainInfo.District;
              obj.zwards_id = newMainInfo.Wards;
              obj.stras = newMainInfo.StreetName;
              listObj = listObj.concat(obj);
            }
            if (newMainInfo.TempProvince || newMainInfo.TempDistrict || newMainInfo.TempWards || newMainInfo.TempStreetName) {
              obj.anssa = "1";
              obj.land1 = "VN";
              obj.state = newMainInfo.TempProvince;
              obj.zdistrict_id = newMainInfo.TempDistrict;
              obj.zwards_id = newMainInfo.TempWards;
              obj.stras = newMainInfo.TempStreetName;
              listObj = listObj.concat(obj);
            }
            return listObj;
          }
          return null;
        }
        return null;
      }
      return null;
    }

    prepareEducationToSap = (data) => {
      if (data && data.update) {
        const update = data.update;
        if (update && update.userProfileHistoryEducation && update.userProfileHistoryEducation[0].NewEducation) {
          const newEducation = update.userProfileHistoryEducation[0].NewEducation;
          if ((newEducation.SchoolCode || newEducation.DegreeType || newEducation.MajorCode || newEducation.FromTime || newEducation.ToTime)) {
            const userEducation = this.state.userEducation;
            let listObj = [];
            let obj = {};
            obj.myvp_id = "";
            obj.user_name = localStorage.getItem('email').split("@")[0];
            obj.kdate = "";
            obj.actio = "MOD";
            obj.pernr = localStorage.getItem('employeeNo');
            if (userEducation && userEducation.length > 0) {
              obj.pre_begda = moment(userEducation[0].from_time, 'DD-MM-YYYY').format('YYYYMMDD');
              obj.pre_endda = moment(userEducation[0].to_time, 'DD-MM-YYYY').format('YYYYMMDD');
              obj.pre_slart = userEducation[0].education_level_id;
            }
            obj.begda = moment(newEducation.FromTime, 'DD-MM-YYYY').format('YYYYMMDD');
            obj.endda = moment(newEducation.ToTime, 'DD-MM-YYYY').format('YYYYMMDD');
            obj.slart = newEducation.DegreeType;
            obj.zausbi = newEducation.MajorCode;
            obj.zinstitute = newEducation.SchoolCode;
            listObj = listObj.concat(obj);
            return listObj;
          }
          return null;
        }
        return null;
      }
      return null;
    }

    prepareDocumentToSap = (data) => {
      if (data && data.update) {
        const update = data.update;
        if (update && update.userProfileHistoryMainInfo && update.userProfileHistoryMainInfo.NewMainInfo) {
          const newMainInfo = update.userProfileHistoryMainInfo.NewMainInfo;
          if ((newMainInfo.DocumentType != null && newMainInfo.DocumentType != undefined) || (newMainInfo.DocumentTypeValue != null && newMainInfo.DocumentTypeValue != undefined) 
          || (newMainInfo.DateOfIssue != null && newMainInfo.DateOfIssue != undefined) || (newMainInfo.PlaceOfIssue != null && newMainInfo.PlaceOfIssue != undefined)) {
            const userDetail = this.state.userDetail;
            let obj = {};
            obj.myvp_id = "";
            obj.user_name = localStorage.getItem('email').split("@")[0];
            obj.kdate = "";
            obj.actio = "MOD";
            obj.pernr = localStorage.getItem('employeeNo');
            if (newMainInfo.DocumentType) {
              obj.ictyp = newMainInfo.DocumentType;
              if (newMainInfo.DocumentTypeValue) {
                obj.icnum = newMainInfo.DocumentTypeValue;
              } else {
                obj.icnum = userDetail.passport_no;
              }
              if (newMainInfo.DateOfIssue) {
                obj.fpdat = moment(newMainInfo.DateOfIssue, 'DD-MM-YYYY').format('YYYYMMDD')
              } else {
                obj.fpdat = moment(userDetail.passport_no, 'DD-MM-YYYY').format('YYYYMMDD')
              }
              if (newMainInfo.PlaceOfIssue) {
                obj.isspl = newMainInfo.PlaceOfIssue;
              } else {
                obj.isspl = userDetail.place_of_issue;
              }
            }
            if (newMainInfo.DocumentTypeValue) {
              obj.icnum = newMainInfo.DocumentTypeValue;
              if (newMainInfo.DocumentType) {
                obj.ictyp = newMainInfo.DocumentType;
              } else {
                obj.ictyp = userDetail.document_type_id;
              }
              if (newMainInfo.DateOfIssue) {
                obj.fpdat = moment(newMainInfo.DateOfIssue, 'DD-MM-YYYY').format('YYYYMMDD')
              } else {
                obj.fpdat = moment(userDetail.passport_no, 'DD-MM-YYYY').format('YYYYMMDD')
              }
              if (newMainInfo.PlaceOfIssue) {
                obj.isspl = newMainInfo.PlaceOfIssue;
              } else {
                obj.isspl = userDetail.place_of_issue;
              }
            }
            if (newMainInfo.DateOfIssue) {
              obj.fpdat = moment(newMainInfo.DateOfIssue, 'DD-MM-YYYY').format('YYYYMMDD');
              if (newMainInfo.DocumentType) {
                obj.ictyp = newMainInfo.DocumentType;
              } else {
                obj.ictyp = userDetail.document_type_id;
              }
              if (newMainInfo.DocumentTypeValue) {
                obj.icnum = newMainInfo.DocumentTypeValue;
              } else {
                obj.icnum = userDetail.passport_no;
              }
              if (newMainInfo.PlaceOfIssue) {
                obj.isspl = newMainInfo.PlaceOfIssue;
              } else {
                obj.isspl = userDetail.place_of_issue;
              }
            }
            if (newMainInfo.PlaceOfIssue) {
              obj.isspl = newMainInfo.PlaceOfIssue;
              if (newMainInfo.DocumentType) {
                obj.ictyp = newMainInfo.DocumentType;
              } else {
                obj.ictyp = userDetail.document_type_id;
              }
              if (newMainInfo.DocumentTypeValue) {
                obj.icnum = newMainInfo.DocumentTypeValue;
              } else {
                obj.icnum = userDetail.passport_no;
              }
            }
            return [obj];
          }
          return null;
        }
        return null;
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

    handleShowResultModal = (title, message) => {
      this.setState({
        isShowResultConfirm: true,
        modalTitle: title,
        modalMessage: message
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

    prepareEducationModel = (data) => {
      return {
        SchoolCode: data.school_id,
        SchoolName: data.university_name || data.other_uni_name,
        DegreeType: data.education_level_id,
        MajorCode: data.major_id,
        MajorName: data.major,
        FromTime: data.from_time,
        ToTime: data.to_time
      }      
    }

    updateEducation(educationNew) {
      const educationOriginal = this.state.userEducation;
      let userProfileHistoryEducation = [];
      educationNew.forEach((element, index) => {
        if (!_.isEqual(element, educationOriginal[index])) {
          const oldObj = this.prepareEducationModel(educationOriginal[index]);
          const newObj = this.prepareEducationModel(element);
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
      value.forEach(element => {
        const educations = this.prepareEducationModel(element);
        this.setState({
          create : {
            ...this.state.create,
            educations
        }})
      });

      this.setState({data : {
        ...this.state.data,
        create: this.state.create
      }});
    }
    
    getNameFromData = (data) => {
      const nameArray = {
        Birthday: "Ngày sinh",
        BirthProvince: "Nơi sinh",
        Gender: "Giới tính",
        Ethinic: "Dân tộc",
        Religion: "Tôn giáo",
        DocumentType: "Số CMND/CCCD/Hộ chiếu",
        DateOfIssue: "Ngày cấp",
        PlaceOfIssue: "Nơi cấp",
        Nationality: "Quốc tịch",
        MaritalStatus: "Tình trạng hôn nhân",
        PersonalEmail: "Email cá nhân",
        CellPhoneNo: "Điện thoại di động",
        UrgentContactNo: "Điện thoại khẩn cấp",
        BankAccountNumber: "Số tài khoản ngân hàng",
        Bank: "Tên ngân hàng",
        Education: "Bằng cấp/Chứng chỉ chuyên môn",
        PermanentAddress: "Địa chỉ thường trú",
        TempAddress: "Địa chỉ tạm trú"
      }
      let labelArray = [];
      if (data && data.update && data.update.userProfileHistoryEducation && data.update.userProfileHistoryEducation.length > 0) {
        labelArray.push(nameArray.Education);
      }
      if (data && data.update && data.update.userProfileHistoryMainInfo) {
        const userProfileHistoryMainInfo = data.update.userProfileHistoryMainInfo;
        const newItems = userProfileHistoryMainInfo.NewMainInfo || {};
        Object.keys(newItems).forEach(function(key) {
          if (key == "DocumentTypeId" || key == "DocumentTypeValue") {
            labelArray.push(nameArray.DocumentType);
          } else if (key == "Province" || key == "District" || key == "Wards" || key == "StreetName") {
            labelArray.push(nameArray.PermanentAddress);
          }else if (key == "TempProvince" || key == "TempDistrict" || key == "TempWards" || key == "TempStreetName") {
            labelArray.push(nameArray.TempAddress);
          } else {
            labelArray.push(nameArray[key]);
          }
        });
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
        modalMessage: "Thêm ghi chú (Không bắt buộc)",
        typeRequest: 3
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
        <ResultModal show={this.state.isShowResultConfirm} title={this.state.modalTitle} message={this.state.modalMessage} onHide={this.onHideResultModal} />
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
          />
          {/* <FamilyComponent userFamily={this.state.userFamily} setState={this.setState.bind(this)}/> */}

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
            <input type="file" hidden ref={this.inputReference} id="file-upload" name="file-upload[]" onChange={this.fileUploadInputChange.bind(this)} multiple/>
            <button type="button" className="btn btn-light float-right shadow" onClick={this.fileUploadAction.bind(this)}><i className="fas fa-paperclip"></i> Đính kèm tệp tin</button>
          </div>
        </Form>
      </div>)
    }
  }
export default PersonalInfoEdit