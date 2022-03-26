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
import { checkIsExactPnL } from '../../../commons/commonFunctions';

class SupportOnboardComponent extends React.Component {
  CONFIRM_STATUS = [
    { value: true, label: 'Đã xong' },
    { value: false, label: 'Chưa xong' },
  ]
  _isMounted = false;
  constructor(props) {
    super();
    this.state = {
      tasks: [],
      dataResponse: {},
      isShowDevices: false,
      isShowAccount: false,
      isShowVoucher: false,
      isShowDonitory: false,
      listCandidate: {
        data: [
        ],
        total: 0
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
    this._isMounted = true;
    const searchingDataToFilter = { ...this.state.searchingDataToFilter }
    searchingDataToFilter.pageIndex = 1
    this.setState({ searchingDataToFilter: searchingDataToFilter })
    const params = {
      pageIndex: searchingDataToFilter.pageIndex || Constants.PAGE_INDEX_DEFAULT,
      pageSize: searchingDataToFilter.pageSize || Constants.PAGE_SIZE_DEFAULT,
      CompanyCode: localStorage.getItem('companyCode')
    }
    this.fetchCandidateData(params);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchCandidateData = params => {
    this.setState({
      modal: {
        ...this.state.modal,
        isShowLoadingModal: true
      }
    })
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      },
      params: params
    }
    const SupportEndpoint = `${process.env.REACT_APP_HRDX_URL}api/managementPoints/listPreparingOnboardCandidate`;
    const StaffContractEndpoint = `${process.env.REACT_APP_REQUEST_URL}StaffContract/subordinate`;
    const requestSupport = axios.get(SupportEndpoint, config);
    const requestStaffContract = axios.get(StaffContractEndpoint, config);

    axios.all([requestSupport, requestStaffContract]).then(axios.spread((...responses) => {
      if (this._isMounted) {
        let result1 = this.prepareListDocumentRequest(responses[0], true);
        let result2 = this.prepareListDocumentRequest(responses[1], false);
        
        if (result1 && result2) {
          const status = {
            isShowDevices: true,
            isShowAccount: true,
            isShowVoucher: true,
            isShowDonitory: true,
          };
          const total1 = responses[0]?.data?.data?.totalRecord || 0;
          const total2 = responses[1]?.data?.data?.totalRecord || 0;
          let total = total1 < total2 ? total2 : total1;
          const result = {
            data: [...result1, ...result2],
            total:total
          }
          this.setState({
            modal: {
              ...this.state.modal,
              isShowLoadingModal: false
            },
            listCandidate: result,
            ...status
          });
        }
      }
    }))
  }

  prepareDatatoSubmit = (data) => {
    const isVinbrain = checkIsExactPnL(Constants.PnLCODE.Vinbrain);
    return data.map(item => {
      let itemStatus
      let supportSearch = item.item1.status ? 'Đã xong' : 'Chưa xong';
      if (isVinbrain) {
        itemStatus = {
          onboardingStatus1: item.item1.status,
          supporterDes1: item.item1.note,

          onboardingStatus2: item.item2.status,
          supporterDes2: item.item2.note,

          onboardingStatus3: item.item3.status,
          supporterDes3: item.item3.note,

          onboardingStatus4: item.item4.status,
          supporterDes4: item.item4.note,

          onboardingStatus5: item.item5.status,
          supporterDes5: item.item5.note,

          onboardingStatus6: item.item6.status,
          supporterDes6: item.item6.note,

          onboardingStatus7: item.item7.status,
          supporterDes7: item.item7.note,

          onboardingStatus8: item.item8.status,
          supporterDes8: item.item8.note,
        }
        for (let i = 2; i <= 8; i++) {
          supportSearch += '#' + (item['item' + i]?.status ? 'Đã xong' : 'Chưa xong')
        }
      } else {
        itemStatus = {
          onboardingStatus1: item.item1.status,
          supporterDes1: item.item1.note,

          onboardingStatus2: item.item2.status,
          supporterDes2: item.item2.note,

          onboardingStatus3: item.item3.status,
          supporterDes3: item.item3.note,

          onboardingStatus4: item.item4.status,
          supporterDes4: item.item4.note,
        }
        for (let i = 2; i <= 4; i++) {
          supportSearch += '#' + (item['item' + i]?.status ? 'Đã xong' : 'Chưa xong')
        }
      }
      return {
        id: item.id,
        employeeCode: item.employeeNo,
        fullName: item.name,
        regionName: item.region,
        unitName: item.unit,
        divisionName: item.department,
        positionName: item.rank,
        recruitingDate: item.startWork,
        expireDate: item.timeExpire,
        companyCode: localStorage.getItem('companyCode'),
        ...itemStatus,
        supportSearch: supportSearch
      }
    })
  }
  prepareListDocumentRequest = (res, isReset) => {

    if (!res || !res.data || !res.data.data) {
      return []
    }
    const status = {
      isShowDevices: true,
      isShowAccount: true,
      isShowVoucher: true,
      isShowDonitory: true,
    };
    let remoteData = res.data.data.lstManagementPoint;
    remoteData = !remoteData || remoteData.length == 0 ? res.data.data.lstSubordinate : remoteData;
    if (!remoteData || remoteData.length == 0)
      return [];
    const listCandidatesRemote = remoteData.map(item => {
      status.isShowDevices = status.isShowDevices || item.managerToolIndicator;
      status.isShowAccount = status.isShowAccount || item.managerAccountIndicator;
      status.isShowVoucher = status.isShowVoucher || item.managerFingerIndicator;
      status.isShowDonitory = status.isShowDonitory || item.managerDormitoryIndicator;
      return {
        id: item.id,
        employeeNo: item.employeeCode || '',
        name: item.fullName || '',
        region: item.divisionName || '',
        unit: item.regionName || '',
        department: item.unitName || '',
        rank: item.positionName || '',
        startWork: item.recruitingDate || '',
        timeExpire: item.expireDate || '',
        requestCode: item.requestCode,
        item1: {
          status: item.supportOnboardInfo?.onboardingStatus1 || false,
          note: item.supportOnboardInfo?.supporterDes1 || '',
          isEditable: item.onboardingIndicator1
        },
        item2: {
          status: item.supportOnboardInfo?.onboardingStatus2 || false,
          note: item.supportOnboardInfo?.supporterDes2 || '',
          isEditable: item.onboardingIndicator2
        },
        item3: {
          status: item.supportOnboardInfo?.onboardingStatus3 || false,
          note: item.supportOnboardInfo?.supporterDes3 || '',
          isEditable: item.onboardingIndicator3
        },
        item4: {
          status: item.supportOnboardInfo?.onboardingStatus4 || false,
          note: item.supportOnboardInfo?.supporterDes4 || '',
          isEditable: item.onboardingIndicator4
        },
        item5: {
          status: item.supportOnboardInfo?.onboardingStatus5 || false,
          note: item.supportOnboardInfo?.supporterDes5 || '',
          isEditable: item.onboardingIndicator5
        },
        item6: {
          status: item.supportOnboardInfo?.onboardingStatus6 || false,
          note: item.supportOnboardInfo?.supporterDes6 || '',
          isEditable: item.onboardingIndicator6
        },
        item7: {
          status: item.supportOnboardInfo?.onboardingStatus7 || false,
          note: item.supporterDes7 || '',
          isEditable: item.onboardingIndicator7
        },
        item8: {
          status: item.supportOnboardInfo?.onboardingStatus8 || false,
          note: item.supportOnboardInfo?.supporterDes8 || '',
          isEditable: item.onboardingIndicator8
        },
        item9: {
          status: item.supportOnboardInfo?.onboardingStatus9 || false,
          note: item.supportOnboardInfo?.supporterDes9 || '',
          isEditable: item.onboardingIndicator9
        },
        item10: {
          status: item.supportOnboardInfo?.onboardingStatus10 || false,
          note: item.supportOnboardInfo?.supporterDes10 || '',
          isEditable: item.onboardingIndicator10
        }
      }
    });

    // let result = {
    //     data: listCandidatesRemote,
    //     total:res.data.data.totalRecord || this.state.searchingDataToFilter.pageSize
    // }
    return listCandidatesRemote;
  }

  onChangePage = page => {
    const searchingDataToFilter = { ...this.state.searchingDataToFilter }
    searchingDataToFilter.pageIndex = page
    searchingDataToFilter.needRefresh = false
    this.setState({ searchingDataToFilter: searchingDataToFilter })

    const params = {
      pageIndex: page || Constants.PAGE_INDEX_DEFAULT,
      pageSize: searchingDataToFilter.pageSize || Constants.PAGE_SIZE_DEFAULT,
      CompanyCode: localStorage.getItem('companyCode')
    }

    this.fetchCandidateData(params)
  }

  onChangeDropDownStatus = (candidateId, fieldName, fieldValue, isDropDown) => {
    const listCandidate = { ...this.state.listCandidate };
    const candidateToSaveState = (listCandidate.data || []).map(item => {
      if (item.employeeNo != candidateId) {
        return item;
      }

      item['isEdited'] = true;
      if (!isDropDown) {
        item[fieldName].note = fieldValue;
        return item;
      }
      item[fieldName].status = fieldValue.value;
      return item;
    })
    listCandidate.data = candidateToSaveState;
    this.setState({ listCandidate: listCandidate });
  }

  renderActionView = (isShow, employeeNo, data, name) => {
    const customStylesStatus = {
      control: (base, { isDisabled }) => ({
        ...base,
        boxShadow: 'none',
        height: 35,
        minHeight: 35
      })
    }
    return isShow ?
      <td className="col-devices text-center">
        <div className={`col-sub-devices  ${data.isEditable ? '' : 'disable'}`}>
          <Select options={this.CONFIRM_STATUS} isDisabled={!data.isEditable} onChange={value => this.onChangeDropDownStatus(employeeNo, name, value, true)} value={this.CONFIRM_STATUS.filter(os => { return os.value == data.status })} styles={customStylesStatus} noOptionsMessage={() => "Lựa chọn"} menuPortalTarget={document.body} />
          <input type="text" value={data.note} disabled={!data.isEditable} onChange={(e) => this.onChangeDropDownStatus(employeeNo, name, e.target.value, false)} />
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
    if (this.state.modal.isReload)
      window.location.reload()
  }

  handleCancel = (e) => {
    e.preventDefault();
    window.location.reload();
  }
  handleSubmit = e => {
    e.preventDefault()
    let result = (this.state.listCandidate && this.state.listCandidate.data || []).filter(item => item.isEdited);
    if (!result || result.length == 0)
      return;
    this.setState({
      modal: {
        ...this.state.modal,
        isShowLoadingModal: true
      }
    })
    result = this.prepareDatatoSubmit(result);
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      }
    }

    axios.post(`${process.env.REACT_APP_HRDX_URL}api/managementPoints`, result, config)
      .then(response => {
        let message = 'Lưu thông tin thành công.';
        this.setState({
          modal: {
            ...this.state.modal,
            isShowLoadingModal: false,
            isShowStatusModal: true,
            isSuccessStatusModal: true,
            isReload: true,
            textContentStatusModal: message
          }
        })
      })
      .catch(error => {
        let messages = 'Lưu không thành công.'
        this.setState({
          modal: {
            ...this.state.modal,
            isShowLoadingModal: false,
            isShowStatusModal: true,
            isSuccessStatusModal: false,
            isReload: false,
            textContentStatusModal: messages
          }
        })
      })
  }
  render() {
    const { t } = this.props
    const searchingDataToFilter = this.state.searchingDataToFilter
    const modal = this.state.modal;
    const listCandidate = this.state.listCandidate;
    const total = listCandidate && listCandidate.total || 0
    return (
      <>
        <ResultModal show={modal.isShowStatusModal} title="Thông báo" message={modal.textContentStatusModal} isSuccess={modal.isSuccessStatusModal} onHide={e => this.hideModalByStateName('isShowStatusModal')} />
        {this.state.dataResponse ?
          <>
            <div className="task-section1">
              <div className="block-title" style={{ paddingBottom: '0px' }}>
                <h4 className="title text-uppercase">Hỗ trợ chuẩn bị nhận việc</h4>
              </div>
              <div className="action-section">
                <div className="note">(Gợi ý: Các Anh/Chị điền lại các đầu việc Đã/Chưa xong hoặc ghi chú vào ô công việc tương ứng)</div>
                <div className="action-groups">
                  <div className="action-button" onClick={(e) => this.handleCancel(e)}>
                    <span>Hủy</span>
                  </div>
                  <div className="action-button" onClick={(e) => this.handleSubmit(e)}>
                    <span>Lưu</span>
                  </div>
                </div>
              </div>
              <div className="candidate-list shadow">
                <table className="table table-borderless table-hover">
                  <thead>
                    <tr>
                      <th scope="col" className="col-code sticky-col text-center">Mã nhân viên</th>
                      <th scope="col" className="col-name sticky-col text-center">Họ và tên</th>
                      <th scope="col" className="col-region text-center">Vùng</th>
                      <th scope="col" className="col-unit text-center">Cơ sở </th>
                      <th scope="col" className="col-unit text-center">Bộ phận</th>
                      <th scope="col" className="col-unit text-center">Chức danh</th>
                      <th scope="col" className="col-deadline text-center">Ngày bắt đầu đi làm</th>
                      <th scope="col" className="col-deadline text-center">Hạn hoàn thành</th>
                      {
                        checkIsExactPnL(Constants.PnLCODE.Vinbrain) ?
                          <>
                            <th scope="col" className="col-devices text-center">Chuẩn bị Logistic: chỗ ngồi, máy móc, voucher, VPP ...</th>
                            <th scope="col" className="col-devices text-center">Tạo account, cài đặt máy tính</th>
                            <th scope="col" className="col-devices text-center">Tạo mã nhân viên và HĐLĐ/HĐTV, cam kết</th>
                            <th scope="col" className="col-devices text-center">Gửi thư chào mừng nhân viên mới: Nội quy/SĐTC/Hệ thống nội bộ/ contact hữu dụng</th>
                            <th scope="col" className="col-devices text-center">Tổ chức khóa Đào tạo định hướng</th>
                            <th scope="col" className="col-devices text-center">Hoàn thiện hồ sơ theo quy định Tập đoàn</th>
                            <th scope="col" className="col-devices text-center">Cập nhật đầy đủ thông tin lên SAP và các group mail/Ms Teams</th>
                            <th scope="col" className="col-devices text-center">Ký HĐLĐ</th>
                          </>
                          : checkIsExactPnL(Constants.PnLCODE.VinSchool) ?
                            <>
                              <th scope="col" className="col-devices text-center">Tài khoản AD, email, các phần mềm phục vụ công việc, cá nhân</th>
                              <th scope="col" className="col-devices text-center">Máy tính / Điện thoại bàn</th>
                              <th scope="col" className="col-devices text-center">Đồng phục / Thẻ tên / Tủ cá nhân / Chìa khóa kho… Văn phòng phẩm</th>
                              <th scope="col" className="col-devices text-center">Lấy vân tay cho CBNV vào ngày đầu làm việc</th>
                            </>
                            :
                            <>
                              {this.state.isShowDevices ? <th scope="col" className="col-devices text-center">Chuẩn bị công cụ dụng cụ <br /> (Phòng làm việc, Bàn/ghế/tủ, máy tính, đồng phục)</th> : null}
                              {this.state.isShowAccount ? <th scope="col" className="col-devices text-center">Tài khoản AD, email, các phần mềm phục vụ công việc, máy in</th> : null}
                              {this.state.isShowVoucher ? <th scope="col" className="col-devices text-center">Lấy dấu vân tay, phiếu ăn, vé gửi xe</th> : null}
                              {this.state.isShowDonitory ? <th scope="col" className="col-devices text-center">Ký túc xá (Áp dụng với Phú Quốc,Nha Trang, Đà Nẵng)</th> : null}
                            </>
                      }

                    </tr>
                  </thead>
                  <tbody>
                    {
                      (listCandidate && listCandidate.data || []).map((item, index) => {
                        return <tr key={index}>
                          <td className="col-code sticky-col text-center">
                            {
                              item.requestCode ?
                                <a href={`/evaluation/${item.requestCode}/edit`}>{item.employeeNo}</a> :
                                item.employeeNo
                            }
                          </td>
                          <td className="col-name sticky-col text-center">{item.name}</td>
                          <td className="col-region text-center">{item.region}</td>
                          <td className="col-unit text-center">{item.unit}</td>
                          <td className="col-unit text-center">{item.department}</td>
                          <td className="col-unit text-center">{item.rank}</td>
                          <td className="col-deadline text-center">{item.startWork ? moment(item.startWork).format("DD/MM/YYYY") : ''}</td>
                          <td className="col-deadline text-center">{item.timeExpire ? moment(item.timeExpire).format("DD/MM/YYYY") : ''}</td>
                          {
                            checkIsExactPnL(Constants.PnLCODE.Vinbrain) ?
                              <>
                                {this.renderActionView(true, item.employeeNo, item.item1, 'item1')}
                                {this.renderActionView(true, item.employeeNo, item.item2, 'item2')}
                                {this.renderActionView(true, item.employeeNo, item.item3, 'item3')}
                                {this.renderActionView(true, item.employeeNo, item.item4, 'item4')}
                                {this.renderActionView(true, item.employeeNo, item.item5, 'item5')}
                                {this.renderActionView(true, item.employeeNo, item.item6, 'item6')}
                                {this.renderActionView(true, item.employeeNo, item.item7, 'item7')}
                                {this.renderActionView(true, item.employeeNo, item.item8, 'item8')}
                              </>
                              :
                              <>
                                {this.renderActionView(this.state.isShowDevices, item.employeeNo, item.item1, 'item1')}
                                {this.renderActionView(this.state.isShowAccount, item.employeeNo, item.item2, 'item2')}
                                {this.renderActionView(this.state.isShowVoucher, item.employeeNo, item.item3, 'item3')}
                                {this.renderActionView(this.state.isShowDonitory, item.employeeNo, item.item4, 'item4')}
                              </>
                          }

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
          null
        }
        {
          this.state.modal.isShowLoadingModal ? 
          <LoadingSpinner/> : null
        }
      </>
    )
  }
}

export default withTranslation()(SupportOnboardComponent)
