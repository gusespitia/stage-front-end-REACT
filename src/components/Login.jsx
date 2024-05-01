import Userfront, { LoginForm } from "@userfront/toolkit/react";

Userfront.init("xbpwd96n");

const Login = () => {
  return (
    <div className="m-36">
      <LoginForm
        theme={{
          colors: {
            light: "#ffffff",
            dark: "#5e72e4",
            accent: "#13a0ff",
            lightBackground: "#fdfdfd",
            darkBackground: "#2d2d2d",
          },
          colorScheme: "auto",
          fontFamily: "Avenir, Helvetica, Arial, sans-serif",
          size: "compact",
          extras: { rounded: true, hideSecuredMessage: false },
        }}
      />
    </div>
  );
};

export default Login;
