import React from 'react'
import moment from 'moment'
import Rating from 'react-rating'
import _ from 'lodash'
import { Image } from 'react-bootstrap'
import Constants from '../.../../../../commons/Constants'
import { checkIsExactPnL} from '../../../commons/commonFunctions'
import 'react-datepicker/dist/react-datepicker.css'
import { vi, enUS } from 'date-fns/locale'

import './styles.scss'
export default class ContractEvaluationdetail extends React.Component {
  

  render() {
    const data = this.props.data
    return (
        <div className="font-size-14 contract-evaluation-result-detail-page">
        <div className="evalution">
          <div id="frame-for-export" className="frame-for-export">
            <div className="eval-heading">BIÊN BẢN ĐÁNH GIÁ GIAO KẾT / GIA HẠN HĐLĐ</div>
            <h5>THÔNG TIN NGƯỜI ĐƯỢC ĐÁNH GIÁ</h5>
            <div className="box cbnv">
              <div className="row">
                <div className="col-4">
                  Họ và tên
                  <div className="detail">{data.employeeInfo.fullName || ""}</div>
                </div>
                <div className="col-4">
                  Chức danh
                  <div className="detail">{data.employeeInfo.positionName || ""}</div>
                </div>
                <div className="col-4">
                  Khối/Phòng/Bộ phận
                  <div className="detail">{data.employeeInfo.departmentName || ""}</div>
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  Ngày làm việc
                  <div className="detail">{data.employeeInfo.startDate ? moment(data.employeeInfo.startDate).format("DD/MM/YYYY") : ''}</div>
                </div>
                <div className="col-4">
                  Ngày hết hạn HĐTV/HĐLĐ
                  <div className="detail">{data.employeeInfo.expireDate ? moment(data.employeeInfo.expireDate).format("DD/MM/YYYY") : ''}</div>
                </div>
              </div>
            </div>

            <h5>Thông tin đánh giá</h5>
            <div className="box cbnv">
              <div className="row description">
                <div className="col-3 title">
                  Thang điểm đánh giá
                </div>
                <div className="col-9">
                  <span>(4) Vượt yêu cầu</span>
                  <span>(3) Đạt</span>
                  <span>(2) Chưa đạt</span>
                  <span>(1) Không đạt</span>
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
                          <th style={{ width: '30%' }}>Nội dung đánh giá</th>
                          <th style={{ width: '15%' }}>Tự đánh giá</th>
                          <th style={{ width: '15%' }}>CBLĐ TT đánh giá</th>
                          <th style={{ width: '40%' }}>Nhận xét</th>
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
                          <th style={{ width: '22%' }}>Tổng điểm</th>
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

            <h5>THÔNG TIN THÊM</h5>
            <div className="box cbnv more-description">
              <div className="title">
                TỰ ĐÁNH GIÁ
              </div>
              <div className="row">
                <div className="col-6">
                  Điểm mạnh
                  <div className="detail">{data && data.selfEvalution ? data.selfEvalution.strong || "" : ""}</div>
                </div>
                <div className="col-6">
                  Điểm cần cải thiện
                  <div className="detail">{data && data.selfEvalution ? data.selfEvalution.weak || "" : ""}</div>
                </div>
                <div className="col-12">
                  Ý kiến đề xuất của CBNV
                  <div className="detail">{data && data.selfEvalution ? data.selfEvalution.opinion || "" : ""}</div>
                </div>
              </div>
            </div>
            <div className="box cbnv more-description">
              <div className="title">
                CBLĐ TT ĐÁNH GIÁ
              </div>
              <div className="row">
                <div className="col-6">
                  Điểm mạnh
                  <div className="detail">{data && data.bossEvalution ? data.bossEvalution.strong || "" : ""}</div>
                </div>
                <div className="col-6">
                  Điểm cần cải thiện
                  <div className="detail">{data && data.bossEvalution ? data.bossEvalution.weak || "" : ""}</div>
                </div>
              </div>
            </div>
            {
              checkIsExactPnL(Constants.pnlVCode.VinSchool) ?
                null :
                <>
                  <h5>Thông tin khóa học</h5>
                  <div className="box cbnv">
                    <div className="row task">
                      <div className="col-12">
                        <div className="box">
                          <table>
                            <thead>
                              <tr>
                                <th className="text-center" style={{ width: '8%' }}>STT</th>
                                <th style={{ width: '37%' }}>Tên khóa học</th>
                                <th style={{ width: '15%' }}>Tình trạng</th>
                                <th style={{ width: '40%' }}>Ghi chú</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                data && data.course && data.course.length > 0 ?
                                  data.course.map((item, index) => {
                                    return <tr key={index}>
                                      <td className="text-center" style={{ width: '8%' }}>{index + 1}</td>
                                      <td style={{ width: '37%' }}>{item.name}</td>
                                      <td className="text-center" style={{ width: '15%' }}>{item.status ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</td>
                                      {
                                        index == 0 ?
                                          <td className="text-center" style={{ width: '40%' }} rowSpan={data.course.length}>
                                            Không đạt sẽ không đủ điều kiện ký kết hợp đồng
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

                  <h5>Thông tin hồ sơ</h5>
                  <div className="box cbnv document">
                    <div className="row">
                      <div className="col-12">
                        <label>Tình trạng hồ sơ:</label> <span>{data.documentStatus}</span>
                      </div>
                    </div>
                  </div>
                </>
            }


            <h5>QUYẾT ĐỊNH XỬ LÝ VI PHẠM</h5>
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
            }

            <div className="box cbnv">
              <div className="row approve">
                <div className="col-12">
                {
                  checkIsExactPnL(Constants.PnLCODE.VinSchool) ?
                    <><span className="title">QUẢN LÝ TRỰC TIẾP ĐÁNH GIÁ</span></>
                    : <><span className="title">NGƯỜI ĐÁNH GIÁ</span><span className="sub-title">(Nếu có)</span></>
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
                  checkIsExactPnL(Constants.PnLCODE.VinSchool) ?
                  <><span className="title">CBLD thẩm định</span><span className="sub-title">(Nếu có)</span></>
                  : <span className="title">QUẢN LÝ TRỰC TIẾP ĐÁNH GIÁ</span>
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

            {/* quan li */}
            <div className="box cbnv more-description">
              <div className="title">Ý KIẾN ĐỀ XUẤT CỦA CBQL TRỰC TIẾP</div>
              <div className="row">
                <div className="col-3">
                  Kết quả
                  <div className="detail">{data && data.qlttOpinion ? data.qlttOpinion.result?.label : ""}</div>
                </div>
                <div className="col-3">
                  Loại hợp đồng lao động
                  <div className="detail">{data && data.qlttOpinion ? data.qlttOpinion.contract?.label : ""}</div>
                </div>
                <div className="col-3">
                  Ngày bắt đầu hợp đồng
                  <div className="detail">{data && data.qlttOpinion ? data.qlttOpinion.startDate : ""}</div>
                </div>
                <div className="col-3">
                  Ngày kết thúc hợp đồng
                  <div className="detail">{data && data.qlttOpinion ? data.qlttOpinion.endDate : ""}</div>
                </div>
              </div>
              <div className="row">
                {/* <div className="col-4">
                Điều chỉnh lương
                <div className="detail">{requestInfo ? moment(requestInfo.startDate).format("DD/MM/YYYY") + (requestInfo.startTime ? ' ' + moment(requestInfo.startTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '') : ""}</div>
              </div> */}
                <div className="col-12">
                  Đề xuất khác
                  <div className="detail">{data && data.qlttOpinion ? data.qlttOpinion.otherOption : ""}</div>
                </div>
              </div>
            </div>

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
                  <span className="title">NGƯỜI PHÊ DUYỆT</span>
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
                  data.nguoipheduyet && data.comment ?
                    <div className="col-12">
                      Lý do không duyệt
                      <div className="detail">{data.nguoipheduyet.comment}</div>
                    </div>
                    : null
                }
                {
                  data.nguoipheduyet && data.approvalDate ?
                  <div className="col-12">
                    Ngày phê duyệt
                    <div className="detail">{moment(data.approvalDate).format('DD/MM/YYYY')}</div>
                  </div>
                  : null
                }
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
    )
  }
}
