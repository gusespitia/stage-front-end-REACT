import {
  User,
  Home,
  Users,
  NotebookPen,
  BookOpenCheck,
  UserRoundX,
} from "lucide-react";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMenuButton, setShowMenuButton] = useState(false); // Nuevo estado para controlar la visibilidad del botón de menú
  const navigate = useNavigate();

  useEffect(() => {
    // Función para cargar los datos del usuario
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
          setUserStatus(data.locked);
          const roles = data.authorization?.xbpwd96n?.roles;
          setUserRole(roles[0]);
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

  useEffect(() => {
    const handleResize = () => {
      // Verificar el tamaño de la ventana para mostrar u ocultar el botón de menú
      setShowMenuButton(window.innerWidth < 1024);
    };

    // Agregar el listener para el evento de cambio de tamaño de la ventana
    window.addEventListener("resize", handleResize);

    // Llamar a handleResize al inicio para configurar correctamente el estado
    handleResize();

    // Limpiar el listener cuando el componente se desmonte
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuList = [
    {
      group: "Pages",
      items: [
        userStatus === true
          ? [{ to: "/inactive", icon: <UserRoundX />, text: "Status" }]
          : !userRole || userRole == "student"
          ? [
              { to: "/home", icon: <Home />, text: "Home" },
              { to: "/post", icon: <NotebookPen />, text: "Post" },
              { to: "/profile", icon: <User />, text: "Profile" },
            ]
          : [
              { to: "/home", icon: <Home />, text: "Home" },
              { to: "/dashboard", icon: <Users />, text: "Dashboard" },
              { to: "/posts", icon: <BookOpenCheck />, text: "Posts" },
              { to: "/post", icon: <NotebookPen />, text: "Post" },
              { to: "/profile", icon: <User />, text: "Profile" },
            ],
      ].flat(),
    },
  ];

  const handleLogout = () => {
    Userfront.logout();
    navigate("/login");
  };

  return (
    <section>
      {userData && (
        <div className="fixed lg:w-[260px] lg:min-w-[250px] md:min-w-[8px] sm:min-w-auto border-r min-h-screen p-2 lg:bg-white mt-16  sm:bg-white xs:bg-white xs:opacity-90 border-dotted border-2 border-gray-800 xs:min-w-[8px] z-10">
          {showMenuButton && (
            <button
              className="lg:hidden ml-auto flex"
              onClick={() => setMenuOpen(!menuOpen)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 right-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          )}
          <div
            className={`${
              menuOpen || !showMenuButton ? "block" : "hidden"
            } lg:block `}>
            <section>
              <div className="flex items-center gap-4 justify-start p-2 border rounded-[8px] bg-white xs:flex-col xs:mt-0 ">
                <img
                  src={userData.image}
                  className="border max-w-16 bg-emerald-500 p-0.5 mb-3 rounded-lg xs:mb-0"
                  alt={"Avatar of the user: " + userData.name}
                />
                <div>
                  <p className="font-bold text-[16px] ">
                    Hello {userData.name}!
                  </p>
                  <p className="text-[13px] text-neutral-500] xs:hidden md:block">
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
            </section>
          </div>
        </div>
      )}
    </section>
  );
};

export default Sidebar;
