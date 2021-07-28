import React from 'react'
import { withTranslation } from "react-i18next"
import _, { debounce } from 'lodash'
import { removeAccents, formatStringByMuleValue } from "../../commons/Utils"

const DropdownValue = (props) => {
    const { labels } = props

    return (
        <div className="value-wrapper">
            <div className="value-item">{labels.join(", ")}</div>
        </div>  
    )
}

class DropdownCustomize extends React.Component {
    buttonType = {
        cancel: 0,
        apply: 1
    }
    constructor(props) {
        super(props)
        this.state = {
            isListOpen: false,
            keyword: "",
            optionsFilter: [],
            isSelectedAll: false,
            optionsSelected: {},
            optionsSelectedConfirmed: {},
            isShowLoadingFilter: false
        }

        this.handleInputFilter = debounce(this.filterUser, 800)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.options !== this.props.options) {
            this.setState({ optionsFilter: nextProps.options })
        }
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
        let optionsSelectedConfirmed = {...this.state.optionsSelectedConfirmed}
        let optionsSelected = {...this.state.optionsSelected}
        let isSelectedAll = {...this.state.isSelectedAll}

        if (type === this.buttonType.cancel) {
            optionsSelectedConfirmed = {}
            optionsSelected = {}
            isSelectedAll = false
        } else {
            const optionsSelected = {...this.state.optionsSelected}
            optionsSelectedConfirmed = {...optionsSelectedConfirmed, ...optionsSelected}
            isSelectedAll = (_.size(optionsSelected) > 0 && Object.values(optionsSelected).every(item => item && item.selected)) || false
            this.props.updateParent(optionsSelectedConfirmed)
            this.closeMenu()
        }

        this.setState({optionsSelectedConfirmed: optionsSelectedConfirmed, optionsSelected: optionsSelected, isSelectedAll: isSelectedAll})
    }

    handleInputChange = e => {
        const val = e != null ? e.target.value : ""
        this.setState({keyword: val})
        this.handleInputFilter(val)
    }

    filterUser = (value) => {
        const { options } = this.props

        if (value !== "") {
            this.setState({isShowLoadingFilter: true})
            const valueToFilter = removeAccents(value.trim().toLowerCase())
            const usersMapped = options.filter(item => (removeAccents(item.AD.toLowerCase()) == valueToFilter || removeAccents(item.label?.toLowerCase())?.includes(valueToFilter)))
            this.setState({isShowLoadingFilter: false, isSelectedAll: false, optionsFilter: usersMapped})
        } else {
            const optionsFilter = options
            const { optionsSelected } = this.state
            const isSelectedAll = optionsFilter.every(i => optionsSelected[i.value]?.selected)  
            this.setState({isSelectedAll: isSelectedAll, optionsFilter: optionsFilter})
        }
    }

    handleCheckboxChange = (key, e) => {
        let optionsSelected = {...this.state.optionsSelected}
        const checkedValue = e.target.checked
        let isSelectedAll = false
        const optionsFilter = [...this.state.optionsFilter]

        if (key === null) {
            let optionsSelectedTemp = {}
            for (let i = 0, len = optionsFilter.length; i < len; i++) {
                optionsSelectedTemp[optionsFilter[i].value] = {selected: checkedValue}
            }
            optionsSelected = optionsSelectedTemp
            isSelectedAll = checkedValue
        } else {
            optionsSelected[key] = {selected: checkedValue}
            isSelectedAll = Object.values(optionsFilter).every(i => optionsSelected[i.value]?.selected)
        }

        this.setState({isSelectedAll: isSelectedAll, optionsSelected: optionsSelected})
    }

    getListNameUsers = () => {
        const { optionsSelectedConfirmed } = this.state
        const { options } = this.props
        const userNames = options.filter(item => optionsSelectedConfirmed[item.value]?.selected).map(i => i.label)

        return userNames
    } 

    render() {
        const { isListOpen, keyword, isSelectedAll, optionsSelected, isShowLoadingFilter, optionsFilter, optionsSelectedConfirmed } = this.state
        const { placeholderText, options, t } = this.props
        const isDisabledButton = !options || options.length === 0
        const totalItemConfirmed = Object.values(optionsSelectedConfirmed).filter(item => item.selected).length

        return (
            <div className="dropdown-customize">
                <div className="dd-wrapper">
                    <div className="dd-header" onClick={this.toggleList}>
                        <div className="dd-header-title">
                            {
                                totalItemConfirmed > 0
                                ? <DropdownValue labels={this.getListNameUsers()} />
                                : <span className="placeholder">{placeholderText}</span>
                            }
                        </div>
                        {
                           totalItemConfirmed > 0
                            ? <span className="indicator"><span className="total-confirmed">{totalItemConfirmed}</span></span>
                            : isListOpen
                            ? <i className='fa fa-angle-up indicator up'></i>
                            : <i className='fa fa-angle-down indicator down'></i>
                        }
                    </div>
                    {
                        isListOpen ?
                            <div role="menu" className="dd-menu" onClick={e => e.stopPropagation()}>
                                <div className="button-block">
                                    <button type="button" className="btn btn-secondary cancel" onClick={e => this.handleButtonClick(e, this.buttonType.cancel)} disabled={isDisabledButton}>{t("CancelSearch")}</button>
                                    <button type="button" className="btn btn-primary apply" onClick={e => this.handleButtonClick(e, this.buttonType.apply)} disabled={isDisabledButton}>{t("ApplySearch")}</button>
                                </div>
                                <div className="input-search-block">
                                    <div className="wrap-input">
                                        <i className="fas fa-search ic-search"></i>
                                        <input type="text" placeholder={t("EnterKeywords")} value={keyword || ""} onChange={e => this.handleInputChange(e)} />
                                    </div>
                                </div>
                                 <div className="justify-content-center loading-block" style={{display: `${isShowLoadingFilter ? 'flex' : 'none'}`}}>
                                    <div className="spinner-border ic-loading" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                                {
                                    optionsFilter.length > 0 
                                    ?   <div role="list" className="dd-list">
                                            <label className="select-all">
                                                <input type="checkbox" checked={isSelectedAll} onChange={e => this.handleCheckboxChange(null, e)} />
                                                <span>{t("All")}</span>
                                            </label>
                                            <div className="items">
                                                {
                                                    optionsFilter.map((item, index) => {
                                                        let key = item.value
                                                        let ad = formatStringByMuleValue(item?.AD)
                                                        let subValue = ad ? `(${ad}) ${formatStringByMuleValue(item.jobTitle)}` : formatStringByMuleValue(item.jobTitle)
                                                        return <label className="item" key={index}>
                                                                    <input type="checkbox" className="i_checkbox" checked={optionsSelected[key]?.selected || false} onChange={e => this.handleCheckboxChange(key, e)} />
                                                                    <div className="label">
                                                                        <p className="main">{item.label || ""}</p>
                                                                        <p className="sub">{subValue}</p>
                                                                    </div>
                                                                </label>
                                                    })
                                                }
                                            </div>
                                        </div>
                                    : <div className="text-danger no-results">{t("NoDataFound")}</div>
                                }
                            </div>
                        : null
                    }
    
                </div>
            </div>
        )
    }
}

export default withTranslation()(DropdownCustomize)
