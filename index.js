import express from "express";

import { config } from "dotenv";

import path from "path";

config({ path: path.resolve("./Config/config.env") });

import DbConnection from "./DataBase/connection.js";
import * as Routers from "./Src/Modules/index.routes.js";

import cors from 'cors'

import {
  globalErrorResponse,
  globalNotFoundPageError,
} from "./Src/Utils/errorhandling.js";

const port = process.env.PORT;

const app = express();

app.use(express.json());
DbConnection();
app.use(cors())

app.use("/user", Routers.userRouter);
app.use("/task", Routers.taskRouter);
app.use("/category", Routers.categoryRouter);

app.all("*", globalNotFoundPageError);

app.use(globalErrorResponse);

app.listen(port, () => console.log("Server listening on port successfully"));
