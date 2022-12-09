import React from "react"
import NewsOnHome from './NewsOnHome'
import HOCComponent from '../../components/Common/HOCComponent'
 
function Dashboard(props) {
  return (
    <div className="home-page">
      <NewsOnHome />
    </div>
  )
}

export default HOCComponent(Dashboard)
