import React from 'react';

class KPIDetailGroupItem extends React.Component {

  constructor(props) {    
    super(props);      
  }

  render() {    
    return (
        <div className="group-item">          
            <span className="color-group-item" style={{'backgroundColor': this.props.backgroundColor}}/>              
            <span className="title-group-item">
              {this.props.title}
            </span>
            <span className="icon-dropdown">
               <i className="fas fa-caret-down"></i>
            </span>               
        </div>                   
    )
  }
}

export default KPIDetailGroupItem;
