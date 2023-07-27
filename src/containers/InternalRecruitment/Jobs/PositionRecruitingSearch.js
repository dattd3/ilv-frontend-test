import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import { withTranslation } from "react-i18next"

class PositionRecruitingSearch extends React.Component {
  constructor() {
    super();
    this.state = {
      position: '',
      placeOfWork: '0',
      placeOfWorks: []
    }

    this.setPosition = this.setPosition.bind(this)
    this.setPlaceOfWork = this.setPlaceOfWork.bind(this)
    this.search = this.search.bind(this)
  }

  componentWillMount() {
    const config = {
        headers: {
          'Authorization': `${localStorage.getItem('accessToken')}`
        }
    }

    axios.get(`${process.env.REACT_APP_REQUEST_URL}VacancyPosition/list`, config)
    .then(res => {
      if (res && res.data && res.data.data) {
        this.setState({positions: res.data.data})
      }
    }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
    })

    axios.get(`${process.env.REACT_APP_REQUEST_URL}PlaceOfWork/list`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          this.setState({placeOfWorks: res.data.data})
        }
      }).catch(error => {
          // localStorage.clear();
          // window.location.href = map.Login;
      })
  }

  setPosition (e) {
    this.setState({
      position: e.currentTarget.value
    })
  }

  setPlaceOfWork (placeOfWork) {
    this.setState({
      placeOfWork: placeOfWork.value
    })
  }

  search() {
    this.props.clickSearch(this.state.position, parseInt(this.state.placeOfWork))
  }

  keyPress(e){
    if(e.key == 'Enter'){
       this.search()
    }
 }

  render() {
    const { t } = this.props
    const all = { value: '0', label: 'Tất cả' }

    const placeOfWorks = [all].concat(this.state.placeOfWorks.map(placeOfWork => {
      return {
        value: placeOfWork.id,
        label: placeOfWork.name
      }
    }))

    const customStyles = {
      control: base => ({
        ...base,
        height: 38,
        minHeight: 38
      })
    };

    return <>
    <h1 className="content-page-header">{t("Search")}</h1>
    <div className="recruiting-search-box">
      <div className="row">
        <div className="col">
          <div className="title">{t("Position")}</div>
          <div className="content input-container">
            <input placeholder={t("EnterPositionSearch")} onKeyPress={this.keyPress.bind(this)} className="form-control input-text" onChange={this.setPosition.bind(this)} />
          </div>
        </div>
        <div className="col">
          <div className="title">{t("Location")}</div>
          <div className="content input-container">
            <Select placeholder={t("All")} options={placeOfWorks} styles={customStyles} onChange={this.setPlaceOfWork.bind(this)}/>
          </div>
        </div>
        <div className="col block-button">
          <div className="title">&nbsp;</div>
          <div className="content">
            <button type="button" className="btn btn-warning btn-search" onClick={this.search}>{t("Search")}</button>
          </div>
        </div>
      </div>
    </div>
    </>
  }
}
export default withTranslation()(PositionRecruitingSearch);
