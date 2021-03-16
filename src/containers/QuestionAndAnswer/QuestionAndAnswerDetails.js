import React, { useState } from "react";
import axios from 'axios'
import Carousel from 'react-bootstrap/Carousel'
import SubmitQuestionModal from './SubmitQuestionModal'
import HistoryModal from './HistoryModal'
import { Container, Row, Col, Tabs, Tab, Form, Button } from 'react-bootstrap';
import StatusModal from '../../components/Common/StatusModal'
import FormControl from 'react-bootstrap/FormControl'
import ConfirmModal from './ConfirmModal'
import SelectSupporterModal from './SelectSupporterModal'
import defaultAvartar from '../../components/Common/DefaultAvartar'
import Constants from '../../commons/Constants';
import { withTranslation } from 'react-i18next';

class QuestionAndAnswerDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowSubmitQuestionModal: false,
      isShowHistoryModal: false,
      question: {},
      isShowStatusModal: false,
      isShowConfirmModal: false,
      content: "",
      isSuccess: false,
      questionContent: {},
      isEditQuestion: false,
      comment: "",
      isShowCommentEditor: false,
      isShowSelectSupporterModal: false
    }
    this.submitSelectSupporterModal = this.submitSelectSupporterModal.bind(this)
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
          this.checkRole()
        }
      }).catch(error => {
        //localStorage.clear();
        //window.location.href = map.Login;
      });
  }

  componentDidMount() {

  }

  showSubmitModal(modalStatus, isEdit = false) {
    this.setState({ isShowSubmitQuestionModal: modalStatus, isEditQuestion: isEdit });
  }

  showHistoryModal(modalStatus) {
    this.setState({ isShowHistoryModal: modalStatus });
  }

  showStatusModal = (message, isSuccess = false) => {
    this.setState({ isShowStatusModal: true, content: message, isSuccess: isSuccess, isShowConfirmModal: false });
    this.showSubmitModal(false);
    this.showHistoryModal(false);
    this.showSelectSupporterModal(false);
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

  handleKeyPress = (event) => {
    if (event.key === 'Enter' && event.shiftKey) {
      return;
    }

    if (event.key === 'Enter') {
      if(this.state.comment === "")
      {
        this.showStatusModal("Nhập câu trả lời để tiếp tục!");
        return;
      }
      this.setState({ comment: event.target.value })
      this.showConfirmModal(true)
    }
  }

  submit = (isCloseTicket = false) => {
    let userId = localStorage.getItem('email')
    if (isCloseTicket) {
      this.completeQuestion(this.state.question.id)
    }
    this.submitComment(this.state.comment, userId, this.state.question.id, this.showStatusModal)
  }

  rejectComment = () => {
    const { t } = this.props
    let userId = localStorage.getItem('email')
    const rejectReason = t("Constants.QAAlreadyExist")
    this.completeQuestion(this.state.question.id)
    this.submitComment(rejectReason, userId, this.state.question.id, this.showStatusModal)
  }


  submitComment = (comment, userid, ticketid, callBack) => {
    var axios = require('axios');
    var data = JSON.stringify({
      "content": comment,
      "ticketid": ticketid,
      "userid": userid
    })
    var config = {
      method: 'post',
      url: `${process.env.REACT_APP_REQUEST_URL}ticket/CreateComment`,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios(config)
      .then(function (response) {
        callBack("Gửi trả lời thành công!", true);
      })
      .catch(function (error) {
        callBack("Rất tiếc, có lỗi xảy ra!");
      });
  }

  completeQuestion = (questionId) => {
    var axios = require('axios');
    var data = JSON.stringify({
      "id": questionId
    })
    var config = {
      method: 'post',
      url: `${process.env.REACT_APP_REQUEST_URL}ticket/Complete`,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios(config)
      .then(function (response) {
        return true
      })
      .catch(function (error) {
        return false
      });
  }
  showConfirmModal = (modalStatus) => {
    this.setState({ isShowConfirmModal: modalStatus });
  }

  showSelectSupporterModal = (modalStatus) => {
    this.setState({ isShowSelectSupporterModal: modalStatus });
  }
  checkRole = () => {
    let userId = localStorage.getItem('email').toLowerCase();
    this.setState({
      isShowCommentEditor: (this.state.question &&
        (this.state.question.agentId.toLowerCase() === userId || this.state.question.supporterId.toLowerCase() === userId)
        && this.state.question.ticketStatusId === 1
      ) ? true : false
    })
  }

  submitSelectSupporterModal = (supporter) => {
    let question = this.state.question
    let _self = this
    if (question && supporter && supporter.userAccount) {
      var axios = require('axios');
      var data = JSON.stringify({
        "id": question.id,
        "subject": question.subject,
        "content": question.content,
        "ticketstatusid": 1,
        "userid": question.userId,
        "userjobtitle": question.userTitle,
        "userdepartmentname": question.userDepartmentName,
        "userfullname": question.fullName,
        "useravatar": question.ownerAvatar,
        "agentid": question.agentId,
        "agentjobtitle": question.agentTitle,
        "agentemployeeno": "",
        "agentdepartmentname": question.agentDepartmentName,
        "agentfullname": question.agentName,
        "agentavatar": question.agentAvatar,
        "supporterid": supporter.userAccount.toLowerCase() + "@vingroup.net",
        "supporterjobtitle": supporter.current_position,
        "supporteremployeeno": "",
        "supporterdepartmentname": supporter.part,
        "supporterfullname": supporter.fullname,
        "supporteravatar": supporter.avatar,
        "ticketcategoryid": question.ticketCategoryId
      })
      var config = {
        method: 'post',
        url: `${process.env.REACT_APP_REQUEST_URL}ticket/edit`,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios(config)
        .then(function (response) {
          _self.showStatusModal("Gửi/ chuyển câu hỏi thành công!", true)
        })
        .catch(function (error) {
          _self.showStatusModal("Rất tiếc, đã có lỗi xảy ra!")
        });
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { t } = this.props
    const reload = () => {
      if (this.state.isShowStatusModal) {
        window.location.reload();
      }
    }
    const question = this.state.question
    const comments = question.ticketComments
    return (
      question && question.content ?
        <>
          <ConfirmModal
            show={this.state.isShowConfirmModal}
            onHide={() => this.showConfirmModal(false)}
            onAcceptClick={() => this.submit(true)}
            onCancelClick={() => this.submit(false)}
            confirmHeader="KẾT THÚC GIẢI ĐÁP"
            confirmContent="Bạn xác nhận muốn kết thúc giải đáp này?"
          />
          <SelectSupporterModal
            show={this.state.isShowSelectSupporterModal}
            onHide={() => this.showSelectSupporterModal(false)}
            onAcceptClick={this.submitSelectSupporterModal}
            onCancelClick={() => this.showSelectSupporterModal(false)}
            modalHeader="GỬI ĐẾN CBLĐ/ HR GIẢI ĐÁP"
          />
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
              <button type="button" className="btn btn-light float-left shadow pl-4 pr-4 ml-0" onClick={() => this.showSubmitModal(true)}>{t("CreateQuestions")}</button>
              <button type="button" className="btn btn-light float-left shadow" onClick={() => this.showHistoryModal(true)}>{t("HistoryAnswer")}</button>

            </div>
            <div className="row mb-2 mt-1">
              <h1 className="col-6 h3 text-uppercase text-gray-800">{t("QuestionAndAnswer")}</h1>
              {
                this.state.question && this.state.isShowCommentEditor ?
                  <div className="col-6 pull-right text-right">
                    <Button variant="outline-primary pl-5 pr-5" onClick={() => this.showSelectSupporterModal(true)} >Gửi đến CBLĐ/ HR giải đáp</Button>
                  </div>
                  : null
              }
            </div>
            <Container fluid className="info-tab-content shadow mb-4">
              <Carousel
                controls={true}
                indicators={false}
                prevIcon={<i className="fas fa-chevron-left fa-1x"></i>}
                nextIcon={<span ><i className="fas fa-chevron-right fa-1x"></i></span>}>
                <Carousel.Item>
                  <div className="row p-3">
                    {
                      question && question.agentId ?
                        <div className="col-4 content-center">
                          <div className="media">
                            <span className="align-self-center mr-25">
                              <img className="align-self-center" src={`data:image/png;base64,${question.ownerAvatar}`} onError={defaultAvartar} alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                            </span>
                            <div className="media-body text-left">
                              <h6 className="mt-1 avt-color font-weight-bold pt-1">{question.fullName}</h6>
                              <span>
                                {question.userTitle}
                              </span>
                            </div>
                          </div>
                        </div> : null
                    }
                    {
                      question && question.agentId ?
                        <div className="col-4 content-center">
                          <div className="media">
                            <span className="align-self-center mr-25">
                              <img className="align-self-center" src={`data:image/png;base64,${question.agentAvatar}`} onError={defaultAvartar} alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                            </span>
                            <div className="media-body text-left">
                              <h6 className="mt-1 avt-color font-weight-bold pt-1">{question.agentName}</h6>
                              <span>
                                {question.agentTitle}
                              </span>
                            </div>
                          </div>
                        </div> : null
                    }
                    {
                      question && question.supporterId ?
                        <div className="col-4 content-center">
                          <div className="media">
                            <span className="align-self-center mr-25">
                              <img className="align-self-center" src={`data:image/png;base64,${question.supporterAvatar}`} onError={defaultAvartar} alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                            </span>
                            <div className="media-body text-left">
                              <h6 className="mt-1 avt-color font-weight-bold pt-1">{question.supporterName}</h6>
                              <span>
                                {question.supporterTitle}
                              </span>
                            </div>
                          </div>
                        </div> : null
                    }
                  </div>
                </Carousel.Item>
                <Carousel.Item>
                  <div className="row p-3">
                    {
                      question && question.agentId ?
                        <div className="col-4 content-center">
                          <div className="media">
                            <span className="align-self-center mr-25">
                              <img className="align-self-center" src={`data:image/png;base64,${question.ownerAvatar}`} onError={defaultAvartar} alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                            </span>
                            <div className="media-body text-left">
                              <h6 className="mt-1 avt-color font-weight-bold pt-1">{question.fullName}</h6>
                              <span>
                                {question.userTitle}
                              </span>
                            </div>
                          </div>
                        </div> : null
                    }
                    {
                      question && question.agentId ?
                        <div className="col-4 content-center">
                          <div className="media">
                            <span className="align-self-center mr-25">
                              <img className="align-self-center" src={`data:image/png;base64,${question.agentAvatar}`} onError={defaultAvartar} alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                            </span>
                            <div className="media-body text-left">
                              <h6 className="mt-1 avt-color font-weight-bold pt-1">{question.agentName}</h6>
                              <span>
                                {question.agentTitle}
                              </span>
                            </div>
                          </div>
                        </div> : null
                    }
                    {
                      question && question.supporterId ?
                        <div className="col-4 content-center">
                          <div className="media">
                            <span className="align-self-center mr-25">
                              <img className="align-self-center" src={`data:image/png;base64,${question.supporterAvatar}`} onError={defaultAvartar} alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                            </span>
                            <div className="media-body text-left">
                              <h6 className="mt-1 avt-color font-weight-bold pt-1">{question.supporterName}</h6>
                              <span>
                                {question.supporterTitle}
                              </span>
                            </div>
                          </div>
                        </div> : null
                    }
                  </div>
                </Carousel.Item>

              </Carousel>
            </Container>

            <Container fluid className="info-tab-content shadow pl-5 pr-5">
              <div className="content-center">
                <div className="media">
                  <span className="align-self-center mr-25">
                    <img className="align-self-center" src={`data:image/png;base64,${question.ownerAvatar}`} onError={defaultAvartar} alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                  </span>
                  <div className="media-body text-left">
                    <h6 className="mt-1 avt-color font-weight-bold">{question.fullName}</h6>
                    <p className="mb-0">
                      <b>{t("Categoryques")}: </b>
                      {question.ticketCategoryName}
                    </p>
                    <p className="mb-0 text-break">
                      <b>{t("Question")}: </b>
                      {question.content}
                    </p>
                  </div>
                </div>
              </div>
              <hr />
              {
                (comments && comments.length > 0) ?
                  comments.map((item, i) => {
                    return <div key={i} className="pl-5 pr-5 mb-4">
                      <div className="content-center pl-5 pr-5">
                        <div className="media">
                          <span className="align-self-center mr-25">
                            <img className="align-self-center" src={`data:image/png;base64,${question.userImg}`} onError={defaultAvartar} alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                          </span>
                          <div className="media-body text-left multiline">
                            <h6 className="mt-1 avt-color font-weight-bold pt-1">{item.fullName}</h6>
                            <p className="mb-0 text-break">
                              <b className="text-left">{t('Answer')}: </b>
                              {item.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  }) : null
              }
              {
                this.state.question && this.state.isShowCommentEditor ?
                  <div className="pl-5">
                    <div className="pl-5">
                      <div className="media">
                        <span className="align-self-center mr-25">
                          <img className="align-self-center" src={`data:image/png;base64,${localStorage.getItem('avatar')}`} onError={defaultAvartar} alt="avatar" width={65} height={65} style={{ borderRadius: '50%' }} />
                        </span>
                        <div className="media-body text-left">
                          <FormControl placeholder={t("EnterAnswer")} as="textarea" name="comment" onChange={this.handleChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-right">
                      <Button variant="danger pl-3 pr-3 mr-2" onClick={this.rejectComment}>{t("Rejected")}</Button>{' '}
                      <Button variant="primary pl-4 pr-4" disabled={(this.state.comment === ""? true: false)} onClick={() => this.showConfirmModal(true)}>{t('Answer')}</Button>{' '}
                    </div>
                  </div>
                  : null
              }

            </Container>
            {this.state.question && this.state.isShowCommentEditor ?
              <div className="dannger-note">
                <p>*Lưu ý: Trường hợp câu hỏi đã có trong bộ Q&A của phần hỗ trợ giải đáp, có thể chọn "Từ chối" để yêu cầu CBNV tự tra cứu trên MyVinpearl</p>
              </div> : null
            }
          </div>
        </> :
        <>
        </>
    )
  }
}

export default withTranslation()(QuestionAndAnswerDetails) 
