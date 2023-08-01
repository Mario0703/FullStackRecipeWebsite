import { useState } from "react";

export function FoodCatalog() {
  const [position, setPosition] = useState(0); // Initial position of the images

  const moveLeft = () => {
    setPosition((prevPosition) => prevPosition - 1);
  };

  const moveRight = () => {
    setPosition((prevPosition) => prevPosition + 1);
  };

  const getTextForPosition = (pos: any) => {
    switch (pos) {
      case 0:
        return "Item 1";
      case 1:
        return "Item 2";
      case 2:
        return "Item 3";
      case 3:
        return "Item 4";
      case 4:
        return "Item 5";
      case 5:
        return "Item 6";
      case 6:
        return "Item 7";
      case 7:
        return "Item 8";
      default:
        return "";
    }
  };

  return (
    <div>
      <p>Browse here!</p>
      <p>What are your favorite cuisines?</p>
      <h3>Some of our favorite foods</h3>
      <h2>Welcome back</h2>
      <button
        className="btn btn-primary"
        style={{ display: "inline-block" }}
        onClick={moveLeft}
      >
        &lt;
      </button>
      <div
        style={{
          display: "inline-block",
          overflowX: "scroll",
          overflow: "hidden",
          width: "500px",
          whiteSpace: "nowrap",
        }}
      >
        <ul style={{ marginLeft: `${position * -100}px` }}>
          {/* Iterate over the items and dynamically set the left margin */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
            <li
              key={item}
              style={{ display: "inline-block", marginLeft: "10px" }}
            >
              {getTextForPosition(item)}
            </li>
          ))}
        </ul>
      </div>
      <button
        className="btn btn-primary"
        style={{ marginBottom: "10px" }}
        onClick={moveRight}
      >
        &gt;
      </button>
    </div>
  );
}
