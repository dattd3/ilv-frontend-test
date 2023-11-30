import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

const UserInfo = (props) => {
    const { t } = useTranslation()
    const [expanded, setExpanded] = useState(false)
 
    return (
        <div className="user-info">
            <h2>Thông tin CBNV tạo yêu cầu</h2>
            <div className="content-region shadow-customize">
                <div className="row-customize d-flex">
                    <div className="col-item full-name">
                        <label>Họ và tên</label>
                        <div className="val">Trần Tuấn Anh</div>
                    </div>
                    <div className="col-item employee-code">
                        <label>Mã nhân viên</label>
                        <div className="val">3651641</div>
                    </div>
                    <div className="col-item employee-ad">
                        <label>Mã AD</label>
                        <div className="val">anhnt35</div>
                    </div>
                    <div className="col-item view-more">
                        <label>&nbsp;</label>
                        <div className={`val ${expanded ? 'expanded' : 'collapsed'}`} onClick={() => setExpanded(!expanded)}>{expanded ? 'Thu gọn' : 'Xem thêm'}</div>
                    </div>
                </div>
                {
                    expanded && (
                        <>
                            <div className="row-customize d-flex">
                                <div className="col-item full-name">
                                    <label>Số điện thoại</label>
                                    <div className="val">0979458869</div>
                                </div>
                                <div className="col-item employee-code">
                                    <label>Email</label>
                                    <div className="val">cuongcntt89@gmail.com</div>
                                </div>
                                <div className="col-item">
                                    <label>Chức danh</label>
                                    <div className="val">Chuyên viên Phát triển sản phẩm</div>
                                </div>
                            </div>
                            <div className="row-customize d-flex">
                                <div className="col-item single">
                                    <label>Khối/Phòng/Bộ phận</label>
                                    <div className="val">Phòng phát triển Sản phẩm</div>
                                </div>
                            </div>       
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default UserInfo
