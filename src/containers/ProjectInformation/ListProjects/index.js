import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from 'axios'
import Constants from '../../../commons/Constants'
import { status, myProjectPageKey, ILoveVinGroupSite } from '../Constants'
import { getRequestConfigurations } from '../../../commons/Utils'
import ProjectRowItem from '../Share/ProjectRowItem'
import LoadingModal from '../../../components/Common/LoadingModal'
import CustomPaging from '../../../components/Common/CustomPaging'
import HOCComponent from '../../../components/Common/HOCComponent'
import map from '../../map.config'

function ListProjects(props) {
    const { t } = useTranslation()
    const [projectData, SetProjectData] = useState({projects: [], totalRecord: 0})
    const [paging, SetPaging] = useState({pageIndex: 1, pageSize: 10})
    const [isLoading, SetIsLoading] = useState(false)
    
    useEffect(() => {
        if (props.isSetBackUrl === false) {
            return
        } else {
            localStorage.setItem('backUrl', window.location.href)
        }
    }, [])

    useEffect(() => {
        const processProjectData = response => {
            if (response && response.data) {
                const result = response.data.result
                if (result && result.code == Constants.API_SUCCESS_CODE) {
                    const data = response.data?.data
                    const projectDataToSave = {...projectData}
                    projectDataToSave.projects = data?.details || []
                    projectDataToSave.totalRecord = data?.totalRecord || 0
                    SetProjectData(projectDataToSave)
                }
            }
            SetIsLoading(false)
        }

        const getProjectData = async () => {
            SetIsLoading(true)
            try {
                const config = getRequestConfigurations()
                config.params = {
                    pageIndex: paging.pageIndex,
                    pageSize: paging.pageSize,
                    site: ILoveVinGroupSite
                }
                if (props.from === myProjectPageKey) {
                    delete config.params.site
                }
                const apiUrl = props.from === myProjectPageKey ? 'projects/me' : 'projects/list'
                const response = await axios.get(`${process.env.REACT_APP_RSM_URL}${apiUrl}`, config)
                processProjectData(response)
            } catch (e) {
                console.error(e)
                SetIsLoading(false)
            }
        }

        getProjectData()
    }, [paging])

    const handleStatusClick = (projectId, statusId) => {
        if (props.from === myProjectPageKey) {
            window.location.replace(`/my-projects/project/${projectId}`)
        } else {
            window.location.replace(`/list-projects/project/${projectId}`)
        }
    }

    const onChangePage = (page) => {
        // const pagingTemp = {...paging}
        // pagingTemp.pageIndex = page
        SetPaging({...paging, pageIndex: page})
    }

    const renderListProjects = () => {
        return (
            (projectData.projects || []).map((item, index) => {
                return <React.Fragment key={index}>
                    <ProjectRowItem item={item} index={index + 1} handleStatusClick={handleStatusClick} />
                </React.Fragment>
            })
        )
    }

    return (
        <>
        <LoadingModal show={isLoading} />
        <div className="list-projects-page">
            <h1 className="content-page-header">{props.from === myProjectPageKey ? 'Dự án của tôi' : 'Danh mục dự án'}</h1>
            {
                projectData.projects.length === 0
                ? <h6 className="alert alert-danger" role="alert">{t("NoDataFound")}</h6>
                : <div className="wrap-table-list-projects">
                    <table className='table-list-projects'>
                        <thead>
                            <tr>
                                <th rowSpan={2} className='sticky-column c-no'><div className='no'>#</div></th>
                                <th rowSpan={2} className='sticky-column c-project-name'><div className='project-name'>Tên dự án</div></th>
                                <th rowSpan={2} className='sticky-column c-short-name'><div className='short-name'>Tên rút gọn</div></th>
                                <th rowSpan={2} className='sticky-column c-manager'><div className='manager'>Quản lý dự án</div></th>
                                <th rowSpan={2}><div className='request-summary'>Tóm tắt yêu cầu</div></th>
                                <th colSpan={2}><div className='customer'>Khách hàng</div></th>
                                <th colSpan={2}><div className='time'>Thời gian</div></th>
                                <th rowSpan={2} className='c-complexity'><div className='complexity'>Complexity</div></th>
                                <th rowSpan={2} className='c-criticality'><div className='criticality'>Criticality</div></th>
                                <th rowSpan={2} className='sticky-column c-status'><div className='status'>Trạng thái</div></th>
                            </tr>
                            <tr>
                                <th className='col-pnl'><div className='text-center pnl'>P&L</div></th>
                                <th className='col-block'><div className='block'>Khối</div></th>
                                <th className='col-start-date'><div className='start-date'>Ngày bắt đầu</div></th>
                                <th className='col-end-date'><div className='end-date'>Ngày kết thúc</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            { renderListProjects() }
                        </tbody>
                    </table>
                </div>
            }
            <CustomPaging pageSize={parseInt(paging?.pageSize)} onChangePage={onChangePage} totalRecords={projectData?.totalRecord} />
        </div>
        </>
    )

}

export default HOCComponent(ListProjects)
