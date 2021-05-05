import React from 'react'
import Spinner from 'react-bootstrap/Spinner'
import { withTranslation  } from "react-i18next";

class ButtonComponent extends React.PureComponent {
    constructor(props) {
        super()
        this.state = {
            files: []
        }

        this.inputReference = React.createRef()
    }

    componentDidMount() {
        if (this.props.files) {
            this.setState({ files: this.props.files })
        }
    }

    fileUploadAction = () => {
        this.setState({ files: this.props.files })
        this.inputReference.current.value = null
        this.inputReference.current.click()
    }

    fileUploadInputChange = () => {
        const files = Object.keys(this.inputReference.current.files).map((key) => this.inputReference.current.files[key])
        const updateFiles = this.state.files.concat(files)

        this.setState({ files: updateFiles })
        this.props.updateFiles(updateFiles)
        this.props.isUpdateFiles(true)
    }

    submit = () => {
        this.props.submit()
    }

    render() {
        const {t} = this.props

        return <div className="bottom">
            <div className="clearfix mt-5 mb-5">
                <button type="button" className="btn btn-primary float-right ml-3 shadow" onClick={this.submit} disabled={this.props.disabledSubmitButton}>
                    {
                        !this.props.disabledSubmitButton ?
                        <i className="fa fa-paper-plane mr-2" aria-hidden="true"></i>
                        :
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mr-2"
                        />
                    }
                    {t('Send')}
                </button>
                {
                    !this.props.isEdit ?
                    <>
                        <input type="file" hidden ref={this.inputReference} id="file-upload" name="file-upload[]" onChange={this.fileUploadInputChange} multiple />
                        <button type="button" className="btn btn-light float-right shadow" onClick={this.fileUploadAction}><i className="fas fa-paperclip"></i> {t('AttachmentFile')}</button>
                    </> : null
                }
            </div>
        </div>
    }
}

export default withTranslation()(ButtonComponent)
