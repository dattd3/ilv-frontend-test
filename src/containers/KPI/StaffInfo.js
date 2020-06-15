import React from 'react';

class StaffInfo extends React.Component {

  constructor(props) {
    super(props);   
  }

  componentDidMount() {    
  }

  render() {    
    return (
      <div className="kpi-staff-info">            
          <div className="text-uppercase title-group">
              THÔNG TIN NHÂN VIÊN
          </div>
          <div className="card border shadow mb-4 mt-2">
              <table className="table" style={{'marginBottom':'4px'}}>
                 <tbody>
                    <tr>                
                        <td><div className="content-title"> Họ và tên </div></td>  
                        <td><div className="content-bg"> 
                              <span className="content-value"> {this.props.UserInfo.fullName} </span>
                            </div>
                        </td>
                    </tr>                    
                    <tr>                
                        <td><div className="content-title"> Chức danh </div></td>  
                        <td><div className="content-bg"> 
                               <span className="content-value"> {this.props.UserInfo.jobTitle} </span>
                            </div>
                        </td>
                    </tr>
                    <tr>                
                        <td><div className="content-title"> Bộ phận </div></td>  
                        <td>
                          <div className="content-bg"> 
                              <span className="content-value"> {this.props.UserInfo.department} </span>
                            </div>
                        </td>
                    </tr>
                    <tr>                
                        <td><div className="content-title"> Cán bộ quản lý </div></td>  
                        <td>  
                             <div className="content-bg"> 
                              <span className="content-value"> {this.props.ManagerFullName} </span>
                            </div>
                        </td>
                    </tr>               
                  </tbody>  
               </table>
           </div>      
      </div>
    )
  }
}

export default StaffInfo;
