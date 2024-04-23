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
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedUser ? selectedUser.name : "",
      username: selectedUser ? selectedUser.username : "",
      email: selectedUser ? selectedUser.email : "",
      phoneNumber: selectedUser ? selectedUser.phoneNumber : "",
    },
  });

  const handleEditUser = async (formData) => {
    try {
      const { userId } = selectedUser;
      console.log(userId);
      console.log(formData);
      const url = `https://back-end-knex-js.vercel.app/updateUser/${userId}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("User information updated successfully.");
        // Redirige a la página de inicio o a la página de dashboard
        console.log(response);
        // window.location.href = "/dashboard"; // Redirige a la página de dashboard
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error("Error updating user information:", error);
      setErrorMessage("Error updating user information. Please try again.");
    }
  };

  const onSubmit = async (data) => {
    await handleEditUser(data);
    console.log(data);
  };

  useEffect(() => {
    if (selectedUser) {
      form.reset({
        name: selectedUser.name,
        username: selectedUser.username,
        email: selectedUser.email,
        phoneNumber: selectedUser.phoneNumber,
      });
    }
  }, [selectedUser, form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://back-end-knex-js.vercel.app/api/users"
        );
        const data = await response.json();
        setUsersData(data);
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
                <TableHead>Rol</TableHead>
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
                  <TableCell>{user.roles}</TableCell>

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
