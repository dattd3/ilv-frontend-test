import React from "react";
import { Button, Popover, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import Constants from "../../../commons/Constants";
import { withTranslation } from 'react-i18next';
import VaccinationDetail from "./Detail";
import moment from 'moment';
import axios from 'axios';
import _ from "lodash";
import { getRequestConfigurations } from "../../../commons/Utils"

class Vaccination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            showModelDetail: false,
            rowId: null,
            loadSuccess: false,
            editLastRow: false
        };
    }

    componentDidMount() {
        const { t } = this.props;
        const config = getRequestConfigurations()

        axios.get(`${process.env.REACT_APP_REQUEST_URL}vaccin/list?culture=${t('langCode')}`, config)
        .then(res => {
            if (res && res.data && res.data.data) {
                this.setState({listData: res.data.data});
                const lastItem = this.state.listData[this.state.listData.length - 1];
                if(lastItem?.statusId == 2){
                    this.setState({
                        rowId: lastItem?.id,
                        editLastRow: true
                    });
                }
            }
            this.setState({loadSuccess: true});
        }).catch(error => {
            this.setState({loadSuccess: true});
        });
    }
    
    render() {
        const { t } = this.props;
        const { listData } = this.state
        const lastItem = listData && listData?.length > 0 ? listData[listData.length - 1] : {}

        return <>
            <div className="row vaccine-info-page">
                <div className="w-100">
                    <h1 className="content-page-header">{t("VaccinantionInformation")}</h1>
                </div>
                <div className="clearfix edit-button w-100 pt-3 pb-4">
                    <div className="btn bg-white btn-create" 
                    onClick={() => this.setState({showModelDetail: true})}><i className="fas fa-plus"></i> {t('vaccination_btn_declare')}</div>
                    {/* <Button disabled={!this.state.loadSuccess} variant="info" ></Button> */}
                    {/* <Button disabled={!this.state.loadSuccess} variant="primary" className="ml-3" onClick={() => this.exportExcel()}><i className="fas fa-file-excel"></i> Xuất báo cáo</Button> */}
                </div>
                <div className="card mb-4 px-3" style={{
                    borderRadius: "10px",
                    border: "none"
                }}>
                    <div className="table">
                        <table className="table m-0 text-dark">
                            <thead>
                                <tr>
                                    <th className="border-0 no">{t('vaccination_injections_mumber')}</th>
                                    <th className="border-0 injected-status">{t('VaccinationStatus')}</th>
                                    <th className="border-0 vaccination-type">{t('vaccination_type')}</th>
                                    <th className="border-0 text-center injected-at">{t('vaccination_time')}</th>
                                    <th className="border-0 injected-unit">{t('vaccination_department')}</th>
                                    <th className="border-0 vaccination-reaction-after">{t('vaccination_reaction_after')}</th>
                                    <th className="border-0 reason">{t('vaccination_reason')}</th>
                                    <th className="border-0 detail">{t('detail')}</th>
                                    <th className="border-0 action">{t('action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.listData.map(v => {
                                    return (<tr className="px-2" key={v.id}>
                                        <td className="align-middle no">{v.number}</td>
                                        <td className="align-middle injected-status">{v.vaccinStatus?.name}</td>
                                        <td className="align-middle vaccination-type">{v.vaccin?.name }</td>
                                        <td className="align-middle text-center injected-at">{moment(v.injectedAt).format('DD/MM/YYYY')}</td>
                                        <td className="align-middle injected-unit">{
                                            (v.department !== null ? (
                                                v.department['id'] == 1 ? v.branch?.name : v.department['id'] == 2 ? (v.ward + " - " + v.district + " - " + v.city ) : v.address
                                            ) : undefined)
                                        }</td>
                                        <td className="align-middle vaccination-reaction-after">
                                            {
                                                (function(){
                                                    const e = v.vaccinEffects.filter(e => e.status == 1);
                                                    if(e.length){
                                                        return <div className={e.length > 2 ? "d-flex align-items-bottom" : ""}>
                                                            {/* {
                                                                e.splice(0, e.length > 2 ? 1 : 2).map((a, index) => {
                                                                    return <div key={index}>{a.name}</div> 
                                                                })
                                                            } */}
                                                            {/* {e.length > 2 ?  */}
                                                            <div>
                                                                <OverlayTrigger 
                                                                    // trigger="focus"
                                                                    placement="bottom"
                                                                    overlay={
                                                                        <Popover id="popover-basic-gsh">
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
                                                                    }>
                                                                    <div className="" style={{cursor:"pointer"}}>
                                                                        {e[0].name}
                                                                        {
                                                                            e.length >= 2 ? ',...' : null
                                                                        }
                                                                    </div>
                                                                </OverlayTrigger>
                                                            </div> 
                                                            {/* :  undefined} */}
                                                        </div>
                                                    }
                                                }())
                                            }
                                        </td>
                                        <td className="reason">
                                            <OverlayTrigger 
                                                placement="bottom"
                                                overlay={
                                                    <Popover id={`popover-basic-gsh-${v.id}-reason`}>
                                                        <Popover.Content>{v.vaccinReasonReject?.name || ""}</Popover.Content>
                                                    </Popover>
                                                }>
                                                <div className="content-reason">{v.vaccinReasonReject?.name || ""}</div>
                                            </OverlayTrigger>
                                        </td>
                                        <td className="detail">
                                            <OverlayTrigger 
                                                placement="bottom"
                                                overlay={
                                                    <Popover id={`popover-basic-gsh-${v.id}-detail`}>
                                                        <Popover.Content>{v.reasonDetail || ""}</Popover.Content>
                                                    </Popover>
                                                }>
                                                <div className="content-detail">{v.reasonDetail || ""}</div>
                                            </OverlayTrigger>
                                        </td>
                                        <td className="align-middle action">
                                            <div onClick={() => {
                                                this.setState({showModelDetail: true, rowId: v.id, editLastRow: false});
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
                {this.state.loadSuccess && this.state.showModelDetail && 
                <VaccinationDetail show={this.state.showModelDetail} 
                    rowId={this.state.rowId} 
                    t={t} 
                    number={lastItem?.number} 
                    onCancelClick={() => {
                        const j = {showModelDetail: false};
                        if(!this.state.editLastRow){
                            j['rowId'] = null
                        }
                        this.setState(j);
                    }} 
                    editLastRow={this.state.editLastRow}
                    lastTime={lastItem?.injectedAt}
                    listData={this.state.listData}
                />}
            </div>
        </>
    }
}
export default withTranslation()(Vaccination)