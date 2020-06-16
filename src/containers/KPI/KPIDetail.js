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
          
          <KPIDetailGroupItem title="THÔNG TIN KỲ ĐÁNH GIÁ QUÝ 1 NĂM 2020" backgroundColor="#347EF9" />

          <KPIDetailGroupItem title="THÔNG TIN KỲ ĐÁNH GIÁ QUÝ 2 NĂM 2020" backgroundColor="#05BD29"/>

          <KPIDetailGroupItem title="THÔNG TIN KỲ ĐÁNH GIÁ QUÝ 3 NĂM 2020" backgroundColor="#FF7F00"/>

          <KPIDetailGroupItem title="THÔNG TIN KỲ ĐÁNH GIÁ QUÝ 4 NĂM 2020" backgroundColor="#00999E"/>
         
          {/*
         <KPIDetailComponent kpiInfo={this.state.kpiInfo} Period={this.state.Period}/>
         <br/>             
         */}
            
       </div>
    )
  }
}

export default KPIDetail;
