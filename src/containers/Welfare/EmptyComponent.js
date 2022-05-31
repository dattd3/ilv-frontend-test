import React from 'react'

function EmptyComponent({title}) {
  return (
    <div>{title || 'Coming soon'}</div>
  )
}

export default EmptyComponent