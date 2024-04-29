
import { SignupForm } from "@userfront/toolkit/react";

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
            Authorization:
              "Bearer uf_test_admin_xbpwd96n_c9a7bff77e3d3552fca270f56c9b50ea",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        // Registro exitoso, puedes redirigir o mostrar un mensaje de éxito
        console.log("User registered successfully!");
      } else {
        // Manejar el caso de error
        console.error("Failed to register user");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <SignupForm
        onSubmit={handleSubmit}
        theme={{
          colors: {
            light: "#ffffff",
            dark: "#5e72e4",
            accent: "#13a0ff",
            lightBackground: "#fdfdfd",
            darkBackground: "#2d2d2d",
          },
          colorScheme: "light",
          fontFamily: "Avenir, Helvetica, Arial, sans-serif",
          size: "compact",
          extras: { rounded: true, hideSecuredMessage: false },
        }}
      />
    </div>
  );
};

export default Register;
