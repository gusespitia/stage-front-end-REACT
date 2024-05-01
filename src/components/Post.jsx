import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Userfront from "@userfront/toolkit/react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Editor from "react-simple-wysiwyg";
import { Button } from "@/components/ui/button";

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

      window.location.href = "/gus";
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
    <div className="px-24 mt-28">
      {userData && (
        <section className="bg-slate-200 p-2 border pb-10 rounded-sm mt-2">
          {" "}
          <h1 className="text-3xl font-bold m-4 text-center">
            Here you can post your thoughts
          </h1>
          <div className="flex items-start justify-center gap-1 ">
            <div>
              <img
                src={userData.image}
                className="min-h-10 min-w-10 max-w-[120px] bg-emerald-500 p-1 mb-3"
                alt={"Avatar of the user: " + userData.name}
              />
              <p className="font-bold text-[16px] ">Hello {userData.name}!</p>
            </div>
            <div>
              <div>
                <div className="grid w-full max-w-sm gap-1.5">
                  <form onSubmit={handleSubmit} className="mx-24 mt-5">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      type="text"
                      id="title"
                      placeholder="Enter your post title"
                      name="title"
                      value={postTitle}
                      onChange={(event) => setPostTitle(event.target.value)}
                    />
                    {titleError && <p className="text-red-500">{titleError}</p>}
                    <Label htmlFor="data">Data</Label>
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
              </div>
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="px-6 border rounded-2xl py-6 mt-4 mb-2 w-[600px] shadow-md bg-white flex ">
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
                      <Label className="col-start-1 text-neutral-800 ">
                        Posted:
                      </Label>
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
          </div>
        </section>
      )}
    </div>
  );
};

export default Post;
