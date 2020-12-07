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
      isEditQuestion: false
    };
  }


  componentDidMount() {
    let config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
        'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
      }
    }
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
    this.setState({questionContent: question});
    this.showSubmitModal(true, true);
    this.showHistoryModal(false);
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
        isEdit = {this.state.isEditQuestion}
        editQuestion={this.state.questionContent} 
        show={this.state.isShowSubmitQuestionModal} onHide={() => this.showSubmitModal(false)} showStatusModal={this.showStatusModal.bind(this)} />
        <HistoryModal show={this.state.isShowHistoryModal} onHide={() => this.showHistoryModal(false)} onExiting={this.reload} 
        showStatusModal={this.showStatusModal.bind(this)}
        showEditModal = {this.showEditModal.bind(this)}
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
                <input type="text" className="form-control" placeholder="Nhập tìm kiếm" id="txt-search" aria-describedby="emailHelp" />
              </div>
              <div className="col-sm-12 col-md-3 mb-2">
                <button type="button" className="btn btn-warning pr-5 pl-5"><i className="icon-search mr-1"></i>Tìm kiếm</button>
              </div>
            </div>
          </div>
        </Container>

        <h4 className="text-uppercase text-gray-800">Chấm công, thời gian làm việc</h4>
        <Container fluid className="info-tab-content shadow pl-3 pr-3">
          <div className="mb-1">
            <span className="icon-Icon-Question mr-1"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
            <span><b>CBNV thực hiện chấm công ?</b></span>
          </div>
          <div className="pl-4 pr-4">
            <span className="lg icon-Icon-Answer mr-1"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
            <span className="font-italic">CBNV đi làm theo phân ca</span>
          </div>
        </Container>
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

