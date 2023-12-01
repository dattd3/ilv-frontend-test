import { useEffect, useState } from "react";
import Masonry from "react-responsive-masonry";

const ImageGallery = ({ data }) => {
  const [idZoomIn, setIdZoomIn] = useState(-1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const isZoom = idZoomIn > -1;

  useEffect(() => {
    document
      .getElementById("content-wrapper")
      .addEventListener("scroll", handleScroll, false);
    return () =>
      document
        .getElementById("content-wrapper")
        .removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isZoom) {
      scrollToLastPosition();
    }
  }, [idZoomIn]);

  const handleScroll = () => {
    if (!isZoom) {
      setScrollPosition(document.getElementById("content-wrapper").scrollTop);
    }
  };

  const scrollToLastPosition = () => {
    document.getElementById("content-wrapper").scrollTo({
      left: 0,
      top: lastScrollPosition,
      behavior: "instant",
    });
  };

  const handleZoomInImage = (index) => {
    if (index > 0) setLastScrollPosition(scrollPosition);
    setIdZoomIn(index);
  };

  console.log('----------------------------------------');
  console.log('data: ', data);
  console.log('----------------------------------------');
  return (
    <div
      className="image-gallery"
    >
        <Masonry gutter="4px" columnsCount={isZoom ? 1 : 3}>
          {data.map((img, i) => (
            <div
              key={img?.id || i}
              className="image-item"
              style={isZoom && idZoomIn !== img.id ? {
                display: "none",
              } : {
                display: "block",
                cursor: "zoom-in",
              }}
              onClick={() =>
                handleZoomInImage(idZoomIn === img.id ? -1 : img.id)
              }>
                <img
                  alt=""
                  key={img.id}
                  src={img.link}
                  className={idZoomIn === img.id ? "zoomed-in-img" : "image"}
                />
                {!isZoom && <div className="item-overlay"/>}
                {img?.descriptions && (
                  <div className={`${isZoom ? "item-content-zom" : "item-content"}`}>
                    {img.descriptions}
                  </div>
                )}
            </div>
          ))}
        </Masonry>
    </div>
  );
};

export default ImageGallery;
