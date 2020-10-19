import React from "react";
import { Modal } from 'react-bootstrap'
import Select from 'react-select'
import axios from 'axios'

class AddressModal extends React.Component {
    constructor(props) {
        super();
    
        this.state = {
            countries: props.countries,
            country: null,
            provinces: [],
            province: null,
            districts: [],
            district: null,
            wards: [],
            ward: null,
            street_name: null,
            address: {
                main: {
                    streetName: "",
                    wardName: "",
                    districtName: "",
                    provinceName: "",
                    countryName: "",
                    oldStreetName: "",
                    oldWardName: "",
                    oldDistrictName: "",
                    oldProvinceName: "",
                    oldCountryName: "",
                    wardId: props.ward_id || '',
                    districtId: props.district_id || '',
                    provinceId: props.province_id || '',
                    countryId: props.country_id || '',
                },
                temp: {
                    streetName: "",
                    wardName: "",
                    districtName: "",
                    provinceName: "",
                    countryName: "",
                    oldStreetName: "",
                    oldWardName: "",
                    oldDistrictName: "",
                    oldProvinceName: "",
                    oldCountryName: "",
                    wardId: props.ward_id || '',
                    districtId: props.district_id || '',
                    provinceId: props.province_id || '',
                    countryId: props.country_id || '',
                }
            }
        }
    }

    config () {
        return {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
            'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.street_name !== this.props.street_name) {
            this.setState({ street_name: nextProps.street_name })
            this.setState({ country: nextProps.country_id })
            this.setState({ countries: nextProps.countries })
        }
    }

    componentDidMount() {
        this.getProvices(this.state.country)
        this.getDistricts(this.props.province_id)
        this.getWards(this.props.district_id)
    }

    getProvices (country_id) {
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/provinces?country_id=${country_id}`, this.config())
          .then(res => {
            if (res && res.data && res.data.data) {
              let provinces = res.data.data;
              this.setState({ provinces: provinces })
            }
          }).catch(error => {})
    }

    getDistricts (province_id) {
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/districts?province_id=${province_id}`, this.config())
        .then(res => {
            if (res && res.data && res.data.data) {
                let districts = res.data.data;
                this.setState({ districts: districts })
            }
        }).catch(error => {})
    }

    getWards (district_id) {
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/wards?district_id=${district_id}`, this.config())
        .then(res => {
            if (res && res.data && res.data.data) {
                let wards = res.data.data;
                this.setState({ wards: wards })
            }
        }).catch(error => {})
    }

    getLocationName = (name, locationId) => {
        const locations = this.state[name];
        const location = locations.filter(item => item.ID == locationId);
        return location[0];
    }

    setMainAddress = (field, locationName) => {
        let address = {...this.state.address};
        address.main[field] = locationName;
        this.setState({address: address});
    }

    updateCountry (item) {
        this.setState({ country: item, provinces: [], province: null, districts: [], district: null, wards: [], ward: null, streetName: null})
        this.getProvices(item.value)
    }

    updateProvice (item) {
        this.setState({ province: item, districts: [], district: null, wards: [], ward: null, streetName: null})
        this.getDistricts(item.value)
    }

    updateDistrict (item) {
        this.setState({ district: item, wards: [], ward: null, streetName: null})
        this.getWards(item.value)
    }

    updateWard (item) {
        this.setState({ ward: item, streetName: null})
    }

    updateStreetName (e) {
        const value = e.target.value;
        this.setState({street_name: value});
    }

    handleChange(name, oldLabel, item) {
        if (name === "Country" || name === "TempCountry") {
            const country = this.getLocationName("countries", item.value);
            this.setMainAddress("countryId", country.ID);
            this.setMainAddress("countryName", country.TEXT);
            this.setMainAddress("oldCountryName", oldLabel);
            this.setState({country: item.value});
        } else if (name === "Province" || name === "TempProvince") {
            const province = this.getLocationName("provinces", item.value);
            this.setMainAddress("provinceId", province.ID);
            this.setMainAddress("provinceName", province.TEXT);
            this.setMainAddress("oldProvinceName", oldLabel);
        } else if (name === "District" || name === "TempDistrict") {
            const district = this.getLocationName("districts", item.value);
            this.setMainAddress("districtId", district.ID);
            this.setMainAddress("districtName", district.TEXT);
            this.setMainAddress("oldDistrictName", oldLabel);
        } else if (name === "Wards" || name === "TempWards") {
            const ward = this.getLocationName("wards", item.value);
            this.setMainAddress("wardId", ward.ID);
            this.setMainAddress("wardName", ward.TEXT);
            this.setMainAddress("oldWardName", oldLabel);
        } else {
            this.setMainAddress("oldStreetName", oldLabel);
        }

        const resetList = {
            Country: ['province_id', 'district_id', 'ward_id', 'street_name'],
            Province: ['district_id', 'ward_id', 'street_name'],
            District: ['ward_id', 'street_name'],
            Wards: ['street_name'],
        }
        if (name !== "StreetName") {
            resetList[name].forEach(name => {
                this.props.updateAddress(name, '', this.state.address.main)
            })
        }
        if (name === 'Country') {
            this.setState({provinces: [], districts: [], wards: []})
            this.getProvices(item.value)
        }
        if (name === 'Province') {
            this.setState({districts: [], wards: []})
            this.getDistricts(item.value)
        }
        if (name === 'District') {
            this.setState({wards: []})
            this.getWards(item.value)
        }
        if (name === 'StreetName') {
            const value = item.target.value;
            this.setState({street_name: value});
            this.setMainAddress("streetName", value);
        }
        this.props.updateAddress(name, item, this.state.address.main)
    }

    save () {
        this.props.updateAddress(this.state.country, this.state.province, this.state.district, this.state.ward, this.state.street_name)
    }

    render () {
        const provinces = this.state.provinces.map(province =>  { return { value: province.ID, label: province.TEXT } } )
        const districts = this.state.districts.map(district =>  { return { value: district.ID, label: district.TEXT } } )
        const wards = this.state.wards.map(ward =>  { return { value: ward.ID, label: ward.TEXT } } )
        const countries = this.props.countries.map(country =>  { return { value: country.ID, label: country.TEXT } } )

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
                            <Select options={countries} placeholder="Lựa chọn Quốc gia" isClearable={true} onChange={this.updateCountry.bind(this)} value={this.state.country}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5">
                            Tỉnh / thành phố
                        </div>
                        <div className="col-7">
                            <Select options={provinces} isClearable={true} placeholder="Lựa chọn Tỉnh/Thành phố" onChange={this.updateProvice.bind(this)} value={this.state.province}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5">
                            Quận/Huyện
                        </div>
                        <div className="col-7">
                            <Select options={districts} isClearable={true} placeholder="Lựa chọn Quận/Huyện" onChange={this.updateDistrict.bind(this)} value={this.state.district}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5">
                           Xã/Phường
                        </div>
                        <div className="col-7">
                            <Select options={wards} isClearable={true} placeholder="Lựa chọn Xã/Phường" onChange={this.updateWard.bind(this)} value={this.state.warrd}/>
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
                    <hr/>
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
