import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Routes,
} from "react-router-dom";
import Userfront from "@userfront/toolkit/react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Home from "./components/Home";
import Reset from "./components/Reset";
import Register from "./components/Register";
import Layout from "./components/Layout";

Userfront.init("xbpwd96n");

function App() {
  return (
    <Router>
      <Layout>
        {/* <nav className="bg-gray-800 p-4">
          <ul className="flex flex-col md:flex-row justify-center md:justify-end space-y-2 md:space-y-0 md:space-x-4">
            <li>
              <NavLink
                to="/dashboard"
                className="text-white hover:text-gray-300"
                activeClassName="text-blue-500" // Estilo para el elemento activo
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                className="text-white hover:text-gray-300"
                activeClassName="text-blue-500" // Estilo para el elemento activo
                exact // Solo activo en coincidencia exacta con la ruta
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/login"
                className="text-white hover:text-gray-300"
                activeClassName="text-blue-500" // Estilo para el elemento activo
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                className="text-white hover:text-gray-300"
                activeClassName="text-blue-500" // Estilo para el elemento activo
              >
                Register
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reset"
                className="text-white hover:text-gray-300"
                activeClassName="text-blue-500" // Estilo para el elemento activo
              >
                Pass-forget
              </NavLink>
            </li>
          </ul>
        </nav>
*/}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
