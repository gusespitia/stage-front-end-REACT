import { SignupForm } from "@userfront/toolkit/react";
import { Button } from "@/components/ui/button";
const Home = () => (
  <div>
    <h2 className="bg-black text-white">Home</h2>
    <Button variant="outline">Button</Button>
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
