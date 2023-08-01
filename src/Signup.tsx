import React, { useState, useRef } from "react";
import { BasicExample } from "./NavBar";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface progressProps {
  circleRef: React.RefObject<HTMLSpanElement>[];
}

const ShorProgress = (props: progressProps) => {
  return (
    <div
      className="progressBar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        backgroundColor: "#dcdcdc",
        top: "2px",
        borderRadius: "7px",
        height: "4px",
        marginBottom: "40px",
      }}
    >
      {props.circleRef.map((circle, index) => (
        <span
          className="Progress-step"
          key={index}
          ref={circle}
          style={{
            width: "25px",
            height: "25px",
            backgroundColor: index === 0 ? "#800080" : "#dcdcdc",
            borderRadius: "50%",
            textAlign: "center",
            color: "#fff",
          }}
        >
          1
        </span>
      ))}
    </div>
  );
};

interface SignUpProps {
  SignupState: string;
  SetSignupState: (state: string) => void;
  circleRef: React.RefObject<HTMLSpanElement>[];
}

const SignUpProgress: React.FC<SignUpProps> = ({
  SignupState,
  SetSignupState,
  circleRef,
}) => {
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, SetPassword] = useState("");
  const UserID = uuidv4();
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("User_ID", UserID);

  const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent form submission
    SetSignupState("email");
    console.log(name);
    if (circleRef[1].current) {
      circleRef[1].current.style.backgroundColor = "#800080";
    }
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    console.log(value);
    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setemail(value);
        break;
      case "password":
        SetPassword(value);
        break;
      default:
        break;
    }
  };

  const handlStatetoPass = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent form submission
    SetSignupState("password");
    if (circleRef[2].current) {
      circleRef[2].current.style.backgroundColor = "#800080";
    }
  };
  const OntoSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent form submission
    SetSignupState("Submit");
    if (circleRef[3].current) {
      circleRef[3].current.style.backgroundColor = "#800080";
    }
  };

  const SubmitForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent form submission
    console.log(name, password, email);
    axios
      .post("http://localhost:5000/CreateUser", {
        name: name,
        email: email,
        password: password,
        User_ID: UserID,
      })
      .then((response) => console.log(response));
  };

  switch (SignupState) {
    case "name":
      return (
        <div style={{ textAlign: "center" }}>
          <label>
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder="Your name"
              onChange={handleInputChange}
            />
          </label>{" "}
          <button className="btn btn-primary" onClick={handleNext}>
            Next
          </button>
        </div>
      );
    case "email":
      return (
        <div style={{ textAlign: "center" }}>
          <label>
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Your Email"
              onChange={handleInputChange}
            />
          </label>{" "}
          <button className="btn btn-primary" onClick={handlStatetoPass}>
            Next
          </button>
        </div>
      );
    case "password":
      return (
        <div style={{ textAlign: "center" }}>
          <div>
            <label>
              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleInputChange}
              />
            </label>{" "}
          </div>
          <div style={{ marginTop: "20px" }}>
            <label>
              <input
                className="form-control"
                type="password"
                name="ConfirmPassword"
                placeholder="Confirm password"
              />
            </label>{" "}
          </div>
          <button
            style={{ marginTop: "20px" }}
            className="btn btn-primary"
            onClick={OntoSubmit}
          >
            Next
          </button>
        </div>
      );
    case "Submit":
      return (
        <div style={{ textAlign: "center" }}>
          <div>
            <button
              className="form-control"
              name="submit-form"
              onClick={SubmitForm}
            >
              Submit
            </button>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export function SignupForm() {
  const [SignupState, SetSignupState] = useState("name");
  const circleRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  return (
    <>
      <link href="src\SignupStyle.css" rel="stylesheet" type="text/css"></link>
      <BasicExample></BasicExample>
      <header style={{ textAlign: "center" }}>
        {" "}
        <h1>Sign up!</h1>
      </header>

      <div className="parrentDiv">
        <div className="ChildDiv">
          <div style={{ marginTop: "30px" }}>
            <ShorProgress circleRef={circleRefs}></ShorProgress>
            <form encType="multipart/form-data" className="form-group">
              <SignUpProgress
                SignupState={SignupState}
                SetSignupState={SetSignupState}
                circleRef={circleRefs}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
