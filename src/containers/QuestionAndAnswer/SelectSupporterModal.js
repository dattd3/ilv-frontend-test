import React, { useEffect, useState } from "react"
import { Modal, Image, Form, Button } from 'react-bootstrap'
import _ from 'lodash'
import { debounce } from 'lodash';
import Select from 'react-select'
import axios from 'axios'
import defaultAvartar from '../../components/Common/DefaultAvartar'

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
          <div className="comment"><i>({props.data.userAccount}) {props.data.current_position}</i></div>
        </div>
      </div>
    </div>
  )
}
class SelectSupporterModal extends React.Component {
  constructor(props) {
    super(props);
    this.onInputChange = debounce(this.getsupporterInfo, 1000);
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

  getsupporterInfo = (value) => {
    if (value !== "") {
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
          'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
        }
      }

      axios.post(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/search/info`, { account: value, should_check_superviser: false }, config)
        .then(res => {
          if (res && res.data && res.data.data) {
            const data = res.data.data
            const users = data.map(res => {
              return {
                label: res.fullname,
                value: res.user_account,
                fullname: res.fullname,
                avatar: res.avatar,
                employeeLevel: res.employee_level,
                pnl: res.pnl,
                departmentToCompare: `${res.division} / ${res.department} / ${res.unit}`,
                userAccount: res.user_account,
                part: res.part,
                current_position: res.title,
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
              <label className="form-label">Họ và tên</label>
              <div className="content input-container ">
                <Select styles={customStyles} components={{ Option: MyOption }} onInputChange={this.onInputChange.bind(this)} name="supporter" onChange={supporter => this.handleSelectChange('supporter', supporter)} value={this.state.supporter} placeholder="Lựa chọn" key="supporter" options={this.state.users} />
              </div>
            </div>
            <Form.Group controlId="submitQuestionForm.Title">
              <Form.Label>Chức danh</Form.Label>
              <Form.Control type="text" placeholder={this.state.supporter ? this.state.supporter.current_position : ''} readOnly />
            </Form.Group>
            <Form.Group controlId="submitQuestionForm.Department">
              <Form.Label>Khối/ Phòng/ Bộ phận</Form.Label>
              <Form.Control type="text" placeholder={this.state.supporter ? this.state.supporter.department : ''} readOnly />
            </Form.Group>
          </div>
          <div className="clearfix edit-button text-right">
            <Button variant="secondary" className="pr-4 pl-4" onClick={this.props.onCancelClick}>Không</Button>{' '}
            <Button variant="primary" className="pr-4 pl-4" onClick={() => this.props.onAcceptClick(this.state.supporter)}>Có</Button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

export default SelectSupporterModal
