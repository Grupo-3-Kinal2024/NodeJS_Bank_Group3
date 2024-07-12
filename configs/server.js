"use strict";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "../src/auth/auth.routes.js";
import accountRoutes from "../src/modules/account/account.routes.js";
import userRoutes from "../src/modules/user/user.routes.js";
import favoriteRoutes from "../src/modules/favorite/favorite.routes.js";
import transactionRoutes from "../src/modules/transaction/transaction.routes.js";
import productRoutes from "../src/modules/product/product.routes.js";
import { dbConnection } from "./mongo.js";
import User from "../src/modules/user/user.model.js";
import bcrypt from 'bcryptjs';

class Server {
  constructor() {
    this.notes();
    this.app = express();
    this.port = process.env.PORT;
    this.authPath = "/bank/v1/auth";
    this.accountPath = "/bank/v1/account";
    this.userPath = "/bank/v1/user";
    this.transactionPath = "/bank/v1/transaction";
    this.productPath = "/bank/v1/product";
    this.favoritePath = "/bank/v1/favorite";

    this.middlewares();
    this.conectDB();
    this.routes();
  }

  async conectDB() {
    await dbConnection();
    await this.createUserDefault(); // Llamada a la creación de usuario por defecto
  }

  routes() {
    this.app.use(this.authPath, authRoutes);
    this.app.use(this.accountPath, accountRoutes);
    this.app.use(this.userPath, userRoutes);
    this.app.use(this.transactionPath, transactionRoutes);
    this.app.use(this.productPath, productRoutes);
    this.app.use(this.transactionPath, transactionRoutes);
    this.app.use(this.favoritePath, favoriteRoutes);
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

  async createUserDefault() {
    try {
      const defaultUser = await User.findOne({ userName: 'admin' });

      if (!defaultUser) {
        const hashedPassword = await bcrypt.hash('admin', 10); // Hash de la contraseña predeterminada
        const newUser = new User({
          DPI: '000000000000',
          name: 'Admin',
          lastName: 'User',
          userName: 'admin',
          email: 'admin@gmail.com',
          pass: hashedPassword,
          role: 'ADMIN',
          phone: '0000000000',
          address: 'Admin Address',
          jobName: 'Administrator'
        });

        await newUser.save();
        console.log("Default admin user created.");
      } else {
        console.log("Default admin user already exists.");
      }
    } catch (error) {
      console.error("Error creating default admin user:", error);
    }
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
