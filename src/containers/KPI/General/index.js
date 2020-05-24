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
  
  var style = {
      'border': '1px solid gray',      
      'text-align': 'center',
      'color': 'black'
    };

  var styleTieuDeNhanVien = {
      'text-align': 'left',
      'font': 'Light 21px/25px Helvetica Neue',
      'letter-spacing': '0px',
      'color': '#B3B3B3'
  }

  var styleNoiDungNhanVien = {
      'text-align': 'left',
      'font': 'Light 21px/25px Helvetica Neue',
      'letter-spacing': '0px',
      'color': '#000000'      
  }

  var styleNoiDungNhanVien2 = {
      'border':'1px solid #B3B3B3',
      'padding':'10px',
      'margin-right':'5px'
  }

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

    </table>;  
  }

  
  return (
    <div>
      {/*THÔNG TIN NHÂN VIÊN*/}
      <div className="text-uppercase">THÔNG TIN NHÂN VIÊN</div>
      <div className="card border shadow mb-4 mt-2">
          <table className="table">           
              <tr>                
                  <td style={styleTieuDeNhanVien}> Họ và tên </td>
                  <td style={styleTieuDeNhanVien}> Chức danh </td>
                  <td style={styleTieuDeNhanVien}> Cán bộ quản lý </td>          
              </tr>                       
              <tr>                
                  <td style={styleNoiDungNhanVien}> 
                    <div style={styleNoiDungNhanVien2}> Nguyễn Đức Chiến </div>
                  </td>
                  <td style={styleNoiDungNhanVien}> 
                    <div style={styleNoiDungNhanVien2}> Kỹ sư lập trình </div>
                  </td>
                  <td style={styleNoiDungNhanVien}> 
                    <div style={styleNoiDungNhanVien2}> Hoàng đình thức </div>
                  </td>          
              </tr>
           </table>
      </div>

      {/*LỰA CHỌN KỲ ĐÁNH GIÁ*/}


      {/*HIỂN THỊ KẾT QUẢ ĐÁNH GIÁ*/}
      <div className="card border border-primary shadow mb-4 mt-2">        
        <div className="bg-primary text-white p-3 h6 text-uppercase">Quý 1 năm 2020</div>
        <div className="card-body">          
            {tableView}          
        </div>
      </div>

    </div>
  );
}

export default General;
