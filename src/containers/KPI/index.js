import React, { useState } from "react";
import { useApi, useFetcher, useGuardStore } from "../../modules";
import { useTranslation } from "react-i18next";
import KPISearch from "./KPISearch"
import StaffInfo from "./StaffInfo"

const usePreload = (params) => {
  const api = useApi();
  const [data = [], err] = useFetcher({
    api: api.fetchListKpiGeneral,
    autoRun: true,
    params: params
  });
  return data;
};

function General(props) {
  const { t } = useTranslation();  
  document.title = t("KPI General"); 

  const guard = useGuardStore();
  const user = guard.getCurentUser();

  var Period="2020"; 
  var listAll = usePreload([Period]);
  console.log("listAll",listAll);
   
  var years = [];
  
  const style = {
      'border': '1px solid #B3B3B3',      
      'textAlign': 'center',
      'color': 'black'
    };

  const styleTimKiem = {
      'width': '270px',
      'height': '45px',
      'background': '#F9C20A 0% 0% no-repeat padding-box',
      'borderRadius': '30px',
      'fontFamily': 'Light 21px/25px Helvetica Neue'
  };

  if (listAll.data && listAll.data[0]) {  

    const kpiInfo = listAll.data[0];
    console.log("kpiInfo:",kpiInfo);

    return (
        <div>        
           {/* THÔNG TIN NHÂN VIÊN */}
             <StaffInfo UserInfo={user} ManagerFullName="nguyen dinh thuc"/>

           {/* LỰA CHỌN KỲ ĐÁNH GIÁ */}
             <KPISearch />

           {/* THÔNG TIN CHI TIẾT CHIA LÀM 2 CỘT */}    
            
             <div className="container-fluid w-100 mb-4">
                <div className="row">
                    {/*HIỂN THỊ KẾT QUẢ ĐÁNH GIÁ THEO QUÝ*/}
                    <div className="col-8 panel" style={{'paddingLeft':'0px'}}>                                                      
                          <div className="card border border-primary shadow">        
                              <div className="bg-primary text-white p-3 h6 text-uppercase text-center">Quý 1 năm 2020</div>                      
                              <div className="card-body">          
                                  <table className="table table-bordered" >
                                     <tbody>         
                                         <tr>                
                                              <td style={style} className="text-left text-primary"><strong>STT</strong></td>
                                              <td style={style} className="text-left text-primary"><strong>Hạng mục đánh giá</strong></td>
                                              <td style={style} className="text-center text-primary"><strong>CBNV tự đánh giá</strong></td>
                                              <td style={style} className="text-center text-primary"><strong>CBQL đánh giá</strong></td>              
                                          </tr> 
                                          <tr>
                                              <td style={style}>01</td>   
                                              <td style={style} className="text-left">Tinh thần thái độ</td>
                                              <td style={style}>{kpiInfo.TTTDself}</td>
                                              <td style={style}>{kpiInfo.TTTDmanager}</td>
                                          </tr>
                                          <tr>
                                              <td style={style}>02</td>   
                                              <td style={style} className="text-left">Năng lực lãnh đạo</td>
                                              <td style={style}>{kpiInfo.NLLDself}</td>
                                              <td style={style}>{kpiInfo.NLLDmanager}</td>
                                          </tr>
                                          <tr>
                                              <td style={style}>03</td>   
                                              <td style={style} className="text-left">Năng lực chuyên môn</td>
                                              <td style={style}>{kpiInfo.NLCMself}</td>
                                              <td style={style}>{kpiInfo.NLCMmanager}</td>
                                          </tr> 
                                          <tr>
                                              <td style={style}>04</td>   
                                              <td style={style} className="text-left">Nội dung công việc</td>
                                              <td style={style}>{kpiInfo.NDCVself}</td>
                                              <td style={style}>{kpiInfo.NDCVmanager}</td>
                                          </tr>
                                          <tr>                
                                              <td style={style}><strong>05</strong></td>
                                              <td style={style} className="text-left"><strong>Điểm tổng thể</strong></td>
                                              <td style={style}><strong>{kpiInfo.SelfOverAll}</strong></td>
                                              <td style={style}><strong>{kpiInfo.Score}</strong></td>              
                                          </tr>   
                                      </tbody>                                       
                                  </table>
                              </div>
                          </div>                      
                    </div>

                    <div className="col-4 panel" style={{'paddingRight':'0px'}}>                    
                    {/* ĐÁNH GIÁ & PHÊ DUYỆT */}
                          <div className="card border border-primary shadow" style={{'height':'100%'}}> 
                               <div className="bg-primary text-white p-3 h6 text-uppercase text-center">ĐÁNH GIÁ & PHÊ DUYỆT</div> 
                               <div className="card-body" style={{'padding':'0px'}}>
                                  <div className="text-center" style={{'color':'#FF0000'}}>Kết qủa</div>
                                  <div className="text-center" style={{'color':'#FF0000'}}>đánh giá tổng thể</div>
                                  <div className="text-center font-weight-bold" style={{'color':'#FF0000','fontSize':'60px'}}>{kpiInfo.Score}</div>   
                                  <hr></hr>                             
                               </div>
                              <div className="card-body" style={{'padding':'0px'}}>
                                  <div className="text-center">CBQL đánh giá:</div>
                                  <div className="text-center text-primary text-weight-bold" style={{'color':'#FF0000'}}>{kpiInfo.ManagerAtFormComplete}</div>
                                  <hr></hr>
                              </div>
                              <div className="card-body" style={{'padding':'0px'}}>
                                  <div className="text-center">CBLĐ phê duyệt:</div>
                                  <div className="text-center text-primary text-weight-bold" style={{'color':'#FF0000'}}>{kpiInfo.MatrixFullName}</div>
                              </div>                    
                          </div>                    
                     </div>
                </div> 
              </div> 
        </div>
      );

  } else {
    return null
  }
}

export default General;
