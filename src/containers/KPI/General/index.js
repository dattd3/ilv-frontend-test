import React, { useState } from "react";
import { useApi, useFetcher, useGuardStore } from "../../../modules";
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

  var MNV="10020";
  var Period="Q1/2019"; 
  var listAll = usePreload([MNV,Period]); 

  var ManagerFullName = "";
  var ManagerAtFormComplete = "";
  var MatrixFullName = "";

  if(listAll && listAll.length > 0) {
    var generalDetail = listAll[0];        
     ManagerFullName = generalDetail.ManagerFullName;           
     ManagerAtFormComplete = generalDetail.ManagerAtFormComplete;
     MatrixFullName = generalDetail.MatrixFullName;    
  }
      

  console.log("listAll:", listAll);
  
  const style = {
      'border': '1px solid #B3B3B3',      
      'textAlign': 'center',
      'color': 'black'
    };

  const styleTieuDeNhanVien = {
      'textAlign': 'left',
      'fontFamily': 'Light 21px/25px Helvetica Neue',
      'letterSpacing': '0px',
      'color': '#B3B3B3',
      'marginBottom': '10px'
  };

  const styleNoiDungNhanVien = {
      'textAlign': 'left',
      'fontFamily': 'Light 21px/25px Helvetica Neue',
      'letterSpacing': '0px',
      'color': '#000000',
      'borderTop' : 'none'      
  };

  const styleNoiDungNhanVien2 = {
      'border':'1px solid #B3B3B3',
      'padding':'10px',
      'marginRight':'10px'
  };

  const styleHeader = {
      'textAlign': 'left',
      'fontFamily': 'regular 23px/27px Helvetica Neue',
      'letterSpacing': '0px',
      'color': '#283280'
  };

  const styleTimKiem = {
      'width': '270px',
      'height': '45px',
      'background': '#F9C20A 0% 0% no-repeat padding-box',
      'borderRadius': '30px',
      'fontFamily': 'Light 21px/25px Helvetica Neue'
  };

  var tableView;
  if (listItems) {   
     tableView = <table className="table" style={style}> 
       <tbody>         
            <tr>                
              <td style={style} className="text-left text-primary"><strong>Hạng mục đánh giá</strong></td>
              <td style={style} className="text-center text-primary"><strong>CBNV tự đánh giá</strong></td>
              <td style={style} className="text-center text-primary"><strong>CBQL đánh giá</strong></td>              
            </tr>               
            {
              listItems.map((item, i) => {
                return <tr key={i}>   
                  <td style={style} className="text-left">{item.name}</td>
                  <td style={style}>{item.selfRate}</td>
                  <td style={style}>{item.managerRate}</td>
                </tr>;
              })
            }
            <tr>                
              <td style={style} className="text-left"><strong>Điểm tổng thể</strong></td>
              <td style={style}><strong>66</strong></td>
              <td style={style}><strong>80</strong></td>              
            </tr>
        </tbody>            
    </table>
  }
  
  return (
    <div>
      {/*THÔNG TIN NHÂN VIÊN*/}
      <div className="text-uppercase" style={styleHeader} >
          THÔNG TIN NHÂN VIÊN
      </div>
      <div className="card border shadow mb-4 mt-2">
          <table className="table" style={{'marginBottom':'4px'}}>
             <tbody>
                <tr>                
                    <td style={styleNoiDungNhanVien}> 
                        <div style={styleTieuDeNhanVien}> Họ và tên </div>
                        <div style={styleNoiDungNhanVien2}> {user.fullName}  </div>
                    </td>                  
                    <td style={styleNoiDungNhanVien}> 
                        <div style={styleTieuDeNhanVien}> Chức danh </div>
                        <div style={styleNoiDungNhanVien2}> {user.jobTitle} </div>
                    </td>
                    <td style={styleNoiDungNhanVien}> 
                        <div style={styleTieuDeNhanVien}> Cán bộ quản lý </div>
                        <div style={styleNoiDungNhanVien2}> {ManagerFullName} </div>
                    </td>          
                </tr>
              </tbody>  
           </table>
       </div>

      {/*LỰA CHỌN KỲ ĐÁNH GIÁ*/}
      <div className="text-uppercase" style={styleHeader} >
          LỰA CHỌN HIỂN THỊ KỲ ĐÁNH GIÁ
      </div>
      <div className="card border shadow mb-4 mt-2">
          <table className="table" style={{'marginBottom':'4px'}}>  
              <tbody>         
                    <tr>                
                        <td style={styleNoiDungNhanVien}> 
                            <div style={styleTieuDeNhanVien}> Lựa chọn năm (bắt buộc) </div>                      
                               <select className="browser-default custom-select" style={{'color':'black','height': '45px'}}>                            
                                  <option value="2020" defaultValue>2020</option>
                                  <option value="2019">2019</option>                            
                                </select>
                        </td>                  
                        <td style={styleNoiDungNhanVien}> 
                            <div style={styleTieuDeNhanVien}> Lựa chọn quý (bắt buộc) </div>
                            <select className="browser-default custom-select" style={{'color':'black','height': '45px'}}>                            
                                  <option value="Q1" defaultValue>Quý 1</option>
                                  <option value="Q2">Quý 2</option>
                                  <option value="Q3">Quý 3</option>
                                  <option value="Q4">Quý 4</option>
                            </select>
                        </td>
                        <td style={{'verticalAlign': 'bottom'}}>                      
                            <button type="button" className="btn btn-warning" style={styleTimKiem}>Tìm kiếm</button>
                        </td>          
                    </tr>
              </tbody>
           </table>
       </div>

        {/* THÔNG TIN CHI TIẾT CHIA LÀM 2 CỘT */}    
        
         <div className="container-fluid w-100 mb-4">
            <div className="row">
                {/*HIỂN THỊ KẾT QUẢ ĐÁNH GIÁ THEO QUÝ*/}
                <div className="col-8 panel" style={{'paddingLeft':'0px'}}>                                                      
                      <div className="card border border-primary shadow">        
                          <div className="bg-primary text-white p-3 h6 text-uppercase text-center">Quý 1 năm 2020</div>                      
                          <div className="card-body">          
                              {tableView}          
                          </div>
                      </div>                      
                </div>

                <div className="col-4 panel" style={{'paddingRight':'0px'}}>                    
                {/* ĐÁNH GIÁ & PHÊ DUYỆT */}
                      <div className="card border border-primary shadow" style={{'height':'100%'}}> 
                           <div className="bg-primary text-white p-3 h6 text-uppercase text-center">ĐÁNH GIÁ & PHÊ DUYỆT</div> 
                           <div className="card-body">
                              <div className="text-center" style={{'color':'#FF0000'}}>Kết qủa</div>
                              <div className="text-center" style={{'color':'#FF0000'}}>đánh giá tổng thể</div>
                              <div className="text-center font-weight-bold" style={{'color':'#FF0000','fontSize':'60px'}}>80</div>                                
                           </div>
                          <div className="card-body">
                              <div className="text-center">CBQL đánh giá:</div>
                              <div className="text-center text-primary text-weight-bold" style={{'color':'#FF0000'}}>{ManagerAtFormComplete}</div>
                          </div>
                          <div className="card-body">
                              <div className="text-center">CBLĐ phê duyệt:</div>
                              <div className="text-center text-primary text-weight-bold" style={{'color':'#FF0000'}}>{MatrixFullName}</div>
                          </div>                    
                      </div>                    
                 </div>
            </div> 
          </div> 

    </div>
  );
}

export default General;
