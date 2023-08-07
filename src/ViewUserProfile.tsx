import axios from "axios";
import { useState, useEffect } from "react";

interface Recipe {
  name: string;
}

export function ViewUserProfile() {
    const [data, setData] = useState<Recipe[] | null>(null);
    const [UserData, SetUserData] = useState([{}]);

  useEffect(() => {
    const retrieveUserRecipe = async () => {
      try {
        const UserReponse = await axios.get("http://localhost:5000/RetriveUserInformation", { withCredentials: true })
        const response = await axios.get("http://localhost:5000/RetriveUserRecipes", { withCredentials: true });
        if (response.data) {
          setData(response.data);
        }
        console.log(UserReponse)

        if(UserReponse.data){
            SetUserData(UserReponse.data)

        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };
    retrieveUserRecipe();
  }, []);

  return (
    <div>
      <header>
        <h1>This is your profile!</h1>
        <span>View all your information and your uploaded recipes!</span>
        <p>Down below is the is listen of the rcipes you have submitteta</p>
        {data ? (
          <ul>
            {data.map((recipe, index) => (
              <li key={index}>{recipe.name}</li>
            ))}
          </ul>
        ) : (
          <p>No recipes found!</p>
        )}
      </header>
      <section>
      </section>
    </div>
  );
}
