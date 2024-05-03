import Userfront from "@userfront/toolkit/react";
import { NavLink } from "react-router-dom";
import Footer from "./Footer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const slideImages = [
  "./images/slide1.jpg",
  "./images/slide2.jpg",
  "./images/slide3.jpg",
];

Userfront.init("xbpwd96n");

const Home = () => {
  return (
    <section className="mt-16 md:ml-0 md:mx-1 lg:ml-52 box-content max-w-screen-xl bg-gray-400 border rounded-xl px-4 flex flex-col sm:mx-2 sm:mt-[68px] sm:ml-18 sm:mb-6 overflow-x-auto xs:ml-9 sm:ml-9">
      <div className="border rounded-md xs:mt-4 xs:p-4 md:px-16">
        <div className="mb-2 sm:row-start-1 sm:col-span-2">
          <h1 className="text-3xl font-bold mb-10 text-center sm:text-[24px] sm:mb-3 md:text-[28px] md:mb-8 lg:text-[36px] xs:mt-4 xs:mb-6">
            Welcome to SocialGus
          </h1>
          <p className="sm:text-[20px] md:text-base text-justify xs:font-medium xs:px-4 md:px-2 md:text-[20px] md:mb-8 sm:my-8 xs:text-[18px] ">
            <strong>SocialGus</strong> is an exciting social platform designed
            to connect people from all over the world. With an intuitive
            interface and powerful features, <strong>SocialGus</strong> offers
            you a unique experience to share moments, interact with friends, and
            discover new connections.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6 sm:grid-cols-1 ">
          <div className="w-full h-auto flex justify-center items-center col-start-1 row-start-2  z-0 sm:w-80 sm:m-auto xs:col-span-2 md:col-start-1 md:col-span-1 md:row-start-2 md:min-w-[250px] md:max-w-full xs:min-w-[200px]">
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

          <div className="w-full h-auto flex justify-center col-start-2 row-start-1 sm:row-start-2 sm:col-span-1 sm:col-start-1 xs:w-[180px] xs:col-start-1 xs:col-span-2 s mx-1 p-1 xs:mt-2 xs:mx-auto md:col-start-2 md:col-span-1 md:row-start-2 md:min-w-[200px] md:w-full sm:min-w-[80px] sm:w-full sm:py-14 xs:min-w-[280px]">
            <img
              src="./images/logo-socialgus.png"
              alt="Logo"
              className="object-fit object-cover"
            />
          </div>
        </div>
        <br />
        <div className="grid grid-cols-2 gap-8 mb-6 sm:row-start-6 xs:grid-cols-1 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="text-2xl font-bold mb-2 xs:text-[22px] xs:mb-0">
              Create Your Own Space
            </h2>
            <br />
            <p className="text-gray-800 text-justify mb-4 lg:text-[18px] xs:mb-4">
              Personalize your profile to reflect your unique personality. Share
              details about your interests, hobbies, and experiences. Post on
              your wall, share stories, and keep your followers updated on what
              is happening in your life.
            </p>
            <NavLink
              to="/post" // Ruta de la página para crear posts
              className="text-blue-900 cursor-pointer flex justify-center sm:justify-start">
              <Button> Create a Post</Button>
            </NavLink>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2 xs:text-[22px] xs:mb-0 xs:mt-8 md:mt-0 ">
              Discover New Opportunities
            </h2>
            <br />
            <p className="text-gray-800 text-justify mb-4 lg:text-[18px] xs:mb-4">
              <strong>SocialGus</strong> is not just about connecting with
              friends, it is also a platform to discover new opportunities. Find
              local events, join like-minded groups, and participate in
              meaningful conversations that can enrich your life.
            </p>
            <NavLink
              to="/profile" // Ruta de la página para actualizar el perfil
              className="text-blue-900 cursor-pointer flex justify-center sm:justify-start">
              <Button> Update Your Profile</Button>
            </NavLink>
          </div>
        </div>
        <p className="text-gray-800 m-12 text-center xs:mx-2 xs:text-lg xs:mb-1">
          Join the <strong className="text-blue-900">SocialGus</strong>{" "}
          community today and start exploring a world of possibilities!
        </p>
      </div>
      <Footer />
    </section>
  );
};

export default Home;
