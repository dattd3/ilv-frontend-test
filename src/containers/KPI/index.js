import React, { useState } from "react";
import { useApi, useFetcher, useGuardStore } from "../../modules";
import { useTranslation } from "react-i18next";
import KPISearch from "./KPISearch"
import StaffInfo from "./StaffInfo"

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

  if (listAll.data && listAll.data[0]) {      
    const items = listAll.data;
    const kpiInfo = items[0];
    console.log("kpiInfo:",kpiInfo);
    var years = getPeriodYear(items);
    console.log("years",years);

    return (
        <div>        
           {/* THÔNG TIN NHÂN VIÊN */}
             <StaffInfo UserInfo={user} ManagerFullName={kpiInfo.ManagerFullName}/>

           {/* LỰA CHỌN KỲ ĐÁNH GIÁ */}
             <KPISearch years={years}/>
        </div>
      );

  } else {
    return null
  }
}

export default General;
