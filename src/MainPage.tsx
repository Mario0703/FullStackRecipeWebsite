import "bootstrap/dist/css/bootstrap.css";
import { FoodCatalog } from "./RecipeCatolog";
import { FoodRecipies } from "./Recipe";
import { Footer } from "./Footer";
import { BasicExample } from "./NavBar";
import "./LandningPage.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Filter {
  FilterRecipes: () => void;
}

const Search = (props: Filter) => {
  return (
    <div>
      <input
        placeholder="Search for a Recipe here!"
        className="form-control"
        style={{ width: "500px", display: "inline-block" }}
        onChange={props.FilterRecipes}
      ></input>
      <button className="btn btn-primary">Search!</button>
    </div>
  );
};

interface Search {}

export function MainLandingPage() {
  const [name, SetUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [filteredData, setfiltered] = useState();

  const FilterRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/GetRecipeData");
      const filteredData = response.data;
      setfiltered(filteredData);
      console.log(filteredData[0].name);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const LogoutTemp = async () => {
    setLoggedIn(false);
    try {
      await axios.get("http://localhost:5000/logout", {
        withCredentials: true,
      });
      setLoggedIn(false);
    } catch (error) {
      // Handle errors here
      console.log("Error fetching login status:");
    }
  };

  useEffect(() => {
    const fetchLoginStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/check_login", {
          withCredentials: true,
        });
        SetUsername(response.data);
        setLoggedIn(true);
      } catch (error) {
        // Handle errors here
        console.log("Error fetching login status:");
      }
    };
    fetchLoginStatus();
  }, []);
  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        href="./src/UploadStyle.css"
      ></link>
      <header
        style={{
          textAlign: "center",
          backgroundColor: "#CECE5A",
          height: "120px",
        }}
      >
        <h1>Yummy!</h1>
        {loggedIn ? (
          <div>
            <span>Welcome, {name}</span>
            <span onClick={LogoutTemp} style={{ marginLeft: "100px" }}>
              Click me to logout
            </span>
          </div>
        ) : (
          <div>
            You are not logged in, go to login to login, or signup to create new
            acount
          </div>
        )}
        <Search FilterRecipes={FilterRecipes}></Search>
      </header>
      <BasicExample></BasicExample>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          margin: "auto",
          marginTop: "50px",
          borderRadius: "10px",
          opacity: "0.8",
          width: "1000px",
        }}
      >
        <div style={{ textAlign: "center", height: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <FoodCatalog></FoodCatalog>
            <FoodRecipies></FoodRecipies>
          </div>
        </div>
        <div></div>={" "}
      </div>
      <Footer></Footer>
    </>
  );
}
