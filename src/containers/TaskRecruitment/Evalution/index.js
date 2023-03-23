import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import Moment from 'react-moment'
import moment from 'moment'
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import {Image} from 'react-bootstrap';
import LoadingSpinner from "../../../components/Forms/CustomForm/LoadingSpinner";
import ResultModal from '../../Registration/ResultModal';
import CustomPaging from '../../../components/Common/CustomPaging'
import HOCComponent from '../../../components/Common/HOCComponent'
import IconRecall from '../../../assets/img/ic-recall.svg'
import { checkIsExactPnL } from '../../../commons/commonFunctions'

class EvaluationComponent extends React.Component {

  STATUS_OPTIONS = [
    {value: 9, label: this.props.t("Waiting")},
    {value: 10, label: this.props.t("PendingConsent")},
    {value: 11, label: this.props.t("PendingConsent")},
    {value: 12, label: this.props.t("PendingConsent")},
    {value: 13, label: this.props.t("PendingApproval")},
    {value: 2, label: this.props.t('Approved')},
    {value: 1, label: this.props.t('Rejected')}
  ];
  
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      dataResponse: {},
      listCandidate: {
				data: [	
				],
				total: 0
			},
      searchingDataToFilter: {
        pageIndex: 1,
        pageSize: 1000,
        SearchKeyWord: "",
        needRefresh: false
      },
      modal: {
        isShowStatusModal: false,
        textContentStatusModal: '',
        isSuccessStatusModal: true
    },
    }
    this.CONFIRM_STATUS = [
      { value: true, label: props.t('done') },
      { value: false, label: props.t('notDone') },
    ]
  }

  componentDidMount() {
    this._isMounted = true;
    const searchingDataToFilter = {...this.state.searchingDataToFilter}
    searchingDataToFilter.pageIndex = 1;
    this.setState({searchingDataToFilter: searchingDataToFilter})
    const params = {
      pageIndex: searchingDataToFilter.pageIndex || Constants.PAGE_INDEX_DEFAULT,
      pageSize: searchingDataToFilter.pageSize || Constants.PAGE_SIZE_DEFAULT,
    }
    this.fetchCandidateData(params);
  }

  componentWillUnmount(){
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

    axios.get(`${process.env.REACT_APP_REQUEST_URL}StaffContract/list`, config)
    .then(res => {
        if (this._isMounted) {
          if (res && res.code != Constants.API_ERROR_CODE) {
            this.prepareListDocumentRequest(res);
          }
        }
    })
    .catch(err => {
        if (this._isMounted) {
            this.setState({
                modal: {
                    ...this.state.modal,
                    isShowLoadingModal: false
                }
            })    
        }
    })
}

  prepareListDocumentRequest = res => {
    if (!res || !res.data || !res.data.data || res.data.data.length == 0) {
        return []
    }
    const listCandidatesRemote = res.data.data.map(item => {
        const statusOption = item.status ? this.STATUS_OPTIONS.filter(d => d.value == item.status) : [];  
        return {
            id: item.id,
            taskId: item.idDisplay,
            taskType: item.requestTypeName,
            dateExpire: item.expireDate,
            approver: item.approverName,
            status: statusOption && statusOption[0] ? statusOption[0].label : '',
            canRecall: item.isRecall ? true : false
        }
    });

    let result = {
        data: listCandidatesRemote,
        total: 0
    }
    this.setState({modal: {
      ...this.state.modal,
      isShowLoadingModal: false
      },
      listCandidate: result,
      });
}

  onChangePage = page => {
    const searchingDataToFilter = {...this.state.searchingDataToFilter}
    searchingDataToFilter.pageIndex = page
    searchingDataToFilter.needRefresh = false
    this.setState({ searchingDataToFilter: searchingDataToFilter })

    const params = {
        pageIndex: page || Constants.PAGE_INDEX_DEFAULT,
        pageSize: searchingDataToFilter.pageSize || Constants.PAGE_SIZE_DEFAULT,
    }

    this.fetchCandidateData(params)
}
  recallRequest = (taskId) => {
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      }
    }

    axios.get(`${process.env.REACT_APP_REQUEST_URL}StaffContract/recallvaluation?idDisplay=${taskId}`, config)
    .then(res => {
        if (this._isMounted) {
          const code = res.data.result.code;
          if (code != "000000" ) {
            this.handleShowResultModal(this.props.t("Notification"), 'Thu hồi không thành công !!', false);
          } else {
            this.handleShowResultModal(this.props.t("Successful"), this.props.t("RequestSent"), true);
          }
        }
    })
    .catch(err => {
        if (this._isMounted) {
            this.handleShowResultModal(this.props.t("Notification"), this.props.t("Error"), false);    
        }
    })
  }

  handleShowResultModal = (title, message, status) => {
    this.setState({modal: {
        ...this.state.modal,
        isShowStatusModal: true,
        modalTitle: title,
        textContentStatusModal: message,
        isSuccess: status,
        isReload: status
      }
    });
  }

  hideModalByStateName = stateName => {
    this.setState({
        modal: {
            ...this.state.modal,
            [stateName]: false
        }
    })
    if(this.state.modal.isReload)
      window.location.reload()
}
  
  render() {
    const { t } = this.props
    const searchingDataToFilter = this.state.searchingDataToFilter
    const modal = this.state.modal;
    const listCandidate = this.state.listCandidate;
    const total = listCandidate && listCandidate.total || 0
    return (
      <>
      <ResultModal show={modal.isShowStatusModal} title={modal.modalTitle} message={modal.textContentStatusModal} isSuccess={modal.isSuccess} onHide={e => this.hideModalByStateName('isShowStatusModal')} />
      {this.state.dataResponse ?
      <>
      <div className="task-section1">
        <div className="block-title" >
          <h4 className="title text-uppercase">{t('manager_evaluating_title')}</h4>
        </div>
        <div className="candidate-list shadow">
                    <table className="table table-borderless table-hover">
                        <thead>
                            <tr>
                                <th scope="col" className="col-code text-center">{t('RequestNo')}</th>
                                <th scope="col" className="col-content text-center">{t('TypeOfRequest')}</th>
                                <th scope="col" className="col-region text-center">{t('completed_dealine')}</th>
                                <th scope="col" className="col-code text-center">{t('Approver')} </th>
                                <th scope="col" className="col-content text-center">{t('Status')}</th>
                                <th scope="col" className="col-code text-center">{t('Withdraw')}</th>                             
                            </tr>
                        </thead>
                        <tbody>
                        {
                            (listCandidate && listCandidate.data || []).map( (item, index) => {
                                return <tr key={index}>
                                <td className="col-code text-center">
                                    <a href={`/evaluation/${item.taskId}/request`}>{item.taskId}</a>
                                </td>
                                <td className="col-name text-center">{t('ContractEvaluationType')}</td>
                                <td className="col-region text-center">{item.dateExpire ? moment(item.dateExpire).format('DD/MM/YYYY') : ''}</td>
                                <td className="col-unit text-center">{item.approver}</td>
                                <td className="col-unit text-center">{item.status}</td>
                                <td className="col-code text-center">
                                    {
                                        item.canRecall ? <Image src={IconRecall} onClick={() => this.recallRequest(item.taskId)}/> : null
                                    }                                    
                                </td>
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

export default HOCComponent(withTranslation()(EvaluationComponent))
