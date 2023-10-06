import { useState } from "react";
import { Image, Shimmer } from "react-shimmer";

const ImageGallery = ({ data }) => {
  const [indexZoomIn, setIndexZoomIn] = useState(-1);
  const handleZoomInImage = (index) => {
    setIndexZoomIn(index);
  };

  return (
    <div className="image-gallery">
      {indexZoomIn > -1 && (
        <img
          alt=""
          src={data[indexZoomIn].link}
          className="zoomed-in-img"
          onClick={() => handleZoomInImage(-1)}
        />
      )}
      {data.map((img, index) => (
        <Image
          key={img.id}
          src={img.link}
          fallback={
            <Shimmer width={300} height={200} className="shimmer-div" />
          }
          alt=""
          NativeImgProps={{
            onClick: () => handleZoomInImage(index),
            className: "image",
            style: { display: indexZoomIn > -1 ? "none" : "block" }
          }}
        />
      ))}
    </div>
  );
};

export default ImageGallery;
