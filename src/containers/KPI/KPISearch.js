import React,{ useState } from "react";
import { useApi, useFetcher } from "../../modules";
import Select from 'react-select';
import { Link } from "react-router-dom";

function KPISearch(props) {   
  const [showAlert, setShowAlert] = useState(false);
  const [yearSelected, setYearSelected] = useState("");   
  var years = []; 
  
  props.years.forEach(function(year){          
      var obj = {value:year, label:year};
      years.push(obj);          
    });      
      
   const handleYearChange = selectedOption => {             
      setYearSelected(selectedOption.value);      
      setShowAlert(false);  
    };
   
  const searchOnClick = () => {     
    if(!yearSelected) {
      setShowAlert(true);      
      return;
    }
    window.location.href=`/kpi/${yearSelected}`;
  }

  const customStyles = {
    control: base => ({
      ...base,
      height: 45,
      minHeight: 45,
      marginLeft: 10,
      width:'100%'
    })
  };

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
                               <br/>                                
                               <span className="kpi-staff-info period-title"> Lựa chọn năm (bắt buộc) </span>                                    
                            </td>                            
                        </tr>
                        <tr>
                            <td style={{'width': '350px'}}>
                              <Select style={{'color':'black'}}                                    
                                    selectedValue={years}
                                    defaultValue={years[0]}
                                    onChange={handleYearChange}
                                    placeholder="Chọn năm ..."                                    
                                    options={years} 
                                    styles={customStyles}
                                    />
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
