import { useState, useEffect } from "react"
import axios from 'axios'
import { getRequestConfigurations } from "commons/Utils"
import NewsOnHome from './NewsOnHome'
import HOCComponent from '../../components/Common/HOCComponent'
import BannerModal from "./BannerModal"
 
function Dashboard(props) {
  const [isShow, setIsShow] = useState(true)
  const [banners, setBanners] = useState([])

  useEffect(() => {   
    const fetchListBanners = async () => {
      try {
        const config = getRequestConfigurations()
        const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}evoucher-vinhomes/popup`, config)
        setBanners(response?.data?.data || [])
      } finally {
        // SetIsLoading(false)
      }
    }

    fetchListBanners()
  }, [])

  const onHideModal = () => {
    setIsShow(false)
  }

  return (
    <>
      <BannerModal 
        isShow={isShow} 
        banners={banners}
        onHideModal={onHideModal}
      />
      <div className="home-page">
        <NewsOnHome />
      </div>
    </>
  )
}

export default HOCComponent(Dashboard)
