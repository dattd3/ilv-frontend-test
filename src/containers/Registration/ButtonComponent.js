import React from 'react'

class ButtonComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
        }

        this.inputReference = React.createRef()
    }

    render () {
      return <div className="clearfix mt-5 mb-5">
            <button type="button" className="btn btn-primary float-right ml-3 shadow" ><i className="fa fa-paper-plane" aria-hidden="true"></i>  Gửi yêu cầu</button>
            <input type="file" hidden ref={this.inputReference} id="file-upload" name="file-upload[]" multiple/>
            <button type="button" className="btn btn-light float-right shadow"><i className="fas fa-paperclip"></i> Đính kèm tệp tin</button>
        </div>
    }
}

export default ButtonComponent