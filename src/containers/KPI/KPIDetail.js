import React from 'react';
import axios from 'axios';
import KPIDetailComponent from './KPIDetailComponent';
import KPIDetailGroupItem from './KPIDetailGroupItem';

class KPIDetail extends React.Component {

  constructor(props) {    
    super(props);
    this.state = {      
      KpiQuarter1: {},
      KpiQuarter2: {},
      KpiQuarter3: {},
      KpiQuarter4: {},
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
              this.saveData(res.data.data);      
              this.setState({ kpiInfo: kpiInfo});
           }          
        }
      }).catch(error => console.log("Call API error:", error));
  }

  saveData(items) {

    items.forEach(item => {          
          const quarter = item.Period.substring(0,2).toUpperCase(); // convert "Q1/2020" => "Q1"
          if(quarter == "Q1") {
            this.setState({ KpiQuarter1: item});            

          } else if(quarter == "Q2") {            
            this.setState({ KpiQuarter2: item});
          
          } else if(quarter == "Q3") {            
            this.setState({ KpiQuarter3: item});        

          } else if(quarter == "Q4") {            
            this.setState({ KpiQuarter4: item});    
          }
       });
  }

  render() {    
    return (      
       <div className="kpi-detail">
          <div className="title-group mb-4">
              LỰA CHỌN KỲ ĐÁNH GIÁ
          </div>
          
          <KPIDetailGroupItem kpiInfo={this.state.KpiQuarter1} Period={this.state.Period} Quarter="1" Color="#347EF9" />

          <KPIDetailGroupItem kpiInfo={this.state.KpiQuarter2} Period={this.state.Period} Quarter="2" Color="#05BD29"/>

          <KPIDetailGroupItem kpiInfo={this.state.KpiQuarter3} Period={this.state.Period} Quarter="3" Color="#FF7F00"/>

          <KPIDetailGroupItem kpiInfo={this.state.KpiQuarter4} Period={this.state.Period} Quarter="4" Color="#00999E"/>
                            
       </div>
    )
  }
}

export default KPIDetail;
