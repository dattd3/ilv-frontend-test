import React from 'react'
import moment from 'moment'
import Spinner from 'react-bootstrap/Spinner'
import StatusModal from '../../../components/Common/StatusModal'
import { Image } from 'react-bootstrap'
import IconEdit from '../../../assets/img/ic-edit.svg';
import IconRemove from '../../../assets/img/ic-remove.svg';
import IconAdd from '../../../assets/img/ic-add.svg';
import IconSave from '../../../assets/img/ic-save.svg';
import ResizableTextarea from '../TextareaComponent';
import ApproverComponent from './SearchPeopleComponent'
import Select from 'react-select'
import Constants from '../../../commons/Constants'
import { getRequestConfigs } from '../../../commons/commonFunctions'
import { withTranslation } from "react-i18next"
import axios from 'axios'
import Rating from 'react-rating';
import _, { debounce } from 'lodash'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { vi, enUS } from 'date-fns/locale'

const TIME_FORMAT = 'HH:mm'
const DATE_FORMAT = 'DD/MM/YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'
const TIME_OF_SAP_FORMAT = 'HHmm00'
const FULL_DAY = true

class LeaveOfAbsenceDetailComponent extends React.Component {

  resultOptions = [
    {value: 1, label: 'Ký HĐDV'},
    {value: 2, label: 'Ký HĐ sau thử việc, học việc'},
    {value: 3, label: 'Gia hạn hợp đồng'},
    {value: 4, label: 'Không đạt HĐ thử việc, học việc'},
    {value: 5, label: 'Do không gia hạn hợp đồng'},
  ];
  HD_THUVIEC = 2;
  contractTypeOptions = [
    {value: 'VA', label: 'HĐLĐ XĐ thời hạn'},
    {value: 'VB', label: 'HĐLĐ KXĐ thời hạn'},
    {value: 'VC', label: 'HĐLĐ theo mùa vụ'},
    {value: 'VD', label: 'Hợp đồng tập nghề'},
    {value: 'VE', label: 'Hợp đồng thử việc'},
    {value: 'VF', label: 'HĐDV theo tháng'},
    {value: 'VG', label: 'HĐDV theo giờ'},
    {value: 'VH', label: 'HĐDV khoán'}
  ];
  STATUS_OPTIONS = [
    {value: 9, label: 'Tự đánh giá'},
    {value: 10, label: 'Người đánh giá'},
    {value: 11, label: 'QLTT đánh giá'},
    {value: 12, label: 'HR thẩm định'},
    {value: 13, label: 'CBLD phê duyệt'},
    {value: 2, label: 'Đã phê duyệt'},
    {value: 1, label: 'Từ chối phê duyệt'}
  ];

  commonData = {

  };
  employeeSetting =  {
    showComponent: {
      JobEditing: false, // co the edit , them sua xoa noi dung danh gia
      bossOption: false, //Ý KIẾN ĐỀ XUẤT CỦA CBQL TRỰC TIẾP
      HrOption: false, //Ý KIẾN THẨM ĐỊNH CỦA BỘ PHẬN NHÂN SỰ
      employeePoC: true, //NGƯỜI ĐÁNH GIÁ (Nếu có)
      qlttPoc: true, //QUẢN LÝ TRỰC TIẾP ĐÁNH GIÁ
      hrPoC: false, //NGƯỜI THẨM ĐỊNH
      bossPoc: false, //NGƯỜI PHÊ DUYỆT
      employeeSide: true,
      save: false // Luu
    },
    disableComponent: {
      employeeSide: true,
      qlttSide: false,
      disableAll: false,
    },
    requiredFields: [],
    optionFields: [],
  };

  // qlttSetting =  {
  //   showComponent: {
  //     JobEditing: false, // co the edit , them sua xoa noi dung danh gia
  //     bossOption: true, //Ý KIẾN ĐỀ XUẤT CỦA CBQL TRỰC TIẾP
  //     HrOption: false, //Ý KIẾN THẨM ĐỊNH CỦA BỘ PHẬN NHÂN SỰ
  //     employeePoC: false, //NGƯỜI ĐÁNH GIÁ (Nếu có)
  //     qlttPoc: false, //QUẢN LÝ TRỰC TIẾP ĐÁNH GIÁ
  //     hrPoC: false, //NGƯỜI THẨM ĐỊNH
  //     bossPoc: true, //NGƯỜI PHÊ DUYỆT
  //     employeeSide: true,
  //     save: false // Luu
  //   },
  //   disableComponent: {
  //     employeeSide: false,
  //     qlttSide: true,
  //   }
  // };

  qlttSetting = {
    showComponent: {
      JobEditing: false, // co the edit , them sua xoa noi dung danh gia
      bossOption: true, //Ý KIẾN ĐỀ XUẤT CỦA CBQL TRỰC TIẾP
      HrOption: false, //Ý KIẾN THẨM ĐỊNH CỦA BỘ PHẬN NHÂN SỰ
      employeePoC: false, //NGƯỜI ĐÁNH GIÁ (Nếu có)
      qlttPoc: false, //QUẢN LÝ TRỰC TIẾP ĐÁNH GIÁ
      hrPoC: true, //NGƯỜI THẨM ĐỊNH
      bossPoc: true, //NGƯỜI PHÊ DUYỆT
      employeeSide: false,
      save: false // Luu
    },
    disableComponent: {
      employeeSide: false,
      qlttSide: true,
      disableAll: false,
    }
  }

  bossSetting = {
    showComponent: {
      JobEditing: false, // co the edit , them sua xoa noi dung danh gia
      bossOption: true, //Ý KIẾN ĐỀ XUẤT CỦA CBQL TRỰC TIẾP
      HrOption: false, //Ý KIẾN THẨM ĐỊNH CỦA BỘ PHẬN NHÂN SỰ
      employeePoC: false, //NGƯỜI ĐÁNH GIÁ (Nếu có)
      qlttPoc: false, //QUẢN LÝ TRỰC TIẾP ĐÁNH GIÁ
      hrPoC: true, //NGƯỜI THẨM ĐỊNH
      bossPoc: true, //NGƯỜI PHÊ DUYỆT
      employeeSide: false,
      bossSide: true,
      save: false // Luu
    },
    disableComponent: {
      employeeSide: false,
      qlttSide: false,
      bossSide: true,
      editable: false,
      disableAll: false,
    }
  }

  editableSetting = {
    showComponent: {
      JobEditing: true, // co the edit , them sua xoa noi dung danh gia
      bossOption: true, //Ý KIẾN ĐỀ XUẤT CỦA CBQL TRỰC TIẾP
      HrOption: false, //Ý KIẾN THẨM ĐỊNH CỦA BỘ PHẬN NHÂN SỰ
      employeePoC: false, //NGƯỜI ĐÁNH GIÁ (Nếu có)
      qlttPoc: false, //QUẢN LÝ TRỰC TIẾP ĐÁNH GIÁ
      hrPoC: true, //NGƯỜI THẨM ĐỊNH
      bossPoc: true, //NGƯỜI PHÊ DUYỆT
      employeeSide: false,
      save: false // Luu
    },
    disableComponent: {
      employeeSide: false,
      qlttSide: false,
      bossSide: false,
      editable: true,
      disableAll: false,
    }
  }

  checkAuthorize = () => {
    const currentEmployeeNo = localStorage.getItem('email');
    const data = this.state.data;
    let shouldDisable = false;
    switch(data.processStatus) {
      case 9: 
        if((this.state.type != 'request') || (!data.employeeInfo || !data.employeeInfo.employeeEmail || data.employeeInfo.employeeEmail.toLowerCase()  != currentEmployeeNo.toLowerCase())){
          shouldDisable = true;
        }
        break;
      case 10: 
        if((this.state.type != 'assess') || (!data.nguoidanhgia || !data.nguoidanhgia.account || (data.nguoidanhgia.account.toLowerCase() + Constants.GROUP_EMAIL_EXTENSION) != currentEmployeeNo.toLowerCase())){
          shouldDisable = true;
        }
        break;
      case 11: 

        if((this.state.type != 'assess') || (!data.qltt || !data.qltt.account || (data.qltt.account.toLowerCase() + Constants.GROUP_EMAIL_EXTENSION) != currentEmployeeNo.toLowerCase())){
          shouldDisable = true;
        }
        break;
      case 13: 
        if((this.state.type != 'approval') || (!data.nguoipheduyet || !data.nguoipheduyet.account || (data.nguoipheduyet.account.toLowerCase() + Constants.GROUP_EMAIL_EXTENSION) != currentEmployeeNo.toLowerCase())){
          shouldDisable = true;
        }
        break;
      case 1:
      case 2: 
        shouldDisable = true;
      break;
      default:
        shouldDisable = true;
    }
    if(this.state.type == 'edit' && data.processStatus == 9){
      shouldDisable = data.canAddJob ? false : true;
    }
    this.setState({
      disableComponent: {...this.state.disableComponent, disableAll: shouldDisable}
    })
  }

  constructor(props) {
    super();
    this.state = {
      isShowStatusModal: false,
      annualLeaveSummary: {},
      data: {
        processStatus: 0,
        employeeInfo: {},
        evalution:[
        ],
        newEvalution: [
        ],
        selfEvalution: {
          
        },
        bossEvalution: {
          
        },
        course: [
        ],
        violation: [
         
        ],
        documentStatus: '',
        nguoidanhgia: {},
        qltt: {},
        nguoipheduyet: {},
        qlttOpinion: {
          result: {},
          contract: {},
          endDate: '',
          startDate: '',
          otherOption: ''
        },
        thamdinh: {

        },
        cvs: [
          
        ],
        cvIdToDeleted: [],
        cvOriginals: [
          
        ],
        canAddJob: false,
        SelfAssessmentScoreTotal: 0,
        ManagementScoreTotal: 0,
      },
      errors: {
        // rating: '(Bắt buộc)',
        // nguoidanhgia: '(Bắt buộc)',
        // result: '(Bắt buộc)',
        // contract: '(Bắt buộc)',
        // expire: '(Bắt buộc)',
        // boss: '(Bắt buộc)'
      },
      showComponent: this.editableSetting.showComponent, 
      disableComponent: this.editableSetting.disableComponent
    }
  }
  componentDidMount() {

    const type = this.props.match.params.type;
    const id = this.props.match.params.id;
    if(!type || !id){
      window.history.back();
      return;
    }
  
    if(type === 'request'){
      this.setState({
        showComponent: this.employeeSetting.showComponent,
        disableComponent: {...this.employeeSetting.disableComponent, disableAll: true},
        type: 'request',
        id: id
      })
    }else if(type == 'edit'){
      this.setState({
        showComponent: this.editableSetting.showComponent,
        disableComponent: {...this.editableSetting.disableComponent, disableAll: true},
        type: 'edit',
        id: id
      })
      
    }else if(type === 'assess'){
      this.setState({
        showComponent: this.qlttSetting.showComponent,
        disableComponent: {...this.qlttSetting.disableComponent, disableAll: true},
        type: 'assess',
        id: id
      })
    }else if(type === 'approval'){
      this.setState({
        showComponent: this.bossSetting.showComponent,
        disableComponent: {...this.bossSetting.disableComponent, disableAll: true},
        type: 'approval',
        id: id
      })
    }

    //http://localhost:5000/StaffContract/getManageEvaluation?idDisplay=117404.1
    //axios.get(`${process.env.REACT_APP_REQUEST_URL}StaffContract/infoevaluation?idDisplay=${id}&employeeCode=${localStorage.getItem('employeeNo')}&regionId=${localStorage.getItem('organizationLv4')}&rankId=${localStorage.getItem('employeeLevel')}&org=${localStorage.getItem('organizationLv3')}`, getRequestConfigs())
    let url = `${process.env.REACT_APP_REQUEST_URL}StaffContract/infoevaluation?idDisplay=${id}&employeeCode=${localStorage.getItem('employeeNo')}&regionId=${localStorage.getItem('organizationLv4')}&rankId=${localStorage.getItem('employeeLevel')}&orgLv02=${localStorage.getItem('organizationLv2')}&orgLv05=${localStorage.getItem('organizationLv5') == '#' ? null : localStorage.getItem('organizationLv5')}`;
    if(type == 'assess' || type == 'approval'){
      url = `${process.env.REACT_APP_REQUEST_URL}StaffContract/getManageEvaluation?idDisplay=${id}`
    }
    axios.get(url, getRequestConfigs())
    .then(res => {
      if (res && res.data && res.data.data && res.data.result) {
        const result = res.data.result;
        if (result.code != Constants.API_ERROR_CODE) {
          const responseData = this.saveStateInfos(res.data.data);
          this.setState({data : responseData}, () => {
            this.checkAuthorize();
          });
        }
      }
    }).catch(error => {})

  }

  prepareDataToSubmit = (data) => {
    const remoteData = data.remoteData;
    if(this.state.type == 'approval') {
      let bodyFormData = new FormData();
      bodyFormData.append('staffContractId', remoteData.staffContracts.id);
      bodyFormData.append('requestHistoryId', remoteData.requestHistorys.id); 
      bodyFormData.append('requestHistoryStatuses', 13);
      bodyFormData.append('actionRequest', 5);
      return bodyFormData;
    }
    remoteData.lstTaskAssessments = (remoteData.lstTaskAssessments || []).map( (item, index) => {
      return {
        ...item,
        selfAssessmentScore: data.evalution[index].SelfAssessmentScore,
        managementScore: data.evalution[index].ManagementScore,
        managementComment: data.evalution[index].ManagementComment
      }
    });

    remoteData.additionInforEvaluations = {
      ...remoteData.additionInforEvaluations,
      selfAssessmentStrengths: data.selfEvalution.strong,
      selfAssessmentPointImprove: data.selfEvalution.weak,
      staffSuggestions: data.selfEvalution.opinion,
      managersEvaluateStrengths: data.bossEvalution.strong,
      managersEvaluatePointImprove: data.bossEvalution.weak,
      contractKpiResult : data.qlttOpinion.result && data.qlttOpinion.result.value ? data.qlttOpinion.result.value : remoteData.additionInforEvaluations ? remoteData.additionInforEvaluations.contractKpiResult : '',
      contractType: data.qlttOpinion.contract && data.qlttOpinion.contract.value ? data.qlttOpinion.contract.value: remoteData.additionInforEvaluations ? remoteData.additionInforEvaluations.contractType : '',
      contractTypeName: data.qlttOpinion.contract && data.qlttOpinion.contract.label? data.qlttOpinion.contract.label : remoteData.additionInforEvaluations ? remoteData.additionInforEvaluations.contractTypeName : '',
      startDate: data.qlttOpinion.startDate ? moment(data.qlttOpinion.startDate, "DD/MM/YYYY").format("YYYY-MM-DD") : '',
      expireDate: data.qlttOpinion.endDate ? moment(data.qlttOpinion.endDate, "DD/MM/YYYY").format("YYYY-MM-DD") : '',
      proposed: data.qlttOpinion.otherOption || '',
      employeeCode: remoteData.lstTaskAssessments && remoteData.lstTaskAssessments.length > 0 ? remoteData.lstTaskAssessments[0].employeeCode : null
    }

    remoteData.requestHistorys = {
      ...(remoteData.requestHistorys || {}),
      appraiserInfo: data.nguoidanhgia,
      supervisorInfo: data.qltt,
      approverInfo: data.nguoipheduyet
    }
    let bodyFormData = new FormData();
    bodyFormData.append('staffContracts', JSON.stringify(remoteData.staffContracts));
    bodyFormData.append('lstTaskAssessments', JSON.stringify(remoteData.lstTaskAssessments));
    bodyFormData.append('additionInforEvaluations', JSON.stringify(remoteData.additionInforEvaluations));
    bodyFormData.append('requestHistorys', JSON.stringify(remoteData.requestHistorys));
    if (data.cvIdToDeleted && data.cvIdToDeleted.length > 0) {
      bodyFormData.append('deletedDocumentIds', JSON.stringify(data.cvIdToDeleted))
    }

    const additionalDocuments = this.getAdditionalDocuments()

    if (additionalDocuments.length > 0) {
        additionalDocuments.forEach(file => {
            bodyFormData.append('attachedFiles', file)
        })
    }
    if(this.state.type == 'assess'){
      
    }
    return bodyFormData;
  }

  saveStateInfos = (infos) => {
    const candidateInfos = {...this.state.data}
    candidateInfos.remoteData = infos;
    candidateInfos.canAddJob = infos.isEdit;
    //save staff contract
    if(infos.staffContracts){
      candidateInfos.employeeInfo = {
        employeeNo: infos.staffContracts.employeeCode,
        fullName: infos.staffContracts.fullName,
        positionName: infos.staffContracts.positionName,
        departmentName: infos.staffContracts.departmentName,
        startDate: infos.staffContracts.startDate,
        expireDate: infos.staffContracts.expireDate,
        employeeEmail: infos.staffContracts.employeeEmail,
        comments: infos.staffContracts.comments
      }
    }

    if(infos.lstTaskAssessments && infos.lstTaskAssessments.length > 0){
      candidateInfos.SelfAssessmentScoreTotal = 0;
      candidateInfos.ManagementScoreTotal = 0;
      let itemCount = 0;
      candidateInfos.evalution = infos.lstTaskAssessments.map( item => {
        itemCount += 1;
        candidateInfos.SelfAssessmentScoreTotal += item.selfAssessmentScore;
        candidateInfos.ManagementScoreTotal += item.managementScore;
        return {
            id: item.id,
            TaskName: item.taskName || '',
            SelfAssessmentScore: item.selfAssessmentScore,
            ManagementScore: item.managementScore,
            ManagementComment: item.managementComment || '',
            canEdit: item.isEdit,
            isEditing: false,
            isEdited: false,
            isDeleted: false,
          }
      })
      candidateInfos.SelfAssessmentScoreTotal  = itemCount > 0 ? Number(candidateInfos.SelfAssessmentScoreTotal/itemCount).toFixed(2) : 0;
      candidateInfos.ManagementScoreTotal  = itemCount > 0 ? Number(candidateInfos.ManagementScoreTotal/itemCount).toFixed(2) : 0;
    }

    if(infos.lstStaffPenalty && infos.lstStaffPenalty.length > 0){
      let userPenaltiesResult = infos.lstStaffPenalty.sort((a, b) => Date.parse(a.effective_date) <= Date.parse(b.effective_date) ? 1 : -1);
        userPenaltiesResult = userPenaltiesResult.map( item => {
          let penaltiesTitle = (item.dimiss ? 'Sa thải | ' : '');
          penaltiesTitle += (item.removal_demotion ? 'Cách chức/ Hạ chức | ' : '');
          penaltiesTitle += (item.deduction_from_bonus ? `${this.props.t("DeductionOnBehaviorAndAttitudeBonus")} | ` : '');
          penaltiesTitle += (item.terminate_labour_contract ? 'Chấm dứt HĐLĐ | ' : '');
          penaltiesTitle += (item.compensation ? `${this.props.t("DeductionOnLoss")} | ` : '');
          penaltiesTitle += (item.other ? `${this.props.t("Other")} | ` : '');
          penaltiesTitle = penaltiesTitle.length > 3 ? penaltiesTitle.substring(0, penaltiesTitle.length - 3) : '';
          return {
            id: item.id,
            quyetdinh: item.decision_number,
            hieuluc: item.effective_date,
            nhomloi: item.violation_group,
            lydo: item.disciplinary_reason,
            noidung: penaltiesTitle
          }
        })
        candidateInfos.violation = userPenaltiesResult;
    }
    if(infos.lstCourse && infos.lstCourse.length > 0){
      candidateInfos.course = infos.lstCourse.map( item => {
        return {
            name: item.name || '',
            status: item.status ? true : false
          }
      })
    }
    if(infos.additionInforEvaluations) {
      candidateInfos.selfEvalution = {
        strong: infos.additionInforEvaluations.selfAssessmentStrengths || '',
        weak: infos.additionInforEvaluations.selfAssessmentPointImprove || '',
        opinion: infos.additionInforEvaluations.staffSuggestions || ''
      };
      candidateInfos.bossEvalution = {
        strong: infos.additionInforEvaluations.managersEvaluateStrengths || '',
        weak: infos.additionInforEvaluations.managersEvaluatePointImprove || ''
      }
      
      candidateInfos.qlttOpinion = {
        result : infos.additionInforEvaluations.contractKpiResult ? this.resultOptions.filter(item => item.value == infos.additionInforEvaluations.contractKpiResult)[0] || {} : {},
        contract: infos.additionInforEvaluations.contractType ? this.contractTypeOptions.filter(item => item.value == infos.additionInforEvaluations.contractType)[0] || {} : {},
        startDate: infos.additionInforEvaluations.startDate ? moment(infos.additionInforEvaluations.startDate).format('DD/MM/YYYY') || null : '', 
        endDate:  infos.additionInforEvaluations.expireDate ? moment(infos.additionInforEvaluations.expireDate).format('DD/MM/YYYY') || null : '',
        otherOption: infos.additionInforEvaluations.proposed || ''
      }
    }

    if(infos.requestHistorys){
      candidateInfos.processStatus = infos.requestHistorys.processStatusId;
      candidateInfos.nguoidanhgia = infos.requestHistorys.appraiserInfo && infos.requestHistorys.appraiserInfo.account ?  infos.requestHistorys.appraiserInfo : {};
      candidateInfos.qltt = infos.requestHistorys.supervisorInfo && infos.requestHistorys.supervisorInfo.account ?  infos.requestHistorys.supervisorInfo : {};
      candidateInfos.nguoipheduyet = infos.requestHistorys.approverInfo && infos.requestHistorys.approverInfo.account ? infos.requestHistorys.approverInfo : {}; 
    }
    candidateInfos.documentStatus = infos.profileStatus;
    const cvs = this.prepareCVResponses(infos.staffProfileDocuments)
    candidateInfos.cvs = cvs
    candidateInfos.cvOriginals = cvs
    return candidateInfos;
  }

  prepareCVResponses = (attachedDocuments) => {
    let documents = []
    if (attachedDocuments && attachedDocuments.length > 0) {
        documents = attachedDocuments.map(item => {
            return {
                id: item.id,
                name: item.fileName,
                link: item.fileUrl,
            }
        })
    }

    return [...documents]
  }

  getAdditionalDocuments = () => {
    const candidateInfos = {...this.state.data}
    const cvs = candidateInfos.cvs
    const files = cvs.filter((item, index) => !item.id)
    return files
  }

  handleChangeFileInput = e => {
    const files = Object.values(e.target.files)
    const candidateInfos = {...this.state.data}
    candidateInfos.cvs = candidateInfos.cvs.concat(files)
    this.setState({ data: candidateInfos })
  }

  removeFiles = (fileId, index) => {
      const candidateInfos = {...this.state.data}
      const files = candidateInfos.cvs.filter((item, i) => i !== index)
      const filesDeleted = candidateInfos.cvOriginals.filter((item, i) => {
          return fileId ? item.id == fileId : i === index
      })
      const fileIdsDeleted = filesDeleted.map(item => item && item.id)
      candidateInfos.cvs = files
      candidateInfos.cvIdToDeleted = candidateInfos.cvIdToDeleted.concat(fileIdsDeleted)

      this.setState({ data: candidateInfos })
  }

  verifyInputs = () => {
    const type = this.state.type;
    const errors = {};
    const evalutions = [...this.state.data.evalution, ...this.state.data.newEvalution];
    if(type === 'request'){
      if(evalutions && evalutions.length > 0){
        let isMissing = false;
        for(let i = 0; i < evalutions.length ; i++){
          if(evalutions[i].isDeleted === false &&  evalutions[i].SelfAssessmentScore < 1){
            isMissing = true;
            break;
          }
        }
        if(isMissing)
          errors['rating'] = '(Bắt buộc điền tự đánh giá)'
      }
      if(!this.state.data.qltt || !this.state.data.qltt.account){
        errors['qltt'] = '(Bắt buộc)';
      }

      const fileExtension = [
        'application/msword', // doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
        'application/vnd.ms-excel', // xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
        'application/pdf', // pdf,
        'image/png', // png
        'image/jpeg' // jpg and jpeg
      ]

      const cvs = this.state.data.cvs

      let sizeTotal = 0
      for (let index = 0, lenFiles = cvs.length; index < lenFiles; index++) {
          const file = cvs[index];
          if (file.id) {
              continue
          }

          if (!fileExtension.includes(file.type)) {
              errors.cvs = 'Tồn tại file đính kèm không đúng định dạng'
              break
          } else if (parseFloat(file.size / 1000000) > 2) {
              errors.cvs = 'Dung lượng từng file đính kèm không được vượt quá 2MB'
              break
          } else {
              errors.cvs = null
          }
          sizeTotal += parseInt(file.size)
      }

      if (parseFloat(sizeTotal / 1000000) > 10) {
          errors.cvs = 'Tổng dung lượng các file đính kèm không được vượt quá 10MB'
      }
    }else if(type === 'assess'){
      if(evalutions && evalutions.length > 0){
        let isMissing = false;
        for(let i = 0; i < evalutions.length ; i++){
          if(evalutions[i].isDeleted === false && evalutions[i].ManagementScore < 1){
            isMissing = true;
            break;
          }
        }
        if(isMissing)
          errors['rating'] = '(Bắt buộc điền CBLĐ TT đánh giá)'
      }
      if(!this.state.data.nguoipheduyet || !this.state.data.nguoipheduyet.account){
        errors['boss'] = '(Bắt buộc)';
      }
      const array = ['result', 'contract', 'startDate', 'endDate'];
      const optionFields = ['result', 'contract']
      
      array.forEach(name => {
        if (( this.state.data.qlttOpinion[name] && !this.state.data.qlttOpinion[name].value && optionFields.includes(name)) || _.isEmpty(this.state.data.qlttOpinion[name])) {
            errors[name] = '(Bắt buộc)'
        } else {
            errors[name] = null
        }
      })
      const error = this.validateResult();
      if(error) errors['result'] = error;
    }else if( type === 'edit'){
      if(evalutions && evalutions.length > 0){
        let isMissing = false;
        for(let i = 0; i < evalutions.length ; i++){
          if(evalutions[i].isDeleted === false && !evalutions[i].TaskName){
            isMissing = true;
            break;
          }
        }
        if(isMissing)
          errors['rating'] = '(Bắt buộc điền nội dung đánh giá)'
      }
    }
    this.setState({errors: errors});
    return errors;
  }

  

  getTypeDetail = () => {
    const pathName = window.location.pathname;
    const pathNameArr = pathName.split('/');
    return pathNameArr[pathNameArr.length - 1];
  }

  showStatusModal = (message, isSuccess = false, shouldReload = false, url = null) => {
    this.setState({ isShowStatusModal: true, content: message, isSuccess: isSuccess, shouldReload: shouldReload, url: url});
  }

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
    if(this.state.shouldReload){
      if(this.state.url){
        window.location.href = this.state.url; 
      }else{
        window.location.reload();
      }
      
    }
  }

  handleTextInputChange = (e, name, subName) => {
    const candidateInfos = {...this.state.data}
    candidateInfos[name][subName] = e != null ? e.target.value : "";
    this.setState({data : candidateInfos})
  }

  validateResult = () => {
    const name = 'qlttOpinion';
    const subName = 'result';   
    const candidateInfos = {...this.state.data}
    const errors = {...this.state.errors};
    let endData = candidateInfos[name][subName];
    let endError = null;
    let shouldShowError = false;
    
    (candidateInfos.course || []).forEach( item => {
      shouldShowError = item.status == false ? true : shouldShowError;
    });
    let totalScore = 5;
    shouldShowError = ((candidateInfos.ManagementScoreTotal / totalScore) >= 0.7) ? shouldShowError : true;
    shouldShowError = candidateInfos.documentStatus == 'Đủ' ? shouldShowError : true;
    if(shouldShowError && ( candidateInfos[name] != null && candidateInfos[name][subName] && candidateInfos[name][subName].value == this.HD_THUVIEC)) {
        candidateInfos[name][subName] ={};
        this.setState({
          data : candidateInfos,
          errors: {
            ...this.state.errors,
            [subName]: 'Không đủ điều kiện ký HĐ'
          }
          
        });
        return 'Không đủ điều kiện ký HĐ';
    }
    return null;
  }

  handleChangeSelectInputs = (e, name, subName) => {
    const candidateInfos = {...this.state.data}
    const errors = {...this.state.errors};
    let shouldShowError = false;
    // if(name == 'qlttOpinion' && subName == 'result'){      
    //   (candidateInfos.course || []).forEach( item => {
    //     shouldShowError = item.status == false ? true : shouldShowError;
    //   });
    //   let totalScore = 5;
    //   shouldShowError = ((candidateInfos.ManagementScoreTotal / totalScore) >= 0.7) ? shouldShowError : true;
    //   shouldShowError = candidateInfos.documentStatus == 'Đủ' ? shouldShowError : true;
    //   if(shouldShowError && (e != null && e.value == this.HD_THUVIEC)) {
    //     candidateInfos[name][subName] ={};
    //     this.setState({
    //       data : candidateInfos,
    //       errors: {
    //         ...this.state.errors,
    //         [subName]: 'Không đủ điều kiện ký HĐ'
    //       }
          
    //     });
    //     return;
    //   }
    //   errors[subName] = null;
    // }
    candidateInfos[name][subName] = e != null ? { value: e.value, label: e.label } : {}
    this.setState({errors: errors, data : candidateInfos})
  }

  handleTextInputChangeForItem = (e, name, subId, subName) => {
    const candidateInfos = {...this.state.data};
    const result = candidateInfos[name].map( (item) => {
      if(item.id != subId){
        return item;
      }
      item[subName] = e.target.value;
      return item;
    })
    candidateInfos[name] = result;
    this.setState({data : candidateInfos})
  }

  handleRatingChangeForItem = (value, name, subId, subName) => {
    const candidateInfos = {...this.state.data};
    let total = 0;
    const result = candidateInfos[name].map( (item) => {
      total += item[subName];
      if(item.id != subId){
        return item;
      }
      total = (total - item[subName] + value);
      item[subName] = value;
      return item;
    })
    //candidateInfos['qlttOpinion']['result'] = {}
    candidateInfos[name] = result;
    candidateInfos[subName + 'Total'] = Number(total / candidateInfos[name].length).toFixed(2);
    this.setState({data : candidateInfos, errors: {...this.state.errors, 'result': null}})
  }


  handleOnChangeInputForItem = (name, subId, subName, value) => {

  }

  updateApprover(name, approver, isApprover) {
    this.setState({
      data: {
        ...this.state.data,
        [name]: {
          ...approver,
          avatar: null
        } 
      }
    })
}

changeEditingStatus = (name, subName,  subId) => {
  const candidateInfos = {...this.state.data};
    const result = candidateInfos[name].map( (item) => {
      if(item.id != subId){
        return item;
      }
      item[subName] = !item[subName];
      item.isEdited = true;
      return item;
    })
    candidateInfos[name] = result;
    this.setState({data : candidateInfos})
}

addMoreEvalution = () => {
  const candidateInfos = {...this.state.data};
  const result = candidateInfos.newEvalution;
  const newItem = {
    id: result.length,
    TaskName: '',
    SelfAssessmentScore: 0,
    ManagementScore: 0,
    ManagementComment: '',
    canEdit: true,
    isEditing: true,
    isEdited: false,
    isDeleted: false,
  }
  result.push(newItem);
  candidateInfos.newEvalution = result;
  this.setState({data: candidateInfos});
}

renderEvalution = (name, data, isDisable) => {
  return data.length > 0 ? 
    data.map( (item, index) => {
      if(item.isDeleted)
        return null;
      return <tr key = {index}>
      <td style={{width: '20%'}}>
        {
          item.isEditing ? 
          <ResizableTextarea onChange={(e) => this.handleTextInputChangeForItem(e, name, item.id, 'TaskName')}  disabled={isDisable} value={item.TaskName}/> :
          item.TaskName
        }
      </td>
      <td style={{width: '14%'}}><Rating initialRating={0} start={0} stop={5}  step={1} emptySymbol={<span className="rating-empty"/>} fullSymbol={<span className="rating-full"/>} readonly={true}/></td>
      <td style={{width: '16%'}}><Rating initialRating={0} start={0} stop={5}  step={1} emptySymbol={<span className="rating-empty"/>} fullSymbol={<span className="rating-full"/>} readonly={true}/></td>
      <td style={{width: '42%'}}>
        <ResizableTextarea disabled={true} />
      </td>
      <td style={{width: '8%'}}>
        {
          item.canEdit ? 
          <div className="action-group">
            <Image src={IconEdit} alt="Hủy" className="ic-action ic-reset" onClick={() => this.changeEditingStatus(name, 'isEditing', item.id)} />
            <Image src={IconRemove} alt="Hủy" className="ic-action ic-reset" onClick={() => this.changeEditingStatus(name, 'isDeleted', item.id)} />
          </div> : null
        }
        
      </td>
    </tr>
    })
    
    :
    null
  }

  submitEvalution = () => {
    const { t } = this.props
    const err = this.verifyInputs()

    this.setDisabledSubmitButton(true)
    if (!err || Object.values(err).reduce((t, value) => t + (value ? 1 : 0) , 0) > 0) {
        this.setDisabledSubmitButton(false)
        return
    }
    const candidateInfos = this.state.data;
    const evalution = candidateInfos.evalution;
    const newEvalution = candidateInfos.newEvalution;
    const totalEvalution = [...evalution, ...newEvalution.filter(item => !item.isDeleted).map(item => {item.id = -1; return item})];
    const result = totalEvalution.map( item => {
      return {
        id: item.id,
        TaskName: item.TaskName,
        SelfAssessmentScore: item.SelfAssessmentScore,
        ManagementScore: item.ManagementScore,
        ManagementComment: item.ManagementComment || '',
        IsEdit: item.canEdit,
        IsDeleted: item.isDeleted
      }
    })
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_REQUEST_URL}api/taskAssements/saveTaskAssement/${this.state.id}`,
      data: result,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
    .then(response => {
        if (response && response.data && response.data.result) {
            if(response.data.result.code == '000000'){
              this.showStatusModal(t("RequestSent"), true, true, '/tasks?tab=prepare')
              this.setDisabledSubmitButton(false)
              return;
            }
            this.showStatusModal(response.data.result.message, false)
            this.setDisabledSubmitButton(false)    
        }
    })
    .catch(response => {
        this.showStatusModal("Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
        this.setDisabledSubmitButton(false)
    })
  }

  setDisabledSubmitButton(status, actionType = null) {
    this.setState({ disabledSubmitButton: status, actionType: actionType });
  }

  handleDatePickerInputChange = (value, name, subname) => {
    const candidateInfos = {...this.state.data}
    if (moment(value, 'DD/MM/YYYY').isValid()) {
        const date = moment(value).format('DD/MM/YYYY')
        candidateInfos[name][subname] = date
        if(subname == 'startDate' && candidateInfos[name].endDate && moment(moment(candidateInfos[name].startDate, 'DD/MM/YYYY')).isAfter(moment(candidateInfos[name].endDate, 'DD/MM/YYYY')) ){
          candidateInfos[name].endDate = null  
        }
    } else {
        candidateInfos[name][subname] = null
    }
    this.setState({data : candidateInfos})
  }

  submit(actionType) {
    const { t } = this.props
    const err = this.verifyInputs()

    this.setDisabledSubmitButton(true, actionType)
    if (!err || Object.values(err).reduce((t, value) => t + (value ? 1 : 0) , 0) > 0) {
        this.setDisabledSubmitButton(false, actionType)
        return
    }

    let url = `${process.env.REACT_APP_REQUEST_URL}StaffContract/updatevaluation`;
    let home = '/tasks?tab=evalution';
    if(this.state.type == 'assess'){
      url = `${process.env.REACT_APP_REQUEST_URL}StaffContract/fetchEvaluation?actionRequest=${actionType}`
      home = '/tasks?tab=consent';
    }else if(this.state.type == 'approval') {
      url = `${process.env.REACT_APP_REQUEST_URL}StaffContract/approvals`
      home = '/tasks?tab=approval'
    }

    const bodyFormData = this.prepareDataToSubmit(this.state.data);
    axios({
        method: 'POST',
        url:url,
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
        .then(response => {
          if(response.data.result && response.data.result.code == '000000'){
            this.showStatusModal(t("RequestSent"), true, true, home)
            this.setDisabledSubmitButton(false, actionType)
            return;
          }
          this.showStatusModal(response.data.result.message || 'Có lỗi xảy ra trong quá trình cập nhật thông tin!', false)
          this.setDisabledSubmitButton(false, actionType)    

            // if (response && response.data && response.data.result) {
            //     this.showStatusModal(t("RequestSent"), true, true, home)
            //     this.setDisabledSubmitButton(false)
            // }
        })
        .catch(response => {
            this.showStatusModal("Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
            this.setDisabledSubmitButton(false, actionType)
        })
}
  

  render() {
    const { t } = this.props
    const showComponent = this.state.showComponent;
    const disableComponent = this.state.disableComponent;
    const data = this.state.data;
    
    return (
      <div className="registration-section">

      <div className="leave-of-absence evalution">
        <div className="eval-heading">
            BIÊN BẢN ĐÁNH GIÁ GIAO KẾT / GIA HẠN HĐLĐ 
        </div>

        <div className="sub-heading">
          {showComponent.employeeSide ? '' : '(Quản lý trực tiếp vui lòng nhập các yêu cầu công việc vào phần thông tin đánh giá)'}
        </div>
        <h5>THÔNG TIN NGƯỜI ĐƯỢC ĐÁNH GIÁ</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-4">
             {t("FullName")}
              <div className="detail">{data.employeeInfo.fullName || ""}</div>
            </div>
            <div className="col-4">
              {t("Title")}
              <div className="detail">{data.employeeInfo.positionName || ""}</div>
            </div>
            <div className="col-4">
              {t('DepartmentManage')}
              <div className="detail">{data.employeeInfo.departmentName || ""}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              {"Ngày làm việc"}
              <div className="detail">{data.employeeInfo.startDate ? moment(data.employeeInfo.startDate).format("DD/MM/YYYY") : '' }</div>
            </div>
            <div className="col-4">
              {"Ngày hết hạn HĐTV/HĐLĐ"}
              <div className="detail">{data.employeeInfo.expireDate ? moment(data.employeeInfo.expireDate).format("DD/MM/YYYY") : '' }</div>
            </div>
          </div>
        </div>
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <h5>Thông tin đánh giá</h5>
        <div className="box shadow cbnv">
          <div className="row description">
            <div className="col-3 title">
             Thang điểm đánh giá
            </div>
            <div className="col-9">
              <span>(4) Vượt yêu cầu</span>
              <span>(3) Đạt</span>
              <span>(2) Chưa đạt</span>
              <span>(1) Không đạt</span>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
            <div  style={{height: '2px', backgroundColor: '#F2F2F2', margin: '15px 0 20px'}}></div>
            </div>
          </div>
          <div className="row task">
            <div className="col-12">
              <div className="box shadow">
                {
                  (!showComponent.JobEditing) ?
                    <table>
                    <thead>
                      <tr>
                        <th style={{width: '22%'}}>Nội dung đánh giá</th>
                        <th style={{width: '16%'}}>Tự đánh giá</th>
                        <th style={{width: '22%'}}>CBLĐ TT đánh giá</th>
                        <th style={{width: '40%'}}>Nhận xét</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        data.evalution.length > 0 ? 
                        data.evalution.map( (item, index) => {
                          if(item.isDeleted)
                            return null;
                          return <tr key = {index}>
                          <td style={{width: '22%'}}>{item.TaskName}</td>
                          <td style={{width: '16%'}}><Rating onChange={(rating) => this.handleRatingChangeForItem(rating, 'evalution', item.id, 'SelfAssessmentScore')} initialRating={item.SelfAssessmentScore || 0} start={0} stop={5}  step={1} emptySymbol={<span className="rating-empty"/>} fullSymbol={<span className="rating-full"/>} readonly={disableComponent.disableAll || !disableComponent.employeeSide}/></td>
                          <td style={{width: '22%'}}><Rating onChange={(rating) => this.handleRatingChangeForItem(rating, 'evalution', item.id, 'ManagementScore')} initialRating={item.ManagementScore || 0} start={0} stop={5}  step={1} emptySymbol={<span className="rating-empty"/>} fullSymbol={<span className="rating-full"/>} readonly={disableComponent.disableAll || !disableComponent.qlttSide}/></td>
                          <td style={{width: '40%'}}>
                            <ResizableTextarea onChange={(e) => this.handleTextInputChangeForItem(e, 'evalution', item.id, 'ManagementComment')}  disabled={disableComponent.disableAll || !disableComponent.qlttSide} value={item.ManagementComment}/>
                          </td>
                        </tr>
                        })
                        :
                        null
                      }
                    </tbody>
                    <thead>
                      <tr>
                        <th style={{width: '22%'}}>Tổng điểm</th>
                        <th style={{width: '16%'}}>{data.SelfAssessmentScoreTotal}</th>
                        <th style={{width: '22%'}}>{data.ManagementScoreTotal}</th>
                        <th style={{width: '40%'}}></th>
                      </tr>
                    </thead>
                  </table>
                  : 
                  <>
                  <table>
                    <thead>
                      <tr>
                        <th style={{width: '20%'}}>Nội dung đánh giá</th>
                        <th style={{width: '14%'}}>Tự đánh giá</th>
                        <th style={{width: '16%'}}>CBLĐ TT đánh giá</th>
                        <th style={{width: '42%'}}>Nhận xét</th>
                        <th style={{width: '8%'}}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.renderEvalution('evalution', data.evalution, disableComponent.disableAll || !disableComponent.editable)
                      }
                      {
                        this.renderEvalution('newEvalution', data.newEvalution, disableComponent.disableAll || !disableComponent.editable)
                      }
                    </tbody>
                  </table>
                  </>
                }
              </div>
              {this.state.errors && this.state.errors['rating'] ? <p className="text-danger">{this.state.errors['rating']}</p> : null}
            </div>
          </div>
          {
            showComponent.JobEditing ? disableComponent.disableAll ? null : 
            <div className="row">
              <div className="col-12">
                <div className="buttn-addmore" onClick={() => this.addMoreEvalution()}>
                  <Image src={IconAdd} alt="Hủy" className="ic-action ic-reset" />
                  Thêm đánh giá
                </div>
              </div>  
            </div> : null
          }
          
        </div>

        <h5>THÔNG TIN THÊM</h5>
        <div className="box shadow cbnv more-description">
          <div className="title">
              TỰ ĐÁNH GIÁ
          </div>
          <div className="row">
            <div className="col-6">
              Điểm mạnh
              <ResizableTextarea disabled={disableComponent.disableAll || !disableComponent.employeeSide} value={data.selfEvalution.strong} onChange={(e) => this.handleTextInputChange(e, 'selfEvalution', 'strong')} className="mv-10"/>
            </div>
            <div className="col-6">
              Điểm cần cải thiên
              <ResizableTextarea disabled={disableComponent.disableAll || !disableComponent.employeeSide} value={data.selfEvalution.weak} onChange={(e) => this.handleTextInputChange(e, 'selfEvalution', 'weak')} className="mv-10"/>
            </div>
            <div className="col-12">
              Ý kiến đề xuất của CBNV
              <ResizableTextarea disabled={disableComponent.disableAll || !disableComponent.employeeSide} value={data.selfEvalution.opinion} onChange={(e) => this.handleTextInputChange(e, 'selfEvalution', 'opinion')} className="mv-10"/>
            </div>
          </div>
        </div>
        <div className="box shadow cbnv more-description">
          <div className="title">
            CBLĐ TT ĐÁNH GIÁ
          </div>
          <div className="row">
            <div className="col-6">
              Điểm mạnh
              <ResizableTextarea disabled={disableComponent.disableAll || !disableComponent.qlttSide} value={data.bossEvalution.strong} onChange={(e) => this.handleTextInputChange(e, 'bossEvalution', 'strong')} className="mv-10"/>
            </div>
            <div className="col-6">
              Điểm cần cải thiên
              <ResizableTextarea disabled={disableComponent.disableAll || !disableComponent.qlttSide} value={data.bossEvalution.weak} onChange={(e) => this.handleTextInputChange(e, 'bossEvalution', 'weak')} className="mv-10"/>
            </div>
          </div>
        </div>

        <h5>Thông tin khóa học</h5>
        <div className="box shadow cbnv">
          <div className="row task">
            <div className="col-12">
              <div className="box shadow">
                <table>
                  <thead>
                    <tr>
                      <th style={{width: '10%'}}>STT</th>
                      <th style={{width: '25%'}}>Tên khóa học</th>
                      <th style={{width: '25%'}}>Tình trạng</th>
                      <th style={{width: '40%'}}>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data.course.length > 0 ? 
                      data.course.map( (item, index) => {
                        return <tr key = {index}>
                          <td style={{width: '10%'}}>{index + 1}</td>
                          <td style={{width: '25%'}}>{item.name}</td>
                          <td style={{width: '25%'}}>{item.status ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</td>
                          {
                            index == 0 ?
                            <td style={{width: '40%'}} rowSpan={data.course.length}>
                              Không đạt sẽ không đủ điều kiện ký kết hợp đồng
                            </td> :
                             null
                          }
                          
                        </tr>
                      }) : null
                    }
                    {/* <tr>
                      <td style={{width: '10%'}}>1</td>
                      <td style={{width: '25%'}}>Văn hóa Vin</td>
                      <td style={{width: '25%'}}>Đã hoàn thành</td>
                      <td style={{width: '40%'}} rowSpan={2}>
                        Không đạt sẽ không đủ điều kiện ký kết hợp đồng
                      </td>
                    </tr>
                    <tr>
                      <td style={{width: '10%'}}>2</td>
                      <td style={{width: '25%'}}>Quản lý dự án cơ bản</td>
                      <td style={{width: '25%'}}>Chưa hoàn thành</td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <h5>Thông tin hồ sơ</h5>
        <div className="box shadow cbnv document">
          <div className="row">
            <div className="col-12">
              <label>Tình trạng hồ sơ:</label> <span>{data.documentStatus}</span>
            </div>
          </div>
        </div>

        <h5>QUYẾT ĐỊNH XỬ LÝ VI PHẠM</h5>
        {
          data.violation.length > 0 ? 
          data.violation.map((item, index) => {
            return <div className="box shadow cbnv" key={index}>
            <div className="row">
              <div className="col-4">
                Số quyết định
                <div className="detail">{item.quyetdinh}</div>
              </div>
              <div className="col-2">
                Ngày hiệu lực
                <div className="detail">{item.hieuluc ? moment(item.hieuluc).format("DD/MM/YYYY") : ''}</div>
              </div>
              <div className="col-6">
                Nhóm lỗi
                <div className="detail">{item.nhomloi}</div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                Lý do kỷ luật
                <div className="detail">{item.lydo}</div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                Nội dung kỷ luật
                <div className="detail">{item.noidung}</div>
              </div>
            </div>
          </div>
          }) : null
        }
        
        {
          showComponent.employeeSide ? 
          <>
            <div className="box shadow cbnv">
            
              <div className="row approve">
                <div className="col-12">
                <span className="title">NGƯỜI ĐÁNH GIÁ</span><span className="sub-title">(Nếu có)</span>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                <div  style={{height: '2px', backgroundColor: '#F2F2F2', margin: '15px 0'}}></div>
                </div>
              </div>
              <ApproverComponent isEdit={disableComponent.disableAll || !disableComponent.employeeSide} approver={data.nguoidanhgia}  updateApprover={(approver, isApprover) => this.updateApprover('nguoidanhgia', approver,isApprover )} />
              {this.state.errors && this.state.errors['nguoidanhgia'] ? <p className="text-danger">{this.state.errors['nguoidanhgia']}</p> : null}
            </div>

            <div className="box shadow cbnv">
              <div className="row approve">
                <div className="col-12">
                <span className="title">QUẢN LÝ TRỰC TIẾP ĐÁNH GIÁ</span>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                <div  style={{height: '2px', backgroundColor: '#F2F2F2', margin: '15px 0'}}></div>
                </div>
              </div>
              <ApproverComponent isEdit={disableComponent.disableAll || !disableComponent.employeeSide} approver={data.qltt}  updateApprover={(approver, isApprover) => this.updateApprover('qltt', approver,isApprover )} />
              {this.state.errors && this.state.errors['qltt'] ? <p className="text-danger">{this.state.errors['qltt']}</p> : null}
            </div>
          </> : 
          <>
            {/* quan li */}
            <div className="box shadow cbnv more-description">
              <div className="title">
                Ý KIẾN ĐỀ XUẤT CỦA CBQL TRỰC TIẾP
              </div>
              <div className="row">
                <div className="col-3">
                  Kết quả
                  <Select  placeholder={"Lựa chọn kết quả"} options={this.resultOptions} isDisabled={disableComponent.disableAll || !disableComponent.qlttSide}  isClearable={true} 
                  value={this.resultOptions.filter(d => data.qlttOpinion.result != null && d.value == data.qlttOpinion.result.value)}
                  onChange={e => this.handleChangeSelectInputs(e,'qlttOpinion', 'result')} className="input"
                  styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                  {this.state.errors && this.state.errors['result'] ? <p className="text-danger">{this.state.errors['result']}</p> : null}
                  {/* <div className="detail">{requestInfo ? moment(requestInfo.startDate).format("DD/MM/YYYY") + (requestInfo.startTime ? ' ' + moment(requestInfo.startTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '') : ""}</div> */}
                </div>
                <div className="col-3">
                  Loại hợp đồng lao động
                  <Select  placeholder={"Lựa chọn loại hợp đồng"} options={this.contractTypeOptions} isDisabled={disableComponent.disableAll || !disableComponent.qlttSide}  isClearable={true} 
                  value={this.contractTypeOptions.filter(d => data.qlttOpinion.contract != null && d.value == data.qlttOpinion.contract.value)}
                  onChange={e => this.handleChangeSelectInputs(e,'qlttOpinion', 'contract')} className="input"
                  styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                  {this.state.errors && this.state.errors['contract'] ? <p className="text-danger">{this.state.errors['contract']}</p> : null}
                  {/* <ResizableTextarea disabled={true} className="mv-10"/> */}
                </div>
                <div className="col-3">
                  Ngày bắt đầu hợp đồng
                  <DatePicker
                    name="startDate"
                    readOnly={disableComponent.disableAll || !disableComponent.qlttSide}
                    autoComplete="off"
                    selected={data.qlttOpinion.startDate ? moment(data.qlttOpinion.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                    //startDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                    //endDate={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                    // minDate={['V030'].includes(localStorage.getItem('companyCode')) ? moment(new Date().getDate() - 1, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                    //minDate={moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24), Constants.LEAVE_DATE_FORMAT).toDate()}
                    //onChange={date => this.setStartDate(date, reqDetail.groupId, reqDetail.groupItem)}
                    onChange={date => this.handleDatePickerInputChange(date, 'qlttOpinion', 'startDate')}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={t('Select')}
                    locale={t("locale")}
                    className="form-control input" />
                  {this.state.errors && this.state.errors['startDate'] ? <p className="text-danger">{this.state.errors['startDate']}</p> : null}
                </div>
                <div className="col-3">
                  Ngày kết thúc hợp đồng
                  <DatePicker
                    name="startDate"
                    readOnly={disableComponent.disableAll || !disableComponent.qlttSide}
                    autoComplete="off"
                    selected={data.qlttOpinion.endDate ? moment(data.qlttOpinion.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                    //startDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                    //endDate={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                    minDate={ data.qlttOpinion.startDate ? moment(data.qlttOpinion.startDate + 1, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                    //minDate={moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24), Constants.LEAVE_DATE_FORMAT).toDate()}
                    onChange={date => this.handleDatePickerInputChange(date, 'qlttOpinion', 'endDate')}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={t('Select')}
                    locale={t("locale")}
                    className="form-control input" />
                  {this.state.errors && this.state.errors['endDate'] ? <p className="text-danger">{this.state.errors['endDate']}</p> : null}
                </div>
              </div>
              <div className="row">
                {/* <div className="col-4">
                  Điều chỉnh lương
                  <div className="detail">{requestInfo ? moment(requestInfo.startDate).format("DD/MM/YYYY") + (requestInfo.startTime ? ' ' + moment(requestInfo.startTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '') : ""}</div>
                </div> */}
                <div className="col-12">
                  Đề xuất khác
                  <ResizableTextarea onChange={ e => this.handleTextInputChange(e, 'qlttOpinion', 'otherOption' )} value={data.qlttOpinion.otherOption || ''} disabled={disableComponent.disableAll || !disableComponent.qlttSide} className="mv-10"/>
                </div>
              </div>
            </div>
            {
              // showComponent.HrOption ?
              // <>
              //   <div className="box shadow cbnv more-description">
              //     <div className="title">
              //       Ý KIẾN THẨM ĐỊNH CỦA BỘ PHẬN NHÂN SỰ
              //     </div>
              //     <div className="row">
              //       <div className="col-4">
              //         Kết quả
              //         <div className="detail">{requestInfo ? moment(requestInfo.startDate).format("DD/MM/YYYY") + (requestInfo.startTime ? ' ' + moment(requestInfo.startTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '') : ""}</div>
              //       </div>
              //       <div className="col-8">
              //         Lý do
              //         <div className="detail">{requestInfo ? moment(requestInfo.endDate).format("DD/MM/YYYY") + (requestInfo.endTime ? ' ' + moment(requestInfo.endTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '') : ""}</div>
              //       </div>
              //     </div>
              //   </div>

              //   <div className="box shadow cbnv">
              //     <div className="row approve">
              //       <div className="col-12">
              //       <span className="title">NGƯỜI THẨM ĐỊNH</span>
              //       </div>
              //     </div>
              //     <div className="row">
              //       <div className="col-12">
              //       <div  style={{height: '2px', backgroundColor: '#F2F2F2', margin: '15px 0'}}></div>
              //       </div>
              //     </div>
              //     <ApproverComponent isEdit={!disableComponent.qlttSide} approver={data.thamdinh}  updateApprover={(approver, isApprover) => this.updateApprover('thamdinh', approver,isApprover )} />
              //   </div>
              // </>
              // : null
            }
            
            {
              showComponent.bossSide ? 
              null :
              <div className="box shadow cbnv">
            
              <div className="row approve">
                <div className="col-12">
                <span className="title">NGƯỜI PHÊ DUYỆT</span>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                <div  style={{height: '2px', backgroundColor: '#F2F2F2', margin: '15px 0'}}></div>
                </div>
              </div>
              <ApproverComponent isEdit={disableComponent.disableAll || !disableComponent.qlttSide} approver={data.nguoipheduyet}  updateApprover={(approver, isApprover) => this.updateApprover('nguoipheduyet', approver,isApprover )} />
              {this.state.errors && this.state.errors['boss'] ? <p className="text-danger">{this.state.errors['boss']}</p> : null}
            </div>
            }
            
          </>
        }
        { 
        data.processStatus == 1 ?
        <>
        <h5>THÔNG TIN PHÊ DUYỆT</h5>
        
          <div className="box shadow cbnv" >
          <div className="row">
            <div className="col-4">
              Người phê duyệt
              <div className="detail">{data.nguoipheduyet.fullname}</div>
            </div>
            <div className="col-4">
              Chức danh
              <div className="detail">{data.nguoipheduyet.current_position}</div>
            </div>
            <div className="col-4">
              Khối/Phòng/Bộ phận
              <div className="detail">{data.nguoipheduyet.department}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              Lý do không duyệt
              <div className="detail">{data.employeeInfo.comments || '' }</div>
            </div>
          </div>
          
        </div>
        </> : null
        }

        <ul className="list-inline">
            {data.cvs.map((file, index) => {
                return <li className="list-inline-item" key={index}>
                    <span className="file-name">
                        <a title={file.name} href={file.link} download={file.name} target="_blank">{file.name}</a>
                        {showComponent.employeeSide && !disableComponent.disableAll? 
                        <i className="fa fa-times remove" aria-hidden="true" onClick={e => this.removeFiles(file.id, index)}></i> 
                        : null }
                    </span>
                </li>
            })}
        </ul>
        {this.state.errors && this.state.errors['cvs'] ? <p className="text-danger">{this.state.errors['cvs']}</p> : null}
        {disableComponent.disableAll ? null :
        <div className="bottom">
            <div className="clearfix mt-5 mb-5">
                {
                  showComponent.JobEditing ?
                  <button type="button" className=" btn btn-success  float-right ml-3 shadow" onClick={this.submitEvalution.bind(this)} disabled={this.state.disabledSubmitButton}>
                    {!this.state.disabledSubmitButton ?
                        <>
                            {/* <i className="fa fa-paper-plane mr-2" aria-hidden="true">
                            </i> */}
                        <Image src={IconSave} className="ic-action ic-reset mr-2" />
                        </> :
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mr-2"
                        />}
                        {'Lưu'}
                </button> :
                <>
                  {showComponent.bossSide ? 
                  <button type="button" className="btn btn-success float-right ml-3 shadow" onClick={this.submit.bind(this)} disabled={this.state.disabledSubmitButton}>
                      {!this.state.disabledSubmitButton ?
                          <>
                              <i className="fa fa-paper-plane mr-2" aria-hidden="true">
                              </i>
                          </> :
                          <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="mr-2"
                          />}
                          {'Phê duyệt'}
                  </button> : 
                  <button type="button" className="btn btn-primary float-right ml-3 shadow" onClick={() => this.submit(2)} disabled={this.state.disabledSubmitButton}>
                    {!(this.state.disabledSubmitButton && this.state.actionType == 2) ?
                        <>
                            <i className="fa fa-paper-plane mr-2" aria-hidden="true">
                            </i>
                        </> :
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mr-2"
                        />}
                        {t('Send')}
                </button>
                  }
                  {showComponent.employeeSide ? 
                  <>
                  <input type="file" hidden  type="file" id="i_files" name="i_files" onChange={this.handleChangeFileInput} multiple />
                  <label htmlFor="i_files" className="btn btn-light float-right shadow">
                    <i className="fas fa-paperclip"></i> {t('AttachmentFile')}
                  </label>
                  </> 
                  : !showComponent.bossSide ? <button type="button" className=" btn btn-success  float-right ml-3 shadow" onClick={() => this.submit(1)} disabled={this.state.disabledSubmitButton}>
                    {!(this.state.disabledSubmitButton && this.state.actionType == 1) ?
                        <>
                            {/* <i className="fa fa-paper-plane mr-2" aria-hidden="true">
                            </i> */}
                        <Image src={IconSave} className="ic-action ic-reset mr-2" />
                        </> :
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mr-2"
                        />}
                        {'Lưu'}
                    </button> : null }
                </>
                }

            </div>
        </div>
        }
      </div>
      </div>
    )
  }
}

export default withTranslation()(LeaveOfAbsenceDetailComponent)
