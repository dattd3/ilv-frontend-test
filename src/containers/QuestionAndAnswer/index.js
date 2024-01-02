import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { last } from 'lodash'
import Constants from 'commons/Constants'
import SubmitQuestionModal from './SubmitQuestionModal'
import HistoryModal from './HistoryModal'
import StatusModal from '../../components/Common/StatusModal'
import CommonQuestionComponent from './CommonQuestionComponent'
import LoadingSpinner from '../../components/Forms/CustomForm/LoadingSpinner';
import HOCComponent from '../../components/Common/HOCComponent'

const currentCompanyCode = localStorage.getItem("companyCode")

class MyComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userProfile: {},
      isShowSubmitQuestionModal: false,
      isShowHistoryModal: false,
      isShowStatusModal: false,
      content: "",
      isSuccess: false,
      questionContent: {},
      isEditQuestion: false,
      commonTicketList: {},
      commonTicketListFilter: {},
      categories: {},
      keySearch: "",
      open: true,
      staffHandbookLink: '',
    };
  }

  componentDidMount() {
    let config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    }
    axios.get(`${process.env.REACT_APP_REQUEST_URL}ticket/Common/` + currentCompanyCode, config)
      .then(res => {
        if (res && res?.data && res?.data?.data) {
          const data = [...res?.data?.data || []]
          let commonTicketListRs = res.data.data.sort((a, b) => {
            return a.subject[0].toLowerCase().localeCompare(b.subject[0].toLowerCase(), "pl");
          });;
          this.setState({ commonTicketList: commonTicketListRs, commonTicketListFilter: data || [] });
        }
      }).catch(error => {
      });

    axios.get(`${process.env.REACT_APP_REQUEST_URL}ticket/categories/` + currentCompanyCode, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          this.setState({ categories: res.data.data })
        }
      }).catch(error => {

      });
    
    const staffHandbookFileType = 20
    axios.get(`${process.env.REACT_APP_REQUEST_URL}user/file-suggests?type=${staffHandbookFileType}`, config)
    .then(res => {
      if (res && res?.data && res?.data?.data) {
        this.setState({ staffHandbookLink: res?.data?.data })
      }
    }).catch(error => {})
  }

  showSubmitModal(modalStatus, isEdit = false) {
    this.setState({ isShowSubmitQuestionModal: modalStatus, isEditQuestion: isEdit });
  }

  showHistoryModal(modalStatus) {
    this.setState({ isShowHistoryModal: modalStatus });
  }

  showStatusModal = (message, isSuccess = false) => {
    this.setState({ isShowStatusModal: true, content: message, isSuccess: isSuccess });
    this.showSubmitModal(false);
    this.showHistoryModal(false);
  };

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
    window.location.reload();
  }

  showEditModal = (question) => {
    this.setState({ questionContent: question });
    this.showSubmitModal(true, true);
    this.showHistoryModal(false);
  }

  filterCommonTicket(tickets, categoryId) {
    let filterCommonTickets = tickets.filter(ticket => ticket.ticketCategoryId === categoryId);
    return filterCommonTickets
  }

  filterCommonTicketByKeyword(keySearch) {
    let filterCommonTickets = this.state.commonTicketList
    if (keySearch && keySearch !== '') {
      filterCommonTickets = filterCommonTickets.filter(ticket => ticket.subject.toLowerCase().includes(keySearch.toLowerCase()) || ticket.answer.toLowerCase().includes(keySearch.toLowerCase()))
    }
    return filterCommonTickets
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  search = (keySearch) => {
    this.setState({ commonTicketListFilter: this.filterCommonTicketByKeyword(keySearch) })
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter' && event.shiftKey) {
      return;
    }

    if (event.key === 'Enter') {
      this.search(this.state.keySearch)
    }
  }

  setOpen = (open) => {
    this.setState({ open: !open })
  }

  showStaffHandbookLink = () => {
    const { staffHandbookLink } = this.state
    const linkName = this.props.t("EmployeeHandbook")

    if (!staffHandbookLink) {
      return (
        <a href='#' target='_self' className="btn btn-light float-left shadow-customize">{linkName}</a>
      )
    }

    const extensionStaffHandbook = last(staffHandbookLink?.split('.'))
    const officeExtensionFile = ['doc', 'docx', 'xls', 'xlsx']

    if (officeExtensionFile.includes(extensionStaffHandbook)) {
      return (
        <a href={`https://view.officeapps.live.com/op/view.aspx?src=${staffHandbookLink}`} target='_blank' className="btn btn-light float-left shadow-customize">{linkName}</a>
      )
    }

    return (
      <a href={staffHandbookLink} target='_blank' className="btn btn-light float-left shadow-customize">{linkName}</a>
    )
  }

  render() {
    const { t } = this.props;
    const { categories, isEditQuestion, questionContent, isShowStatusModal, content, isSuccess, isShowSubmitQuestionModal, isShowHistoryModal, keySearch, commonTicketList, commonTicketListFilter, staffHandbookLink } = this.state  
    const isShowStaffHandbookLink = [Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading, Constants.pnlVCode.VinHome, Constants.pnlVCode.VinES].includes(currentCompanyCode)

    const reload = () => {
      if (isShowStatusModal) {
        window.location.reload();
      }
    }

    return (
      <div className="personal-info qna-page">
        <StatusModal show={isShowStatusModal} content={content} isSuccess={isSuccess} onHide={this.hideStatusModal} onExited={reload} />
        {
          isShowSubmitQuestionModal && <SubmitQuestionModal
            isEdit={isEditQuestion}
            editQuestion={questionContent}
            categories={categories}
            show={true} 
            onHide={() => this.showSubmitModal(false)} showStatusModal={this.showStatusModal.bind(this)} 
          />
        }
        <HistoryModal show={isShowHistoryModal} onHide={() => this.showHistoryModal(false)} onExiting={this.reload}
          showStatusModal={this.showStatusModal.bind(this)}
          showEditModal={this.showEditModal.bind(this)}
        />
        <div className="clearfix edit-button action-buttons mb-2">
          <span type="button" className="btn btn-light float-left pl-4 pr-4 ml-0" onClick={() => this.showSubmitModal(true)}> {t("CreateQuestions")} </span>
          <span type="button" className="btn btn-light float-left" onClick={() => this.showHistoryModal(true)}>{t("HistoryAnswer")}</span>
          { isShowStaffHandbookLink && this.showStaffHandbookLink() }
        </div>
        <h1 className="content-page-header">{t("QuestionAndAnswer")}</h1>
        <Container fluid className="wrap-form-qna-search mb-3">
          <div className="form-group form-qna-search">
            <label>{t("SearchKeywords")}</label>
            <div className="form-group row">
              <div className="col-sm-12 col-md-9">
                <input type="text" className="form-control" placeholder={t("Search")} id="txt-search" name="keySearch" aria-describedby="emailHelp" onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleChange.bind(this)} />
              </div>
              <div className="col-sm-12 col-md-3">
                <button type="button" className="btn btn-warning pr-5 pl-5 btn-search" onClick={() => this.search(keySearch)}><i className="icon-search mr-1"></i>{t("Search")}</button>
              </div>
            </div>
          </div>
        </Container>
        <h1 className="mt-3 mb-3 text-center content-page-header">{t("Faqs")}</h1>
        {
          commonTicketList && commonTicketList.length ?
            (
              (categories && categories.length && commonTicketListFilter && commonTicketListFilter.length) ? categories.map((category, index) => {
                let commonticketFiler = this.filterCommonTicket(commonTicketListFilter, category.id)
                return (commonticketFiler && commonticketFiler.length > 0) ? <div key={index} className="shadow-customize group-item">
                  <CommonQuestionComponent questions={commonticketFiler} categoryName={category.name} />
                </div>
                  : null
              }) : <div><p className="text-center">{t("NoResult")}</p></div>
            ) : null
        }
      </div >
    )
  }
}

const QuestionAndAnswer = HOCComponent(withTranslation()(MyComponent))

export default function App() {
  return (
    <QuestionAndAnswer />
  );
}

