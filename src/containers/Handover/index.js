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
import { getRequestConfigs } from '../../commons/commonFunctions'
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
    {value: 0, label: 'Chưa hoàn thành'},
    {value: 1, label: 'Hoàn thành'}
  ];
  HD_THUVIEC = 2;

  checkAuthorize = () => {
    const currentEmployeeNo = localStorage.getItem('email');
    const canEditable = {...this.state.canEditable};
    const data = this.state.data;
    
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
          canEditable['canUpdate'] = true;
          canEditable['employee'] = false;
          if(!canEditable.currentActive.includes("employee"))
            canEditable.currentActive.push(key);
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
          expireDate: ''
        },
        job: {
            mainWork: '',
            controlWork: '',
            actionDate: '',
            otherWork: '',
            status: null,
            user: {},
            note: ''
        },
        asset: {
            user: {},
            actionDate: '',
            status: null,
            note: ''
        },
        associateCard: {
            user: {},
            status: null,
            actionDate: '',
            note: ''
        },
        uniform: {
            user: {},
            status: null,
            actionDate: '',
            note: ''
        },
        finger: {
            user: {},
            status: null,
            actionDate: '',
            note: ''
        },
        inout: {
            user: {},
            status: null,
            actionDate: '',
            note: ''
        },
        tool: {
            user: {},
            status: null,
            actionDate: '',
            note: ''
        },
        policy: {
            user: {},
            status: null,
            actionDate: '',
            note: ''
        }
      },
      canEditable: {
        employee: false,
        job: false,
        asset: false,
        associateCard: false,
        uniform: false,
        finger: false,
        inout: false,
        tool: false,
        policy: false,
        canUpdate: false,
        currentActive: []
      },
      errors: {
      }
    }
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({
        id: id
    })

    let url = `${process.env.REACT_APP_REQUEST_URL}WorkOffDeliver/getbangiaoinfo?id=${id}`;
    axios.get(url, getRequestConfigs())
    .then(res => {
      if (res && res.data && res.data.data && res.data.result) {
        const result = res.data.result;
        if (result.code != Constants.API_ERROR_CODE) {
          const responseData = this.saveStateInfos(res.data.data);
          this.setState({data : responseData.data, remoteData: responseData.remoteData }, () => {
            this.checkAuthorize();
          });
        }
      }
    }).catch(error => {})

  }

  prepareDataToSubmit = (data, remoteData) => {
    const isEmployee = this.state.canEditable.currentActive.includes("employee");
    if(isEmployee) {
      remoteData.projessionlWork = data.job.mainWork;
      remoteData.controlWord = data.job.controlWork;
      remoteData.otherWork = data.job.otherWork;
      remoteData.handoverWork = data.job.user;
      remoteData.handoverAsset = data.asset.user;
      remoteData.handoverSocial = data.associateCard.user;
      remoteData.handoverUniform = data.uniform.user;
      remoteData.handoverFingerprintEmail = data.finger.user;
      remoteData.handoverDebt = data.inout.user;
      remoteData.handoverSoftware = data.tool.user;
      remoteData.handoverConfirmation = data.policy.user;
    } else {
      this.state.canEditable.currentActive.map( (key) => {
        switch(key) {
          case 'job':
            remoteData.dateHandoverWork = data.job.actionDate;
            remoteData.statusWork = data.job.status;
            remoteData.noteWord = data.job.note;
            break;
          case 'asset':
            remoteData.dateImplementationAsset = data.asset.actionDate;
            remoteData.statusAsset = data.asset.status;
            remoteData.noteAsset = data.asset.note;
            break;
          case 'associateCard':
            remoteData.dateHandoverSocial = data.associateCard.actionDate;
            remoteData.statusSocial = data.associateCard.status;
            remoteData.noteSocial = data.associateCard.note;
            break;
          case 'uniform':
            remoteData.dateHandoverUniform = data.uniform.actionDate;
            remoteData.statusUniform = data.uniform.status;
            remoteData.noteUniform = data.uniform.note;
            break;
          case 'finger':
            remoteData.dateHandoverFingerEmail = data.finger.actionDate;
            remoteData.statusFingerprintEmail = data.finger.status;
            remoteData.noteFingerprintEmail = data.finger.note;
            break;
          case 'inout':
            remoteData.dateHandoverDebt = data.inout.actionDate;
            remoteData.statusDebt = data.inout.status;
            remoteData.noteDebt = data.inout.note;
            break;
          case 'tool':
            remoteData.dateHandoverSoftware = data.tool.actionDate;
            remoteData.statusSoftware = data.tool.status;
            remoteData.noteSoftware = data.tool.note;
            break;
          case 'policy':
            remoteData.dateHandoverConfirmation = data.policy.actionDate;
            remoteData.statusConfirmation = data.policy.status;
            remoteData.noteConfirmation = data.policy.note;
            break;
        }
      })
    }
    return remoteData;
  }

  saveStateInfos = (infos) => {
    const candidateInfos = {...this.state.data}
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
      note: infos.noteWord || ''
    }
    candidateInfos.asset = {
      user: infos.handoverAsset || {},
      actionDate: infos.dateImplementationAsset || '',
      status: infos.statusAsset,
      note: infos.noteAsset
    }
    candidateInfos.associateCard = {
        user: infos.handoverSocial || {},
        status: infos.statusSocial,
        actionDate: infos.dateHandoverSocial,
        note: infos.noteSocial || ''
    }
    candidateInfos.uniform = {
        user: infos.handoverUniform || {},
        status: infos.statusUniform,
        actionDate: infos.dateHandoverUniform || '',
        note: infos.noteUniform || ''
    }
    candidateInfos.finger = {
        user: infos.handoverFingerprintEmail || {},
        status: infos.statusFingerprintEmail,
        actionDate: infos.dateHandoverFingerEmail || '',
        note: infos.noteFingerprintEmail || ''
    }
    candidateInfos.inout = {
        user: infos.handoverDebt || {},
        status: infos.statusDebt,
        actionDate: infos.dateHandoverDebt || '',
        note: infos.noteDebt || ''
    }
    candidateInfos.tool = {
        user: infos.handoverSoftware || {},
        status: infos.statusSoftware,
        actionDate: infos.dateHandoverSoftware || '',
        note: infos.noteSoftware || ''
    }
    candidateInfos.policy = {
        user: infos.handoverConfirmation || {},
        status: infos.statusConfirmation,
        actionDate: infos.dateHandoverConfirmation || '',
        note: infos.noteConfirmation || ''
    }
    return {data: candidateInfos, remoteData: infos};
  }

  verifyInputs = () => {
    const errors = {};
    const data = this.state.data;
    const isEmployee = this.state.canEditable.currentActive.includes("employee");

    if(isEmployee) {
      for (const [key, value] of Object.entries(data)) {
        errors[key] = (key == 'employee') || ( data[key] && data[key].user && data[key].user.account) ? null :  '(Bắt buộc)' ;
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
    this.setState({
      data: {
        ...this.state.data,
        [name]: {
          ...this.state.data[name],
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
          this.showStatusModal(response.data.result.message || 'Có lỗi xảy ra trong quá trình cập nhật thông tin!', false)
          this.setDisabledSubmitButton(false)    

            // if (response && response.data && response.data.result) {
            //     this.showStatusModal(t("RequestSent"), true, true, home)
            //     this.setDisabledSubmitButton(false)
            // }
        })
        .catch(response => {
            this.showStatusModal("Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
            this.setDisabledSubmitButton(false)
        })
}
  

  render() {
    const { t } = this.props
    const disableComponent = this.state.canEditable;
    const data = this.state.data;
    return (
      <div className="handover-section">

      <div className="leave-of-absence evalution">
        <div className="eval-heading">
            BIÊN BẢN BÀN GIAO
        </div>

        <h5>I. BÊN BÀN GIAO</h5>
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
              {"Ngày làm việc"}
              <div className="detail">{data.employee.startDate ? moment(data.employee.startDate).format("DD/MM/YYYY") : '' }</div>
            </div>
            <div className="col-4">
              {"Ngày chấm dứt HĐLĐ"}
              <div className="detail">{data.employee.expireDate }</div>
            </div>
          </div>
        </div>
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <h5>II. THÔNG TIN BÀN GIAO</h5>
        <div className="box  cbnv more-description">
          <div className="title" style={{ marginBottom: '16px'}}>
            II.1 Bàn giao công việc
          </div>
          <div className="row">
            <div className="col-12">
                <span className="sub-title" style={{margin: '0px'}}>II.1.1 Các công việc chuyên môn</span>
                <ResizableTextarea placeholder={disableComponent.employee ? "Nhập nội dung chi tiết" : ''} minRows={3} disabled={!disableComponent.employee} value={data.job.mainWork} onChange={(e) => this.handleTextInputChange(e, 'job', 'mainWork')} className="mv-10"/>
            </div>
            <div className="col-12">
                <span className="sub-title" style={{margin: '16px 0px 0px 0px', display: 'block'}}>II.1.2 Công việc kiểm soát tuân thủ</span>
                <ResizableTextarea placeholder={disableComponent.employee ? "Nhập nội dung chi tiết" : ''} minRows={3} disabled={!disableComponent.employee} value={data.job.controlWork} onChange={(e) => this.handleTextInputChange(e, 'job', 'controlWork')} className="mv-10"/>
            </div>
            <div className="col-12">
                <span className="sub-title" style={{margin: '16px 0px 0px 0px', display: 'block'}}>II.1.3 Các công việc khác</span>
                <ResizableTextarea placeholder={disableComponent.employee ? "Nhập nội dung chi tiết" : ''} minRows={3} disabled={!disableComponent.employee} value={data.job.otherWork} onChange={(e) => this.handleTextInputChange(e, 'job', 'otherWork')} className="mv-10"/>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
                Người nhận bàn giao
                <ApproverComponent isEdit={!disableComponent.employee} approver={data.job.user}  updateApprover={(approver, isApprover) => this.updateApprover('job', approver,isApprover )} errors={{approver: this.state.errors['job']}}/>
            </div>
            <div className="col-4">
                Ngày thực hiện
                <ResizableTextarea disabled={true} value={data.job.actionDate ? moment(data.job.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'job', 'actionDate')} className="mv-10"/>
            </div>
            <div className="col-4">
                Tình trạng
                <Select  placeholder={"Lựa chọn kết quả"} options={this.resultOptions} isDisabled={!disableComponent.job}  isClearable={true} 
                value={this.resultOptions.filter(d => data.job.status != null && d.value == data.job.status)}
                onChange={e => this.handleChangeSelectInputs(e,'job', 'status')} className="input"
                styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                {this.state.errors && this.state.errors['job_status'] ? <p className="text-danger">{this.state.errors['job_status']}</p> : null}
            </div>
            <div className="col-12">
                Ghi chú
                <ResizableTextarea placeholder={disableComponent.job ? "Nhập ghi chú" : ''} disabled={!disableComponent.job} value={data.job.note} onChange={(e) => this.handleTextInputChange(e, 'job', 'note')} className="mv-10"/>
            </div>
          </div>
        </div>
        <div className="box cbnv more-description">
            <div className="title">
                II.2 Bàn giao tài sản
            </div>
            <div className="row">
                <div className="sub-title" style={{marginTop: '16px'}}>II.2.1 Tài sản Công ty (Thẻ ra vào, Máy tính, Điện thoại, Thẻ taxi, Tài sản khác nếu có)</div>
            </div>
            <div className="row">
                <div className="col-4">
                    Người nhận bàn giao
                    <ApproverComponent isEdit={!disableComponent.employee} approver={data.asset.user}  updateApprover={(approver, isApprover) => this.updateApprover('asset', approver,isApprover )} errors={{approver: this.state.errors['asset']}}/>
                </div>
                <div className="col-4">
                    Ngày thực hiện
                    <ResizableTextarea disabled={true} value={data.asset.actionDate ? moment(data.asset.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'asset', 'actionDate')} className="mv-10"/>
                </div>
                <div className="col-4">
                    Tình trạng
                        <Select  placeholder={"Lựa chọn kết quả"} options={this.resultOptions} isDisabled={!disableComponent.asset}  isClearable={true} 
                    value={this.resultOptions.filter(d => data.asset.status != null && d.value == data.asset.status)}
                    onChange={e => this.handleChangeSelectInputs(e,'asset', 'status')} className="input"
                    styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                    {this.state.errors && this.state.errors['asset_status'] ? <p className="text-danger">{this.state.errors['asset_status']}</p> : null}
                </div>
                <div className="col-12">
                    Ghi chú
                    <ResizableTextarea placeholder={disableComponent.asset ? "Nhập ghi chú" : ''} disabled={!disableComponent.asset} value={data.asset.note} onChange={(e) => this.handleTextInputChange(e, 'asset', 'note')} className="mv-10"/>
                </div>
            </div>

            <div className="row">
                <div className="sub-title">II.2.2 Sổ BHXH và BHSK</div>
            </div>
            <div className="row">
                <div className="col-4">
                    Người nhận bàn giao
                    <ApproverComponent isEdit={!disableComponent.employee} approver={data.associateCard.user}  updateApprover={(approver, isApprover) => this.updateApprover('associateCard', approver,isApprover )} errors={{approver: this.state.errors['associateCard']}}/>
                </div>
                <div className="col-4">
                    Ngày thực hiện
                    <ResizableTextarea disabled={true} value={data.associateCard.actionDate ? moment(data.associateCard.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'associateCard', 'actionDate')} className="mv-10"/>
                </div>
                <div className="col-4">
                    Tình trạng
                    <Select  placeholder={"Lựa chọn kết quả"} options={this.resultOptions} isDisabled={!disableComponent.associateCard}  isClearable={true} 
                    value={this.resultOptions.filter(d => data.associateCard.status != null && d.value == data.associateCard.status)}
                    onChange={e => this.handleChangeSelectInputs(e,'associateCard', 'status')} className="input"
                    styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                    {this.state.errors && this.state.errors['associateCard_status'] ? <p className="text-danger">{this.state.errors['associateCard_status']}</p> : null}
                </div>
                <div className="col-12">
                    Ghi chú
                    <ResizableTextarea placeholder={disableComponent.associateCard ? "Nhập ghi chú" : ''} disabled={!disableComponent.associateCard} value={data.associateCard.note} onChange={(e) => this.handleTextInputChange(e, 'associateCard', 'note')} className="mv-10"/>
                </div>
            </div>

            <div className="row">
                <div className="sub-title">II.2.3 Đồng phục</div>
            </div>
            <div className="row">
                <div className="col-4">
                    Người nhận bàn giao
                    <ApproverComponent isEdit={!disableComponent.employee} approver={data.uniform.user}  updateApprover={(approver, isApprover) => this.updateApprover('uniform', approver,isApprover )} errors={{approver: this.state.errors['uniform']}}/>
                </div>
                <div className="col-4">
                    Ngày thực hiện
                    <ResizableTextarea disabled={true} value={data.uniform.actionDate ? moment(data.uniform.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'uniform', 'actionDate')} className="mv-10"/>
                </div>
                <div className="col-4">
                    Tình trạng
                    <Select  placeholder={"Lựa chọn kết quả"} options={this.resultOptions} isDisabled={!disableComponent.uniform}  isClearable={true} 
                    value={this.resultOptions.filter(d => data.uniform.status != null && d.value == data.uniform.status)}
                    onChange={e => this.handleChangeSelectInputs(e,'uniform', 'status')} className="input"
                    styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                    {this.state.errors && this.state.errors['uniform_status'] ? <p className="text-danger">{this.state.errors['uniform_status']}</p> : null}
                </div>
                <div className="col-12">
                    Ghi chú
                    <ResizableTextarea placeholder={disableComponent.uniform ? "Nhập ghi chú" : ''}  disabled={!disableComponent.uniform} value={data.uniform.note} onChange={(e) => this.handleTextInputChange(e, 'uniform', 'note')} className="mv-10"/>
                </div>
            </div>

            <div className="row">
                <div className="sub-title">II.2.4 Vân tay, Email</div>
            </div>
            <div className="row">
                <div className="col-4">
                    Người nhận bàn giao
                    <ApproverComponent isEdit={!disableComponent.employee} approver={data.finger.user}  updateApprover={(approver, isApprover) => this.updateApprover('finger', approver,isApprover )} errors={{approver: this.state.errors['finger']}}/>
                </div>
                <div className="col-4">
                    Ngày thực hiện
                    <ResizableTextarea disabled={true} value={data.finger.actionDate ? moment(data.finger.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'finger', 'actionDate')} className="mv-10"/>
                </div>
                <div className="col-4">
                    Tình trạng
                    <Select  placeholder={"Lựa chọn kết quả"} options={this.resultOptions} isDisabled={!disableComponent.finger}  isClearable={true} 
                    value={this.resultOptions.filter(d => data.finger.status != null && d.value == data.finger.status)}
                    onChange={e => this.handleChangeSelectInputs(e,'finger', 'status')} className="input"
                    styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                    {this.state.errors && this.state.errors['finger_status'] ? <p className="text-danger">{this.state.errors['finger_status']}</p> : null}
                </div>
                <div className="col-12">
                    Ghi chú
                    <ResizableTextarea placeholder={disableComponent.finger ? "Nhập ghi chú" : ''} disabled={!disableComponent.finger} value={data.finger.note} onChange={(e) => this.handleTextInputChange(e, 'finger', 'note')} className="mv-10"/>
                </div>
            </div>

            <div className="row">
                <div className="sub-title">II.2.5 Công nợ (Tài chính Kế toán) người nhận</div>
            </div>
            <div className="row">
                <div className="col-4">
                    Người nhận bàn giao
                    <ApproverComponent isEdit={!disableComponent.employee } approver={data.inout.user}  updateApprover={(approver, isApprover) => this.updateApprover('inout', approver,isApprover )} errors={{approver: this.state.errors['inout']}} />
                </div>
                <div className="col-4">
                    Ngày thực hiện
                    <ResizableTextarea disabled={true} value={data.inout.actionDate ? moment(data.inout.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'inout', 'actionDate')} className="mv-10"/>
                </div>
                <div className="col-4">
                    Tình trạng
                    <Select  placeholder={"Lựa chọn kết quả"} options={this.resultOptions} isDisabled={!disableComponent.inout}  isClearable={true} 
                    value={this.resultOptions.filter(d => data.inout.status != null && d.value == data.inout.status)}
                    onChange={e => this.handleChangeSelectInputs(e,'inout', 'status')} className="input"
                    styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                    {this.state.errors && this.state.errors['inout_status'] ? <p className="text-danger">{this.state.errors['inout_status']}</p> : null}
                </div>
                <div className="col-12">
                    Ghi chú
                    <ResizableTextarea placeholder={disableComponent.inout ? "Nhập ghi chú" : ''} disabled={!disableComponent.inout} value={data.inout.note} onChange={(e) => this.handleTextInputChange(e, 'inout', 'note')} className="mv-10"/>
                </div>
            </div>

            <div className="row">
                <div className="sub-title">II.2.6 Các phần mềm phục vụ công việc (nếu có)</div>
            </div>
            <div className="row">
                <div className="col-4">
                    Người nhận bàn giao
                    <ApproverComponent isEdit={!disableComponent.employee} approver={data.tool.user}  updateApprover={(approver, isApprover) => this.updateApprover('tool', approver,isApprover )} errors={{approver: this.state.errors['tool']}}/>
                </div>
                <div className="col-4">
                    Ngày thực hiện
                    <ResizableTextarea disabled={true} value={data.tool.actionDate ? moment(data.tool.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'tool', 'actionDate')} className="mv-10"/>
                </div>
                <div className="col-4">
                    Tình trạng
                    <Select  placeholder={"Lựa chọn kết quả"} options={this.resultOptions} isDisabled={!disableComponent.tool}  isClearable={true} 
                    value={this.resultOptions.filter(d => data.tool.status != null && d.value == data.tool.status)}
                    onChange={e => this.handleChangeSelectInputs(e,'tool', 'status')} className="input"
                    styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                    {this.state.errors && this.state.errors['tool_status'] ? <p className="text-danger">{this.state.errors['tool_status']}</p> : null}
                </div>
                <div className="col-12">
                    Ghi chú
                    <ResizableTextarea placeholder={disableComponent.tool ? "Nhập ghi chú" : ''} disabled={!disableComponent.tool} value={data.tool.note} onChange={(e) => this.handleTextInputChange(e, 'tool', 'note')} className="mv-10"/>
                </div>
            </div>

            <div className="row">
                <div className="sub-title">II.2.7 Xác nhận về biên bản vi phạm đang xử lý (nếu có)</div>
            </div>
            <div className="row">
                <div className="col-4">
                    Người nhận bàn giao
                    <ApproverComponent isEdit={!disableComponent.employee} approver={data.policy.user}  updateApprover={(approver, isApprover) => this.updateApprover('policy', approver,isApprover )} errors={{approver: this.state.errors['policy']}}/>
                </div>
                <div className="col-4">
                    Ngày thực hiện
                    <ResizableTextarea disabled={true} value={data.policy.actionDate ? moment(data.policy.actionDate).format("DD/MM/YYYY") : ''} onChange={(e) => this.handleTextInputChange(e, 'tool', 'actionDate')} className="mv-10"/>
                </div>
                <div className="col-4">
                    Tình trạng
                    <Select  placeholder={"Lựa chọn kết quả"} options={this.resultOptions} isDisabled={!disableComponent.policy}  isClearable={true} 
                    value={this.resultOptions.filter(d => data.policy.status != null && d.value == data.policy.status)}
                    onChange={e => this.handleChangeSelectInputs(e,'policy', 'status')} className="input"
                    styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                    {this.state.errors && this.state.errors['policy_status'] ? <p className="text-danger">{this.state.errors['policy_status']}</p> : null}
                </div>
                <div className="col-12">
                    Ghi chú
                    <ResizableTextarea placeholder={disableComponent.policy ? "Nhập ghi chú" : ''}  disabled={!disableComponent.policy} value={data.policy.note} onChange={(e) => this.handleTextInputChange(e, 'policy', 'note')} className="mv-10"/>
                </div>
            </div>

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
                        {'Cập nhật'}
                </button>

            </div>
        </div>
        }
      </div>
      </div>
    )
  }
}

export default withTranslation()(LeaveOfAbsenceDetailComponent)
