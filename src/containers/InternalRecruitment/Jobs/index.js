import React from 'react';
import axios from 'axios';
import PositionRecruitingSearch from './PositionRecruitingSearch'
import PositionRecruitingTable from './PositionRecruitingTable'
import CustomPaging from '../../../components/Common/CustomPaging'
import TableUtil from '../../../components/Common/table'

class PositionRecruiting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: [],
      search: {
        position: '',
        placeOfWork: 0
      },
      pageNumber: 1
    }
  }

  componentWillMount() {
    const config = {
        headers: {
          'Authorization': `${localStorage.getItem('accessToken')}`
        }
    }

    axios.get(`${process.env.REACT_APP_REQUEST_URL}Vacancy/list`, config)
    .then(res => {
      if (res && res.data && res.data.data) {
        this.setState({jobs: res.data.data})
      }
    }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
    })
  }

  search (position, placeOfWork) {
    this.setState({pageNumber: 1,
      search: {
      position: position,
      placeOfWork: placeOfWork
    }})
  }

  removeUnicode (str) {  
    str= str.toLowerCase();  
    str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");  
    str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");  
    str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");  
    str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");  
    str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");  
    str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");  
    str= str.replace(/đ/g,"d");  
    str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-"); 
  
    str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1- 
    str= str.replace(/^\-+|\-+$/g,"");  
  
    return str;  
  } 

  filterByPosition (jobs) {
    debugger
    return this.state.search.position != '' ? jobs.filter(job => this.removeUnicode(job.jobTitle).includes(this.removeUnicode(this.state.search.position))) : jobs
  }

  filterByPlaceOfWork (jobs) {
    return this.state.search.placeOfWork > 0 ? jobs.filter(job => job.placeOfWorkId == this.state.search.placeOfWork) : jobs
  }

  onChangePage (index) {
    this.setState({ pageNumber: index})
  }

  render() {
    const recordPerPage =  25
    const jobs = this.filterByPlaceOfWork(this.filterByPosition(this.state.jobs))

    return (
      <div className="position-recruiting-section">
        <PositionRecruitingSearch clickSearch={this.search.bind(this)}/>
        <PositionRecruitingTable jobs={TableUtil.updateData(jobs, this.state.pageNumber - 1, recordPerPage)}/>

        {jobs.length > 0 ? <div className="row paging">
            <div className="col-sm"></div>
            <div className="col-sm">
                <CustomPaging pageSize={recordPerPage} onChangePage={this.onChangePage.bind(this)} totalRecords={jobs.length} />
            </div>
            <div className="col-sm text-right">Total: {jobs.length}</div>
          </div>: null }
      </div> 
    )
  }
}

export default PositionRecruiting
