import { useState, useEffect } from "react";
import User from "./Users";

const Dashboard = () => {
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://back-end-knex-js.vercel.app/api/users"
        );

        const data = await response.json();
        setUsersData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>User Data</h1>

      {usersData.map((user, key) => (
        <ul key={key} className="flex gap-3">
          <li> {user.userId}</li>
          <li> Email: {user.email}</li>
          <li> UserName: {user.username}</li>
        </ul>
      ))}
    </div>
  );
};

export default Dashboard;
