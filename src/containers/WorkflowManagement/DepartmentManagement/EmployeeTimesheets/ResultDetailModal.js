import React from "react";
import IconSuccess from '../../../../assets/img/ic-success.svg';
import IconFailed from '../../../../assets/img/ic-failed.svg';
import { Modal, Image } from 'react-bootstrap';
import { withTranslation  } from "react-i18next"

class ResultDetailModal extends React.Component {
    constructor(props) {
        super();
    }

    render () {
        const {t, resultDetail} = this.props
        let total = 0;
        let sucessReqs = 0;

        resultDetail.forEach(element => {
            total += element?.sub.length;
            if(element?.sub.length){
                element.sub.forEach(child=>{
                    if(child.status == "S"){
                        sucessReqs += 1;
                    }
                })
            }
        });

        return (
            <Modal className='info-modal-common position-apply-modal' size="lg" centered show={this.props.show} onHide={this.props.onHide} >
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{padding: '1rem'}}>
                    {
                        resultDetail.length > 0 ?
                        <>
                            <div>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th style={{width: '15%'}}>{t("RequestNo")}</th>
                                            <th style={{width: '25%'}}>{t("EmployeeInfo")}</th>
                                            <th className="text-center" style={{width: '20%'}}>{t("Status")}</th>
                                            <th style={{width: '40%'}}>{t("Reason")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            resultDetail.map(req =>{
                                                return (
                                                    req.sub.map((child, index) => {
                                                        return (
                                                            <tr key={index} style={{fontSize: 14}}>
                                                                <td className="text-center" style={{width: '15%'}}>{child.id}</td>
                                                                <td style={{width: '25%'}}>{child.fullName}<br/>({child.ad})</td>
                                                                <td className="text-center" style={{width: '20%'}}>{child.status == "S" ? <i className="fas fa-check text-success"></i> : <i className="fas fa-times text-danger"></i>}</td>
                                                                <td style={{width: '40%'}}>{child.status == "E" ? child.message : ""}</td>
                                                            </tr>
                                                        )
                                                    })
                                                )
                                            })
                                        }   
                                    </tbody>
                                </table>
                            </div>
                            <p><span className="text-success" style={{margin: '15px 0 0 0'}}>{t("Successful")}: </span><strong>{sucessReqs}/{total}</strong></p>
                        </>
                        : 
                        <div className="wrap-result">
                            <p dangerouslySetInnerHTML={{ __html: "Đã có lỗi xảy ra" }}></p>
                            <Image src={IconFailed} alt="failed" className="ic-status" />
                        </div>
                    }
                </Modal.Body>
            </Modal>
        )
    }
}

export default withTranslation()(ResultDetailModal)
