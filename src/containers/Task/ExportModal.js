import React from 'react'
import { Modal } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios'
import Constants from '../../commons/Constants'
import map from "../map.config"

class ExportModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
          data: {},
          startDate: new Date()
        }
    }
  
    componentDidMount() {
      let config = {
        headers: {
          'Authorization': localStorage.getItem('accessToken')
        },
        params:{
          id: this.props.taskId,
          subid: this.props.subId
        }
      }
      if(this.props.taskId)
      {
        axios.get(`${process.env.REACT_APP_REQUEST_URL}request/detail`, config)
        .then(res => {
          if (res && res.data) {
            const data = res.data
            if (data.result && data.result.code == Constants.API_ERROR_NOT_FOUND_CODE) {
              return window.location.href = map.NotFound;
            }
            const response = data.data
            this.setState({data: response })
            console.log(this.state.data);
          }
        }).catch(error => {
          console.log(error)
        });
      }
    }
   
    render() {
        const { t } = this.props
        return (
            <Modal backdrop="static" keyboard={false}
                size="xl"
                className='info-modal-common position-apply-modal'
                centered show={this.props.show}
                onHide={this.props.onHide}
            >
                <Modal.Header className="apply-position-modal bg-approved" closeButton>
                    <Modal.Title>Tải về</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DatePicker selectsStart autoComplete="off"  /> 
                </Modal.Body>
                </Modal>
        )
    }
}

export default ExportModal
