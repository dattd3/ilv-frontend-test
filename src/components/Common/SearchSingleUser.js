import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import _, { debounce } from 'lodash'
import { withTranslation, useTranslation} from "react-i18next"
import Constants from "../../commons/Constants"
import { formatStringByMuleValue, getRequestConfigurations } from "../../commons/Utils"
import addDefaultSrc from './DefaultAvartar'

const MyOption = props => {
  const { innerProps, innerRef, data } = props
  
  return (
    <div ref={innerRef} {...innerProps} className='cursor-pointer'>
      <div className="d-inline-flex align-items-center">
        <div className="w-20" style={{ marginRight: 5 }}>
          <img className="avatar" src={`data:image/png;base64,${data?.avatar}`} onError={addDefaultSrc} alt="avatar" />
        </div>
        <div className="text-wrap">
          <div className="title" style={{ margin: 0 }}>{data?.fullName}</div>
          <div className="comment" style={{ fontSize: 12, margin: "2px 0 0 0", flex: 1 }}><i>({data?.ad}) {data?.jobTitle}</i></div>
        </div>
      </div>
    </div>
  )
}

class SearchSingleUser extends React.Component {
  constructor(props) {
    super();
    this.state = {
      user: null,
      users: [],
      userTyping: "",
      isSearching: false,
    }
    this.onInputChange = debounce(this.getUserInfo, Constants.TIME_DEBOUNCE_FOR_SEARCH);
  }

  componentDidUpdate = (prevProps, prevState) => {
    const userProp = this.props?.user
    if (prevProps?.user !== userProp) {
      this.setState({ users: userProp ? [userProp] : [], user: userProp })
    }
  }

  handleSelectChange = (name, value) => {
    this.props.handleSelectEmployee(value)
  }

  getUserInfo = (value) => {
    if (value !== "") {
      this.setState({ isSearching: true })
      this.searchUser(value).then(res => {
        if (res?.data) {
          const users = (res.data?.data || []).map(res => {
            let departmentStr = [res?.division, res?.department, res?.unit]
            .filter(item => formatStringByMuleValue(item))
            .join(' / ')

            return {
              employeeCode: res?.uid || '',
              ad: res?.username || '',
              fullName: res?.fullname || '',
              phoneNumber: '',
              pnlEmail: res?.company_email || '',
              jobTitle: res?.position_name || (res?.postition_name || ''),
              department: departmentStr || '',
              shortenedOrgLevel2Name: '',
              shortenedOrgLevel3Name: '',
              shortenedOrgLevel4Name: '',
              value: res?.uid,
              label: res?.fullname,
            }
          })
          this.setState({ users: users })
        }
      })
      .finally(() => {
        this.setState({ isSearching: false })
      })
    } else {
      this.setState({ isSearching: false })
    }
  }

  searchUser = (keyword) => {
    const config = getRequestConfigurations()
    const payload = {
      account: keyword || '',
      status: Constants.statusUserActiveMulesoft
    }
    return axios.post(`${process.env.REACT_APP_REQUEST_URL}user/employee/search`, payload, config)
  }

  onInputChange = value => {
    this.setState({ userTyping: value }, () => {
      this.onInputChange(value)
    })
  }

  filterOption = (option, inputValue) => {
    const { users } = this.state
    const options = (users || []).filter(opt => (opt.label?.includes(inputValue) || opt.value?.includes(inputValue) || opt.uid?.includes(inputValue)))
    return options
  }

  render() {
    const customStyles = {
      option: (styles, state) => ({
        ...styles,
        cursor: 'pointer',
        fontSize: 13,
      }),
      menu: base => ({
        ...base,
        fontSize: 13,
        width: 280
      }),
      valueContainer: (provided, state) => ({
        ...provided,
        height: 35,
        padding: '0 10px'
      }),
      control: (styles) => ({
        ...styles,
        cursor: 'pointer',
        height: 35,
        minHeight: 35
      }),
      indicatorsContainer: (provided, state) => ({
        ...provided,
        height: 35,
      }),
      clearIndicator: (provided, state) => ({
        ...provided,
        padding: "8px 0",
      }),
      dropdownIndicator: (provided, state) => ({
          ...provided,
          padding: "8px 3px",
      }),
    }
    const { t, isDisable, isShowIndicator } = this.props || {}
    const { user, users, isSearching } = this.state

    return (
      <Select
        isClearable={true}
        isDisabled={isDisable}
        styles={customStyles}
        components={{ Option: e => MyOption({...e}), IndicatorSeparator: () => isShowIndicator ? true : null}}
        onInputChange={this.onInputChange.bind(this)}
        onChange={userItem => this.handleSelectChange('user', userItem)}
        value={user}
        placeholder={t('Search') + '...'}
        filterOption={this.filterOption}
        options={users || []}
        isLoading={isSearching}
        menuPortalTarget={document.body}
      />
    )
  }
}

export default withTranslation()(SearchSingleUser)
