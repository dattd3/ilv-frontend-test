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
                number: 1,
                type: 1,
                injectedAt: null,
                department: null,
                city: null,
                district: null,
                ward: null,
                address: null,
                branch: null,
                vaccinEffects: []
            },
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
        };
    }

    dataConvert = (d) => {
        return d.map(v => {
            return {value: v.id, label: v.name};
        });
    }

    componentDidMount() {
        this.getEffect();
        this.getMasterData();
        this.getListCity();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.rowId !== null && nextProps.rowId && nextProps.show == true){
            this.getInfo(nextProps.rowId);
        }
    }

    getInfo(id){
        axios.get(`${process.env.REACT_APP_REQUEST_URL}vaccin/detail-vaccin/${id}`, config)
        .then(res => {
            if (res && res.data && res.data.data) {
                const stateData = this.state.formData;
                const infoData = res.data.data;
                stateData['number'] = infoData.number;
                stateData['injectedAt'] = infoData.injectedAt;
                stateData['address'] = infoData.address;
                stateData['city'] = infoData.city;
                stateData['district'] = infoData.district;
                stateData['ward'] = infoData.ward;
                stateData['vaccinEffects'] = infoData.vaccinEffects;
                stateData['type'] = infoData.vaccin?.id;
                stateData['department'] = infoData.department?.id;
                stateData['branch'] = infoData.branch?.id;
                this.setState(stateData);
                if(stateData['department'] == 2){
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
        axios.get(`${process.env.REACT_APP_REQUEST_URL}vaccin/effects`, config)
        .then(res => {
            if (res && res.data && res.data.data) {
                this.setState({
                    effectList: res.data.data
                });
            }
        }).catch(error => {

        });
    }

    getMasterData() {
        axios.get(`${process.env.REACT_APP_REQUEST_URL}vaccin/datas/`, config)
        .then(res => {
            if (res && res.data && res.data.data) {
                this.setState({
                    vaccinType: this.dataConvert(res.data.data.vaccins), 
                    departments: this.dataConvert(res.data.data.departments), 
                    branchs: this.dataConvert(res.data.data.branchs) 
                });
            }
        }).catch(error => {

        });
    }

    handleSelectChange(name, event){
        const e = this.state.formData;
        e[name] = event.value;
        this.setState(e);
    }

    handleDatePickerInputChange(value){
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
        this.getListDistrict(e.value);
    }

    handleChangeDistrict(e){
        this.updateState('district', e.label);
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
        axios.get(`${process.env.REACT_APP_HRDX_URL}api/MasterData/province?nationCode=VN`)
        .then(res => {
            if(res && res.data && res.data.data){
                this.setState({
                    citys: res.data.data.map(v => {
                        var e = v.name.split("-");
                        return {value: e[0].trim() * 1, label: e[1].trim()}
                    })
                });
                if(call){
                    call();
                }
            }
        }).catch(error => {

        });
    }

    getListDistrict(proviceCode, call){
        axios.get(`${process.env.REACT_APP_HRDX_URL}api/MasterData/district?provinceCode=${proviceCode}`)
        .then(res => {
            if(res && res.data && res.data.data){
                this.setState({
                    districts: res.data.data.map(v => {
                        var e = v.name.split("-");
                        return {value: e[0].trim() * 1, label: e[1].trim()}
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
        axios.get(`${process.env.REACT_APP_HRDX_URL}api/MasterData/ward?districtCode=${districtCode}`)
        .then(res => {
            if(res && res.data && res.data.data){
                this.setState({
                    wards: res.data.data.map(v => {
                        var e = v.name.split("-");
                        return {value: e[0].trim() * 1, label: e[1].trim()}
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
        this.setState({ isShowStatusModal: true, content: e, isSuccess: b, isShowConfirmModal: false });
        this.props.onCancelClick();
    }

    onUpdateOrCreateData(){
        const {t} = this.props;
        const dataRequest = this.state.formData;
        dataRequest['vaccinDatas'] = [];
        if(dataRequest['type']) dataRequest['vaccinDatas'].push(dataRequest['type']);
        if(dataRequest['department']) dataRequest['vaccinDatas'].push(dataRequest['department']);
        if(dataRequest['branch']) dataRequest['vaccinDatas'].push(dataRequest['branch']);
        delete dataRequest.type;
        delete dataRequest.department;
        delete dataRequest.branch;

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
            })
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
                    className='info-modal-common position-apply-modal'
                    centered show={this.props.show}
                    onHide={this.props.onHide}
                    size="xl"
                    >
                    <Modal.Header className='apply-position-modal' >
                        <Modal.Title>{t(this.props.rowId ? "EditQuestion": "Add")}</Modal.Title>
                        <button type="button" className="close" onClick={() => this.props.onCancelClick()}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        
                        <div className="form-content">
                            <div className="row">
                                <div className="col-md-4 col-xs-12">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">{t('vaccination_injections_mumber')}</label>
                                        <input value={this.state.formData.number} onChange={(e) => this.onChangeInput('number',e)} type="email" className="form-control" id="exampleInputEmail1" placeholder={t('vaccination_injections_mumber')} readOnly/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-xs-12">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">{t('vaccination_type')}<span className="text-danger">(*)</span></label>
                                        <Select
                                            isClearable={true}
                                            styles={customStyles}
                                            name="type"
                                            onChange={type => this.handleSelectChange('type', type)}
                                            value={this.state.vaccinType.filter(n => n.value == this.state.formData.type)}
                                            placeholder={t('vaccination_type') + '...'}
                                            key="type"
                                            options={this.state.vaccinType}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 col-xs-12">
                                    <div className="">
                                        <label htmlFor="exampleInputEmail1">{t('vaccination_time')}<span className="text-danger">(*)</span></label>
                                        <div className="content position-relative input-container">
                                            <DatePicker
                                                name="injectedAt"
                                                key="injectedAt"
                                                selected={this.state.formData.injectedAt ? moment(this.state.formData.injectedAt, 'DD-MM-YYYY').toDate() : null}
                                                maxDate={new Date()}
                                                onChange={event => this.handleDatePickerInputChange(event)}
                                                dateFormat="dd-MM-yyyy"
                                                showMonthDropdown={true}
                                                showYearDropdown={true}
                                                locale="vi"
                                                className="form-control input" />
                                            <span className="input-group-addon input-img">
                                                <i className="fas fa-calendar-alt"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 col-xs-12">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">{t('vaccination_department')}<span className="text-danger">(*)</span></label>
                                        <Select
                                            isClearable={true}
                                            styles={customStyles}
                                            name="department"
                                            onChange={department => this.handleSelectChange('department', department)}
                                            value={this.state.departments.filter(n => n.value == this.state.formData.department)}
                                            placeholder={t('vaccination_department') + '...'}
                                            key="department"
                                            options={this.state.departments}
                                        />
                                    </div>
                                </div>
                                {
                                    this.state.formData.department == 2 ?
                                        <div className="col-md-8 col-xs-12">
                                            <div className="row">
                                                <div className="col-md-4 col-xs-12">
                                                    <div className="form-group">
                                                        <label htmlFor="exampleInputEmail1">{t('Province_City')}<span className="text-danger">(*)</span></label>
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
                                                        <label htmlFor="exampleInputEmail1">{t('District')}<span className="text-danger">(*)</span></label>
                                                        <Select
                                                            isDisabled={!this.state.formData.city}
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
                                                        <label htmlFor="exampleInputEmail1">{t('Ward')}<span className="text-danger">(*)</span></label>
                                                        <Select
                                                            isDisabled={!this.state.formData.district}
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
                                    : this.state.formData.department == 1 ? <div className="col-md-4 col-xs-12"> 
                                        <div className="form-group">
                                            <label htmlFor="exampleInputEmail1">{t('vaccination_branch')}<span className="text-danger">(*)</span></label>
                                            <Select
                                                isClearable={true}
                                                styles={customStyles}
                                                name="branch"
                                                onChange={branch => this.handleSelectChange('branch',branch)}
                                                value={this.state.branchs.filter(n => n.value == this.state.formData.branch)}
                                                placeholder={t('vaccination_branch') + '...'}
                                                key="branch"
                                                options={this.state.branchs}
                                            />
                                        </div>
                                    </div> : this.state.formData.department == 3 ?
                                        <div className="col-md-8 col-xs-12">
                                            <div className="form-group">
                                                <label htmlFor="address">{t('Address')}</label>
                                                <input value={this.state.formData.address} onChange={(e) => this.onChangeInput('address',e)} type="text" className="form-control" id="address" placeholder={t('Address') + '...'}/>
                                            </div>
                                        </div> 
                                    : undefined
                                }
                                <div className="col-md-12 col-xs-12">
                                    <div className="py-2 btn bg-light" onClick={() => this.handleShowListEffect(!this.state.showListEffect)}> <b>{t('vaccination_reaction_after')} <i className={"fas fa-caret-" + (this.state.showListEffect ? "up":"down")}></i></b> </div>
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
                                                            <td>{(index + 1)+"."+v.name}</td>
                                                            <td  className="text-center">
                                                                <input checked={this.state.formData.vaccinEffects.filter(n => n['id'] == v.id && n['status'] == 0 ).length ? true: false} type="radio" value={0} name={v.id +"_0"+ index} onChange={e => this.handleChangeEffect(v.id, e)}/>
                                                            </td>
                                                            <td className="text-center">
                                                                <input checked={this.state.formData.vaccinEffects.filter(n => n['id'] == v.id && n['status'] == 1).length ? true: false} type="radio" value={1} name={v.id +"_1"+ index} onChange={e => this.handleChangeEffect(v.id, e)}/>
                                                            </td>
                                                            <td  className="text-center">
                                                                <input checked={this.state.formData.vaccinEffects.filter(n => n['id'] == v.id  && n['status'] == 2).length ? true: false} type="radio" value={2} name={v.id +"_2"+ index} onChange={e => this.handleChangeEffect(v.id, e)}/>
                                                                <input className="d-none" type="radio" value="4" name={v.id} onChange={e => this.handleChangeEffect(v.id, e)}/>
                                                            </td>
                                                        </tr>
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>}
                                </div>
                            </div>
                        </div>
                        <div className="clearfix edit-button text-right mt-3">
                            <Button variant="secondary" className="pr-4 pl-4 mr-2" onClick={() => this.props.onCancelClick()}>{t("Cancel")}</Button>
                            <Button disabled={
                                !(this.state.formData.type && this.state.formData.injectedAt && 
                                (
                                    this.state.formData.department == 2 ? (this.state.formData.city && this.state.formData.district && this.state.formData.ward) 
                                    : this.state.formData.department == 1 ? this.state.formData.branch : this.state.formData.address
                                ))
                                } variant="primary" className="pr-4 pl-4" onClick={() => this.onUpdateOrCreateData()}>{t("Update")}</Button>
                        </div>
                    </Modal.Body>
                </Modal> 
            </>
        );
    }
}
export default VaccinationDetail;