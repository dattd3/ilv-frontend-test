import React from "react"
import { Modal, Form, Button } from 'react-bootstrap'
import _ from 'lodash'
import { debounce } from 'lodash';
import Select from 'react-select'
import axios from 'axios'
import { withTranslation } from "react-i18next"
import defaultAvartar from '../../components/Common/DefaultAvartar'
import { getRequestConfigurations } from "../../commons/Utils"
import Constants from "../../commons/Constants"

const MyOption = props => {
  const { innerProps, innerRef } = props;
  return (
    <div ref={innerRef} {...innerProps} className="supporter">
      <div className="d-block clearfix">
        <div className="float-left mr-2 w-20">
          <img width="50" height="50" className="avatar" src={`data:image/png;base64,${props.data.avatar}`} onError={defaultAvartar} alt="avatar" />
        </div>
        <div className="float-left text-wrap w-75">
          <div className="title">{props.data.fullname}</div>
          <div className="comment" style={{fontStyle: 'italic'}}>({props.data.userAccount}) {props.data.current_position}</div>
        </div>
      </div>
    </div>
  )
}
class SelectSupporterModal extends React.Component {
  constructor(props) {
    super(props);
    this.onInputChange = debounce(this.getSupporterInfo, 1000);
    this.state = {
      supporterTyping: "",
      users: [],
      supporter: null
    }
  }

  handleSelectChange(name, value) {
    this.setState({ [name]: value })
  }

  onInputChange = value => {
    this.setState({ supporterTyping: value }, () => {
      this.onInputChange(value)
    })
  }

  getSupporterInfo = (value) => {
    if (value !== "") {
      const config = getRequestConfigurations()
      const payload = {
        account: value,
        employee_type: "EMPLOYEE",
        status: Constants.statusUserActiveMulesoft
      }

      axios.post(`${process.env.REACT_APP_REQUEST_URL}user/employee/search`, payload, config)
        .then(res => {
          if (res && res.data && res.data.data) {
            const data = res.data.data
            const users = data.map(res => {
              return {
                label: res.fullname,
                value: res.username,
                fullname: res.fullname,
                avatar: res.avatar,
                employeeLevel: res.rank_title || res.rank,
                pnl: res.pnl,
                departmentToCompare: `${res.division} / ${res.department} / ${res.unit}`,
                userAccount: res.username,
                part: res.part,
                current_position: res.postition_name,
                department: res.division + (res.department ? '/' + res.department : '') + (res.part ? '/' + res.part : '')
              }
            })
            this.setState({ users: users })
          }
        }).catch(error => { })
    }
  }

  render() {
    const customStyles = {
      option: (styles, state) => ({
        ...styles,
        cursor: 'pointer',
      }),
      control: (styles) => ({
        ...styles,
        cursor: 'pointer',
      })
    }
    const { supporter, users } = this.state
    const { t } = this.props

    return (
      <Modal backdrop="static" keyboard={false}
        className='info-modal-common position-apply-modal'
        centered show={this.props.show}
        onHide={this.props.onHide}
      >
        <Modal.Header className='apply-position-modal' closeButton>
          <Modal.Title>{this.props.modalHeader}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="wrap-result text-left">
            <div className="form-group">
              <label className="form-label">{t("FullName")}</label>
              <div className="content input-container ">
                <Select 
                  options={users}
                  value={supporter}
                  styles={customStyles} components={{ Option: MyOption }} 
                  onInputChange={this.onInputChange.bind(this)} name="supporter" 
                  onChange={item => this.handleSelectChange('supporter', item)} 
                  placeholder={t("SearchTextPlaceholder")} key="supporter" />
              </div>
            </div>
            <Form.Group controlId="submitQuestionForm.Title">
              <Form.Label>{t("Title")}</Form.Label>
              <Form.Control type="text" placeholder={supporter ? supporter.current_position : ''} readOnly />
            </Form.Group>
            <Form.Group controlId="submitQuestionForm.Department">
              <Form.Label>{t("DepartmentManage")}</Form.Label>
              <Form.Control type="text" placeholder={supporter ? supporter.department : ''} readOnly />
            </Form.Group>
          </div>
          <div className="clearfix edit-button text-right">
            <Button variant="secondary" className="pr-4 pl-4" onClick={this.props.onCancelClick}>{t("No")}</Button>{' '}
            <Button variant="primary" className="pr-4 pl-4" onClick={() => this.props.onAcceptClick(supporter)}>{t("Yes")}</Button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

export default withTranslation()(SelectSupporterModal)
