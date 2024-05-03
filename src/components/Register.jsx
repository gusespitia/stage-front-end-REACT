import Userfront, { SignupForm } from "@userfront/toolkit/react";
import Footer from "./Footer";
import { USERFRONT_ACCESS_TOKEN } from "./config";
Userfront.init("xbpwd96n");

const Register = () => {
  const handleSubmit = async (formData) => {
    try {
      const payload = {
        email: formData.email,
        username: formData.username,
        name: formData.name,
        image:
          "https://res.cloudinary.com/component/image/upload/avatars/avatar-16.png",
        data: {
          custom: "data",
        },
        password: formData.password,
      };

      const response = await fetch(
        "https://api.userfront.com/v0/tenants/vbqwm45b/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: USERFRONT_ACCESS_TOKEN,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        console.log("User registered successfully!");
      } else {
        console.error("Failed to register user");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <section className="md:ml-4 md:mx-10 lg:ml-52 box-content max-w-screen-xl bg-gray-400 border rounded-xl p-6 mt-20 sm:mx-4 sm:mt-[60px] sm:ml-12  lg:mx-24 h-lvh xs:mt-16">
      <h1 className="text-3xl font-bold mb-10 text-center sm:text-xl sm:mb-3 md:text-2xl md:mb-8 lg:text-4xl">
        Welcome to SocialGus
      </h1>
      <p className="text-gray-800 mb-6 text-justify lg:text-lg">
        Please complete the registration form by providing the required
        information, including your email address and choosing a password. Once
        the form is submitted, you will be redirected to the{" "}
        <strong>SocialGus</strong> home page.
      </p>

      <div>
        <SignupForm
          onSubmit={handleSubmit}
          theme={{
            colors: {
              light: "#ffffff",
              dark: "#5e72e4",
              accent: "#187cbf",
              lightBackground: "#fdfdfd",
              darkBackground: "#2d2d2d",
            },
            colorScheme: "auto",
            fontFamily: "Avenir, Helvetica, Arial, sans-serif",
            size: "compact",
            extras: {
              rounded: true,
              gradientButtons: true,
              hideSecuredMessage: false,
            },
          }}
        />
      </div>

      <p className="text-gray-800 mt-8 text-center">
        Join the <strong className="text-blue-900">SocialGus</strong> community
        today and start exploring a world of possibilities!
      </p>

      <Footer />
    </section>
  );
};

export default Register;
