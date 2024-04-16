import { SignupForm, LogoutButton } from "@userfront/toolkit/react";

const Home = () => (
  <div>
    <h2>Home</h2>
    <SignupForm
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
    ;
  </div>
);

export default Home;
