"use strict";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "../src/auth/auth.routes.js";
import accountRoutes from "../src/modules/account/account.routes.js";
import userRoutes from "../src/modules/user/user.routes.js";
import transactionRoutes from "../src/modules/transaction/transaction.routes.js";
import { dbConnection } from "./mongo.js";
// import routes from 'routes.js';

class Server {
  constructor() {
    this.notes();
    this.app = express();
    this.port = process.env.PORT;
    this.authPath = "/bank/v1/auth";
    this.accountPath = "/bank/v1/account";
    this.userPath = "/bank/v1/user";
    this.transactionPath = "/bank/v1/transaction";

    this.middlewares();
    this.conectDB();
    this.routes();
  }

  async conectDB() {
    await dbConnection();
  }

  routes() {
    this.app.use(this.authPath, authRoutes);
    this.app.use(this.accountPath, accountRoutes);
    this.app.use(this.userPath, userRoutes);
    this.app.use(this.transactionPath, transactionRoutes);  
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
    this.app.use(express.json());
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port ", this.port);
    });
  }

  notes() {
    console.log("");
    console.log("");
    console.log("NOTE: Server constructor called!");
    console.log("if port 3000 is in use:");
    console.log("netstat -ano | findstr :3000");
    console.log("taskkill /PID <PID> /F");
    console.log("");
  }
}

export default Server;
