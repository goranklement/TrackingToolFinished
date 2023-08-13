import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { auth } from "./FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "./FirebaseConfig";
import { doc } from "firebase/firestore";

import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { setDoc } from "firebase/firestore";

const Register = () => {
  const toast = useRef();
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRepPasswordVisible, setIsRepPasswordVisible] = useState(false);

  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [email, setEmail] = useState("");

  const togglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleRepPassword = () => {
    setIsRepPasswordVisible(!isRepPasswordVisible);
  };
  const showError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 2500,
    });
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRepPasswordChange = (e) => {
    setRepeatedPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === "" || email === "" || repeatedPassword === "") {
      showError("Please enter all information!");
    } else if (password !== repeatedPassword) {
      showError("Passwords not matching!");
    } else {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const activeTasksRef = doc(db, "tasks", user.uid);
          const savedTasksRef = doc(db, "tasks", user.uid + "S");

          await setDoc(activeTasksRef, {
            tasks: [],
          });
          await setDoc(savedTasksRef, {
            tasks: [],
          });

          navigate("/trackers");
        })
        .catch((error) => {
          const errorMessage = error.message;
          showError(errorMessage);
        });
    }
  };

  return (
    <div>
      <Toast ref={toast} position="top-right" />
      <div className="loginregister">
        <form onSubmit={handleSubmit} className="registerForm">
          <h6>Register</h6>
          <InputText
            className="emailInput"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
          />
          <br />

          <span className="p-input-icon-right">
            <i
              className={isPasswordVisible ? "pi pi-eye-slash" : "pi  pi-eye"}
              onClick={togglePassword}
            />
            <InputText
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </span>
          <span className="p-input-icon-right">
            <i
              className={
                isRepPasswordVisible ? "pi pi-eye-slash" : "pi  pi-eye"
              }
              onClick={toggleRepPassword}
            />
            <InputText
              type={isRepPasswordVisible ? "text" : "password"}
              placeholder="Repeat password"
              value={repeatedPassword}
              onChange={handleRepPasswordChange}
            />
          </span>
          <br />
          <button type="submit">Register</button>
        </form>

        <div className="register">
          <div className="icon">
            <i className="pi pi-user-plus" style={{ fontSize: "60px" }}></i>
          </div>

          <div className="registerLabels">
            <p>Already have an account?</p>
            <a href="/login">Login here</a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
