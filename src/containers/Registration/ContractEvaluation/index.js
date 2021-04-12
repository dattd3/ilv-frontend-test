import React from 'react'
import moment from 'moment'
import Spinner from 'react-bootstrap/Spinner'
import StatusModal from '../../../components/Common/StatusModal'
import { Image } from 'react-bootstrap'
import IconEdit from '../../../assets/img/ic-edit.svg';
import IconRemove from '../../../assets/img/ic-remove.svg';
import IconAdd from '../../../assets/img/ic-add.svg';
import ResizableTextarea from '../TextareaComponent';
import ApproverComponent from './SearchPeopleComponent'
import Select from 'react-select'
import Constants from '../.../../../../commons/Constants'

import { withTranslation } from "react-i18next"
import axios from 'axios'
import Rating from 'react-rating';
import _, { debounce } from 'lodash'

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
    }
  };

  qlttSetting =  {
    showComponent: {
      JobEditing: false, // co the edit , them sua xoa noi dung danh gia
      bossOption: true, //Ý KIẾN ĐỀ XUẤT CỦA CBQL TRỰC TIẾP
      HrOption: false, //Ý KIẾN THẨM ĐỊNH CỦA BỘ PHẬN NHÂN SỰ
      employeePoC: false, //NGƯỜI ĐÁNH GIÁ (Nếu có)
      qlttPoc: false, //QUẢN LÝ TRỰC TIẾP ĐÁNH GIÁ
      hrPoC: false, //NGƯỜI THẨM ĐỊNH
      bossPoc: true, //NGƯỜI PHÊ DUYỆT
      employeeSide: true,
      save: false // Luu
    },
    disableComponent: {
      employeeSide: false,
      qlttSide: true,
    }
  };

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
      save: false // Luu
    },
    disableComponent: {
      employeeSide: false,
      qlttSide: true,
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
    }
  }

  constructor(props) {
    super();
    this.state = {
      isShowStatusModal: false,
      annualLeaveSummary: {},
      data: {
        employeeInfo: [],
        evalution:[
          {
            id: 1,
            content: 'Kiến thức chuyên môn',
            selfRate: 4,
            bossRate: 1,
            note: 'Kiến thức chuyên môn nghiệp vụ cao',
            canEdit: false,
            isEditing: false,
            isEdited: false,
            isDeleted: false,
          },
          {
            id: 2,
            content: 'Làm FE',
            selfRate: 3,
            bossRate: 2,
            note: 'Kiến thức chuyên môn nghiệp vụ cao',
            canEdit: true,
            isEditing: false,
            isEdited: false,
            isDeleted: false,
          },
          {
            id: 3,
            content: 'Làm BE',
            selfRate: 3,
            bossRate: 2,
            note: 'Kiến thức chuyên môn nghiệp vụ cao',
            canEdit: true,
            isEditing: false,
            isEdited: false,
            isDeleted: false,
          }
        ],
        newEvalution: [
          {
            id: 0,
            content: 'Đi muộn về sớm',
            selfRate: 3,
            bossRate: 2,
            note: 'Kiến thức chuyên môn nghiệp vụ cao',
            canEdit: true,
            isEditing: false,
            isEdited: false,
            isDeleted: false,
          }
        ],
        selfEvalution: {
          strong: 'Học hỏi nhanh, chăm chỉ',
          weak: 'Lười vận động',
          opinion: 'Không có'
        },
        bossEvalution: {
          strong: 'Đồng ý với nhân viên',
          weak: 'Đồng ý với nhân viên',
        },
        course: [
          {
            name: 'Văn hóa Vin',
            status: true
          },
          {
            name: 'Quản lý dự án cơ bản',
            status: false
          }
        ],
        violation: [
          {
            id: 1,
            quyetdinh: '03593160/KT-VP/2020-01',
            hieuluc: '2020-11-20',
            nhomloi: 'Nhóm 3 (cũ): Lỗi lớn/lỗi lặt lại hệ thống/lỗi do ý thức kém',
            lydo: 'Chưa kiểm soát tốt công việc của đơn vị',
            noidung: 'Cách chức/ Hạ chức | Trừ thưởng YTCL công việc | Bồi thưởng thiệt hại'
          },
          {
            id: 2,
            quyetdinh: '03593160/KT-VP/2020-01',
            hieuluc: '2020-11-20',
            nhomloi: 'Nhóm 3 (cũ): Lỗi lớn/lỗi lặt lại hệ thống/lỗi do ý thức kém',
            lydo: 'Chưa kiểm soát tốt công việc của đơn vị',
            noidung: 'Cách chức/ Hạ chức | Trừ thưởng YTCL công việc | Bồi thưởng thiệt hại'
          }
        ],
        documentStatus: false,
        nguoidanhgia: [],
        qltt: [],
        qlttOpinion: {
          result: {value: 0, label: 'Đạt'},
          contract: {},
          expire: '',
          otherOption: ''
        },
        thamdinh: {

        },
        nguoipheduyet: null,
        selfRateTotal: 7,
        bossRateTotal: 3,
        totalSelfRate: 7,
        totalBossRate: 3
      },
      showComponent: this.editableSetting.showComponent, 
      disableComponent: this.editableSetting.disableComponent
    }
  }
  componentDidMount() {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
        'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
      }
    }

    const type = this.props.match.params.type;
    const id = this.props.match.params.id;
    if(!type || !id){
      //todo 
      return;
    }
  
    if(type === 'request'){
      this.setState({
        showComponent: this.employeeSetting.showComponent,
        disableComponent: this.employeeSetting.disableComponent
      })
    }else if(type == 'edit'){
      this.setState({
        showComponent: this.editableSetting.showComponent,
        disableComponent: this.editableSetting.disableComponent
      })
    }else if(type === 'assess'){
      this.setState({
        showComponent: this.bossSetting.showComponent,
        disableComponent: this.bossSetting.disableComponent
      })
    }else if(type === 'approval'){
      this.setState({
        showComponent: this.qlttSetting.showComponent,
        disableComponent: this.qlttSetting.disableComponent
      })
    }
    // axios.post(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/inbound/user/currentabsence`, {
    //   perno: this.props.leaveOfAbsence.user.employeeNo,
    //   date: moment().format('YYYYMMDD')
    // }, config)
    //   .then(res => {
    //     if (res && res.data) {
    //       const annualLeaveSummary = res.data.data
    //       this.setState({ annualLeaveSummary: annualLeaveSummary })
    //     }
    //   }).catch(error => {
    //   })
  }

  

  getTypeDetail = () => {
    const pathName = window.location.pathname;
    const pathNameArr = pathName.split('/');
    return pathNameArr[pathNameArr.length - 1];
  }

  showStatusModal = (message, isSuccess = false) => {
    this.setState({ isShowStatusModal: true, content: message, isSuccess: isSuccess });
  }

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
  }

  handleTextInputChange = (e, name, subName) => {
    const candidateInfos = {...this.state.data}
    candidateInfos[name][subName] = e != null ? e.target.value : "";
    this.setState({data : candidateInfos})
  }

  handleChangeSelectInputs = (e, name, subName) => {
    const candidateInfos = {...this.state.data}
    candidateInfos[name][subName] = e != null ? { value: e.value, label: e.label } : {}
    this.setState({data : candidateInfos})
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
      total = total - item[subName] + value;
      item[subName] = value;
      return item;
    })
    candidateInfos[name] = result;
    candidateInfos[subName + 'Total'] = total;
    this.setState({data : candidateInfos})
  }


  handleOnChangeInputForItem = (name, subId, subName, value) => {

  }

  updateApprover(name, approver, isApprover) {
    this.setState({ [name]: approver })
    const errors = { ...this.state.errors }
    if (!isApprover) {
        errors[name] = 'Nhân viên không hợp lệ !!'
    } else {
        errors[name] = null
    }
    this.setState({ errors: errors })
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
    content: '',
    selfRate: 0,
    bossRate: 0,
    note: '',
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
          <ResizableTextarea onChange={(e) => this.handleTextInputChangeForItem(e, name, item.id, 'content')}  disabled={isDisable} value={item.content}/> :
          item.content
        }
      </td>
      <td style={{width: '14%'}}><Rating initialRating={0} start={0} stop={4}  step={1} emptySymbol={<span className="rating-empty"/>} fullSymbol={<span className="rating-full"/>} readonly={true}/></td>
      <td style={{width: '16%'}}><Rating initialRating={0} start={0} stop={4}  step={1} emptySymbol={<span className="rating-empty"/>} fullSymbol={<span className="rating-full"/>} readonly={true}/></td>
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
  

  render() {
    const { t } = this.props
    const showComponent = this.state.showComponent;
    const disableComponent = this.state.disableComponent;
    const data = this.state.data;
    console.log('render');
    console.log(disableComponent.employeeSide + " _ " + showComponent.JobEditing);
    return (
      <div className="registration-section">

      <div className="leave-of-absence evalution">
        <div className="heading">
          {showComponent.JobEditing ? 'aaa'  : 'Test'}
        </div>
        <h5>THÔNG TIN NGƯỜI ĐƯỢC ĐÁNH GIÁ</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-4">
             {t("FullName")}
              <div className="detail">{data.employeeInfo.name || ""}</div>
            </div>
            <div className="col-4">
              {t("Title")}
              <div className="detail">{data.employeeInfo.title || ""}</div>
            </div>
            <div className="col-4">
              {t('DepartmentManage')}
              <div className="detail">{data.employeeInfo.block || ""}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              {"Ngày làm việc"}
              <div className="detail">{data.employeeInfo.startDate ? moment(data.employeeInfo.startDate).format("DD/MM/YYYY") : '' }</div>
            </div>
            <div className="col-4">
              {"Ngày hết hạn HĐTV/HĐLĐ"}
              <div className="detail">{data.employeeInfo.contractExpire ? moment(data.employeeInfo.contractExpire).format("DD/MM/YYYY") : '' }</div>
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
                          <td style={{width: '22%'}}>{item.content}</td>
                          <td style={{width: '16%'}}><Rating onChange={(rating) => this.handleRatingChangeForItem(rating, 'evalution', item.id, 'selfRate')} initialRating={item.selfRate || 0} start={0} stop={4}  step={1} emptySymbol={<span className="rating-empty"/>} fullSymbol={<span className="rating-full"/>} readonly={!disableComponent.employeeSide}/></td>
                          <td style={{width: '22%'}}><Rating onChange={(rating) => this.handleRatingChangeForItem(rating, 'evalution', item.id, 'bossRate')} initialRating={item.bossRate || 0} start={0} stop={4}  step={1} emptySymbol={<span className="rating-empty"/>} fullSymbol={<span className="rating-full"/>} readonly={!disableComponent.qlttSide}/></td>
                          <td style={{width: '40%'}}>
                            <ResizableTextarea onChange={(e) => this.handleTextInputChangeForItem(e, 'evalution', item.id, 'note')}  disabled={!disableComponent.qlttSide} value={item.note}/>
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
                        <th style={{width: '16%'}}>{data.selfRateTotal}</th>
                        <th style={{width: '22%'}}>{data.bossRateTotal}</th>
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
                        this.renderEvalution('evalution', data.evalution, !disableComponent.editable)
                      }
                      {
                        this.renderEvalution('newEvalution', data.newEvalution, !disableComponent.editable)
                      }
                    </tbody>
                  </table>
                  </>
                }
                
              </div>
            </div>
          </div>
          {
            showComponent.JobEditing ? 
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
              <ResizableTextarea disabled={!disableComponent.employeeSide} value={data.selfEvalution.strong} onChange={(e) => this.handleTextInputChange(e, 'selfEvalution', 'strong')} className="mv-10"/>
            </div>
            <div className="col-6">
              Điểm cần cải thiên
              <ResizableTextarea disabled={!disableComponent.employeeSide} value={data.selfEvalution.weak} onChange={(e) => this.handleTextInputChange(e, 'selfEvalution', 'weak')} className="mv-10"/>
            </div>
            <div className="col-12">
              Ý kiến đề xuất của CBNV
              <ResizableTextarea disabled={!disableComponent.employeeSide} value={data.selfEvalution.opinion} onChange={(e) => this.handleTextInputChange(e, 'selfEvalution', 'opinion')} className="mv-10"/>
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
              <ResizableTextarea disabled={!disableComponent.qlttSide} value={data.bossEvalution.strong} onChange={(e) => this.handleTextInputChange(e, 'bossEvalution', 'strong')} className="mv-10"/>
            </div>
            <div className="col-6">
              Điểm cần cải thiên
              <ResizableTextarea disabled={!disableComponent.qlttSide} value={data.bossEvalution.weak} onChange={(e) => this.handleTextInputChange(e, 'bossEvalution', 'weak')} className="mv-10"/>
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
              <label>Tình trạng hồ sơ:</label> <span>{data.documentStatus? 'Đủ' : 'Thiếu'}</span>
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
              <ApproverComponent isEdit={!disableComponent.employeeSide} approver={data.nguoidanhgia}  updateApprover={(approver, isApprover) => this.updateApprover('nguoidanhgia', approver,isApprover )} />
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
              <ApproverComponent isEdit={!disableComponent.employeeSide} approver={data.qltt}  updateApprover={(approver, isApprover) => this.updateApprover('qltt', approver,isApprover )} />
            </div>
          </> : 
          <>
            {/* quan li */}
            <div className="box shadow cbnv more-description">
              <div className="title">
                Ý KIẾN ĐỀ XUẤT CỦA CBQL TRỰC TIẾP
              </div>
              <div className="row">
                <div className="col-4">
                  Kết quả
                  <Select  placeholder={"Lựa chọn kết quả"} options={this.resultOptions} isDisabled={!disableComponent.qlttSide}  isClearable={true} 
                  value={this.resultOptions.filter(d => data.qlttOpinion.result != null && d.value == data.qlttOpinion.result.value)}
                  onChange={e => this.handleChangeSelectInputs(e,'qlttOpinion', 'result')} className="input"
                  styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                  {/* <div className="detail">{requestInfo ? moment(requestInfo.startDate).format("DD/MM/YYYY") + (requestInfo.startTime ? ' ' + moment(requestInfo.startTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '') : ""}</div> */}
                </div>
                <div className="col-4">
                  Loại hợp đồng lao động
                  <Select  placeholder={"Lựa chọn kết quả"} options={this.contractTypeOptions} isDisabled={!disableComponent.qlttSide}  isClearable={true} 
                  value={this.contractTypeOptions.filter(d => data.qlttOpinion.contract != null && d.value == data.qlttOpinion.contract.value)}
                  onChange={e => this.handleChangeSelectInputs(e,'qlttOpinion', 'contract')} className="input"
                  styles={{menu: provided => ({ ...provided, zIndex: 2 })}}/>
                  {/* <ResizableTextarea disabled={true} className="mv-10"/> */}
                </div>
                <div className="col-4">
                  Thời hạn
                  <ResizableTextarea disabled={true} className="mv-10"/>
                </div>
              </div>
              <div className="row">
                {/* <div className="col-4">
                  Điều chỉnh lương
                  <div className="detail">{requestInfo ? moment(requestInfo.startDate).format("DD/MM/YYYY") + (requestInfo.startTime ? ' ' + moment(requestInfo.startTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '') : ""}</div>
                </div> */}
                <div className="col-12">
                  Đề xuất khác
                  <ResizableTextarea onChange={ e => this.handleTextInputChange(e, 'qlttOpinion', 'otherOption' )} disabled={!disableComponent.qlttSide} className="mv-10"/>
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
              <ApproverComponent isEdit={!disableComponent.qlttSide} approver={data.nguoipheduyet}  updateApprover={(approver, isApprover) => this.updateApprover('nguoipheduyet', approver,isApprover )} />
            </div>
          </>
        }
        


        

        <div className="bottom">
            <div className="clearfix mt-5 mb-5">
                <button type="button" className="btn btn-primary float-right ml-3 shadow" disabled={this.props.disabledSubmitButton}>
                    {!this.props.disabledSubmitButton ?
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
            </div>
        </div>
      </div>
      </div>
    )
  }
}

export default withTranslation()(LeaveOfAbsenceDetailComponent)
