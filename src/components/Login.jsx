import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { auth } from "./FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { AuthContext } from "./AuthProvider";
import { useContext } from "react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const toast = useRef();
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const togglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const showError = (error) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 2500,
    });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      showError("Please enter needed information");
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          login();
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
      <Toast ref={toast} />
      <div className="loginregister">
        <form onSubmit={handleSubmit} className="loginForm">
          <h6>Login</h6>
          <InputText
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
          <br />
          <button type="submit">Login</button>
        </form>

        <div className="register">
          <div className="icon">
            <i className="pi pi-user-plus" style={{ fontSize: "60px" }}></i>
          </div>

          <div className="registerLabels">
            <p>Need an account?</p>
            <a href="/register">Register here</a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
