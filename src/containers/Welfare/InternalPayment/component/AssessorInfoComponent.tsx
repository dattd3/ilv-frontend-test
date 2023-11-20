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
  errors: any
  notifyMessage?: Function;
}

const AssessorInfoComponent: React.FC<AssessorInfoComponentProps> = ({
  t,
  isCreateMode,
  supervisors,
  setSupervisors,
  approver,
  setApprover,
  errors = {},
  notifyMessage
}) => {
  const removeSupervisorItem = (index) => {
    const newData = [...supervisors];
    newData.splice(index, 1);
    setSupervisors(newData);
  };

  const handleUpdateSupervisors = (_approver, index) => {
    let userExist = [...supervisors].findIndex(
      (item) => _approver?.uid && item?.uid == _approver?.uid
    );
    
    if (notifyMessage && userExist != -1) {
      notifyMessage(t("AppraiserExisted"));
      return;
    }
    const newData = [...supervisors];
    newData[index] = _approver;
    setSupervisors(newData);
  };
  return (
    <div className="timesheet-section proposal-management status-contain" style={{marginBottom: '10px'}}>
      <h5>
        {t("Appraiser")}
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
              isEmployee={true}
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
      {errors['supervisors'] ? (
        <p className="text-danger mt-1">{errors['supervisors']}</p>
      ) : null}
      <h5>{t("Approver")}</h5>
      <div className="timesheet-box1 timesheet-box shadow">
        <HumanForReviewSalaryComponent
          isEdit={!isCreateMode}
          approver={approver}
          isEmployee={true}
          updateApprover={setApprover}
          comment={approver?.appraiserComment}
          isAppraiserNote={false}
        />
        
      </div>
      {
        errors['approver'] ? (
          <p className="text-danger mt-1">{errors['approver']}</p>
        ) : null
      }
    </div>
  );
};

export default AssessorInfoComponent;
