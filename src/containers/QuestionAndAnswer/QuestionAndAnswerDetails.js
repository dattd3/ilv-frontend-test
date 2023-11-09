import React from "react";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import SubmitQuestionModal from "./SubmitQuestionModal";
import HistoryModal from "./HistoryModal";
import { Container, Button, Spinner } from "react-bootstrap";
import StatusModal from "../../components/Common/StatusModal";
import FormControl from "react-bootstrap/FormControl";
import SelectSupporterModal from "./SelectSupporterModal";
import defaultAvartar from "../../components/Common/DefaultAvartar";
import { withTranslation } from "react-i18next";
import HOCComponent from "../../components/Common/HOCComponent";
import IconRateStar from "assets/img/icon/icon-rate-star.svg";
import IconRateStarFull from "assets/img/icon/icon-rate-star-full.svg";
import IconSend from "assets/img/icon/icon-send.svg";
import IconXRed from "assets/img/icon/ic_x_red.svg";
import IconTickGreen from "assets/img/icon/ic_tick_green.svg";

class QuestionAndAnswerDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowSubmitQuestionModal: false,
      isShowHistoryModal: false,
      question: {},
      isShowStatusModal: false,
      content: "",
      isSuccess: false,
      questionContent: {},
      isEditQuestion: false,
      comment: "",
      isShowCommentEditor: false,
      isShowSelectSupporterModal: false,
      categories: [],
      isRatingLoading: false,
      isLoading: false,
      isRejectLoading: false,
    };
    this.submitSelectSupporterModal =
      this.submitSelectSupporterModal.bind(this);
  }

  componentWillMount() {
    let config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    axios
      .get(
        `${process.env.REACT_APP_REQUEST_URL}ticket/detail/${this.props.match.params.id}`,
        config
      )
      .then((res) => {
        if (res && res.data && res.data.data) {
          let questionResult = res.data.data;
          this.setState({ question: questionResult });
          this.checkRole();
        }
      })
      .catch((error) => {
        //localStorage.clear();
        //window.location.href = map.Login;
      });
  }

  componentDidMount() {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };

    axios
      .get(
        `${
          process.env.REACT_APP_REQUEST_URL
        }ticket/categories/${localStorage.getItem("companyCode")}`,
        config
      )
      .then((res) => {
        if (res && res?.data && res?.data?.data) {
          this.setState({ categories: res?.data?.data || [] });
        }
      })
      .catch((error) => {});
  }

  showSubmitModal(modalStatus, isEdit = false) {
    this.setState({
      isShowSubmitQuestionModal: modalStatus,
      isEditQuestion: isEdit,
    });
  }

  showHistoryModal(modalStatus) {
    this.setState({ isShowHistoryModal: modalStatus });
  }

  showStatusModal = (message, isSuccess = false) => {
    this.setState({
      isShowStatusModal: true,
      content: message,
      isSuccess: isSuccess,
    });
    this.showSubmitModal(false);
    this.showHistoryModal(false);
    this.showSelectSupporterModal(false);
  };

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
    window.location.reload();
  };

  showEditModal = (question) => {
    this.setState({ questionContent: question });
    this.showSubmitModal(true, true);
    this.showHistoryModal(false);
  };

  submit = (isCloseTicket = false) => {
    this.setState({
      isLoading: true,
    });
    let userId = localStorage.getItem("email");
    if (isCloseTicket) {
      this.completeQuestion(this.state.question.id);
    }
    this.submitComment(
      this.state.comment,
      userId,
      this.state.question.id,
      this.showStatusModal
    );
  };

  rejectComment = () => {
    this.setState({
      isRejectLoading: true,
    });
    let userId = localStorage.getItem("email");
    const rejectReason = this.props.t("QAAlreadyExist");
    this.completeQuestion(this.state.question.id);
    this.submitComment(
      rejectReason,
      userId,
      this.state.question.id,
      this.showStatusModal
    );
  };

  submitComment = (comment, userid, ticketid, callBack) => {
    const { t } = this.props;
    var axios = require("axios");
    var data = JSON.stringify({
      content: comment,
      ticketid: ticketid,
      userid: userid,
    });
    var config = {
      method: "post",
      url: `${process.env.REACT_APP_REQUEST_URL}ticket/CreateComment`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios(config)
      .then((response) => {
        callBack(t("ResponseSentSuccessfully"), true);
      })
      .catch((error) => {
        callBack(t("HasErrorOccurred"));
      })
  };

  completeQuestion = (questionId) => {
    var axios = require("axios");
    var data = JSON.stringify({
      id: questionId,
    });
    var config = {
      method: "post",
      url: `${process.env.REACT_APP_REQUEST_URL}ticket/Complete`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        return true;
      })
      .catch(function (error) {
        return false;
      });
  };

  showSelectSupporterModal = (modalStatus) => {
    this.setState({ isShowSelectSupporterModal: modalStatus });
  };

  checkRole = () => {
    let userId = localStorage.getItem("email").toLowerCase();
    this.setState({
      isShowCommentEditor:
        this.state.question &&
        (this.state.question.agentId.toLowerCase() === userId ||
          this.state.question.supporterId.toLowerCase() === userId) &&
        this.state.question.ticketStatusId === 1
          ? true
          : false,
    });
  };

  submitSelectSupporterModal = (supporter) => {
    const { t } = this.props;
    const question = this.state.question;

    if (question && supporter && supporter.userAccount) {
      const axios = require("axios");
      const data = JSON.stringify({
        id: question.id,
        subject: question.subject,
        content: question.content,
        ticketstatusid: 1,
        userid: question.userId,
        userjobtitle: question.userTitle,
        userdepartmentname: question.userDepartmentName,
        userfullname: question.fullName,
        useravatar: question.ownerAvatar,
        agentid: question.agentId,
        agentjobtitle: question.agentTitle,
        agentemployeeno: "",
        agentdepartmentname: question.agentDepartmentName,
        agentfullname: question.agentName,
        agentavatar: question.agentAvatar,
        supporterid: supporter.userAccount.toLowerCase() + "@vingroup.net",
        supporterjobtitle: supporter.current_position,
        supporteremployeeno: "",
        supporterdepartmentname: supporter.part,
        supporterfullname: supporter.fullname,
        supporteravatar: supporter.avatar,
        ticketcategoryid: question.ticketCategoryId,
        solverid: question.solverId,
      });
      const config = {
        method: "post",
        url: `${process.env.REACT_APP_REQUEST_URL}ticket/edit`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then((response) => {
          this.showStatusModal(t("QuestionSubmissionSuccessful"), true);
        })
        .catch((error) => {
          this.showStatusModal(t("HasErrorOccurred"));
        });
    }
  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleChangeCommentRating(id, rating) {
    const newComments = [...this.state.question?.ticketComments];
    const objChange = newComments.find((comment) => comment.id === id);

    if (objChange) {
      objChange.rating = rating;
    }
    this.setState({
      question: {
        ...this.state.question,
        ticketComments: newComments,
      },
    });
  }

  submitRating(id) {
    this.setState({
      isRatingLoading: true,
    });
    const { t } = this.props;

    const commentRating = this.state.question?.ticketComments?.find(
      (comment) => comment.id === id
    );
    if (commentRating?.rating > 0) {
      const config = {
        method: "post",
        url: `${process.env.REACT_APP_REQUEST_URL}ticket/rated`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        data: {
          id,
          rated: commentRating?.rating,
        },
      };

      axios(config)
        .then((response) => {
          this.setState({
            question: {
              ...this.state.question,
              ticketComments: this.state.question?.ticketComments?.map(
                (item) => {
                  return item.id === id
                    ? {
                        ...item,
                        rated: item.rating,
                      }
                    : item;
                }
              ),
            },
          });
          this.showStatusModal(t("RatingSuccessfully"), true);
        })
        .catch((error) => {
          this.showStatusModal(t("HasErrorOccurred"));
        });
    }
    this.setState({
      isRatingLoading: false,
    });
  }

  render() {
    const { t } = this.props;
    const {
      isShowStatusModal,
      question,
      isShowSelectSupporterModal,
      content,
      isSuccess,
      isEditQuestion,
      questionContent,
      isShowSubmitQuestionModal,
      isShowHistoryModal,
      isShowCommentEditor,
      comment,
      categories,
      isRatingLoading,
      isLoading,
      isRejectLoading
    } = this.state;
    const comments = question.ticketComments;
    const isEmployeeView = question.userId === localStorage.getItem("email");

    const reload = () => {
      if (isShowStatusModal) {
        window.location.reload();
      }
    };

    return question && question.content ? (
      <>
        <SelectSupporterModal
          show={isShowSelectSupporterModal}
          onHide={() => this.showSelectSupporterModal(false)}
          onAcceptClick={this.submitSelectSupporterModal}
          onCancelClick={() => this.showSelectSupporterModal(false)}
          modalHeader={t("EscalateToManagerOrHr")}
        />
        <StatusModal
          show={isShowStatusModal}
          content={content}
          isSuccess={isSuccess}
          onHide={this.hideStatusModal}
          onExited={reload}
        />
        <SubmitQuestionModal
          isEdit={isEditQuestion}
          editQuestion={questionContent}
          categories={categories}
          show={isShowSubmitQuestionModal}
          onHide={() => this.showSubmitModal(false)}
          showStatusModal={this.showStatusModal.bind(this)}
        />
        <HistoryModal
          show={isShowHistoryModal}
          onHide={() => this.showHistoryModal(false)}
          onExiting={this.reload}
          showStatusModal={this.showStatusModal.bind(this)}
          showEditModal={this.showEditModal.bind(this)}
        />
        <div className="personal-info qna-detail-page">
          <div className="clearfix edit-button action-buttons mb-2">
            <span
              type="button"
              className="btn btn-light float-left shadow-customize pl-4 pr-4 ml-0"
              onClick={() => this.showSubmitModal(true)}
            >
              {t("CreateQuestions")}
            </span>
            <span
              type="button"
              className="btn btn-light float-left shadow-customize"
              onClick={() => this.showHistoryModal(true)}
            >
              {t("HistoryAnswer")}
            </span>
          </div>
          <div className="wrap-header">
            <h1 className="content-page-header">{t("QuestionAndAnswer")}</h1>
            {question && isShowCommentEditor && (
              <Button
                variant="outline-primary pl-5 pr-5"
                onClick={() => this.showSelectSupporterModal(true)}
              >
                {t("EscalateToManagerOrHr")}
              </Button>
            )}
          </div>
          <Container fluid className="info-tab-content mb-4">
            <Carousel
              controls={true}
              indicators={false}
              prevIcon={<i className="fas fa-chevron-left fa-1x"></i>}
              nextIcon={
                <span>
                  <i className="fas fa-chevron-right fa-1x"></i>
                </span>
              }
            >
              <Carousel.Item>
                <div className="row p-3">
                  {question && question.agentId ? (
                    <div className="col-4 content-center">
                      <div className="media">
                        <span className="align-self-center mr-25">
                          <img
                            className="align-self-center cover"
                            src={`data:image/png;base64,${question.ownerAvatar}`}
                            onError={defaultAvartar}
                            alt="avatar"
                            width={65}
                            height={65}
                            style={{ borderRadius: "50%" }}
                          />
                        </span>
                        <div className="media-body text-left">
                          <h6 className="mt-1 avt-color font-weight-bold pt-1">
                            {question.fullName}
                          </h6>
                          <span>{question.userTitle}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {question && question.agentId ? (
                    <div className="col-4 content-center">
                      <div className="media">
                        <span className="align-self-center mr-25">
                          <img
                            className="align-self-center cover"
                            src={`data:image/png;base64,${question.agentAvatar}`}
                            onError={defaultAvartar}
                            alt="avatar"
                            width={65}
                            height={65}
                            style={{ borderRadius: "50%" }}
                          />
                        </span>
                        <div className="media-body text-left">
                          <h6 className="mt-1 avt-color font-weight-bold pt-1">
                            {question.agentName}
                          </h6>
                          <span>{question.agentTitle}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {question && question.supporterId ? (
                    <div className="col-4 content-center">
                      <div className="media">
                        <span className="align-self-center mr-25">
                          <img
                            className="align-self-center cover"
                            src={`data:image/png;base64,${question.supporterAvatar}`}
                            onError={defaultAvartar}
                            alt="avatar"
                            width={65}
                            height={65}
                            style={{ borderRadius: "50%" }}
                          />
                        </span>
                        <div className="media-body text-left">
                          <h6 className="mt-1 avt-color font-weight-bold pt-1">
                            {question.supporterName}
                          </h6>
                          <span>{question.supporterTitle}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </Carousel.Item>
              <Carousel.Item>
                <div className="row p-3">
                  {question && question.agentId ? (
                    <div className="col-4 content-center">
                      <div className="media">
                        <span className="align-self-center mr-25">
                          <img
                            className="align-self-center cover"
                            src={`data:image/png;base64,${question.ownerAvatar}`}
                            onError={defaultAvartar}
                            alt="avatar"
                            width={65}
                            height={65}
                            style={{ borderRadius: "50%" }}
                          />
                        </span>
                        <div className="media-body text-left">
                          <h6 className="mt-1 avt-color font-weight-bold pt-1">
                            {question.fullName}
                          </h6>
                          <span>{question.userTitle}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {question && question.agentId ? (
                    <div className="col-4 content-center">
                      <div className="media">
                        <span className="align-self-center mr-25">
                          <img
                            className="align-self-center cover"
                            src={`data:image/png;base64,${question.agentAvatar}`}
                            onError={defaultAvartar}
                            alt="avatar"
                            width={65}
                            height={65}
                            style={{ borderRadius: "50%" }}
                          />
                        </span>
                        <div className="media-body text-left">
                          <h6 className="mt-1 avt-color font-weight-bold pt-1">
                            {question.agentName}
                          </h6>
                          <span>{question.agentTitle}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {question && question.supporterId ? (
                    <div className="col-4 content-center">
                      <div className="media">
                        <span className="align-self-center mr-25">
                          <img
                            className="align-self-center cover"
                            src={`data:image/png;base64,${question.supporterAvatar}`}
                            onError={defaultAvartar}
                            alt="avatar"
                            width={65}
                            height={65}
                            style={{ borderRadius: "50%" }}
                          />
                        </span>
                        <div className="media-body text-left">
                          <h6 className="mt-1 avt-color font-weight-bold pt-1">
                            {question.supporterName}
                          </h6>
                          <span>{question.supporterTitle}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </Carousel.Item>
            </Carousel>
          </Container>

          <Container fluid className="info-tab-content pl-5 pr-5">
            <div className="content-center">
              <div className="media">
                <span className="align-self-center mr-25">
                  <img
                    className="align-self-center cover"
                    src={`data:image/png;base64,${question.ownerAvatar}`}
                    onError={defaultAvartar}
                    alt="avatar"
                    width={65}
                    height={65}
                    style={{ borderRadius: "50%" }}
                  />
                </span>
                <div className="media-body text-left">
                  <h6 className="mt-1 avt-color font-weight-bold">
                    {question.fullName}
                  </h6>
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
            {comments && comments.length > 0
              ? comments.map((item, i) => {
                  return (
                    <div key={i} className="pl-5 pr-5 mb-4">
                      <div className="content-center pl-5 pr-5">
                        <div className="media">
                          <span className="align-self-center mr-25">
                            <img
                              className="align-self-center cover"
                              src={`data:image/png;base64,${question.userImg}`}
                              onError={defaultAvartar}
                              alt="avatar"
                              width={65}
                              height={65}
                              style={{ borderRadius: "50%" }}
                            />
                          </span>
                          <div className="media-body text-left multiline">
                            <h6 className="mt-1 avt-color font-weight-bold pt-1">
                              {item.fullName}
                            </h6>
                            <p className="mb-0 text-break">
                              <b className="text-left">{t("Answer")}: </b>
                              {item.content}
                              <div className="rate-star-container">
                                {(isEmployeeView || !!item.rated) &&
                                  Array.from(Array(5).keys()).map(
                                    (starIndex) => (
                                      <img
                                        key={starIndex}
                                        src={
                                          item.rating >= starIndex + 1 ||
                                          item.rated >= starIndex + 1
                                            ? IconRateStarFull
                                            : IconRateStar
                                        }
                                        alt=""
                                        className="icon-star"
                                        style={{
                                          opacity:
                                            item.isExpire && !item.rated
                                              ? 0.5
                                              : 1,
                                        }}
                                        onClick={() =>
                                          item.isExpire ||
                                          item.rated ||
                                          !isEmployeeView
                                            ? {}
                                            : this.handleChangeCommentRating(
                                                item.id,
                                                starIndex + 1
                                              )
                                        }
                                      />
                                    )
                                  )}
                                {isEmployeeView && (
                                  <>
                                    {!item.isExpire && !item.rated && (
                                      <button
                                        className="send-button"
                                        disabled={isRatingLoading}
                                        onClick={() =>
                                          this.submitRating(item.id)
                                        }
                                      >
                                        <img src={IconSend} alt="" />{" "}
                                        {t("Confirm")}
                                      </button>
                                    )}
                                    {!!item.rated && (
                                      <button className="completed-button">
                                        <img src={IconTickGreen} alt="" />{" "}
                                        {t("Completed")}
                                      </button>
                                    )}
                                    {item.isExpire && !item.rated && (
                                      <button className="expired-button">
                                        <img src={IconXRed} alt="" />{" "}
                                        {t("Expired")}
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
            {question && isShowCommentEditor ? (
              <div className="pl-5">
                <div className="pl-5">
                  <div className="media">
                    <span className="align-self-center mr-25">
                      <img
                        className="align-self-center cover"
                        src={`data:image/png;base64,${localStorage.getItem(
                          "avatar"
                        )}`}
                        onError={defaultAvartar}
                        alt="avatar"
                        width={65}
                        height={65}
                        style={{ borderRadius: "50%" }}
                      />
                    </span>
                    <div className="media-body text-left">
                      <FormControl
                        placeholder={t("EnterAnswer")}
                        as="textarea"
                        name="comment"
                        onChange={this.handleChange.bind(this)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <Button
                    variant="danger pl-3 pr-3 mr-2"
                    disabled={isRejectLoading ? true : false}
                    onClick={this.rejectComment}
                    style={{ minWidth: 95 }}
                  >
                    {
                      this.state.isRejectLoading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (<>
                        {t("RejectQuestionButtonLabel")}
                      </>)
                    }
                  </Button>{" "}
                  <Button
                    variant="primary pl-4 pr-4"
                    disabled={(comment === "" || isLoading) ? true : false}
                    onClick={() => this.submit(true)}
                    style={{ minWidth: 95 }}
                  >
                    {this.state.isLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <>{t("Answer")}</>
                    )}
                  </Button>{" "}
                </div>
              </div>
            ) : null}
          </Container>
          {question && isShowCommentEditor ? (
            <div className="dannger-note">
              <p>{t("NoteQnABottomPage")}</p>
            </div>
          ) : null}
        </div>
      </>
    ) : (
      <></>
    );
  }
}

export default HOCComponent(withTranslation()(QuestionAndAnswerDetails));
