import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Userfront from "@userfront/toolkit/react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Home from "./components/Home";
import Reset from "./components/Reset";
import Register from "./components/Register";
import Layout from "./components/Layout";
import Profile from "./components/Profile";
import Post from "./components/Post";
import Posts from "./components/Posts";
import Inactive from "./components/Inactive";

Userfront.init("xbpwd96n");

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post" element={<Post />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/inactive" element={<Inactive />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
