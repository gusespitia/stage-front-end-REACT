import "../app/globals.css";

// eslint-disable-next-line react/prop-types
const Layouts = ({ children }) => {
  return (
    <div className={`flex items-start justify-between`}>
      <main
        style={{ fontFamily: "'Inter', sans-serif" }}
        className="w-full h-full pl-[260px] grid">
        {children}
      </main>
    </div>
  );
};

export default Layouts;
