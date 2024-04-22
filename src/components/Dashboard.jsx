import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [usersData, setUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Estado para almacenar el usuario seleccionado para editar
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal

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

  const openModal = (user) => {
    setSelectedUser(user); // Guarda el usuario seleccionado para editar
    setIsModalOpen(true); // Abre el modal de edición
  };

  const closeModal = () => {
    setIsModalOpen(false); // Cierra el modal
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar el formulario
    console.log("Formulario enviado");
    // Cierra el modal después de enviar el formulario
    closeModal();
  };

  return (
    <>
      <div>
        <Table>
          <TableCaption className="p-2 text-xl">
            A list of all the users.
          </TableCaption>
          <TableHeader className="text-white">
            <TableRow className="bg-slate-400">
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>UserName</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersData.map((user, key) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{user.userId}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <img src={user.image} alt="" width="30px" />
                </TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{user.roles}</TableCell>
                <TableCell className="text-right">
                  <Button
                    className="px-4 py-2 border rounded-md text-white bg-red-700"
                    variant="destructive">
                    Delete
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    className="bg-blue-800 px-4 py-2 border rounded-md text-white"
                    variant="secondary"
                    onClick={() => openModal(user)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Renderiza el modal solo si isModalOpen es true y hay un usuario seleccionado */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 shadow-lg w-96 bg-slate-100 border rounded-md">
            <button
              onClick={closeModal}
              className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700 rounded-lg">
              X
            </button>
            <form onSubmit={handleSubmit}>
              <h2 className="text-lg font-bold mb-4">Please Edit the User:</h2>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedUser.name}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-md cursor-pointer bg-slate-100 p-2 my-3"
                />
              </label>
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  defaultValue={selectedUser.username}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-md cursor-pointer bg-slate-100 p-2 my-3"
                />
              </label>
              <label>
                Email:
                <input
                  type="text"
                  name="email"
                  defaultValue={selectedUser.email}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-md cursor-pointer bg-slate-100 p-2 my-3"
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phoneNumber"
                  defaultValue={selectedUser.phoneNumber}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-md cursor-pointer bg-slate-100 p-2 my-3"
                />
              </label>
              <label>
                Rol:
                <input
                  type="text"
                  name="roles"
                  defaultValue={selectedUser.roles}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-md cursor-pointer bg-slate-100 p-2 my-3"
                />
              </label>
              {/* Agrega más campos de entrada para editar otros datos del usuario */}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
