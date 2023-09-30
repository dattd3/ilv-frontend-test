import React from 'react'

const DocumentRequired = ({
    t,
    url
}: any) => {
    if(!url) return null;
    url = url.trim();
    const link = `https://view.officeapps.live.com/op/view.aspx?src=${url}`
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