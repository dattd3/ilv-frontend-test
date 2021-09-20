import React from "react";
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
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
        let config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            }
        }
        axios.get(`${process.env.REACT_APP_REQUEST_URL}vaccin/list`, config)
        .then(res => {
            if (res && res.data && res.data.data) {
                this.setState({listData: res.data.data});
            }
            this.setState({loadSuccess: true});
        }).catch(error => {
            this.setState({loadSuccess: true});
        });
    }

    exportExcel(){
        
    }
    
    render() {
        const { t } = this.props;
        return <>
            <h1 className="h3 text-uppercase text-gray-800">{t("VaccinantionInformation")}</h1>
            <div className="clearfix edit-button">
                <Button disabled={!this.state.loadSuccess} variant="info" onClick={() => this.setState({showModelDetail: true})}><i className="fas fa-plus"></i> {t('AddMore')}</Button>
                <Button disabled={!this.state.loadSuccess} variant="primary" className="ml-3" onClick={() => this.exportExcel()}><i className="fas fa-file-excel"></i> Xuất báo cáo</Button>
            </div>
            <div className="table">
                <div className="card border mb-4 mt-2">
                    <table className="table m-0">
                        <thead>
                            <tr>
                                <th>{t('vaccination_injections_mumber')}</th>
                                <th>{t('vaccination_type')}</th>
                                <th>{t('vaccination_time')}</th>
                                <th>{t('vaccination_department')}</th>
                                <th>{t('vaccination_reaction_after')}</th>
                                <th>{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.listData.map(v => {
                                return (<tr className="px-2" key={v.id}>
                                    <td className="align-middle">{v.number}</td>
                                    <td className="align-middle">{v.vaccin?.name }</td>
                                    <td className="align-middle">{moment(v.injectedAt).format('DD/MM/YYYY')}</td>
                                    <td className="align-middle">{v.department?.name}</td>
                                    <td className="align-middle">
                                        <OverlayTrigger 
                                            placement="left" 
                                            overlay={
                                                <Tooltip 
                                                    className="recruiting-detail-tooltip" 
                                                    style={{ fontFamily: "Arial, Helvetica, sans-serif", 
                                                    fontSize: 11, whiteSpace: "normal" }}>
                                                    {
                                                        v.vaccinEffects.map((v,i) => {
                                                            return <div key={i} className="text-left">{"- " + v.name}</div>
                                                        })
                                                    }
                                                </Tooltip>
                                            }>
                                            <i className="fas fa-info-circle px-3 py-2"></i>
                                        </OverlayTrigger>
                                    </td>
                                    <td className="align-middle">
                                        <div className="btn" onClick={() => {
                                            this.setState({showModelDetail: true, rowId: v.id});
                                        }}>
                                            <OverlayTrigger 
                                                placement="left" 
                                                overlay={
                                                    <Tooltip 
                                                        className="recruiting-detail-tooltip" 
                                                        style={{ fontFamily: "Arial, Helvetica, sans-serif", 
                                                        fontSize: 11, whiteSpace: "normal" }}>
                                                        {t('EditQuestion')}
                                                    </Tooltip>
                                                }>
                                                <i className="fas fa-edit text-warning" aria-hidden="true"></i>
                                            </OverlayTrigger>
                                        </div>
                                    </td>
                                </tr>)
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {this.state.loadSuccess && <VaccinationDetail show={this.state.showModelDetail} rowId={this.state.rowId} t={t} number={this.state.listData.length} onCancelClick={() => this.setState({showModelDetail: false})} />}
        </>
    }
}
export default withTranslation()(Vaccination)