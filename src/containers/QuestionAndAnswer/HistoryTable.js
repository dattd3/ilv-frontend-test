import React, { useState } from "react";
import { Modal, Image, Form, Button } from 'react-bootstrap'

class HistoryTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowConfirmModal: false,
      questionSelectedID: 0
    }
  }

  generateStatus(questionStatus) {
    switch (questionStatus) {
      case 2:
        return <span className="align-self-center question-status inprogress">Đã giải đáp</span>
      case 1:
        return <span className="align-self-center question-status cancelled">Đang chờ xử lý</span>
      case 3:
        return <span className="align-self-center question-status overdue">Quá hạn</span>;
      default:
        return <span className="course-status undefined">Undefined</span>;
    }
  }
  showConfirmModal(selectedId) {
    this.props.showConfirms(true,selectedId);
  }
  showEditModal(question){
    this.props.showEditModal(question);
  }
  render() {
    return <div className="wrap-result text-left">
      {this.props.questions.map((question, index) => {
        return <div key={index}>
          <div className="media">
            <span className="img-circle align-self-center">
              <i className="icon icon-qa-unselected align-self-center"></i>
            </span>
            <div className="media-body row">
              <div className="col-sm-12 col-lg-8">
                <h5 className="mt-1"><a href={`/question-and-answer-details/` + question.id}>{question.content}</a></h5>
                <span>
                  <i className="icon-hr mr-1"></i> {question.fullName}
                  <i className="fa fa-clock-o mr-1 ml-3"></i>{question.createdAt}
                </span>
              </div>

              <div className="col-sm-12 col-lg-4 pull-right content-center">
                <div className="col-7 content-center">
                  {this.generateStatus(question.ticketStatusId)}
                </div>
                <div className=" col-5 content-center text-left">
                  {
                    (question && question.ticketStatusId === 1 && question.userId === localStorage.getItem('email')) ?
                      <>
                        <Button variant="outline-light content-center p-0 ml-3 border-0" onClick={() => this.showEditModal(question)} >
                          <i className="icon icon-qa-edit align-self-center"></i>
                        </Button>
                        <Button variant="outline-light content-center p-0 pt-0 ml-3 border-0" onClick={() => this.showConfirmModal(question.id)}>
                          <i className="icon icon-qa-undo align-self-center"></i>
                        </Button>
                      </>
                      : null
                  }
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>
      })}
    </div>
  }
}

export default HistoryTable
