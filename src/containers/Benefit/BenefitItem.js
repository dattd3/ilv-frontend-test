import React from "react";

export default function BenefitItem(props) {
        
    return (
        <div class="p-3 bg-white">

             <div id="benefit-title">
                {props.title}
              </div>
                  
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Dịch vụ</th>
                        <th>Chế độ phúc lợi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>01</td>
                        <td>
                          Ưu đãi cho bản thân
                          <br/>
                          (Phòng và các dịch vụ theo gói phòng)
                        </td>
                        <td>
                            - Miễn phí 7 đêm phòng FBVS/năm
                            <br/>
                            - Tiêu chuẩn VIP1: phòng Suite (nếu thu xếp được) hoặc phòng tiêu chuẩn kế tiếp. 
                            <br/>
                            - Xe riêng đưa đón sân bay
                        </td>
                      </tr>
                      <tr>
                        <td>02</td>
                        <td>
                          Ưu đãi cho người thân
                          <br/>
                          (Phòng và các dịch vụ theo gói phòng)
                        </td>
                        <td>
                            - Miễn phí không quá 6 đêm phòng FBVS/năm. 
                            <br/>
                            - Tiêu chuẩn: VIP2: Phòng tiêu chuẩn
                            <br/>
                            - Xe riêng đưa đón sân bay
                        </td>
                      </tr>
                      <tr>
                        <td>03</td>
                        <td>
                          Các dịch vụ khác
                        </td>
                        <td>
                          - Trong thời gian lưu trú theo chế độ, CBLĐ và người thân:
                          <br/>
                            + Được giảm giá 50% trên giá công bố khi sử dụng dịch vụ ăn uống tại Nhà hàng Alarcarte, đồ uống có cồn, bữa ăn phục vụ tại phòng, tổ chức tiệc 50 người/lần (tại Khách sạn, Vinpearlland, Golf trừ Proshop, Safari)
                            <br/>
                            + Được miễn phí các dịch vụ còn lại do Vinpearl cung cấp tại Khách sạn, Vinpearlland, Golf, Safari
                            <br/>
                          - Ngoài thời gian lưu trú theo chế độ phúc lợi, áp dụng ưu đãi như cấp T4
                        </td>
                      </tr>
                      
                    </tbody>
                  </table>
      </div>
    );
}