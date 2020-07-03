import React, { useState } from "react";
import { useApi, useFetcher, useGuardStore } from "../../modules";
import { useTranslation } from "react-i18next";
import KPISearch from "./KPISearch"
import StaffInfo from "./StaffInfo"
import ShowKPIDetail from "./ShowKPIDetail"

const usePreload = () => {
  const api = useApi();
  const [data = [], err] = useFetcher({
    api: api.fetchListKpiGeneralAll,
    autoRun: true
  });
  return data;
};


function General(props) {
  const { t } = useTranslation();  
  document.title = t("KPI General"); 

  const [period, setPeriod] = useState("2020"); 
  const [showResult, setShowResult] = useState(false); 
  const resultRef = React.createRef();

  const guard = useGuardStore();
  const user = guard.getCurentUser();
  
  var listAll = usePreload();
    
  function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
  }

  function getPeriodYear(items) { 
    var years = [];         
    items.map(function(item) {          
       var year =  item.Period.substring(3,7); //Convert: Q1/2020 => 2020 
       years.push(year);       
    });   

    var unique = years.filter(onlyUnique);    
    return unique    
  }

  function selectPeriodCompleted (value) {    
    setPeriod(value);
    resultRef.current.loadData(value);         
    setShowResult(true);
  }

  if (listAll.data && listAll.data[0]) {      
    const items = listAll.data;
    const kpiInfo = items[0];    
    var years = getPeriodYear(items); 
    
    return (
        <div>        
           {/* THÔNG TIN NHÂN VIÊN */}
             <StaffInfo UserInfo={user} ManagerFullName={kpiInfo.ManagerFullName}/>

           {/* LỰA CHỌN KỲ ĐÁNH GIÁ */}
             <KPISearch years={years} selectPeriodCompleted={selectPeriodCompleted}/>
             
             <ShowKPIDetail Period={period} ref={resultRef}/>             
        </div>
      );

  } else {
    return (
        <div>
              <StaffInfo UserInfo={user} ManagerFullName=""/>                   
              <div className="alert alert-warning text-center" role="alert">
                    Không có dữ liệu về KPI
              </div>       
        </div>
      );
  }
}

export default General;
