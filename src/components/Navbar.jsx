import { useState, useEffect } from "react";
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
    <nav className="bg-gray-800 px-4 fixed w-full z-10 py-1 ">
      <div className="flex justify-between ">
        {/* Logo */}
        <div className="flex-shrink-0 mr-10 ml-20">
          <NavLink to="/login" exact="true">
            <img
              className="h-14 w-auto"
              src="./images/logo.png"
              // src="../public\images\logo.png" // Ruta relativa desde la ubicación del componente
              alt="Logo"
            />
          </NavLink>
        </div>
        {userRol && (
          <section className="flex justify-end gap-20  w-full items-end">
            <div className="border-b p-1 md:text-md sticky top-0 z-50 text-white md:p-4 xs:text-[13px] xs:border-none mr-0 md:text-base">
              <h1>You are using this platform as a {userRol}!</h1>
            </div>
          </section>
        )}

        {/* Menu Items */}
        <div className="flex items-center justify-end space-x-4  ">
          <ul className="flex space-x-4 gap-1">
            {!userData && (
              <>
                <li>
                  <NavLink
                    to="/login"
                    exact="true"
                    className={
                      ({ isActive }) =>
                        isActive
                          ? "text-lime-600 font-bold hover:translate-x-1 hover:text-blue-900 text-sm md:text-base" // Texto de 12px en dispositivos pequeños, base en otros tamaños
                          : "text-white font-semibold hover:translate-x-1 hover:text-blue-900 text-sm md:text-base" // Texto de 12px en dispositivos pequeños, base en otros tamaños
                    }>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    exact="true"
                    className={
                      ({ isActive }) =>
                        isActive
                          ? "text-lime-600 font-bold hover:translate-x-1 hover:text-blue-900 text-sm md:text-base" // Texto de 12px en dispositivos pequeños, base en otros tamaños
                          : "text-white font-semibold hover:translate-x-1 hover:text-blue-900 text-sm md:text-base" // Texto de 12px en dispositivos pequeños, base en otros tamaños
                    }>
                    Register
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink
                    to="/reset"
                    exact="true"
                    className={({ isActive }) =>
                      isActive
                      ? "text-lime-600 font-bold hover:translate-x-1 hover:text-blue-900 text-sm md:text-base" // Texto de 12px en dispositivos pequeños, base en otros tamaños
                      : "text-white font-semibold hover:translate-x-1 hover:text-blue-900 text-sm md:text-base" // Texto de 12px en dispositivos pequeños, base en otros tamaños
                }>
                    Reset Password
                  </NavLink>
                </li> */}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
