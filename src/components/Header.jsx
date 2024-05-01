import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Userfront from "@userfront/toolkit/react";

const Header = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verificar si el usuario está autenticado
        // if (!Userfront.accessToken()) {
        //   navigate("/login");
        //   return;
        // }

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

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        setUserData(data.authorization?.xbpwd96n?.roles[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [navigate]);
  return (
    <section>
      {/* {userData && (
        <div className="border-b p-2 text-center text-lg  bg-gray-900 text-white sticky top-0 z-50">
          <h1>
            You are using this platform as a <strong>{userData}!</strong>
          </h1>
        </div>
      )} */}
    </section>
  );
};
export default Header;
