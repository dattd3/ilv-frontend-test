import React from "react";
import { useTranslation } from "react-i18next";
import './w3.css';
import './news.css';
import './font-karma.css';

function News() {
  const script = document.createElement("script");
   script.src = "https://kit.fontawesome.com/a076d05399.js";
   script.async = true;
   document.body.appendChild(script);

    return (
    <div className="w3-main w3-padding w3-center">
      {/* ĐÂY LÀ DÒNG TIÊU ĐỀ */}
        <h4 className="news-title w3-left">TIN TỨC SỰ KIỆN</h4>
        <hr></hr>
      {/* ĐÂY LÀ DÒNG THỨ NHẤT */}
        <div className="w3-row-padding w3-padding-16 w3-center">
           <div className="w3-quarter border-shadow content-margin no-padding content-width">
                <img src="https://ircdn.vingroup.net/storage/Uploads/0_Tintuchoatdong/2019/December/vh2%20(2).jpg" className="image-top-radius">
                </img>
                <div className="content-padding">
                    <h4 className="row-2lines"> VINHOMES OCEAN PARK ĐẠT KỶ LỤC “KHU ĐÔ THỊ CÓ BIỂN HỒ NƯỚC MẶN VÀ HỒ NƯỚC NGỌT NHÂN TẠO TRẢI CÁT TRẮNG LỚN NHẤT THẾ GIỚI”</h4>
                    <p className="row-2lines">Công ty CP Vinhomes chính thức khánh thành công trình biển hồ nước mặn rộng 6,1ha tại dự án Vinhomes Ocean Park (Gia Lâm, Hà Nội). Dưới sự chứng kiến của hàng ngàn khách mời</p>
                    <span className="datetime-info w3-left"><i class="far fa-user"></i> vingroup.net </span>
                    <span className="datetime-info w3-right"><i className="far">&#xf017;</i> 09/01/2020 18:40</span>
                </div>
           </div>
           <div className="w3-quarter border-shadow content-margin no-padding content-width">
                <img src="https://elements-cover-images-0.imgix.net/882796bd-84dc-46fd-931f-00d9ae3e3abc?auto=compress%2Cformat&fit=max&w=900&s=cff98aeb813d8ad4f5082df0791eef21" className="image-top-radius">
                </img>
                <div className="content-padding">
                    <h4 className="row-2lines">The Perfect Sandwich, A Real NYC Classic</h4>
                    <p>Just some random text, lorem ipsum text praesent tincidunt ipsum lipsum.</p>
                    <span className="datetime-info">vinpearl.com - 09/01/2020 18:40</span>
                </div>
           </div>
           <div className="w3-quarter border-shadow content-margin no-padding content-width">
                <img src="https://elements-cover-images-0.imgix.net/8f09571d-dc20-47ed-b8b6-c0f1c992afca?auto=compress%2Cformat&fit=max&w=900&s=99f8ea488a4aacae0184779a5dcf1154" className="image-top-radius">
                </img>
                <div className="content-padding">
                    <h4 className="row-2lines">The Perfect Sandwich, A Real NYC Classic</h4>
                    <p>Just some random text, lorem ipsum text praesent tincidunt ipsum lipsum.</p>
                    <span className="datetime-info">vinpearl.com - 09/01/2020 18:40</span>
                </div>
           </div>
        </div>

        {/* ĐÂY LÀ DÒNG THỨ HAI */}
          <div className="w3-row-padding w3-padding-16 w3-center">
             <div className="w3-quarter border-shadow content-margin no-padding content-width">
                  <img src="https://www.w3schools.com/w3images/sandwich.jpg" className="image-top-radius">
                  </img>
                  <div className="content-padding">
                      <h4 className="row-2lines">The Perfect Sandwich, A Real NYC Classic</h4>
                      <p>Just some random text, lorem ipsum text praesent tincidunt ipsum lipsum.</p>
                      <span className="datetime-info">vinpearl.com - 09/01/2020 18:40</span>
                  </div>
             </div>
             <div className="w3-quarter border-shadow content-margin no-padding content-width">
                  <img src="https://elements-cover-images-0.imgix.net/882796bd-84dc-46fd-931f-00d9ae3e3abc?auto=compress%2Cformat&fit=max&w=900&s=cff98aeb813d8ad4f5082df0791eef21" className="image-top-radius">
                  </img>
                  <div className="content-padding">
                      <h4 className="row-2lines">The Perfect Sandwich, A Real NYC Classic</h4>
                      <p>Just some random text, lorem ipsum text praesent tincidunt ipsum lipsum.</p>
                      <span className="datetime-info">vinpearl.com - 09/01/2020 18:40</span>
                  </div>
             </div>
             <div className="w3-quarter border-shadow content-margin no-padding content-width">
                  <img src="https://elements-cover-images-0.imgix.net/8f09571d-dc20-47ed-b8b6-c0f1c992afca?auto=compress%2Cformat&fit=max&w=900&s=99f8ea488a4aacae0184779a5dcf1154" className="image-top-radius">
                  </img>
                  <div className="content-padding">
                      <h4 className="row-2lines">The Perfect Sandwich, A Real NYC Classic</h4>
                      <p>Just some random text, lorem ipsum text praesent tincidunt ipsum lipsum.</p>
                      <span className="datetime-info">vinpearl.com - 09/01/2020 18:40</span>
                  </div>
             </div>
          </div>

          {/* ĐÂY LÀ MỤC PHÂN TRANG */}
        <div class="w3-center w3-padding-32">
          <div class="w3-bar">
            <a href="#" className="w3-bar-item w3-button w3-hover-black">«</a>
            <a href="#" className="w3-bar-item w3-black w3-button">1</a>
            <a href="#" className="w3-bar-item w3-button w3-hover-black">2</a>
            <a href="#" className="w3-bar-item w3-button w3-hover-black">3</a>
            <a href="#" className="w3-bar-item w3-button w3-hover-black">4</a>
            <a href="#" className="w3-bar-item w3-button w3-hover-black">»</a>
          </div>
       </div>

    </div>
    );
}
export default News;
