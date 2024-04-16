import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { USERFRONT_PUBLIC_KEY } from "./enviroment.js";

const app = express();
app.use(cors());

const authenticationToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "BAD TOKEN!!!!" });
  }
  try {
    const auth = await jwt.verify(token, USERFRONT_PUBLIC_KEY);
    req.auth = auth;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Bad Token" });
  }
};

app.get('/data', authenticationToken, (req, res) => {
  return res.json({
    someSecretData: "shhh!!!",
  });
});
app.listen(3010, () => console.log("App listening on port 3010"));
