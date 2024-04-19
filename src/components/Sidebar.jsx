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
        { to: "/", icon: <User />, text: "Profile" }, // Utiliza "to" en lugar de "link"
        { to: "/users", icon: <Users />, text: "Users" }, // Cambia "./Users.jsx" por "/users"
        { to: "/", icon: <StickyNote />, text: "Posts" },
      ],
    },
  ];
  return (
    <>
      <div className="fixed flex flex-col gap-4 w-[300px] min-w-[300px] border-r min-h-screen p-4">
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
                    <Link href={item.to}>{item.text} </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            <CommandSeparator />
          </CommandList>
        </Command>
      </div>
    </>
  );
};
export default Sidebar;
