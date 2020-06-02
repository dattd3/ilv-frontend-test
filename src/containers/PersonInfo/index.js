import React from 'react';
import axios from 'axios';
import './PersonInfo.css';
import { withTranslation } from 'react-i18next';

class MyComponent extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
         userProfile: {},
         userDetail: {}
      };
    }

  componentDidMount() {  
      let config = {
          headers: {            
            'client_id': '6ce6aa62b6c74f799ebbfd3397a3647a',
            'client_secret': '6998281221B149E58e78543c08a7d7e5' 
          }
        }
           
      axios.get(process.env.REACT_APP_MULE_HOST + 'user/profile', config)
        .then(res => {                      
          if (res && res.data && res.data.data) {            
              let userProfile = res.data.data[0];
              this.setState({userProfile: userProfile});              
          }                   
        }).catch(error => console.log("Call API error:",error)); 


      axios.get(process.env.REACT_APP_MULE_HOST + 'user/profile/details', config)
        .then(res => {                      
          if (res && res.data && res.data.data) {            
              let userDetail = res.data.data[0];
              this.setState({userDetail: userDetail});
              console.log("userDetail:",userDetail);
          }                   
        }).catch(error => console.log("Call API error:",error));   
  }  
      
  render() {      
    
    const { t } = this.props;

    return (    
      <div className="bgColor">
          <br />
          <div className='headerText'> {t("PersonalInformation")} </div>
          <table>
            <thead>
              <tr>
                <th className="table-header"> {t("FirstAndLastName")} </th>
                <th className="table-header"> Mã nhân viên / Email </th>
                <th className="table-header"> Công ty / Phòng ban </th>
                <th className="table-header"> Chức danh / Cấp bậc </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="table-content">
                  <div className="bgText"> {this.state.userProfile.fullname} </div>
                </td>
                <td >
                  <div className='bgText'> {this.state.userProfile.uid} / {this.state.userProfile.email} </div>
                </td>
                <td>
                  <div className="bgText"> {this.state.userProfile.company} / {this.state.userProfile.department} </div>
                </td>
                <td>
                  <div className="bgText div-end"> {this.state.userProfile.job_name} / {this.state.userProfile.actual_rank} </div>
                </td>
              </tr>
            </tbody>
          </table>

          <br />
          <div className='headerText'> {t("CurrentAddress")} </div>
          <table>
            <thead>
              <tr>
                <th className="table-header"> {t("Nation")} </th>
                <th className="table-header"> {t("Province_City")} </th>
                <th className="table-header"> {t("District")} </th>
                <th className="table-header"> {t("Address")} </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="table-content">
                  <div className="bgText"> {this.state.userDetail.nation} </div>
                </td>
                <td >
                  <div className='bgText'> {this.state.userDetail.province} </div>
                </td>
                <td >
                  <div className='bgText'> {this.state.userDetail.district} </div>
                </td>
                <td>
                  <div className="bgText div-end"> {this.state.userDetail.address_desc } {this.state.userDetail.home_and_street} </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <br />
          <div className='headerText'> {t("CardId_Title")} </div>
          <table>
            <thead>
              <tr>
                <th className="table-header"> {t("CardId")} </th>
                <th className="table-header"> {t("DateIssue")} </th>
                <th className="table-header"> {t("PlaceIssue")} </th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="table-content">
                  <div className="bgText"> {this.state.userDetail.SoCMND} </div>
                </td>
                <td >
                  <div className='bgText'> {this.state.userDetail.NgayCapCMND} </div>
                </td>
                <td>
                  <div className="bgText div-end"> {this.state.userDetail.NoiCapCMND} </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <br />
          <div className='headerText'> {t("AccountInformation")} </div>
          <table>
            <thead>
              <tr>
                <th className="table-header"> {t("TaxCode")} </th>
                <th className="table-header"> {t("SocialInsuranceNumber")} </th>
                <th className="table-header"> {t("VinID")} </th>
                <th className="table-header"> {t("BankAccountNumber")} </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="table-content">
                  <div className="bgText"> {this.state.userDetail.MaSoThue} </div>
                </td>
                <td >
                  <div className='bgText'> {this.state.userDetail.SoBHXH} </div>
                </td>
                <td >
                  <div className='bgText'> {this.state.userDetail.SoTheVinID} </div>
                </td>
                <td >
                  <div className='bgText div-end'> {this.state.userDetail.SoTaiKhoan} </div>
                </td>
              </tr>
            </tbody>

            <thead>
              <tr>
                <th className="table-header"> {t("BankName")} </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="table-content" colSpan="2">
                  <div className="bgText"> {this.state.userDetail.Bank} </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <br />

          {/*
          <div className='headerText'> {t("LegalInformation")} </div>              
              this.state.curriculumVitae.ListFamily.map(function (obj, i) {
                return (
                  <table className="no-border">
                    <thead>
                      <tr>
                        <th className="table-header"> {t("FullName")} </th>
                        <th className="table-header"> {t("DateOfBirth")} </th>
                        <th className="table-header"> {t("Relationship")} </th>
                        <th className="table-header"> {t("FamilyAllowances")} </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="table-content">
                          <div className="bgText"> {obj.HoVaTen} </div>
                        </td>
                        <td >
                          <div className='bgText'> {obj.NgaySinh} </div>
                        </td>
                        <td >
                          <div className='bgText'> {obj.MoiQuanHe} </div>
                        </td>
                        <td>
                          <div className="bgText div-end"> {obj.NgayHieuLucGiamTru} </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                );
              })
            */}

          <br />
      </div>            
    )
  }
}


const PersonInfo = withTranslation()(MyComponent)

export default function App() {
  return (    
      <PersonInfo />    
  );
}

