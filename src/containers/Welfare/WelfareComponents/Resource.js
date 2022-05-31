import React from 'react'
import { withTranslation } from 'react-i18next'
import Download from "../../../assets/img/icon/ic_download.svg";

function Resource(props) {
    const { t } = props
    const regime = [
        {
            id: '01',
            service: 'Ưu đãi cho bản thân (Phòng và các dịch vụ theo gói phòng)',
            welfare: 'Miễn phí 3 đêm phòng'
        },
        {
            id: '02',
            service: 'Ưu đãi cho bản thân (Phòng và các dịch vụ theo gói phòng)',
            welfare: 'Giảm 50%'
        },
        {
            id: '03',
            service: 'Các dịch vụ khác',
            welfare: 'Giảm 10% dịch vụ tour'
        }
    ]
    const bookingInfo = [
        {
            id: '01',
            name: 'Vinpearl Luxury Nha Trang',
            email: 'res.VPLRNT@vinpearl.com',
            phone: '84-203 385 7858'
        },
        {
            id: '02',
            name: 'Vinpearl Luxury Đà Nẵng',
            email: 'res.VPLRNT@vinpearl.com',
            phone: '84-203 385 7858'
        },
        {
            id: '03',
            name: 'Vinpearl Resort & Spa Ha Long',
            email: 'res.VPLRNT@vinpearl.com',
            phone: '84-203 385 7858'
        },
    ]
    return (
        <div className='resource'>
            <div className='title-group'>
                I. {t('RegimeInfo')}
            </div>

            <div className="card border shadow regime-contain">
                <div className='box table-content'>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '4%' }}>STT</th>
                                <th style={{ width: '56%' }}>Dịch vụ</th>
                                <th style={{ width: '40%' }}>Chế độ phúc lợi</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                regime?.length > 0 ?
                                    regime.map((item, index) => {
                                        return <tr key={index}>
                                            <td style={{ width: '4%' }}>{item.id}</td>
                                            <td className="text-left" style={{ width: '56%' }}>{item.service}</td>
                                            <td className="text-left" style={{ width: '40%' }}>{item.welfare}</td>

                                        </tr>
                                    })
                                    :
                                    null
                            }
                        </tbody>
                    </table>
                </div>

            </div>


            <div className='title-group'>
                II. {t('instruct')}
            </div>

            <div className="card border shadow regime-contain">

                <div className='download-contain'>
                    <div className='title'>
                        Download form và điền thông tin theo mẫu sau
                    </div>

                    <button type="button" className="btn btn-primary ml-3 shadow" style={{backgroundColor: '#6CB5F9', borderColor: '#6CB5F9', padding: '4px 12px'}}>
                    <img src={Download} className="mr-2" />{"Tải về"}</button>

                </div>
                <div className='divider'></div>
                <div className='booking-info'>
                    THÔNG TIN LIÊN HỆ ĐẶT PHÒNG
                </div>
                <div className='box table-content'>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '4%' }}>STT</th>
                                <th style={{ width: '56%' }}>Khách sạn</th>
                                <th style={{ width: '20%' }}>Email Đặt phòng</th>
                                <th style={{ width: '20%' }}>SĐT Đặt Phòng</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                bookingInfo?.length > 0 ?
                                bookingInfo.map((item, index) => {
                                        return <tr key={index}>
                                            <td style={{ width: '4%' }}>{item.id}</td>
                                            <td className="text-left" style={{ width: '56%' }}>{item.name}</td>
                                            <td className="text-left" style={{ width: '20%' }}>{item.email}</td>
                                            <td className="text-left" style={{ width: '20%' }}>{item.phone}</td>

                                        </tr>
                                    })
                                    :
                                    null
                            }
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default withTranslation()(Resource);