import React from 'react'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import Rating from 'react-rating'
import Constants from '../.../../../../commons/Constants'
import { checkIsExactPnL, checkVersionPnLSameAsVinhome, IS_VINFAST } from '../../../commons/commonFunctions'
import 'react-datepicker/dist/react-datepicker.css'
import { withTranslation } from "react-i18next";
import './styles.scss';
import { formatProcessTime } from 'commons/Utils'
import IconInfo from '../../../assets/img/icon-info.svg';
import { Image } from 'react-bootstrap'

const ContractEvaluationdetail = (props) => {
  const { data, id, type, idSalary, t } = props
  const dataSalary = props.dataSalary;

  const handleViewDetailSalary = () => {
    let typeRequest = ''
    switch (dataSalary.processStatusId) {
      case 5:
        typeRequest = 'approval'
        break;
      case 8:
      case 24:
        typeRequest = 'access'
        break;
      default:
        typeRequest = 'request'
        break;
    }
    props.history.push(`/salarypropse/${id}/${idSalary}/${typeRequest}`)
  }

  return (
    <div className="font-size-14 contract-evaluation-result-detail-page">
      <div className="evalution">
        <div id="frame-for-export" className="frame-for-export">
          <div className="eval-heading">{t('evaluation_title')} </div>
          <h5>{t('personal_informations')}</h5>
          <div className="box cbnv">
            <div className="row">
              <div className="col-4">
                {t("FullName")}
                <div className="detail">{data.employeeInfo.fullName || ""}</div>
              </div>
              <div className="col-4">
                {t("EmployeeNo")}
                <div className="detail">{data.employeeInfo.employeeNo || ""}</div>
              </div>
              <div className="col-4">
                {t("Title")}
                <div className="detail">{data.employeeInfo.positionName || ""}</div>
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                {t('DepartmentManage')}
                <div className="detail">{data.employeeInfo.departmentName || ""}</div>
              </div>
              <div className="col-4">
                {t('working_day')}
                <div className="detail">{data.employeeInfo.startDate ? moment(data.employeeInfo.startDate).format("DD/MM/YYYY") : ''}</div>
              </div>
              <div className="col-4">
                {t('expired_day_contract')}
                <div className="detail">{data.employeeInfo.expireDate ? moment(data.employeeInfo.expireDate).format("DD/MM/YYYY") : ''}</div>
              </div>
              {
              checkIsExactPnL(Constants.pnlVCode.VinAI) &&
                <div className="col-4">
                  {t('Grade')}
                  <div className="detail">{data.employeeInfo.rankName || '' }</div>
                </div>
              }
            </div>
          </div>

          <h5>{t('assessment_informations')}</h5>
          <div className="box cbnv">
            <div className="row description">
              <div className="col-3">
                {t('assessment_scale')}
              </div>
              <div className="col-9">
                <span>(5) {t('excellent')}</span>
                <span>(4) {t('good')}</span>
                <span>(3) {t('medium')}</span>
                <span>(2) {t('normal')}</span>
                <span>(1) {t('bad')}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="divider"></div>
              </div>
            </div>
            <div className="row task">
              <div className="col-12">
                <div className="box">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: '30%' }}>{t('content_rated')}</th>
                        <th style={{ width: '15%' }}>{t('self_assessment')}</th>
                        <th style={{ width: '15%' }}>{t('leader_assessment')}</th>
                        <th style={{ width: '40%' }}>{t('nhan_xet')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        data.evalution && data.evalution.length > 0 ?
                          data.evalution.map((item, index) => {
                            if (item.isDeleted)
                              return null;
                            return <tr key={index}>
                              <td style={{ width: '30%' }}>{item.TaskName}</td>
                              <td className="text-center" style={{ width: '15%' }}><Rating initialRating={item.SelfAssessmentScore || 0} start={0} stop={5} step={1} emptySymbol={<span className="rating-empty" />} fullSymbol={<span className="rating-full" />} readonly={true} /></td>
                              <td className="text-center" style={{ width: '15%' }}><Rating initialRating={item.ManagementScore || 0} start={0} stop={5} step={1} emptySymbol={<span className="rating-empty" />} fullSymbol={<span className="rating-full" />} readonly={true} /></td>
                              <td style={{ width: '40%' }}>
                                <span>{item.ManagementComment}</span>
                              </td>
                            </tr>
                          })
                          :
                          null
                      }
                    </tbody>
                    <thead>
                      <tr>
                        <th style={{ width: '22%' }}>{t('total_score')}</th>
                        <th style={{ width: '16%' }}>{data.SelfAssessmentScoreTotal}</th>
                        <th style={{ width: '22%' }}>{data.ManagementScoreTotal}</th>
                        <th style={{ width: '40%' }}></th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <h5>{t('more_information')}</h5>
          <div className="box cbnv more-description">
            <div className="title">
            {t('self_assessment')}
            </div>
            <div className="row">
              <div className="col-6">
              {t('strength')}
                <div className="detail">{data && data.selfEvalution ? data.selfEvalution.strong || "" : ""}</div>
              </div>
              <div className="col-6">
              {t('weakness')}
                <div className="detail">{data && data.selfEvalution ? data.selfEvalution.weak || "" : ""}</div>
              </div>
              <div className="col-12">
              {t('suggest_of_staff')}
                <div className="detail">{data && data.selfEvalution ? data.selfEvalution.opinion || "" : ""}</div>
              </div>
            </div>
          </div>
          <div className="box cbnv more-description">
            <div className="title">
            {t('leader_assessment')}
            </div>
            <div className="row">
              <div className="col-6">
              {t('strength')}
                <div className="detail">{data && data.bossEvalution ? data.bossEvalution.strong || "" : ""}</div>
              </div>
              <div className="col-6">
              {t('weakness')}
                <div className="detail">{data && data.bossEvalution ? data.bossEvalution.weak || "" : ""}</div>
              </div>
            </div>
          </div>
          {
            //checkVersionPnLSameAsVinhome(Constants.MODULE.DANHGIA_TAIKI) ?
            false ?
              null :
              <>
                <h5>{t('course_information')}</h5>
                <div className="box cbnv">
                  <div className="row task">
                    <div className="col-12">
                      <div className="box">
                        <table>
                          <thead>
                            <tr>
                              <th className="text-center" style={{ width: '8%' }}>{t('stt')}</th>
                              <th style={{ width: '37%' }}>{t('course_name')}</th>
                              <th style={{ width: '15%' }}>{t('EvaluationStatus')}</th>
                              <th style={{ width: '40%' }}>{t('Note')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              data && data.course && data.course.length > 0 ?
                                data.course.map((item, index) => {
                                  return <tr key={index}>
                                    <td className="text-center" style={{ width: '8%' }}>{index + 1}</td>
                                    <td style={{ width: '37%' }}>{item.name}</td>
                                    <td className="text-center" style={{ width: '15%' }}>{item.status ? t('accomplished') : t('unfinished')}</td>
                                    {
                                      index == 0 ?
                                        <td className="text-center" style={{ width: '40%' }} rowSpan={data.course.length}>
                                          {t('my_rating_note')}
                                        </td> :
                                        null
                                    }
                                  </tr>
                                }) : null
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <h5>{t('profile_information')}</h5>
                <div className="box cbnv document">
                  <div className="row">
                    <div className="col-12">
                      <label>{t('application_status')}:</label> <span>{data.documentStatus}</span>
                    </div>
                  </div>
                </div>
              </>
          }


          {/* <h5>QUYẾT ĐỊNH XỬ LÝ VI PHẠM</h5>
          {
            data && data.violation && data.violation.length > 0 ?
              data.violation.map((item, index) => {
                return <div className="box cbnv" key={index}>
                  <div className="row">
                    <div className="col-4">
                      Số quyết định
                      <div className="detail">{item.quyetdinh}</div>
                    </div>
                    <div className="col-2">
                      Ngày hiệu lực
                      <div className="detail">{item.hieuluc ? moment(item.hieuluc).format("DD/MM/YYYY") : ''}</div>
                    </div>
                    <div className="col-6">
                      Nhóm lỗi
                      <div className="detail">{item.nhomloi}</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      Lý do kỷ luật
                      <div className="detail">{item.lydo}</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      Nội dung kỷ luật
                      <div className="detail">{item.noidung}</div>
                    </div>
                  </div>
                </div>
              }) : null
          } */}

          {/* quan li */}
          <div className="box cbnv more-description">
            <div className="title">{t('recommend_of_manager')}</div>
            <div className="row">
              <div className="col-3">
              {t('result')}
                <div className="detail">{data && data.qlttOpinion ? data.qlttOpinion.result?.label : ""}</div>
              </div>
              <div className="col-3">
              {t('contract_type')} <Image src={IconInfo} alt="Info" style={{width: '15px', height: '15px'}} onClick={() => props.hideShowNoteModal(true)} />
                <div className="detail">{data && data.qlttOpinion ? data.qlttOpinion.contract?.label : ""}</div>
              </div>
              <div className="col-3">
              {t('contract_start_date')}
                <div className="detail">{data && data.qlttOpinion ? data.qlttOpinion.startDate : ""}</div>
              </div>
              <div className="col-3">
              {t('contract_end_date')}
                <div className="detail">{data && data.qlttOpinion ? data.qlttOpinion.endDate : ""}</div>
              </div>
            </div>
            <div className="row">
              {/* <div className="col-4">
                Điều chỉnh lương
                <div className="detail">{requestInfo ? moment(requestInfo.startDate).format("DD/MM/YYYY") + (requestInfo.startTime ? ' ' + moment(requestInfo.startTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '') : ""}</div>
              </div> */}
              <div className="col-12">
              {t('other_suggestions')}
                <div className="detail">{data && data.qlttOpinion ? data.qlttOpinion.otherOption : ""}</div>
              </div>
            </div>
          </div>

          <div className="box cbnv">
            <div className="row approve">
              <div className="col-12">
                {
                  checkVersionPnLSameAsVinhome(Constants.MODULE.DANHGIA_TAIKI) ?
                    <><span className="title">{t('manager_review')}</span></>
                    : <><span className="title">{t('reviewer')}</span><span className="sub-title">({t('if_any')})</span></>
                }
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="divider"></div>
                <div className="row">
                  <div className="col-4"><div className="detail">{data.nguoidanhgia ? data.nguoidanhgia.fullname || "" : ""}</div></div>
                  <div className="col-4"><div className="detail">{data.nguoidanhgia ? data.nguoidanhgia.current_position || "" : ""}</div></div>
                  <div className="col-4"><div className="detail">{data.nguoidanhgia ? data.nguoidanhgia.department || "" : ""}</div></div>
                </div>
              </div>
            </div>
          </div>
          <div className="box cbnv">
            <div className="row approve">
              <div className="col-12">
                {
                  checkVersionPnLSameAsVinhome(Constants.MODULE.DANHGIA_TAIKI) ?
                    <><span className="title">{t('manager_assessment')}</span><span className="sub-title">({t('if_any')})</span></>
                    : <span className="title">{t('manager_review')}</span>
                }
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="divider"></div>
                <div className="row">
                  <div className="col-4"><div className="detail">{data.qltt ? data.qltt.fullname || "" : ""}</div></div>
                  <div className="col-4"><div className="detail">{data.qltt ? data.qltt.current_position || "" : ""}</div></div>
                  <div className="col-4"><div className="detail">{data.qltt ? data.qltt.department || "" : ""}</div></div>
                </div>
              </div>
            </div>
          </div>

          {
              IS_VINFAST() && <div className="box cbnv">
                <div className="row approve">
                  <div className="col-12">
                    <span className="title">{t('hr_review')}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="divider"></div>
                    <div className="row">
                      <div className="col-4"><div className="detail">{data.hrAppraiser ? data.hrAppraiser.fullname || "" : ""}</div></div>
                      <div className="col-4"><div className="detail">{data.hrAppraiser ? data.hrAppraiser.current_position || "" : ""}</div></div>
                      <div className="col-4"><div className="detail">{data.hrAppraiser ? data.hrAppraiser.department || "" : ""}</div></div>
                    </div>
                  </div>
                </div>
              </div>
            }

          {
            // showComponent.HrOption ?
            // <>
            //   <div className="box shadow cbnv more-description">
            //     <div className="title">
            //       Ý KIẾN THẨM ĐỊNH CỦA BỘ PHẬN NHÂN SỰ
            //     </div>
            //     <div className="row">
            //       <div className="col-4">
            //         Kết quả
            //         <div className="detail">{requestInfo ? moment(requestInfo.startDate).format("DD/MM/YYYY") + (requestInfo.startTime ? ' ' + moment(requestInfo.startTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '') : ""}</div>
            //       </div>
            //       <div className="col-8">
            //         Lý do
            //         <div className="detail">{requestInfo ? moment(requestInfo.endDate).format("DD/MM/YYYY") + (requestInfo.endTime ? ' ' + moment(requestInfo.endTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '') : ""}</div>
            //       </div>
            //     </div>
            //   </div>

            //   <div className="box shadow cbnv">
            //     <div className="row approve">
            //       <div className="col-12">
            //       <span className="title">NGƯỜI THẨM ĐỊNH</span>
            //       </div>
            //     </div>
            //     <div className="row">
            //       <div className="col-12">
            //       <div  style={{height: '2px', backgroundColor: '#F2F2F2', margin: '15px 0'}}></div>
            //       </div>
            //     </div>
            //     <ApproverComponent isEdit={!disableComponent.qlttSide} approver={data.thamdinh}  updateApprover={(approver, isApprover) => this.updateApprover('thamdinh', approver,isApprover )} />
            //   </div>
            // </>
            // : null
          }

          <div className="box cbnv">
            <div className="row approve">
              <div className="col-12">
                <span className="title">{t('approver_assessment')}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="divider"></div>
              </div>
              <div className="col-12">
                <div className="row">
                  <div className="col-4"><div className="detail">{data.nguoipheduyet ? data.nguoipheduyet.fullname || "" : ""}</div></div>
                  <div className="col-4"><div className="detail">{data.nguoipheduyet ? data.nguoipheduyet.current_position || "" : ""}</div></div>
                  <div className="col-4"><div className="detail">{data.nguoipheduyet ? data.nguoipheduyet.department || "" : ""}</div></div>
                </div>
              </div>
              {
                data.nguoipheduyet && data.nguoipheduyet.comment ?
                  <div className="col-12">
                    {t('reason_not_approve')}
                    <div className="detail">{data.nguoipheduyet.comment}</div>
                  </div>
                  : null
              }
              {/* {
                data.nguoipheduyet && data.approvalDate ?
                  <div className="col-12">
                    {t('approval_date')}
                    <div className="detail">{moment(data.approvalDate).format('DD/MM/YYYY')}</div>
                  </div>
                  : null
              } */}
            </div>
          </div>

          {type === 'salary' && idSalary &&
            <>
              <h5>{t('salary_proposed_info')}</h5>
              <div className="box cbnv salary">
                <div className="row">
                  <div className="col-6">
                    <div className='wrapper-status'>
                      <span className='font-normal'>{t('EvaluationStatus')}: </span>
                      {dataSalary?.statusName &&
                        <div>{dataSalary?.statusName}</div>
                      }
                    </div>
                  </div>
                  <div className="col-6 view-detail">
                    <span onClick={() => handleViewDetailSalary()}>{t('Details') + ' >>'}</span>
                  </div>
                </div>
              </div>
            </>
          }

          <div className="box cbnv">
            <div className="row approve">
              <div className="col-12">
                <span className="title">{t('RequestHistory').toUpperCase()}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="divider"></div>
              </div>
              <div className="col-12">
                <div className="row">
                  {
                    formatProcessTime(data.createdDate) && <div className="col-4">
                    {t("TimeToSendRequest")}
                    <div className="detail">
                      {formatProcessTime(data.createdDate)}
                    </div>
                  </div>
                  }
                  {
                    formatProcessTime(data.assessedDate) && <div className="col-4">
                      {t("SupervisorAssetDate")}
                      <div className="detail">
                        {formatProcessTime(data.assessedDate)}
                      </div>
                    </div>
                  }
                  {
                    formatProcessTime(data.supervisorDate) && <div className="col-4">
                      {t("ConsentDate")}
                      <div className="detail">
                        {formatProcessTime(data.supervisorDate)}
                      </div>
                    </div>
                  }
                  {
                    formatProcessTime(data.hrAppraiserDate) && <div className="col-4">
                      {t("HRAssetDate")}
                      <div className="detail">
                        {formatProcessTime(data.hrAppraiserDate)}
                      </div>
                    </div>
                  }
                  {
                    formatProcessTime(data.approvalDate) && <div className="col-4">
                      {t("ApprovalDate")}
                      <div className="detail">
                        {formatProcessTime(data.approvalDate)}
                      </div>
                    </div>
                  }
                  
                </div>
              </div>
            </div>
          </div>

          <ul className="list-inline">
            {data.cvs.map((file, index) => {
              return <li className="list-inline-item" key={index}>
                <span className="file-name">
                  <a title={file.name} href={file.link} download={file.name} target="_blank">{file.name}</a>
                </span>
              </li>
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(withRouter(ContractEvaluationdetail));