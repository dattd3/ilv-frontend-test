import React,{ useState } from "react";
import { useApi, useFetcher } from "../../modules";
import Select from 'react-select';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function KPISearch(props) {   
  //const [showAlert, setShowAlert] = useState(false);  
  const { t } = useTranslation();
  const selectRef = React.createRef();
  var years = []; 
  
  props.years.forEach(function(year){          
      var obj = {value:year, label:year};
       years.push(obj);          
    });      
      
  
  const searchOnClick = () => {             
    const optionSelected = selectRef.current.state.value.value;    
    props.selectPeriodCompleted(optionSelected);

    //window.location.href=`/kpi/${optionSelected}`;    
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
              {t("SelectPeriod")}
          </div>
          <div className="card border shadow mb-4 mt-2">
              <table className="table table-borderless" >  
                  <tbody>     
                        <tr>
                            <td style={{'paddingTop':'20px', 'paddingBottom':'5px'}}>
                               <span className="kpi-staff-info period-title"> Lựa chọn năm (bắt buộc) </span>                                    
                            </td>                            
                        </tr>
                        <tr>
                            <td style={{'width': '350px'}}>
                              <Select style={{'color':'black'}}                                    
                                    selectedValue={years}
                                    defaultValue={ years.length > 0 ? years[years.length-1] : "" }
                                    options={years} 
                                    styles={customStyles}
                                    ref={selectRef}
                                    />
                            </td>
                            <td>
                               <button type="button" className="search-button" onClick={searchOnClick}>{t("Search")}</button>                                
                            </td>
                        </tr>            
                        {/*
                        {showAlert && <tr><td><span className="alert alert-danger">Vui lòng lựa chọn năm đánh giá</span></td></tr>}  
                       */}
                                                
                  </tbody>
               </table>
           </div>
            
        </div>
      );
}

export default KPISearch;
