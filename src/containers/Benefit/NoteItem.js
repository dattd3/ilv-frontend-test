import React from "react";

export default function NoteItem(props) {  
  var title = props.title.toUpperCase();
  
  const style = {
    'marginLeft': '10px',
    'marginTop': '10px',
    'marginBottom': '25px',
    'font': 'Italic 16px/24px Helvetica Neue'    
  };

  if (title.includes("VINMEC")) {
    return (
      <div className="" style={style}>
             * Việc miễn phí/giảm phí khám/chữa bệnh cho CBLĐ cấp T1 trở xuống chỉ áp dụng với phần chi phí phát sinh sau khi đã áp dụng các chương trình bảo hiểm, không bao gồm các chi phí thuốc, vật tư tiêu hao ngoài gói và các dịch vụ do bên thứ 3 hoặc các chuyên gia bên ngoài thực hiện.             
      </div>
    );
  
  } else if (title.includes("VINSCHOOL")) {
    return (
      <></>
          // <div className="" style={style}>
          //     * Các khái niệm này từ đây được hiểu như sau: 
          //     <br/>
          //     - Người thân là vợ/chồng, cha mẹ đẻ, cha mẹ vợ/chồng, con hợp pháp của CBNV
          //     <br/> 
          //     - Không áp dụng chương trình VinID cho các hạng mục chi phí đã được miễn/giảm theo Chế độ ưu đãi dịch vụ nội bộ.              
          // </div>
        );

  } else {
    return null;
  }
}
