import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useGuardStore } from 'modules'

const UserInfo = (props) => {
    const guard = useGuardStore()
    const user = guard.getCurentUser()
    const { t } = useTranslation()
    const [expanded, setExpanded] = useState(false)
 
    return (
        <div className="user-info">
            <h2>Thông tin CBNV tạo yêu cầu</h2>
            <div className="content-region shadow-customize">
                <div className="row-customize d-flex">
                    <div className="col-item full-name">
                        <label>Họ và tên</label>
                        <div className="val">{user?.fullName}</div>
                    </div>
                    <div className="col-item employee-code">
                        <label>Mã nhân viên</label>
                        <div className="val">{user?.employeeNo}</div>
                    </div>
                    <div className="col-item employee-ad">
                        <label>Mã AD</label>
                        <div className="val">{user?.ad}</div>
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
                                    <div className="val">{user?.cell_phone_no}</div>
                                </div>
                                <div className="col-item employee-code">
                                    <label>Email</label>
                                    <div className="val">{user?.plEmail}</div>
                                </div>
                                <div className="col-item">
                                    <label>Chức danh</label>
                                    <div className="val">{user?.jobTitle}</div>
                                </div>
                            </div>
                            <div className="row-customize d-flex">
                                <div className="col-item single">
                                    <label>Khối/Phòng/Bộ phận</label>
                                    <div className="val">{user?.department}</div>
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
