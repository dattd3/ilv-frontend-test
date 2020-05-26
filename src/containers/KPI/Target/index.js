import React from "react";
import { useApi, useFetcher } from "../../../modules";
import { useTranslation } from "react-i18next";
import KPIDetail from './KPIDetail'

const LinkSuccessFactor = "https://performancemanager10.successfactors.com/sf/pmreviews?bplte_company=vingroupjsP2&_s.crb=cCGlhxZRYUMgGtcEh7rKL3v7dsI%3d";

const TypeKPI = {
  TTTD : {"type":"TTTĐ", "name":"TINH THẦN THÁI ĐỘ", "color":"#05BD29"},
  NLLD : {"type":"NLLĐ", "name":"NĂNG LỰC LÃNH ĐẠO", "color":"#F9C20A"},
  NLCM : {"type":"NLCM", "name":"NĂNG LỰC CHUYÊN MÔN", "color":"#FF0000"},
  NDCV : {"type":"NDCV", "name":"NỘI DUNG CÔNG VIỆC", "color":"#347EF9"}
};

const usePreload = (params) => {
  const api = useApi();
  const [data = [], err] = useFetcher({
    api: api.fetchListKpiTarget,
    autoRun: true,
    params: params
  });
  return data;
};

function Target(props) {
  const { t } = useTranslation();
  document.title = t("KPI Target"); 
   
  var MNV="10020";
  var Period="Q1/2020"; 
  var listAll = usePreload([MNV,Period]); 
  
  const listTTTD = listAll.filter(function(item){ return item.Type == TypeKPI.TTTD.type });  
  const listNLLD = listAll.filter(function(item){ return item.Type == TypeKPI.NLLD.type });  
  const listNLCM = listAll.filter(function(item){ return item.Type == TypeKPI.NLCM.type });  
  const listNDCV = listAll.filter(function(item){ return item.Type == TypeKPI.NDCV.type });  
  
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

      {/* TINH THẦN THÁI ĐỘ */}
      <KPIDetail TypeKPI={TypeKPI.TTTD} Data={listTTTD}></KPIDetail>
      

      {/* NĂNG LỰC LÃNH ĐẠO */}
      <KPIDetail TypeKPI={TypeKPI.NLLD} Data={listNLLD}></KPIDetail>


      {/* NĂNG LỰC CHUYÊN MÔN */}
      <KPIDetail TypeKPI={TypeKPI.NLCM} Data={listNLCM}></KPIDetail>


      {/* NỘI DUNG CÔNG VIỆC */}
      <KPIDetail TypeKPI={TypeKPI.NDCV} Data={listNDCV}></KPIDetail>
      

    </div>
  );
}

export default Target;
