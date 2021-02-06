import React, { useEffect } from "react";
import { useApi, useFetcher } from "../../modules";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../components/Forms/CustomForm/LoadingSpinner";
import Media from 'react-bootstrap/Media'

function Vingroup(props) {
    const { t } = useTranslation();

    useEffect(() => {
        document.title = t("Menu_VinpearlIntroduction");
    });
    if (true) {

        return (
            <div className="about-vinpearl">
                <div>
                    <div className="banner position_relative">
                        <img className=" d-none d-lg-block" src="https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/user_profile/20190107_082424_539600_gioi_thieu.max-1800x1800_50346_20210206_040736.jpg" />
                        <div className="banner_text position_center d-lg-block bg-black-trasparent">
                            <p className="m0 sub-title">VINMEC</p>
                            <p className="m0">Chăm sóc bằng tài năng, y đức và sự thấu cảm</p>
                        </div>
                    </div>
                    <div className="col-12 mt-5">
                        <ul className="list-unstyled">
                            <Media as="li" className="mb-5">
                                <img
                                    width={400}
                                    height={250}
                                    className="mr-3 border-radius-10"
                                    src="https://vinmec-prod.s3.amazonaws.com/images/20181130_035926_807835_38843-vinmec_retouch_.max-800x800.jpg"
                                    alt="Generic placeholder"
                                />
                                <Media.Body>
                                    <h3><a href="https://vinmec.com/vi/gioi-thieu/gioi-thieu-ve-he-thong-y-te-vinmec/" target="blank">Hệ thống Y tế Vinmec</a></h3>
                                    <p>
                                        Vinmec là Hệ thống Y tế phi lợi nhuận do Vingroup - Tập đoàn kinh tế tư nhân hàng đầu Việt Nam đầu tư phát triển với sứ mệnh “Mang lại sự lựa chọn hoàn hảo về chăm sóc sức khỏe". Hiện Vinmec vận hành 7 bệnh viện trên toàn quốc.
                                    </p>
                                </Media.Body>
                            </Media>

                            <Media as="li" className="mb-5">
                                <img
                                    width={400}
                                    height={250}
                                    className="mr-3 border-radius-10"
                                    src="https://vinmec-prod.s3.amazonaws.com/images/20181207_115046_230547_Vinmec_10.max-800x800.png"
                                    alt="Generic placeholder"
                                />
                                <Media.Body>
                                    <h3><a href="https://vinmec.com/gioi-thieu/vi-sao-nen-chon-vinmec/" target="blank">Vì sao nên chọn Vinmec?</a></h3>
                                    <p>
                                        Vinmec có đội ngũ chuyên gia, bác sĩ, dược sĩ và điều dưỡng trình độ chuyên môn cao, giàu kinh nghiệm. tận tâm và chuyên nghiệp. Luôn đặt người bệnh làm trung tâm, Vinmec cam kết đem đến dịch vụ chăm sóc sức khỏe tốt nhất.
                                    </p>
                                </Media.Body>
                            </Media>

                            <Media as="li" className="mb-5">
                                <img
                                    width={400}
                                    height={250}
                                    className="mr-3 border-radius-10"
                                    src="https://vinmec-prod.s3.amazonaws.com/images/20191009_133949_138286_JCI.max-800x800.jpg"
                                    alt="Generic placeholder"
                                />
                                <Media.Body>
                                    <h3><a href="https://vinmec.com/gioi-thieu/chuan-muc-quoc-te-dau-vang-cua-chuc-jci/" target="blank">Chuẩn mực quốc tế - Dấu vàng của tổ chức JCI</a></h3>
                                    <p>
                                        Dấu Vàng của Tổ chức JCI trao tặng cho Vinmec đã chứng nhận quá trình nỗ lực vượt bậc của bệnh viện nhằm đem lại chất lượng chăm sóc sức khỏe cho người bệnh. Vinmec là Hệ thống Y tế tư nhân DUY NHẤT tại Việt Nam có 2 bệnh viện đạt tiêu chuẩn JCI.
                                    </p>
                                </Media.Body>
                            </Media>

                            <Media as="li" className="mb-5">
                                <img
                                    width={400}
                                    height={250}
                                    className="mr-3 border-radius-10"
                                    src="https://vinmec-prod.s3.amazonaws.com/images/20181130_035926_807835_38843-vinmec_retouch_.max-800x800.jpg"
                                    alt="Generic placeholder"
                                />
                                <Media.Body>
                                    <h3><a href="https://vinmec.com/gioi-thieu/lien-he-vinmec/" target="blank">Thông tin liên hệ của các bệnh viện và phòng khám Vinmec trên toàn quốc</a></h3>
                                    <p>
                                        Vinmec là Hệ thống Y tế phi lợi nhuận do Vingroup - Tập đoàn kinh tế tư nhân hàng đầu Việt Nam đầu tư phát triển với sứ mệnh “Chăm sóc bằng tài năng, y đức và sự thấu cảm". Hiện Vinmec vận hành 7 bệnh viện đa khoa và 5 phòng khám trên toàn quốc.
                                    </p>
                                </Media.Body>
                            </Media>
                        </ul>
                    </div>
                </div>
            </div>
        );
    } else {
        return <LoadingSpinner />;
    }
}
export default Vingroup;