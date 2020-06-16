import React from 'react';
import axios from 'axios';
import KPIDetailComponent from './KPIDetailComponent';
import KPIDetailGroupItem from './KPIDetailGroupItem';

class KPIDetail extends React.Component {

  constructor(props) {    
    super(props);
    this.state = {
      kpiInfo: {},
      Period: props.match.params.id
    };   
  }

  componentDidMount() {  
    let config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    }    
    const url = process.env.REACT_APP_MULE_LOCAL + 'kpi/general?Period=' + this.state.Period;        
    axios.get(url, config)
      .then(res => {
        if (res && res.data && res.data.data) {
           if(res.data.data.length > 0) {
              let kpiInfo = res.data.data[0];              
             this.setState({ kpiInfo: kpiInfo });
           }          
        }
      }).catch(error => console.log("Call API error:", error));
  }

  render() {    
    return (      
       <div className="kpi-detail">
          <div className="title-group mb-4">
              LỰA CHỌN KỲ ĐÁNH GIÁ
          </div>
          
          <KPIDetailGroupItem kpiInfo={this.state.kpiInfo} Period={this.state.Period} Quarter="1" Color="#347EF9" />

          <KPIDetailGroupItem kpiInfo={this.state.kpiInfo} Period={this.state.Period} Quarter="2" Color="#05BD29"/>

          <KPIDetailGroupItem kpiInfo={this.state.kpiInfo} Period={this.state.Period} Quarter="3" Color="#FF7F00"/>

          <KPIDetailGroupItem kpiInfo={this.state.kpiInfo} Period={this.state.Period} Quarter="4" Color="#00999E"/>
                            
       </div>
    )
  }
}

export default KPIDetail;
