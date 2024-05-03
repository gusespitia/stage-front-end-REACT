import { HashRouter as Router, Route, NavLink, Routes } from "react-router-dom";
import Userfront from "@userfront/toolkit/react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Reset from "./components/Reset";
import Register from "./components/Register";
import Layout from "./components/Layout";
import Profile from "./components/Profile";
import Post from "./components/Post";
import Posts from "./components/Posts";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import Inactive from "./components/Inactive";
import Home from "./components/Home";

Userfront.init("xbpwd96n");

function App() {
  return (
    <Router>
      <Navbar />
      <Layout>
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post" element={<Post />} />
          <Route path="/inactive" element={<Inactive />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="*" element={<NotFound />} />
          {/* Manejar rutas no encontradas */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
