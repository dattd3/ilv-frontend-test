import React from 'react'
import moment from 'moment'
import Spinner from 'react-bootstrap/Spinner'
import StatusModal from '../../components/Common/StatusModal'
import { Image } from 'react-bootstrap'
import IconEdit from '../../assets/img/ic-edit.svg';
import IconRemove from '../../assets/img/ic-remove.svg';
import IconAdd from '../../assets/img/ic-add.svg';
import IconSave from '../../assets/img/ic-save.svg';
import ResizableTextarea from '../Registration/TextareaComponent';
import ApproverComponent from './SearchUserComponent'
import Select from 'react-select'
import Constants from '../../commons/Constants'
import { checkIsExactPnL, getRequestConfigs } from '../../commons/commonFunctions'
import { withTranslation } from "react-i18next"
import axios from 'axios'
import Rating from 'react-rating';
import _, { debounce } from 'lodash'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { vi, enUS } from 'date-fns/locale'
import HOCComponent from '../../components/Common/HOCComponent'

const TIME_FORMAT = 'HH:mm'
const DATE_FORMAT = 'DD/MM/YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'
const TIME_OF_SAP_FORMAT = 'HHmm00'
const FULL_DAY = true

const currentUserEmail = localStorage.getItem("email")?.toLowerCase();
class LeaveOfAbsenceDetailComponent extends React.Component {

  HD_THUVIEC = 2;

  checkAuthorize = () => {
    const currentEmployeeNo = localStorage.getItem('email');
    const canEditable = {...this.state.canEditable};
    const data = this.state.data;
    let employeeEmail = this.state.data.employee.employeeEmail;
    for (const [key, value] of Object.entries(this.state.data)) {
      if(key === 'employee') {
        let filled = null;
        for (const [key_d, value_d] of Object.entries(data)) {
          filled = (key_d == 'employee') || ( data[key_d] && data[key_d].user && data[key_d].user.account) ? filled :  '(Bắt buộc)' ;
        }
        if(filled && value && value.employeeEmail && value.employeeEmail.toLowerCase()  == currentEmployeeNo.toLowerCase()){
          canEditable[key] = true;
          canEditable['canUpdate'] = true;
          canEditable['currentActive'] = ['employee'];
        }
      } else {
        let filled = data[key] && data[key].status ? null : '(Bắt buộc)';
        if(value && value.user && value.user.account && (value.user.account.toLowerCase()  + '@vingroup.net') == currentEmployeeNo.toLowerCase() ) {
          canEditable[key] = true;
          canEditable['hanover_' + key] = !data[key].status;
          canEditable['canUpdate'] = true;
          canEditable['employee'] = false;
          if(!canEditable.currentActive.includes("employee"))
            canEditable.currentActive.push(key);
        }
        if(this.state.isViewAll && data[key].status != true && employeeEmail.toLowerCase()  != currentEmployeeNo.toLowerCase()) {
          canEditable['manager_' + key] = true;
        }
      }
    }
    this.setState({
      canEditable: canEditable
    })
  }

  constructor(props) {
    super();
    this.state = {
      isShowStatusModal: false,
      annualLeaveSummary: {},
      data: {
        employee: {
          fullName: '',
          employeeEmail: '',
          positionName: '',
          departmentName: '',
          startDate: '',
          expireDate: '',
          isShow: false,
        },
        job: {
            mainWork: '',
            controlWork: '',
            actionDate: '',
            otherWork: '',
            status: null,
            user: {},
            note: '',
            isShow: false,
        },
        asset: {
            user: {},
            actionDate: '',
            status: null,
            note: '',
            isShow: false,
        },
        taxi: {
          user: {},
          actionDate: '',
          status: null,
          note: '',
          isShow: false,
        },
        associateCard: {
            user: {},
            status: null,
            actionDate: '',
            note: '',
            isShow: false,
        },
        uniform: {
            user: {},
            status: null,
            actionDate: '',
            note: '',
            isShow: false,
        },
        finger: {
            user: {},
            status: null,
            actionDate: '',
            note: '',
            isShow: false,
        },
        inout: {
            user: {},
            status: null,
            actionDate: '',
            note: '',
            isShow: false,
        },
        tool: {
            user: {},
            status: null,
            actionDate: '',
            note: '',
            isShow: false,
        },
        policy: {
            user: {},
            status: null,
            actionDate: '',
            note: '',
            isShow: false,
        },
        traning: {
          user: {},
          status: null,
          actionDate: '',
          note: '',
          isShow: false,
        },
        internal: {
          user: {},
          status: null,
          actionDate: '',
          note: '',
          isShow: false,
        }
      },
      canEditable: {
        employee: false,
        job: false,
        asset: false,
        taxi: false,
        associateCard: false,
        uniform: false,
        finger: false,
        inout: false,
        tool: false,
        policy: false,
        traning: false,
        internal: false,
        canUpdate: false,
        currentActive: []
      },
      isViewAll: true,
      errors: {
      }
    }
    this.resultOptions = [
      {value: 0, label: props.t('unfinished')},
      {value: 1, label: props.t('accomplished')}
    ];
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({
        id: id
    })

    let url = `${process.env.REACT_APP_REQUEST_URL}WorkOffDeliver/getbangiaoinfo?ContractTerminationInfoId=${id}`;
    axios.get(url, getRequestConfigs())
    .then(res => {
      if (res && res.data && res.data.data && res.data.result) {
        const result = res.data.result;
        if (result.code != Constants.API_ERROR_CODE) {
          const responseData = this.saveStateInfos(res.data.data);
          this.setState({data : responseData.data, remoteData: responseData.remoteData, isViewAll: res.data.data.isViewAll }, () => {
            this.checkAuthorize();
          });
        }
      }
    }).catch(error => {})

  }

  prepareDataToSubmit = (data, remoteData) => {
    //const isEmployee = this.state.canEditable.currentActive.includes("employee");
    if(this.state.isViewAll) {
      remoteData.contractTerminationInfoId  = this.props.match.params.id;
      remoteData.projessionlWork = data.job.mainWork;
      remoteData.controlWord = data.job.controlWork;
      remoteData.otherWork = data.job.otherWork;
      remoteData.handoverWork = data.job.user;
      remoteData.handoverAsset = data.asset.user;
      remoteData.vehicleCard = data.taxi.user?.account ? data.taxi.user : null;
      remoteData.handoverSocial = data.associateCard.user;
      remoteData.handoverUniform = data.uniform.user;
      remoteData.handoverFingerprintEmail = data.finger.user;
      remoteData.handoverDebt = data.inout.user;
      remoteData.handoverSoftware = data.tool.user?.account ? data.tool.user : null ;
      remoteData.handoverConfirmation = data.policy.user?.account ? data.policy.user : null;
      remoteData.trainingDebt = data.traning.user?.account ? data.traning.user : null;
      remoteData.internalDebt = data.internal.user?.account ? data.internal.user : null;
    } else {
      this.state.canEditable.currentActive.map( (key) => {
        switch(key) {
          case 'job':
            remoteData.dateHandoverWork = data.job.actionDate;
            remoteData.statusWork = data.job.status ? 1 : 0;
            remoteData.noteWord = data.job.note;
            remoteData.handoverWork = data.job.user;
            break;
          case 'asset':
            remoteData.dateImplementationAsset = data.asset.actionDate;
            remoteData.statusAsset = data.asset.status ? 1 : 0;
            remoteData.noteAsset = data.asset.note;
            remoteData.handoverAsset = data.asset.user;
            break;
          case 'taxi':
            remoteData.vehicleCardDate = data.taxi.actionDate;
            remoteData.vehicleCardStatus = data.taxi.status ? 1 : 0;
            remoteData.vehicleCardNote = data.taxi.note;
            remoteData.vehicleCard = data.taxi.user?.account ? data.taxi.user : null;
            break;
          case 'associateCard':
            remoteData.dateHandoverSocial = data.associateCard.actionDate;
            remoteData.statusSocial = data.associateCard.status ? 1 : 0;
            remoteData.noteSocial = data.associateCard.note;
            remoteData.handoverSocial = data.associateCard.user;
            break;
          case 'uniform':
            remoteData.dateHandoverUniform = data.uniform.actionDate;
            remoteData.statusUniform = data.uniform.status ? 1 : 0;
            remoteData.noteUniform = data.uniform.note;
            remoteData.handoverUniform = data.uniform.user;
            break;
          case 'finger':
            remoteData.dateHandoverFingerEmail = data.finger.actionDate;
            remoteData.statusFingerprintEmail = data.finger.status ? 1 : 0;
            remoteData.noteFingerprintEmail = data.finger.note;
            remoteData.handoverFingerprintEmail = data.finger.user;
            break;
          case 'inout':
            remoteData.dateHandoverDebt = data.inout.actionDate;
            remoteData.statusDebt = data.inout.status ? 1 : 0;
            remoteData.noteDebt = data.inout.note;
            remoteData.handoverDebt = data.inout.user;
            break;
          case 'tool':
            remoteData.dateHandoverSoftware = data.tool.actionDate;
            remoteData.statusSoftware = data.tool.status ? 1 : 0;
            remoteData.noteSoftware = data.tool.note;
            remoteData.handoverSoftware = data.tool.user?.account ? data.tool.user : null ;
            break;
          case 'policy':
            remoteData.dateHandoverConfirmation = data.policy.actionDate;
            remoteData.statusConfirmation = data.policy.status ? 1 : 0;
            remoteData.noteConfirmation = data.policy.note;
            remoteData.handoverConfirmation = data.policy.user?.account ? data.policy.user : null;
            break;
          case 'traning':
            remoteData.trainingDebtDate = data.traning.actionDate;
            remoteData.trainingDebtStatus = data.traning.status ? 1 : 0;
            remoteData.trainingDebtNote = data.traning.note;
            remoteData.trainingDebt = data.traning.user?.account ? data.traning.user : null;
            break;
          case 'internal':
            remoteData.internalDebtDate = data.internal.actionDate;
            remoteData.internalDebtStatus = data.internal.status ? 1 : 0;
            remoteData.internalDebtNote = data.internal.note;
            remoteData.internalDebt = data.internal.user?.account ? data.internal.user : null;
            break;

        }
      })
    }
    return remoteData;
  }

  saveStateInfos = (infos) => {
    const candidateInfos = {...this.state.data}
    const { isViewAll } = infos;
    
    if(infos.userInfo){
      candidateInfos.employee = {
        employeeNo: infos.userInfo.employeeNo,
        fullName: infos.userInfo.fullName,
        positionName: infos.userInfo.jobTitle,
        departmentName: infos.userInfo.department,
        startDate: infos.userInfo.dateStartWork,
        expireDate: infos.dateEndWork,
        employeeEmail: infos.userInfo.email,
        requestHistoryId: infos.requestHistoryId
      }
    }
    
    candidateInfos.job =  {
      mainWork: infos.projessionlWork || '',
      controlWork: infos.controlWord || '',
      actionDate: infos.dateHandoverWork || '',
      otherWork: infos.otherWork,
      status: infos.statusWork,
      user: infos.handoverWork || {},
      note: infos.noteWord || '',
      isShow: isViewAll || currentUserEmail === infos.handoverWorkAccount?.toLowerCase()
    }
    candidateInfos.asset = {
      user: infos.handoverAsset || {},
      actionDate: infos.dateImplementationAsset || '',
      status: infos.statusAsset,
      note: infos.noteAsset,
      isShow: isViewAll || currentUserEmail === infos.handoverAssetAccount?.toLowerCase()
    }
    candidateInfos.taxi = {
      user: infos.vehicleCard || {},
      actionDate: infos.vehicleCardDate || '',
      status: infos.vehicleCardStatus,
      note: infos.vehicleCardNote,
      isShow: isViewAll || currentUserEmail === infos.vehicleCardAccount?.toLowerCase()
    }
    candidateInfos.associateCard = {
        user: infos.handoverSocial || {},
        status: infos.statusSocial,
        actionDate: infos.dateHandoverSocial,
        note: infos.noteSocial || '',
        isShow: isViewAll || currentUserEmail === infos.handoverSocialAccount?.toLowerCase()
    }
    candidateInfos.uniform = {
        user: infos.handoverUniform || {},
        status: infos.statusUniform,
        actionDate: infos.dateHandoverUniform || '',
        note: infos.noteUniform || '',
        isShow: isViewAll || currentUserEmail === infos.handoverUniformAccount?.toLowerCase()
    }
    candidateInfos.finger = {
        user: infos.handoverFingerprintEmail || {},
        status: infos.statusFingerprintEmail,
        actionDate: infos.dateHandoverFingerEmail || '',
        note: infos.noteFingerprintEmail || '',
        isShow: isViewAll || currentUserEmail === infos.handoverFingerprintEmailAccount?.toLowerCase()
    }
    candidateInfos.inout = {
        user: infos.handoverDebt || {},
        status: infos.statusDebt,
        actionDate: infos.dateHandoverDebt || '',
        note: infos.noteDebt || '',
        isShow: isViewAll || currentUserEmail === infos.handoverDebtAccount?.toLowerCase()
    }
    candidateInfos.tool = {
        user: infos.handoverSoftware || {},
        status: infos.statusSoftware,
        actionDate: infos.dateHandoverSoftware || '',
        note: infos.noteSoftware || '',
        isShow: isViewAll || currentUserEmail === infos.handoverSoftwareAccount?.toLowerCase()
    }
    candidateInfos.policy = {
        user: infos.handoverConfirmation || {},
        status: infos.statusConfirmation,
        actionDate: infos.dateHandoverConfirmation || '',
        note: infos.noteConfirmation || '',
        isShow: isViewAll || currentUserEmail === infos.handoverConfirmationAccount?.toLowerCase()
    }
    candidateInfos.traning = {
      user: infos.trainingDebt || {},
      status: infos.trainingDebtStatus,
      actionDate: infos.trainingDebtDate || '',
      note: infos.trainingDebtNote || '',
      isShow: isViewAll || currentUserEmail === infos.trainingDebtAccount?.toLowerCase()
    }
    candidateInfos.internal = {
      user: infos.internalDebt || {},
      status: infos.internalDebtStatus,
      actionDate: infos.internalDebtDate || '',
      note: infos.internalDebtNote || '',
      isShow: isViewAll || currentUserEmail === infos.internalDebtAccount?.toLowerCase()
    }
    return {data: candidateInfos, remoteData: infos};
  }

  verifyInputs = () => {
    const errors = {};
    const data = this.state.data;
    const isEmployee = true//this.state.canEditable.currentActive.includes("employee");
    let noRequireFields = ['employee', 'tool', 'policy', 'traning', 'internal'];
    if(!checkIsExactPnL(Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading)) {
      noRequireFields.push('taxi');
    } 
    if(isEmployee) {
      for (const [key, value] of Object.entries(data)) {
        errors[key] = (noRequireFields.includes(key)) || ( data[key] && data[key].user && data[key].user.account) ? null :  '(Bắt buộc)' ;
      }
    } 
    // else {
    //   this.state.canEditable.currentActive.map( (key) => {
    //     errors[key+'_status'] = data[key] && data[key].status ? null : '(Bắt buộc)';
    //   })
    // }
    this.setState({errors: errors});
    return errors;
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

  handleChangeSelectInputs = (e, name, subName) => {
    const candidateInfos = {...this.state.data}
    const errors = {...this.state.errors};
    candidateInfos[name][subName] = e != null ? e.value: null;
    candidateInfos[name]['actionDate'] = e && e.value == 1 ? new Date() : '';
    this.setState({errors: errors, data : candidateInfos})
  }

  updateApprover(name, approver, isApprover) {
    const _canEditable = {...this.state.canEditable};
    if(_canEditable['hanover_' + name] == true) {
      if(!approver || approver.account.toLowerCase()  + '@vingroup.net' != localStorage.getItem('email').toLowerCase()) {
        _canEditable[name] = false;
      } else {
        _canEditable[name] = true;
      }
    }
    this.setState({
      canEditable: _canEditable,
      data: {
        ...this.state.data,
        [name]: {
          ...this.state.data[name],
          actionDate: '',
          status: false,
          note: '',
          user: {
            ...approver,
            avatar: null
          }
        } 
      }
    })
}

  setDisabledSubmitButton(status) {
    this.setState({ disabledSubmitButton: status});
  }

  onDownloadsupporterFile() {
    let url = `${process.env.REACT_APP_REQUEST_URL}user/file-suggests?type=7`;
    axios.get(url, getRequestConfigs())
    .then(res => {
      if (res && res.data && res.data.data && res.data.result) {
        const result = res.data.result;
        if (result.code != Constants.API_ERROR_CODE) {
          const url = res.data.data;
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('target' , "_self");
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        }
      }
    }).catch(error => {console.log('Error catch>>>>', error)})
  }


  submit() {
    const { t } = this.props
    const err = this.verifyInputs()
    this.setDisabledSubmitButton(true)
    if (!err || Object.values(err).reduce((t, value) => t + (value ? 1 : 0) , 0) > 0) {
        this.setDisabledSubmitButton(false)
        return
    }
    
    let url = `${process.env.REACT_APP_REQUEST_URL}WorkOffDeliver/fetchbangiao`;

    const bodyFormData = this.prepareDataToSubmit(this.state.data, this.state.remoteData);
    axios({
        method: 'POST',
        url:url,
        data: bodyFormData,
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
        .then(response => {
          if(response.data.result && response.data.result.code == '000000'){
            this.showStatusModal(t("RequestSent"), true, true, null)
            this.setDisabledSubmitButton(false)
            return;
          }
          this.showStatusModal(response.data.result.message || t('Error'), false)
          this.setDisabledSubmitButton(false)    

            // if (response && response.data && response.data.result) {
            //     this.showStatusModal(t("RequestSent"), true, true, home)
            //     this.setDisabledSubmitButton(false)
            // }
        })
        .catch(response => {
            this.showStatusModal(t("Error"), false)
            this.setDisabledSubmitButton(false)
        })
}
  

  render() {
    const { t } = this.props
    const { data, canEditable: disableComponent } = this.state;

    return (
      <div className="handover-section">

      <div className="leave-of-absence evalution">
        <div className="eval-heading">
            {t('handover_title')}
        </div>

        <h5>I. {t('ben_ban_giao')}</h5>
        <div className="box cbnv">
          <div className="row">
            <div className="col-4">
             {t('FullName')}
              <div className="detail">{data.employee.fullName || ""}</div>
            </div>
            <div className="col-4">
              {t("Title")}
              <div className="detail">{data.employee.positionName || ""}</div>
            </div>
            <div className="col-4">
              {t('DepartmentManage')}
              <div className="detail">{data.employee.departmentName || ""}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              {t('ngay_lam_viec')}
              <div className="detail">{data.employee.startDate ? moment(data.employee.startDate).format("DD/MM/YYYY") : '' }</div>
            </div>
            <div className="col-4">
              {t('ngay_cham_dut_hdld')}
              <div className="detail">{data.employee.expireDate }</div>
            </div>
          </div>
        </div>
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <h5>II. {t('handover_info')}</h5>
        <div className="box" style={{padding: '10px 20px'}}>
          <span>{t('handover_supporter')}</span>
          <span style={{color: '#4e73df', paddingLeft: '10px', cursor: 'pointer'}} onClick={() => this.onDownloadsupporterFile()}>{t('view_here')}</span>
        </div>
        <div className="box  cbnv more-description">
          <div className="title" style={{ marginBottom: '16px'}}>
            {t('handover_1')}
          </div>
          {
            data.job.isShow && <>
              <div className="row">
                <div className="col-12">
                    <span className="sub-title" style={{margin: '0px'}}>{t('handover_1_1')}</span>
                    <ResizableTextarea placeholder={disableComponent.employee ? t('import') : ''} minRows={3} disabled={!disableComponent.employee} value={data.job.mainWork} onChange={(e) => this.handleTextInputChange(e, 'job', 'mainWork')} className="mv-10"/>
                </div>
                <div className="col-12">
                    <span className="sub-title" style={{margin: '16px 0px 0px 0px', display: 'block'}}>{t('handover_1_2')}</span>
                    <ResizableTextarea placeholder={disableComponent.employee ? t('import') : ''} minRows={3} disabled={!disableComponent.employee} value={data.job.controlWork} onChange={(e) => this.handleTextInputChange(e, 'job', 'controlWork')} className="mv-10"/>
                </div>
                <div className="col-12">
                    <span className="sub-title" style={{margin: '16px 0px 0px 0px', display: 'block'}}>{t('handover_1_3')}</span>
                    <ResizableTextarea placeholder={disableComponent.employee ? t('import') : ''} minRows={3} disabled={!disableComponent.employee} value={data.job.otherWork} onChange={(e) => this.handleTextInputChange(e, 'job', 'otherWork')} className="mv-10"/>
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                    {t('user_action')}
                    <ApproverComponent isEdit={!(disableComponent.employee || disableComponent.manager_job || disableComponent.hanover_job)} approver={data.job.user}  updateApprover={(approver, isApprover) => this.updateApprover('job', approver,isApprover )} errors={{approver: this.state.errors['job']}}/>
                </div>
                <div className="col-4">
                    {t('handover_date')}
                    <ResizableTextarea disabled={true} value={data.job.actionDate ? moment(data.job.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'job', 'actionDate')} className="mv-10"/>
                </div>
                <div className="col-4">
                    {t('handover_status')}
                    <Select  placeholder={t('option')} options={this.resultOptions} isDisabled={!disableComponent.job}  isClearable={true} 
                    value={this.resultOptions.filter(d => data.job.status != null && d.value == data.job.status)}
                    onChange={e => this.handleChangeSelectInputs(e,'job', 'status')} className="input"
                    styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                    {this.state.errors && this.state.errors['job_status'] ? <p className="text-danger">{this.state.errors['job_status']}</p> : null}
                </div>
                <div className="col-12">
                    {t('ghi_chu')}
                    <ResizableTextarea placeholder={disableComponent.job ? t('import') : ''} disabled={!disableComponent.job} value={data.job.note} onChange={(e) => this.handleTextInputChange(e, 'job', 'note')} className="mv-10"/>
                </div>
              </div>
            </>
          }
        </div>
        <div className="box cbnv more-description">
            <div className="title">
            {t('handover_2')}
            </div>
            {
              checkIsExactPnL(Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading) ? 
              <>
                <div className="row">
                    <div className="sub-title" style={{marginTop: '16px'}}>{t('handover_2_1a')}</div>
                </div>
                {
                  data.asset.isShow && <div className="row">
                    <div className="col-4">
                        {t('user_action')}
                        <ApproverComponent isEdit={!(disableComponent.employee || disableComponent.manager_asset || disableComponent.hanover_asset)} approver={data.asset.user}  updateApprover={(approver, isApprover) => this.updateApprover('asset', approver,isApprover )} errors={{approver: this.state.errors['asset']}}/>
                    </div>
                    <div className="col-4">
                        {t('handover_date')}
                        <ResizableTextarea disabled={true} value={data.asset.actionDate ? moment(data.asset.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'asset', 'actionDate')} className="mv-10"/>
                    </div>
                    <div className="col-4">
                        {t('handover_status')}
                            <Select  placeholder={t('option')} options={this.resultOptions} isDisabled={!disableComponent.asset}  isClearable={true} 
                        value={this.resultOptions.filter(d => data.asset.status != null && d.value == data.asset.status)}
                        onChange={e => this.handleChangeSelectInputs(e,'asset', 'status')} className="input"
                        styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                        {this.state.errors && this.state.errors['asset_status'] ? <p className="text-danger">{this.state.errors['asset_status']}</p> : null}
                    </div>
                    <div className="col-12">
                      {t('ghi_chu')}
                        <ResizableTextarea placeholder={disableComponent.asset ? t('import') : ''} disabled={!disableComponent.asset} value={data.asset.note} onChange={(e) => this.handleTextInputChange(e, 'asset', 'note')} className="mv-10"/>
                    </div>
                  </div>
                }
                <div className="row">
                    <div className="sub-title" style={{marginTop: '16px'}}>{t('handover_2_1b')}</div>
                </div>
                {
                  data.taxi.isShow && <div className="row">
                      <div className="col-4">
                          {t('user_action')}
                          <ApproverComponent isEdit={!(disableComponent.employee || disableComponent.manager_taxi || disableComponent.hanover_taxi)} approver={data.taxi.user}  updateApprover={(approver, isApprover) => this.updateApprover('taxi', approver,isApprover )} errors={{approver: this.state.errors['taxi']}}/>
                      </div>
                      <div className="col-4">
                          {t('handover_date')}
                          <ResizableTextarea disabled={true} value={data.taxi.actionDate ? moment(data.taxi.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'taxi', 'actionDate')} className="mv-10"/>
                      </div>
                      <div className="col-4">
                          {t('handover_status')}
                              <Select  placeholder={t('option')} options={this.resultOptions} isDisabled={!disableComponent.taxi}  isClearable={true} 
                          value={this.resultOptions.filter(d => data.taxi.status != null && d.value == data.taxi.status)}
                          onChange={e => this.handleChangeSelectInputs(e,'taxi', 'status')} className="input"
                          styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                          {this.state.errors && this.state.errors['taxi_status'] ? <p className="text-danger">{this.state.errors['taxi_status']}</p> : null}
                      </div>
                      <div className="col-12">
                        {t('ghi_chu')}
                          <ResizableTextarea placeholder={disableComponent.taxi ? t('import') : ''} disabled={!disableComponent.taxi} value={data.taxi.note} onChange={(e) => this.handleTextInputChange(e, 'taxi', 'note')} className="mv-10"/>
                      </div>
                  </div>
                }
              </>
              :
              <>
                <div className="row">
                    <div className="sub-title" style={{marginTop: '16px'}}>{t('handover_2_1')}</div>
                </div>
                {
                  data.asset.isShow && <div className="row">
                    <div className="col-4">
                        {t('user_action')}
                        <ApproverComponent isEdit={!(disableComponent.employee|| disableComponent.manager_asset || disableComponent.hanover_asset)} approver={data.asset.user}  updateApprover={(approver, isApprover) => this.updateApprover('asset', approver,isApprover )} errors={{approver: this.state.errors['asset']}}/>
                    </div>
                    <div className="col-4">
                        {t('handover_date')}
                        <ResizableTextarea disabled={true} value={data.asset.actionDate ? moment(data.asset.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'asset', 'actionDate')} className="mv-10"/>
                    </div>
                    <div className="col-4">
                        {t('handover_status')}
                            <Select  placeholder={t('option')} options={this.resultOptions} isDisabled={!disableComponent.asset}  isClearable={true} 
                        value={this.resultOptions.filter(d => data.asset.status != null && d.value == data.asset.status)}
                        onChange={e => this.handleChangeSelectInputs(e,'asset', 'status')} className="input"
                        styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                        {this.state.errors && this.state.errors['asset_status'] ? <p className="text-danger">{this.state.errors['asset_status']}</p> : null}
                    </div>
                    <div className="col-12">
                      {t('ghi_chu')}
                        <ResizableTextarea placeholder={disableComponent.asset ? t('import') : ''} disabled={!disableComponent.asset} value={data.asset.note} onChange={(e) => this.handleTextInputChange(e, 'asset', 'note')} className="mv-10"/>
                    </div>
                  </div>
                }
              </>
            }

            <div className="row">
                <div className="sub-title">{t('handover_2_2')}</div>
            </div>
            {
              data.associateCard.isShow && <div className="row">
                <div className="col-4">
                {t('user_action')}
                    <ApproverComponent isEdit={!(disableComponent.employee|| disableComponent.manager_associateCard || disableComponent.hanover_associateCard)} approver={data.associateCard.user}  updateApprover={(approver, isApprover) => this.updateApprover('associateCard', approver,isApprover )} errors={{approver: this.state.errors['associateCard']}}/>
                </div>
                <div className="col-4">
                {t('handover_date')}
                    <ResizableTextarea disabled={true} value={data.associateCard.actionDate ? moment(data.associateCard.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'associateCard', 'actionDate')} className="mv-10"/>
                </div>
                <div className="col-4">
                {t('handover_status')}
                    <Select  placeholder={t('option')} options={this.resultOptions} isDisabled={!disableComponent.associateCard}  isClearable={true} 
                    value={this.resultOptions.filter(d => data.associateCard.status != null && d.value == data.associateCard.status)}
                    onChange={e => this.handleChangeSelectInputs(e,'associateCard', 'status')} className="input"
                    styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                    {this.state.errors && this.state.errors['associateCard_status'] ? <p className="text-danger">{this.state.errors['associateCard_status']}</p> : null}
                </div>
                <div className="col-12">
                {t('ghi_chu')}
                    <ResizableTextarea placeholder={disableComponent.associateCard ? t('import') : ''} disabled={!disableComponent.associateCard} value={data.associateCard.note} onChange={(e) => this.handleTextInputChange(e, 'associateCard', 'note')} className="mv-10"/>
                </div>
              </div>
            }

            <div className="row">
                <div className="sub-title">{t('handover_2_3')}</div>
            </div>
            {
              data.uniform.isShow && <div className="row">
                <div className="col-4">
                {t('user_action')}
                    <ApproverComponent isEdit={!(disableComponent.employee|| disableComponent.manager_uniform || disableComponent.hanover_uniform)} approver={data.uniform.user}  updateApprover={(approver, isApprover) => this.updateApprover('uniform', approver,isApprover )} errors={{approver: this.state.errors['uniform']}}/>
                </div>
                <div className="col-4">
                {t('handover_date')}
                    <ResizableTextarea disabled={true} value={data.uniform.actionDate ? moment(data.uniform.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'uniform', 'actionDate')} className="mv-10"/>
                </div>
                <div className="col-4">
                {t('handover_status')}
                    <Select  placeholder={t('option')} options={this.resultOptions} isDisabled={!disableComponent.uniform}  isClearable={true} 
                    value={this.resultOptions.filter(d => data.uniform.status != null && d.value == data.uniform.status)}
                    onChange={e => this.handleChangeSelectInputs(e,'uniform', 'status')} className="input"
                    styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                    {this.state.errors && this.state.errors['uniform_status'] ? <p className="text-danger">{this.state.errors['uniform_status']}</p> : null}
                </div>
                <div className="col-12">
                {t('ghi_chu')}
                    <ResizableTextarea placeholder={disableComponent.uniform ? t('import') : ''}  disabled={!disableComponent.uniform} value={data.uniform.note} onChange={(e) => this.handleTextInputChange(e, 'uniform', 'note')} className="mv-10"/>
                </div>
              </div>
            }

            <div className="row">
                <div className="sub-title">{t('handover_2_4')}</div>
            </div>
            {
              data.finger.isShow && <div className="row">
                <div className="col-4">
                {t('user_action')}
                    <ApproverComponent isEdit={!(disableComponent.employee || disableComponent.manager_finger || disableComponent.hanover_finger)} approver={data.finger.user}  updateApprover={(approver, isApprover) => this.updateApprover('finger', approver,isApprover )} errors={{approver: this.state.errors['finger']}}/>
                </div>
                <div className="col-4">
                {t('handover_date')}
                    <ResizableTextarea disabled={true} value={data.finger.actionDate ? moment(data.finger.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'finger', 'actionDate')} className="mv-10"/>
                </div>
                <div className="col-4">
                {t('handover_status')}
                    <Select  placeholder={t('option')} options={this.resultOptions} isDisabled={!disableComponent.finger}  isClearable={true} 
                    value={this.resultOptions.filter(d => data.finger.status != null && d.value == data.finger.status)}
                    onChange={e => this.handleChangeSelectInputs(e,'finger', 'status')} className="input"
                    styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                    {this.state.errors && this.state.errors['finger_status'] ? <p className="text-danger">{this.state.errors['finger_status']}</p> : null}
                </div>
                <div className="col-12">
                {t('ghi_chu')}
                    <ResizableTextarea placeholder={disableComponent.finger ? t('import') : ''} disabled={!disableComponent.finger} value={data.finger.note} onChange={(e) => this.handleTextInputChange(e, 'finger', 'note')} className="mv-10"/>
                </div>
              </div>
            }

            <div className="row">
                <div className="sub-title">{t('handover_2_5')}</div>
            </div>
            {
              data.inout.isShow && <div className="row">
                <div className="col-4">
                {t('user_action')}
                    <ApproverComponent isEdit={!(disableComponent.employee || disableComponent.manager_inout || disableComponent.hanover_inout) } approver={data.inout.user}  updateApprover={(approver, isApprover) => this.updateApprover('inout', approver,isApprover )} errors={{approver: this.state.errors['inout']}} />
                </div>
                <div className="col-4">
                {t('handover_date')}
                    <ResizableTextarea disabled={true} value={data.inout.actionDate ? moment(data.inout.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'inout', 'actionDate')} className="mv-10"/>
                </div>
                <div className="col-4">
                {t('handover_status')}
                    <Select  placeholder={t('option')} options={this.resultOptions} isDisabled={!disableComponent.inout}  isClearable={true} 
                    value={this.resultOptions.filter(d => data.inout.status != null && d.value == data.inout.status)}
                    onChange={e => this.handleChangeSelectInputs(e,'inout', 'status')} className="input"
                    styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                    {this.state.errors && this.state.errors['inout_status'] ? <p className="text-danger">{this.state.errors['inout_status']}</p> : null}
                </div>
                <div className="col-12">
                {t('ghi_chu')}
                    <ResizableTextarea placeholder={disableComponent.inout ? t('import') : ''} disabled={!disableComponent.inout} value={data.inout.note} onChange={(e) => this.handleTextInputChange(e, 'inout', 'note')} className="mv-10"/>
                </div>
              </div>
            }

            <div className="row">
                <div className="sub-title">{t('handover_2_6')}</div>
            </div>
            {
              data.tool.isShow && <div className="row">
                <div className="col-4">
                {t('user_action')}
                    <ApproverComponent isEdit={!(disableComponent.employee|| disableComponent.manager_tool || disableComponent.hanover_tool)} approver={data.tool.user}  updateApprover={(approver, isApprover) => this.updateApprover('tool', approver,isApprover )} errors={{approver: this.state.errors['tool']}}/>
                </div>
                <div className="col-4">
                {t('handover_date')}
                    <ResizableTextarea disabled={true} value={data.tool.actionDate ? moment(data.tool.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'tool', 'actionDate')} className="mv-10"/>
                </div>
                <div className="col-4">
                {t('handover_status')}
                    <Select  placeholder={t('option')} options={this.resultOptions} isDisabled={!disableComponent.tool}  isClearable={true} 
                    value={this.resultOptions.filter(d => data.tool.status != null && d.value == data.tool.status)}
                    onChange={e => this.handleChangeSelectInputs(e,'tool', 'status')} className="input"
                    styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                    {this.state.errors && this.state.errors['tool_status'] ? <p className="text-danger">{this.state.errors['tool_status']}</p> : null}
                </div>
                <div className="col-12">
                {t('ghi_chu')}
                    <ResizableTextarea placeholder={disableComponent.tool ? t('import') : ''} disabled={!disableComponent.tool} value={data.tool.note} onChange={(e) => this.handleTextInputChange(e, 'tool', 'note')} className="mv-10"/>
                </div>
              </div>
            }

            <div className="row">
                <div className="sub-title">{t('handover_2_7')}</div>
            </div>
            {
              data.policy.isShow && <div className="row">
                <div className="col-4">
                {t('user_action')}
                    <ApproverComponent isEdit={!(disableComponent.employee|| disableComponent.manager_policy || disableComponent.hanover_policy)} approver={data.policy.user}  updateApprover={(approver, isApprover) => this.updateApprover('policy', approver,isApprover )} errors={{approver: this.state.errors['policy']}}/>
                </div>
                <div className="col-4">
                {t('handover_date')}
                    <ResizableTextarea disabled={true} value={data.policy.actionDate ? moment(data.policy.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'policy', 'actionDate')} className="mv-10"/>
                </div>
                <div className="col-4">
                {t('handover_status')}
                    <Select  placeholder={t('option')} options={this.resultOptions} isDisabled={!disableComponent.policy}  isClearable={true} 
                    value={this.resultOptions.filter(d => data.policy.status != null && d.value == data.policy.status)}
                    onChange={e => this.handleChangeSelectInputs(e,'policy', 'status')} className="input"
                    styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                    {this.state.errors && this.state.errors['policy_status'] ? <p className="text-danger">{this.state.errors['policy_status']}</p> : null}
                </div>
                <div className="col-12">
                {t('ghi_chu')}
                    <ResizableTextarea placeholder={disableComponent.policy ? t('import') : ''}  disabled={!disableComponent.policy} value={data.policy.note} onChange={(e) => this.handleTextInputChange(e, 'policy', 'note')} className="mv-10"/>
                </div>
              </div>
            }

            {
              checkIsExactPnL(Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading) ?
              <>
                <div className="row">
                    <div className="sub-title">{t('handover_2_8')}</div>
                </div>
                {
                  data.traning.isShow && <div className="row">
                    <div className="col-4">
                    {t('user_action')}
                        <ApproverComponent isEdit={!(disableComponent.employee|| disableComponent.manager_traning || disableComponent.hanover_traning)} approver={data.traning.user}  updateApprover={(approver, isApprover) => this.updateApprover('traning', approver,isApprover )} errors={{approver: this.state.errors['traning']}}/>
                    </div>
                    <div className="col-4">
                    {t('handover_date')}
                        <ResizableTextarea disabled={true} value={data.traning.actionDate ? moment(data.traning.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'traning', 'actionDate')} className="mv-10"/>
                    </div>
                    <div className="col-4">
                    {t('handover_status')}
                        <Select  placeholder={t('option')} options={this.resultOptions} isDisabled={!disableComponent.traning}  isClearable={true} 
                        value={this.resultOptions.filter(d => data.traning.status != null && d.value == data.traning.status)}
                        onChange={e => this.handleChangeSelectInputs(e,'traning', 'status')} className="input"
                        styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                        {this.state.errors && this.state.errors['traning_status'] ? <p className="text-danger">{this.state.errors['traning_status']}</p> : null}
                    </div>
                    <div className="col-12">
                    {t('ghi_chu')}
                        <ResizableTextarea placeholder={disableComponent.traning ? t('import') : ''}  disabled={!disableComponent.traning} value={data.traning.note} onChange={(e) => this.handleTextInputChange(e, 'traning', 'note')} className="mv-10"/>
                    </div>
                  </div>
                }

                <div className="row">
                    <div className="sub-title">{t('handover_2_9')}</div>
                </div>
                {
                  data.internal.isShow && <div className="row">
                    <div className="col-4">
                    {t('user_action')}
                        <ApproverComponent isEdit={!(disableComponent.employee|| disableComponent.manager_internal || disableComponent.hanover_internal)} approver={data.internal.user}  updateApprover={(approver, isApprover) => this.updateApprover('internal', approver,isApprover )} errors={{approver: this.state.errors['internal']}}/>
                    </div>
                    <div className="col-4">
                    {t('handover_date')}
                        <ResizableTextarea disabled={true} value={data.internal.actionDate ? moment(data.internal.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'internal', 'actionDate')} className="mv-10"/>
                    </div>
                    <div className="col-4">
                    {t('handover_status')}
                        <Select  placeholder={t('option')} options={this.resultOptions} isDisabled={!disableComponent.internal}  isClearable={true} 
                        value={this.resultOptions.filter(d => data.internal.status != null && d.value == data.internal.status)}
                        onChange={e => this.handleChangeSelectInputs(e,'internal', 'status')} className="input"
                        styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                        {this.state.errors && this.state.errors['internal_status'] ? <p className="text-danger">{this.state.errors['internal_status']}</p> : null}
                    </div>
                    <div className="col-12">
                    {t('ghi_chu')}
                        <ResizableTextarea placeholder={disableComponent.internal ? t('import') : ''}  disabled={!disableComponent.internal} value={data.internal.note} onChange={(e) => this.handleTextInputChange(e, 'internal', 'note')} className="mv-10"/>
                    </div>
                  </div>
                }
              </> : null
            }

        </div>
        
        {!disableComponent.canUpdate ? null :
        <div className="bottom">
            <div className="clearfix mt-5 mb-5">
                <button type="button" className="btn btn-primary float-right ml-3 shadow" onClick={() => this.submit()} disabled={this.state.disabledSubmitButton}>
                    {!(this.state.disabledSubmitButton) ?
                        null :
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mr-2"
                        />}
                        {t('Update')}
                </button>

            </div>
        </div>
        }
      </div>
      </div>
    )
  }
}

export default HOCComponent(withTranslation()(LeaveOfAbsenceDetailComponent))
