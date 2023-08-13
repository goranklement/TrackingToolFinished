import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import History from "./components/History";
import Trackers from "./components/Trackers";
import Login from "./components/Login";
import Register from "./components/Register";
import NavbarLogin from "./components/NavbarLogin";
import { AuthProvider, AuthContext } from "./components/AuthProvider";
import { useContext } from "react";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import React from "react";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          {isAuthenticated ? (
            <React.Fragment>
              <Navbar />
              <Routes>
                <Route path="/" element={<Trackers />} />
                <Route path="/trackers" element={<Trackers />} />
                <Route path="/history" element={<History />} />
              </Routes>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <NavbarLogin />
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </React.Fragment>
          )}
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
