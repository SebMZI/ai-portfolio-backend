import "./config/env.config.js";
import express from "express";
const app = express();

app.listen(process.env.PORT, () => {
  console.log(`server is running on localhost:${process.env.PORT}`);
});
