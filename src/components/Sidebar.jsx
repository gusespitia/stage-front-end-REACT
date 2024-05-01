import { User } from "lucide-react";
import { Users } from "lucide-react";
import { StickyNote } from "lucide-react";
import { NavLink } from "react-router-dom";
import Userfront, { LogoutButton } from "@userfront/toolkit/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Command,
  CommandGroup,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const Sidebar = () => {
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const navigate = useNavigate();
  // Definir el rol del usuario

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
          // console.log(data.locked);
          setUserStatus(data.locked);
          const roles = data.authorization?.xbpwd96n?.roles;
          setUserRole(roles[0]);
          if (roles) {
            //console.log("Roles del usuario founded");
          } else {
            console.log("No se encontraron roles para el usuario");
          }
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

  const menuList = [
    {
      group: "Pages",
      items: [
        // Verificar si userStatus es true (user.locked)
        userStatus === true
          ? [{ to: "/inactive", icon: <StickyNote />, text: "Status" }]
          : // Verificar si el usuario NO tiene el rol de "student"
          !userRole || userRole == "student"
          ? [
              { to: "/post", icon: <StickyNote />, text: "Post" },
              { to: "/profile", icon: <User />, text: "Profile" },
            ]
          : [
              { to: "/dashboard", icon: <Users />, text: "Dashboard" },
              { to: "/posts", icon: <StickyNote />, text: "Posts" },
              { to: "/post", icon: <StickyNote />, text: "Post" },
              { to: "/profile", icon: <User />, text: "Profile" },
            ], // Si el usuario tiene el rol de "student", no mostramos ninguna otra ruta
      ].flat(), // Utilizamos flat para aplanar el array
    },
  ];

  // Función para recargar la página cuando se hace clic en el botón de logout
  const handleLogout = () => {
    Userfront.logout();
    window.location.reload();
    console.log("hola");
  };

  return (
    <div className="fixed flex flex-col gap-4 w-[260px] min-w-[250px] border-r min-h-screen p-2 bg-white mt-20">
      <div>
        {userData && (
          <div>
            <div className="flex items-center gap-4 justify-start p-2 border rounded-[8px] ">
              <img
                src={userData.image}
                className="border max-w-16 bg-emerald-500 p-0.5 mb-3 rounded-lg"
                alt={"Avatar of the user: " + userData.name}
              />
              <div>
                <p className="font-bold text-[16px]">Hello {userData.name}!</p>
                <p className="text-[13px] text-neutral-500]">
                  {userData.email}
                </p>
              </div>
            </div>

            <Command>
              <CommandList>
                {menuList.map((menu, key) => (
                  <CommandGroup key={key}>
                    {menu.items.map((item, itemKey) => (
                      <div key={itemKey}>
                        <div className="flex gap-5 py-1">
                          {item.icon}
                          <li className="list-none hover:translate-x-1  hover:text-blue-900 font-medium">
                            <NavLink
                              to={item.to}
                              exact={item.toString()}
                              className={({ isActive }) =>
                                isActive
                                  ? "text-lime-600 font-bold hover:translate-x-1 hover:text-blue-900"
                                  : "text-black font-semibold hover:translate-x-1 hover:text-blue-900"
                              }>
                              {item.text}
                            </NavLink>
                          </li>
                        </div>
                      </div>
                    ))}
                  </CommandGroup>
                ))}
                <CommandSeparator />
              </CommandList>
            </Command>
            <div className="w-20 mt-6 align-middle text-right">
              <LogoutButton
                theme={{
                  colors: {
                    light: "#ffffff",
                    dark: "#5e72e4",
                    accent: "#187cbf",
                    lightBackground: "#fdfdfd",
                    darkBackground: "#2d2d2d",
                  },
                  colorScheme: "auto",
                  fontFamily: "Avenir, Helvetica, Arial, sans-serif",
                  size: "compact",
                  extras: {
                    rounded: true,
                    gradientButtons: true,
                    hideSecuredMessage: false,
                  },
                }}
                onSubmit={handleLogout} // Asigna la función de manejo de clics
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
