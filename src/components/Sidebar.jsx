"use client";
import UserItem from "./UserItem";
import { User } from "lucide-react";
import { Users } from "lucide-react";
import { StickyNote } from "lucide-react";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const menuList = [
    {
      group: "General",
      items: [
        { to: "/profile", icon: <User />, text: "Profile" }, // Redirige a "/profile"
        { to: "./dashboard", icon: <Users />, text: "Users" }, // Redirige a "/users"
        { to: "/posts", icon: <StickyNote />, text: "Posts" }, // Redirige a "/posts"
      ],
    },
  ];
  return (
    <>
      <div className="fixed flex flex-col gap-4 w-[240px] min-w-[220px] border-r min-h-screen p-2">
        <div>
          <UserItem />
        </div>
        <Command>
          <CommandList>
            {menuList.map((menu, key) => (
              <CommandGroup key={key} heading={menu.group}>
                {menu.items.map((item, key) => (
                  <CommandItem key={key} className="flex gap-3">
                    {item.icon}
                    {/* Utiliza el componente Link para los enlaces */}
                    <Link to={item.to}>{item.text}</Link>{" "}
                    {/* Cambia href por to */}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            <CommandSeparator />
          </CommandList>
        </Command>
      </div>
      <div>{/* Aquí renderiza el componente correspondiente al enlace */}</div>
    </>
  );
};
export default Sidebar;
