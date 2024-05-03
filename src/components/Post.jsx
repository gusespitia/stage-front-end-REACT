import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Userfront from "@userfront/toolkit/react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Editor from "react-simple-wysiwyg";
import { Button } from "@/components/ui/button";
import Footer from "./Footer";
const Post = () => {
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [titleError, setTitleError] = useState("");
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
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
          `https://back-end-knex-js.vercel.app/users/posts/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

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
        setUserData(result);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate title
    if (!postTitle.trim()) {
      setTitleError("Title cannot be empty");
      return;
    } else if (postTitle.trim().length < 2) {
      setTitleError("Title must be at least 2 characters");
      return;
    } else {
      setTitleError("");
    }

    // Validate data
    if (!postData.trim()) {
      setDataError("Data cannot be empty");
      return;
    } else if (postData.trim().length < 2) {
      setDataError("Data must be at least 2 characters");
      return;
    } else {
      setDataError("");
    }

    try {
      const data = {
        title: postTitle,
        data: postData,
        user_id: userData.userId,
      };

      const response = await fetch(
        `https://back-end-knex-js.vercel.app/newposts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send data");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error sending data:", error);
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
        setUserData(result);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <section className="mt-16 md:ml-0 md:mx-1 lg:ml-52 box-content max-w-screen-xl bg-gray-400 border rounded-xl px-4 flex flex-col sm:mx-2 sm:mt-[68px] sm:ml-18 sm:mb-6 overflow-x-auto xs:ml-9 sm:ml-12  ">
      <div className="border rounded-md xs:mt-4 xs:p-4">
        <h1 className="text-[20px] font-bold m-4 text-center sm:mb-8 sm:mx-auto xs:my-1">
          Here you can see all your posts !
        </h1>
        {userData && (
          <section className="flex justify-evenly items-start xs:gap-2 xs:flex-col md:flex-row">
            <div className="mx-8">
              <div className="justify-center items-center w-[180px] xs:w-[160px] xs:pt-2 h-auto shadow-md mx-1 p-1 bg-white border rounded-md xs:mx-auto xs:my-1 md:w-[190px]">
                <p className="text-[17px] font-semibold text-center xs:text-[14px] ">
                  Hello {userData.name}!
                </p>
                <img
                  src={userData.image}
                  className="object-fit w-full h-auto border rounded-md mb-2 xs:mt-2 "
                  alt={"Avatar of the user: " + userData.name}
                />
              </div>
            </div>

            <div className="grid sm:w-[560px] mx-8 md:w-full xs:mx-0 xs:w-full ">
              <form
                onSubmit={handleSubmit}
                className="w-full px-1 mt-0 bg-white xs:px-5 border rounded-md xs:min-w-[250px] xs:max-w-[580px]  sm:min-w-[400px] sm:max-w-[540px]  sm:ml-2">
                <Label className="text-[17px] font-semibold " htmlFor="title">
                  Title:
                </Label>
                <Input
                  className="mb-3"
                  type="text"
                  id="title"
                  placeholder="Enter your post title"
                  name="title"
                  value={postTitle}
                  onChange={(event) => setPostTitle(event.target.value)}
                />

                {titleError && <p className="text-red-500 ">{titleError}</p>}
                <Label className="text-[17px] font-semibold" htmlFor="data">
                  Your Post:
                </Label>
                <Editor
                  value={postData}
                  onChange={(event) => setPostData(event.target.value)}
                  containerProps={{
                    style: { resize: "vertical", background: "white" },
                  }}
                />
                {dataError && <p className="text-red-500">{dataError}</p>}
                <Separator />
                <div className="text-right">
                  <Button
                    type="submit"
                    className="my-6 bg-blue-700 hover:translate-x-1  hover:bg-blue-400 hover:font-semibold">
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </section>
        )}

        {posts.map((post) => (
          <div
            key={post.id}
            className="px-6 border rounded-2xl py-6 mt-20 mb-4 max-w-[600px] shadow-md bg-white flex mx-auto ">
            <ul className="grid grid-cols-2 grid-cols-custom gap-y-2 ">
              <Label className="col-start-1">Title:</Label>
              <li className="text-[16px] text-neutral-500] col-start-2 font-semibold first-letter:uppercase">
                {post.title}
              </li>
              <Label className="col-start-1">Data:</Label>
              <div className="text-[15px] text-neutral-500] col-start-2 font-semibold first-letter:uppercase">
                <div
                  dangerouslySetInnerHTML={{
                    __html: post.data,
                  }}
                />
              </div>
              <Separator className="mt-3 w-[550px]" />
              <li className="text-xs text-neutral-800 col-start-1 col-span-2">
                <Label className="col-start-1 text-neutral-800 ">Posted:</Label>
                <br />
                {new Date(post.created_at).toLocaleDateString("en-EN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
              </li>
            </ul>
          </div>
        ))}
      </div>
      <Footer />
    </section>
  );
};

export default Post;
