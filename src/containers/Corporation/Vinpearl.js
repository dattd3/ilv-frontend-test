import React, { useEffect } from "react";
import { useApi, useFetcher } from "../../modules";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../components/Forms/CustomForm/LoadingSpinner";

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchIntroduce,
        autoRun: true,
        params: params
    });
    return data;
};

function Vingroup(props) {
    const { t } = useTranslation();
    const result = usePreload([2]);
    useEffect(() => {
        document.title = t("Menu_VinpearlIntroduction");
    });
    if (result && result.data) {

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
                        <div className="about_content_detail">
                        <p dangerouslySetInnerHTML={{__html: result.data.content}} /></div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <LoadingSpinner />;
    }
}
export default Vingroup;