import React, { useState } from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import moment from "moment";
import deleteButton from '../../assets/img/icon-delete.svg'
import { withTranslation } from "react-i18next";
class HistoryTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowConfirmModal: false,
      questionSelectedID: 0,
    };
  }

  generateStatus(questionStatus) {
    switch (questionStatus) {
      case 2:
        return (
          <span className="align-self-center question-status inprogress">
            {this.props.t("Replied")}
          </span>
        );
      case 1:
        return (
          <span className="align-self-center question-status cancelled">
            {this.props.t("Processing")}
          </span>
        );
      case 3:
        return (
          <span className="align-self-center question-status overdue">
            Quá hạn
          </span>
        );
      default:
        return <span className="course-status undefined">Undefined</span>;
    }
  }
  showConfirmModal(selectedId) {
    this.props.showConfirms(true, selectedId);
  }

  showEditModal(question) {
    this.props.showEditModal(question);
  }
  
  render() {
    const { t } = this.props;
    return (
      <div className="wrap-result text-left">
        {this.props.questions && this.props.questions.length > 0 ? (
          this.props.questions.map((question, index) => {
            return (
              <div key={index}>
                <div className="media">
                  <span className="img-circle align-self-center">
                    <i className="icon icon-qa-unselected align-self-center"></i>
                  </span>
                  <div className="media-body row">
                    <div className="col-sm-12 col-lg-8">
                      <h6 className="mt-1">
                        <a href={`/question-and-answer-details/` + question.id}>
                          {question.content}
                        </a>
                      </h6>
                      <span>
                        <i className="icon-hr mr-1"></i> {question.fullName}
                        <i className="fa fa-clock-o mr-1 ml-3"></i>
                        {moment(question.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                      </span>
                    </div>

                    <div className="col-sm-12 col-lg-4 pull-right content-center">
                      <div className="col-7 content-center">
                        {this.generateStatus(question.ticketStatusId)}
                      </div>
                      <div className=" col-5 content-center text-left">
                        {question &&
                        question.ticketStatusId === 1 &&
                        question.userId === localStorage.getItem("email") ? (
                          <>
                            <OverlayTrigger
                              key={`edit-tooltip-${index}`}
                              placement="bottom"
                              overlay={
                                <Tooltip id={`edit-tooltip-${index}`}>
                                  {t("EditQuestion")}
                                </Tooltip>
                              }
                            >
                              <Button
                                variant="outline-light content-center p-0 ml-3 border-0"
                                onClick={() => this.showEditModal(question)}
                              >
                                <i className="icon icon-qa-edit align-self-center"></i>
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger
                              key={`recall-tooltip-${index}`}
                              placement="bottom"
                              overlay={
                                <Tooltip id={`recall-tooltip-${index}`}>
                                  {t("delete")}
                                </Tooltip>
                              }
                            >
                              <Button
                                variant="outline-light content-center p-0 pt-0 ml-3 border-0"
                                onClick={() =>
                                  this.showConfirmModal(question.id)
                                }
                              >
                                <img alt={t('delete')} src={deleteButton} className="align-self-center"/>
                              </Button>
                            </OverlayTrigger>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
              </div>
            );
          })
        ) : (
          <div className="text-center mt-5">
            <p>{t("NoDataFound")}!</p>
          </div>
        )}
      </div>
    );
  }
}

export default withTranslation()(HistoryTable);
