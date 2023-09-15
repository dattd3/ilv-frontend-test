import React, { Fragment } from "react";
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import { urlify } from "utils/string"
import purify from "dompurify"

class CommonQuestionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
  }
  setOpen()
  {
    let open = this.state.open
    this.setState({open: !open})
  }
  render() {
    const { open } = this.state;
    return <>
      {
        this.props.questions?.every(question => question.subject && question.answer) &&  <Accordion defaultActiveKey="0">
        <Accordion.Toggle as={Card.Header} eventKey="0" onClick= {() => this.setOpen()}>
          <h4 className="text-uppercase common-category cursor-pointer">
            {
              open ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-up"></i>
            }
             {" "+this.props.categoryName}</h4>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            {
              this.props.questions && this.props.questions.length > 0 ?
                this.props.questions.map((question, index) => {
                  return <Fragment key={index}>
                    {
                      question.subject && question.answer && <Container fluid className="info-tab-content pl-3 pr-3">
                        <div className="mb-1 multiline">
                          <span className="icon-Icon-Question mr-1"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                          <span>
                            <b>{question.subject}</b>
                          </span>
                        </div>
                        <div className="pl-4 pr-4 multiline">
                          <div className="media">
                            <span className="lg icon-Icon-Answer mr-1 pt-2"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
                            <div className="media-body">
                              <span 
                                className="font-italic" 
                                dangerouslySetInnerHTML={{__html: purify.sanitize(urlify(question?.answer))}} 
                              />
                            </div>
                          </div>
                        </div>
                      </Container>
                    }
                  </Fragment>
                })
                : null
            }
          </Card.Body>
        </Accordion.Collapse>
      </Accordion>
      }
    </>
  }
}

export default CommonQuestionComponent
