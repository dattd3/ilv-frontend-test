import React from "react"
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import Constants from "../../../commons/Constants"
import Select from 'react-select'
import moment from 'moment'
import StatusModal from '../../../components/Common/StatusModal'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import axios from 'axios'
import _ from "lodash"
import { t } from "i18next"
let config = {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    }
}
registerLocale("vi", vi)
class VaccinationDetail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            formData: {
                number: props.number + (props.rowId ? 0: 1),
                vaccinTypeId : '',
                injectedAt: null,
                vaccinationUnitId: null,
                city: null,
                district: null,
                ward: null,
                address: null,
                vaccinHospitalId: null,
                vaccinEffects: [],
                statusId: props.rowId ? null : 1,
                reasonRejectId: null,
                reasonTypeId: null,
                reasonDetail: ''
            },
            exc: false,
            notDelay: true,
            effectList: [],
            vaccinType: [],
            departments: [],
            branchs: [],
            showListEffect: false,
            citys: [],
            districts: [],
            wards: [],
            isShowStatusModal: false,
            content: "",
            isSuccess: false,
            show: props.show,
            status_data: [],
            reason_reject_data: [],
            reason_type_data: []
        };
    }

    dataConvert = (d) => {
        return d.map(v => {
            return {value: v.id, label: v.name};
        });
    }

    componentDidMount() {
        this.getListCity();
        this.getEffect();
        this.getMasterData(() => {
            if(this.props.rowId !== null && this.props.rowId && this.props.show == true){
                this.getInfo(this.props.rowId);
            }
        });        
    }

    getInfo(id){
        const { t } = this.props;
        axios.get(`${process.env.REACT_APP_REQUEST_URL}vaccin/detail-vaccin/${id}?culture=${t('langCode')}`, config)
        .then(res => {
            if (res && res.data && res.data.data) {
                const state = this.state;
                const stateData = state.formData;
                const infoData = res.data.data;
                state['notDelay'] = infoData.statusId - 1;
                stateData['number'] = infoData.number;
                stateData['injectedAt'] = infoData.injectedAt;
                stateData['address'] = infoData.address;
                stateData['city'] = infoData.city;
                stateData['district'] = infoData.district;
                stateData['ward'] = infoData.ward;
                stateData['vaccinEffects'] = infoData.vaccinEffects;
                stateData['vaccinTypeId'] = infoData.vaccin?.id;
                stateData['vaccinationUnitId'] = infoData.department?.id;
                stateData['vaccinHospitalId'] = infoData.branch?.id;
                stateData['statusId'] = infoData.statusId;
                stateData['reasonRejectId'] = infoData.reasonRejectId;
                stateData['reasonTypeId'] = infoData.reasonTypeId;
                stateData['reasonDetail'] = infoData.reasonDetail;
                this.setState(state);
                if(stateData['vaccinationUnitId'] == 2){
                    this.getListCity(() => {
                        const city = this.state.citys.filter(t => t.label == this.state.formData.city);
                        if(city.length){
                            this.getListDistrict(city[0].value, () => {
                                const district = this.state.districts.filter(t => t.label == this.state.formData.district);
                                if(district.length){
                                    this.getListWard(district[0].value);
                                }
                            });
                        }
                    });
                }
            }
        }).catch(error => {
        });
    }

    getEffect() {
        const { t } = this.props;
        axios.get(`${process.env.REACT_APP_REQUEST_URL}vaccin/effects?culture=${t('langCode')}`, config)
        .then(res => {
            if (res && res.data && res.data.data) {
                this.setState({
                    effectList: res.data.data
                });
            }
        }).catch(error => {

        });
    }

    getMasterData(call) {
        const { t } = this.props;
        axios.get(`${process.env.REACT_APP_REQUEST_URL}vaccin/datas?culture=${t('langCode')}`, config)
        .then(res => {
            if (res && res.data && res.data.data) {
                this.setState({
                    vaccinType: this.dataConvert(res.data.data.vaccins), 
                    departments: this.dataConvert(res.data.data.departments), 
                    branchs: this.dataConvert(res.data.data.branchs),
                    status_data: this.dataConvert(res.data.data.status),
                    reason_reject_data: this.dataConvert(res.data.data.reasonRejects),
                    reason_type_data: [
                        this.dataConvert(res.data.data.reasonTypes.splice(0,3)),
                        this.dataConvert(res.data.data.reasonTypes)
                    ]
                });
                if(call)  call();
            }
        }).catch(error => {

        });
    }

    handleSelectChange(name, event){
        if(name == "statusId"){
            const e = {
                number: this.state.formData.number,
                vaccinTypeId : event.value == 1 ? this.state.formData.vaccinTypeId : '',
                injectedAt: event.value == 1 ? this.state.formData.injectedAt : null,
                vaccinationUnitId: event.value == 1 ? this.state.formData.vaccinationUnitId : null,
                city: event.value == 1 ? this.state.formData.city : null,
                district: event.value == 1 ? this.state.formData.district : null,
                ward: event.value == 1 ? this.state.formData.ward : null,
                address: event.value == 1 ? this.state.formData.address : null,
                vaccinHospitalId: event.value == 1 ? this.state.formData.vaccinHospitalId : null,
                vaccinEffects: event.value == 1 ? this.state.formData.vaccinEffects : [],
                statusId: event.value,
                reasonRejectId: event.value == 2 ? this.state.formData.reasonRejectId : null,
                reasonTypeId: event.value == 2 ? this.state.formData.reasonTypeId : null,
                reasonDetail: event.value == 2 ? this.state.formData.reasonDetail : ''
            };
            this.setState({
                formData: e
            });
        }else{
            const e = this.state.formData;
            e[name] = event.value;
            this.setState(e);
        }
    }

    handleDatePickerInputChange(value){
        if(value){
            const time = moment(value).format('YYYY-MM-DD[T]00:00:00');
            const exc = this.props.listData.filter(t => t.injectedAt == time);
            if(exc.length) {
                this.setState({
                    exc: true
                });
            }else{
                this.setState({
                    exc: false
                });
            }
        }
        const e = this.state.formData;
        e['injectedAt'] = value;
        this.setState(e);
    }

    handleShowListEffect(e) {
        this.setState({
            showListEffect: e
        });
    }

    hideStatusModal = () => {
        this.setState({ isShowStatusModal: false });
        window.location.reload();
    }

    handleChangeEffect(name, event) {
        const value = event.target.value;
        const st_data = this.state.formData;
        st_data['vaccinEffects'].map((t,i) => {
            if(t.id == name)
                st_data['vaccinEffects'].splice(i,1);
        });
        st_data['vaccinEffects'].push({
            id: name,
            status: value*1
        });
        this.setState(st_data);
    }

    handleChangeCity(e) {
        this.updateState('city', e.label);
        this.updateState('district', null);
        this.updateState('ward', null);
        this.getListDistrict(e.value);
    }

    handleChangeDistrict(e){
        this.updateState('district', e.label);
        this.updateState('ward', null);
        this.getListWard(e.value);
    }

    handleChangeWard(e){
        this.updateState('ward', e.label);
    }

    updateState(name, value){
        const state_d = this.state.formData;
        state_d[name] = value;
        this.setState(state_d);
    }

    getListCity(call){
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/masterdata/provinces?country_id=VN`, config)
        .then(res => {
            if(res && res.data && res.data.data){
                this.setState({
                    citys: res.data.data.map(v => {
                        // var e = v.name.split("-");
                        let labelLocale = localStorage.getItem('locale') == 'vi-VN' ? v.TEXT : v.TEXT_EN
                        return {value: v.ID, label: labelLocale}
                    })
                });
                if(call) call();
            }
        }).catch(error => {

        });
    }

    getListDistrict(proviceCode, call){
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/masterdata/districts?province_id=${proviceCode}`, config)
        .then(res => {
            if(res && res.data && res.data.data){
                this.setState({
                    districts: res.data.data.map(v => {
                        // var e = v.name.split("-");
                        // return {value: e[0].trim(), label: e[1].trim()}
                        let labelLocale = localStorage.getItem('locale') == 'vi-VN' ? v.TEXT : v.TEXT_EN
                        return {value: v.ID, label: labelLocale}
                    })
                });
                if(call){
                    call();
                }
            }
        }).catch(error => {

        });
    }

    getListWard(districtCode){
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/masterdata/wards?district_id=${districtCode}`, config)
        .then(res => {
            if(res && res.data && res.data.data){
                this.setState({
                    wards: res.data.data.map(v => {
                        // var e = v.name.split("-");
                        // return {value: e[0].trim(), label: e[1].trim()}
                        let labelLocale = localStorage.getItem('locale') == 'vi-VN' ? v.TEXT : v.TEXT_EN
                        return {value: v.ID, label: labelLocale}
                    })
                });
            }
        }).catch(error => {

        });
    }

    onChangeInput(name, event){
        const e = this.state.formData;
        e[name] = event.target.value;
        this.setState(e);
    }

    showStatusModal(e, b){
        this.setState({ isShowStatusModal: true, content: e, isSuccess: b, isShowConfirmModal: false, show: false });
    }

    onUpdateOrCreateData(){
        const {t} = this.props;
        const dataRequest = this.state.formData;
  
        if (!dataRequest.vaccinHospitalId) {
            dataRequest.vaccinHospitalId = 0
        }

        dataRequest.injectedAt = moment(dataRequest.injectedAt || new Date().getTime()).format('YYYY-MM-DD[T]00:00:00');
        if(this.props.listData.filter(t => t.injectedAt === dataRequest.injectedAt).length){
            this.setState({
                exc: true
            });
            return false;
        }

        var message = t('successfulCreateVaccination');
        if(this.props.rowId !== null || this.props.rowId){
            dataRequest['id'] = this.props.rowId;
            message = t('successfulUpdateVaccination');
        }

        axios.post(`${process.env.REACT_APP_REQUEST_URL}vaccin/${this.props.rowId !== null || this.props.rowId ? 'update': 'create'}-vaccin/`, dataRequest, config)
        .then(res => {
            if(res.data){
                this.showStatusModal(message, true)
            }
        }).catch(error => {
            this.showStatusModal(t("HasErrorOccurred"));
        });
    }

    render(){
        const { t } = this.props;
        const customStyles = {
            option: (styles, state) => ({
                ...styles,
                cursor: 'pointer',
            }),
            control: (styles) => ({
                ...styles,
                cursor: 'pointer',
            }),
            menuPortal: provided => ({ ...provided, zIndex: 99 }),
            menu: provided => ({ ...provided, zIndex: 99 })
        }
        const reload = () => {
            if (this.state.isShowStatusModal) {
              window.location.reload();
            }
        }
        return (
            <>
                <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} onExited={reload} />
                <Modal backdrop="static" keyboard={false}
                    className='info-modal-common position-apply-modal vaccine-create-info'
                    centered show={this.state.show}
                    onHide={this.props.onHide} 
                    size="xl">
                    <Modal.Header className='apply-position-modal' >
                        <Modal.Title>{t(this.props.rowId ? 'EditQuestion' : 'vaccination_btn_declare')}</Modal.Title>
                        <button type="button" className="close" onClick={() => this.props.onCancelClick()}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </Modal.Header>
                    <Modal.Body className="pt-0">
                        {
                            this.props.editLastRow && <div className="py-2 border-bottom"><span className="text-danger">* {t('confirm_form_vaccination')}</span></div>
                        }
                        {
                            this.state.exc && <div className="text-danger pt-3">{t('vaccination_exits')}</div>
                        }
                        <div className="form-content pt-3">
                            <div className="row">
                                <div className="col-md-3 col-xs-12">
                                    <div className="form-group">
                                        <label>{t('vaccination_injections_mumber')}</label>
                                        <input value={this.state.formData.number} onChange={(e) => this.onChangeInput('number',e)} type="text" className="form-control input-text" placeholder={t('vaccination_injections_mumber')} readOnly/>
                                    </div>
                                </div>
                                <div className="col-md-3 col-xs-12">
                                    <div className="form-group">
                                        <label>{t('vaccination_status')} <span className="text-danger"> (*)</span></label>
                                        <Select
                                            isDisabled={!this.state.notDelay}
                                            isClearable={false}
                                            styles={customStyles}
                                            name="statusId"
                                            onChange={type => this.handleSelectChange('statusId', type)}
                                            value={this.state.formData.statusId ? this.state.status_data.filter(n => n.value == this.state.formData.statusId) : null}
                                            placeholder={t('vaccination_status')}
                                            key="statusId"
                                            options={this.state.status_data}
                                        />
                                    </div>
                                </div>
                                {
                                    this.state.formData.statusId == 1 ?
                                        <div className="col-md-3 col-xs-12">
                                            <div className="form-group">
                                                <label>{t('vaccination_type')}<span className="text-danger"> (*)</span></label>
                                                <Select
                                                    isClearable={true}
                                                    styles={customStyles}
                                                    name="type"
                                                    onChange={type => this.handleSelectChange('vaccinTypeId', type)}
                                                    value={this.state.formData.vaccinTypeId ? this.state.vaccinType.filter(n => n.value == this.state.formData.vaccinTypeId) : null}
                                                    placeholder={t('vaccination_type')}
                                                    key="type"
                                                    options={this.state.vaccinType}
                                                />
                                            </div>
                                        </div>
                                    : this.state.formData.statusId == 2 ? <div className="col-md-3 col-xs-12">
                                        <div className="form-group">
                                            <label>{t('vaccination_reason')}<span className="text-danger"> (*)</span></label>
                                            <Select
                                                isClearable={true}
                                                styles={customStyles}
                                                name="reasonRejectId"
                                                onChange={type => this.handleSelectChange('reasonRejectId', type)}
                                                value={this.state.reason_reject_data.filter(n => n.value == this.state.formData.reasonRejectId) || null}
                                                placeholder={t('vaccination_reason')}
                                                key="reasonRejectId"
                                                options={this.state.reason_reject_data}
                                            />
                                        </div>
                                    </div> : undefined
                                }
                                {
                                    this.state.formData.statusId == 1 ?
                                    <div className="col-md-3 col-xs-12">
                                        <div className="">
                                            <label>{t('vaccination_time')}<span className="text-danger"> (*)</span></label>
                                            <div className="content position-relative input-container">
                                                <label>
                                                <DatePicker
                                                    name="injectedAt"
                                                    key="injectedAt"
                                                    selected={this.state.formData.injectedAt ? moment(this.state.formData.injectedAt).toDate() : null}
                                                    // minDate={new Date(this.props.lastTime)}
                                                    maxDate={new Date()}
                                                    onChange={event => this.handleDatePickerInputChange(event)}
                                                    dateFormat="dd-MM-yyyy"
                                                    showMonthDropdown={true}
                                                    showYearDropdown={true}
                                                    locale="vi"
                                                    className="form-control input-text date-picker-input" />
                                                    <span className="input-group-addon input-img">
                                                        <i className="fas fa-calendar-alt"></i>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div> : this.state.formData.reasonRejectId < 3 && this.state.formData.reasonRejectId !== null && this.state.formData.statusId == 2 ? 
                                        <div className="col-md-3 col-xs-12">
                                            <div className="form-group">
                                                <label>{t('vaccination_reason_field')}<span className="text-danger"> (*)</span></label>
                                                <Select
                                                    isClearable={true}
                                                    styles={customStyles}
                                                    name="reasonTypeId"
                                                    onChange={type => this.handleSelectChange('reasonTypeId', type)}
                                                    value={this.state.reason_type_data[this.state.formData.reasonRejectId - 1].filter(n => n.value == this.state.formData.reasonTypeId) || null}
                                                    placeholder={t('vaccination_reason_field')}
                                                    key="reasonTypeId"
                                                    options={this.state.reason_type_data[this.state.formData.reasonRejectId - 1]}
                                                />
                                            </div>
                                        </div>
                                    : undefined
                                }
                                {
                                    this.state.formData.statusId == 1 ?
                                    <div className="col-md-4 col-xs-12">
                                        <div className="form-group">
                                            <label>{t('vaccination_department')}<span className="text-danger"> (*)</span></label>
                                            <Select
                                                isClearable={true}
                                                styles={customStyles}
                                                name="department"
                                                onChange={department => this.handleSelectChange('vaccinationUnitId', department)}
                                                value={this.state.departments.filter(n => n.value == this.state.formData.vaccinationUnitId)}
                                                placeholder={t('vaccination_department') + '...'}
                                                key="department"
                                                options={this.state.departments}
                                            />
                                        </div>
                                    </div>
                                    : this.state.formData.statusId == 2 ? <div className="col-md-12 col-xs-12">
                                        <div className="form-group">
                                            <label>{t('vaccination_reason_detail')} <span className="text-danger"> (*)</span></label>
                                            <input value={this.state.formData.reasonDetail} onChange={(e) => this.onChangeInput('reasonDetail',e)} type="text" className="form-control input-text" placeholder={t('vaccination_reason_detail')}/>
                                        </div>
                                        {
                                            this.state.formData.reasonRejectId == 2 ? <div className="">
                                                <span className="text-danger d-block w-100">* {t('vaccination_reason_detail_item_1')}</span>
                                                <span className="text-danger mt-1 w-100">* {t('vaccination_reason_detail_item_2')}</span>
                                        </div> : undefined}
                                    </div> : undefined
                                }
                                
                                {
                                    this.state.formData.vaccinationUnitId == 2 ?
                                        <div className="col-md-8 col-xs-12">
                                            <div className="row">
                                                <div className="col-md-4 col-xs-12">
                                                    <div className="form-group">
                                                        <label>{t('Province_City')}<span className="text-danger"> (*)</span></label>
                                                        <Select
                                                            styles={customStyles}
                                                            name="city"
                                                            onChange={city => this.handleChangeCity(city)}
                                                            value={this.state.citys.filter(n => n.label == this.state.formData.city)}
                                                            placeholder={t('Province_City') + '...'}
                                                            key="city"
                                                            options={this.state.citys}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-xs-12">
                                                    <div className="form-group">
                                                        <label>{t('District')}<span className="text-danger"> (*)</span></label>
                                                        <Select
                                                            isDisabled={!this.state.formData.city && !this.state.districts.length}
                                                            styles={customStyles}
                                                            name="district"
                                                            onChange={district => this.handleChangeDistrict(district)}
                                                            value={this.state.districts.filter(n => n.label == this.state.formData.district)}
                                                            placeholder={t('District') + '...'}
                                                            key="district"
                                                            options={this.state.districts}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-xs-12">
                                                    <div className="form-group">
                                                        <label>{t('Ward')}<span className="text-danger"> (*)</span></label>
                                                        <Select
                                                            isDisabled={!this.state.formData.district && !this.state.wards.length}
                                                            styles={customStyles}
                                                            name="ward"
                                                            onChange={ward => this.handleChangeWard(ward)}
                                                            value={this.state.wards.filter(n => n.label == this.state.formData.ward)}
                                                            placeholder={t('Ward') + '...'}
                                                            key="ward"
                                                            options={this.state.wards}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    :    this.state.formData.vaccinationUnitId == 1 ? <div className="col-md-4 col-xs-12"> 
                                        <div className="form-group">
                                            <label>{t('vaccination_branch')}<span className="text-danger"> (*)</span></label>
                                            <Select
                                                isClearable={true}
                                                styles={customStyles}
                                                name="branch"
                                                onChange={branch => this.handleSelectChange('vaccinHospitalId',branch)}
                                                value={this.state.branchs.filter(n => n.value == this.state.formData.vaccinHospitalId)}
                                                placeholder={t('vaccination_branch') + '...'}
                                                key="branch"
                                                options={this.state.branchs}
                                            />
                                        </div>
                                    </div> : this.state.formData.vaccinationUnitId == 3 ?
                                        <div className="col-md-8 col-xs-12">
                                            <div className="form-group">
                                                <label htmlFor="address">{t('Address')}</label>
                                                <input value={this.state.formData.address} onChange={(e) => this.onChangeInput('address',e)} type="text" className="form-control" id="address" placeholder={t('Address') + '...'}/>
                                            </div>
                                        </div>
                                    : undefined
                                }
                                {
                                    this.state.formData.statusId == 1 ?
                                    <div className="col-md-12 col-xs-12">
                                        <div className="py-2 btn bg-light effect-infos" onClick={() => this.handleShowListEffect(!this.state.showListEffect)}> <b>{t('vaccination_reaction_after')} <i className={"fas fa-caret-" + (this.state.showListEffect ? "up":"down")}></i></b> </div>
                                        {this.state.showListEffect && <div className="effect-table border rounded">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>{t('Symptom')}</th>
                                                        <th className="text-center">{t('Yes')}</th>
                                                        <th className="text-center">{t('No')}</th>
                                                        <th className="text-center">{t('Forget')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        this.state.effectList && this.state.effectList.map((v,index) => {
                                                            return <tr key={index}>
                                                                <td>{(index + 1)+". "+v.name}</td>
                                                                <td  className="text-center pd-0 wpz-120">
                                                                    <label className="label-option-yn-vaccin">
                                                                        <input checked={this.state.formData.vaccinEffects.filter(n => n['id'] == v.id && n['status'] == 1).length ? true: false} type="radio" value={1} name={v.id +"_1"+ index} onChange={e => this.handleChangeEffect(v.id, e)} className="option-ques-vaccin"/>
                                                                    </label>
                                                                </td>
                                                                <td className="text-center pd-0 wpz-120">
                                                                    <label className="label-option-yn-vaccin">
                                                                        <input checked={this.state.formData.vaccinEffects.filter(n => n['id'] == v.id && n['status'] == 2).length ? true: false} type="radio" value={2} name={v.id +"_2"+ index} onChange={e => this.handleChangeEffect(v.id, e)} className="option-ques-vaccin"/>
                                                                    </label>
                                                                </td>
                                                                <td  className="text-center pd-0 wpz-120">
                                                                    <label className="label-option-yn-vaccin">
                                                                        <input checked={this.state.formData.vaccinEffects.filter(n => n['id'] == v.id  && n['status'] == 3).length ? true: false} type="radio" value={3} name={v.id +"_3"+ index} onChange={e => this.handleChangeEffect(v.id, e)} className="option-ques-vaccin"/>
                                                                    </label>
                                                                    <input className="d-none" type="radio" value="4" name={v.id} onChange={e => this.handleChangeEffect(v.id, e)}/>
                                                                </td>
                                                            </tr>
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>}
                                    </div>
                                    : undefined
                                }
                            </div>
                        </div>
                        <div className="clearfix action-buttons text-right mt-3">
                            <Button variant="secondary" className="pr-4 pl-4 mr-2" onClick={() => this.props.onCancelClick()}>{t("Cancel")}</Button>
                            <Button disabled={
                                (this.state.formData.statusId == 1 ? !
                                    (!this.state.exc && this.state.formData.vaccinTypeId && this.state.formData.injectedAt &&(
                                    this.state.formData.vaccinationUnitId == 2 ? (this.state.formData.city && this.state.formData.district && this.state.formData.ward) 
                                    : this.state.formData.vaccinationUnitId == 1 ? this.state.formData.vaccinHospitalId : this.state.formData.address
                                )) : this.state.formData.statusId == 2 ? !( (this.state.formData.reasonRejectId < 3 && this.state.formData.reasonTypeId || this.state.formData.reasonRejectId == 3) && this.state.formData.reasonDetail) : true)
                                } variant="primary" className="pr-4 pl-4" onClick={() => this.onUpdateOrCreateData()}>{t(this.props.rowId !== null && this.props.rowId ? "Update" : "Confirm")}</Button>
                        </div>
                    </Modal.Body>
                </Modal> 
            </>
        );
    }
}
export default VaccinationDetail;