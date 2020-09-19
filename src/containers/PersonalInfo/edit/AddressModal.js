import React from "react";
import { Modal } from 'react-bootstrap'
import Select from 'react-select'
import axios from 'axios'

class AddressModal extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            provinces: [],
            districts: [],
            wards: []
        }
      }
    
      componentDidMount() {
        let config = {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
            'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
          }
        }
    
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/provinces?country_id=vn`, config)
          .then(res => {
            if (res && res.data && res.data.data) {
              let provinces = res.data.data;
              this.setState({ provinces: provinces })
            }
          }).catch(error => {})
        
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/districts?province_id=${this.props.province_id}`, config)
        .then(res => {
            if (res && res.data && res.data.data) {
                let districts = res.data.data;
                this.setState({ districts: districts })
            }
        }).catch(error => {})

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/wards?district_id=${this.props.district_id}`, config)
        .then(res => {
            if (res && res.data && res.data.data) {
                let wards = res.data.data;
                this.setState({ wards: wards })
            }
        }).catch(error => {})
    }

    render () {
        const provinces = this.state.provinces.map(province =>  { return { value: province.ID, label: province.TEXT } } )
        const districts = this.state.districts.map(district =>  { return { value: district.ID, label: district.TEXT } } )
        const wards = this.state.wards.map(ward =>  { return { value: ward.ID, label: ward.TEXT } } )
  
        return (
            <>
            <Modal className='info-modal-common position-apply-modal' centered show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row mb-2">
                        <div className="col-5">
                            Tỉnh / thành phố
                        </div>
                        <div className="col-7">
                        <Select options={provinces} value={provinces.filter(p => p.value == this.props.province_id)}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5">
                            Quận/Huyện
                        </div>
                        <div className="col-7">
                            <Select options={districts} value={districts.filter(d => d.value == this.props.district_id)}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5">
                            Khu vực
                        </div>
                        <div className="col-7">
                            <Select options={wards} value={wards.filter(w => w.value == this.props.ward_id)}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-5">
                            Đường phố
                        </div>
                        <div className="col-7">
                            <input className="form-control" value={this.props.street_name} type="text" placeholder="Nhập đường phố"/>
                        </div>
                    </div>
                    <hr/>
                    <div className="clearfix">
                        <button type="button" className="btn btn-primary float-right w-25">Cập nhập</button>
                        <button type="button" className="btn btn-secondary float-right mr-2 w-25" onClick={this.props.onHide}>Thoát</button>
                    </div>
                </Modal.Body>
            </Modal>
            </>
        )
    }
}
export default AddressModal
