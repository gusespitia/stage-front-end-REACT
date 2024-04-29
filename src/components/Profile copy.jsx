import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Userfront from "@userfront/toolkit/react";
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

const FormSchema = z.object({
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
      const phoneNumberRegex = /^\+\d{11}$/; // Formato: +15558675309
      return phoneNumberRegex.test(value);
    },
    {
      message: "Phone number must be in the format +15558675309.",
    }
  ),
});

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // Define el estado selectedFile

  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phoneNumber: "",
      image: "",
    },
  });

  const formRef = useRef(null); // Referencia al formulario

  const onSubmit = async (data) => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("imagenPerfil", selectedFile);
        // Sube la imagen al servidor
        const imageResponse = await axios.post(
          "http://localhost:8020/images/single",
          formData
        );

        if (imageResponse.status === 200) {
          // Actualiza el campo "image" en los datos del formulario
          console.log(
            "http://localhost:8020/images/" + imageResponse.data.fileName
          );
          data.image =
            "http://localhost:8020/images/" + imageResponse.data.fileName; // Ajusta la propiedad "imageUrl" según la respuesta del servidor
          // Actualiza el valor del campo "image" en el estado local (userData)
          console.log(data.image);
          form.setValue("image", data.image);
        } else {
          setMessage("Failed to upload image");
          return;
        }
      }

      // Realiza la solicitud para actualizar los datos del usuario en el servidor
      const response = await fetch(
        `https://back-end-knex-js.vercel.app/updateUser/${userData.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        // Si la solicitud es exitosa, muestra un mensaje de éxito
        setIsAlertDialogOpen(true);
        setMessage("User data updated successfully!");
        setTimeout(() => {
          setIsAlertDialogOpen(false);
          setMessage("");
        }, 5000);
      } else {
        // Si la solicitud falla, muestra un mensaje de error
        setMessage("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

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
        // Actualiza el estado userData con los datos del usuario
        setUserData(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userData) {
      // Actualiza los valores iniciales del formulario con los datos del usuario
      form.reset({
        name: userData.name,
        username: userData.username,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        image: userData.image,
      });
    }
  }, [userData, form]);

  // Define la función para manejar el cambio en el archivo seleccionado
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleContinueAction = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="mx-40 max-w-screen-xl my-2 bg-slate-300 border rounded-xl p-0 ">
      <div className="w-full">
        {userData && (
          <div className="flex items-start gap-4 justify-start p-3 border rounded-[8px] px-20">
            <img
              src={userData.image}
              className="rounded-md min-w-40 max-w-56 bg-emerald-500 p-1 mb-3"
              alt="image of user"
            />
            <div>
              <h2 className="font-bold">
                Hello {userData.name.split(" ")[0]}!
              </h2>
              {(message && (
                <div className="mt-4 text-center text-white bg-green-500 p-2 rounded-md w-96">
                  {message}
                </div>
              )) || (
                <p className="my-4 w-96">
                  Here you can edit your personal information
                </p>
              )}
              <Form {...form}>
                <form
                  ref={formRef} // Asigna la referencia al formulario
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
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
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="imagenPerfil">Picture</Label>
                    <Input
                      id="imagenPerfil"
                      type="file"
                      onChange={handleFileChange}
                    />
                  </div>
                  <AlertDialog
                    isOpen={isAlertDialogOpen}
                    onClose={() => setIsAlertDialogOpen(false)}>
                    <AlertDialogTrigger>
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                        Edit
                      </button>
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
                          onClick={() => handleContinueAction()}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </form>
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
