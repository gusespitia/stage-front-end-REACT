import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Userfront from "@userfront/toolkit/react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
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
          console.log(data.results);
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
        console.log(allPosts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchUserPosts();
  }, [navigate, userData]);

  return (
    <>
      <div className="mx-24 mt-1">
        <Separator />
        {userData?.map((user, index) => (
          <div
            key={index}
            className="p-2 border rounded-[10px] my-4 pt-3 shadow-md bg-blue-300">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="p-2 w-full">
                <AccordionTrigger className="grid">
                  <img
                    src={user.image}
                    className="rounded-md min-h-10 min-w-10 max-w-20 bg-emerald-500 p-1 mb-3"
                    alt="picture avatar user"
                  />
                  <p className="font-bold text-[16px] ">
                    Posted by: {user.name ? user.name : user.username}!
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
                              className="px-3 border rounded-2xl py-4 mt-4 mb-2 w-[600px] shadow-md bg-white">
                              <ul className="grid grid-cols-2 grid-cols-custom gap-y-2">
                                <Label className="col-start-1">Title:</Label>
                                <li className="text-[14px] text-neutral-500] col-start-2">
                                  {post.title}
                                </li>
                                <Label className="col-start-1">Data:</Label>
                                <div className="text-[14px] text-neutral-500] col-start-2">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: post.data,
                                    }}
                                  />
                                </div>
                                <Separator className="mt-3 col-span-2" />
                                <li className="text-xs text-neutral-800 col-start-1 col-span-2">
                                  <Label className="col-start-1 text-neutral-800">
                                    Posted:
                                  </Label>
                                  {new Date(post.created_at).toLocaleDateString(
                                    "en-EN",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      minute: "numeric",
                                      second: "numeric",
                                    }
                                  )}
                                </li>
                              </ul>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    </>
  );
};

export default Post;
