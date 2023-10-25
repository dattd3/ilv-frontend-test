import { useEffect, useState } from "react";
import Masonry from "react-responsive-masonry";

const ImageGallery = ({ data }) => {
  const [idZoomIn, setIdZoomIn] = useState(-1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

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
    if (idZoomIn === -1) {
      scrollToLastPosition();
    }
  }, [idZoomIn]);

  const handleScroll = () => {
    if (idZoomIn === -1) {
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

  return (
    <div
      className="image-gallery"
    >
        <Masonry gutter="4px" columnsCount={idZoomIn > -1 ? 1 : 3}>
          {data.map((img) => (
            <img
              style={{
                display:
                  idZoomIn > -1 && idZoomIn !== img.id ? "none" : "block",
              }}
              key={img.id}
              src={img.link}
              alt=""
              onClick={() =>
                handleZoomInImage(idZoomIn === img.id ? -1 : img.id)
              }
              className={idZoomIn === img.id ? "zoomed-in-img" : "image"}
            />
          ))}
        </Masonry>
    </div>
  );
};

export default ImageGallery;
