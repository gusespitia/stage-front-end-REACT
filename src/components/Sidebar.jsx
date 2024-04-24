import UserItem from "./UserItem";
import { User } from "lucide-react";
import { Users } from "lucide-react";
import { StickyNote } from "lucide-react";
import { Link } from "react-router-dom";
import { LogoutButton } from "@userfront/toolkit/react";

import {
  Command,
  CommandGroup,
  //  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const Sidebar = () => {
  const menuList = [
    {
      group: "General",
      items: [
        { to: "/profile", icon: <User />, text: "Profile" },
        { to: "/dashboard", icon: <Users />, text: "Dashboard" },
        { to: "/posts", icon: <StickyNote />, text: "Posts" },
      ],
    },
  ];

  return (
    <div className="fixed flex flex-col gap-4 w-[260px] min-w-[250px] border-r min-h-screen p-2">
      <div>
        <UserItem />
      </div>
      <Command>
        <CommandList>
          {menuList.map((menu, key) => (
            <CommandGroup key={key} heading={menu.group}>
              {menu.items.map((item, itemKey) => (
                <div key={itemKey}>
                  <div className=" flex gap-5 py-1 hover:translate-x-1 hover:text-primary hover:text-blue-900 font-medium">
                    {item.icon}
                    <li className="list-none hover:translate-x-1 hover:text-primary hover:text-blue-900 font-medium">
                      <Link to={item.to} exact="true">
                        {item.text}
                      </Link>
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
