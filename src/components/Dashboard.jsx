import Userfront, { LogoutButton } from "@userfront/toolkit/react";
import { useState, useEffect } from "react"; // Agrega useState y useEffect
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [privateData, setPrivateData] = useState(null); // Inicializa privateData como null
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3010/data", {
          headers: {
            Authorization: `Bearer ${Userfront.accessToken()}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setPrivateData(result.someSecretData); // Extrae la data secreta del resultado
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // REDIRECCIONAR SI NO ESTA LOGEADO
  const navigate = useNavigate();

  if (!Userfront.accessToken()) {
    navigate("/login");
    return null; // o puedes retornar algo mientras se realiza la redirección
  }

  // MOSTRAR LA INFO DEL USER
  console.log(Userfront);
  const userData = JSON.parse(atob(Userfront.accessToken().split(".")[1]));

  return (
    <div>
      <h1>Dashboard</h1>
      <h3>User Data</h3>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
      <pre>{JSON.stringify(privateData, null, 2)}</pre>
      <LogoutButton
        theme={{
          colors: {
            light: "#ffffff",
            dark: "#5e72e4",
            accent: "#13a0ff",
            lightBackground: "#fdfdfd",
            darkBackground: "#2d2d2d",
          },
          colorScheme: "light",
          fontFamily: "Avenir, Helvetica, Arial, sans-serif",
          size: "compact",
          extras: { rounded: true, hideSecuredMessage: false },
        }}
      />
    </div>
  );
};

export default Dashboard;
