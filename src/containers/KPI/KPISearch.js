import React,{ useState } from "react";
import { useApi, useFetcher } from "../../modules";
import Select from 'react-select';
import { Link } from "react-router-dom";

function KPISearch(props) {   

  const [showAlert, setShowAlert] = useState(false); 

  var yearSelected = "";    
  var years = []; 
  
  props.years.forEach(function(year){          
      var obj = {value:year, label:year};
      years.push(obj);          
    });      
      
   const handleYearChange = selectedOption => {      
      yearSelected = selectedOption.value;  
      console.log(yearSelected);  
      setShowAlert(false);  
    };
   
  const searchOnClick = () => {
     console.log("searchOnClick> yearSelected:",yearSelected);

     setShowAlert(true);
    if(yearSelected == null) {

      console.log("### year select null");
      return;
    }

    //window.location.href=`/kpi/${yearSelected}`;
  }

    return (
        <div className="kpi-staff-info">
          <div className="text-uppercase title-group">
              LỰA CHỌN HIỂN THỊ KỲ ĐÁNH GIÁ
          </div>
          <div className="card border shadow mb-4 mt-2">
              <table className="table table-borderless" >  
                  <tbody>     
                        <tr>
                            <td> 
                               <span className="kpi-staff-info period-title"> Lựa chọn năm (bắt buộc) </span>                                    
                            </td>                            
                        </tr>
                        <tr>
                            <td style={{'width': '400px'}}>
                              <Select style={{'color':'black','width':'200px'}}                                    
                                    selectedValue={years}
                                    onChange={handleYearChange}
                                    placeholder="Chọn năm ..."                                    
                                    options={years} />
                            </td>
                            <td>
                               <button type="button" className="search-button" onClick={searchOnClick}>Tìm kiếm</button>                                
                            </td>
                        </tr>                        
                        {showAlert && <tr><td><span className="alert alert-danger">Vui lòng lựa chọn năm đánh giá</span></td></tr>}  
                                                
                  </tbody>
               </table>
           </div>
            
        </div>
      );
}

export default KPISearch;
