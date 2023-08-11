import { useState } from "react";

interface SocialMediaIcon {
  ImageDescreption: string;
  ImageSourceHover: string;
  ImageSourceNoHover: string;
}

const Icon = (props: SocialMediaIcon) => {
  const { ImageDescreption, ImageSourceHover, ImageSourceNoHover } = props;

  const [imageSrc, setImageSrc] = useState(ImageSourceNoHover);

  const setHoverIcon = () => {
    setImageSrc(ImageSourceHover);
  };

  const setFalseHoverIcon = () => {
    setImageSrc(ImageSourceNoHover);
  };

  return (
    <img
      width={"50px"}
      onMouseEnter={setHoverIcon}
      onMouseLeave={setFalseHoverIcon}
      alt={ImageDescreption}
      src={imageSrc}
      style={{ marginLeft: "20px" }}
    />
  );
};

export function Footer() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <footer
        style={{
          bottom: "10px",
          width: "100%",
          display: "flex",
          position: "absolute",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#FFE17B",
          borderTop: "2px solid black",
        }}
      >
        <div>
          <Icon
            ImageDescreption="Instagram Icon"
            ImageSourceHover="/src/Images/SocialMedia icons/HoverState/instagram (1).png"
            ImageSourceNoHover="/src/Images/SocialMedia icons/instagram.png"
          />
          <Icon
            ImageDescreption="Facebook Icon"
            ImageSourceHover="/src/Images/SocialMedia icons/HoverState/facebook (1).png"
            ImageSourceNoHover="/src/Images/SocialMedia icons/facebook.png"
          />
          <Icon
            ImageDescreption="Twitter Icon"
            ImageSourceHover="/src/Images/SocialMedia icons/HoverState/twitter.png"
            ImageSourceNoHover="/src/Images/SocialMedia icons/twitter-sign.png"
          />
          <Icon
            ImageDescreption="Youtube Icon"
            ImageSourceHover="/src/Images/SocialMedia icons/HoverState/youtube (1).png"
            ImageSourceNoHover="/src/Images/SocialMedia icons/youtube.png"
          />
        </div>
        <div>
          <div>
            <p>FoodShareHub</p>
            <p>New York City, USA</p>
          </div>
          <div>
            <p>Email: info@foodsharehub.com</p>
            <p>Phone: +1 123-456-7890</p>
          </div>
        </div>
        <div>
          <p>&copy; 2023 FoodShareHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
