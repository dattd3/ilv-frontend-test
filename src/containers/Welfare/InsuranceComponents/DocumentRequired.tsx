import React from 'react'

const DocumentRequired = ({
    t
}: any) => {
    const link = 'https://hrdx-prod.s3.ap-southeast-1.amazonaws.com/templates/DS-ho-so-bat-buoc-cho-tung-nghiep-vu-OD-TS-DS.docx'
  return (
    <div>
        <h5>{t('DocumentRequired')}</h5>
      <div className="box shadow cbnv">
        {t('DocumentDownload') + ' '} 
        <a href={link} target='_blank'>{t('view_here')}</a>
      </div>
    </div>
  )
}

export default DocumentRequired