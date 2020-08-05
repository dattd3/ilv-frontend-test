import React from 'react';
import axios from 'axios';
import PositionRecruitingSearch from './PositionRecruitingSearch'
import PositionRecruitingTable from './PositionRecruitingTable'
import CustomPaging from '../../../components/Common/CustomPaging'
import TableUtil from '../../../components/Common/table'

class PositionRecruiting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: [],
      search: {
        position: 0,
        placeOfWork: 0
      },
      pageNumber: 1
    }
  }

  componentWillMount() {
    const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    }

    axios.get(`${process.env.REACT_APP_REQUEST_URL}api/vacancies`, config)
    .then(res => {
      if (res && res.data && res.data.data) {
        console.log(res.data.data)
      }
    }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
    })
    const jobs =  [
      {
        "id": 2,
        "sourceName": "MyVinpearl",
        "expireDate": "2020-12-31T00:00:00",
        "recruiterAccountName": "vuongvt2",
        "jobDescription": "&lt;p&gt;Vincom Retail - 1 công ty thuộc tập đoàn Vingroup sở hữu, quản lý và vận hành hệ thống Trung Tâm Thương Mại Vincom (TTTM) trên khắp cả nước hiện đang tìm kiếm các vị trí cho Khối Công nghệ Thông tin:&lt;br&gt;\n&lt;br&gt;\n1. Cloud Specialist:&lt;br&gt;\n- Duy trì các ứng dụng thiết yếu và môi trường điện toán đám mây&lt;br&gt;\n- Phân tích nhu cầu của Công ty và lựa chọn công nghệ đám mây phù hợp&lt;br&gt;\n- Thiết kế và cấu hình môi trường đám mây để đảm bảo thời gian hoạt động tối ưu và bảo mật tối đa&lt;br&gt;\n- Quản lý dự án, đưa ra các giải pháp cho các mô hình kinh doanh lớn hơn của Công ty&lt;br&gt;\n- Cung cấp các thiết kế đầu vào, hợp tác với các Phòng ban nội bộ trong Công ty&lt;br&gt;\n- Phân tích điểm yếu và đưa ra cải tiến hệ thống.&lt;br&gt;\n- Hỗ trợ triển khai các quy trình kinh doanh nhanh hơn và thông minh hơn và triển khai các phân tích số liệu&lt;br&gt;\n- Hợp tác với các Đối tác để triển khai các dự án&lt;br&gt;\n&lt;br&gt;\n2. Data analytics:&lt;br&gt;\n- Thiết kế, phát triển và cung cấp dashboard để hỗ trợ các Quản lý và các nhóm kinh doanh hiểu được xu hướng dữ liệu một cách hiệu quả&lt;br&gt;\n- Xây dựng các mô hình dữ liệu được tối ưu hóa để hỗ trợ các yêu cầu của dashboard, tích hợp dữ liệu từ kho dữ liệu doanh nghiệp&lt;br&gt;\n- Hiểu về cốt lõi kinh doanh chính và chuyển thành các yêu cầu về dashboard, số liệu và kích thước&lt;br&gt;\n- Chia sẻ giải pháp và cộng tác với các phân tích rộng hơn, BI và nhóm Công nghệ thông tin nội bộ&lt;br&gt;\n&lt;br&gt;\n3. Business Analyst:&lt;br&gt;\n- Đầu mối giữa Khối Công nghệ thông tin và các Phòng/Ban khác trong Công ty&lt;br&gt;\n- Đóng vai trò chủ đạo trong việc đề xuất các thay đổi và ý tưởng mới&lt;br&gt;\n- Hỗ trợ các vấn đề liên quan đến Công nghệ trong công việc Kinh doanh của Công ty&lt;br&gt;\n- Diễn giải các nhu cầu Kinh doanh sang các giải pháp Công nghệ thông tin&lt;br&gt;\n- Thực hiện kiểm tra hệ thống &amp;amp; và các quy trình.&lt;/p&gt;",
        "jobRequirement": "&lt;p&gt;&lt;br&gt;\n1. Cloud Specialist&lt;br&gt;\n- Cử nhân trở lên các chuyên ngành về Công nghệ hoặc Khoa học Máy tính&lt;br&gt;\n- Có kinh nghiệm hoặc kiến &amp;#8203;&amp;#8203;thức về ngôn ngữ lập trình và hệ điều hành; thiết bị và công nghệ hiện tại, quy trình sao lưu và phục hồi doanh nghiệp, các công cụ giám sát hiệu suất hệ thống, thư mục hoạt động, ảo hóa, lưu lượng HTTP, phân phối nội dung và lưu trữ&lt;br&gt;\n- Có kinh nghiệm trong quản lý dự án, thiết kế và tích hợp ứng dụng và điện toán đám mây (cụ thể là Microsoft Azure)&lt;br&gt;\n- Chuyên môn trong việc tạo, phân tích và sửa chữa các hệ thống phân tán quy mô lớn&lt;br&gt;\n- Kiến thức về Cloud, IoT, Phân tích dữ liệu hoặc An ninh mạng&lt;br&gt;\n&lt;br&gt;\n2. Data analytics&lt;br&gt;\n- Cử nhân trở lên các chuyên ngành về Công nghệ, Khoa học Máy tính, Toán học, Thống kê, Kỹ thuật, Công nghệ Thông tin hoặc Hệ thống Thông tin Quản lý&lt;br&gt;\n- Kinh nghiệm phát triển mô hình dữ liệu và bảng điều khiển&lt;br&gt;\n- Kinh nghiệm thu thập các yêu cầu kinh doanh để báo cáo Needstraffic, phân phối nội dung và lưu trữ&lt;br&gt;\n- Kinh nghiệm với Excel, PowerBI &amp;amp; kết quả trên web với các liên kết trang web Tableau&lt;br&gt;\n&lt;br&gt;\n3. Business Analyst&lt;br&gt;\n- Cử nhân trở lên các chuyên ngành về Công nghệ, Khoa học Máy tính, Toán học, Thống kê, Kỹ thuật, Công nghệ Thông tin hoặc Hệ thống Thông tin Quản lý&lt;br&gt;\n- Kinh nghiệm làm việc với các khách hàng&lt;br&gt;\n- Kinh nghiệm làm việc với các đối tác cung cấp giải pháp kinh doanh&lt;br&gt;\n- Kinh nghiệm với MS Word / Excel / Project / Visio / Sharepoint&lt;/p&gt;",
        "benefit": "&lt;p&gt;&lt;br&gt;\n● Mức lương hấp dẫn&lt;br&gt;\n● Lương tháng 13&lt;br&gt;\n● Phụ cấp ăn trưa&lt;br&gt;\n● Ưu đãi khi sử dụng các dịch vụ của Vingroup: Vinfast, Vinsmart, Vinhomes, Vinschool, Vinmec...&lt;/p&gt;",
        "contactInfo": null,
        "viewAmount": 2,
        "resumeAmount": 4,
        "resumeReadAmount": 12,
        "isAvailable": true,
        "dateCreated": "2020-07-20T15:20:20.025034",
        "dateModified": "0001-01-01T00:00:00",
        "userId": null,
        "positionId": 1,
        "position": {
          "id": 1,
          "name": "Khối Công Nghệ Thông Tin"
        },
        "rankId": 5,
        "rank": {
          "id": 5,
          "name": "Chuyên viên"
        },
        "departmentId": 5,
        "department": {
          "id": 5,
          "name": "Vinpearl Head Office"
        },
        "placeOfWorkId": 5,
        "placeOfWork": {
          "id": 5,
          "name": "Hà Nội, VN"
        }
      },
      {
        "id": 3,
        "sourceName": "MyVinpearl",
        "expireDate": "0001-01-01T00:00:00",
        "recruiterAccountName": "cuongnv",
        "jobDescription": "aaaaaaa",
        "jobRequirement": "aaaaaaa",
        "benefit": "aaaaaaaaaaa",
        "contactInfo": "cuongnv32",
        "viewAmount": 10,
        "resumeAmount": 10,
        "resumeReadAmount": 15,
        "isAvailable": true,
        "dateCreated": "0001-01-01T00:00:00",
        "dateModified": "0001-01-01T00:00:00",
        "userId": null,
        "positionId": 2,
        "position": {
          "id": 2,
          "name": "Chuyên viên Kinh doanh (Leasing) 2"
        },
        "rankId": 1,
        "rank": {
          "id": 1,
          "name": "Business Unit Leaders"
        },
        "departmentId": 1,
        "department": {
          "id": 1,
          "name": "Phòng kinh doanh"
        },
        "placeOfWorkId": 1,
        "placeOfWork": {
          "id": 1,
          "name": "Haiphong, VN"
        }
      },
      {
        "id": 1,
        "sourceName": "MyVinpearl",
        "expireDate": "0001-01-01T00:00:00",
        "recruiterAccountName": "cuongnv",
        "jobDescription": "aaaaaaa",
        "jobRequirement": "aaaaaaa",
        "benefit": "aaaaaaaaaaa",
        "contactInfo": "cuongnv32",
        "viewAmount": 10,
        "resumeAmount": 10,
        "resumeReadAmount": 15,
        "isAvailable": true,
        "dateCreated": "0001-01-01T00:00:00",
        "dateModified": "0001-01-01T00:00:00",
        "userId": null,
        "positionId": 2,
        "position": {
          "id": 2,
          "name": "Chuyên viên Kinh doanh (Leasing) 1"
        },
        "rankId": 1,
        "rank": {
          "id": 1,
          "name": "Business Unit Leaders"
        },
        "departmentId": 1,
        "department": {
          "id": 1,
          "name": "Phòng kinh doanh"
        },
        "placeOfWorkId": 1,
        "placeOfWork": {
          "id": 1,
          "name": "Haiphong, VN"
        }
      }
    ]
    this.setState({jobs: jobs})
  }

  search (position, placeOfWork) {
    this.setState({pageNumber: 1,
      search: {
      position: position,
      placeOfWork: placeOfWork
    }})
  }

  filterByPosition (jobs) {
    return this.state.search.position > 0 ? jobs.filter(job => job.position.id == this.state.search.position) : jobs
  }

  filterByPlaceOfWork (jobs) {
    return this.state.search.placeOfWork > 0 ? jobs.filter(job => job.placeOfWork.id == this.state.search.placeOfWork) : jobs
  }

  onChangePage (index) {
    this.setState({ pageNumber: index})
  }

  render() {
    debugger
    const recordPerPage =  1
    const jobs = this.filterByPlaceOfWork(this.filterByPosition(this.state.jobs))

    return (
      <div className="position-recruiting-section">
        <PositionRecruitingSearch clickSearch={this.search.bind(this)}/>
        <PositionRecruitingTable jobs={TableUtil.updateData(jobs, this.state.pageNumber - 1, recordPerPage)}/>

        <div className="row paging">
            <div className="col-sm"></div>
            <div className="col-sm">
                <CustomPaging pageSize={recordPerPage} onChangePage={this.onChangePage.bind(this)} totalRecords={jobs.length} />
            </div>
            <div className="col-sm text-right">Total: {jobs.length}</div>
          </div>
      </div>
    )
  }
}

export default PositionRecruiting
