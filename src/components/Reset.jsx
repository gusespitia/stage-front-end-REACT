import { PasswordResetForm } from "@userfront/toolkit/react";
import Footer from "./Footer";
const Reset = () => (
  <section className="md:ml-4 md:mx-10 lg:ml-52 box-content max-w-screen-xl bg-gray-400 border rounded-xl p-6 mt-20 flex flex-col sm:mx-4 sm:mt-[68px] sm:ml-12 sm:mb-6 lg:mx-24">
    <div className="mb-2 sm:row-start-1 sm:col-span-2 lg:mx-8">
      <h1 className="text-3xl font-bold mb-10 text-center sm:text-[24px] sm:mb-3 md:text-[28px] md:mb-8 lg:text-[36px] ">
        Welcome to SocialGus
      </h1>
      <p className="text-gray-800 mb-6 sm:mb-0 text-justify lg:text-[20px] ">
        Please complete the password recovery form by providing the required
        information, which may include your email address or username. Once the
        form is submitted, the user will receive an email with additional
        instructions to reset their password.
      </p>
      <br />
      <div>
        <PasswordResetForm
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
      <p className="text-gray-800 mt-8 text-center">
        Reset your password and get back to{" "}
        <strong className="text-blue-900">SocialGus</strong>!
      </p>
      <Footer />
    </div>
  </section>
);

export default Reset;
