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
        }).catch(error => {
        });
    }
    
    render() {
        const { t } = this.props;
        return <>
            <h1 className="h3 text-uppercase text-gray-800">{t("VaccinantionInformation")}</h1>
            <div className="clearfix edit-button">
                <Button variant="primary" size="sm" onClick={() => this.setState({showModelDetail: true})}><i className="fa  fa-plus"></i> {t('AddMore')}</Button>
            </div>
            <div className="table">
                <div className="card border mb-4 mt-2">
                    <table className="table">
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
                                    <td>{v.number}</td>
                                    <td>{v.vaccin?.name }</td>
                                    <td>{moment(v.injectedAt).format('DD/MM/YYYY')}</td>
                                    <td>{v.department?.name}</td>
                                    <td className="">
                                        <OverlayTrigger 
                                            placement="left" 
                                            overlay={
                                                <Tooltip 
                                                    className="recruiting-detail-tooltip" 
                                                    style={{ fontFamily: "Arial, Helvetica, sans-serif", 
                                                    fontSize: 11, whiteSpace: "normal" }}>
                                                    {
                                                        v.vaccinEffects.map(v => {
                                                            return <div className="text-left">{"- " + v.name}</div>
                                                        })
                                                    }
                                                </Tooltip>
                                            }>
                                            <i className="fas fa-info-circle"></i>
                                        </OverlayTrigger>
                                    </td>
                                    <td>
                                        <div class="btn" onClick={() => {
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
            <VaccinationDetail show={this.state.showModelDetail} rowId={this.state.rowId} t={t} onCancelClick={() => this.setState({showModelDetail: false})} />
        </>
    }
}
export default withTranslation()(Vaccination)