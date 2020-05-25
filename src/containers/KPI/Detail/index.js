import React, { useState } from "react";
import { useApi, useFetcher } from "../../../modules";
import { useTranslation } from "react-i18next";

const usePreload = (params) => {
  const api = useApi();
  const [data = [], err] = useFetcher({
    api: api.fetchListNotification,
    autoRun: true,
    params: params
  });
  return data;
};

const listTTTD = [
    { no:'01', selfRating:"3", managerRating:"4", score:"3.5", name:"Luôn tuân thủ các nội quy, quy định, quy chế của tập đoàn" },
    { no:'02', selfRating:"4", managerRating:"5", score:"3.5", name:"Luôn thể hiện bản lĩnh, sự khẩn trương, quyết liệt trong công việc, làm việc có trách nhiệm cao, chủ động, không né tránh, ỷ lại" },
    { no:'03', selfRating:"3", managerRating:"5", score:"4.5", name:"Luôn làm việc khẩn trương với tính thần phục vụ cao, giải quyết nhanh, dứt điểm thỏa đáng các vấn đề của đồng nghiệp, đối tác, khách hàng" },    
    { no:'04', selfRating:"5", managerRating:"4", score:"4.5", name:"Công bằng, quyết liệt đấu tranh với những hành vi không phù hợp với văn hóa và các quy định của Tập đoàn" }
  ];

const listKPI = [
    { no:'01', selfRating:"3", managerRating:"4", score:"3.5", name:"Triển khai công việc trong phạm vi được phân công, đảm bảo thực hiện đầy đủ, đúng tiến độ và đạt hiệu quả/kết quả theo yêu cầu" },
    { no:'02', selfRating:"3", managerRating:"4", score:"3.5", name:"Tham gia đầy đủ các khóa đào tạo, huấn luyện theo yêu cầu" },
    { no:'03', selfRating:"3", managerRating:"4", score:"3.5", name:"Nắm thật chắc các kiến thức chuyên môn của vị trí mình đảm nhận. Thường xuyên tự học hỏi để nâng cao trình độ chuyên môn." },
    { no:'04', selfRating:"3", managerRating:"4", score:"3.5", name:"Kết nối với các bộ phận liên quan để xử lý các vấn đề phát sinh một cách kịp thời" },
    { no:'05', selfRating:"3", managerRating:"4", score:"3.5", name:"Tuân thủ các quy định, quy chế, nội quy của tập đoàn và công ty" },
    { no:'06', selfRating:"3", managerRating:"4", score:"3.5", name:"Chủ động báo cáo kịp thời các trường hợp khẩn cấp, sai sót (nếu có) để xử lý, giải quyết kịp thời" },
    { no:'07', selfRating:"3", managerRating:"4", score:"3.5", name:"Thực hiện báo cáo định kỳ hoặc đột xuất theo yêu cầu của Lãnh đạo." },
    { no:'08', selfRating:"3", managerRating:"4", score:"3.5", name:"Đảm bảo cảnh quan và mỹ quan, vệ sinh nơi làm việc" }    
  ];

function Detail(props) {
  const { t } = useTranslation();  
  document.title = t("KPI Detail");  
  
  const style = {
      'border': '1px solid #B3B3B3',      
      'text-align': 'center',
      'color': 'black'
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

 const styleSearchColumn = {
      'text-align': 'left',
      'font': 'Light 21px/25px Helvetica Neue',
      'letter-spacing': '0px',
      'color': '#000000',
      'border-top' : 'none'      
  };

  const styleSearchDropDown = {
      'text-align': 'left',
      'font': 'Light 21px/25px Helvetica Neue',
      'letter-spacing': '0px',
      'color': '#B3B3B3',
      'margin-bottom': '10px'
  };

  var tableTTTD;
  if (listTTTD) {   
     tableTTTD = <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">    
      <thead>
        <tr>                
          <th className="text-success h6 small font-weight-bold mt-0 pt-0">STT</th>
          <th className="text-success h6 small font-weight-bold mt-0 pt-0">Hạng mục đánh giá</th>
          <th className="text-success h6 small font-weight-bold mt-0 pt-0" style={{'width':'85px'}}>Tự chấm điểm</th>
          <th className="text-success h6 small font-weight-bold mt-0 pt-0" style={{'width':'85px'}}>QL chấm điểm</th>
          <th className="text-success h6 small font-weight-bold mt-0 pt-0">Kết quả cuối cùng</th>
        </tr>
      </thead>
      <tbody>
        {
          listTTTD.map((item, i) => {
            return <tr key={i}>              
                <td> {item.no} </td>                            
                <td> {item.name} </td>
                <td> {item.selfRating} </td>
                <td> {item.managerRating} </td>
                <td> {item.score} </td>          
              </tr>;
          })
        }
      </tbody>
    </table>;  
  }

  var tableKPI;
  if (listKPI) {   
     tableKPI = <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">    
      <thead>
        <tr>                
          <th className="text-warning h6 small font-weight-bold mt-0 pt-0">STT</th>
          <th className="text-warning h6 small font-weight-bold mt-0 pt-0">Hạng mục đánh giá</th>
          <th className="text-warning h6 small font-weight-bold mt-0 pt-0" style={{'width':'85px'}}>Tự chấm điểm</th>
          <th className="text-warning h6 small font-weight-bold mt-0 pt-0" style={{'width':'85px'}}>QL chấm điểm</th>
          <th className="text-warning h6 small font-weight-bold mt-0 pt-0">Kết quả cuối cùng</th>          
        </tr>
      </thead>
      <tbody>
        {
          listKPI.map((item, i) => {
            return <tr key={i}>              
                <td> {item.no} </td>                            
                <td> {item.name} </td>
                <td> {item.selfRating} </td>
                <td> {item.managerRating} </td>
                <td> {item.score} </td>         
              </tr>;
          })
        }
      </tbody>
    </table>;  
  }
  
  return (
    <div>
      {/*LỰA CHỌN KỲ ĐÁNH GIÁ*/}
      <div className="text-uppercase" style={styleHeader} >
          LỰA CHỌN HIỂN THỊ KỲ ĐÁNH GIÁ
      </div>
      <div className="card border shadow mb-4 mt-2">
          <table className="table" style={{'margin-bottom':'4px'}}>           
              <tr>                
                  <td style={styleSearchColumn}> 
                      <div style={styleSearchDropDown}> Lựa chọn năm (bắt buộc) </div>                      
                         <select className="browser-default custom-select" style={{'color':'black'}}>                            
                            <option value="2020" selected>2020</option>
                            <option value="2019">2019</option>
                            <option value="2018">2018</option>
                          </select>
                  </td>                  
                  <td style={styleSearchColumn}> 
                      <div style={styleSearchDropDown}> Lựa chọn quý (bắt buộc) </div>
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

       {/* HIỂN THỊ THÔNG TIN TINH THẦN THÁI ĐỘ*/}
        <div className="card shadow mb-4 mt-2">        
          <div className="bg-success text-white p-3">        
             <h6>
               <span className="float-left"> {t("TINH THẦN THÁI ĐỘ")} </span>
               <span className="float-right">{t("TỶ TRỌNG: 20%")} </span>
             </h6>           
          </div>
          <div className="card-body border border-success">
            <div className="table-responsive">
              {tableTTTD}
            </div>
          </div>
        </div>

      {/* HIỂN THỊ THÔNG TIN KPI*/}
        <div className="card shadow mb-4 mt-2">        
          <div className="bg-warning text-white p-3">        
             <h6>
               <span className="float-left"> {t("KPI")} </span>
               <span className="float-right">{t("TỶ TRỌNG: 80%")} </span>
             </h6>           
          </div>
          <div className="card-body border border-warning">
            <div className="table-responsive">
              {tableKPI}
            </div>
          </div>
        </div>

    </div>
  );
}

export default Detail;
