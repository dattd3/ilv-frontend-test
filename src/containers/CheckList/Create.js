import React from "react";
import { Button, Card } from 'react-bootstrap';
import readXlsxFile from 'read-excel-file'
import { useTranslation } from "react-i18next"


function Create(props) {
    const { t } = useTranslation()
    let hiddenInputFile = null;
    let displayInputFile = null;

    const ChooseFile = () => {
        hiddenInputFile.click();
    }

    const FileOnChange = () => {
        displayInputFile.value = hiddenInputFile.files[0].name;
    }

    const ReadFileContent = () => {
        if (hiddenInputFile && hiddenInputFile.files.length >= 0) {
            let checklistFile = hiddenInputFile.files[0];
            try {
                readXlsxFile(checklistFile).then((rows) => {
                  });
            } catch  {
                console.log('invalid file type');
            }
        } else {
            console.log('no files found!');
        }
    }

    return (
        <>
            <h1 className="h3 mb-2 text-gray-800">{t("CheckList")}</h1>            
            <Card className="shadow mb-4">
                <Card.Header className="py-3">
                    <h6 className="m-0 font-weight-bold text-primary">{t("UploadCheckList")}</h6>
                </Card.Header>
                <Card.Body>
                    <div className="form-group upload-form">
                        <input type="file" name="fileCheckList" accept=".xls, .xlsx" className="file-upload" id="fileUpload" ref={(input) => { hiddenInputFile = input; }} onChange={FileOnChange} />
                        <div className="input-group col-xs-12">
                            <span className="input-group-addon"><i className="glyphicon glyphicon-picture"></i></span>
                            <input type="text" className="form-control input-lg" disabled placeholder={t("SelectFilePlaceHolder")} ref={(i) => { displayInputFile = i; }} />
                            <span className="input-group-btn">
                                <button className="browse btn btn-success input-lg" type="button" onClick={ChooseFile}><i className="fa fa-folder-open"></i> {t("SelectFile")}</button>
                            </span>
                            <span className="input-group-btn ml-2">
                                <button className="btn btn-primary input-lg" type="button" onClick={ReadFileContent}><i className="fa fa-cloud-upload-alt"></i> {t("Upload")}</button>
                            </span>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>{t("NumberOrder")}</th>
                                    <th>{t("CheckListContent")}</th>
                                    <th>{t("TaskDetail")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>
                                        Kiểm tra doanh thu buồng phòng
                                    </td>
                                    <td>
                                        <p>
                                            - Đối với kỳ BCTC tháng: toàn bộ phần doanh thu 15 đêm nghỉ miễn phí đối soát, chốt số, suất hóa đơn và nghi nhận vào ngày 28 hàng tháng<br />
                                            - Đối chiếu các bút toán interface giữa opera và SAP để đảm bảo doanh thu giữa 2 hệ thống đầy đủ, chính xác<br />
                                            - Đối với tháng 12, đối soát lần 1, xuất hóa đơn, ghi nhận doanh thu vào 28/12,  tạm tính doanh thu, chi phí 15 đêm nghỉ miễn phí nội bộ đến ngày 31/12 chốt doanh thu năm tại ngày T+2 đối với các khách chưa check out
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Kiểm tra Doanh thu F&B</td>
                                    <td>
                                        <p>
                                            - Kiểm tra dữ liệu interface tự động từ Simphony, micros sang SAP<br />
                                            - Kiểm tra các giao dịch nhập xuất điều chỉnh cho các TH thiếu hàng hoặc sai mã hàng trên Simphony<br />
                                            - Kiểm tra báo cáo các giao dịch sau ngày chốt sổ (closing date của Simphony)<br />
                                            - Kiểm tra giá vốn buffet tại các nhà hàng, kiểm tra báo cáo KK tồn kho cuối tháng, so sánh CL giữa phần chặn tồn và báo cáo bán hàng đối với phần bán hàng tự động<br />
                                            - Kiểm tra việc trừ hàng trên SAP đảm bảo kiểm soát được việc trừ theo BOM được chính xác (Áp dụng đối với các Site áp dung phần mềm bán hàng R-Keeper)<br />
                                            --&gt; Tiến hành trích trước cho các khoản chi phí cắt kỳ trước ngày cuối tháng đảm bảo ghi nhận đủ phát sinh cho 1 kỳ kế toán.

                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Giá vốn buồng, phòng khách sạn</td>
                                    <td>
                                        <p>
                                            - Đảm bảo các bút toán đã được thực hiện đầy đủ và chính xác gồm:<br />
                                            + Phân bổ CCDC, TSCĐ, Phân bổ lương, Bút toán phân bổ năng lượng, hóa chất, xăng dầu, Bút toán xuất kho đồ Amenity, Kỹ thuật, HK<br />
                                            + Kiểm tra việc tách, phân bổ giá vốn nội bộ giữa các khách sạn, bộ phận, dịch vụ<br />
                                            + Kiểm tra CF miễn phí cho khách: set up, khách VIP<br />
                                            + Kiểm tra định mức, hạn mức vật tư tiêu hao và báo cáo sử dụng vật tư của kỹ thuật<br />
                                            --&gt; Tiến hành trích trước cho các khoản chi phí, cắt kỳ trước ngày cuối tháng đảm bảo ghi nhận đủ phát sinh cho 1 kỳ kế toán.
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>     
                                <tr>
                                    <td colSpan={3}>
                                        <Button variant="primary" className="mr-2">{t("Confirm")}</Button>
                                        <Button variant="secondary">{t("Cancel")}</Button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}

export default Create;