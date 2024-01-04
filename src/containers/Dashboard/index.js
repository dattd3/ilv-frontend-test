import { useState, useEffect } from "react"
import axios from 'axios'
import { useGuardStore } from 'modules'
import { getRequestConfigurations } from "commons/Utils"
import NewsOnHome from './NewsOnHome'
import HOCComponent from '../../components/Common/HOCComponent'
import BannerModal from "./BannerModal"
 
function Dashboard(props) {
  const guard = useGuardStore();
  const user = guard.getCurentUser();

  const [isShow, setIsShow] = useState(false)
  const [banners, setBanners] = useState([])

  useEffect(() => {   
    const fetchListBanners = async () => {
      try {
        const config = getRequestConfigurations()
        config.params = {
          pnl: user?.organizationLv2,
          rank: user?.employeeLevel,
          workingPlace: user?.streetName,
        }

        const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}evoucher-vinhomes/popup`, config)
        setBanners(response?.data?.data || [])
        setIsShow(response?.data?.data?.length > 0)
      } finally {

      }
    }

    fetchListBanners()
  }, [])

  const onHideModal = () => {
    const config = getRequestConfigurations()
    axios.post(`${process.env.REACT_APP_REQUEST_URL}evoucher-vinhomes/ignore-popup`, null, config).then(response => {
      // setIsShow(false)
    })
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
