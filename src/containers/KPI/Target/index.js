import React, { useState } from "react";
import { useApi, useFetcher } from "../../../modules";
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

const listTTTD = [
    { no:1, weight:"4%", name:"Luôn tuân thủ các nội quy, quy định, quy chế của tập đoàn" },
    { no:2, weight:"4%", name:"Luôn thể hiện bản lĩnh, sự khẩn trương, quyết liệt trong công việc, làm việc có trách nhiệm cao, chủ động, không né tránh, ỷ lại" },
    { no:3, weight:"4%", name:"Luôn làm việc khẩn trương với tính thần phục vụ cao, giải quyết nhanh, dứt điểm thỏa đáng các vấn đề của đồng nghiệp, đối tác, khách hàng" },
    { no:4, weight:"4%", name:"Quản lý hành lý lưu kho, hư hỏng, giao nhận bưu phẩm, phân loại báo/tạp chí và hỗ trợ hành lý khách chuyển phòng" },
    { no:5, weight:"4%", name:"Công bằng, quyết liệt đấu tranh với những hành vi không phù hợp với văn hóa và các quy định của Tập đoàn" }
  ];

const listKPI = [
    { no:1, weight:"10%", name:"Triển khai công việc trong phạm vi được phân công, đảm bảo thực hiện đầy đủ, đúng tiến độ và đạt hiệu quả/kết quả theo yêu cầu" },
    { no:2, weight:"10%", name:"Tham gia đầy đủ các khóa đào tạo, huấn luyện theo yêu cầu" },
    { no:3, weight:"10%", name:"Nắm thật chắc các kiến thức chuyên môn của vị trí mình đảm nhận. Thường xuyên tự học hỏi để nâng cao trình độ chuyên môn." },
    { no:4, weight:"10%", name:"Kết nối với các bộ phận liên quan để xử lý các vấn đề phát sinh một cách kịp thời" },
    { no:5, weight:"10%", name:"Tuân thủ các quy định, quy chế, nội quy của tập đoàn và công ty" },
    { no:6, weight:"10%", name:"Chủ động báo cáo kịp thời các trường hợp khẩn cấp, sai sót (nếu có) để xử lý, giải quyết kịp thời" },
    { no:7, weight:"10%", name:"Thực hiện báo cáo định kỳ hoặc đột xuất theo yêu cầu của Lãnh đạo." },
    { no:8, weight:"10%", name:"Đảm bảo cảnh quan và mỹ quan, vệ sinh nơi làm việc" }    
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


function Target(props) {
  const { t } = useTranslation();  
  document.title = t("KPI Detail");  
  
  var tableTTTD;
  if (listTTTD) {   
     tableTTTD = <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">    
      <thead>
        <tr>                
          <th className="text-success h6 small font-weight-bold mt-0 pt-0">STT</th>
          <th className="text-success h6 small font-weight-bold mt-0 pt-0">Hạng mục đánh giá</th>
          <th className="text-success h6 small font-weight-bold mt-0 pt-0">Tỷ trọng</th>
        </tr>
      </thead>
      <tbody>
        {
          listTTTD.map((item, i) => {
            return <tr key={i}>              
              <td>{item.no}</td>                            
              <td>{item.name}</td>
              <td className="text-center">{item.weight}</td>          
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
          <th className="text-warning h6 small font-weight-bold mt-0 pt-0">Tỷ trọng</th>
        </tr>
      </thead>
      <tbody>
        {
          listKPI.map((item, i) => {
            return <tr key={i}>              
              <td>{item.no}</td>                            
              <td>{item.name}</td>
              <td className="text-center">{item.weight}</td>          
            </tr>;
          })
        }
      </tbody>
    </table>;  
  }

  return (
    <div>              
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

export default Target;
