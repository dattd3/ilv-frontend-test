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
      height: 38,
      minHeight: 38,
      fontSize: '14px'
    })
  }

  return (    
    <div className="kpi-staff-search">
      <div className="title-group">{t("SelectPeriod")}</div>
      <div className="card border">
        <table className="table table-borderless">
          <tbody>
            <tr>
              <td style={{padding: "15px 15px 10px 15px"}}>
                <span className="kpi-staff-info period-title">Lựa chọn năm (bắt buộc)</span>
              </td>
            </tr>
            <tr>
              <td style={{'width': 350, padding: "0 15px 15px 15px"}}>
                <Select style={customStyles}
                  selectedValue={years}
                  defaultValue={years.find(item => item.value == props.period)}
                  options={years} 
                  styles={customStyles}
                  ref={selectRef} />
              </td>
              <td style={{padding: "0 15px 15px 15px"}}>
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
