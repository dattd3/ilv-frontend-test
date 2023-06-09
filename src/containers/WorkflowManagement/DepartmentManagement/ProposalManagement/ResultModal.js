import React from 'react';
import { Modal, Image } from 'react-bootstrap';

import IconFailed from '../../../../assets/img/ic-failed.svg';
import IconSuccess from '../../../../assets/img/ic-success.svg';

class ResultModal extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    const { show, onHide, title, message, isSuccess } = this.props;

    return (
      <Modal
        className="info-modal-common position-apply-modal"
        centered
        show={show}
        onHide={onHide}
      >
        <Modal.Header className="apply-position-modal" closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="wrap-result">
            <p className="text-center">{message}</p>
            <Image
              src={isSuccess ? IconSuccess : IconFailed}
              alt="Success"
              className="ic-status"
            />
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default ResultModal;
