import React from "react";
import { Modal } from 'react-bootstrap'
import Select from 'react-select'
import { useTranslation } from "react-i18next"
import CustomPaging from "components/Common/CustomPagingNew";
import IconArrowRightWhite from '../../../assets/img/icon/pms/arrow-right-white.svg'
import IconArrowRightGray from '../../../assets/img/icon/pms/arrow-right-gray.svg'
import IconSearch from '../../../assets/img/icon/ic_search.svg'
import IconAdd from '../../../assets/img/icon/ic_btn_add_green.svg'
import IconRemove from '../../../assets/img/icon/ic_btn_remove_red.svg'

function RegisterTargetFromLibraryModal(props) {
    const { registerTargetModal, onHideRegisterTargetModal } = props
    const { t } = useTranslation()
    
    // const updateParent = (statusModal, keepPopupEvaluationDetail = false) => {
    //     onHide(statusModal, keepPopupEvaluationDetail)
    // }

    const handleStep = (stepNo) => {

    }

    const handleInputChange = (key, e) => {

    }

    const renderEvaluationStep = () => {
        const activeClass = true

        return (
            <>
            <div className="wrap-item">
                <div className="line"><hr /></div>
                <div className={`info active`}>
                    <div className="item" onClick={() => handleStep(1)}>
                        <span className="no"><span>1</span></span>
                        <span className="name">Lựa chọn mục tiêu</span>
                        <img src={activeClass ? IconArrowRightWhite : IconArrowRightGray} alt="Next" className="next" />
                    </div>
                </div>
            </div>
            <div className="wrap-item">
                <div className="line"><hr /></div>
                <div className={`info`}>
                    <div className="item" onClick={() => handleStep(2)}>
                        <span className="no"><span>2</span></span>
                        <span className="name">Hoàn thành thông tin</span>
                        <img src={IconArrowRightGray} alt="Next" className="next" />
                    </div>
                </div>
            </div>
            </>
        )
    }

    const evaluationPeriod = [
        { value: 1, label: 'Quý 1/2022' },
        { value: 2, label: 'Quý 2/2022' },
        { value: 3, label: 'Quý 3/2022' },
        { value: 4, label: 'Quý 4/2022' },
    ]

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '35px',
            height: '35px',
            boxShadow: state.isFocused ? null : null,
        }),
    
        valueContainer: (provided, state) => ({
            ...provided,
            height: '35px',
            padding: '0 5px'
        }),
    
        input: (provided, state) => ({
            ...provided,
            margin: '0px',
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: '35px',
        }),
      };

    return (
        <Modal 
            backdrop="static" 
            keyboard={false}
            className={'register-target-from-library-modal'}
            centered 
            show={registerTargetModal?.isShow || false}
            onHide={onHideRegisterTargetModal}
        >
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <div className="register-target-page">
                    <h1 className="content-page-header">Đăng ký mục tiêu</h1>
                    <div className="step-block">
                        { renderEvaluationStep() }
                    </div>
                    <div className="search-region">
                        <div className="row-form">
                            <label>Chọn kỳ đánh giá<span className="required">(*)</span></label>
                            <Select
                                isClearable={true}
                                onChange={period => handleInputChange('period', period)}
                                value={null}
                                placeholder={t('Select')}
                                options={evaluationPeriod}
                                styles={customStyles}
                            />
                        </div>
                        <div className="row-form">
                            <label>Tìm kiếm mục tiêu</label>
                            <div className="region-input">
                                <div className="block-input-text">
                                    <span><img src={IconSearch} alt="Icon search" /></span>
                                    <input type='text' placeholder="Nhập từ khóa" value='' onChange={e => handleInputChange('keyword', e?.target?.value || '')} />
                                </div>
                                <div className="block-button">
                                    <button type="submit">Tìm kiếm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="region-result">
                        <div className="header-region">
                            <span className="font-weight-bold title">Thư viện mục tiêu</span>
                            <span className="select-all">Chọn tất cả</span>
                        </div>
                        <div className="result-block">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="target-col">Tên mục tiêu</th>
                                        <th className="measure-col">Cách đo lường</th>
                                        <th className="action-col text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="target-col">Tham gia các chương trình đào tạo do Tập đoàn, Công ty, Cơ sở tổ chức</td>
                                        <td className="measure-col">
                                            <div>
                                                <ul>
                                                    <li>{`5 điểm: Đạt 100%`}</li>
                                                    <li>{`4 điểm: Đạt 90% - dưới 100%`}</li>
                                                    <li>{`3 điểm: Đạt 80% < 90%`}</li>
                                                    <li>{`2 điểm: Đạt 70% < 80%`}</li>
                                                    <li>{`1 điểm: Đạt 60% < 70%`}</li>
                                                </ul>
                                            </div>
                                        </td>
                                        <td className="action-col text-center">
                                            <span className="btn-action"><img src={IconAdd} alt='Add' /></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="target-col">Tham gia các chương trình đào tạo do Tập đoàn, Công ty, Cơ sở tổ chức</td>
                                        <td className="measure-col">
                                            <div>
                                                <ul>
                                                    <li>{`5 điểm: Đạt 100%`}</li>
                                                    <li>{`4 điểm: Đạt 90% - dưới 100%`}</li>
                                                    <li>{`3 điểm: Đạt 80% < 90%`}</li>
                                                    <li>{`2 điểm: Đạt 70% < 80%`}</li>
                                                    <li>{`1 điểm: Đạt 60% < 70%`}</li>
                                                </ul>
                                            </div>
                                        </td>
                                        <td className="action-col text-center">
                                            <span className="btn-action"><img src={IconRemove} alt='Remove' /></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="target-col">Tham gia các chương trình đào tạo do Tập đoàn, Công ty, Cơ sở tổ chức</td>
                                        <td className="measure-col">
                                            <div>
                                                <ul>
                                                    <li>{`5 điểm: Đạt 100%`}</li>
                                                    <li>{`4 điểm: Đạt 90% - dưới 100%`}</li>
                                                    <li>{`3 điểm: Đạt 80% < 90%`}</li>
                                                    <li>{`2 điểm: Đạt 70% < 80%`}</li>
                                                    <li>{`1 điểm: Đạt 60% < 70%`}</li>
                                                </ul>
                                            </div>
                                        </td>
                                        <td className="action-col text-center">
                                            <span className="btn-action"><img src={IconAdd} alt='Add' /></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="target-col">Tham gia các chương trình đào tạo do Tập đoàn, Công ty, Cơ sở tổ chức</td>
                                        <td className="measure-col">
                                            <div>
                                                <ul>
                                                    <li>{`5 điểm: Đạt 100%`}</li>
                                                    <li>{`4 điểm: Đạt 90% - dưới 100%`}</li>
                                                    <li>{`3 điểm: Đạt 80% < 90%`}</li>
                                                    <li>{`2 điểm: Đạt 70% < 80%`}</li>
                                                    <li>{`1 điểm: Đạt 60% < 70%`}</li>
                                                </ul>
                                            </div>
                                        </td>
                                        <td className="action-col text-center">
                                            <span className="btn-action"><img src={IconAdd} alt='Add' /></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="target-col">Tham gia các chương trình đào tạo do Tập đoàn, Công ty, Cơ sở tổ chức</td>
                                        <td className="measure-col">
                                            <div>
                                                <ul>
                                                    <li>{`5 điểm: Đạt 100%`}</li>
                                                    <li>{`4 điểm: Đạt 90% - dưới 100%`}</li>
                                                    <li>{`3 điểm: Đạt 80% < 90%`}</li>
                                                    <li>{`2 điểm: Đạt 70% < 80%`}</li>
                                                    <li>{`1 điểm: Đạt 60% < 70%`}</li>
                                                </ul>
                                            </div>
                                        </td>
                                        <td className="action-col text-center">
                                            <span className="btn-action"><img src={IconAdd} alt='Add' /></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="target-col">Tham gia các chương trình đào tạo do Tập đoàn, Công ty, Cơ sở tổ chức</td>
                                        <td className="measure-col">
                                            <div>
                                                <ul>
                                                    <li>{`5 điểm: Đạt 100%`}</li>
                                                    <li>{`4 điểm: Đạt 90% - dưới 100%`}</li>
                                                    <li>{`3 điểm: Đạt 80% < 90%`}</li>
                                                    <li>{`2 điểm: Đạt 70% < 80%`}</li>
                                                    <li>{`1 điểm: Đạt 60% < 70%`}</li>
                                                </ul>
                                            </div>
                                        </td>
                                        <td className="action-col text-center">
                                            <span className="btn-action"><img src={IconAdd} alt='Add' /></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="target-col">Tham gia các chương trình đào tạo do Tập đoàn, Công ty, Cơ sở tổ chức</td>
                                        <td className="measure-col">
                                            <div>
                                                <ul>
                                                    <li>{`5 điểm: Đạt 100%`}</li>
                                                    <li>{`4 điểm: Đạt 90% - dưới 100%`}</li>
                                                    <li>{`3 điểm: Đạt 80% < 90%`}</li>
                                                    <li>{`2 điểm: Đạt 70% < 80%`}</li>
                                                    <li>{`1 điểm: Đạt 60% < 70%`}</li>
                                                </ul>
                                            </div>
                                        </td>
                                        <td className="action-col text-center">
                                            <span className="btn-action"><img src={IconAdd} alt='Add' /></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="target-col">Tham gia các chương trình đào tạo do Tập đoàn, Công ty, Cơ sở tổ chức</td>
                                        <td className="measure-col">
                                            <div>
                                                <ul>
                                                    <li>{`5 điểm: Đạt 100%`}</li>
                                                    <li>{`4 điểm: Đạt 90% - dưới 100%`}</li>
                                                    <li>{`3 điểm: Đạt 80% < 90%`}</li>
                                                    <li>{`2 điểm: Đạt 70% < 80%`}</li>
                                                    <li>{`1 điểm: Đạt 60% < 70%`}</li>
                                                </ul>
                                            </div>
                                        </td>
                                        <td className="action-col text-center">
                                            <span className="btn-action"><img src={IconAdd} alt='Add' /></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="target-col">Tham gia các chương trình đào tạo do Tập đoàn, Công ty, Cơ sở tổ chức</td>
                                        <td className="measure-col">
                                            <div>
                                                <ul>
                                                    <li>{`5 điểm: Đạt 100%`}</li>
                                                    <li>{`4 điểm: Đạt 90% - dưới 100%`}</li>
                                                    <li>{`3 điểm: Đạt 80% < 90%`}</li>
                                                    <li>{`2 điểm: Đạt 70% < 80%`}</li>
                                                    <li>{`1 điểm: Đạt 60% < 70%`}</li>
                                                </ul>
                                            </div>
                                        </td>
                                        <td className="action-col text-center">
                                            <span className="btn-action"><img src={IconAdd} alt='Add' /></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="target-col">Tham gia các chương trình đào tạo do Tập đoàn, Công ty, Cơ sở tổ chức</td>
                                        <td className="measure-col">
                                            <div>
                                                <ul>
                                                    <li>{`5 điểm: Đạt 100%`}</li>
                                                    <li>{`4 điểm: Đạt 90% - dưới 100%`}</li>
                                                    <li>{`3 điểm: Đạt 80% < 90%`}</li>
                                                    <li>{`2 điểm: Đạt 70% < 80%`}</li>
                                                    <li>{`1 điểm: Đạt 60% < 70%`}</li>
                                                </ul>
                                            </div>
                                        </td>
                                        <td className="action-col text-center">
                                            <span className="btn-action"><img src={IconAdd} alt='Add' /></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="paging-region">
                                <div className="show-block">
                                    <label>Hiển thị</label>
                                    <select onChange={e => {
                                        // const size = parseInt(e.target.value);
                                        // setPageSize(size);
                                        // onChangePageSize(size);
                                    }}>
                                        <option>10</option>
                                        <option>20</option>
                                    </select>
                                </div>
                                {/* <CustomPaging
                                    onChangePageSize={setPageSize}
                                    onChangePageIndex={setPageIndex}
                                    totalRecords={totalRecords}
                                    pageSize={pageSize}
                                    pageIndex={pageIndex}
                                /> */}
                                <div className="show-block">
                                
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="action-region">
                        
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default RegisterTargetFromLibraryModal
