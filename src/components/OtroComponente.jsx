// OtroComponente.js

import { useUser } from "./UserContext"; // Importa el hook useUser para acceder al contexto de usuario

const OtroComponente = () => {
  const { userData } = useUser(); // Obtiene el valor de userData desde el contexto

  return (
    <div>
      {userData && (
        <section>
          <p>
            Nombre de usuario: {userData.username}, Email: {userData.email}
          </p>
          <p>
            Nombre de usuario: {userData.username}, Email: {userData.email}
          </p>
          <p>
            Nombre de usuario: {userData.username}, Email: {userData.email}
          </p>
          <p>
            Nombre de usuario: {userData.username}, Email: {userData.email}
          </p>
          <p>
            Nombre de usuario: {userData.username}, Email: {userData.email}
          </p>
        </section>
      )}
    </div>
  );
};

export default OtroComponente;
