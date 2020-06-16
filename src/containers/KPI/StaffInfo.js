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
          <div className="float-left w-100">
              <span className="float-left text-uppercase title-group">
                  THÔNG TIN NHÂN VIÊN
              </span>

              <span className="success-factor-link float-right btn text-center">
                <a href="https://performancemanager10.successfactors.com/sf/pmreviews?bplte_company=vingroupjsP2&_s.crb=cCGlhxZRYUMgGtcEh7rKL3v7dsI%3d" style={{'color':'white'}} target="_blank"> Đường link truy cập SuccessFactor</a>
              </span>
          </div>
          <br style={{'clear': 'both'}} />
          <div className="card border shadow mb-4 mt-2">
              <table className="table table-borderless" style={{'marginBottom':'4px'}}>
                 <tbody>
                    <tr>                
                        <td style={{'width': '200px'}}><div className="content-title"> Họ và tên </div></td>  
                        <td ><div className="content-bg"> 
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
