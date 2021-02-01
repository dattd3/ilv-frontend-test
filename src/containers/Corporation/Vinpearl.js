import React, { useEffect } from "react";
import { useApi, useFetcher } from "../../modules";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../components/Forms/CustomForm/LoadingSpinner";

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
                        <img className=" d-none d-lg-block" src="https://myvinpearl-dev.s3.ap-southeast-1.amazonaws.com/user_profile/Sydney-Harbour-Bridge-8_399_20210127_031904.jpg" />
                        <div className="banner_text position_center d-none d-lg-block">
                            <div className="m0"><p className="m0 title">Về Chúng tôi</p>
                                <p className="m0 sub-title">Vinpearl</p>
                                <p className="m0">Vinpearl là thương hiệu dịch vụ nghỉ dưỡng và giải trí đẳng cấp 5 sao theo tiêu chuẩn quốc tế tọa lạc tại các miền di sản UNESCO của Việt Nam. Với hệ sinh thái tất cả-trong-một điểm đến, sự thấu hiểu tinh hoa văn hóa Việt Nam cùng dịch vụ đẳng cấp, Vinpearl sẽ tiên phong góp phần lan tỏa xa hơn vẻ đẹp Việt Nam tới quốc tế.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 about_content text-center p0i_mb">
                        <p className="about_name">Tinh hoa Việt Nam - Đẳng cấp thế giới</p>
                        <hr className="line mt30 mb30" />
                        <div className="about_content_detail"><p><strong>Vinpearl là thương hiệu dịch vụ du lịch nghỉ dưỡng – giải trí lớn nhất Việt Nam</strong>. Vinpearl sở hữu chuỗi khách sạn, resort và trung tâm hội nghị đẳng cấp 5 sao, các khu vui chơi giải trí quốc tế tọa lạc tại những danh thắng du lịch nổi tiếng nhất của Việt Nam. Sau 15 năm phát triển, Vinpearl đang có 43 cơ sở, công suất trên 17.000 phòng trên toàn quốc, dự kiến tiếp tục mở rộng qui mô tại Việt Nam và trên thế giới trong thời gian tới.<br />
              Tiên phong dẫn đầu trong kiến tạo và nâng tầm dịch vụ du lịch – nghỉ dưỡng tại Việt Nam, hệ sinh thái Vinpearl đem đến trải nghiệm tất cả-trong-một, gồm chuỗi khách sạn và khu nghỉ dưỡng, các công viên giải trí, safari, sân golf, spa, ẩm thực, hệ thống trung tâm hội nghị 5* chuẩn quốc tế, tích hợp với trung tâm thương mại và nhà phố shophouse hiện đại.<br />
              Vinpearl đáp ứng toàn diện các nhu cầu khác nhau để mỗi du khách có thể tận hưởng kỳ nghỉ như được thiết kế cho riêng mình, nâng tầm trải nghiệm với những dịch vụ dẫn đầu các xu hướng thời thượng hiện nay. Nơi đây cũng được mệnh danh là chốn dừng chân hoàn hảo cho hành trình khám phá vẻ đẹp tuyệt mỹ của thiên nhiên, văn hóa và con người Việt Nam.<br />
              Đặc biệt với hệ thống Ballroom và phòng họp linh hoạt, đẳng cấp cùng dịch vụ tổ chức chuyên nghiệp và ẩm thực đa phong vị, Vinpearl còn là lựa chọn hàng đầu để tổ chức các sự kiện cao cấp, phong cách kết hợp nghỉ ngơi tinh tế. Được trang bị những thiết bị tiên tiến hàng đầu hiện nay, Vinpearl đáp ứng yêu cầu tổ chức khắt khe của các sự kiện hội đàm quốc tế, hội nghị quan trọng của những nhà lãnh đạo cấp cao.<br />
              Hệ thống Vinpearl đang sở hữu 5 thương hiệu nghỉ dưỡng <strong>Vinpearl Luxury</strong> – <strong>Vinpearl Resorts</strong> – <strong>Vinpearl Discovery Condotels &amp; Resorts</strong> – <strong>Vinpearl Hotels</strong> – <strong>VinOasis</strong>, 3 thương hiệu vui chơi giải trí <strong>Vinpearl Land</strong> – <strong>Vinpearl Safari</strong> – <strong>Vinpearl Golf</strong>, 2 thương hiệu spa <strong>Vincharm</strong>, <strong>Akoya</strong>, 1 thương hiệu MICE – <strong>Vinpearl Convention Center</strong> và 1 thương hiệu ẩm thực <strong>Almaz</strong>. Cùng lợi thế hoàn hảo được thiên nhiên ban tặng, Vinpearl luôn Sáng Tạo – Nỗ Lực – Tận Tâm để lan tỏa mạnh mẽ những nét đẹp của đất nước, con người và tinh hoa văn hóa của Việt Nam tới bạn bè năm châu, đưa Việt Nam thành điểm đến mới của du lịch Châu Á.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <LoadingSpinner />;
    }
}
export default Vingroup;