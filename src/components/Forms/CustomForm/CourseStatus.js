import React from "react";
import { withTranslation } from "react-i18next"
import './CourseStatus.css';

class CourseStatus extends React.Component {

  generateStatus()
  {
    const status = this.props.status;
    const { t } = this.props;
    
    switch(status) {
      case 'Acquired':
        return <span className="course-status ok">{t("Completed")}</span>;
      case 'Assigned':
      case 'In Progress':
        return <span className="course-status inprogress">{t("ClassInprogress")}</span>
      case 'Discontinued':
      case 'Cancelled':
        return <span className="course-status cancelled">Đã hủy</span>
      case 'Overdue':
        return <span className="course-status overdue">Quá hạn</span>;
      case 0:
      case 100:
        return <span className="course-status cancelled">{t("Incompleted")}</span>;
      case 200:
        return <span className="course-status ok">{t("Completed")}</span>;
      case 300:
        return <span className="course-status overdue">Chưa đạt yêu cầu</span>;
      default:
        return <span className="course-status undefined">Undefined</span>;
      }
  }

  render() {

    return (
        this.generateStatus()
    );
  
  }
}
export default withTranslation(CourseStatus);