import React from "react";
import './Course.css';
import icon from "../../Logo/IconBooks56x56.png"
import CourseStatus from "./CourseStatus"
import map from '../../../containers/map.config';
import { Link } from 'react-router-dom';
import { withTranslation } from "react-i18next";

class Course extends React.Component {

  render() {
    const {t} = this.props;
    return (
      <div>
        <div className="row align-items-center white-background">
          <div className="col-sm-1 col-md-1 col-lg-1">
            <img src={icon} height={42} width={42} alt="" />
          </div>
          <div className="col-sm-6 col-md-6 col-lg-6 m-0">
            <div className="font-weight-500 text-uppercase text-color-vp">{this.props.name}</div>
            <div>Hạn hoàn thành: {this.props.target_date} </div>
          </div>
          <div className="col-sm-3 col-md-3 col-lg-3 text-center">
            <CourseStatus status={this.props.status} />
          </div>
          <div className="col-sm-2 col-md-2 col-lg-2 text-center">
            <Link to={"/training/roadmap-detail/" + this.props.id} className="red-button">{t("Details")}</Link>
          </div>
        </div>
      </div>
    );

  }
}
export default withTranslation()(Course);