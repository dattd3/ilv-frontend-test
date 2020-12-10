import React, { useState } from "react";
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';

class CommonQuestionComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <>
      {
      this.props.questions && this.props.questions.length > 0 ?
      this.props.questions.map((question, index) => {
        return <div key={index}>
          <Container fluid className="info-tab-content shadow pl-3 pr-3 mb-2">
            <div className="mb-1">
              <span className="icon-Icon-Question mr-1"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
              <span><b>{question.subject}</b></span>
            </div>
            <div className="pl-4 pr-4">
              <span className="lg icon-Icon-Answer mr-1"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
              <span className="font-italic">{question.answer}</span>
            </div>
          </Container>
        </div>
      })
    : null
    }
    </>
  }
}

export default CommonQuestionComponent
