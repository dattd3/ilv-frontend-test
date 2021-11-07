import React from "react"
import { Row, Col } from 'react-bootstrap'
import NewsOnHome from './NewsOnHome'
 
function Dashboard(props) {
  return (
    <div className="home-page">
      <NewsOnHome />
    </div>
  )
}

export default Dashboard
