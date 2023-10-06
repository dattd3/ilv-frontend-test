import { useState } from "react";

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
      {data.map(
        (img, index) => (
          <img
            style={{ display: indexZoomIn > -1 ? "none" : "block" }}
            key={img.id}
            src={img.link}
            alt=""
            onClick={() => handleZoomInImage(index)}
            className="image"
          />
        )
      )}
    </div>
  );
};

export default ImageGallery;
