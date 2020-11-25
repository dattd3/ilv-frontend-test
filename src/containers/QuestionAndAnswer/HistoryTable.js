import React, { useState } from "react";
import { Modal, Image, Form, Button } from 'react-bootstrap'

class HistoryTable extends React.Component {
  generateStatus(questionStatus)
    {
        switch(questionStatus) {
          case 'Assigned':
            return <span className="align-self-center question-status inprogress">Đã giải đáp</span>
          case 'Cancelled':
            return <span className="align-self-center question-status cancelled">Đang chờ xử lý</span>
          case 'Overdue':
            return <span className="align-self-center question-status overdue">Quá hạn</span>;
          default:
            return <span className="course-status undefined">Undefined</span>;
          }
    }

  render() {
    return <div className="wrap-result text-left">
              {this.props.questions.map((question, index) => {
                 return <div key={index}>
                        <div className="media">
                         <span className ="img-circle align-self-center">
                            <i className="icon icon-qa-unselected align-self-center"></i>
                          </span>
                          <div className="media-body row">
                              <div className  = "col-sm-12 col-lg-8">
                                <h5 className="mt-1"><a href ={`/question-and-answer-details/1`}>Media heading</a></h5>
                                <span> 
                                <i className="icon-hr mr-1"></i>Phòng Nhân sự
                                <i className="fa fa-clock-o mr-1 ml-3"></i>5 giờ trước
                                </span>
                              </div>
                              
                              <div className ="col-sm-12 col-lg-4 pull-right content-center">
                                {this.generateStatus(question.status)}  
                                  <Button variant="outline-light content-center p-0 ml-3">
                                      <i className="icon icon-qa-edit align-self-center"></i>
                                  </Button>
                                  <Button variant="outline-light content-center">
                                      <i className="icon icon-qa-undo align-self-center"></i>
                                  </Button>
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
