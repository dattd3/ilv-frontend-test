import LoadingSpinner from "components/Forms/CustomForm/LoadingSpinner";
import { useState, useEffect } from "react";
import Gallery from "react-photo-gallery";

const ImageGallery = ({ data }) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [photoData, setPhotoData] = useState([]);

  useEffect(() => {
    const processPhotoData = async () => {
      setIsImageLoading(true);
      const _data = await generateGalleryItems(data);
      setPhotoData(_data);
    };
    if (data.length > 0) {
      processPhotoData();
    }
  }, [data]);

  const generateGalleryItems = async (photoData = []) => {
    const tasks = photoData.map((item) => getMeta(item.link));

    const responses = await Promise.allSettled(tasks);
    const results = responses?.filter(item => item.status === "fulfilled" && item.value)?.map((item, index) => ({
      src: photoData[index]?.link,
      width: item.value?.naturalWidth,
      height: item.value?.naturalHeight,
    }));
    setIsImageLoading(false);
    return results;
  };

  return (
    <>
      {isImageLoading && <LoadingSpinner />}

      {photoData.length > 0 && (
        <Gallery
          photos={photoData}
          direction="column"
          columns={photoData.length > 3 ? 3 : 2}
          margin={5}
        />
      )}
    </>
  );
};

const getMeta = async (url) => {
  const img = new Image();
  img.src = url;
  await img.decode();
  return img;
};

export default ImageGallery;
