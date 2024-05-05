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

const FormSchema2 = z.object({
  locked: z.boolean().default("false").optional(),
});

const Dashboard = () => {
  // State variables and their setters
  const [usersData, setUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [estado, setEstado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate();

  // Form handling using react-hook-form
  const formulario = useForm({
    resolver: zodResolver(FormSchema2),
    defaultValues: {
      locked: false,
    },
  });

  // Function to handle form submission with toast notification
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

  // Zod schema for form validation
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
        const trimmedValue = value.replace(/\s/g, "");
        const phoneNumberRegex = /^\+\d{11}$/;
        return phoneNumberRegex.test(trimmedValue);
      },
      {
        message: "Phone number must be in the format +15558675309.",
      }
    ),
    roles: z.array(z.string()).min(1, {
      message: "At least one role must be selected.",
    }),
    locked: z.boolean(),
  });

  // Form handling using react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedUser ? selectedUser.name : "",
      username: selectedUser ? selectedUser.username : "",
      email: selectedUser ? selectedUser.email : "",
      phoneNumber: selectedUser ? selectedUser.phoneNumber : "",
      roles: selectedUser ? selectedUser.roles : "student",
      locked: selectedUser ? selectedUser.locked : false,
    },
  });

  // Function to handle editing user information
  const handleEditUser = async (formData) => {
    try {
      const { userId } = selectedUser;
      const formDataCopy = { ...formData };
      delete formDataCopy.roles;

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
        window.location.reload();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      setErrorMessage("Error updating user information. Please try again.");
    }
  };

  // Function to handle updating user role
  const handleUserRoleUpdate = async (userId, roles) => {
    try {
      const url = `https://back-end-knex-js.vercel.app/updateUserRole/${userId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roles: roles }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Error updating user role:", errorData.message);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  // Function to handle form submission
  const onSubmit = async (data) => {
    await handleEditUser(data);

    const { userId, roles } = data;
    const rolesToSend = Array.isArray(roles) ? roles : [roles];
    await handleUserRoleUpdate(userId, rolesToSend);
  };

  // Fetching user data from the backend
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
          setLoading(false);
          setUsersData(data.results);
        } else {
          console.error(
            "Error fetching data:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  // Function to delete a user
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

  // Function to handle user deletion confirmation
  const handleClickContinue = async (userId) => {
    try {
      const deletionSuccessful = await deleteUser(userId);
      if (deletionSuccessful) {
        setSuccessMessage("User deleted successfully.");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        console.log("User could not be deleted ");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Function to handle switch change
  const handleSwitchChange = (newValue) => {
    setEstado(newValue);
    formulario.handleSubmit(onSubmit2)();
  };

  // Sorting users based on sortOrder
  const sortedUsers = usersData.slice().sort((a, b) => {
    if (a.userId < b.userId) return sortOrder === "asc" ? -1 : 1;
    if (a.userId > b.userId) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Filtering users based on search term, status, and role
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

  // Function to handle sorting order
  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };
  return (
    <section className="min-h-screen mt-16 md:ml-0 md:mx-1 lg:ml-52 box-content max-w-screen-xl bg-gray-400 border rounded-xl px-4 flex flex-col sm:mx-2 sm:mt-[68px] sm:ml-12 sm:mb-6 overflow-x-auto xs:ml-9">
      {" "}
      <div className="flex items-center mb-4 space-x-4 mt-2 justify-end">
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
      {loading && (
        <div className="text-center mt-14">
          <button
            type="button"
            className="bg-indigo-500 inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed "
            disabled>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM20 12a8 8 0 01-8 8v4c6.627 0 12-5.373 12-12h-4zm-2-7.938A7.962 7.962 0 0120 12h4c0-3.042-1.135-5.824-3-7.938l-3 2.647z"></path>
            </svg>
            Loading Users...
          </button>
        </div>
      )}
      {!loading && (
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
                    {user.authorization?.xbpwd96n?.roles.join(", ") ||
                      "No roles"}
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
      )}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      <Footer />
    </section>
  );
};

export default Dashboard;
