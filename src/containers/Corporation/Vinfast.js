import React, { useEffect } from "react";
import { useApi, useFetcher } from "../../modules";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../components/Forms/CustomForm/LoadingSpinner";
import '../../assets/css/about-vinfast/theme.css';
import '../../assets/css/about-vinfast/contact_page.css';
import '../../assets/css/about-vinfast/theme-elements.css';
import '../../assets/css/about-vinfast/vendor.min.css';
import Carousel from 'react-bootstrap/Carousel'

const usePreload = (params) => {
  const api = useApi();
  const [data = [], err] = useFetcher({
    api: api.fetchArticleDetail,
    autoRun: true,
    params: params
  });
  return data;
};

function Vingroup(props) {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("Menu_VinfastIntroduction");
  });

  //const result = usePreload([3]);


  if (true) {
    //     const detail = result.data;
    //     var content = detail.content;

    return (
      <>
        <body className="path-ve-chung-toi context-ve-chung-toi shadow" data-target="#header" data-spy="scroll" data-offset="100">
          <div className="dialog-off-canvas-main-canvas" data-off-canvas-main-canvas>
            <div className="about_us_page">
              <div className="about_us_banner">
                <div className="container">
                  <div className="overview">
                    <div className="ov_title">
                      <span>CÔNG TY Ô TÔ THƯƠNG HIỆU</span>
                      <span>VIỆT NAM ĐẦU TIÊN</span>
                    </div>
                    <div className="des_text">
                      <span>Việt Nam - Phong cách - An toàn - Sáng tạo - Tiên phong không chỉ đơn thuần là những
                      từ
                      viết tắt tạo nên VinFast mà còn đại diện cho giá trị và kim chỉ nam cho mọi quyết định
                      hàng
                    ngày của chúng tôi để mang lại những lợi ích tốt nhất cho khách hàng.</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="journey_block">
                <div className="container">
                  <div className="jou_logo">
                    <div className="img_wrapper">
                      <img src="https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/vinfast/contact_page/vertical_logo.svg" alt="vinfast" />
                    </div>
                  </div>
                  <h2 className="jou_title"><span>Hành trình 365 ngày</span><span>“giấc mơ ô tô Việt”</span></h2>
                  <div className="jou_detail">
                    <div className="jou_des_text row">
                      <div className="first_des col-md-6">
                        <p>Khẳng định dũng khí của tinh thần Việt Nam, VinFast đã thần tốc đưa ra thị trường các
                        sản
                        phẩm ô tô chất lượng: Fadil, LUX A2.0, LUX SA2.0, President và các mẫu xe máy điện
                        thời
                      thượng: KlaraS, Impes và Ludo. </p>
                      </div>
                      <div className="second_des col-md-6">
                        <p>Hành trình thần tốc và kỳ diệu của VinFast đã viết nên ước mơ của hàng triệu người
                        Việt,
                      đưa thương hiệu xe Việt Nam đầu tiên lên bản đồ sản xuất xe thế giới.</p>
                      </div>
                    </div>
                    <div className="point_list">
                    </div>

                    <div className="color-white">
                      <Carousel>
                        <Carousel.Item interval={800}>
                          <div style={{ backgroundImage: 'url("https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/vinfast/contact_page/po1.png")' }} 
                            className="slide"
                          />
                          <Carousel.Caption>
                            <h3 className="color-white">2/9/2017</h3>
                            <p className="color-white">Khởi công xây dựng tổ hợp sản xuất ô tô – xe máy điện VinFast</p>
                          </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={800}>
                        <div style={{ backgroundImage: 'url("https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/vinfast/contact_page/po2.png")' }} 
                            className="slide"
                          />
                          <Carousel.Caption>
                            <h3 className="color-white">1/10/2018</h3>
                            <p className="color-white">Ra mắt VinFast Lux SA2.0, VinFast Lux A2.0 tại Paris Motor Show và được
                                tổ
                                chức về ô tô hàng đầu châu Âu - AutoBest vinh danh là "ngôi sao mới" của
                                ngành ô tô thế giới</p>
                          </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={800}>
                        <div style={{ backgroundImage: 'url("https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/vinfast/contact_page/po3.png")' }} 
                            className="slide"
                          />
                          <Carousel.Caption>
                            <h3 className="color-white">3/11/2018</h3>
                            <p className="color-white">Khánh thành nhà máy sản xuất xe máy điện thông minh và ra mắt dòng sản
                                phẩm
                                đầu tiên Klara</p>
                          </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={800}>
                        <div style={{ backgroundImage: 'url("https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/vinfast/contact_page/po4.png")' }} 
                            className="slide"
                          />
                          <Carousel.Caption>
                            <h3 className="color-white">5/3/2019</h3>
                            <p className="color-white">Ra mắt xe SUV phiên bản đặc biệt tại Geneva Motor Show 2019</p>
                          </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={800}>
                        <div style={{ backgroundImage: 'url("https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/vinfast/contact_page/po5.png")' }} 
                            className="slide"
                          />
                          <Carousel.Caption>
                            <h3 className="color-white">6/3/2019</h3>
                            <p className="color-white">Chiếc Lux SA2.0 đầu tiên lăn bánh khỏi dầy chuyền lắp ráp</p>
                          </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={800}>
                        <div style={{ backgroundImage: 'url("https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/vinfast/contact_page/po6.png")' }} 
                            className="slide"
                          />
                          <Carousel.Caption>
                            <h3 className="color-white">20/3/2019</h3>
                            <p className="color-white">Lô xe VinFast đầu tiên trong số 155 xe đã được vận chuyển bằng đường
                                hàng
                                không đến 14 quốc gia thuộc 4 châu lục để kiểm thử chất lượng và độ an
                                toàn</p>
                          </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={800}>
                        <div style={{ backgroundImage: 'url("https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/vinfast/contact_page/po7.png")' }} 
                            className="slide"
                          />
                          <Carousel.Caption>
                            <h3 className="color-white">14/6/2019</h3>
                            <p className="color-white">Khánh thành nhà máy sản xuất ô tô VinFast tại Cát Hải, Hải Phòng sau 21
                                tháng xây dựng</p>
                          </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={800}>
                        <div style={{ backgroundImage: 'url("https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/vinfast/contact_page/po8.png")' }} 
                            className="slide"
                          />
                          <Carousel.Caption>
                            <h3 className="color-white">6/2019</h3>
                            <p className="color-white">Bắt đầu bàn giao ba mẫu xe ô tô VinFast Lux SA2.0, VinFast Lux A2.0 và
                                VinFast Fadil.</p>
                          </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={800}>
                        <div style={{ backgroundImage: 'url("https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/vinfast/contact_page/po9.png")' }} 
                            className="slide"
                          />
                          <Carousel.Caption>
                            <h3 className="color-white">12/9/2019</h3>
                            <p className="color-white">Ra mắt hai mẫu xe máy điện Ludo và Impes</p>
                          </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={800}>
                        <div style={{ backgroundImage: 'url("https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/vinfast/contact_page/po10.png")' }} 
                            className="slide"
                          />
                          <Carousel.Caption>
                            <h3 className="color-white">23/10/2019</h3>
                            <p className="color-white">VinFast được chương trình đánh giá xe mới khu vực Đông Nam Á - ASEAN
                                NCAP
                                trao chứng nhận an toàn ở mức cao nhất - 5 sao cho hai dòng xe Lux SA2.0
                                và
                                Lux A2.0. Dòng xe đô thị đa dụng VinFast Fadil cũng đạt an toàn 4 sao.</p>
                          </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={800}>
                        <div style={{ backgroundImage: 'url("https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/vinfast/contact_page/po11.png")' }} 
                            className="slide"
                          />
                          <Carousel.Caption>
                            <h3 className="color-white">26/12/2019</h3>
                            <p className="color-white">Giới thiệu phiên bản nâng cấp của dòng xe máy điện VinFast Klara S</p>
                          </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={800}>
                        <div style={{ backgroundImage: 'url("https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/vinfast/contact_page/po12.png")' }} 
                            className="slide"
                          />
                          <Carousel.Caption>
                            <h3 className="color-white">11/6/2020</h3>
                            <p className="color-white">VinFast chính thức khai trương văn phòng tại Melbourne, Australia</p>
                          </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={800}>
                        <div style={{ backgroundImage: 'url("https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/vinfast/contact_page/po13.png")' }} 
                            className="slide"
                          />
                          <Carousel.Caption>
                            <h3 className="color-white">7/9/2020</h3>
                            <p className="color-white">Ra mắt mẫu SUV V8 phiên bản giới hạn President, khẳng định đẳng cấp của
                                thương hiệu ô tô Việt Nam sau 2 năm ra mắt</p>
                          </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={800}>
                        <div style={{ backgroundImage: 'url("https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/vinfast/contact_page/po14.png")' }} 
                            className="slide"
                          />
                          <Carousel.Caption>
                            <h3 className="color-white">9/9/2020</h3>
                            <p className="color-white">VinFast đã ký thỏa thuận mua lại Trung tâm thử nghiệm xe hơi lâu đời và
                                hiện
                                đại bậc nhất thế giới Lang Lang, bang Victoria, Australia</p>
                          </Carousel.Caption>
                        </Carousel.Item>
                        
                      </Carousel>
                    </div>


                  </div>
                </div>
              </div>
              <div className="shadow-bg" />
              <div className="imprint_block">
                <h2>Dấu ấn VinFast</h2>
                <div className="ip_body container">
                  <div className="row">
                    <div className="col-12">
                      <div className="ip_body">
                        <img src="https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/namnb/Rectangle5761-1.png" className="img-responsive w-100 d-none d-md-block" />
                        <img src="https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/namnb/Rectangle5761-2.png" className="img-responsive w-100 d-md-none" />
                        <div className="text">
                          <h3>TƯ DUY ĐỘC ĐÁO, THIẾT KẾ THĂNG HOA</h3>
                          <div>
                            <p>Thiết kế thăng hoa của các mẫu xe VinFast được chấp bút bởi những đơn vị
                            thiết kế
                            hàng đầu thế giới, đặc biệt khách hàng có thể tham gia vào quá trình quyết
                            định
                            thiết kế cho những chiếc xe VinFast trong tương lai -
                          điều chưa từng có tiền lệ trong ngành công nghiệp ô tô.</p>
                            <p>Thể hiện sự tôn trọng và lắng nghe khách hàng như một thương hiệu xe của tất
                            cả
                            mọi người, không chỉ của riêng VinFast. Cách tiếp cận sáng tạo và ấn tượng
                            tạo
                          tiền đề cho việc lấy khách hàng làm trọng tâm.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block_4 d-flex">
                <img src="https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/namnb/Rectangle541-2.png" className="img-responsive w-100 d-md-none" />
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <div className="text">
                        <h3>ĐẲNG CẤP THẾ GIỚI <br /> ĐỊNH HÌNH TƯƠNG LAI</h3>
                        <div>
                          <p>Với tham vọng tạo ra những chiếc xe đẳng cấp chinh phục thị trường ô tô thế giới,
                          tham gia vào quá trình tạo nên những chiếc xe VinFast là các tên tuổi có tầm ảnh
                          hưởng trong ngành công nghiệp ô tô như hãng thiết kế lừng
                          danh Pininfarina, đơn vị tổng thầu sản xuất uy tín Magna Steyr hay hệ thống
                          truyền
                          động số 1 thế giới AVL. Ngoài ra còn có những đối tác chiếc lược tầm thế giới
                          như
                        BMW, General Motors, Bosch, Siemens, v.v.</p>
                          <p>Những chiếc xe VinFast đầu tiên đã được vận chuyển bằng đường hàng không đi 14
                          quốc
                          gia, ở 4 châu lục để thử nghiệm an toàn và chất lượng. Trong đó, Lux SA2.0 và
                          Lux
                          A2.0 đã được trao giấy chứng nhận an toàn 5 sao của NCAP
                        Châu Á.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block_5">
                <div className="future_destination_text">
                  <h3 className="mb-0">TINH HOA VIỆT NAM</h3>
                  <div className="text">
                    <p>Hơn cả việc tạo nên một chiếc xe mới, VinFast ra đời đại diện cho tinh thần và niềm kiêu hãnh
                    dân
                    tộc. Khát vọng và phong thái chuyên nghiệp của tập đoàn Vingroup hứa hẹn sẽ đưa thương hiệu
                    VinFast trở thành ngôi sao sáng vươn tầm
                  châu lục.</p>
                    <p>“Chúng tôi khát vọng xây dựng xe ô tô thương hiệu Việt có thể cạnh tranh trên toàn thế giới”
                    -
                  Chủ tịch tập đoàn Vingroup - Phạm Nhật Vượng</p>
                  </div>
                </div>
              </div>
              <div className="block6 text-center">
                <img src="https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/namnb/back-nam.png" alt="vinfast" />
              </div>
              <img id="logo-w" className="d-none" src="https://myvinpearl-dev.s3-ap-southeast-1.amazonaws.com/images/Vinfast/img/vinfast/logo-w.png" />
            </div>
          </div>
        </body>
      </>
    );
  } else {
    return <LoadingSpinner />;
  }
}

export default Vingroup;