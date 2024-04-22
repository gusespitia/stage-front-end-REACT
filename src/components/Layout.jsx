// En tu componente Layout.jsx

import Sidebar from "@/components/Sidebar";
import "../app/globals.css";
import Header from "./Header";

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  return (
    <div className={`flex items-start justify-between`}>
      <Sidebar />
      <main
        style={{ fontFamily: "'Inter', sans-serif" }}
        className="w-full h-full pl-[240px] grid">
        <Header />
        {children}
      </main>
    </div>
  );
};

export default Layout;