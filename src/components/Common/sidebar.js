/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import map from '../../containers/map.config';

function SideBar(props) {
    return (
        <>
            <ul className="navbar-nav bg-vp-blue sidebar sidebar-dark accordion" id="accordionSidebar">
                <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                    <div className="sidebar-brand-text mx-3">MyVinpearl</div>
                </a>
                <hr className="sidebar-divider my-0" />
                <li className="nav-item active">
                    <a className="nav-link" href="/">
                        <i className="fas fa-fw fa-bars"></i>
                        <span>Danh mục</span></a>
                </li>
                <hr className="sidebar-divider" />
                <div className="sidebar-heading">Training</div>
                <li className="nav-item">
                    <a className="nav-link collapsed" href={map.Certification} aria-expanded="true" aria-controls="collapseTwo">
                        <i className="fas fa-fw fa-graduation-cap"></i>
                        <span>Đào tạo</span>
                    </a>
                    <div id="collapseTwo" className="collapse show" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                        <div className="py-2 collapse-inner rounded">
                            <a className="collapse-item" href="#">Học tập</a>
                            <a className="collapse-item" href="#">Giảng dạy</a>
                            <a className="collapse-item" href={map.Roadmap}>Lộ trình đào tạo</a>
                            <a className="collapse-item" href="#">Thi tay nghề</a>
                            <a className="collapse-item" href="#">Chỉ tiêu đào tạo</a>
                        </div>
                    </div>
                </li>
            </ul>
        </>
    );
}
export default SideBar;
