import React, { useState, useEffect } from "react"
import Select from 'react-select'
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import Constants from '../../../commons/Constants'
// import { status, myProjectPageKey, ILoveVinGroupSite } from '../Constants'
// import { getRequestConfigurations } from '../../../commons/Utils'
// import ProjectRowItem from '../Share/ProjectRowItem'

import IconLoop from '../../../assets/img/icon/Icon_Loop.svg'

import LoadingModal from '../../../components/Common/LoadingModal'
import CustomPaging from '../../../components/Common/CustomPaging'
import map from '../../map.config'

function MyEvaluation(props) {
    const { t } = useTranslation()
    // const [projectData, SetProjectData] = useState({projects: [], totalRecord: 0})
    const [paging, SetPaging] = useState({pageIndex: 1, pageSize: 10})
    const [isLoading, SetIsLoading] = useState(false)
    
    useEffect(() => {
        // if (props.isSetBackUrl === false) {
        //     return
        // } else {
        //     localStorage.setItem('backUrl', window.location.href)
        // }
    }, [])

    useEffect(() => {
        // const processProjectData = response => {
        //     if (response && response.data) {
        //         const result = response.data.result
        //         if (result && result.code == Constants.API_SUCCESS_CODE) {
        //             const data = response.data?.data
        //             const projectDataToSave = {...projectData}
        //             projectDataToSave.projects = data?.details || []
        //             projectDataToSave.totalRecord = data?.totalRecord || 0
        //             SetProjectData(projectDataToSave)
        //         }
        //     }
        //     SetIsLoading(false)
        // }

        // const getProjectData = async () => {
        //     SetIsLoading(true)
        //     try {
        //         const config = getRequestConfigurations()
        //         config.params = {
        //             pageIndex: paging.pageIndex,
        //             pageSize: paging.pageSize,
        //             site: ILoveVinGroupSite
        //         }
        //         if (props.from === myProjectPageKey) {
        //             delete config.params.site
        //         }
        //         const apiUrl = props.from === myProjectPageKey ? 'projects/me' : 'projects/list'
        //         const response = await axios.get(`${process.env.REACT_APP_RSM_URL}${apiUrl}`, config)
        //         processProjectData(response)
        //     } catch (e) {
        //         console.error(e)
        //         SetIsLoading(false)
        //     }
        // }

        // getProjectData()
    }, [paging])

    const handleStatusClick = (projectId, statusId) => {
        // window.location.replace(`/project/${projectId}`)
    }

    const onChangePage = (page) => {
        // const pagingTemp = {...paging}
        // pagingTemp.pageIndex = page
        // SetPaging({...paging, pageIndex: page})
    }

    const renderListProjects = () => {
        // return (
        //     (projectData.projects || []).map((item, index) => {
        //         return <React.Fragment key={index}>
        //             <ProjectRowItem item={item} index={index + 1} handleStatusClick={handleStatusClick} />
        //         </React.Fragment>
        //     })
        // )
    }

    const handleChangeSelectInput = e => {

    }

    const handleOnSubmit = e => {}

    const projectData = {
        projects: []
    }

    const yearForFilter = [
        {value: 2021, label: '2021'},
        {value: 2022, label: '2022'},
        {value: 2023, label: '2023'}
    ]

    return (
        <>
        <LoadingModal show={isLoading} />
        <div className="my-evaluation-page">
            <h1 className="content-page-header">Đánh giá</h1>
            {
                projectData.projects.length !== 0   
                ? <h6 className="alert alert-danger" role="alert">{t("NoDataFound")}</h6>
                : <div className="card shadow card-evaluation">
                    <form onSubmit={handleOnSubmit}>
                        <div className="filter-block">
                            <p className="label-filter">Lựa chọn năm</p>
                            <div className="form-filter">
                                <div className="year-input">
                                    <Select 
                                        placeholder="Lựa chọn năm" 
                                        isClearable={true} 
                                        value={null} 
                                        options={yearForFilter} 
                                        onChange={handleChangeSelectInput} />
                                </div>
                                <button type="submit" className="btn-filter"><Image src={IconLoop} alt='Loop' />Tìm kiếm</button>
                            </div>
                        </div>
                    </form>
                    <div className="wrap-table-list-evaluation">
                        <table className='table-list-evaluation'>
                            <thead>
                                <tr>
                                    <th className='c-form-name text-center'><div className='form-name'>Tên biểu mẫu</div></th>
                                    <th className='c-created-date text-center'><div className='created-date'>Được tạo ngày</div></th>
                                    <th className='c-status text-center'><div className='status'>Tình trạng</div></th>
                                    <th className='c-step text-center'><div className='step'>Bước hiện tại</div></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='c-form-name'><div className='form-name'>Biểu mẫu đánh giá Vin3S Q4/2021</div></td>
                                    <td className='c-created-date text-center'><div className='created-date'>01/03/2021</div></td>
                                    <td className='c-status text-center'><div className='status'>Đang đánh giá</div></td>
                                    <td className='c-step text-center'><div className='step'>QTTT đánh giá</div></td>
                                </tr>
                                <tr>
                                    <td className='c-form-name'><div className='form-name'>Biểu mẫu đánh giá Vin3S Q3/2021</div></td>
                                    <td className='c-created-date text-center'><div className='created-date'>01/06/2021</div></td>
                                    <td className='c-status text-center'><div className='status'>Đã hoàn thành</div></td>
                                    <td className='c-step text-center'><div className='step'>QTTT đánh giá</div></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            }
            {/* <CustomPaging pageSize={parseInt(paging?.pageSize)} onChangePage={onChangePage} totalRecords={projectData?.totalRecord} /> */}
        </div>
        </>
    )
}

export default MyEvaluation
