import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import './PersonInfo.css';
import { useApi, useFetcher } from "../../modules";

const usePreload = (params) => {
    const api = useApi();
    const [user = undefined, err] = useFetcher({
        api: api.fetchPersonCommonInfo,
        autoRun: true,
        params: params
    });
    return user;
};



function PersonInfo() {
    const { t } = useTranslation();
    //console.log('******* DAY LA PHAN GHI LOG *******');
    let objDataRes = usePreload([]);

    if (objDataRes) {

     let personCommonInfo = objDataRes.PersonCommonInfo;
     let curriculumVitae = objDataRes.CurriculumVitae;

      return (
        <div className="bgColor">
        <br/>

        {/* THÔNG TIN CÁ NHÂN */}

        <div className='headerText'>THÔNG TIN CÁ NHÂN</div>

        <table>
        <thead>
          <tr>
            <th className="table-header">Họ và tên</th>
            <th className="table-header">Mã nhân viên</th>
            <th className="table-header">P&L</th>
            <th className="table-header">Chức danh</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td className="table-content">
                <div className="bgText"> {personCommonInfo.FullName} </div>
            </td>
            <td >
                <div className='bgText'> {personCommonInfo.PersonNo} </div>
            </td>
            <td>
                <div className="bgText"> {personCommonInfo.PAndL} </div>
            </td>
            <td>
                <div className="bgText div-end"> {personCommonInfo.Position} </div>
            </td>
          </tr>
          </tbody>

          </table>
          <br/>

    {/*ĐỊA CHỈ HIỆN TẠI*/}
    <div className='headerText'>ĐỊA CHỈ HIỆN TẠI</div>
      <table>
            <thead>
              <tr>
                <th className="table-header">Quốc gia</th>
                <th className="table-header">Tỉnh / Thành phố</th>
                <th className="table-header">Quận / Huyện</th>
                <th className="table-header">Địa chỉ</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td className="table-content">
                    <div className="bgText"> {curriculumVitae.HT_QuocGia} </div>
                </td>
                <td >
                    <div className='bgText'> {curriculumVitae.HT_ThanhPho} </div>
                </td>
                <td >
                    <div className='bgText'> {curriculumVitae.HT_QuanHuyen} </div>
                </td>
                <td>
                    <div className="bgText div-end"> {curriculumVitae.HT_DiaChi} </div>
                </td>
              </tr>
              </tbody>
          </table>
          <br/>

      {/* CMND / THẺ CĂN CƯỚC */}
      <div className='headerText'>CMND / THẺ CĂN CƯỚC</div>
        <table>
                  <thead>
                    <tr>
                      <th className="table-header">Số CMND / Thẻ căn cước</th>
                      <th className="table-header">Ngày cấp</th>
                      <th className="table-header">Nơi cấp</th>
                      <th className="table-header"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td className="table-content">
                          <div className="bgText"> {curriculumVitae.SoCMND} </div>
                      </td>
                      <td >
                          <div className='bgText'> {curriculumVitae.NgayCapCMND} </div>
                      </td>
                      <td>
                          <div className="bgText div-end"> {curriculumVitae.NoiCapCMND} </div>
                      </td>
                    </tr>
                    </tbody>
        </table>
        <br/>

        {/* THÔNG TIN TÀI KHOẢN */}
          <div className='headerText'>THÔNG TIN TÀI KHOẢN</div>
           <table>
                  <thead>
                    <tr>
                      <th className="table-header">Mã số thuế</th>
                      <th className="table-header">Số BHXH</th>
                      <th className="table-header">Số thẻ VinID</th>
                      <th className="table-header">Số TK ngân hàng</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td className="table-content">
                          <div className="bgText"> {curriculumVitae.MaSoThue} </div>
                      </td>
                      <td >
                          <div className='bgText'> {curriculumVitae.SoBHXH} </div>
                      </td>
                      <td >
                          <div className='bgText'> {curriculumVitae.SoTheVinID} </div>
                      </td>
                      <td >
                          <div className='bgText div-end'> {curriculumVitae.SoTaiKhoan} </div>
                      </td>
                    </tr>
                    </tbody>

                    <thead>
                      <tr>
                        <th className="table-header">Ngân hàng</th>
                      </tr>
                   </thead>
                  <tbody>
                      <tr>
                          <td className="table-content" colspan="2">
                              <div className="bgText"> {curriculumVitae.Bank} </div>
                          </td>
                      </tr>
                  </tbody>
             </table>
            <br/>

        {/* THÔNG TIN NGƯỜI THÂN */}
        <div className='headerText'>THÔNG TIN NGƯỜI THÂN</div>

         {
          curriculumVitae.ListFamily.map(function (obj, i) {
              return (
           <table className="no-border">
                <thead>
                  <tr>
                    <th className="table-header">Họ tên</th>
                    <th className="table-header">Ngày sinh</th>
                    <th className="table-header">Mối quan hệ</th>
                    <th className="table-header">Giảm / Trừ gia cảnh</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td className="table-content">
                        <div className="bgText"> {obj.HoVaTen} </div>
                    </td>
                    <td >
                        <div className='bgText'> {obj.NgaySinh} </div>
                    </td>
                    <td >
                        <div className='bgText'> {obj.MoiQuanHe} </div>
                    </td>
                    <td>
                        <div className="bgText div-end"> {obj.NgayHieuLucGiamTru} </div>
                    </td>
                  </tr>
                  </tbody>
              </table>
              );
            })
          }

        <br/>

        </div>
      );
    }else {
      return null;
    }

}
export default PersonInfo;
