import React from 'react';
import ReportLeaderComponent from './ReportLeaderComponent';
import ReportStaffComponent from './ReportStaffComponent';

class KPIDetailGroupItem extends React.Component {

  constructor(props) {    
    super(props); 
    this.state = {
      isShowDetail: false   
    };            
  }
     
  showDetailClick() {    
    this.setState({isShowDetail: !this.state.isShowDetail});
  }
  
  render() {      
    return (
      <div>
        <div className="group-item" onClick={e => this.showDetailClick()}>          
            <span className="color-group-item" style={{'backgroundColor': this.props.Color}}/>              
            <span className="title-group-item">              
              THÔNG TIN KỲ ĐÁNH GIÁ QUÝ {this.props.Quarter} NĂM {this.props.Period}
            </span>            
            <span className="icon-dropdown">
               {this.state.isShowDetail && <i className="fas fa-caret-up"></i>}
               {!this.state.isShowDetail && <i className="fas fa-caret-down"></i>}
            </span>         
        </div>      

        {this.state.isShowDetail && 
          (this.props.IsLeader == "true" ?
               <ReportLeaderComponent kpiInfo={this.props.kpiInfo} Period={this.props.Period} Quarter={this.props.Quarter} Color={this.props.Color}/> 
             : <ReportStaffComponent kpiInfo={this.props.kpiInfo} Period={this.props.Period} Quarter={this.props.Quarter} Color={this.props.Color}/> 
          )
        }
        
      </div>
    )
  }
}

export default KPIDetailGroupItem;
