import  { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Userfront from "@userfront/toolkit/react";

function Navbar() {
  const [userData, setUserData] = useState(null);
  const [userRol, setUserRol] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verificar si el usuario está autenticado
        if (!Userfront.accessToken()) {
          navigate("/login");
          return;
        }

        // Obtener el userId del token de acceso
        const userData = JSON.parse(
          atob(Userfront.accessToken().split(".")[1])
        );
        const userId = userData.userId;

        // Realizar la solicitud utilizando el userId
        const response = await fetch(
          `https://api.userfront.com/v0/tenants/xbpwd96n/users/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer uf_test_admin_xbpwd96n_c9a7bff77e3d3552fca270f56c9b50ea",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setUserRol(data.authorization?.xbpwd96n?.roles[0]);
          // Aquí puedes manejar los datos recibidos, como establecer el estado o realizar otras operaciones
        } else {
          console.error(
            "Error en la respuesta de la solicitud:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <nav className="bg-gray-800 p-4 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/login">
              <img
                className="h-14 w-auto"
                src="./images/logo.png" // Ruta relativa desde la ubicación del componente
                alt="Logo"
              />
            </NavLink>
          </div>

          {/* Responsive Menu Button */}

          {/* <button
              type="button"
              className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300"
              aria-label="Toggle menu">
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm16 5H4v2h16v-2z"></path>
              </svg>
            </button> */}
          {userRol && (
            <div className="border-b p-2 text-center text-lg bg-gray-900 text-white sticky top-0 z-50">
              <h1>You are using this platform as a {userRol} </h1>
            </div>
          )}

          {/* Menu Items */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <ul className="flex space-x-4 gap-4">
              {!userData && (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      exact
                      className={({ isActive }) =>
                        isActive
                          ? "text-lime-600 font-bold hover:translate-x-1 hover:text-blue-900"
                          : "text-white font-semibold hover:translate-x-1 hover:text-blue-900"
                      }>
                      Log In
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        isActive
                          ? "text-lime-600 font-bold hover:translate-x-1 hover:text-blue-900"
                          : "text-white font-semibold hover:translate-x-1 hover:text-blue-900"
                      }>
                      Register
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/reset"
                      className={({ isActive }) =>
                        isActive
                          ? "text-lime-600 font-bold hover:translate-x-1 hover:text-blue-900"
                          : "text-white font-semibold hover:translate-x-1 hover:text-blue-900"
                      }>
                      Reset Password
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
