import { MainLandingPage } from "../src/MainPage";
import "bootstrap/dist/css/bootstrap.css";
import { Route, Routes } from "react-router-dom";
import { ViewRecipe } from "./recipe1";
import { RecipeUpload } from "./UploadRecepe";
import { SignupForm } from "./Signup";
import { Loggin } from "./Login";
import { ViewUserProfile } from "./ViewUserProfile";
function App() {
  return (
    <>
      <Routes>
        <Route path="/recipe1" element={<ViewRecipe></ViewRecipe>}></Route>
        <Route path="/" element={<MainLandingPage></MainLandingPage>}></Route>
        <Route path="/Upload" element={<RecipeUpload></RecipeUpload>}></Route>
        <Route path="/Sign-Up" element={<SignupForm></SignupForm>}></Route>
        <Route path="/Login" element={<Loggin></Loggin>}></Route>
        <Route path="/Profile" element={<ViewUserProfile></ViewUserProfile>}></Route>
        <Route
          path="/recipe1/:recipeId"
          element={<ViewRecipe></ViewRecipe>}
        ></Route>
        <Route path="*" element={<MainLandingPage />} />
      </Routes>
    </>
  );
}

export default App;
