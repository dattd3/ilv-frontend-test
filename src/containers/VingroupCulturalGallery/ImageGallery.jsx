import { useEffect, useState } from "react";

const ImageGallery = ({ data }) => {
  const [idZoomIn, setIdZoomIn] = useState(-1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  useEffect(() => {
    document.getElementById("content-wrapper").addEventListener("scroll", handleScroll, false);
    return () => document.getElementById("content-wrapper").removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    if (idZoomIn === -1) {
      setScrollPosition(document.getElementById("content-wrapper").scrollTop);
    }
  };

  useEffect(() => {
    if (idZoomIn === -1) {
      scrollToLastPosition();
    }
  }, [idZoomIn]);

  const scrollToLastPosition = () => {
    document.getElementById("content-wrapper").scrollTo({
      left: 0,
      top: lastScrollPosition,
      behavior: "instant"
    });
  };

  const handleZoomInImage = (index) => {
    if (index > 0) setLastScrollPosition(scrollPosition);
    setIdZoomIn(index);
  };

  const length = data.length,
    countItem = Math.floor(data.length / 3);
  let col1 = [],
    col2 = [],
    col3 = [];

  switch (length % 3) {
    case 1:
      col1 = data.slice(0, countItem + 1);
      col2 = data.slice(countItem + 1, countItem * 2);
      col3 = countItem >= 3 ? data.slice(countItem * 2, length) : [];
      break;
    case 2:
      col1 = data.slice(0, countItem + 1);
      col2 = data.slice(countItem + 1, countItem * 2 + 1);
      col3 = data.slice(countItem * 2 + 1, length);
      break;
    case 0:
    default:
      col1 = data.slice(0, countItem);
      col2 = countItem >= 3 ? data.slice(countItem, countItem * 2) : [];
      col3 = countItem >= 3 ? data.slice(countItem * 2, length) : [];
      break;
  }

  return (
    <div className="image-gallery" style={idZoomIn > -1 ? { display: "flex", justifyContent: "center" } : {}}>
      <div className="col-image">
        {col1.map(
          (img) => (
            <img
              style={{ display: (idZoomIn > -1 && idZoomIn !== img.id) ? "none" : "block" }}
              key={img.id}
              src={img.link}
              alt=""
              onClick={() => handleZoomInImage(idZoomIn === img.id ? - 1 : img.id)}
              className={(idZoomIn === img.id) ? "zoomed-in-img" : "image"}
            />
          )
        )}
      </div>
      <div className="col-image">
        {col2.map(
          (img) => (
            <img
              style={{ display: (idZoomIn > -1 && idZoomIn !== img.id) ? "none" : "block" }}
              key={img.id}
              src={img.link}
              alt=""
              onClick={() => handleZoomInImage(idZoomIn === img.id ? - 1 : img.id)}
              className={(idZoomIn === img.id) ? "zoomed-in-img" : "image"}
            />
          )
        )}
      </div>
      <div className="col-image">
        {col3.map(
          (img) => (
            <img
              style={{ display: (idZoomIn > -1 && idZoomIn !== img.id) ? "none" : "block" }}
              key={img.id}
              src={img.link}
              alt=""
              onClick={() => handleZoomInImage(idZoomIn === img.id ? - 1 : img.id)}
              className={(idZoomIn === img.id) ? "zoomed-in-img" : "image"}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
