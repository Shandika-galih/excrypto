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
import CustomerCryptoCoinRoute from "./routes/Customer/CryptoCoinRoute.js";
import ChatRoutes from "./routes/ChatRoutes.js";
import BalanceRoute from "./routes/BalanceRoute.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://instacrypto.shop"],
    methods: ["GET", "POST"],
  },
});

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

/* (async () => {
  await db.sync({ alter: true });
})(); */

// Add this middleware BEFORE session and other middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://admin.instacrypto.shop",
    "https://instacrypto.shop",
    "https://api.sandbox.midtrans.com",
    "https://api.midtrans.com",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: false,
      samSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
      //domain : 'localhost'
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "https://instacrypto.shop",
      "https://admin.instacrypto.shop",
      "https://api.sandbox.midtrans.com",
      "https://api.midtrans.com",
	"https://api.sandbox.midtrans.com",
	"https://app.sandbox.midtrans.com",
	"https://api.sandbox.veritrans.co.id",
	"https://simulator.sandbox.midtrans.com",
	"https://api.midtrans.com",
	"https://app.midtrans.com",
	"https://api.veritrans.co.id",
    ],
    allowedHeaders: ["Content-Type", "Authorization"],
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
app.use("/api/chat", ChatRoutes);
app.use(CustomerCryptoCoinRoute);
app.use(BalanceRoute);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socketHandler(socket, io);
});

const PORT = process.env.APP_PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
