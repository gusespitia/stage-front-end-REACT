import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
} from "react-router-dom";


import Userfront from "@userfront/toolkit/react";

import "./App.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Home from "./components/Home";
import Reset from "./components/Reset";
import Register from "./components/Register";

Userfront.init("xbpwd96n");

function App() {
  return (
    <Router>
      <nav className="nav justify-content-center">
        <ul>
          <li>
            <Link to="/dashboard" className="nav-link" aria-current="page">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/" className="nav-link" aria-current="page">
              Home
            </Link>
          </li>
          <li>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </li>
          <li>
            <Link to="/reset" className="nav-link">
              Pass-forget
            </Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/dashboard" element={< Dashboard />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
export default App;
