import React from 'react'
import Select from 'react-select'
import axios from 'axios'

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

  render() {
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
        height: 48,
        minHeight: 48
      })
    };

    return <>
    <h5 className="searchTitle">tìm kiếm</h5>
    <div className="recruiting-search-box shadow">
      <div className="row">
        <div className="col">
          <div className="title">Vị trí</div>
          <div className="content input-container">
            <input placeholder="Nhập vị trí tìm kiếm" class="form-control form-control-lg" styles={customStyles} onChange={this.setPosition.bind(this)} />
          </div>
        </div>
        <div className="col">
          <div className="title">Địa điểm</div>
          <div className="content input-container">
            <Select placeholder="Tất cả" options={placeOfWorks} styles={customStyles} onChange={this.setPlaceOfWork.bind(this)}/>
          </div>
        </div>
        <div className="col block-button">
          <div className="title">&nbsp;</div>
          <div className="content">
            <button type="button" className="btn btn-lg btn-warning btnSearch" onClick={this.search}>Tìm kiếm</button>
          </div>
        </div>
      </div>
    </div>
    </>
  }
}
export default PositionRecruitingSearch;
