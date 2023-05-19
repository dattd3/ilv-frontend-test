import React from 'react'

class DocumentComponent extends React.Component {
    render() {
        const documents = this.props.documents
        return (
            <div className="box shadow">
                <ul className="list-inline">
                {
                    (documents || []).map((item, i) => {
                        return (
                            <li className="list-inline-item document-block" key={i}>
                                <a className="document-item" key={i} href={item.fileUrl} target="_blank" title={item.fileName}>
                                    <span>{item.fileName}</span>
                                </a>
                                <span className='size'>{`(${item.fileSize}KB)`}</span>
                            </li>
                        )
                    })
                }
                </ul>
            </div>
        )
    }
}

export default DocumentComponent
