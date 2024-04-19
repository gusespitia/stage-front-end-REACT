import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Userfront from "@userfront/toolkit/react";

const UserItem = () => {
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

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        console.log(result);
        setUserData(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {userData && (
        <div className="flex items-center gap-4 justify-start p-2 border rounded-[8px] ">
          <img
            src={userData.image}
            className="avatar rounded-full min-h-10 min-w-10 max-w-16 bg-emerald-500 p-1 mb-3"
            alt=""
          />
          <div>
            <p className="font-bold text-[16px]">Hello {userData.name}!</p>
            <p className="text-[13px] text-neutral-500]">
               {userData.email}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserItem;
