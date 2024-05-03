import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Userfront from "@userfront/toolkit/react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { USERFRONT_ACCESS_TOKEN } from "./config";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  // TableCaption,
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
import { toast } from "@/components/ui/use-toast";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
const FormSchema2 = z.object({
  locked: z.boolean().default("false").optional(),
});
const Dashboard = () => {
  const [usersData, setUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false); // Nuevo estado para la confirmación de eliminación
  const [estado, setEstado] = useState(false);
  // FILTERS
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate();
  const formulario = useForm({
    resolver: zodResolver(FormSchema2),
    defaultValues: {
      locked: false,
    },
  });

  const onSubmit2 = (data) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };
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
        // Eliminar espacios en blanco
        const trimmedValue = value.replace(/\s/g, "");
        // Expresión regular para validar el formato del número de teléfono
        const phoneNumberRegex = /^\+\d{11}$/; // Formato: +15558675309
        return phoneNumberRegex.test(trimmedValue);
      },
      {
        message: "Phone number must be in the format +15558675309.",
      }
    ),
    roles: z.array(z.string()).min(1, {
      message: "At least one role must be selected.",
    }),
    locked: z.boolean(), // Agregamos la validación para el campo 'locked'
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedUser ? selectedUser.name : "",
      username: selectedUser ? selectedUser.username : "",
      email: selectedUser ? selectedUser.email : "",
      phoneNumber: selectedUser ? selectedUser.phoneNumber : "",
      roles: selectedUser ? selectedUser.roles : "student", // Agrega el valor predeterminado para el campo 'role'
      locked: selectedUser ? selectedUser.locked : false, // Agrega el valor predeterminado para el campo 'locked'
    },
  });

  const handleEditUser = async (formData) => {
    try {
      const { userId } = selectedUser;
      // console.log(userId);

      // Crear una copia de formData y eliminar la propiedad 'roles'
      const formDataCopy = { ...formData };
      delete formDataCopy.roles;

      // console.log(formDataCopy);

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

        window.location.reload();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      // console.error("Error updating user information:", error);
      setErrorMessage("Error updating user information. Please try again.");
    }
  };

  const handleUserRoleUpdate = async (userId, roles) => {
    try {
      const { userId } = selectedUser;
      // console.log(userId, roles);
      const url = `https://back-end-knex-js.vercel.app/updateUserRole/${userId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roles: roles }), // Envía el rol actualizado como un array
      });

      if (response.ok) {
        // console.log(`User role updated successfully to ${roles}`);
        window.location.reload();
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
        roles: selectedUser.roles,
        locked: selectedUser.locked,
      });
    }
  }, [selectedUser, form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!Userfront.accessToken()) {
          navigate("/login");
          return;
        }
        const response = await fetch(
          "https://api.userfront.com/v0/tenants/xbpwd96n/users/find",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: USERFRONT_ACCESS_TOKEN,
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
          console.log(data.results);

          const users = data.results;

          users.forEach((user) => {
            const roles = user.authorization?.xbpwd96n?.roles;

            if (roles) {
              // console.log("Roles del usuario founded");
            } else {
              console.log("No se encontraron roles para el usuario");
            }
          });
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
            Authorization: USERFRONT_ACCESS_TOKEN,
          },
        }
      );

      if (response.ok) {
        console.log("User deleted successfully");
        setDeleteConfirmation(true);
        window.location.reload();
        return true;
      } else {
        console.error("Failed to delete user");
        return false;
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleClickContinue = async (userId) => {
    try {
      const deletionSuccessful = await deleteUser(userId);
      if (deletionSuccessful) {
        setSuccessMessage("User deleted successfully.");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        console.log("User couldnot be deleted ");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const handleSwitchChange = (newValue) => {
    setEstado(newValue);
    formulario.handleSubmit(onSubmit2)();
  };
  const sortedUsers = usersData.slice().sort((a, b) => {
    if (a.userId < b.userId) return sortOrder === "asc" ? -1 : 1;
    if (a.userId > b.userId) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter((user) => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredByStatus = filteredUsers.filter((user) => {
    return filterStatus === "" || user.locked.toString() === filterStatus;
  });

  const filteredByRole = filteredByStatus.filter((user) => {
    return (
      filterRole === "" ||
      user.authorization?.xbpwd96n?.roles.toString() === filterRole
    );
  });

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  return (
    <section className="mt-16 md:ml-0 md:mx-1 lg:ml-52 box-content max-w-screen-xl bg-gray-400 border rounded-xl px-4 flex flex-col sm:mx-2 sm:mt-[68px] sm:ml-18 sm:mb-6 overflow-x-auto xs:ml-9 ">
      <div className="flex items-center mb-4 space-x-4">
        {/* Input para buscar por nombre */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-md px-2 py-1"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-md px-2 py-1">
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <select
          value={[filterRole]}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border rounded-md px-2 py-1">
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value=" ">No roles</option>
        </select>
      </div>
      <FormProvider {...form}>
        <Table className="text-center mt-1 w-full border-2 rounded-md">
          <TableHeader>
            <TableRow className="bg-neutral-800 hover:bg-neutral-500">
              <TableHead className="item-table" onClick={handleSort}>
                ID
              </TableHead>
              <TableHead className="item-table">Name</TableHead>
              <TableHead className="item-table">Username</TableHead>
              <TableHead className="item-table">Email</TableHead>
              <TableHead className="item-table">Image</TableHead>
              <TableHead className="item-table">Phone</TableHead>
              <TableHead className="item-table">Status</TableHead>
              <TableHead className="item-table">Roles</TableHead>
              <TableHead className="item-table">Actions</TableHead>
              <TableHead className="item-table">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredByRole.map((user, index) => (
              <TableRow
                key={index}
                className={
                  index % 2 !== 0
                    ? "hover:translate-x-1 hover:text-blue-900 hover:font-medium"
                    : "bg-gray-100 hover:translate-x-1 hover:text-blue-900 hover:font-medium"
                }>
                <TableCell className="font-medium">{user.userId}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <img src={user.image} alt="" width="30px" />
                </TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>
                  {" "}
                  {user.locked ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="bg-lime-400 hover:bg-lime-500 text-black font-semibold py-2 px-4 border-b-4 border-lime-700 hover:border-lime-300 rounded">
                          Active
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Active</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="bg-red-400 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
                          Inactive
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Inactive</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}{" "}
                </TableCell>
                <TableCell>
                  {user.authorization?.xbpwd96n?.roles.join(", ") || "No roles"}
                </TableCell>

                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger
                      className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                      onClick={() => handleUserSelect(user)}>
                      Edit
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-400 border rounded-md max-h-[700px]  max-w-[600px] overflow-y-auto">
                      <AlertDialogHeader className=" text-black">
                        <AlertDialogTitle className=" text-black">
                          Edit Form
                        </AlertDialogTitle>
                        <AlertDialogDescription className=" text-black text-md">
                          This action will edit the data of the user:{" "}
                          <strong> {user.name}</strong>
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="max-w-[500px]">
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
                        <div className="flex gap-8 mt-3">
                          <FormField
                            onSubmit={formulario.handleSubmit(onSubmit2)}
                            control={form.control}
                            name="locked"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex justify-around first:mb-4">
                                  Status
                                </FormLabel>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={(newValue) => {
                                      field.onChange(newValue);
                                      handleSwitchChange(newValue);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <button
                            className="hidden"
                            type="submit"
                            disabled={!estado}>
                            Submit
                          </button>

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
                                  defaultValue={user.authorization?.xbpwd96n?.roles.join(
                                    ", "
                                  )} // Seleccionar el primer valor del array
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
                        </div>
                        {/* <div className="h-6 text-center bg-black w-full mt-24 p-4"> */}
                        {successMessage ? (
                          <div>
                            <p className="text-green-600">{successMessage}</p>
                            <AlertDialogFooter className="mt-7 gap-4">
                              <AlertDialogAction>Exit</AlertDialogAction>
                            </AlertDialogFooter>
                          </div>
                        ) : (
                          <div>
                            <AlertDialogFooter className="mt-7 gap-4">
                              <AlertDialogCancel className="bg-white text-black">
                                Cancel
                              </AlertDialogCancel>
                              <Button type="submit">Submit</Button>
                            </AlertDialogFooter>
                          </div>
                        )}
                      </form>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">
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
      <Footer />
    </section>
  );
};

export default Dashboard;
