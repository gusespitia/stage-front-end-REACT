import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Userfront from "@userfront/toolkit/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Dashboard = () => {
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
      <h1>Dashboard</h1>
      {userData && (
        <div className="bg-blue-400 m-8 flex gap-8 justify-around">
          <Card key={userData.id}>
            <CardHeader>
              <div>Nmae: {userData.name}</div>
              <CardTitle>Email: {userData.email}</CardTitle>
              <CardDescription>UserNmae: {userData.username}</CardDescription>
            </CardHeader>
            <CardContent>PhoneNumber: {userData.phoneNumber}</CardContent>
            <CardFooter>
              <img src={userData.image} alt="" />
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
