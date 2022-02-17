import React from "react"
import { Image } from 'react-bootstrap'
import IconDat from '../../../assets/img/icon/Icon_star.svg'
import IconKhongDat from '../../../assets/img/icon/Icon_Khongdat.svg'
import IconVuotTroi from '../../../assets/img/icon/Icon_Vuottroi.svg'
import IconSoDuAn from '../../../assets/img/icon/Icon_Soduan.svg'
import IconMaNhanVien from '../../../assets/img/icon/Icon_Manhanvien.svg'
import IconEmail from '../../../assets/img/icon/Icon_Email.svg'
import IconKyNang from '../../../assets/img/icon/Icon_Kynang.svg'
import IconViTri from '../../../assets/img/icon/Icon_Vitri.svg'
import IconThamNien from '../../../assets/img/icon/Icon_Thamnien.svg'

function UserInfo(props) {
    const { userInfo } = props

    return (
        <div className="info">
            <div className="left">
                <div className="left-content">
                    <div className="avatar-block">
                        <div className="avatar-image">
                            <Image src={`data:image/png;base64,${userInfo?.avatar}`} alt="Avatar" className="avatar"
                                onError={(e) => {
                                    e.target.src = "/LogoVingroupCircle.svg"
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="right">
                <div className="right-content">
                    <div className="info-detail">
                        <div className="full-name-and-job-title">
                            <div className="full-name">{userInfo?.fullName || ""}</div>
                            <div className="job-title">{userInfo?.postition || ""}</div>
                        </div>
                        <div className="other-info">
                            <div className="row-info">
                                <span className="code"><Image src={IconMaNhanVien} alt="Mã nhân viên" />Mã NV: {userInfo?.employeeNo || ""}</span>
                                <span className="email"><Image src={IconEmail} alt="Email" />Email: {userInfo?.email || ""}</span>
                                <span className="seniority"><Image src={IconThamNien} alt="Thâm niên" />Thâm niên: {userInfo?.yearNumber || ""} năm</span>
                            </div>
                            <div className="row-info">
                                <span className="position"><Image src={IconViTri} alt="Vị trí" />Năng lực chuyên môn: {userInfo?.postition || ""}</span>
                            </div>
                            <div className="row-info">
                                <span className="skill-block">
                                    <Image src={IconKyNang} alt="Kỹ năng" />Kỹ năng: 
                                    <span className="list-skill">
                                    {
                                        (userInfo?.skills || []).map((item, i) => {
                                            return <span className="skill" key={i}>{item || ""}</span>
                                        })
                                    }
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="project-info-detail">
                        <div className="report">
                            <ul>
                                <li>
                                    <span className="icon"><Image src={IconSoDuAn} alt='Số dự án' /></span>
                                    <span>Số dự án: {userInfo?.projectNumber || 0}</span>
                                </li>
                                <li>
                                    <span className="icon"><Image src={IconVuotTroi} alt='Vượt trội' /></span>
                                    <span>Vượt trội: {userInfo?.outstanding || 0}</span>
                                </li>
                                <li>
                                    <span className="icon"><Image src={IconDat} alt='Đạt' /></span>
                                    <span>Đạt: {userInfo?.achieved || 0}</span>
                                </li>
                                <li>
                                    <span className="icon"><Image src={IconKhongDat} alt='Không đạt' /></span>
                                    <span>Không đạt: {userInfo?.notAchieved || 0}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInfo
