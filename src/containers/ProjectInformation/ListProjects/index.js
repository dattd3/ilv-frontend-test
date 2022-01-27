import React from 'react';
// import BenefitItem from './BenefitItem'
// import { useApi, useFetcher } from "../../modules";
// import NoteItem from './NoteItem'
// import IconLevelUrl from '../../assets/img/icon-level.svg'
 
function ListProjects() {
//   var benefitLevel = localStorage.getItem('benefitLevel');  
//   var benefitTitle = localStorage.getItem('benefitTitle'); 
  
//   var result = usePreload([benefitLevel.toLowerCase()]);
//   if(result && result.data) {
//     var items = result.data;
    return (     
        <div className="timesheet-section department-timesheet">
            <h1 className="content-page-header">danh mục dự án</h1>
            <div className="table-customize">
                <div className='head'>
                    <div className='row-customize'>
                        <div className='col-customize no'>#</div>
                        <div className='col-customize project-name'>Tên dự án</div>
                        <div className='col-customize short-name'>Tên rút gọn</div>
                        <div className='col-customize manager'>Quản lý dự án</div>
                        <div className='col-customize request-summary'>Tóm tắt yêu cầu</div>
                        <div className='col-customize customer'>
                            <div className='col-top'>Khách hàng</div>
                            <div className='col-bottom'>
                                <div className='first'>P&L</div>
                                <div className='second'>Khối</div>
                            </div>
                        </div>
                        <div className='col-customize time'>
                            <div className='col-top'>Thời gian</div>
                            <div className='col-bottom'>
                                <div className='first'>Ngày bắt đầu</div>
                                <div className='second'>Ngày kết thúc</div>
                            </div>
                        </div>
                        <div className='col-customize status'>Trạng thái</div>
                    </div>
                </div>
                <div className='body'>
                    <div className='row-customize'>
                        <div className='col-customize data no'>1</div>
                        <div className='col-customize data project-name'>ILoveVingroup</div>
                        <div className='col-customize data short-name'>ILVG</div>
                        <div className='col-customize data manager'>Trần Văn Pháp</div>
                        <div className='col-customize data request-summary'>Dự án chuyển đổi số cho Quản lý Nhân sự</div>
                        <div className='col-customize data pnl'>VG</div>
                        <div className='col-customize data block'>Quản lý Nhân sự & Đào tạo</div>
                        <div className='col-customize data start-date'>01/06/2021</div>
                        <div className='col-customize data end-date'>31/12/2022</div>
                        <div className='col-customize data status'>Open</div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ListProjects
