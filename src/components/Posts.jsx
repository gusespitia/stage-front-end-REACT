import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Userfront from "@userfront/toolkit/react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import Footer from "./Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Post = () => {
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!Userfront.accessToken()) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.userfront.com/v0/tenants/xbpwd96n/users/find",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer uf_test_admin_xbpwd96n_c9a7bff77e3d3552fca270f56c9b50ea",
            },
            body: JSON.stringify({
              filters: {
                conjunction: "and",
                filterGroups: [
                  {
                    conjunction: "and",
                    filters: [],
                  },
                ],
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserData(data.results);
          //console.log(data.results);
        } else {
          console.error(
            "Error en la respuesta de la solicitud:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchPosts = async (userId) => {
    try {
      const response = await fetch(
        `https://back-end-knex-js.vercel.app/users/posts/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      // console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!Userfront.accessToken()) {
        navigate("/login");
        return;
      }

      if (!userData) return;

      try {
        let allPosts = [];
        for (const user of userData) {
          const userPosts = await fetchPosts(user.userId);
          allPosts = [...allPosts, ...userPosts];
        }
        setPosts(allPosts);
        // console.log(allPosts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchUserPosts();
  }, [navigate, userData]);

  return (
    <section className="mt-16 md:ml-0 md:mx-1 lg:ml-52 box-content max-w-screen-xl bg-gray-400 border rounded-xl px-4 flex flex-col sm:mx-2 sm:mt-[68px] sm:ml-12 sm:mb-6 overflow-x-auto xs:ml-9 ">
      <div className="border rounded-md xs:mt-4 xs:p-4">
        <h1 className="text-[20px] font-bold m-4 text-center sm:mb-8 sm:mx-auto xs:my-1">
          Here you can see all posts made by users!
        </h1>
        {userData?.map((user, index) => (
          <div key={index}>
            <section className="bg-white  border rounded-md p-1 mt-4 lg:mr-28 sm:mx-4">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="p-2 w-full">
                  <AccordionTrigger className="grid">
                    <div className="justify-center items-center w-[80px] h-auto border rounded-md shadow-md sm:mb-2">
                      <img
                        src={user.image}
                        className="object-fit w-full h-auto  "
                        alt={"Avatar of the user: " + user.name}
                      />
                    </div>
                    <p className="text-[16px] ">
                      Posts by
                      <strong className="ml-2">
                        {user.name ? user.name : user.username}!
                      </strong>
                    </p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <div>
                        {posts.map(
                          (post) =>
                            // Coloca la condición fuera del map de posts
                            user.userId &&
                            post.user_id === user.userId && (
                              <div
                                key={post.id}
                                className="px-3 border rounded-2xl py-4 mt-4 mb-2 shadow-md bg-white">
                                <ul className="grid grid-cols-2 grid-cols-custom gap-y-2">
                                  <Label className="col-start-1">Title:</Label>
                                  <li className="text-[14px] text-neutral-500] col-start-2 font-semibold first-letter:uppercase">
                                    {post.title}
                                  </li>
                                  <Label className="col-start-1">Data:</Label>
                                  <div className="text-[14px] text-neutral-500] col-start-2 font-semibold first-letter:uppercase">
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: post.data,
                                      }}
                                    />
                                  </div>
                                  <Separator className="mt-3 col-span-2" />
                                  <li className="text-xs text-neutral-800 col-start-1 col-span-2">
                                    <Label className="col-start-1 text-neutral-800 ">
                                      Posted:
                                    </Label>
                                    <br />
                                    {new Date(
                                      post.created_at
                                    ).toLocaleDateString("en-EN", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      minute: "numeric",
                                      second: "numeric",
                                    })}
                                  </li>
                                </ul>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </div>
        ))}
      </div>
      <Footer />
    </section>
  );
};

export default Post;
