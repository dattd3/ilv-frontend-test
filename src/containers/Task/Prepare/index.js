import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import Moment from 'react-moment'
import moment from 'moment'
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import LoadingSpinner from "../../../components/Forms/CustomForm/LoadingSpinner";
import ResultModal from '../../Registration/ResultModal';
import CustomPaging from '../../../components/Common/CustomPaging'

class RequestComponent extends React.Component {
  CONFIRM_STATUS = [
    {value: true, label: 'Đã xong'},
    {value: false, label: 'Chưa xong'},
  ]

  constructor(props) {
    super();
    this.state = {
      tasks: [],
      dataResponse: {},
      isShowDevices: true,
      isShowAccount: true,
      isShowVoucher: true,
      isShowDonitory: true,
      listCandidate: {
				data: [
					{
							employeeNo: '31222',
							name: 'Nguyeen Van Tuan',
							region: 'Head Office',
							unit: 'Cơ sở',
							department: 'Hành chính',
							rank: 'Chuyên viên nhân sự',
							startWork: '2021-03-18',
							timeExpire: '2021-05-24',
							devices: {
									status: false,
									note: 'Nhân viên hiện đang nghỉ việc',
                  isEditable: true
							},
							account: {
									status: true,
									note: 'Đã cấp tài khoản cho nhân viên',
                  isEditable: true
							},
							voucher: {
									status: true,
									note: '',
                  isEditable: true
							},
							dormitory: {
									status: true,
									note: '',
                  isEditable: true
							},

					}
				],
				total: 1
			},
      searchingDataToFilter: {
        pageIndex: 1,
        pageSize: 10,
        SearchKeyWord: "",
        needRefresh: false
      },
      modal: {
        isShowStatusModal: false,
        textContentStatusModal: '',
        isSuccessStatusModal: true
    },
    }
  }

  componentDidMount() {
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      }
    }
    const searchingDataToFilter = {...this.state.searchingDataToFilter}
    searchingDataToFilter.pageIndex = Constants.PAGE_INDEX_DEFAULT
    this.setState({searchingDataToFilter: searchingDataToFilter})

    axios.get(`${process.env.REACT_APP_REQUEST_URL}request/list?companyCode=`+localStorage.getItem("companyCode"), config)
    .then(res => {
      if (res && res.data && res.data.data && res.data.result) {
        const result = res.data.result;
        if (result.code != Constants.API_ERROR_CODE) {
          let tasksOrdered = res.data.data.requests.sort((a, b) => a.id <= b.id ? 1 : -1)
          this.setState({tasks : tasksOrdered, dataResponse: res.data.data});
        }
      }
    }).catch(error => {
      this.setState({tasks : []});
    });
  }

  onChangePage = page => {
    const searchingDataToFilter = {...this.state.searchingDataToFilter}
    searchingDataToFilter.pageIndex = page
    searchingDataToFilter.needRefresh = false
    this.setState({ searchingDataToFilter: searchingDataToFilter })

    // const params = {
    //     pageIndex: page || Constants.PAGE_INDEX_DEFAULT,
    //     pageSize: searchingDataToFilter.pageSize || Constants.PAGE_SIZE_DEFAULT,
    // }

    // this.fetchCandidateData(params)
}

  onChangeDropDownStatus = (candidateId, fieldName, fieldValue, isDropDown) => {
    const listCandidate = {...this.state.listCandidate};
    const candidateToSaveState = (listCandidate.data || []).map (item => {
        if(item.employeeNo != candidateId){
            return item;
        }

        item['isEdited'] = true;
        if(!isDropDown){
            item[fieldName].note = fieldValue;
            return item;
        }
        item[fieldName].status = fieldValue.value;
        return item;
    })
    listCandidate.data = candidateToSaveState;
    this.setState({listCandidate: listCandidate});
}

  renderActionView = (isShow, employeeNo, data, name) => {
    const customStylesStatus = {
      control: (base, { isDisabled}) => ({
          ...base,
          boxShadow: 'none',
          height: 35,
          minHeight: 35
      }),
    }
    return isShow ? 
      <td className="col-devices text-center">
          <div className={`col-sub-devices  ${data.isEditable ? '' : 'disable'}`}>
              <Select options={this.CONFIRM_STATUS} isDisabled={!data.isEditable} onChange={value => this.onChangeDropDownStatus(employeeNo, name, value, true)} value={this.CONFIRM_STATUS.filter(os => {return os.value == data.status})} styles={customStylesStatus}  noOptionsMessage={() => "Lựa chọn"} menuPortalTarget={document.body}/>
              <input type="text" value = {data.note} disabled={!data.isEditable} onChange ={(e) => this.onChangeDropDownStatus(employeeNo, name ,e.target.value, false)}/>
          </div>
      </td>
     : null;
  }

  hideModalByStateName = stateName => {
    this.setState({
        modal: {
            ...this.state.modal,
            [stateName]: false
        }
    })
    window.location.reload()
}

  handleCancel = (e) => {
    e.preventDefault();
    window.location.reload();
  }
  handleSubmit = e => {
    e.preventDefault()
    const result = (this.state.listCandidate && this.state.listCandidate.data || []).filter(item => item.isEdited);
    if(!result || result.length == 0)
        return;
    let message = this.isRecruiment ? 'Cập nhật hồ sơ': 'Chuyển SAP';
    const typeCode = this.isRecruiment ? 'TD' : 'NS';
  //  CandidateAjax.updateStaffDocument(typeCode, result)
  //   .then(response => {
  //       message = message + ' thành công.';
  //       this.setState({
  //           modal: {
  //               ...this.state.modal,
  //               isShowLoadingModal: false,
  //               isShowStatusModal: true,
  //               isSuccessStatusModal: true,
  //               textContentStatusModal: message
  //           }
  //       })
  //   })
  //   .catch(error => {
  //       let messages = message + ' không thành công. Xin vui lòng thử lại !'
  //       this.setState({
  //           modal: {
  //               ...this.state.modal,
  //               isShowLoadingModal: false,
  //               isShowStatusModal: true,
  //               isSuccessStatusModal: false,
  //               textContentStatusModal: messages
  //           }
  //       })
  //   })
}
  render() {
    const { t } = this.props
    const searchingDataToFilter = this.state.searchingDataToFilter
    const modal = this.state.modal;
    const listCandidate = this.state.listCandidate;
    const total = listCandidate && listCandidate.total || 0
    const customStylesStatus = {
        control: (base, { isDisabled}) => ({
            ...base,
            boxShadow: 'none',
            height: 35,
            minHeight: 35
        }),
      }
    return (
      <>
      <ResultModal show={modal.isShowStatusModal} message={modal.textContentStatusModal} isSuccess={modal.isSuccessStatusModal} onHide={e => this.hideModalByStateName('isShowStatusModal')} />
      {this.state.dataResponse ?
      <>
      <div className="task-section">
        <div className="block-title" style={{paddingBottom: '0px'}}>
          <h4 className="title text-uppercase">Hỗ trợ chuẩn bị nhận việc</h4>
        </div>
        <div className="action-section">
            <div className="note">(Gợi ý: Các Anh/Chị điền lại các đầu việc Đã/Chưa xong hoặc ghi chú vào ô công việc tương ứng)</div>
            <div className="action-groups">
              <div className="action-button"  onClick= {(e) =>this.handleCancel(e)}>
                  <span>Hủy</span>
              </div>
              <div className="action-button" onClick ={(e) => this.handleSubmit(e)}>
                  <span>Lưu</span>
              </div>
            </div>
        </div>
        <div className="candidate-list shadow">
                    <table className="table table-borderless table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col" className="col-code text-center">Mã nhân viên</th>
                                <th scope="col" className="col-name text-center">Họ và tên</th>
                                <th scope="col" className="col-region text-center">Vùng</th>
                                <th scope="col" className="col-unit text-center">Cơ sở </th>
                                <th scope="col" className="col-unit text-center">Bộ phận</th>
                                <th scope="col" className="col-unit text-center">Chức danh</th>
                                <th scope="col" className="col-deadline text-center">Ngày bắt đầu đi làm</th>
                                <th scope="col" className="col-deadline text-center">Hạn hoàn thành</th>
                                {this.state.isShowDevices ? <th scope="col" className="col-devices text-center">Chuẩn bị công cụ dụng cụ <br/> (Phòng làm việc, Bàn/ghế/tủ, máy tính, đồng phục)</th> : null}
                                {this.state.isShowAccount ? <th scope="col" className="col-devices text-center">Tài khoản AD, email, các phần mềm phục vụ công việc, máy in</th> : null}
                                {this.state.isShowVoucher? <th scope="col" className="col-devices text-center">Lấy dấu vân tay, phiếu ăn, vé gửi xe</th> : null}
                                {this.state.isShowDonitory? <th scope="col" className="col-devices text-center">Ký túc xá (Áp dụng với Phú Quốc,Nha Trang, Đà Nẵng)</th> : null}                                
                            </tr>
                        </thead>
                        <tbody>
                        {
                            (listCandidate && listCandidate.data || []).map( (item, index) => {
                                return <tr key={index}>
                                <td className="col-code text-center">{item.employeeNo}</td>
                                <td className="col-name text-center">{item.name}</td>
                                <td className="col-region text-center">{item.region}</td>
                                <td className="col-unit text-center">{item.unit}</td>
                                <td className="col-unit text-center">{item.department}</td>
                                <td className="col-unit text-center">{item.rank}</td>
                                <td className="col-deadline text-center">{moment(item.startWork).format("DD/MM/YYYY")}</td>
                                <td className="col-deadline text-center">{moment(item.timeExpire).format("DD/MM/YYYY")}</td>
                                {this.renderActionView(this.state.isShowDevices, item.employeeNo, item.devices, 'devices')}
                                {this.renderActionView(this.state.isShowAccount, item.employeeNo, item.account, 'account')}
                                {this.renderActionView(this.state.isShowVoucher, item.employeeNo, item.voucher, 'voucher')}
                                {this.renderActionView(this.state.isShowDonitory, item.employeeNo, item.dormitory, 'dormitory')}
                            </tr>
                            })
                        }
                        
                        </tbody>
                    </table>
                </div>       
      </div>
      {total > 0 ? <div className="row paging mt-4">
                    <div className="col-sm"></div>
                    <div className="col-sm"></div>
                    <div className="col-sm">
                        <CustomPaging pageSize={parseInt(searchingDataToFilter.pageSize)} onChangePage={this.onChangePage} totalRecords={total} needRefresh={searchingDataToFilter.needRefresh} />
                    </div>
                    <div className="col-sm"></div>
                    <div className="col-sm text-right"></div>
                </div> : null}
      </> : 
      <LoadingSpinner />
    }
    </>
    )
  }
}

export default withTranslation()(RequestComponent)
