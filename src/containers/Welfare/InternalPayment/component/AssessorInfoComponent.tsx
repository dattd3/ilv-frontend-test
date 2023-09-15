import React from "react";
import IconRemove from "assets/img/ic-remove.svg";
import IconAdd from "assets/img/ic-add-green.svg";
import { Image, Spinner } from "react-bootstrap";
import HumanForReviewSalaryComponent from "containers/Registration/HumanForReviewSalaryComponent";
interface AssessorInfoComponentProps {
  t: any;
  isCreateMode: boolean;
  setSupervisors: Function;
  supervisors: any;
  approver: any;
  setApprover: Function;
}

const AssessorInfoComponent: React.FC<AssessorInfoComponentProps> = ({
  t,
  isCreateMode,
  supervisors,
  setSupervisors,
  approver,
  setApprover,
}) => {
  const removeSupervisorItem = (index) => {
    const newData = [...supervisors];
    newData.splice(index, 1);
    setSupervisors(newData);
  };

  const handleUpdateSupervisors = (approver, index) => {
    let userExist = [...supervisors].findIndex(
      (item) => approver?.uid && item?.uid == approver?.uid
    );
    // if (userExist != -1) {
    //   return showStatusModal(t("AppraiserExisted"), false);
    // }
    const newData = [...supervisors];
    newData[index] = approver;
    setSupervisors(newData);
  };
  return (
    <div className="timesheet-section proposal-management status-contain" style={{marginBottom: '10px'}}>
      <h5>
        {t("Consenter")}
        <span className="font-weight-normal ml-1 text-lowercase">
          ({t("if_any")})
        </span>
      </h5>
      <div className="timesheet-box1 timesheet-box shadow">
        {supervisors.map((item, key) => (
          <div
            key={`supervisors-${key}`}
            className="appraiser d-flex flex-column position-relative"
            style={key > 0 ? { marginTop: "20px" } : {}}
          >
            {isCreateMode && (
              <button
                className="btn btn-outline-danger position-absolute d-flex align-items-center btn-sm"
                style={{ gap: "4px", top: 0, right: 0 }}
                onClick={() => removeSupervisorItem(key)}
              >
                <Image src={IconRemove} />
                {t("delete")}
              </button>
            )}
            <HumanForReviewSalaryComponent
              isEdit={!isCreateMode}
              isAppraiser={true}
              approver={item}
              updateApprover={(sup) => handleUpdateSupervisors(sup, key)}
              comment={item?.appraiserComment}
            />
          </div>
        ))}
        {isCreateMode && (
          <button
            className="btn btn-outline-success btn-lg w-fit-content mt-3 d-flex align-items-center"
            style={{ gap: "4px", fontSize: "14px" }}
            onClick={() => setSupervisors([...supervisors, null])}
          >
            <Image src={IconAdd} />
            {t("Add")}
          </button>
        )}
      </div>
      <h5>{t("BossApproved")}</h5>
      <div className="timesheet-box1 timesheet-box shadow">
        <HumanForReviewSalaryComponent
          isEdit={!isCreateMode}
          approver={approver}
          updateApprover={setApprover}
          comment={approver?.appraiserComment}
          isAppraiserNote={false}
        />
      </div>
    </div>
  );
};

export default AssessorInfoComponent;
