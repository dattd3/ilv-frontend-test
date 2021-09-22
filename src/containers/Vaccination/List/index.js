import React from "react";
import { Button, Popover, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import Constants from "../../../commons/Constants";
import { withTranslation } from 'react-i18next';
import VaccinationDetail from "./Detail";
import moment from 'moment';
import axios from 'axios';
import _ from "lodash";

class Vaccination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            showModelDetail: false,
            rowId: null,
            loadSuccess: false
        };
    }

    componentDidMount() {
        const { t } = this.props;
        let config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            }
        }
        axios.get(`${process.env.REACT_APP_REQUEST_URL}vaccin/list?lang=${t('langCode')}`, config)
        .then(res => {
            if (res && res.data && res.data.data) {
                this.setState({listData: res.data.data});
            }
            this.setState({loadSuccess: true});
        }).catch(error => {
            this.setState({loadSuccess: true});
        });
    }
    
    render() {
        const { t } = this.props;
        return <>
            <div className="row">
                <div className="w-100">
                    <h1 className="h3 m-0 text-dark text-uppercase text-gray-800">{t("VaccinantionInformation")}</h1>
                </div>
                <div className="clearfix edit-button w-100 pt-3 pb-4">
                    <div className="btn bg-white" style={
                        {
                            borderRadius: "10px",
                            border: "1px solid #347EF9",
                            color: "#347EF9"
                        }
                    } onClick={() => this.setState({showModelDetail: true})}><i className="fas fa-plus"></i> {t('AddMore')}</div>
                    {/* <Button disabled={!this.state.loadSuccess} variant="info" ></Button> */}
                    {/* <Button disabled={!this.state.loadSuccess} variant="primary" className="ml-3" onClick={() => this.exportExcel()}><i className="fas fa-file-excel"></i> Xuất báo cáo</Button> */}
                </div>
                <div className="table">
                    <div className="card mb-4 px-3" style={{
                        borderRadius: "10px",
                        border: "none"
                    }}>
                        <table className="table m-0 text-dark">
                            <thead>
                                <tr>
                                    <th className="border-0">{t('vaccination_injections_mumber')}</th>
                                    <th className="border-0">{t('vaccination_type')}</th>
                                    <th className="border-0">{t('vaccination_time')}</th>
                                    <th className="border-0">{t('vaccination_department')}</th>
                                    <th className="border-0">{t('vaccination_reaction_after')}</th>
                                    <th className="border-0">{t('action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.listData.map(v => {
                                    return (<tr className="px-2" key={v.id}>
                                        <td className="align-middle">{v.number}</td>
                                        <td className="align-middle">{v.vaccin?.name }</td>
                                        <td className="align-middle">{moment(v.injectedAt).format('DD/MM/YYYY')}</td>
                                        <td className="align-middle">{
                                            (v.department !== null ? (
                                                v.department['id'] == 1 ? v.branch.name : v.department['id'] == 2 ? (v.city + " - " + v.district + " - " + v.ward ) : v.address
                                            ) : undefined)
                                        }</td>
                                        <td className="align-middle">
                                            {
                                                (function(){
                                                    const e = v.vaccinEffects.filter(e => e.status == 1);
                                                    if(e.length){
                                                        return <div className={e.length > 2 ? "d-flex align-items-bottom" : ""}>
                                                            {
                                                                e.splice(0, e.length > 2 ? 1 : 2).map((a, index) => {
                                                                    return <div key={index}>{a.name}</div> 
                                                                })
                                                            }
                                                            {e.length > 2 ? <div>
                                                                <OverlayTrigger 
                                                                    placement="bottom"
                                                                    overlay={
                                                                        <Popover id="popover-basic">
                                                                            <Popover.Content>
                                                                            {
                                                                                e.map((v,i) => {
                                                                                    if(v.status == 1){
                                                                                        return <div key={i} className="text-left">{"- " + v.name}</div>
                                                                                    }
                                                                                })
                                                                            }
                                                                            </Popover.Content>
                                                                        </Popover>

                                                                        // <Tooltip 
                                                                        //     className="recruiting-detail-tooltip tooltip-white"
                                                                        //     style={{ fontFamily: "Arial, Helvetica, sans-serif", 
                                                                        //     fontSize: 11, whiteSpace: "normal" }}>
                                                                        //     {
                                                                        //         e.map((v,i) => {
                                                                        //             if(v.status == 1){
                                                                        //                 return <div key={i} className="text-left">{"- " + v.name}</div>
                                                                        //             }
                                                                        //         })
                                                                        //     }
                                                                        // </Tooltip>
                                                                    }>
                                                                    <div className="" style={{cursor:"pointer"}}>
                                                                        ...
                                                                    </div>
                                                                </OverlayTrigger>
                                                            </div> :  undefined}
                                                        </div>
                                                    }
                                                }())
                                            }
                                        </td>
                                        <td className="align-middle">
                                            <div className="" onClick={() => {
                                                this.setState({showModelDetail: true, rowId: v.id});
                                            }}>
                                                <OverlayTrigger 
                                                    placement="left" 
                                                    overlay={
                                                        <Popover id="popover-basic">
                                                            <Popover.Content>
                                                            {
                                                               t('EditQuestion')
                                                            }
                                                            </Popover.Content>
                                                        </Popover>
                                                        // <Tooltip 
                                                        //     className="recruiting-detail-tooltip" 
                                                        //     style={{ fontFamily: "Arial, Helvetica, sans-serif", 
                                                        //     fontSize: 11, whiteSpace: "normal" }}>
                                                        //     {t('EditQuestion')}
                                                        // </Tooltip>
                                                    }>
                                                    <i className="fas fa-edit text-warning" style={{cursor:"pointer"}} aria-hidden="true"></i>
                                                </OverlayTrigger>
                                            </div>
                                        </td>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {this.state.loadSuccess && this.state.showModelDetail && <VaccinationDetail show={this.state.showModelDetail} rowId={this.state.rowId} t={t} number={this.state.listData.length} onCancelClick={() => this.setState({showModelDetail: false, rowId: null})} />}
            </div>
        </>
    }
}
export default withTranslation()(Vaccination)