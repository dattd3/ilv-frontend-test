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
    <div ref={innerRef} {...innerProps} className="approver">
      <div className="d-block clearfix">
        <div className="float-left mr-2 w-20">
          <img className="avatar" src={`data:image/png;base64,${data?.avatar}`} onError={addDefaultSrc} alt="avatar" />
        </div>
        <div className="float-left text-wrap w-75">
          <div className="title">{data?.fullName}</div>
          <div className="comment"><i>({data?.ad}) {data?.jobTitle}</i></div>
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
      }),
      control: (styles) => ({
        ...styles,
        cursor: 'pointer',
        height: 38,
        minHeight: 38
      })
    }
    const { t, isDisable } = this.props || {}
    const { user, users, isSearching } = this.state

    return (
      <Select
        isClearable={true}
        isDisabled={isDisable}
        styles={customStyles}
        components={{ Option: e => MyOption({...e})}}
        onInputChange={this.onInputChange.bind(this)}
        onChange={userItem => this.handleSelectChange('user', userItem)}
        value={user}
        placeholder={t('Search') + '...'}
        filterOption={this.filterOption}
        options={users || []}
        isLoading={isSearching}
      />
    )
  }
}

export default withTranslation()(SearchSingleUser)
