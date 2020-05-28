import React,{ useState } from "react";
import { useApi, useFetcher } from "../../../modules";
import { useTranslation } from "react-i18next";
import Select from 'react-select';

const usePreload = (params) => {
  const api = useApi();
  const [data = [], err] = useFetcher({
    api: api.getPeriodKpiGeneral,
    autoRun: true,
    params: params
  });
  return data;
};

function KPISearch(props) {
  const { t } = useTranslation();  
  
  var yearSelected = "";
  var quarterSelected = "";

  var periods = usePreload([props.MNV]);
  var years = [];
  if(periods && periods.length > 0){
      periods.forEach(function(item){
          //item : {Period: "Q1/2019"}
          var year = item.Period.split("/")[1];
          var obj = {value:year, label:year};
          years.push(obj);
          
        });      
  };   
  
  const styleTieuDe = {
      'textAlign': 'left',
      'fontFamily': 'Light 21px/25px Helvetica Neue',
      'letterSpacing': '0px',
      'color': '#B3B3B3',
      'marginBottom': '10px'
  };

  const styleHeader = {
      'textAlign': 'left',
      'fontFamily': 'regular 23px/27px Helvetica Neue',
      'letterSpacing': '0px',
      'color': '#283280'
  };

  const styleTimKiem = {
      'width': '270px',
      'height': '45px',
      'background': '#F9C20A 0% 0% no-repeat padding-box',
      'borderRadius': '30px',
      'fontFamily': 'Light 21px/25px Helvetica Neue'
  };
   
  const styleGroupTD = {
      'textAlign': 'left',
      'fontFamily': 'Light 21px/25px Helvetica Neue',
      'letterSpacing': '0px',
      'color': '#000000',
      'borderTop' : 'none'      
  };

  const listQuarter = [
      { value: 'Q1', label: 'Quý 1' },
      { value: 'Q2', label: 'Quý 2' },
      { value: 'Q3', label: 'Quý 3' },
      { value: 'Q4', label: 'Quý 4' }
    ];

    quarterSelected = listQuarter[0];

   const handleYearChange = selectedOption => {      
      yearSelected = selectedOption.value;      
    };

   const handleQuarterChange = selectedOption => {
      quarterSelected = selectedOption.value;      
    };

    return (
        <div>
          <div className="text-uppercase" style={styleHeader} >
              LỰA CHỌN HIỂN THỊ KỲ ĐÁNH GIÁ
          </div>
          <div className="card border shadow mb-4 mt-2">
              <table className="table" style={{'marginBottom':'4px'}}>  
                  <tbody>         
                        <tr>                
                            <td style={styleGroupTD}> 
                                <div style={styleTieuDe}> Lựa chọn năm (bắt buộc) </div>                                    
                                <Select style={{'color':'black','height': '45px'}}                                    
                                    selectedValue={yearSelected}
                                    value={yearSelected}
                                    onChange={handleYearChange}                                    
                                    options={years} />
                            </td>                  
                            <td style={styleGroupTD}> 
                                <div style={styleTieuDe}> Lựa chọn quý (bắt buộc) </div>                                
                                <Select style={{'color':'black','height': '45px'}}
                                    value={quarterSelected}
                                    onChange={handleQuarterChange} 
                                    selectedValue={quarterSelected}
                                    options={listQuarter} />
                            </td>
                            <td style={{'verticalAlign': 'bottom'}}>                      
                                <button type="button" className="btn btn-warning" style={styleTimKiem}>Tìm kiếm</button>
                            </td>          
                        </tr>
                  </tbody>
               </table>
           </div>
            
        </div>
      );
}

export default KPISearch;
