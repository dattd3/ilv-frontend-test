import React, { useState } from "react";
import axios from 'axios'
import unescape from 'lodash/unescape'
import moment from 'moment'
import Carousel from 'react-bootstrap/Carousel'
import SubmitQuestionModal from './SubmitQuestionModal'
import HistoryModal from './HistoryModal'
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';

class QuestionAndAnswerDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowSubmitQuestionModal: false,
      isShowHistoryModal: false,
      question: {}
    }
  }

  componentWillMount() {
    let config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    }
    axios.get(`${process.env.REACT_APP_REQUEST_URL}ticket/detail/${this.props.match.params.id}`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          let questionResult = res.data.data;
          this.setState({ question: questionResult });
        }
      }).catch(error => {
        //localStorage.clear();
        //window.location.href = map.Login;
      });
  }

  componentDidMount() {
  }
  showSubmitModal(modalStatus) {
    this.setState({ isShowSubmitQuestionModal: modalStatus });
  }

  showHistoryModal(modalStatus) {
    this.setState({ isShowHistoryModal: modalStatus });
  }

  render() {
    const { t } = this.props
    const question = this.state.question
    const comments = question.ticketComments
    return (
      <>
        <div className="personal-info">
          <SubmitQuestionModal show={this.state.isShowSubmitQuestionModal} onHide={() => this.showSubmitModal(false)} />
          <HistoryModal show={this.state.isShowHistoryModal} onHide={() => this.showHistoryModal(false)} />
          <div className="clearfix edit-button mb-2">
            <button type="button" className="btn btn-light float-left shadow pl-4 pr-4 ml-0" onClick={() => this.showSubmitModal(true)}> Đặt câu hỏi </button>
            <button type="button" className="btn btn-light float-left shadow" onClick={() => this.showHistoryModal(true)}>Lịch sử giải đáp</button>
          </div>
          <h1 className="h3 text-uppercase text-gray-800">HỖ TRỢ GIẢI ĐÁP</h1>
          <Container fluid className="info-tab-content shadow mb-4">
            <Carousel
              controls={true}
              indicators={false}
              prevIcon={<i className="fas fa-chevron-left fa-1x"></i>}
              nextIcon={<span ><i className="fas fa-chevron-right fa-1x"></i></span>}>
              <Carousel.Item>
                <div className="row p-3">
                  <div className="col-4 content-center">
                    <div className="media">
                      <span className="align-self-center mr-25">
                        <img className="align-self-center" src="https://i.pravatar.cc/300" alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                      </span>
                      <div className="media-body text-left">
                        <h5 className="mt-1 avt-color font-weight-bold">{question.fullName}</h5>
                        <span>
                          {question.userDepartmentName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-4 content-center">
                    <div className="media">
                      <span className="align-self-center mr-25">
                        <img className="align-self-center" src="https://i.pravatar.cc/300" alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                      </span>
                      <div className="media-body text-left">
                        <h5 className="mt-1 avt-color font-weight-bold">Nguyễn Như Huy</h5>
                        <span>
                          Nhân viên buồng phòng
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-4 content-center">
                    <div className="media">
                      <span className="align-self-center mr-25">
                        <img className="align-self-center" src="https://i.pravatar.cc/300" alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                      </span>
                      <div className="media-body text-left">
                        <h5 className="mt-1 avt-color font-weight-bold">Nguyễn Như Huy</h5>
                        <span>
                          Nhân viên buồng phòng
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="row p-3">
                  <div className="col-4 content-center">
                    <div className="media">
                      <span className="align-self-center mr-25">
                        <img className="align-self-center" src="https://i.pravatar.cc/300" alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                      </span>
                      <div className="media-body text-left">
                        <h5 className="mt-1 avt-color font-weight-bold">Nguyễn Như Huy</h5>
                        <span>
                          Nhân viên buồng phòng
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-4 content-center">
                    <div className="media">
                      <span className="align-self-center mr-25">
                        <img className="align-self-center" src="https://i.pravatar.cc/300" alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                      </span>
                      <div className="media-body text-left">
                        <h5 className="mt-1 avt-color font-weight-bold">Nguyễn Như Huy</h5>
                        <span>
                          Nhân viên buồng phòng
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-4 content-center">
                    <div className="media">
                      <span className="align-self-center mr-25">
                        <img className="align-self-center" src="https://i.pravatar.cc/300" alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                      </span>
                      <div className="media-body text-left">
                        <h5 className="mt-1 avt-color font-weight-bold">Nguyễn Như Huy</h5>
                        <span>
                          Nhân viên buồng phòng
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Carousel.Item>
            </Carousel>
          </Container>

          <Container fluid className="info-tab-content shadow pl-5 pr-5">
            <div className="content-center">
              <div className="media">
                <span className="align-self-center mr-25">
                  <img className="align-self-center" src="https://i.pravatar.cc/300" alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                </span>
                <div className="media-body text-left">
                  <h5 className="mt-1 avt-color font-weight-bold">{question.fullName}</h5>
                  <p className="mb-0">
                    <b>Nhóm câu hỏi: </b>
                    {question.ticketCategoryName}
                  </p>
                  <p className="mb-0">
                    <b>Nội dung câu hỏi: </b>
                    {question.content}
                  </p>
                </div>
              </div>
            </div>
            <hr />
            {
              (comments && comments.length > 0) ?
                comments.map((item, i) => {
                  return <div key={i}>
                    <div className="pl-5 mb-4">
                      <div className="content-center pl-5">
                        <div className="media">
                          <span className="align-self-center mr-25">
                            <img className="align-self-center" src="https://i.pravatar.cc/300" alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                          </span>
                          <div className="media-body text-left">
                            <h5 className="mt-1 avt-color font-weight-bold">{item.fullName}</h5>
                            <p className="mb-0">
                              <b>Trả lời: </b>
                              {item.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }) : null
            }

          </Container>
        </div>
      </>
    )
  }
}

export default QuestionAndAnswerDetails 
