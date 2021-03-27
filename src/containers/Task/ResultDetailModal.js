import React from "react";
import IconSuccess from '../../assets/img/ic-success.svg';
import IconFailed from '../../assets/img/ic-failed.svg';
import { Modal, Image } from 'react-bootstrap';
import { withTranslation  } from "react-i18next"

class ResultDetailModal extends React.Component {
    constructor(props) {
        super();
    }

    render () {
        const {t} = this.props
        const resultDetail = this.props.resultDetail;
        let total = 0;
        let sucessReqs = 0;

        resultDetail.forEach(element => {
            total += element.sub.length;
            element.sub.forEach(child=>{
                if(child.status == "S"){
                    sucessReqs += 1;
                }
            })
        });

        return (
            <>
            <Modal className='info-modal-common position-apply-modal' size="lg" centered show={this.props.show} onHide={this.props.onHide} >
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <p dangerouslySetInnerHTML={{ __html: this.props.message }}></p> */}
                    {/* <div className="wrap-result">
                        {this.props.isSuccess ? <Image src={IconSuccess} alt="Success" className="ic-status" /> : <Image src={IconFailed} alt="Success" className="ic-status" />}
                    </div> */}
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th scope="col">{t("RequestNo")}</th>
                                <th scope="col">{t("Status")}</th>
                                <th scope="col">{t("Reason")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                resultDetail.map(req =>{
                                    return (
                                        req.sub.map((child,index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{req.id+"."+child.id}</td>
                                                    <td>{child.status == "S" ? <i className="fas fa-check text-success"></i> : <i className="fas fa-times text-danger"></i>}</td>
                                                    <td>{child.status == "E" ? child.message : ""}</td>
                                                </tr>
                                            )
                                        })
                                    )
                                })
                            }   
                        </tbody>
                    </table>
                    <p><span className="text-success">{t("Successful")}:</span><strong>{sucessReqs}/{total}</strong></p>
                </Modal.Body>
            </Modal>
            </>
        )
    }
}

export default withTranslation()(ResultDetailModal)
