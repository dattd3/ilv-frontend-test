import { useState, useEffect, useRef, Fragment } from "react"
import DatePicker, { registerLocale } from 'react-datepicker'
import { useTranslation } from "react-i18next"
import moment from 'moment'
import axios from 'axios'
import _ from 'lodash'
import Constants from 'commons/Constants'
import LoadingModal from 'components/Common/LoadingModal'
import StatusModal from 'components/Common/StatusModal'
import CustomPaging from 'components/Common/CustomPaging'

import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import EvaluationTabContent from "./components/EvaluationTabContent"
import EvaluationRecruitmentDetailModal from "./components/EvaluationRecruitmentDetailModal"
registerLocale("vi", vi)

const EvaluationTab = ({isOpen}) => {
    const tabMapping = {
        request: 'request',
        appraisal: 'appraisal',
        approval: 'approval',
        evaluation: 'evaluation',
    }
    const { t }: any = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, SetActiveTab] = useState(tabMapping.evaluation);
    const [pageIndex, setPageIndex] = useState(Constants.PAGE_INDEX_DEFAULT);
    const [tasks, setTasks] = useState([]);
    const [total, setTotal] = useState(0);
    const [showDetailModal, setShowDetailModal] = useState<any>({
        visible: false,
        taskId: null
    });

    const requestRemoteData = (_pageIndex = 1, _pageSize = Constants.PAGE_SIZE_DEFAULT) => {
        setIsLoading(true);
        const config = {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            params: {
                companyCode: localStorage.getItem('companyCode'),
                pageIndex: _pageIndex,
                pageSize: _pageSize
            }
        }
        axios.get(`${process.env.REACT_APP_HRDX_URL}api/assessments/evaluating` , config)
        .then(res => {
          if (res && res.data && res.data.data && res.data.result) {
            const result = res.data.result;
            if (result.code !== Constants.API_ERROR_CODE) {
              let tasksOrdered = res.data.data.assessments;
              setTasks(tasksOrdered);
                setTotal(res.data.data.total);
            }
          }
        }).catch(error => {
            setTasks([]);
          setTotal(0);
        }).finally(() => {
          setIsLoading(false);
        });
    }

    const onChangeVisibleTaskDetailModal = (visible = false, taskId = null) => {
        const _newModal = {
            visible: visible,
            taskId: taskId
        };
        setShowDetailModal(_newModal);
    }

    useEffect(() => {
        if (isOpen && tasks?.length == 0) {
            requestRemoteData();
        }
    }, [isOpen])

    const onChangePage = (index: number) => {
        index = index < Constants.TASK_PAGE_INDEX_DEFAULT ? Constants.TASK_PAGE_INDEX_DEFAULT : index;
        index = index * Constants.PAGE_SIZE_DEFAULT > total ? (1 + parseInt((total / Constants.PAGE_SIZE_DEFAULT) + '')) : index;
        setPageIndex(index);
        requestRemoteData(pageIndex);
    }

    return (
        <div className="request-tab-content recruitment-page">
            <LoadingModal show={isLoading} />
            <EvaluationRecruitmentDetailModal
                show={showDetailModal.visible} 
                taskId={showDetailModal.taskId}
                onHide={() => onChangeVisibleTaskDetailModal()} />
            {/* <FilterBlock /> */}
            <EvaluationTabContent tasks = {tasks} onOpenDetailModel = {(id) => onChangeVisibleTaskDetailModal(true, id)}/>
            {(tasks.length > 0 || Math.ceil(total/Constants.TASK_PAGE_SIZE_DEFAULT) == pageIndex) ? <div className="row paging mt-4">
                    <div className="col-sm"></div>
                    <div className="col-sm"></div>
                    <div className="col-sm">
                        <CustomPaging pageSize={Constants.PAGE_SIZE_DEFAULT} onChangePage={onChangePage} totalRecords={total} needRefresh={false} />
                    </div>
                    <div className="col-sm"></div>
                    <div className="col-sm text-right">{t("Total")}: {total}</div>
                </div> : null}
        </div>
    )
}

export default EvaluationTab
