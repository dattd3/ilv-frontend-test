import React from 'react'

class ButtonComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            files: []
        }

        this.inputReference = React.createRef()
    }

    fileUploadAction() {
        this.inputReference.current.click()
    }

    fileUploadInputChange() {
        const files = Object.keys(this.inputReference.current.files).map((key) => this.inputReference.current.files[key])
        const updateFiles = this.state.files.concat(files)
        this.setState({ files: updateFiles })
        this.props.updateFiles(updateFiles)
    }

    removeFile(index) {
        this.setState({ files: [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1)] })
    }

    submit () {
        this.props.submit()
    }

    render() {
        return <div className="bottom">
        <ul className="list-inline">
            {this.state.files.map((file, index) => {
                return <li className="list-inline-item" key={index}>
                    <span className="file-name">{file.name} <i className="fa fa-times remove" aria-hidden="true" onClick={this.removeFile.bind(this, index)}></i></span>
                </li>
            })}
        </ul>
        <div className="clearfix mt-5 mb-5">
            <button type="button" className="btn btn-primary float-right ml-3 shadow" onClick={this.submit.bind(this)}><i className="fa fa-paper-plane" aria-hidden="true"></i>  Gửi yêu cầu</button>
            <input type="file" hidden ref={this.inputReference} id="file-upload" name="file-upload[]" onChange={this.fileUploadInputChange.bind(this)} multiple />
            <button type="button" className="btn btn-light float-right shadow" onClick={this.fileUploadAction.bind(this)}><i className="fas fa-paperclip"></i> Đính kèm tệp tin</button>
        </div>
        </div>
    }
}

export default ButtonComponent