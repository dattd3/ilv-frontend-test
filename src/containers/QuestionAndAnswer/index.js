import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import map from '../map.config';
import SubmitQuestionModal from './SubmitQuestionModal'
import HistoryModal from './HistoryModal'
import StatusModal from '../../components/Common/StatusModal'
import CommonQuestionComponent from './CommonQuestionComponent'

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
      keySearch: ""
    };
  }


  componentDidMount() {
    let config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    }
    axios.get(`${process.env.REACT_APP_REQUEST_URL}ticket/Common/`+ localStorage.getItem("companyCode"), config)
      .then(res => {
        if (res && res.data && res.data.data) {
          let commonTicketListRs = res.data.data.sort((a, b) => {
            return a.subject[0].toLowerCase().localeCompare(b.subject[0].toLowerCase(), "pl");
          });;
          this.setState({ commonTicketList: commonTicketListRs, commonTicketListFilter: commonTicketListRs });
        }
      }).catch(error => {
      });

    axios.get(`${process.env.REACT_APP_REQUEST_URL}ticket/categories/`+ localStorage.getItem("companyCode"), config)
      .then(res => {
        if (res && res.data && res.data.data) {
          this.setState({ categories: res.data.data })
        }
      }).catch(error => {

      });
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

  search = (keySearch) =>
  {
    this.setState({commonTicketListFilter: this.filterCommonTicketByKeyword(keySearch) })
  }
  handleKeyPress = (event) => {
    if (event.key === 'Enter' && event.shiftKey) {
      return;
    }

    if (event.key === 'Enter') {
      this.search(this.state.keySearch)
    }
  }

  render() {
    const { t } = this.props;
    const reload = () => {
      if (this.state.isShowStatusModal) {
        window.location.reload();
      }
    }
    return (
      <div className="personal-info">
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} onExited={reload} />
        <SubmitQuestionModal
          isEdit={this.state.isEditQuestion}
          editQuestion={this.state.questionContent}
          show={this.state.isShowSubmitQuestionModal} onHide={() => this.showSubmitModal(false)} showStatusModal={this.showStatusModal.bind(this)} />
        <HistoryModal show={this.state.isShowHistoryModal} onHide={() => this.showHistoryModal(false)} onExiting={this.reload}
          showStatusModal={this.showStatusModal.bind(this)}
          showEditModal={this.showEditModal.bind(this)}
        />
        <div className="clearfix edit-button mb-2">
          <button type="button" className="btn btn-light float-left shadow pl-4 pr-4 ml-0" onClick={() => this.showSubmitModal(true)}> Đặt câu hỏi </button>
          <button type="button" className="btn btn-light float-left shadow" onClick={() => this.showHistoryModal(true)}>Lịch sử giải đáp</button>
        </div>
        <h1 className="h3 text-uppercase text-gray-800 mt-3 mb-3">{t("HỖ TRỢ GIẢI ĐÁP")}</h1>
        <Container fluid className="info-tab-content shadow mb-3">
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Tìm kiếm từ khóa cần giải đáp</label>
            <div className="form-group row">
              <div className="col-sm-12 col-md-9 mb-2">
                <input type="text" className="form-control" placeholder="Nhập tìm kiếm" id="txt-search" name="keySearch" aria-describedby="emailHelp" onKeyPress={this.handleKeyPress.bind(this)} onChange={this.handleChange.bind(this)} />
              </div>
              <div className="col-sm-12 col-md-3 mb-2">
                <button type="button" className="btn btn-warning pr-5 pl-5" onClick={() => this.search(this.state.keySearch)}><i className="icon-search mr-1"></i>Tìm kiếm</button>
              </div>
            </div>
          </div>
        </Container>
        {
          (this.state.categories && this.state.categories.length > 0 && this.state.commonTicketListFilter && this.state.commonTicketListFilter.length > 0) ? this.state.categories.map((category, index) => {
            let commonticketFiler = this.filterCommonTicket(this.state.commonTicketListFilter, category.id)
            return (commonticketFiler && commonticketFiler.length > 0) ? <div key={index}>
                <h4 className="text-uppercase text-gray-800">{category.name}</h4>
                <CommonQuestionComponent questions = {commonticketFiler} />
              </div>
              : null
          }) : <div><p className="text-center">Không có kết quả phù hợp, vui lòng lựa chọn tìm từ khóa khác!</p></div>
        }
      </div >
    )
  }
}

const QuestionAndAnswer = withTranslation()(MyComponent)

export default function App() {
  return (
    <QuestionAndAnswer />
  );
}

