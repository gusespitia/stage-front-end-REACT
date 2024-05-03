import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { USERFRONT_PUBLIC_KEY } from "./enviroment.js";
import request from "request";

const app = express();
const port = 3001;

// Middleware para permitir solicitudes CORS desde localhost:5173
app.use(cors());

// Middleware para autenticación de token JWT
const authenticationToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token de autenticación no proporcionado" });
  }

  try {
    const auth = await jwt.verify(token, USERFRONT_PUBLIC_KEY);
    req.auth = auth;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token de autenticación inválido" });
  }
};

// Ruta protegida que requiere autenticación mediante token JWT
app.get("/data", authenticationToken, (req, res) => {
  return res.json({
    someSecretData: "¡Shhh! Esto es secreto",
  });
});

// Middleware para redirigir las solicitudes a tu servidor en Vercel
app.use("/api", (req, res) => {
  const url = "https://back-end-knex-js.vercel.app" + req.originalUrl;
  req.pipe(request(url)).pipe(res);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor proxy en ejecución en http://localhost:${port}`);
});
