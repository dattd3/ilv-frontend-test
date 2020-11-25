import React from "react"
import IconSuccess from '../../assets/img/ic-success.svg'
import IconFailed from '../../assets/img/ic-failed.svg'
import { Modal, Image, Form, Button } from 'react-bootstrap'
import HistoryTable from './HistoryTable'
import CustomPaging from '../../components/Common/CustomPaging'
import TableUtil from '../../components/Common/table'

class HistoryModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
          questions: [],
          search: {
            position: '',
            placeOfWork: 0
          },
          pageNumber: 1
        }
    }

    componentDidMount(){
    }

    onChangePage (index) {
    this.setState({ pageNumber: index})
    }

    render () {
        const recordPerPage =  5
        const questions = [{"status": "Assigned"}, {"status": "Cancelled"}, {"status": "Assigned"}, {"status": "Cancelled"}, {"status": "Assigned"} ,{"status": "Assigned"}, {"status": "Assigned"}]
        return (
            <Modal size="xl" className='info-modal-common position-apply-modal' centered show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>LỊCH SỬ GIẢI ĐÁP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <HistoryTable questions={TableUtil.updateData(questions, this.state.pageNumber - 1, recordPerPage)} />
                
                <div className="row paging">                                                       
                    <div className="col-sm content-center">
                    <CustomPaging pageSize={recordPerPage} onChangePage={this.onChangePage.bind(this)} totalRecords={questions.length} />
                    </div>  
                </div>  
                </Modal.Body>
            </Modal>
        )
    }
}

export default HistoryModal
