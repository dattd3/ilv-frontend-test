import React,{ useState } from "react";
import { useApi, useFetcher } from "../../modules";
import Select from 'react-select';

function KPISearch(props) {    
  var yearSelected = "";    
  var years = []; 

  console.log("KPISearch > props:", props); 

  props.years.forEach(function(year){          
      var obj = {value:year, label:year};
      years.push(obj);          
    });      
      
   const handleYearChange = selectedOption => {      
      yearSelected = selectedOption.value;  
      console.log(yearSelected);    
    };
   
    return (
        <div className="kpi-staff-info">
          <div className="text-uppercase title-group">
              LỰA CHỌN HIỂN THỊ KỲ ĐÁNH GIÁ
          </div>
          <div className="card border shadow mb-4 mt-2">
              <table className="table" style={{'marginBottom':'4px'}}>  
                  <tbody>         
                        <tr>                
                            <td style={{'width': '400px'}}> 
                                <div className="kpi-staff-info period-title"> Lựa chọn năm (bắt buộc) </div>                                    
                                <Select style={{'color':'black','width':'200px'}}                                    
                                    selectedValue={years}
                                    onChange={handleYearChange}
                                    placeholder="Chọn năm ..."                                    
                                    options={years} />
                            </td>                                              
                            <td style={{'verticalAlign': 'bottom'}}>                      
                                <button type="button" className="search-button">Tìm kiếm</button>
                            </td>          
                        </tr>
                  </tbody>
               </table>
           </div>
            
        </div>
      );
}

export default KPISearch;
