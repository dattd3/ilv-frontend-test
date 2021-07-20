import React from 'react'
import Select , { components } from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import { Image } from 'react-bootstrap'
import axios from 'axios'
import moment from 'moment'
import DropdownCustomize from "./DropdownCustomize";

import { withTranslation } from "react-i18next"
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

class LeaveFund extends React.Component {
  constructor() {
    super()
    this.state = {
      filter: {
        fromDate: null,
        toDate: null,
        employee: null
      }
    }
  }

  handleDatePickerChange = dateInput => {

  }

  submitFilter = () => {

  }

  handleChangeSelectInput = () => {

  }

  onDeleteFileAttachment = (a, b) => {

  }

  handleCheckboxChange = () => {

  }

  handleInputTextChange = e => {

  }

  handleCancelSelectCustomize = () => {
    console.log("cancel")
  }

  handleApplySelectCustomize = () => {
    console.log("Apply")
  }

  handleChangeInputSelectCustomize = e => {
    console.log("kaaaaaaaaaaaaa")
    console.log(e)
  }

  render() {
    const { t } = this.props
    const {filter} = this.state

    const attachmentStyles = {
      container: base => ({
        ...base,
        width: '100%',
      }),
      input: (base) => ({
        ...base,
        color: '#ffffff'
      }),
      menu: (base) => ({
        ...base,
        borderRadius: '0',
        padding: '0'
      }),
      menuList: (base, state) => ({
        ...base,
        padding: 0,
        "::-webkit-scrollbar": {
            backgroundColor: "#F5F5F5",
            width: "8px",
            height: "8px"
        },
        "::-webkit-scrollbar-thumb": {
            backgroundColor: "#a4afb7",
            borderLeft: "1px solid white",
            borderRight: "1px solid white",
            borderTop: "1px solid white",
            borderBottom: "1px solid white",
            borderRadius: "4px"
        },
        "::-webkit-scrollbar-track" : {
            backgroundColor: "#d3d3d3",
            borderLeft: "3.5px solid white",
            borderRight: "3.5px solid white",
            borderTop: "3.5px solid white",
            borderBottom: "3.5px solid white"
        }
    }),
      menuList: (base) => ({
        ...base,
        padding: '0'
      }),
      option: (base) => ({
        ...base,
        padding: '0 10px'
      }),
      control: (base) => ({
        ...base,
        color: '#a6afb6',
        border: '1px solid #a6afb6',
        boxShadow: 'none',
        borderRadius: '0px',
        maxHeight: '200px',
        padding: '0 10px',
        "&:hover": {
            borderColor: "#a6afb6",
            color: "#a6afb6"
        }
      }),
      dropdownIndicator: base => ({
          ...base,
          color: '#a6afb6',
          fontWeight: 'normal',
          "&:hover": {
              color: "#a6afb6"
          }
      })
    }

    // const customStyles = {
    //   container: base => ({
    //     ...base,
    //     width: '100%',
    //     zIndex: 100,
    //     paddingRight: '22px'
    //   }),
    //   input: (base) => ({
    //       ...base,
    //       color: '#ffffff'
    //   }),
    //   control: (base) => ({
    //     ...base,
    //     color: '#a6afb6',
    //     border: '1px solid #a6afb6',
    //     boxShadow: 'none',
    //     borderRadius: '0px',
    //     padding: '0 15px',
    //     height: '42px',
    //     "&:hover": {
    //       borderColor: "#a6afb6",
    //       color: "#a6afb6"
    //     }
    //   }),
    //   dropdownIndicator: base => ({
    //       ...base,
    //       color: '#a6afb6',
    //       fontWeight: 'normal',
    //       "&:hover": {
    //         color: "#a6afb6"
    //       }
    //   })
    // }

    // const CustomOption = ({ children, ...props }) => (
    //   <components.ValueContainer {...props}>
    //     <div style={{paddingRight: '40px'}}>Xuất file</div><div style={{visibility: 'hidden'}}>{children}</div>
    //   </components.ValueContainer>
    // )
  
    const AttachmentOption = ({ children, ...props }) => (
      <components.ValueContainer {...props}>
        <div>Tìm kiếm nhân viên</div>
        <div style={{visibility: 'hidden'}}>{children}</div>
      </components.ValueContainer>
    )

    const Menu = (props) => {
      return (
          <components.Menu {...props} style={{padding: '0px'}}>
            <div style={{fontSize: '14px', fontFamily: 'Arial, Helvetica, sans-serif', color: '#000000'}}>
              <div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', padding: '15px 0 10px 0'}}>
                  <button type="button" 
                    style={{padding: '5px', width: '90px', textAlign: 'center', border: 'none', background: 'rgb(179, 179, 179)', color: '#FFFFFF', borderRadius: '4px'}} 
                    onClick={props.selectProps.handleCancelSelectCustomize}>Hủy</button>
                  <button type="button" 
                    style={{padding: '5px', width: '90px', textAlign: 'center', border: 'none', background: '#4e73df', color: '#FFFFFF', borderRadius: '4px'}}
                    onClick={props.selectProps.handleApplySelectCustomize}>Áp dụng</button>
                </div>
                <div style={{padding: '5px 10px', borderRadius: '4px'}}>
                  <input type="text" placeholder="Nhập tìm kiếm" value={props.selectProps.inputValue || ""} onChange={e => props.selectProps.handleChangeInputSelectCustomize} 
                  style={{border: '1px solid #d1d3e2', borderRadius: '4px', padding: '4px 5px', width: '100%'}} />
                </div>
                <div style={{padding: '10px 10px 0 10px'}}>
                  <div style={{borderBottom: '1px solid #d1d3e2', paddingBottom: '5px'}}>
                    <input type="checkbox" checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} style={{marginTop: '4px'}} />
                    <span style={{margin: '-4px 0 0 6px'}}>Tất cả</span>
                  </div>
                </div>
              </div>
              <div>{props.children}</div>
            </div>
          </components.Menu>
      );
    };

    const filterOption = (option, inputValue) => {
      console.log("njfjkjknsdffd")
      console.log()
    };

    const Option = props => {
      console.log(props)

      return (
        <div>
          <components.Option {...props} innerProps={{
            ...props.innerProps,
            // onClick: e => {
            //   const nodeName = e && e.target && e.target.nodeName || null;
            //   if(nodeName && nodeName.toLowerCase() === 'img'){
            //       props.innerProps.onClick();
            //   } else if (nodeName && nodeName.toLowerCase() === 'div'){
            //       e.stopPropagation(); 
            //       e.preventDefault(); 
            //   }
            // }
          }} >
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', borderBottom: '1px solid #DEDEDE', padding: '0 0 5px 0', cursor: 'pointer'}}>
              <input type="checkbox" id={`checkbox-id-${props.value}`} checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
              <label htmlFor={`checkbox-id-${props.value}`} style={{display: 'inline-flex', margin: '-4px 0 0 5px', flexDirection: 'column', overflow: 'hidden'}}>
                <span>{props.label}</span>
                <span style={{fontSize: '12px', fontStyle: 'italic', color: '#858796', marginTop: '-2px'}}>{props.data.jobTitle}</span>
              </label>
            </div>
          </components.Option>
        </div>
      )
    }

    const employees = [
      {value: 1, label: "Nguyễn Văn Cường", jobTitle: "Chuyên viên kỹ thuật"},
      {value: 2, label: "Nguyễn Đức Chiến", jobTitle: "Chuyên viên kỹ thuật"},      
      {value: 1, label: "Nguyễn Văn Cường", jobTitle: "Chuyên viên kỹ thuật"},
      {value: 2, label: "Nguyễn Đức Chiến", jobTitle: "Chuyên viên kỹ thuật"},   
      {value: 1, label: "Nguyễn Văn Cường", jobTitle: "Chuyên viên kỹ thuật"},
      {value: 2, label: "Nguyễn Đức Chiến", jobTitle: "Chuyên viên kỹ thuật"}
    ]

    return (
      <div className="leave-fund-section">
        <div className="card border shadow container-fluid filter-block">
          <div className="row">
            {/* <div className="col-md-3 column">
              <div className="title">Từ ngày</div>
              <div className="content input-container">
                <label>
                  <DatePicker
                    placeholderText="DD/MM/YYYY"
                    selected={filter.fromDate ? moment(filter.fromDate, 'YYYY-MM-DD').toDate() : null}
                    onChange={fromDate => this.handleDatePickerChange(fromDate)}
                    dateFormat="dd/MM/yyyy"
                    showMonthDropdown={true}
                    showYearDropdown={true}
                    locale="vi"
                    autoComplete="off"
                    className="form-control form-control-lg input"/>
                    <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                </label>
              </div>
            </div>
            <div className="col-md-3 column">
              <div className="title">Đến ngày</div>
              <div className="content input-container">
                <label>
                  <DatePicker
                    placeholderText="DD/MM/YYYY"
                    selected={filter.fromDate ? moment(filter.fromDate, 'YYYY-MM-DD').toDate() : null}
                    onChange={fromDate => this.handleDatePickerChange(fromDate)}
                    dateFormat="dd/MM/yyyy"
                    showMonthDropdown={true}
                    showYearDropdown={true}
                    locale="vi"
                    autoComplete="off"
                    className="form-control form-control-lg input"/>
                    <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                </label>
              </div>
            </div> */}
            <div className="col-md-3 column">
              <div className="title">Lựa chọn nhân viên</div>
              <div className="content input-container">
                <DropdownCustomize options={employees} placeholderText="Lựa chọn nhân viên"  />

                {/* <Select components={{ValueContainer: AttachmentOption, IndicatorSeparator:() => null, Option, Menu, GroupHeading }} closeMenuOnSelect={false} 
                  options={employees}
                  handleCancelSelectCustomize={this.handleCancelSelectCustomize}
                  handleApplySelectCustomize={this.handleApplySelectCustomize}
                  handleChangeInputSelectCustomize={this.handleChangeInputSelectCustomize}
                  styles={{...attachmentStyles, option: (styles, state) => ({
                    ...styles,
                    backgroundColor: state.isSelected ? null : null,
                    }), control: (styles) => ({
                      ...styles,
                      color: '#858796'
                    })
                  }}
                  minMenuHeight={40}
                  filterOption={this.filterOption}
                  onChange={e => {this.onDeleteFileAttachment(1111, e)}}
                  menuPortalTarget={document.body} /> */}
              </div>
            </div>
            <div className="col-md-3 column">
              <div className="title">&nbsp;</div>
              <div className="content input-container">
                <button type="button" className="btn-search" onClick={this.submitFilter}>Tim kiếm</button>
              </div>
            </div>
          </div>
        </div>

        <div className="card border shadow result-block">
          <div className="result-wrap-table">
          <table className="result-table">
              <thead>
                <tr>
                  <th className="text-center text-uppercase font-weight-bold text-danger" rowSpan="2">Họ tên</th>
                  <th className="text-center text-uppercase font-weight-bold text-warning" colSpan="3">Ngày phép tồn năm trước</th>
                  <th className="text-center text-uppercase font-weight-bold text-primary" colSpan="3">Ngày phép năm nay</th>
                  <th className="text-center text-uppercase font-weight-bold" rowSpan="2">Tổng số ngày phép còn được sử dụng</th>
                  <th className="text-center text-uppercase font-weight-bold text-warning" colSpan="3">Giờ bù tồn năm trước</th>
                  <th className="text-center text-uppercase font-weight-bold text-primary" colSpan="3">Giờ bù tồn năm nay</th>
                  <th className="text-center text-uppercase font-weight-bold" rowSpan="2">Tổng số giờ bù còn được sử dụng</th>
                </tr>
                <tr>
                  <th className="text-center"><span className="same-width">Đã sử dụng</span></th>
                  <th className="text-center text-warning"><span className="same-width">Còn được sử dụng</span></th>
                  <th className="text-center"><span className="same-width">Hạn sử dụng</span></th>
                  <th className="text-center"><span className="same-width">Đã sử dụng</span></th>
                  <th className="text-center text-primary"><span className="same-width">Còn được sử dụng</span></th>
                  <th className="text-center"><span className="same-width">Hạn sử dụng</span></th>
                  <th className="text-center"><span className="same-width">Đã sử dụng</span></th>
                  <th className="text-center text-warning"><span className="same-width">Còn được sử dụng</span></th>
                  <th className="text-center"><span className="same-width">Hạn sử dụng</span></th>
                  <th className="text-center"><span className="same-width">Đã sử dụng</span></th>
                  <th className="text-center text-primary"><span className="same-width">Còn được sử dụng</span></th>
                  <th className="text-center"><span className="same-width">Hạn sử dụng</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="full-name text-danger text-center"><span>Nguyễn Văn Cường</span></td>
                  <td className="text-muted text-center"><span className="same-width">1</span></td>
                  <td className="text-warning text-center"><span className="same-width">3</span></td>
                  <td className="text-success text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-muted text-center"><span className="same-width">5</span></td>
                  <td className="text-primary text-center"><span className="same-width">6</span></td>
                  <td className="text-success text-center"><span className="same-width">7</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-muted text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-muted text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-danger text-center"><span>Nguyễn Đức Chiến</span></td>
                  <td className="text-muted text-center"><span className="same-width">1</span></td>
                  <td className="text-warning text-center"><span className="same-width">3</span></td>
                  <td className="text-success text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-muted text-center"><span className="same-width">5</span></td>
                  <td className="text-primary text-center"><span className="same-width">6</span></td>
                  <td className="text-success text-center"><span className="same-width">7</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-muted text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-muted text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-danger text-center"><span>Nguyễn Đức Hải</span></td>
                  <td className="text-muted text-center"><span className="same-width">1</span></td>
                  <td className="text-warning text-center"><span className="same-width">3</span></td>
                  <td className="text-success text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-muted text-center"><span className="same-width">5</span></td>
                  <td className="text-primary text-center"><span className="same-width">6</span></td>
                  <td className="text-success text-center"><span className="same-width">7</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-muted text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-muted text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-danger text-center"><span>Đỗ Văn Chiến</span></td>
                  <td className="text-muted text-center"><span className="same-width">1</span></td>
                  <td className="text-warning text-center"><span className="same-width">3</span></td>
                  <td className="text-success text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-muted text-center"><span className="same-width">5</span></td>
                  <td className="text-primary text-center"><span className="same-width">6</span></td>
                  <td className="text-success text-center"><span className="same-width">7</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-muted text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-muted text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-danger text-center"><span>Nguyễn Đức Chiến</span></td>
                  <td className="text-muted text-center"><span className="same-width">1</span></td>
                  <td className="text-warning text-center"><span className="same-width">3</span></td>
                  <td className="text-success text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-muted text-center"><span className="same-width">5</span></td>
                  <td className="text-primary text-center"><span className="same-width">6</span></td>
                  <td className="text-success text-center"><span className="same-width">7</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-muted text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-muted text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-danger text-center"><span>Nguyễn Đức Hải</span></td>
                  <td className="text-muted text-center"><span className="same-width">1</span></td>
                  <td className="text-warning text-center"><span className="same-width">3</span></td>
                  <td className="text-success text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-muted text-center"><span className="same-width">5</span></td>
                  <td className="text-primary text-center"><span className="same-width">6</span></td>
                  <td className="text-success text-center"><span className="same-width">7</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-muted text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-muted text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-danger text-center"><span>Đỗ Văn Chiến</span></td>
                  <td className="text-muted text-center"><span className="same-width">1</span></td>
                  <td className="text-warning text-center"><span className="same-width">3</span></td>
                  <td className="text-success text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-muted text-center"><span className="same-width">5</span></td>
                  <td className="text-primary text-center"><span className="same-width">6</span></td>
                  <td className="text-success text-center"><span className="same-width">7</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-muted text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-muted text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-danger text-center"><span>Nguyễn Đức Chiến</span></td>
                  <td className="text-muted text-center"><span className="same-width">1</span></td>
                  <td className="text-warning text-center"><span className="same-width">3</span></td>
                  <td className="text-success text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-muted text-center"><span className="same-width">5</span></td>
                  <td className="text-primary text-center"><span className="same-width">6</span></td>
                  <td className="text-success text-center"><span className="same-width">7</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-muted text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-muted text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-danger text-center"><span>Nguyễn Đức Hải</span></td>
                  <td className="text-muted text-center"><span className="same-width">1</span></td>
                  <td className="text-warning text-center"><span className="same-width">3</span></td>
                  <td className="text-success text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-muted text-center"><span className="same-width">5</span></td>
                  <td className="text-primary text-center"><span className="same-width">6</span></td>
                  <td className="text-success text-center"><span className="same-width">7</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-muted text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-muted text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
                <tr>
                  <td className="full-name text-danger text-center"><span>Đỗ Văn Chiến</span></td>
                  <td className="text-muted text-center"><span className="same-width">1</span></td>
                  <td className="text-warning text-center"><span className="same-width">3</span></td>
                  <td className="text-success text-center"><span className="same-width">30/05/2021</span></td>
                  <td className="text-muted text-center"><span className="same-width">5</span></td>
                  <td className="text-primary text-center"><span className="same-width">6</span></td>
                  <td className="text-success text-center"><span className="same-width">7</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                  <td className="text-muted text-center"><span className="same-width">9</span></td>
                  <td className="text-warning text-center"><span className="same-width">2</span></td>
                  <td className="text-success text-center"><span className="same-width">3</span></td>
                  <td className="text-muted text-center"><span className="same-width">4</span></td>
                  <td className="text-primary text-center"><span className="same-width">1</span></td>
                  <td className="text-success text-center"><span className="same-width">0</span></td>
                  <td className="font-weight-bold text-danger text-center"><span className="sum-width">99</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(LeaveFund)
