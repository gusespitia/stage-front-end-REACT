// UserContext.js

import  { createContext, useContext, useState } from "react";
import { USERFRONT_ACCESS_TOKEN } from "./config";
import Userfront from "@userfront/toolkit/react";
import {  useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Crea el contexto de usuario
const UserContext = createContext();

// Proveedor del contexto de usuario
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!Userfront.accessToken()) {
          navigate("/login");
          return;
        }
        const userData = JSON.parse(
          atob(Userfront.accessToken().split(".")[1])
        );
        const userId = userData.userId;
        const response = await fetch(
          `https://api.userfront.com/v0/tenants/xbpwd96n/users/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: USERFRONT_ACCESS_TOKEN,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setUserData(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de usuario
export const useUser = () => useContext(UserContext);
