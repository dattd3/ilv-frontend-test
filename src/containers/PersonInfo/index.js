import React from "react";
import { useTranslation } from "react-i18next";
import './PersonInfo.css';

function PersonInfo() {
    const { t } = useTranslation();

    return (
      <div className="bgColor">
      <br/>

      {/* THÔNG TIN CÁ NHÂN */}

      <div class='headerText'>THÔNG TIN CÁ NHÂN</div>
      <table>
      <thead>
        <tr>
          <th className="table-header">Họ và tên</th>
          <th className="table-header">Mã nhân viên</th>
          <th className="table-header column-end">Master Code</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td className="table-content">
              <div className="bgText"> Nguyễn Đức Chiến </div>
          </td>
          <td >
              <div className='bgText'> 03603602 </div>
          </td>
          <td className="column-end">
              <div className='bgText'>VG225698 </div>
          </td>
        </tr>
        </tbody>
        </table>
        <br/><br/>

        {/*THÔNG TIN CÔNG VIỆC*/}

        <div className='headerText'>THÔNG TIN CÔNG VIỆC </div>
        <table>
        <thead>
          <tr>
              <td className="table-header">Thông tin pháp lý</td>
              <td className="table-header">P&L</td>
              <td className="table-header">Ban/Chuỗi/Khối</td>
          </tr>
          </thead>
          <tbody>
          <tr>
              <td className="table-content">
                    <div className='bgText'> Công ty Cổ phần Vinpearl </div>
              </td>
              <td >
                    <div className='bgText'> Công ty Vinpearl </div>
              </td>
              <td className="column-end">
                    <div className='bgText'> Dự án Chuyển đổi kỹ thuật số </div>
              </td>
           </tr>
           </tbody>
           <thead>
             <tr>
                 <td className="table-header">Phòng/Vùng/Miền</td>
                 <td className="table-header">Đơn vị thành viên</td>
                 <td className="table-header">Phòng/Bộ phận/Nhóm</td>
             </tr>
             </thead>
             <tbody>
             <tr>
                 <td className="table-content">
                       <div className='bgText'> Head Office</div>
                 </td>
                 <td >
                       <div className='bgText'> Dự án Chuyển đổi kỹ thuật số </div>
                 </td>
                 <td className="column-end">
                       <div className='bgText'> Phòng chuyển đổi kỹ thuật số </div>
                 </td>
              </tr>
              </tbody>

              <thead>
                <tr>
                    <td className="table-header">Nhóm chức danh</td>
                    <td className="table-header">Chức danh</td>
                    <td className="table-header">Cấp bậc</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="table-content">
                          <div className='bgText'> Chuyên viên</div>
                    </td>
                    <td >
                          <div className='bgText'> Chuyên viên thiết kế </div>
                    </td>
                    <td className="column-end">
                          <div className='bgText'> CV3 </div>
                    </td>
                 </tr>
                 </tbody>

                 <thead>
                   <tr>
                       <td className="table-header">Phân loại nhân viên</td>
                       <td className="table-header">SĐT cố định - Số máy lẻ</td>
                       <td className="table-header">Số di động</td>
                   </tr>
                   </thead>
                   <tbody>
                   <tr>
                       <td className="table-content">
                             <div className='bgText'> </div>
                       </td>
                       <td >
                             <div className='bgText'> 0243 974 9999 </div>
                       </td>
                       <td className="column-end">
                             <div className='bgText'> 0987 498238 </div>
                       </td>
                    </tr>
                    </tbody>

                    <thead>
                      <tr>
                          <td className="table-header">Email</td>
                          <td className="table-header">Ngày vào Tập đoàn</td>
                          <td className="table-header">Ngày vào Công ty</td>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                          <td className="table-content">
                                <div className='bgText'> V.CHIENND4@VINPEARL.COM</div>
                          </td>
                          <td >
                                <div className='bgText'> 9/9/2019 </div>
                          </td>
                          <td className="colum-end">
                                <div className='bgText'> 9/9/2019 </div>
                          </td>
                       </tr>
                       </tbody>

                       <thead>
                         <tr>
                             <td className="table-header">Loại hợp đồng</td>
                             <td className="table-header">Ngày bắt đầu hợp đồng</td>
                             <td className="table-header">Ngày hết hạn hợp đồng</td>
                         </tr>
                         </thead>
                         <tbody>
                         <tr>
                             <td className="table-content">
                                   <div className='bgText'> Hợp đồng vô thời hạn</div>
                             </td>
                             <td >
                                   <div className='bgText'> 09/11/2019 </div>
                             </td>
                             <td className="column-end">
                                   <div className='bgText'> </div>
                             </td>
                          </tr>
                          </tbody>

                          <thead>
                            <tr>
                                <td className="table-header" colspan="3">Địa chỉ làm việc</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="table-content column-end" colspan="3">
                                      <div className='bgText'> Số 7 đường bằng lăng 1, KĐT Sinh thái Vinhomes Riverside, phường Việt Hưng</div>
                                </td>
                             </tr>
                             </tbody>

         </table>

         {/* QUÁ TRÌNH CÔNG TÁC */}
         <br/><br/>
         <div class='headerText'>QUÁ TRÌNH CÔNG TÁC</div>
         <table>
         <thead>
           <tr>
             <th className="table-header">P&L</th>
             <th className="table-header">Từ ngày</th>
             <th className="table-header column-end">Đến ngày</th>
           </tr>
           </thead>
           <tbody>
           <tr>
             <td className="table-content">
                 <div className="bgText">Công ty Vinpearl</div>
             </td>
             <td >
                 <div className='bgText'> 9/9/2019 </div>
             </td>
             <td className="column-end">
                 <div className='bgText'> 9/9/2020 </div>
             </td>
           </tr>
           </tbody>

           <thead>
             <tr>
               <th className="table-header">Loại hợp đồng</th>
               <th className="table-header">Chức danh</th>
               <th className="table-header column-end">Cấp bậc</th>
             </tr>
             </thead>
             <tbody>
             <tr>
               <td className="table-content">
                   <div className="bgText">HĐLĐ 1 năm</div>
               </td>
               <td >
                   <div className='bgText'> Chuyên viên phát triển ứng dụng </div>
               </td>
               <td className="column-end">
                   <div className='bgText'> Chuyên viên </div>
               </td>
             </tr>
             </tbody>

           </table>
           <br/><br/>

           {/* KHEN THƯỞNG THÀNH TÍCH */}
           <div class='headerText'>KHEN THƯỞNG THÀNH TÍCH</div>
           <table>
           <thead>
             <tr>
               <th className="table-header">Bình chọn cuối năm</th>
               <th className="table-header">Hội thi văn nghệ</th>
               <th className="table-header column-end">Hội thi thể thao</th>
             </tr>
             </thead>
             <tbody>
             <tr>
               <td className="table-content">
                   <div className="bgText">Nhân viên xuất sắc nhất năm</div>
               </td>
               <td >
                   <div className='bgText'> Giải nhất </div>
               </td>
               <td className="column-end">
                   <div className='bgText'> Giải nhì </div>
               </td>
             </tr>
             </tbody>
             </table>
             <br/><br/>

             {/* KỶ LUẬT */}
             <div class='headerText'>KỶ LUẬT</div>
             <table>
             <thead>
               <tr>
                 <th className="table-header">Trang phục</th>
                 <th className="table-header">Lưu trữ dữ liệu</th>
                 <th className="table-header column-end">Gửi mail</th>
               </tr>
               </thead>
               <tbody>
               <tr>
                 <td className="table-content">
                     <div className="bgText">Không đúng quy định ngày 20/9/2019</div>
                 </td>
                 <td >
                     <div className='bgText'> Không đúng quy định ngày 10/6/2019 </div>
                 </td>
                 <td className="column-end">
                     <div className='bgText'> Không đúng quy định ngày 15/4/2019 </div>
                 </td>
               </tr>
               </tbody>
               </table>
               <br/>

        </div>
    );
}
export default PersonInfo;
