import Userfront, { LoginForm } from "@userfront/toolkit/react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import Footer from "./Footer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
 // CarouselNext,
 // CarouselPrevious,
} from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
const slideImages = [
  "./images/slide1.jpg",
  "./images/slide2.jpg",
  "./images/slide3.jpg",
];

Userfront.init("xbpwd96n");

const Login = () => {
  const navigate = useNavigate();
  if (Userfront.accessToken()) {
    navigate("/home");
    return;
  }
  return (
    <section className="md:ml-4 md:mx-10 lg:ml-52 lg:mx-48 box-content max-w-screen-xl bg-gray-400 border rounded-xl p-6 mt-20 sm:mx-4 sm:mt-[68px] sm:ml-12 sm:mb-6 xs:mt-16">
      <h1 className="text-3xl font-bold mb-10 text-center sm:text-xl sm:mb-3 md:text-2xl md:mb-8 lg:text-4xl ">
        Welcome to SocialGus
      </h1>
      <p className="text-gray-800 mb-6 text-justify lg:text-lg xs:mb-4 xs:text-[20px] xs:tracking-wide">
        <strong>SocialGus</strong> is an exciting social platform designed to
        connect people from all over the world.{" "}
      </p>
      <p className="text-gray-800 mb-6 text-justify lg:text-lg xs:mb-4 xs:text-[20px] xs:tracking-wide">
        With an intuitive interface and powerful features,{" "}
        <strong>SocialGus</strong> offers you a unique experience to share
        moments, interact with friends, and discover new connections.
      </p>
      <div className="w-full h-auto flex justify-center items-center col-start-2 row-start-1 sm:row-start-2 sm:col-span-2 sm:col-start-1 xs:mb-12">
        <img
          src="./images/logo-socialgus.png"
          alt="Logo"
          className="object-fit h-36"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="sm:col-span-2 lg:col-span-1 xs:w-auto xs:mb-12 ">
          <Carousel
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}>
            <CarouselContent>
              {slideImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-1">
                        <img
                          src={image}
                          alt={`Slide ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
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
          <div className="text-center my-4 grid grid-rows-2 xs:my-4 ">
            <h4 className="font-bold text-red-700 xs:text-[20px] ">
              Do not have an account?
            </h4>
            <NavLink
              to="/register"
              className="text-blue-700 hover:text-red-700 underline text-lg font-bold xs:text-[20px] mt-2">
              Sign up here!
            </NavLink>
            <strong className="xs:text-[16px] xs:my-1">Or</strong>
            <NavLink
              to="/reset"
              className="text-blue-700 hover:text-red-700 text-lg font-bold xs:text-[20px] xs:mb-4">
              Reset your password!
            </NavLink>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 ">Create Your Own Space</h2>
          <p className="text-gray-800 mb-6 text-justify lg:text-lg xs:mb-4 xs:text-[20px] xs:tracking-wide">
            Personalize your profile to reflect your unique personality. Share
            details about your interests, hobbies, and experiences. Post on your
            wall, share stories, and keep your followers updated on what is
            happening in your life.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Discover New Opportunities
          </h2>
          <p className="text-gray-800 mb-6 text-justify lg:text-lg xs:mb-4 xs:text-[20px] xs:tracking-wide">
            <strong>SocialGus</strong> is not just about connecting with
            friends, it is also a platform to discover new opportunities. Find
            local events, join like-minded groups, and participate in meaningful
            conversations that can enrich your life.
          </p>
        </div>
      </div>
      <p className="text-gray-800 m-12 text-center xs:mx-2 xs:text-lg xs:mb-1 font-medium">
        Join the <strong className="text-blue-900">SocialGus</strong> community
        today and start exploring a world of possibilities!
      </p>
      <Footer />
    </section>
  );
};

export default Login;
