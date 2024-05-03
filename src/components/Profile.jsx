import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { uploadFile } from "../firebase/config";
import { Progress } from "@/components/ui/progress";
import Footer from "./Footer";
import { USERFRONT_ACCESS_TOKEN } from "./config";
import { useUser } from "./UserContext"; 
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  // FormLabel,
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
 
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
 
  const { userData } = useUser();
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

  const formRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      for (let i = 0; i <= 100; i++) {
        setTimeout(() => {
          setProgress(i);
        }, i * 40);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data) => {
    try {
      setProgress(true);

      if (file) {
        const fullPath = await uploadFile(file);

        form.setValue("image", fullPath);

        data.image = fullPath;
      }

      const response = await fetch(
        `https://back-end-knex-js.vercel.app/updateUser/${userData.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: USERFRONT_ACCESS_TOKEN,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setIsAlertDialogOpen(true);

        setMessage("User data updated successfully!");
        setTimeout(() => {
          setIsAlertDialogOpen(false);
          // setIsAlertDialogOpen(true);
          setMessage("");
          window.location.href = "/gus";
        }, 3600);
      } else {
        setMessage("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  }; 

  useEffect(() => {
    if (userData) {
      form.reset({
        name: userData.name,
        username: userData.username,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        image: userData.image,
      });
    }
  }, [userData, form]);

  const handleContinueAction = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <section className="mt-16 md:ml-0 md:mx-1 lg:ml-52 box-content max-w-screen-xl bg-gray-400 border rounded-xl px-4 flex flex-col sm:mx-2 sm:mt-[68px] sm:ml-18 sm:mb-6 overflow-x-auto xs:ml-9">
      <div>
        {message && <Progress value={progress} className="bg-green-600" />}
        {userData && (
          <section className="mb-2 sm:row-start-1 sm:col-span-2 mt-4 lg:mr-28 sm:mr-2 sm:shadow-sm border rounded-xl sm:p-0 sm:pb-2 ">
            <div className="font-bold text-center mb-8 m-auto lg:px-8 sm:px-4 ">
              <h1 className="text-[24px] font-bold m-4 text-center sm:mb-0 sm:mx-auto xs:my-1">
                Hello
                <span>
                  <strong> {userData.name.split(" ")[0]}!</strong>
                </span>
              </h1>
              <br />
              <p className="sm:text-[18px] md:text-base xs:text-[17px] text-justify xs:font-medium xs:px-4 md:px-2 md:text-[19px] lg:text-[21px]">
                This section displays your personal information. You can also
                modify your data and upload a photo for use as your public
                profile picture.
              </p>
            </div>

            <div className="flex gap-20 justify-center items-start xs:gap-2 xs:flex-col md:mx-20 md:flex-col lg:flex-row sm:flex-col lg:mx-1">
              <div className="justify-center items-center w-[180px] xs:w-[160px] xs:pt-2 h-auto shadow-md mx-1 p-1 bg-white border rounded-md xs:mx-auto xs:my-1 md:w-[190px] lg:min-w-[150px] ">
                <p className="text-[17px] font-semibold  text-center xs:text-[14px] ">
                  Your avatar
                </p>
                <img
                  src={userData.image}
                  className="object-fit w-full h-auto border rounded-md mb-2 "
                  alt={"Avatar of the user: " + userData.name}
                />
              </div>
              <div className="w-[340px] xs:w-[280px] xs:mx-auto md:max-w-[560px] md:min-w-[480px] lg:max-w-[560px] lg:min-w-[340px] ">
                <Form {...form}>
                  <form
                    ref={formRef} // Asigna la referencia al formulario
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Name</Label>
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
                          <Label>Username</Label>
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
                          <Label>Email</Label>
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
                          <Label>Phone Number</Label>
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
                        id="image"
                        type="file"
                        name="image"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </div>
                    <AlertDialog
                      isOpen={isAlertDialogOpen}
                      onClose={() => setIsAlertDialogOpen(false)}>
                      <AlertDialogTrigger>
                        {!message && (
                          <button
                            type="button"
                            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded ">
                            Edit
                          </button>
                        )}
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            edit your data from our servers.
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
          </section>
        )}
      </div>

      <Footer />
    </section>
  );
};

export default Profile;
