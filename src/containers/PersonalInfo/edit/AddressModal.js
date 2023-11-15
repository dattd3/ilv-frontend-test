import React from "react";
import { Modal } from 'react-bootstrap'
import Select from 'react-select'
import axios from 'axios'
import _ from 'lodash'
import { withTranslation } from "react-i18next"
import { getMuleSoftHeaderConfigurations } from "../../../commons/Utils"

const countryCodeVN = 'VN'

class AddressModal extends React.Component {
    constructor(props) {
        super();

        this.state = {
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
        this.getProvinces(this.state.country?.value)
        this.getDistricts(this.state.province?.value)
        this.getWards(this.state.district?.value)
    }

    getProvinces(country_id) {
        const config = getMuleSoftHeaderConfigurations()
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/provinces?country_id=${country_id}`, config)
            .then(res => {
                if (res?.data?.data) {
                    const provinces = (res.data.data || []).map(item => {
                        return { value: item?.ID, label: item?.TEXT }
                    })
                    this.setState({ provinces: provinces })
                }
            }).catch(error => { })
    }

    getDistricts(province_id, country_id = countryCodeVN) {
        if (country_id !== countryCodeVN) {
            return []
        }

        const config = getMuleSoftHeaderConfigurations()
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/districts?province_id=${province_id}`, config)
            .then(res => {
                if (res?.data?.data) {
                    const districts = (res.data.data || []).map(item => {
                        return { value: item?.ID, label: item?.TEXT }
                    })
                    this.setState({ districts: districts })
                }
            }).catch(error => { })
    }

    getWards(district_id, country_id = countryCodeVN) {
        if (country_id !== countryCodeVN) {
            return []
        }

        const config = getMuleSoftHeaderConfigurations()
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/wards?district_id=${district_id}`, config)
            .then(res => {
                if (res?.data?.data) {
                    const wards = (res.data.data || []).map(item => {
                        return { value: item?.ID, label: item?.TEXT }
                    })
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
        this.getProvinces(item.value)
    }

    updateProvince(item) {
        this.setState({ province: item, districts: [], district: null, wards: [], ward: null, streetName: null })
        this.getDistricts(item?.value, this.state.country?.value)
    }

    updateDistrict(item) {
        this.setState({ district: item, wards: [], ward: null, streetName: null })
        this.getWards(item?.value, this.state.country?.value)
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
        if (this.state.country.value === countryCodeVN) {
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
        return this.state.errors[name] ? <div className="text-danger" style={{ marginTop: 5, fontSize: 13 }}>{this.state.errors[name]}</div> : null
    }

    save() {
        const errors = this.verifyInput()
        if (!_.isEmpty(errors)) {
            return
        }
        this.props.updateAddress(this.state.country, this.state.province, this.state.district, this.state.ward, this.state.street_name)
        setTimeout(() => { this.props.onHide() }, 200)
    }

    render() {
        const { t } = this.props
        const { provinces, districts, wards, country, province, district, ward, street_name } = this.state
        const countries = (this.props?.countries || []).map(country => { return { value: country?.ID, label: country?.TEXT } })

        return (
            <>
                <Modal className='info-modal-common address-selection-modal' centered show={this.props.show} onHide={this.props.onHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row mb-3">
                            <div className="col-4">
                                {t("Nation")}
                            </div>
                            <div className="col-8">
                                <Select options={countries} placeholder={`${t('Select')}...`} onChange={this.updateCountry.bind(this)} value={country} />
                                {this.error('country')}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-4">
                                {t("City")}
                            </div>
                            <div className="col-8">
                                <Select options={provinces} placeholder={`${t("SelectProvince_City")}...`} onChange={this.updateProvince.bind(this)} value={province} />
                                {this.error('province')}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-4">
                                {t("District")}
                            </div>
                            <div className="col-8">
                                <Select options={districts} placeholder={`${t("SelectDistrict")}...`} onChange={this.updateDistrict.bind(this)} value={district} />
                                {this.error('district')}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-4">
                                {t("Ward")}
                            </div>
                            <div className="col-8">
                                <Select options={wards} placeholder={`${t("SelectWard")}...`} onChange={this.updateWard.bind(this)} value={ward} />
                                {this.error('ward')}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-4">
                                {t("Street")}
                            </div>
                            <div className="col-8">
                                <input className="form-control street" value={street_name || ''} onChange={this.updateStreetName.bind(this)} type="text" placeholder={t("EnterStreet")} />
                            </div>
                        </div>
                        <hr />
                        <div className="clearfix">
                            <button type="button" className="btn btn-primary float-right w-25" onClick={this.save.bind(this)}>{t("Save")}</button>
                            <button type="button" className="btn btn-secondary float-right mr-3 w-25" onClick={this.props.onHide}>{t("Back")}</button>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

export default withTranslation()(AddressModal)
