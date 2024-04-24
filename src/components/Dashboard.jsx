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
  // Form,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Dashboard = () => {
  const [usersData, setUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false); // Nuevo estado para la confirmación de eliminación

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

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(
        `https://api.userfront.com/v0/tenants/vbqwm45b/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer uf_test_admin_xbpwd96n_c9a7bff77e3d3552fca270f56c9b50ea",
          },
        }
      );

      if (response.ok) {
        console.log("User deleted successfully");
        setDeleteConfirmation(true);
        window.location.href = "/dashboard"; // Redirige a la página de dashboard
        return true; // Indica que la eliminación del usuario fue exitosa
      } else {
        console.error("Failed to delete user");
        return false; // Indica que la eliminación del usuario falló
      }
    } catch (error) {
      console.error("An error occurred:", error);
      return false; // Indica que la eliminación del usuario falló debido a un error
    }
  };

  const handleClickContinue = async (userId) => {
    try {
      const deletionSuccessful = await deleteUser(userId);
      if (deletionSuccessful) {
        // Muestra el mensaje de éxito después de eliminar el usuario con éxito
        setSuccessMessage("User deleted successfully.");

        // Cierra el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        // Puedes mostrar un mensaje de error si la eliminación del usuario falló
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Puedes mostrar un mensaje de error si la eliminación del usuario falló debido a un error
    }
  };

  return (
    <>
      <FormProvider {...form}>
        <Table>
          <TableCaption className="p-0 text-xl m-0">
            <div className="h-6 text-center bg-slate-400 w-full m-0 p-0">
              {successMessage && (
                <p className="text-green-600">{successMessage}</p>
              )}
            </div>
            A list of all the users.
          </TableCaption>

          <TableHeader>
            <TableRow className="bg-slate-400 text-black">
              <TableHead className="text-black">Id</TableHead>
              <TableHead className="text-black">Name</TableHead>
              <TableHead className="text-black">Username</TableHead>
              <TableHead className="text-black">Email</TableHead>
              <TableHead className="text-black">Image</TableHead>
              <TableHead className="text-black">Phone</TableHead>
              <TableHead className="text-black">Status</TableHead>
              <TableHead className="text-black">Roles</TableHead>
              <TableHead className="text-black">Actions</TableHead>
              <TableHead className="text-black">Actions</TableHead>
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
                <TableCell> {user.status ? user.status : 1}</TableCell>
                <TableCell>
                  {user.authorization?.xbpwd96n?.roles.join(", ") || "No roles"}
                </TableCell>

                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger
                      className="bg-blue-800 px-4 py-2 border rounded-md text-white"
                      onClick={() => handleUserSelect(user)}>
                      Edit
                    </AlertDialogTrigger>
                    <AlertDialogContent
                      className="bg-slate-600"
                      style={{ maxHeight: "700px", overflowY: "auto" }}>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="">
                          Edit Form
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will edit the data of the following user:{" "}
                          {user.name}
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
                        <div className="flex gap-8">
                          <FormField
                            control={form.control}
                            name="roles"
                            render={({ field }) => (
                              <FormItem className="w-80">
                                <FormLabel>Roles</FormLabel>
                                <Select
                                  onValueChange={(value) =>
                                    field.onChange([value])
                                  } // Convertir el valor a un array
                                  defaultValue={
                                    user.authorization?.xbpwd96n?.roles.join(
                                      ", "
                                    ) || "No roles"
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
                                    defaultValue="1"
                                    onChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button type="submit">Submit</Button>
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
                        <AlertDialogAction
                          onClick={async () => {
                            await handleClickContinue(user.userId);
                            // Muestra la alerta de usuario eliminado exitosamente después de que la solicitud sea exitosa
                            setSuccessMessage(
                              "User deleted successfully. This action cannot be undone."
                            );
                          }}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </FormProvider>

      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </>
  );
};

export default Dashboard;
