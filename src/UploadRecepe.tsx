import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { BasicExample } from "./NavBar";
uuidv4();
export function RecipeUpload() {
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [Decription, setDecription] = useState("");
  const [First_name, setFirst_name] = useState("");
  const [file, SetFile] = useState();

  const GetFile = (e: any) => {
    const file = e.target.files[0];
    SetFile(file);
    console.log(file);
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;

    switch (name) {
      case "recipeName":
        setRecipeName(value);
        break;
      case "ingredients":
        setIngredients(value);
        break;
      case "Decription":
        setDecription(value);
        break;
      case "First-name":
        setFirst_name(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const RecipeID = uuidv4();
    console.log(RecipeID);
    const formData = new FormData();
    formData.append("recipeName", recipeName);
    formData.append("ingredientList", Decription);
    formData.append("Decription", ingredients);
    formData.append("First-name", First_name);
    if (file) {
      formData.append("file", file);
    }
    formData.append("RecipeID", RecipeID);

    axios
      .post("http://localhost:5000/SubmitRecipe", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type to 'multipart/form-data'
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <BasicExample></BasicExample>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <link
          rel="stylesheet"
          type="text/css"
          href="./src/UploadStyle.css"
        ></link>
        <div className="Parrent-Div" style={{ textAlign: "center" }}>
          <h1>Submit your recipe via the form!</h1>
          <div>
            <form
              className="Form-group"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div>
                <label>
                  <input
                    className="form-control INPUT"
                    type="text"
                    name="recipeName"
                    value={recipeName}
                    onChange={handleInputChange}
                    placeholder="Recipe Name"
                  />
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="text"
                    name="ingredients"
                    className="form-control INPUT"
                    value={ingredients}
                    onChange={handleInputChange}
                    placeholder="Your Ingredients"
                  ></input>
                </label>{" "}
              </div>
              <div>
                <label>
                  <input
                    type="text"
                    name="Decription"
                    className="form-control INPUT"
                    value={Decription}
                    onChange={handleInputChange}
                    placeholder="About your recipe"
                  ></input>
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="text"
                    name="First-name"
                    className="form-control INPUT"
                    value={First_name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                  ></input>
                </label>
              </div>
              <div
                style={{ width: "300px", margin: "auto" }}
                className="mb-3 INPUT"
              >
                <label className="form-label">Upload File</label>
                <input
                  name="file"
                  onChange={GetFile}
                  className="form-control"
                  type="file"
                  id="formFile"
                ></input>
              </div>

              <div>
                <button className="BTN" type="submit">
                  Submit Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
