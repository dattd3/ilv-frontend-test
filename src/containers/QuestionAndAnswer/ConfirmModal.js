import React, { useEffect, useState } from "react"
import IconSuccess from '../../assets/img/ic-success.svg'
import IconFailed from '../../assets/img/ic-failed.svg'
import { Modal, Image, Form, Button } from 'react-bootstrap'
import Select from 'react-select'
import axios from 'axios';
import _ from 'lodash'

class ConfirmModal extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Modal backdrop="static" keyboard={false}
                className='info-modal-common position-apply-modal'
                centered show={this.props.show}
                onHide={this.props.onHide}
            >
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>{this.props.confirmHeader}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="wrap-result text-left">
                        {this.props.confirmContent}
                    </p>
                    <div className="clearfix edit-button text-right">
                        <Button variant="secondary" className="pr-4 pl-4" onClick={this.props.onCancelClick}>Không</Button>{' '}
                        <Button variant="primary" className="pr-4 pl-4" onClick={this.props.onAcceptClick}>Có</Button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

export default ConfirmModal
