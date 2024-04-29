import { User } from "lucide-react";
import { Users } from "lucide-react";
import { StickyNote } from "lucide-react";
import { NavLink } from "react-router-dom";
import { LogoutButton } from "@userfront/toolkit/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Userfront from "@userfront/toolkit/react";

import {
  Command,
  CommandGroup,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const Sidebar = () => {
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState("");
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
          console.log(data);
          // Suponiendo que 'data' es el objeto que has mostrado

          // Iterar sobre cada usuario

          // Acceder a los roles del usuario
          const roles = data.authorization?.xbpwd96n?.roles;
          setUserRole(roles[0]);
          console.log(userRole);
          if (roles) {
            console.log("Roles del usuario founded");
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
      group: "General",
      items: [
        { to: "/profile", icon: <User />, text: "Profile" },
        // Verificar si el usuario NO tiene el rol de "teacher"
        !userRole || userRole !== "student" // Si userRole no está definido o no es "teacher"
          ? [
              { to: "/dashboard", icon: <Users />, text: "Dashboard" },
              { to: "/posts", icon: <StickyNote />, text: "Posts" },
            ] // Si userRole está definido y es "teacher"
          : [],
        { to: "/post", icon: <StickyNote />, text: "Post" },
      ].flat(), // Utilizamos flat para aplanar el array
    },
  ];

  return (
    <div className="fixed flex flex-col gap-4 w-[260px] min-w-[250px] border-r min-h-screen p-2 bg-white">
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
              <p className="text-[13px] text-neutral-500]">{userData.email}</p>
            </div>
          </div>
        )}
      </div>
      <Command>
        <CommandList>
          {menuList.map((menu, key) => (
            <CommandGroup key={key} heading={menu.group}>
              {menu.items.map((item, itemKey) => (
                <div key={itemKey}>
                  <div className="flex gap-5 py-1 hover:translate-x-1 hover:text-primary hover:text-blue-900 font-medium">
                    {item.icon}
                    <li className="list-none hover:translate-x-1 hover:text-primary hover:text-blue-900 font-medium">
                      <NavLink
                        to={item.to}
                        exact="true"
                        activeclassname="text-blue-500">
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
      <div className="w-20">
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
  );
};

export default Sidebar;
