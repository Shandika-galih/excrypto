import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import SequelizeStore from "connect-session-sequelize";
import path from "path";
import db from "./config/Database.js";
import { socketHandler } from "./socket/socketHandler.js";
import FaqRoute from "./routes/FaqRoute.js";

import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import CryptoRoute from "./routes/CryptoRoute.js";
import CryptoCoinRoute from "./routes/CryptoCoinRoute.js";
import TransactionRoute from "./routes/TransactionRoute.js";
import BankRoute from "./routes/BankRoute.js";
import PaymentMethodRoute from "./routes/PaymentMethodRoute.js";
import CryptoCoinNetworkRoute from "./routes/CryptoCoinNetworkRoute.js";
import chatRoutes from "./routes/ChatRoutes.js";
import dotenv from 'dotenv';
import UserRoute from './routes/UserRoute.js';
import ProductRoute from './routes/ProductRoute.js';  
import db from './config/Database.js';
import AuthRoute from './routes/AuthRoute.js';
import SequelizeStore from 'connect-session-sequelize';
import CryptoRoute from './routes/CryptoRoute.js';
import CryptoCoinRoute from './routes/CryptoCoinRoute.js'; 
import TransactionRoute from './routes/TransactionRoute.js';
import BankRoute from './routes/BankRoute.js';
import PaymentMethodRoute from './routes/PaymentMethodRoute.js';
import CryptoCoinNetworkRoute from './routes/CryptoCoinNetworkRoute.js';
import CustomerCryptoCoinRoute from './routes/Customer/CryptoCoinRoute.js';

import path from 'path';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const SequelizeSessionStore = SequelizeStore(session.Store);
const sessionStore = new SequelizeSessionStore({ db });

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "https://api.sandbox.midtrans.com",
      "https://api.midtrans.com",
    ],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(FaqRoute);
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);
app.use(CryptoRoute);
app.use(CryptoCoinRoute);
app.use(TransactionRoute);
app.use(BankRoute);
app.use(PaymentMethodRoute);
app.use(CryptoCoinNetworkRoute);
app.use("/api/chat", chatRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socketHandler(socket, io);
});

/* (async () => {
  try {
    await db.sync();
    console.log("Database synced successfully");
  } catch (err) {
    console.error("Database sync failed:", err);
  }
})(); */

const PORT = process.env.APP_PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


