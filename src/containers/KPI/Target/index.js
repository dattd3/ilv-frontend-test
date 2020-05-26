import React from "react";
import { useTranslation } from "react-i18next";
import KPIDetail from './KPIDetail'

function Target(props) {
  const { t } = useTranslation();  
  document.title = t("KPI Target"); 

  const LinkSuccessFactor = "https://performancemanager10.successfactors.com/sf/pmreviews?bplte_company=vingroupjsP2&_s.crb=cCGlhxZRYUMgGtcEh7rKL3v7dsI%3d";

  const TypeKPI = {
    TTTD : {"type":"TTTĐ", "name":"TINH THẦN THÁI ĐỘ"},
    NLLD : {"type":"NLLĐ", "name":"NĂNG LỰC LÃNH ĐẠO"},
    NLCM : {"type":"NLCM", "name":"NĂNG LỰC CHUYÊN MÔN"},
    NDCV : {"type":"NDCV", "name":"NỘI DUNG CÔNG VIỆC"}
  };

  const stylePersonTitle = {
      'width': '250px',
      'background': '#FFFFFF 0% 0% no-repeat padding-box',
      'border': '1px solid #FF0000',
      'borderRadius': '20px!important',      
      'textAlign': 'left',
      'font': 'Light 23px/27px Helvetica Neue',
      'letterSpacing': '0px',
      'color': '#FF0000',
      'marginTop':'15px',
      'marginBottom':'5px'
  };

  const styleLink = {
      'width': '300px',
      'background': '#34C4F9 0% 0% no-repeat padding-box',
      'borderRadius': '20px!important',      
      'textAlign': 'left',
      'font': 'Light 23px/27px Helvetica Neue',
      'letterSpacing': '0px',
      'color': '#FFFFFF',
      'marginTop':'15px',
      'marginBottom':'5px'
  };
    
  return (
    <div>   

      {/* HIỂN THỊ CHỨC DANH & ĐƯỜNG LINK TRUY CẬP SUCCESS FACTOR*/} 
      <div>
        <div className="float-left btn text-center" style={stylePersonTitle}> Chức danh: &nbsp;
            <strong>Kỹ sư lập trình</strong>
        </div> 
        <div className="float-right btn text-center" style={styleLink}>
           <a href={LinkSuccessFactor} style={{'color':'white'}} target="_blank"> Đường link truy cập SuccessFactor</a>
        </div>
      </div>          

      {/* HIỂN THỊ THÔNG TIN TINH THẦN THÁI ĐỘ*/}
      <KPIDetail TypeKPI={TypeKPI.TTTD} MNV="10020" Period="Q1/2020"></KPIDetail>
      

      {/* HIỂN THỊ THÔNG TIN KPI*/}
      

    </div>
  );
}

export default Target;
