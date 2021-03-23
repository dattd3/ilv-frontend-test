import React from 'react';
import { withTranslation } from "react-i18next";

class StaffInfo extends React.Component {

  constructor(props) {
    super(props);   
  }

  componentDidMount() {  
    
  }

  render() {   
    const {t} = this.props;
    return (
      <div className="kpi-staff-info">            
          <div className="float-left w-100">
              <span className="float-left text-uppercase title-group">
                  {t("EmployeeInfo")}
              </span>              
          </div>
          <br style={{'clear': 'both'}} />
          <div className="card border shadow mb-4 mt-2">
              <table className="table table-borderless" style={{'marginBottom':'4px'}}>
                 <tbody>
                    <tr>                
                        <td style={{'width': '200px'}}><div className="content-title"> {t("FullName")} </div></td>  
                        <td ><div className="content-bg"> 
                              <span className="content-value"> {this.props.UserInfo.fullName} </span>
                            </div>
                        </td>
                    </tr>                    
                    <tr>                
                        <td><div className="content-title"> {t("Title")} </div></td>  
                        <td><div className="content-bg"> 
                               <span className="content-value"> {this.props.UserInfo.jobTitle} </span>
                            </div>
                        </td>
                    </tr>
                    <tr>                
                        <td><div className="content-title"> {t("DepartmentName")} </div></td>  
                        <td>
                          <div className="content-bg"> 
                              <span className="content-value"> {this.props.UserInfo.department} </span>
                            </div>
                        </td>
                    </tr>
                   
                   {/*
                    <tr>                
                        <td><div className="content-title"> Cán bộ quản lý </div></td>  
                        <td>  
                             <div className="content-bg"> 
                              <span className="content-value"> {this.props.ManagerFullName} </span>
                            </div>
                        </td>
                    </tr>  
                  */}

                  </tbody>  
               </table>
           </div>      
      </div>
    )
  }
}

export default withTranslation()(StaffInfo);
