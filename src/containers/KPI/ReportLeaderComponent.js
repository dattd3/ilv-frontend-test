import React from 'react';
import { withTranslation } from "react-i18next"

class ReportLeaderComponent extends React.Component {

    constructor(props) {    
        super(props);
    }

    render() {
        const {t} = this.props;     
        if (this.props.kpiInfo == null || this.props.kpiInfo.Score == null) {
            return (<div className="nodata-kpi" style={{'border': '1px solid ' + this.props.Color}}>{t("NoData")}</div>)
        } else {       
            return (
                <div className="row mb-4">
                    {/*HIỂN THỊ KẾT QUẢ ĐÁNH GIÁ THEO QUÝ*/}
                    <div className="col-8 panel" style={{'paddingLeft':'0px'}}>                                                      
                        <div className="card shadow" style={{'border': '1px solid '+ this.props.Color }}>        
                            <div style={{'backgroundColor': this.props.Color}} className="text-white p-3 h6 text-uppercase text-center">Quý {this.props.Quarter} năm {this.props.Period}</div>                      
                            <div className="card-body">          
                                <table className="table table-bordered" >
                                    <tbody>         
                                        <tr>                
                                            <td className="text-left text-primary item-row"><strong>{t("NumberOrder")}</strong></td>
                                            <td className="text-left text-primary item-row"><strong>{t("EvaluationItems")}</strong></td>
                                            <td className="text-center text-primary item-row"><strong>{t("SelfEvaluation")}</strong></td>
                                            <td className="text-center text-primary item-row"><strong>{t("LineManagerSEvaluation")}</strong></td>              
                                        </tr> 
                                        <tr>
                                            <td className="item-row">01</td>   
                                            <td className="text-left item-row">{t("SpiritualAttitude")}</td>
                                            <td className="item-row"> {this.props.kpiInfo.TTTDself} </td>
                                            <td className="item-row"> {this.props.kpiInfo.TTTDmanager} </td>
                                        </tr>
                                        <tr>
                                            <td className="item-row">02</td>   
                                            <td className="text-left item-row">Năng lực lãnh đạo</td>
                                            <td className="item-row">{this.props.kpiInfo.NLLDself}</td>
                                            <td className="item-row">{this.props.kpiInfo.NLLDmanager}</td>
                                        </tr>
                                        <tr>
                                            <td className="item-row">03</td>   
                                            <td className="item-row text-left">Năng lực chuyên môn</td>
                                            <td className="item-row">{this.props.kpiInfo.NLCMself}</td>
                                            <td className="item-row">{this.props.kpiInfo.NLCMmanager}</td>
                                        </tr> 
                                        <tr>
                                            <td className="item-row">04</td>   
                                            <td className="item-row text-left">{t("JobPerformance")}</td>
                                            <td className="item-row">{this.props.kpiInfo.NDCVself}</td>
                                            <td className="item-row">{this.props.kpiInfo.NDCVmanager}</td>
                                        </tr>
                                        <tr>                
                                            <td className="item-row"><strong>05</strong></td>
                                            <td className="item-row text-left"><strong>{t("OverallScore")}</strong></td>
                                            <td className="item-row"><strong>{this.props.kpiInfo.SelfOverAll}</strong></td>
                                            <td className="item-row"><strong>{this.props.kpiInfo.Score}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                
                    <div className="col-4 panel" style={{'paddingRight':'0px'}}>                    
                        {/* ĐÁNH GIÁ & PHÊ DUYỆT */}
                        <div className="card shadow" style={{'height':'100%','border': '1px solid '+ this.props.Color}}> 
                            <div style={{'backgroundColor': this.props.Color}} className="text-white p-3 h6 text-uppercase text-center">{t("EvaluationAndApproval")}</div> 
                            <div className="card-body" style={{'padding':'0px'}}>
                                <br/>
                                <div className="text-center" style={{'color':'#FF0000'}}>{t("FinalScore")}</div>   
                                <br/>                         
                                <div className="text-center font-weight-bold" style={{'color':'#FF0000','fontSize':'60px'}}>{this.props.kpiInfo.Score}</div>                            
                            </div>

                            {/*<div className="card-body" style={{'padding':'0px'}}>                                  
                                <hr className="hr-remove-margin"></hr>
                                <div className="text-center">CBQL đánh giá:</div>
                                <div className="text-center text-primary text-weight-bold" style={{'color':'#FF0000'}}>{this.props.kpiInfo.ManagerAtFormComplete}</div>
                                <hr className="hr-remove-margin"></hr>
                            </div>
                            <div className="card-body" style={{'padding':'0px'}}>
                                <div className="text-center">CBLĐ phê duyệt:</div>
                                <div className="text-center text-primary text-weight-bold" style={{'color':'#FF0000'}}>{this.props.kpiInfo.MatrixFullName}</div>
                            </div>  
                                */}
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default withTranslation()(ReportLeaderComponent);
