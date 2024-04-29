import { uploadFile } from "../firebase/config";
import { useState } from "react";

const Users = () => {
  const [file, setFile] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await uploadFile(file);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name=""
          id=""
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};
export default Users;
