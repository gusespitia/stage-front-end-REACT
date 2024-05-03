import Sidebar from "@/components/Sidebar";
import "../app/globals.css";


const Layout = ({ children }) => {
  return (
    <div className={`flex items-start justify-between md:relative`}>
      <Sidebar />
      <main
        style={{ fontFamily: "'Inter', sans-serif" }}
        className="w-full h-full md:pl-[60px] grid">  
        {children}
      </main>
    </div>
  );
};

export default Layout;
