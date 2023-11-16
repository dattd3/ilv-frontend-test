import React from "react";
import { Modal } from 'react-bootstrap'
import Select from 'react-select'
import axios from 'axios'
import _ from 'lodash'
import { withTranslation } from "react-i18next"
import { getMuleSoftHeaderConfigurations } from "../../../commons/Utils"

class AddressModal extends React.Component {
    constructor(props) {
        super();

        this.state = {
            countries: props.countries,
            country: props.country || null,
            provinces: [],
            province: props.province || null,
            districts: [],
            district: props.district || null,
            wards: [],
            ward: props.ward || null,
            street_name: props.street || "",
            errors: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.countries !== this.props.countries) {
            this.setState({ countries: nextProps.countries })
        }
        if (nextProps.country !== this.props.country) {
            this.setState({ country: nextProps.country })
        }
        if (nextProps.province !== this.props.province) {
            this.setState({ province: nextProps.province })
        }
        if (nextProps.district !== this.props.district) {
            this.setState({ district: nextProps.district })
        }
        if (nextProps.ward !== this.props.ward) {
            this.setState({ ward: nextProps.ward })
        }
        if (nextProps.street !== this.props.street) {
            this.setState({ street_name: nextProps.street })
        }
    }

    componentDidMount() {
        // this.getProvinces(this.state.country?.value || null)
        // this.getDistricts(this.state.province?.value || null)
        // this.getWards(this.state.district?.value || null)
    }

    getProvices(country_id) {
        const config = getMuleSoftHeaderConfigurations()
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/provinces?country_id=${country_id}`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    let provinces = res.data.data;
                    this.setState({ provinces: provinces })
                }
            }).catch(error => { })
    }

    getDistricts(province_id) {
        const config = getMuleSoftHeaderConfigurations()
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/districts?province_id=${province_id}`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    let districts = res.data.data;
                    this.setState({ districts: districts })
                }
            }).catch(error => { })
    }

    getWards(district_id) {
        const config = getMuleSoftHeaderConfigurations()
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/wards?district_id=${district_id}`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    let wards = res.data.data;
                    this.setState({ wards: wards })
                }
            }).catch(error => { })
    }

    getLocationName = (name, locationId) => {
        const locations = this.state[name];
        const location = locations.filter(item => item.ID == locationId);
        return location[0];
    }

    setMainAddress = (field, locationName) => {
        let address = { ...this.state.address };
        address.main[field] = locationName;
        this.setState({ address: address });
    }

    updateCountry(item) {
        this.setState({ country: item, provinces: [], province: null, districts: [], district: null, wards: [], ward: null, streetName: null })
        this.getProvices(item.value)
    }

    updateProvice(item) {
        this.setState({ province: item, districts: [], district: null, wards: [], ward: null, streetName: null })
        this.getDistricts(item.value)
    }

    updateDistrict(item) {
        this.setState({ district: item, wards: [], ward: null, streetName: null })
        this.getWards(item.value)
    }

    updateWard(item) {
        this.setState({ ward: item, streetName: null })
    }

    updateStreetName(e) {
        const value = e.target.value;
        this.setState({ street_name: value });
    }

    verifyInput() {
        const { t } = this.props
        let errors = {}
        const RequiredFields = ['country']
        if(this.state.country.value === "VN")
        {
            RequiredFields.push('province');
            RequiredFields.push('district');
            RequiredFields.push('ward');
        }
        RequiredFields.forEach(name => {
            if (_.isNull(this.state[name])) {
                errors[name] = t("Required")
            }
        })

        this.setState({ errors: errors })
        return errors
    }

    error(name) {
        return this.state.errors[name] ? <div className="text-danger">{this.state.errors[name]}</div> : null
    }

    save() {
        const errors = this.verifyInput()
        if (!_.isEmpty(errors)) {
            return
        }
        const { country, province, district, ward, street_name } = this.state
        this.props.updateAddress(country, province, district, ward, street_name)
        setTimeout(() => { this.props.onHide() }, 200)
    }

    render() {
        const { t } = this.props
        const provinces = this.state.provinces.map(province => { return { value: province.ID, label: province.TEXT } })
        const districts = this.state.districts.map(district => { return { value: district.ID, label: district.TEXT } })
        const wards = this.state.wards.map(ward => { return { value: ward.ID, label: ward.TEXT } })
        const countries = this.props.countries.map(country => { return { value: country.ID, label: country.TEXT } })
        return (
            <>
                <Modal className='info-modal-common position-apply-modal' centered show={this.props.show} onHide={this.props.onHide}>
                    <Modal.Header className='apply-position-modal' closeButton>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row mb-2">
                            <div className="col-5">
                                {t("Nation")}
                            </div>
                            <div className="col-7">
                                <Select options={countries} placeholder={`${t('Select')}...`} onChange={this.updateCountry.bind(this)} value={this.state.country} />
                                {this.error('country')}
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-5">
                                {t("City")}
                            </div>
                            <div className="col-7">
                                <Select options={provinces} placeholder={`${t("SelectProvince_City")}...`} onChange={this.updateProvice.bind(this)} value={this.state.province} />
                                {this.error('province')}
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-5">
                                {t("District")}
                            </div>
                            <div className="col-7">
                                <Select options={districts} placeholder={`${t("SelectDistrict")}...`} onChange={this.updateDistrict.bind(this)} value={this.state.district} />
                                {this.error('district')}
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-5">
                                {t("Ward")}
                            </div>
                            <div className="col-7">
                                <Select options={wards} placeholder={`${t("SelectWard")}...`} onChange={this.updateWard.bind(this)} value={this.state.ward} />
                                {this.error('ward')}
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-5">
                                {t("Street")}
                            </div>
                            <div className="col-7">
                                <input className="form-control" value={this.state.street_name} onChange={this.updateStreetName.bind(this)} type="text" placeholder={t("EnterStreet")} />
                            </div>
                        </div>
                        <hr />
                        <div className="clearfix">
                            <button type="button" className="btn btn-primary float-right mr-2 w-25" onClick={this.save.bind(this)}>{t("Save")}</button>
                            <button type="button" className="btn btn-secondary float-right mr-2 w-25" onClick={this.props.onHide}>{t("Back")}</button>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}
export default withTranslation()(AddressModal)
