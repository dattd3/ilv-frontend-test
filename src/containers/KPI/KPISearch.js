import React, { useRef } from "react"
import Select from 'react-select'
import { useTranslation } from "react-i18next"

function KPISearch(props) {
  const { t } = useTranslation()
  const selectRef = useRef()

  const years = (props.years || []).map(item => {
    return {value: item, label: item}
  })
  
  const searchOnClick = () => {             
    const optionSelected = selectRef.current.state.value.value
    props.selectPeriodCompleted(optionSelected)
  }

  const customStyles = {
    control: base => ({
      ...base,
      height: 40,
      minHeight: 40,
      fontSize: '14px'
    })
  }

  return (    
    <div className="kpi-staff-search">
      <div className="title-group">{t("SelectPeriod")}</div>
      <div className="card border shadow">
        <table className="table table-borderless">
          <tbody>
            <tr>
              <td style={{'paddingTop':'20px', 'paddingBottom':'5px'}}>
                <span className="kpi-staff-info period-title">Lựa chọn năm (bắt buộc)</span>
              </td>
            </tr>
            <tr>
              <td style={{'width': '350px', paddingLeft: 12}}>
                <Select style={customStyles}
                  selectedValue={years}
                  defaultValue={years.find(item => item.value == props.period)}
                  options={years} 
                  styles={customStyles}
                  ref={selectRef} />
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
  )
}

export default KPISearch
