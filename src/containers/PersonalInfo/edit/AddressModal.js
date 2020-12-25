import React from "react";
import { Modal } from 'react-bootstrap'
import Select from 'react-select'
import axios from 'axios'
import _ from 'lodash'

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

    config() {
        return {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
                'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
            }
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
        this.getProvices(this.state.country.value)
        this.getDistricts(this.state.province.value)
        this.getWards(this.state.district.value)
    }

    getProvices(country_id) {
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/provinces?country_id=${country_id}`, this.config())
            .then(res => {
                if (res && res.data && res.data.data) {
                    let provinces = res.data.data;
                    this.setState({ provinces: provinces })
                }
            }).catch(error => { })
    }

    getDistricts(province_id) {
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/districts?province_id=${province_id}`, this.config())
            .then(res => {
                if (res && res.data && res.data.data) {
                    let districts = res.data.data;
                    this.setState({ districts: districts })
                }
            }).catch(error => { })
    }

    getWards(district_id) {
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/wards?district_id=${district_id}`, this.config())
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
        let errors = {}
        const RequiredFields = ['country', 'province', 'district', 'ward']
        RequiredFields.forEach(name => {
            if (_.isNull(this.state[name])) {
                errors[name] = '(Bắt buộc)'
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
        this.props.updateAddress(this.state.country, this.state.province, this.state.district, this.state.ward, this.state.street_name)
        setTimeout(() => { this.props.onHide() }, 200)
    }

    render() {
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
                                Quốc gia
                            </div>
                            <div className="col-7">
                                <Select options={countries} onChange={this.updateCountry.bind(this)} value={this.state.country} />
                                {this.error('country')}
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-5">
                                Tỉnh / thành phố
                            </div>
                            <div className="col-7">
                                <Select options={provinces} onChange={this.updateProvice.bind(this)} value={this.state.province} />
                                {this.error('province')}
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-5">
                                Quận/Huyện
                            </div>
                            <div className="col-7">
                                <Select options={districts} onChange={this.updateDistrict.bind(this)} value={this.state.district} />
                                {this.error('district')}
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-5">
                                Phường
                            </div>
                            <div className="col-7">
                                <Select options={wards} onChange={this.updateWard.bind(this)} value={this.state.ward} />
                                {this.error('ward')}
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-5">
                                Đường phố
                            </div>
                            <div className="col-7">
                                <input className="form-control" value={this.state.street_name} onChange={this.updateStreetName.bind(this)} type="text" placeholder="Nhập đường phố" />
                            </div>
                        </div>
                        <hr />
                        <div className="clearfix">
                            <button type="button" className="btn btn-primary float-right mr-2 w-25" onClick={this.save.bind(this)}>Lưu</button>
                            <button type="button" className="btn btn-secondary float-right mr-2 w-25" onClick={this.props.onHide}>Thoát</button>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}
export default AddressModal
