import React from "react";
import { Button, Modal } from "react-bootstrap";
import { withTranslation } from "react-i18next";
import purify from "dompurify"

class NoteModal extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    const { t } = this.props;
    return (
      <Modal
        className="text-dark"
        centered
        show={this.props.show}
        onHide={this.props.onHide}
      >
        <Modal.Body className="rounded position-relative ot-info-modal-body">
          <div className="text-center font-weight-bold pb-2">
            <div className="text-center">
              <span className="icon-box-note position-absolute">
                <i className="fas fa-info"></i>
              </span>
            </div>
            {t("Note")}
          </div>
          <p style={{ marginBottom: 10 }}>* {t("NotePrevDayOT")}</p>
          <p
            dangerouslySetInnerHTML={{
              __html: purify.sanitize(t("NotePrevDayOT2") || ""),
            }}
          />
          <div className="text-center">
            <Button className="btn-primary" onClick={this.props.onHide}>
              {t("OK")}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default withTranslation()(NoteModal);
