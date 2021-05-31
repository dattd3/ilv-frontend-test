import React from 'react'
import { withTranslation } from "react-i18next"

class AttachmentComponent extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            files: props.files
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { files } = nextProps
        if (files) {
            return ({
                files: files
            })
        }

        return prevState
    }

    removeFile = index => {
        const files = [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1)]
        this.setState({ files: files })
        this.props.updateFiles(files)
    }

    render() {
        const { files } = this.state

        return <ul className="list-inline">
                    {(files || []).map((file, index) => {
                        return <li className="list-inline-item" key={index}>
                            <span className="file-name">
                                <a title={file.name} href={file.fileUrl} download={file.name} target="_blank">{file.name}</a>
                                {
                                    !this.props.isEdit ?
                                    <i className="fa fa-times remove" aria-hidden="true" onClick={e => this.removeFile(index)}></i> :
                                    null
                                }
                                
                            </span>
                        </li>
                    })}
                </ul>
    }
}

export default withTranslation()(AttachmentComponent)
