import React from "react";
import { useTranslation } from "react-i18next";

function KPIDetail(props) {   
  const { t } = useTranslation();    
  var list = props.Data;    
  var formColor = props.TypeKPI.color;
  var tableKPI;
  var totalWeight = 0;

  if (list && list.length > 0) {  
   
    totalWeight = list.reduce((total, next) => total + parseFloat(next.Weight), 0);    

     tableKPI = <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">    
      <thead>
        <tr>                
          <th className="h6 small font-weight-bold mt-0 pt-0"> STT </th>
          <th className="h6 small font-weight-bold mt-0 pt-0"> Hạng mục đánh giá </th>
          <th className="h6 small font-weight-bold mt-0 pt-0" style={{'width':'100px','color':formColor}}>Tỷ trọng</th>
        </tr>
      </thead>
      <tbody>
        {
          list.map((item, index) => {
            return <tr key={index}>              
              <td>{ parseInt(index) + 1}</td>                            
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
        <div className="text-white p-3" style={{'background':formColor}}>        
           <h6>
             <span className="float-left"> {props.TypeKPI.name} </span>
             <span className="float-right">{t("TỶ TRỌNG")}: &nbsp; {totalWeight} % </span>
           </h6>           
        </div>
        <div className="card-body" style={{'border':'1px solid','borderColor':formColor}}>
          <div className="table-responsive">
            {tableKPI}
          </div>
        </div>
      </div>    
  );
}

export default KPIDetail;
