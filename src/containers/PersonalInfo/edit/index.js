import React from 'react'
import { Form } from 'react-bootstrap'
import PersonalComponent from './PersonalComponent'
import EducationComponent from './EducationComponent'
import FamilyComponent from './FamilyComponent'
import ConfirmationModal from './ConfirmationModal'
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
              let userEducation = [
                {
                  "other_uni_name": "ĐH Bách Khoa Hà Nội",
                  "school_id": 0,
                  "major": "Khác",
                  "academic_level": "Đại học",
                  "university_name": null,
                  "education_level_id": "VF",
                  "to_time": "31-12-2009",
                  "from_time": "01-01-2004",
                  "major_id": 0
                },
                {
                  "other_uni_name": "Học viện kỹ thuật quân sự",
                  "school_id": 0,
                  "major": "Khác",
                  "academic_level": "Đại học",
                  "university_name": null,
                  "education_level_id": "VF",
                  "to_time": "31-12-2009",
                  "from_time": "01-01-2004",
                  "major_id": 0
                }
              ]
              this.setState({ userEducation: userEducation });
            }
          }).catch(error => {
          })
    }

    updatePersonalInfo(name, old, value) {
      this.setState({
        OldMainInfo: {
          ...this.state.OldMainInfo,
          [name]: old
        },
        NewMainInfo: {
          ...this.state.NewMainInfo,
          [name]: value
        }
      }, () => {
        this.setState({
          userProfileHistoryMainInfo : {
            ...this.state.userProfileHistoryMainInfo,
            OldMainInfo: this.state.OldMainInfo,
            NewMainInfo: this.state.NewMainInfo
        }}, () => {
          this.setState({
            update : {
              ...this.state.update,
              userProfileHistoryMainInfo: this.state.userProfileHistoryMainInfo
            }
          }, () => {
            this.setState({data : {
              ...this.state.data,
              update: this.state.update
            }});
            let personalUpdating = Object.assign(this.state.personalUpdating, this.state.userProfileHistoryMainInfo)
            this.setState({ personalUpdating: personalUpdating })
          })
        });
      });
    }

    removePersonalInfo(name) {
      if (this.state.personalUpdating.NewMainInfo[name] && this.state.personalUpdating.OldMainInfo[name]) {
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

    prepareInformationToSap = (data) => {
      let obj = {};
      obj.user_name = localStorage.getItem('email').split("@")[0];
      obj.kdate = null; // Ngày approved từ server
      obj.actio = "MOD";
      obj.pernr = localStorage.getItem('employeeNo');
      if (data && data.update) {
        const update = data.update;
        if (update && update.userProfileHistoryMainInfo && update.userProfileHistoryMainInfo.NewMainInfo) {
          const newMainInfo = update.userProfileHistoryMainInfo.NewMainInfo;
          if (newMainInfo.Birthday) {
            obj.gbdat = moment(newMainInfo.Birthday).format('YYYYMMDD')
          }
          if (newMainInfo.Nationality) {
            obj.natio = newMainInfo.Nationality;
            obj.gblnd = newMainInfo.Nationality;
          }
          if (newMainInfo.BirthProvince) {
            obj.gbdep = newMainInfo.BirthProvince;
          }
          if (newMainInfo.MaritalStatus) {
            obj.famst = newMainInfo.MaritalStatus;
          }
          if (newMainInfo.Religion) {
            obj.konfe = newMainInfo.Religion;
          }
          if (newMainInfo.Gender) {
            obj.gesch = newMainInfo.Gender;
          }
        }
      }
      return [obj];
    }

    prepareAddressToSap = (data) => {
      console.log("****************************************");
      console.log(data);
      console.log("****************************************");

      let obj = {};
      obj.user_name = localStorage.getItem('email').split("@")[0];
      obj.kdate = null; // Ngày approved từ server
      return [
            {
              "user_name": "vuongvt2",
              "kdate": "20200921",
              "actio": "INS",
              "pernr": "03593060",
              "anssa": 1,
              "stras": "tesst",
              "zwards_id": "370707",
              "zdistrict_id": "3707",
              "state": "37",
              "land1": "vn"
            }
          ]
    }

    prepareBankToSap = (data) => {
      let obj = {};
      obj.user_name = localStorage.getItem('email').split("@")[0];
      obj.kdate = null; // Ngày approved từ server
      obj.actio = "MOD";
      obj.pernr = localStorage.getItem('employeeNo');

      if (data && data.update) {
        const update = data.update;
        if (update && update.userProfileHistoryMainInfo && update.userProfileHistoryMainInfo.NewMainInfo) {
          const newMainInfo = update.userProfileHistoryMainInfo.NewMainInfo;
          if (newMainInfo.BankAccountNumber) {
            obj.bankn = newMainInfo.BankAccountNumber;
          }
          if (newMainInfo.Bank) {
            obj.bankl = newMainInfo.Bank;
          }
        }
      }
      return [obj]
    }

    prepareEducationToSap = (data) => {
      return [
            {
              "myvp_id": null,
              "user_name": null,
              "kdate": null,
              "actio": "INS/MOD",
              "pernr": null,
              "pre_begda": null,
              "pre_endda": null,
              "pre_seqnr": null,
              "pre_slart": null,
              "begda": null,
              "endda": null,
              "slart": null,
              "slabs": null,
              "zausbi": null,
              "zzotherausbi": null,
              "zinstitute": null,
              "zortherinst": null,
              "zgrade": null,
              "zznote": null
            }
          ]
    }

    prepareRaceToSap = data => {
      if (data && data.update) {
        const update = data.update;
        if (update && update.userProfileHistoryMainInfo && update.userProfileHistoryMainInfo.NewMainInfo) {
          const newMainInfo = update.userProfileHistoryMainInfo.NewMainInfo;
          if (newMainInfo.Ethinic == null || newMainInfo.Ethinic == undefined || newMainInfo.Ethinic == "") {
            return null;
          }

          let obj = {};
          obj.user_name = localStorage.getItem('email').split("@")[0];
          obj.kdate = null; // Ngày approved từ server
          obj.actio = "MOD";
          obj.pernr = localStorage.getItem('employeeNo');
          obj.racky = newMainInfo.Ethinic;
          return [obj];
        }
      }
    }

    prepareContactToSap = data => {
      console.log("****************************************");
      console.log(data);
      console.log("****************************************");
      return [
            {
              "myvp_id": null,
              "user_name": null,
              "kdate": null,
              "actio": "INS/MOD",
              "pernr": null,
              "subty": null,
              "usrid_long": null
            }
          ]
    }

    prepareDocumentToSap = data => {

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
        model.contact = docu;
      }
      return model;
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
      const data = this.state.data;
      if (data && data.update) {
        const fieldsUpdate = this.state.data.update;
        const mainInfos = (fieldsUpdate && fieldsUpdate.userProfileHistoryMainInfo) ? fieldsUpdate.userProfileHistoryMainInfo.NewMainInfo : {};
        let educations = {};
        if (fieldsUpdate.userProfileHistoryEducation && fieldsUpdate.userProfileHistoryEducation.NewEducation) {
          educations = fieldsUpdate.userProfileHistoryEducation.NewEducation;
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
            userProfileHistoryEducation : {
              ...this.state.userProfileHistoryEducation,
              OldEducation: oldObj,
              NewEducation: newObj
          }}, () => {
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
        Education: "Bằng cấp/Chứng chỉ chuyên môn"
      }

      if (data && data.update && data.update.userProfileHistoryMainInfo) {
        const userProfileHistoryMainInfo = data.update.userProfileHistoryMainInfo;
        const newItems = userProfileHistoryMainInfo.NewMainInfo || {};
        let labelArray = [];

        Object.keys(newItems).forEach(function(key) {
          labelArray.push(nameArray[key]);
        });
        return labelArray.join(" - ");
      }
      return "";
    }

    onHideModalConfirm = () => {
      this.setState({isShowModalConfirm: false});
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