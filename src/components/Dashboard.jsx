import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const [usersData, setUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Invalid email address.",
    }),
    phoneNumber: z.string().refine(
      (value) => {
        // Expresión regular para validar el formato del número de teléfono
        const phoneNumberRegex = /^\+\d{11}$/; // Formato: +15558675309
        return phoneNumberRegex.test(value);
      },
      {
        message: "Phone number must be in the format +15558675309.",
      }
    ),
    roles: z.array(z.string()).min(1, {
      message: "At least one role must be selected.",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedUser ? selectedUser.name : "",
      username: selectedUser ? selectedUser.username : "",
      email: selectedUser ? selectedUser.email : "",
      phoneNumber: selectedUser ? selectedUser.phoneNumber : "",
      roles: selectedUser ? selectedUser.roles : "", // Agrega el valor predeterminado para el campo 'role'
    },
  });

  const handleEditUser = async (formData) => {
    try {
      const { userId } = selectedUser;
      console.log(userId);

      // Crear una copia de formData y eliminar la propiedad 'roles'
      const formDataCopy = { ...formData };
      delete formDataCopy.roles;

      console.log(formDataCopy);

      const url = `https://back-end-knex-js.vercel.app/updateUser/${userId}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataCopy),
      });

      if (response.ok) {
        setSuccessMessage("User information updated successfully.");
        // Redirige a la página de inicio o a la página de dashboard
        console.log(response);
        window.location.href = "/dashboard"; // Redirige a la página de dashboard
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error("Error updating user information:", error);
      setErrorMessage("Error updating user information. Please try again.");
    }
  };

  const handleUserRoleUpdate = async (userId, roles) => {
    try {
      const { userId } = selectedUser;
      console.log(userId, roles);
      const url = `https://back-end-knex-js.vercel.app/updateUserRole/${userId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roles: roles }), // Envía el rol actualizado como un array
      });

      if (response.ok) {
        console.log(`User role updated successfully to ${roles}`);
        // Puedes mostrar un mensaje de éxito si lo deseas
      } else {
        const errorData = await response.json();
        console.error("Error updating user role:", errorData.message);
        // Puedes mostrar un mensaje de error si lo deseas
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      // Puedes mostrar un mensaje de error si lo deseas
    }
  };

  const onSubmit = async (data) => {
    // Manejar la actualización de la información del usuario
    await handleEditUser(data);

    // Manejar la actualización del rol del usuario
    const { userId, roles } = data;
    const rolesToSend = Array.isArray(roles) ? roles : [roles];

    await handleUserRoleUpdate(userId, rolesToSend);
  };

  useEffect(() => {
    if (selectedUser) {
      form.reset({
        name: selectedUser.name,
        username: selectedUser.username,
        email: selectedUser.email,
        phoneNumber: selectedUser.phoneNumber,
        roles: selectedUser.roles, // Corregido para incluir los roles
      });
    }
  }, [selectedUser, form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.userfront.com/v0/tenants/xbpwd96n/users/find",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer uf_test_admin_xbpwd96n_c9a7bff77e3d3552fca270f56c9b50ea",
            },
            body: JSON.stringify({
              filters: {
                conjunction: "and",
                filterGroups: [
                  {
                    conjunction: "and",
                    filters: [],
                  },
                ],
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUsersData(data.results);
          // console.log(data);
          // Suponiendo que 'data' es el objeto que has mostrado
          const users = data.results; // Obtener el array de resultados de usuarios

          // Iterar sobre cada usuario
          users.forEach((user) => {
            // Acceder a los roles del usuario
            const roles = user.authorization?.xbpwd96n?.roles;

            if (roles) {
              console.log("Roles del usuario founded");
            } else {
              console.log("No se encontraron roles para el usuario");
            }
          });

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

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <>
      <div>
        <FormProvider {...form}>
          <Table>
            <TableCaption className="p-2 text-xl">
              A list of all the users.
            </TableCaption>
            <TableHeader className="text-white">
              <TableRow className="bg-slate-400">
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Actions</TableHead>
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
                  <TableCell>
                    {user.authorization?.xbpwd96n?.roles.join(", ") ||
                      "No roles"}
                  </TableCell>

                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger
                        className="bg-blue-800 px-4 py-2 border rounded-md text-white"
                        onClick={() => handleUserSelect(user)}>
                        Edit
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will edit the data of the following
                            user: {user.name}
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="w-2/3 space-y-3">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input
                                    defaultValue={field.value}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input
                                    defaultValue={field.value}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    defaultValue={field.value}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input
                                    defaultValue={field.value}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="roles"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Roles</FormLabel>
                                <Select
                                  onValueChange={(value) =>
                                    field.onChange([value])
                                  } // Convertir el valor a un array
                                  defaultValue={
                                    field.value ? field.value[0] : null
                                  } // Seleccionar el primer valor del array
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="student">
                                      Student
                                    </SelectItem>
                                    <SelectItem value="teacher">
                                      Teacher
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription></FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                  <Input
                                    defaultValue={field.value}
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="submit"
                            onClick={() => console.log("hola")}>
                            Submit
                          </Button>
                        </form>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger className="px-2 py-2 border rounded-md text-white bg-red-700">
                        Delete
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FormProvider>
      </div>
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      {successMessage && <p className="text-green-600">{successMessage}</p>}
    </>
  );
};

export default Dashboard;
