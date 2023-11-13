import React, { useState } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import NestedRoute from "./NestedRoute";
import { observer } from "mobx-react-lite";
import Header from '../../components/Common/Header';
import SideBar from '../../components/Common/Sidebar';
import Footer from '../../components/Common/Footer';
import { useGuardStore } from '../../modules';
import ScrollToTop from '../../components/Common/ScrollToTop';
import map from "../map.config";
import Constants from '../../commons/Constants'
import { handleFullScreen } from "actions/index"
import GuideLineTicketSupport from "components/Common/GuideLineTicketSupport";
import TaskDetailModal from 'containers/Task/TaskDetailModal';
import EvaluationDetailModal from "containers/Evaluation/EvaluationDetailModal";
import { evaluationApiVersion, processStep } from "containers/Evaluation/Constants";

function MainLayout(props) {
  const guard = useGuardStore();
  const user = guard.getCurentUser();
  const { history, isFullScreen } = props;
  const [taskDetailModal, setTaskDetailModal] = useState({
    isShow: false,
    taskId: 0,
    subTaskId: 1,
    action: '',
  });
  const [evaluationDetailPopup, SetEvaluationDetailPopup] = useState({
    isShow: false,
    isFromManager: false,
    evaluationFormId: null,
    formCode: null,
    employeeCode: null,
    version: evaluationApiVersion.v1,
    isEvaluation360: false,
})

  const searchParams = new URLSearchParams(props.location.search);
  const isApp = searchParams.get('isApp') || false;
  const currentCompanyCode = localStorage.getItem("companyCode")
  
  if (props.location.pathname.indexOf("training") > 0 && ![Constants.pnlVCode.VinPearl, Constants.pnlVCode.MeliaVinpearl, Constants.pnlVCode.VinHoliday1].includes(currentCompanyCode)) {
    history.push(map.NotFound);
  }

  const isDashBoard = props.location.pathname === '/' || props.location.pathname === map.EmployeePrivileges;

  const handleTaskDetailModal = (isShow = true, taskId, subTaskId = 1, action, evaluationData) => {
    if (evaluationData?.isEvaluation) {
      SetEvaluationDetailPopup({
        isShow: true,
        evaluationFormId: evaluationData?.data?.CheckPhaseFormId,
        formCode: evaluationData?.data?.FormCode,
        isFromManager: evaluationData?.isFromManager,
        employeeCode: evaluationData?.data?.ReviewStreamCode === processStep.level360 ? null : evaluationData?.data?.EmployeeCode,
        version: evaluationData?.data?.VersionAPI,
        isEvaluation360: evaluationData?.data?.ReviewStreamCode === processStep.level360,
      })
      return
    }
    setTaskDetailModal({
      isShow: isShow,
      taskId: taskId,
      subTaskId: subTaskId,
      action: action,
    })
  }

  const onHideTaskDetailModal = () => {
    setTaskDetailModal({
      isShow: false,
      taskId: null,
      subTaskId: 1,
      action: null,
    })
  }

  const onHideEvaluationDetailModal = (statusModalFromChild, keepPopupEvaluationDetail = false) => {
    if (!keepPopupEvaluationDetail) {
        SetEvaluationDetailPopup({
            ...evaluationDetailPopup,
            isShow: false,
        })
    }

    if (statusModalFromChild) {
        SetStatusModal({
            ...statusModal,
            isShow: statusModalFromChild?.isShow,
            isSuccess: statusModalFromChild?.isSuccess,
            content: statusModalFromChild?.content,
            needReload: keepPopupEvaluationDetail ? false : true
        })
    }
  }
 
  return (
    <>
      <TaskDetailModal 
        show={taskDetailModal.isShow} 
        taskId={taskDetailModal.taskId} 
        subId={taskDetailModal.subTaskId} 
        action={taskDetailModal.action}
        lockReload={true}
        onHide={onHideTaskDetailModal} 
      />
      <EvaluationDetailModal 
        isShow={evaluationDetailPopup.isShow} 
        showByManager={evaluationDetailPopup?.isFromManager}
        evaluationFormId={evaluationDetailPopup.evaluationFormId} 
        formCode={evaluationDetailPopup.formCode} 
        employeeCode={evaluationDetailPopup.employeeCode} 
        version={evaluationDetailPopup?.version}
        isEvaluation360={evaluationDetailPopup?.isEvaluation360}
        onHide={onHideEvaluationDetailModal} 
      />
      <SideBar show={!isFullScreen} user={user} />
      <div id="content-wrapper" className={`d-flex flex-column ${props?.isFullScreen ? 'w-100' : ''}`}>
        <div id="content">
          <Header user={user} isApp={isApp} handleTaskDetailModal={handleTaskDetailModal} />
          <div className={`${isDashBoard === true ? "" : "container-fluid"}`} id='main-content'>
            <NestedRoute routes={props.routes} show={!isFullScreen} />
          </div>
          { isDashBoard && (<GuideLineTicketSupport />) }
          <ScrollToTop />
        </div>
        {isDashBoard !== true &&
          <div className="footer-dash-board">
            <Footer />
          </div>
        }
      </div>
    </>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    isFullScreen: state?.globalStatuses?.isFullScreen,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleFullScreen: bindActionCreators(handleFullScreen, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(observer(MainLayout))
// export default observer(MainLayout);
