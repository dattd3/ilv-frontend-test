import React from "react";
import { Modal } from 'react-bootstrap'
import Select from 'react-select'
import axios from 'axios'

class AddressModal extends React.Component {
    constructor(props) {
        super();
    
        this.state = {
            provinces: [],
            districts: [],
            wards: [],
            street_name: props.street_name,
            address: {
                main: {
                    streetName: "",
                    wardName: "",
                    districtName: "",
                    provinceName: "",
                    oldStreetName: "",
                    oldWardName: "",
                    oldDistrictName: "",
                    oldProvinceName: "",
                    wardId: props.ward_id,
                    districtId: props.district_id,
                    provinceId: props.province_id
                },
                temp: {
                    streetName: "",
                    wardName: "",
                    districtName: "",
                    provinceName: "",
                    oldStreetName: "",
                    oldWardName: "",
                    oldDistrictName: "",
                    oldProvinceName: "",
                    wardId: props.ward_id,
                    districtId: props.district_id,
                    provinceId: props.province_id
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
        }
    }

    componentDidMount() {
        this.getProvices(this.props.country_id)
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

    handleChange(name, oldLabel, item) {
        if (name === "Province" || name === "TempProvince") {
            const province = this.getLocationName("provinces", item.value);
            this.setMainAddress("provinceId", province.ID);
            this.setMainAddress("provinceName", province.TEXT);
            this.setMainAddress("oldProvinceName", oldLabel);
        } else if (name === "District" || name === "TempDistrict") {
            const district = this.getLocationName("districts", item.value);
            this.setMainAddress("districtId", district.ID);
            this.setMainAddress("districtName", district.TEXT);
            this.setMainAddress("oldDistrictName", oldLabel);
        } else if (name === "Wards" || name === "Wards") {
            const ward = this.getLocationName("wards", item.value);
            this.setMainAddress("wardId", ward.ID);
            this.setMainAddress("wardName", ward.TEXT);
            this.setMainAddress("oldWardName", oldLabel);
        }
        this.setMainAddress("oldStreetName", oldLabel);
        const resetList = {
            country_id: ['province_id', 'district_id', 'ward_id', 'street_name'],
            Province: ['district_id', 'ward_id', 'street_name'],
            District: ['ward_id', 'street_name'],
            Wards: ['street_name'],
        }
        if (name !== "StreetName") {
            resetList[name].forEach(name => {
                this.props.updateAddress(name, '', this.state.address.main)
            })
        }
        if (name === 'country_id') {
            this.setState({districts: [], wards: []})
            this.getProvices(item.value)
        }
        if (name === 'Province') {
            this.setState({districts: [], wards: []})
            this.getDistricts(item.value)
        }
        if (name === 'District') {
            this.getWards(item.value)
        }
        if (name === 'StreetName') {
            const value = item.target.value;
            this.setState({street_name: value});
            this.setMainAddress("streetName", value);
        }

        this.props.updateAddress(name, item, this.state.address.main)
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
                            <Select options={countries} onChange={this.handleChange.bind(this, 'country_id')} value={countries.filter(c => c.value == this.props.country_id)}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5">
                            Tỉnh / thành phố
                        </div>
                        <div className="col-7">
                        <Select options={provinces} onChange={this.handleChange.bind(this, 'Province', this.props.province_name)} value={provinces.filter(p => p.value == this.props.province_id)}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5">
                            Quận/Huyện
                        </div>
                        <div className="col-7">
                            <Select options={districts} onChange={this.handleChange.bind(this, 'District', this.props.district_name)} value={districts.filter(d => d.value == this.props.district_id)}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5">
                            Phường
                        </div>
                        <div className="col-7">
                            <Select options={wards} onChange={this.handleChange.bind(this, 'Wards', this.props.ward_name)} value={wards.filter(w => w.value == this.props.ward_id)}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5">
                            Đường phố
                        </div>
                        <div className="col-7">
                            <input className="form-control" value={this.state.street_name} onChange={this.handleChange.bind(this, 'StreetName', this.props.street_name_old)} type="text" placeholder="Nhập đường phố" />
                        </div>
                    </div>
                    <hr/>
                    <div className="clearfix">
                        <button type="button" className="btn btn-secondary float-right mr-2 w-25" onClick={this.props.onHide}>Thoát</button>
                    </div>
                </Modal.Body>
            </Modal>
            </>
        )
    }
}
export default AddressModal
