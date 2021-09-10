import React, { useState, useCallback } from "react";
import axios from 'axios'
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";
import Remove from "../../assets/img/icon/remove.svg";
import Upload from "../../assets/img/icon/upload.svg";
import EditImage from "./EditImage";
import ConfirmModal from "../../components/Common/ConfirmModal"
import AVATAR_DEFAULT from "../../assets/img/avatar_default.svg"

const UploadAvatar = (props) => {
    const {t} = useTranslation();
    const [imageSrc, setImageSrc] = useState(null);
    const [fileErr, setFileErr] = useState('');
    const [isShowConfirm, setIsShowConfirm] = useState(false);

    const onFileChange = async (e) => {
        let fileErr = null
        if (e.target.files && e.target.files.length > 0) {
         
            const file = e.target.files[0];
            let allowedExtensions = /(\.png|\.jpg)$/i;
            if (!allowedExtensions.exec(e.target.value)) {
                fileErr = "File không đúng định dạng yêu cầu"
            } else {
                fileErr = null;
                let imageDataUrl = await readFile(file);
                setImageSrc(imageDataUrl);
            }
        }
        setFileErr(fileErr);
    };

    const cancelChangeImg = useCallback(() => {
        setImageSrc(null);
    },[])

    const openConfirmRemoveAvatar = () => {
        setIsShowConfirm(true)
    }
    const saveDefaultAvatar = async () => {
        const config = {
            headers: {
              'Authorization': `${localStorage.getItem('accessToken')}`,
              'Content-Type':'multipart/form-data'
            }
        }
        
        let bodyFormData = new FormData()
        bodyFormData.append('fileAvatar', AVATAR_DEFAULT)
        // axios.post(`${process.env.REACT_APP_REQUEST_URL}user/avatar`, bodyFormData, config)
        // .then(res => {
        //     // setIsLoading(false)
        //     if (res && res.data && res.data.data.status == "S") {
        //     //   console.log(res.data.data.status);
        //     //   showResultModal("Thông báo", "Ảnh đại diện đã được tải lên thành công. Vui lòng chờ khoảng 1 ngày để hệ thống đồng bộ", true);
        //     } else if(res && res.data && res.data.data.error == 'Invalid token.') {
        //     } else {
        //     //   console.log(res.data.data.status);
        //     //   showResultModal("Thông báo", res.data.result.message, false);
        //     }
        // }).catch(error => {
        // //   setIsLoading(false)
        // //   showResultModal("Thông báo", "Có lỗi xảy ra. Vui lòng thử lại", false);
        // })
    }

    const cancelConfirm = () => {
        setIsShowConfirm(false)
    }
    return (
        <> 
         {/* <ConfirmModal
                show={isShowConfirm} 
                onHide={cancelConfirm} 
                onAcceptClick = {saveDefaultAvatar}
                onCancelClick = {cancelConfirm}
                confirmHeader = "XÁC NHẬN XÓA ẢNH ĐẠI DIỆN"
                confirmContent = {"Bạn có đồng ý xóa ảnh đại diện này"}
            /> */}
        <Modal size="lg" className="info-modal-common" centered show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body className="modal-boby-upload">
                <div>
                    {imageSrc ? (
                       <EditImage imageSrc={imageSrc} onCancel={cancelChangeImg} {...props} />
                    ) : (
                        <div className="text-center">
                            <h3 className="title-popup mb-5">{t('ChangeAvatar')}</h3>
                            {
                                (localStorage.getItem('avatar') != null && localStorage.getItem('avatar') !== '' && localStorage.getItem('avatar') !== 'null') ?
                                    <img className="ml-2 avatar-op1 rounded-circle" src={`data:image/png;base64, ${localStorage.getItem('avatar')}`} alt={localStorage.getItem('fullName')} />
                                    :
                                    <img className="ml-2 avatar-op1 rounded-circle" src={AVATAR_DEFAULT} />
                            }
                            <h3 className="title-popup mt-4">{localStorage.getItem('fullName')}</h3>
                            <span className="subtitle-popup">{(localStorage.getItem('jobTitle') != null && localStorage.getItem('jobTitle') !== '' && localStorage.getItem('jobTitle') !== 'null') ? localStorage.getItem('jobTitle') : ''}</span>
                            <br/>
                            <span className="text-danger">{fileErr}</span>
                            <div className="d-flex action-upload-popup justify-content-between mt-5">
                                <label className="d-flex custom-btn-op1 bg-grey-mix mr-3  align-items-center justify-content-center">
                                    <input type="file" onChange={onFileChange} accept="image/*" style={{ display: "none" }}/>
                                    <img src={Upload} className="mr-2" alt="excel-icon" />{t('UploadAvatar')}
                                </label>
                                <div className="vertical-line-40"></div>
                                <button type="button" className="d-flex custom-btn-op1 bg-grey-mix mr-3 align-items-center justify-content-center" 
                                    disabled={localStorage.getItem('avatar') == null || localStorage.getItem('avatar') == '' || localStorage.getItem('avatar') == 'null'}
                                    onClick={openConfirmRemoveAvatar}
                                >
                                    <img src={Remove} className="mr-2" alt="excel-icon" /> {t('RemoveAvatar')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal.Body>
        </Modal>
        </>
    );
};

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result), false);
        reader.readAsDataURL(file);
    });
}

export default UploadAvatar;
