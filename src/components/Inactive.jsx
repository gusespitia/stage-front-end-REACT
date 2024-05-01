import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Userfront from "@userfront/toolkit/react";
import { LogoutButton } from "@userfront/toolkit/react";

const Inactive = () => {
  const [userData, setUserData] = useState(null);
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
  }, [navigate]);

  // Render the sidebar
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        {userData && (
          <h4 className="text-2xl font-bold mb-4">
            Your account {userData.email} is inactive
          </h4>
        )}
        <p className="text-gray-700 mb-4">
          Please contact the administrator to reactivate your account and gain
          access to the platform.
        </p>
        <div className="flex justify-center">
          <LogoutButton
            theme={{
              colors: {
                light: "#ffffff",
                dark: "#5e72e4",
                accent: "#13a0ff",
                lightBackground: "#fdfdfd",
                darkBackground: "#2d2d2d",
              },
              colorScheme: "auto",
              fontFamily: "Avenir, Helvetica, Arial, sans-serif",
              size: "compact",
              extras: { rounded: true, hideSecuredMessage: false },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Inactive;
