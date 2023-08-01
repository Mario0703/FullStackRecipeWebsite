import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface Recipe {
  ID: number;
  name: string;
  ImagePath: string;
  First_name: string;
  Desription: string;
}

export function FoodRecipies() {
  const navigate = useNavigate(); // Hook for programmatically navigating to a new route
  const [data, SetData] = useState<[Recipe]>(); // Explicitly define the type as an array of 'Recipe'
  const handleRecipeClick = () => {
    navigate("/recipe1"); // Navigates to "/recipe1" route when recipe is clicked
  };

  function removeFilePathPrefix(filePath: string) {
    const regex = /SavedRecipe Images\\(.*)/;
    const match = filePath.match(regex);
    return match ? match[1] : filePath;
  }

  useEffect(() => {
    axios.get("http://localhost:5000/GetRecipeData").then((response) => {
      SetData(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <>
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "800px",
          paddingTop: "50px",
        }}
      >
        {data &&
          data.map((OBJ) => (
            <Link
              key={OBJ.ID}
              style={{ color: "inherit", textDecoration: "none" }}
              to={`/recipe1/${OBJ.ID}`}
              onClick={handleRecipeClick}
            >
              <div style={{ marginRight: "50px", marginBottom: "25px" }}>
                <img
                  alt="Image of food"
                  src={`/SavedRecipe Images/${removeFilePathPrefix(
                    OBJ.ImagePath
                  )}`}
                  width={"130px"}
                  height={"130px"}
                ></img>
                <div>Recipe uploaded by {OBJ.name}</div>
                <span>{OBJ.First_name}</span>
                <div>Reviews</div>
              </div>
            </Link>
          ))}
      </section>
    </>
  );
}
