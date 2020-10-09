import React from 'react'

class DetailButtonComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
        }

    }

    approval() {}

    disApproval() {}

    render() {
        return <div className="bottom">
            <div className="clearfix mt-5 mb-5">
                <button type="button" className="btn btn-success float-right ml-3 shadow" onClick={this.approval}>
                    <i className="fas fa-check" aria-hidden="true"></i> Phê duyệt</button>
                <button type="button" className="btn btn-danger float-right shadow" onClick={this.disApproval}><i className="fa fa-close"></i> Không duyệt</button>
            </div>
        </div>
    }
}

export default DetailButtonComponent