import React from 'react'
import Spinner from 'react-bootstrap/Spinner'
import { withTranslation  } from "react-i18next";
import { validateFileMimeType, validateTotalFileSize } from '../../utils/file'
import IconSend from 'assets/img/icon/Icon_send.svg'
import IconUpload from 'assets/img/icon/ic_upload_attachment.svg'

class ButtonComponent extends React.Component {
    constructor(props) {
        super();
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

    fileUploadAction() {
        this.setState({ files: this.props.files })
        this.inputReference.current.value = null
        this.inputReference.current.click()
    }

    fileUploadInputChange(e) {
        const files = Object.keys(this.inputReference.current.files).map((key) => this.inputReference.current.files[key])
        if (validateFileMimeType(e, files, this.props.t)) {
            const updateFiles = this.state.files.concat(files)
            if (validateTotalFileSize(e, updateFiles, this.props.t)) {
              this.setState({ files: updateFiles })
              this.props.updateFiles(updateFiles)
              this.props.isUpdateFiles(true)
            }
        }
    }

    submit() {
        this.props.submit()
    }

    render() {
        const { t, validating, disabledSubmitButton } = this.props;

        return <div className="bottom button-region">
            <div className="clearfix">
                <button type="button" className="btn btn-primary float-right ml-3" onClick={this.submit.bind(this)} disabled={disabledSubmitButton || validating}>
                    {
                        !disabledSubmitButton ? (
                            <img src={IconSend} alt="Send" className='ic-send' />
                        )
                        :
                        !validating && (
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="mr-2"
                            />
                        )
                    }
                    {t('Send')}
                </button>
                {
                    !this.props.isEdit ?
                    <>
                        <input type="file" hidden ref={this.inputReference} id="file-upload" name="file-upload[]" onChange={this.fileUploadInputChange.bind(this)} multiple accept=".docx, .doc, .pdf, .xls, .xlsx, .png, .jpg, .jpeg" />
                        <button type="button" className="btn btn-light float-right btn-attachment" onClick={this.fileUploadAction.bind(this)}>
                            <img src={IconUpload} alt="Upload" className='ic-attachment' /> {t('AttachmentFile')}</button>
                    </> : null
                }
               
            </div>
        </div>
    }
}

export default withTranslation()(ButtonComponent)