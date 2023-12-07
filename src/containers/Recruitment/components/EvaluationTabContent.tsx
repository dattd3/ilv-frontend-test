import DatePicker, { registerLocale } from "react-datepicker";
import { useTranslation } from "react-i18next";
import moment from "moment";
import axios from "axios";
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";
registerLocale("vi", vi);

const EvaluationTabContent = ({ tasks, onOpenDetailModel }: any) => {
  const { t }: any = useTranslation();

  return (
    <div className="page-content">
      <div className="d-flex align-items-center justify-content-between header">
        <h1>{t("history_evaluation")}</h1>
      </div>
      <div className="content">
        <div className="request-list shadow">
          <div className="wrap-table-request">
            {tasks.length > 0 ? (
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th scope="col" className="code sticky-col">
                      <div className="code">{t("RequestNo")}</div>
                    </th>
                    <th scope="col" className="status">
                      <div className="groundwork">{t("Status")}</div>
                    </th>
                    <th scope="col" className="status">
                      <div className="groundwork">{t("apply_position")}</div>
                    </th>
                    <th scope="col" className="status">
                      <div className="position">{t("Unit")}</div>
                    </th>
                    <th scope="col" className="status">
                      <div className="position">{t("candidate_name")}</div>
                    </th>
                    <th scope="col" className="status">
                      <div className="position">{t("interview_time")}</div>
                    </th>
                    <th scope="col" className="tool">
                      <div className="position">{t("interview_place")}</div>
                    </th>
                    <th scope="col" className="status">
                      <div className="position">{t("evaluation_deadline")}</div>
                    </th>
                    <th scope="col" className="status">
                      <div className="position">{t("created_by")}</div>
                    </th>
                    <th scope="col" className="status">
                      <div className="position">{t("created_at")}</div>
                    </th>
                    <th scope="col" className="tool">
                      <div className="position">{t("propose_type")}</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((item, index) => {
                    const requestInfo = item.requestInfo
                      ? JSON.parse(item.requestInfo)
                      : {};
                    const userInfo = item.userInfo
                      ? JSON.parse(item.userInfo)
                      : {};
                    const jobVacancy = item.jobVacancy ? item.jobVacancy : {};
                    return (
                      <tr key={index}>
                        <td className="code sticky-col pl-4">
                          <a className="task-title" style={{cursor: 'pointer'}} onClick={() => {onOpenDetailModel(item.id)}}>{item.id}</a>
                        </td>
                        <td className="status">{item.status == 10 ? t('WaitingForEvaluation') : t('Feedbacked')}</td>
                        <td className="status">{requestInfo.jobTitle}</td>
                        <td className="status">{jobVacancy.unitName}</td>
                        <td className="status">{item.candidateName}</td>
                        <td className="status">
                          {moment(item.interviewDate).format(
                            "DD/MM/YYYY HH:mm:ss"
                          )}
                        </td>
                        <td className="tool" title={item.interviewLocation}>
                          {item.interviewLocation}
                        </td>
                        <td className="status">
                          {moment(item.evaluationDeadline).format("DD/MM/YYYY")}
                        </td>
                        <td className="status">{userInfo.fullName}</td>
                        <td className="status">
                          {moment(item.dateCreated).format("DD/MM/YYYY")}
                        </td>
                        <td className="tool">{item.vacancyTypeName}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="shadow-customize data-not-found">
                {t("NoDataFound")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationTabContent;
