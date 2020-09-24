import React from 'react'

class DocumentComponent extends React.Component {
    render() {
        const documents = this.props.documents
        return (
            <div className="document-block">
            {
                (documents || []).map((item, i) => {
                    return <a className="col-4 document-item" key={i} href={item.fileUrl} target="_blank" title={item.fileName}>
                        <span>{item.fileName} {`(${item.fileSize} KB)`}</span>
                    </a>
                })
            }
            </div>
        )
    }
}

export default DocumentComponent
