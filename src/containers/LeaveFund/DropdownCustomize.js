import React from 'react'
import { withTranslation } from "react-i18next"
import _, { debounce } from 'lodash'
import { getRequestConfigurations } from "../../commons/Utils";

const DropdownValue = (props) => {
    const { labels } = props

    const removeItem = index => {
    }

    return (
        <div className="value-wrapper">
            {
                labels.map((label, index) => {
                    return <span className="value-item" key={index}>
                                <span>{label}</span>
                                <span onClick={removeItem(index)}>x</span>
                            </span>
                })
            }
        </div>  
    )
}

// const DropdownList = (props) => {
//     const { labels } = props

//     const removeItem = index => {
//     }

//     return (
//         <div role="list" className="dd-list">
//             <div className="select-all">
//                 <input type="checkbox" checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
//                 <span>Tất cả</span>
//             </div>
//             <div className="items">
//                 <label className="item">
//                     <input type="checkbox" className="i_checkbox" checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
//                     <div className="label">
//                         <p className="main">Trần Lan Anh</p>
//                         <p className="sub">Chuyên viên kỹ thuật</p>
//                     </div>
//                 </label>
//                 <label className="item">
//                     <input type="checkbox" className="i_checkbox" checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
//                     <div className="label">
//                         <p className="main">Trần Lan Anh</p>
//                         <p className="sub">Chuyên viên kỹ thuật</p>
//                     </div>
//                 </label>
//                 <label className="item">
//                     <input type="checkbox" className="i_checkbox" checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
//                     <div className="label">
//                         <p className="main">Trần Lan Anh</p>
//                         <p className="sub">Chuyên viên kỹ thuật</p>
//                     </div>
//                 </label>
//                 <label className="item">
//                     <input type="checkbox" className="i_checkbox" checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
//                     <div className="label">
//                         <p className="main">Trần Lan Anh</p>
//                         <p className="sub">Chuyên viên kỹ thuật</p>
//                     </div>
//                 </label>
//                 <label className="item">
//                     <input type="checkbox" className="i_checkbox" checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
//                     <div className="label">
//                         <p className="main">Trần Lan Anh</p>
//                         <p className="sub">Chuyên viên kỹ thuật</p>
//                     </div>
//                 </label>
//                 <label className="item">
//                     <input type="checkbox" className="i_checkbox" checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
//                     <div className="label">
//                         <p className="main">Trần Lan Anh</p>
//                         <p className="sub">Chuyên viên kỹ thuật</p>
//                     </div>
//                 </label>
//                 <label className="item">
//                     <input type="checkbox" className="i_checkbox" checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
//                     <div className="label">
//                         <p className="main">Trần Lan Anh</p>
//                         <p className="sub">Chuyên viên kỹ thuật</p>
//                     </div>
//                 </label>
//             </div>
//         </div>
//     )
// }

class DropdownCustomize extends React.Component {
    buttonType = {
        cancel: 0,
        apply: 1
    }
    constructor(props) {
        super(props)
        this.state = {
            isListOpen: false,
            keyword: ""
        }

        this.handleInputFilter = debounce(this.filterUser, 1000)
    }

    componentDidUpdate(){
        const { isListOpen } = this.state
      
        setTimeout(() => {
            if(isListOpen){
                window.addEventListener('click', this.closeMenu)
            } else{
                window.removeEventListener('click', this.closeMenu)
            }
        }, 0)
    }

    toggleList = () => {
        this.setState(prevState => ({
            isListOpen: !prevState.isListOpen
        }))
    }

    closeMenu = () => {
        this.setState({isListOpen: false})
    }

    handleButtonClick = (e, type) => {
        e.stopPropagation()
    }

    handleInputChange = e => {
        // e.stopPropagation()
        const val = e != null ? e.target.value : ""
        this.setState({keyword: val})
        this.handleInputFilter(val)
    }

    filterUser = (value) => {
        if (value !== "") {
            // const responses = await axios.get(`${process.env.REACT_APP_HRDX_REQUEST_API_URL}${apiPath}${value}`, getRequestConfigurations())
        }
    }

    handleCheckboxChange = () => {

    }

    render() {
        const { isListOpen } = this.state
        const { options, placeholderText } = this.props

        return (
            <div className="dropdown-customize">
                <div className="dd-wrapper">
                    <div className="dd-header" onClick={this.toggleList}>
                        <div className="dd-header-title">
                            {
                                placeholderText 
                                ? <span className="placeholder">{placeholderText}</span>
                                : <DropdownValue labels={[]} />
                            }
                        </div>
                        {
                            isListOpen
                            ? <i className='fa fa-angle-up indicator up'></i>
                            : <i className='fa fa-angle-down indicator down'></i>
                        }
                    </div>
                    {
                        isListOpen ?
                            <div role="menu" className="dd-menu">
                                <div className="button-block">
                                    <button type="button" className="btn btn-secondary cancel" onClick={e => this.handleButtonClick(e, this.buttonType.cancel)}>Hủy</button>
                                    <button type="button" className="btn btn-primary apply" onClick={e => this.handleButtonClick(e, this.buttonType.apply)}>Áp dụng</button>
                                </div>
                                <div className="input-search-block">
                                    <input type="text" placeholder="Nhập tìm kiếm" value="" readOnly={true} onClick={e => e.stopPropagation()} onChange={e => this.handleInputChange(e)} />
                                </div>
                                {/* <DropdownList onClick={e => e.stopPropagation()} /> */}
                                <div role="list" className="dd-list">
                                    <div className="select-all">
                                        <input type="checkbox" checked={false} onClick={e => e.stopPropagation()} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
                                        <span>Tất cả</span>
                                    </div>
                                    <div className="items">
                                        <label className="item">
                                            <input type="checkbox" className="i_checkbox" checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
                                            <div className="label">
                                                <p className="main">Trần Lan Anh</p>
                                                <p className="sub">Chuyên viên kỹ thuật</p>
                                            </div>
                                        </label>
                                        <label className="item">
                                            <input type="checkbox" className="i_checkbox" checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
                                            <div className="label">
                                                <p className="main">Trần Lan Anh</p>
                                                <p className="sub">Chuyên viên kỹ thuật</p>
                                            </div>
                                        </label>
                                        <label className="item">
                                            <input type="checkbox" className="i_checkbox" checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
                                            <div className="label">
                                                <p className="main">Trần Lan Anh</p>
                                                <p className="sub">Chuyên viên kỹ thuật</p>
                                            </div>
                                        </label>
                                        <label className="item">
                                            <input type="checkbox" className="i_checkbox" checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
                                            <div className="label">
                                                <p className="main">Trần Lan Anh</p>
                                                <p className="sub">Chuyên viên kỹ thuật</p>
                                            </div>
                                        </label>
                                        <label className="item">
                                            <input type="checkbox" className="i_checkbox" checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
                                            <div className="label">
                                                <p className="main">Trần Lan Anh</p>
                                                <p className="sub">Chuyên viên kỹ thuật</p>
                                            </div>
                                        </label>
                                        <label className="item">
                                            <input type="checkbox" className="i_checkbox" checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
                                            <div className="label">
                                                <p className="main">Trần Lan Anh</p>
                                                <p className="sub">Chuyên viên kỹ thuật</p>
                                            </div>
                                        </label>
                                        <label className="item">
                                            <input type="checkbox" className="i_checkbox" checked={false} onChange={e => this.handleCheckboxChange(1, e, "currentAddressIndicator")} />
                                            <div className="label">
                                                <p className="main">Trần Lan Anh</p>
                                                <p className="sub">Chuyên viên kỹ thuật</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        : null
                    }
    
                </div>
            </div>
        )
    }
}

export default withTranslation()(DropdownCustomize)
