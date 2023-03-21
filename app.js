import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoute from "./routes/userRoute.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/user", userRoute);

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: error,
    status: error.status || 500
  });
});

const URI = `mongodb+srv://${process.env.DB_USER}:${process.env
  .DB_PASS}@${process.env.DB_HOST}/${process.env
  .DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(URI)
  .then(() => {
    console.log("Database Connected 😎");
  })
  .catch(err => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
