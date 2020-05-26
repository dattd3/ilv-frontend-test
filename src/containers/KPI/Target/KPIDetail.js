import React from "react";
import { useApi, useFetcher } from "../../../modules";
import { useTranslation } from "react-i18next";

const usePreload = (params) => {
  const api = useApi();
  const [data = [], err] = useFetcher({
    api: api.fetchListKpiTarget,
    autoRun: true,
    params: params
  });
  return data;
};


function KPIDetail(props) { 
  console.log("*** DETAIL ***");
  const { t } = useTranslation();    

  var MNV = props.MNV;
  var Period = props.Period;
  var TypeKPI = props.TypeKPI.type;

  console.log("KPIDetail:",MNV,Period,TypeKPI);

  var list = usePreload([MNV, Period]);
  console.log("list:",list);
  var tableKPI;

  if (list && list.length > 0) {   
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
          list.map((item, index) => {
            return <tr key={index}>              
              <td>{index}</td>                            
              <td>{item.Name}</td>
              <td className="text-center">{item.Weight}</td>          
            </tr>;
          })
        }
      </tbody>
    </table>;  
  }

  return (    
      <div className="card shadow mb-4 mt-2 float-left w-100">        
        <div className="bg-warning text-white p-3">        
           <h6>
             <span className="float-left"> {props.TypeKPI.name} </span>
             <span className="float-right">{t("TỶ TRỌNG: 80%")} </span>
           </h6>           
        </div>
        <div className="card-body border border-warning">
          <div className="table-responsive">
            {tableKPI}
          </div>
        </div>
      </div>    
  );
}

export default KPIDetail;
