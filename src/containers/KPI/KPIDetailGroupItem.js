import React from 'react';
import KPIDetailComponent from './KPIDetailComponent';

class KPIDetailGroupItem extends React.Component {

  constructor(props) {    
    super(props);      
  }

  render() {    
    return (
      <div>
        <div className="group-item">          
            <span className="color-group-item" style={{'backgroundColor': this.props.Color}}/>              
            <span className="title-group-item">              
              THÔNG TIN KỲ ĐÁNH GIÁ QUÝ {this.props.Quarter} NĂM {this.props.Period}
            </span>
            <span className="icon-dropdown">
               <i className="fas fa-caret-down"></i>
            </span>               
        </div>                        
        <KPIDetailComponent kpiInfo={this.props.kpiInfo} Period={this.props.Period} 
             Quarter={this.props.Quarter} Color={this.props.Color}/>        
      </div>
    )
  }
}

export default KPIDetailGroupItem;
