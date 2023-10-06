import { Image, Shimmer } from "react-shimmer";

const ImageGallery = ({ data }) => {
  return (
    <div className="image-gallery">
      {data.map((img) => (
        <Image
          key={img.id}
          src={img.link}
          fallback={
            <Shimmer width={300} height={200} className="shimmer-div" />
          }
        />
      ))}
    </div>
  );
};

export default ImageGallery;
