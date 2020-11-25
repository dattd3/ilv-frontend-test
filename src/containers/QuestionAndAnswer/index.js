import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import map from '../map.config';
import SubmitQuestionModal from './SubmitQuestionModal'
import HistoryModal from './HistoryModal'

class MyComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userProfile: {},
      isShowSubmitQuestionModal: false,
      isShowHistoryModal: false
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

  showSubmitModal(modalStatus) {
    this.setState({isShowSubmitQuestionModal: modalStatus });
  }

  showHistoryModal(modalStatus) {
    this.setState({isShowHistoryModal: modalStatus });
  }

  render() {
    const { t } = this.props;

    return (
      <div className="personal-info">
      <SubmitQuestionModal show={this.state.isShowSubmitQuestionModal}  onHide={() => this.showSubmitModal(false)} />
      <HistoryModal show={this.state.isShowHistoryModal}  onHide={() => this.showHistoryModal(false)} />
      <div className="clearfix edit-button mb-2">
            <button type="button" className="btn btn-light float-left shadow pl-4 pr-4 ml-0" onClick={() => this.showSubmitModal(true)}> Đặt câu hỏi </button>
            <button type="button" className="btn btn-light float-left shadow" onClick={() => this.showHistoryModal(true)}>Lịch sử giải đáp</button>
      </div>
        <h1 className="h3 text-uppercase text-gray-800">{t("HỖ TRỢ GIẢI ĐÁP")}</h1>
        <Container fluid className="info-tab-content shadow">
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Tìm kiếm từ khóa cần giải đáp</label>
              <div className="form-group row">
                <div className = "col-sm-12 col-md-9 mb-2">
                  <input type="text" className="form-control" placeholder="Nhập tìm kiếm" id="txt-search" aria-describedby="emailHelp" />
                </div>
                <div className="col-sm-12 col-md-3 mb-2">
                  <button type="button" className="btn btn-warning pr-5 pl-5"><i className="icon-search mr-1"></i>Tìm kiếm</button>
                </div>
              </div>
            </div>

           <hr />
           <div className="media">
           <span className ="img-circle align-self-center">
              <i className="icon icon-qa-unselected align-self-center"></i>
            </span>
            <div className="media-body">
              <h5 className="mt-1"><a href ="/">Media heading</a></h5>
              <span> 
              <i className="icon-hr mr-1"></i>Phòng Nhân sự
              <i className="fa fa-clock-o mr-1 ml-3"></i>5 giờ trước
              </span>
            </div>
          </div>

          <hr />
           <div className="media">
           <span className ="img-circle align-self-center">
              <i className="icon icon-qa-unselected align-self-center"></i>
            </span>
            <div className="media-body">
              <h5 className="mt-1"><a href ="/">Media heading</a></h5>
              <span> 
              <i className="icon-hr mr-1"></i>Phòng Nhân sự
              <i className="fa fa-clock-o mr-1 ml-3"></i>5 giờ trước
              </span>
            </div>
          </div>

          <hr />
           <div className="media">
           <span className ="img-circle align-self-center">
              <i className="icon icon-qa-unselected align-self-center"></i>
            </span>
            <div className="media-body">
              <h5 className="mt-1"><a href ="/">Media heading</a></h5>
              <span> 
              <i className="icon-hr mr-1"></i>Phòng Nhân sự
              <i className="fa fa-clock-o mr-1 ml-3"></i>5 giờ trước
              </span>
            </div>
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

