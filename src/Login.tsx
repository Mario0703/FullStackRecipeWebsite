import axios from "axios";
import { useState } from "react";
import { BasicExample } from "./NavBar";
export function Loggin() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent form submission
    const formData = new FormData();
    formData.append("Email", email);
    formData.append("Password", password);
    axios
      .post("http://localhost:5000/login", formData, { withCredentials: true })
      .then((response) => console.log(response));
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
        <link rel="stylesheet" type="text/css" href="./src/Login.css"></link>
        <div>
          <header>
            <h1>Login here!</h1>
          </header>
          <form>
            {" "}
            <div className="form-group" style={{ marginTop: "200px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                name="Email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              <br />
              <input
                style={{ marginTop: "20px" }}
                type="password"
                className="form-control"
                placeholder="Password"
                name="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <button onClick={handleLogin} className="cssbuttons-io-button">
                {" "}
                Login in!
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                      fill="currentColor"
                      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                    ></path>
                  </svg>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
