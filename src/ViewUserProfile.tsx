import axios from "axios";
import { useState, useEffect } from "react";
import { BasicExample } from "./NavBar";
interface RecipeArray {
  name: string;
  id: string;
}

interface Userdata {
  name: string;
  email: string;
}

export function ViewUserProfile() {
  const [data, setData] = useState<RecipeArray[] | null>(null);
  const [UserData, SetUserData] = useState<Userdata[] | null>(null);
  const logIndex = async (index: number) => {
    data
      ? await axios.delete(
          `http://localhost:5000/DeleteRecipe/${data[index].id}`
        )
      : console.log("No ID");
  };
  useEffect(() => {
    const retrieveUserRecipe = async () => {
      try {
        const UserReponse = await axios.get(
          "http://localhost:5000/RetriveUserInformation",
          { withCredentials: true }
        );
        const response = await axios.get(
          "http://localhost:5000/RetriveUserRecipes",
          { withCredentials: true }
        );
        if (Object.keys(response).length) {
          setData(response.data);
        }

        if (Object.keys(UserReponse).length) {
          SetUserData(UserReponse.data);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };
    retrieveUserRecipe();
  }, []);

  return (
    <>
      {" "}
      <BasicExample></BasicExample>
      <div style={{ display: "flex", marginTop: "40px" }}>
        <div
          style={{ margin: "auto", border: "1px solid black", width: "400px" }}
        >
          <header>
            <h1>This is your profile!</h1>
            <h4>
              {UserData ? <p>Welcome, {UserData[0].name}</p> : <p>Errir</p>}
            </h4>
            <span>View all your information and your uploaded recipes!</span>
          </header>
          <section>
            <div>
              {UserData ? (
                <p>
                  <br></br>Assigned Email: {UserData[0].email}
                </p>
              ) : (
                <p>Errir</p>
              )}
            </div>
            <p>Submitted Recipes:</p>
            {data ? (
              <ul>
                {data.map((recipe, index) => (
                  <div
                    style={{
                      width: "200px",
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                    key={index}
                  >
                    <li style={{ display: "inline-block" }}>{recipe.name}</li>
                    <button
                      className="btn btn-danger"
                      onClick={() => logIndex(index)}
                    >
                      Delete Recipe
                    </button>
                  </div>
                ))}
              </ul>
            ) : (
              <p>No recipes found!</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
