import React, { useState } from "react";
import { useApi, useFetcher } from "../../../modules";
import { useTranslation } from "react-i18next";

const listItems = [
    {name:"Tinh thần thái độ", selfRate:16, managerRate:20, Score: 18},
    {name:"Năng lực lãnh đạo", selfRate:12, managerRate:20, Score: 16},
    {name:"Năng lực chuyên môn", selfRate:18, managerRate:20, Score: 19},
    {name:"Nội dung công việc", selfRate:20, managerRate:20, Score: 20}    
  ];

const usePreload = (params) => {
  const api = useApi();
  const [data = [], err] = useFetcher({
    api: api.fetchListNotification,
    autoRun: true,
    params: params
  });
  return data;
};


function General(props) {
  const { t } = useTranslation();  
  document.title = t("KPI Detail");  
  
  const style = {
      'border': '1px solid #B3B3B3',      
      'text-align': 'center',
      'color': 'black'
    };

  const styleTieuDeNhanVien = {
      'text-align': 'left',
      'font': 'Light 21px/25px Helvetica Neue',
      'letter-spacing': '0px',
      'color': '#B3B3B3',
      'margin-bottom': '10px'
  };

  const styleNoiDungNhanVien = {
      'text-align': 'left',
      'font': 'Light 21px/25px Helvetica Neue',
      'letter-spacing': '0px',
      'color': '#000000',
      'border-top' : 'none'      
  };

  const styleNoiDungNhanVien2 = {
      'border':'1px solid #B3B3B3',
      'padding':'10px',
      'margin-right':'10px'
  };

  const styleHeader = {
      'text-align': 'left',
      'font': 'regular 23px/27px Helvetica Neue',
      'letter-spacing': '0px',
      'color': '#283280'
  };

  const styleTimKiem = {
      'width': '150px',
      'height': '40px',
      'background': '#F9C20A 0% 0% no-repeat padding-box',
      'border-radius': '30px'      
  };

  var tableView;
  if (listItems) {   
     tableView = <table className="table" style={style}>           
        <tr>                
          <td style={style} className="text-left"><strong>Hạng mục</strong></td>
          <td style={style}><strong>Tự đánh giá</strong></td>
          <td style={style}><strong>CBQL đánh giá</strong></td>
          <td style={style}><strong>Kết quả cuối cùng</strong></td>
        </tr>               
        {
          listItems.map((item, i) => {
            return <tr key={i}>   
              <td style={style} className="text-left">{item.name}</td>
              <td style={style}>{item.selfRate}</td>
              <td style={style}>{item.managerRate}</td>
              <td style={style}>{item.Score}</td>          
            </tr>;
          })
        }
        <tr>                
          <td style={style} className="text-left text-danger"><strong>Tổng điểm</strong></td>
          <td style={style} className="text-danger"><strong>66</strong></td>
          <td style={style} className="text-danger"><strong>80</strong></td>
          <td style={style} className="text-danger"><strong>70</strong></td>
        </tr>

    </table>
  }

  
  return (
    <div>
      {/*THÔNG TIN NHÂN VIÊN*/}
      <div className="text-uppercase" style={styleHeader} >
          THÔNG TIN NHÂN VIÊN
      </div>
      <div className="card border shadow mb-4 mt-2">
          <table className="table" style={{'margin-bottom':'4px'}}>           
              <tr>                
                  <td style={styleNoiDungNhanVien}> 
                      <div style={styleTieuDeNhanVien}> Họ và tên </div>
                      <div style={styleNoiDungNhanVien2}> Nguyễn Đức Chiến </div>
                  </td>                  
                  <td style={styleNoiDungNhanVien}> 
                      <div style={styleTieuDeNhanVien}> Chức danh </div>
                      <div style={styleNoiDungNhanVien2}> Kỹ sư lập trình </div>
                  </td>
                  <td style={styleNoiDungNhanVien}> 
                      <div style={styleTieuDeNhanVien}> Cán bộ quản lý </div>
                      <div style={styleNoiDungNhanVien2}> Hoàng đình thức </div>
                  </td>          
              </tr>
           </table>
       </div>

      {/*LỰA CHỌN KỲ ĐÁNH GIÁ*/}
      <div className="text-uppercase" style={styleHeader} >
          LỰA CHỌN HIỂN THỊ KỲ ĐÁNH GIÁ
      </div>
      <div className="card border shadow mb-4 mt-2">
          <table className="table" style={{'margin-bottom':'4px'}}>           
              <tr>                
                  <td style={styleNoiDungNhanVien}> 
                      <div style={styleTieuDeNhanVien}> Lựa chọn năm (bắt buộc) </div>                      
                         <select className="browser-default custom-select" style={{'color':'black'}}>                            
                            <option value="2020" selected>2020</option>
                            <option value="2019">2019</option>
                            <option value="2018">2018</option>
                          </select>
                  </td>                  
                  <td style={styleNoiDungNhanVien}> 
                      <div style={styleTieuDeNhanVien}> Lựa chọn quý (bắt buộc) </div>
                      <select className="browser-default custom-select" style={{'color':'black'}}>                            
                            <option value="1" selected>Quý 1</option>
                            <option value="2">Quý 2</option>
                            <option value="3">Quý 3</option>
                            <option value="4">Quý 4</option>
                      </select>
                  </td>
                  <td style={{'vertical-align': 'bottom'}}>                      
                      <button type="button" className="btn btn-warning" style={styleTimKiem}>Tìm kiếm</button>
                  </td>          
              </tr>
           </table>
       </div>


      {/*HIỂN THỊ KẾT QUẢ ĐÁNH GIÁ*/}
      <div className="card border border-primary shadow mb-4 mt-2">        
        <div className="bg-primary text-white p-3 h6 text-uppercase">Quý 1 năm 2020</div>
        <div style={{'margin-left':'10px','padding':'5px','margin-top':'10px'}}>
          <span style={{'color':'#347EF9'}}>&#9679;</span> CBQL đánh giá: 
          <strong style={{'color':'black'}}> Nguyễn Đình Thức </strong> &nbsp;&nbsp;&nbsp;
          <span style={{'color':'#347EF9'}}>&#9679;</span> CBLĐ phê duyệt: 
          <strong style={{'color':'black'}}> Hoàng Thuỳ Trúc </strong>
        </div>
        <div className="card-body">          
            {tableView}          
        </div>
      </div>

    </div>
  );
}

export default General;
