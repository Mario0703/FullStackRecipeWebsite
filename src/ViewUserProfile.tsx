import axios from "axios";
import { useState, useEffect } from "react";
import { BasicExample } from "./NavBar";
import { Footer } from "./Footer";
interface RecipeArray {
  name: string;
  id: string;
  Recipes: Boolean;
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
    await axios.get("http://localhost:5000/RetriveUserRecipes", {
      withCredentials: true,
    });
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
        if (response.data[0].Recipes) {
          setData(response.data);
          console.log(response);
        }

        if (Object.keys(UserReponse).length > 0) {
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
      <link
        href="./src/ViewProfile.css"
        rel="stylesheet"
        type="text/css"
      ></link>
      <div style={{ display: "flex", marginTop: "40px" }}>
        <div
          className="Content"
          style={{ margin: "auto", width: "400px", textAlign: "center" }}
        >
          <header>
            <h1>This is your profile!</h1>
            <h4>
              {UserData ? <p>Welcome, {UserData[0].name}</p> : <p>Error</p>}
            </h4>
          </header>
          <span>View all your information and your uploaded recipes!</span>

          <section>
            <div>
              {UserData ? (
                <p>
                  <br></br>Assigned Email: {UserData[0].email}
                </p>
              ) : (
                <p>Error</p>
              )}
            </div>
            <div
              style={{
                margin: "auto",
                display: "flex",
                justifyContent: "center",
                marginRight: "60px",
              }}
            >
              {data ? (
                <ul>
                  <p>Submitted Recipes:</p>
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
                      <li
                        style={{
                          display: "inline-block",
                          listStyleType: "none",
                          marginLeft: "30px",
                        }}
                      >
                        {recipe.name}
                      </li>
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
                <p style={{ marginLeft: "60px" }}>No recipes found!</p>
              )}
            </div>
          </section>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}
