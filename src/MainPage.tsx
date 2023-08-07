import "bootstrap/dist/css/bootstrap.css";
import { FoodCatalog } from "./RecipeCatolog";
import { FoodRecipies } from "./Recipe";
import { Footer } from "./Footer";
import { BasicExample } from "./NavBar";
import "./LandningPage.css";
import axios from "axios";
import { useState, useEffect } from "react";


const Search = () => {
  return (
    <div>
      <input
        placeholder="Search for a Recipe here!"
        className="form-control"
        style={{ width: "500px", display: "inline-block" }}
      ></input>
      <button className="btn btn-primary">Search!</button>
    </div>
  );
};

interface Search {}

export function MainLandingPage() {
  const [name, SetUsername] = useState("");

 

  const LogoutTemp = async () => {
    try {
      await axios.get("http://localhost:5000/logout", {
        withCredentials: true,
      });
    } catch (error) {
      // Handle errors here
      console.log("Error fetching login status:");
    }
    LogoutTemp();
  };

  useEffect(() => {
    const fetchLoginStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/check_login", {
          withCredentials: true,
        });
        SetUsername(response.data);
        console.log(response.data);
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
        <div>{name}</div>
        <Search></Search>
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
