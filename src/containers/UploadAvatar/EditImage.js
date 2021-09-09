import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import axios from 'axios'
import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ImgDialog from "./ImgDialog";
import getCroppedImg from "./cropImage";
import ResultModal from '../../containers/Registration/ResultModal'
import Spinner from 'react-bootstrap/Spinner'

const EditImage = (props) => {
  const {t} = useTranslation();
  const [imageSrc, setImageSrc] = useState(props.imageSrc);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isShowStatusModal, setIsShowStatusModal] = useState(false);
  const [resultTitle, setResultTitle] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    setIsLoading(true);
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedImage);
      saveImage(croppedImage.split(',')[1])
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, rotation]);

  const onClose = useCallback(() => {
    setCroppedImage(null);
  }, []);

  const saveImage = (fileBase64) => {
    const config = {
        headers: {
          'Authorization': `${localStorage.getItem('accessToken')}`,
          'Content-Type':'multipart/form-data'
        }
    }

    let bodyFormData = new FormData()
    bodyFormData.append('strBase64', fileBase64)
    
    axios.post(`${process.env.REACT_APP_REQUEST_URL}user/avatar`, bodyFormData, config)
    .then(res => {
        setIsLoading(false)
        if (res && res.data && res.data.data.status == "S") {
          showResultModal(t("Notification"), t("MessageUploadAvatarSuccess"), true);
        } else {
          showResultModal(t("Notification"), res.data.result.message, false);
        }
    }).catch(error => {
      setIsLoading(false)
      showResultModal(t("Notification"), t("AnErrorOccurred"), false);
    })
  }

  const showResultModal = (title, message, isSuccess = false) => {
    setIsShowStatusModal(true);
    setResultTitle(title);
    setResultMessage(message);
    setIsSuccess(isSuccess);
  }

  const hideStatusModal = () => {
    setIsShowStatusModal(false);
      window.location.reload();
  }
  return (
    <div>
      <ResultModal show={isShowStatusModal} title={resultTitle} message={resultMessage} isSuccess={isSuccess} onHide={hideStatusModal} />
      <div className="">
        <Cropper image={imageSrc} crop={crop} rotation={rotation} zoom={zoom} showGrid={false} aspect={1}  cropShape="round"
          onCropChange={setCrop} onRotationChange={setRotation} onCropComplete={onCropComplete} onZoomChange={setZoom} />
      </div>
      <div className="d-flex control-image">
        <div className="slider-container">
          {/* <Typography variant="overline">Phóng to</Typography> */}
          <Slider value={zoom} min={1} max={3} step={0.1} aria-labelledby="Zoom" onChange={(e, zoom) => setZoom(zoom)} />
        </div>
        {/* <div className="slider-container">
          <Typography variant="overline">Xoay</Typography>
          <Slider value={rotation} min={0} max={360} step={1} aria-labelledby="Rotation" onChange={(e, rotation) => setRotation(rotation)} />
        </div> */}
      </div>
      <div className="d-flex justify-content-center mt-2">
        <Button onClick={props.onCancel} variant="contained" color="secondary" style={{marginRight: 10}}>{t('Cancel')}</Button>
        {/* <Button onClick={showCroppedImage} variant="contained" color="primary">Xem trước</Button> */}
        <Button onClick={showCroppedImage} variant="contained" color="primary">
          {
            isLoading ? <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            className="mr-2"
        /> : null
          } {t('SaveAvatar')}
        </Button>
      </div>
      {/* <ImgDialog img={croppedImage} onClose={onClose} /> */}
    </div>
  );
};

export default EditImage;
