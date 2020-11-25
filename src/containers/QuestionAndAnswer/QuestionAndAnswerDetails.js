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
      isShowHistoryModal: false
    }
  }

  componentWillMount() {
    const config = {
        headers: {
          'Authorization': `${localStorage.getItem('accessToken')}`
        }
    }
  }

  componentDidMount() {                                      
  }
  showSubmitModal(modalStatus) {
    this.setState({isShowSubmitQuestionModal: modalStatus });
  }

  showHistoryModal(modalStatus) {
    this.setState({isShowHistoryModal: modalStatus });
  }

  render() {
    const { t } = this.props
    console.log(this.props.match.params.id)
    return (
      <>
      <div className="personal-info">
        <SubmitQuestionModal show={this.state.isShowSubmitQuestionModal}  onHide={() => this.showSubmitModal(false)} />
        <HistoryModal show={this.state.isShowHistoryModal}  onHide={() => this.showHistoryModal(false)} />
        <div className="clearfix edit-button mb-2">
              <button type="button" className="btn btn-light float-left shadow pl-4 pr-4 ml-0" onClick={() => this.showSubmitModal(true)}> Đặt câu hỏi </button>
              <button type="button" className="btn btn-light float-left shadow" onClick={() => this.showHistoryModal(true)}>Lịch sử giải đáp</button>
        </div>
        <h1 className="h3 text-uppercase text-gray-800">HỖ TRỢ GIẢI ĐÁP</h1>
        <Container fluid className="info-tab-content shadow">
            <Carousel
            controls = {true}
            indicators = {false}
            prevIcon = {<i class="fas fa-chevron-left fa-3x"></i>}
            nextIcon = {<span ><i class="fas fa-chevron-right fa-3x"></i></span>}>
            <Carousel.Item>
              <div className="row">
                <div className="col-sm-4 content-center">
                  <div className="media">
                    <span className ="align-self-center mr-25">
                        <i className="fas fa-user-circle fa-4x"></i>
                    </span>
                    <div className="media-body">
                        <h5 className="mt-1"><a href ="/">Nguyễn Như Huy 1</a></h5>
                        <span> 
                          Nhân viên buồng phòng
                        </span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4 content-center">
                  <div className="media">
                    <span className ="align-self-center mr-25">
                        <i className="fas fa-user-circle fa-4x"></i>
                    </span>
                    <div className="media-body">
                        <h5 className="mt-1"><a href ="/">Nguyễn Như Huy 1</a></h5>
                        <span> 
                          Nhân viên buồng phòng
                        </span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4 content-center">
                  <div className="media">
                    <span className ="align-self-center mr-25">
                        <i className="fas fa-user-circle fa-4x"></i>
                    </span>
                    <div className="media-body">
                        <h5 className="mt-1"><a href ="/">Nguyễn Như Huy 1</a></h5>
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
      </div>
      </>
    )
  }
}

export default QuestionAndAnswerDetails 
