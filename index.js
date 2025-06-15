import express from "express";
import cors from "cors";
import session from "express-session";
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

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db:db
});

// (async()=>{
//   await db.sync({force:true});

// })();

console.log(db.models);

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
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
      "https://api.midtrans.com/",
    ],
    // origin : "*"
  })
);
app.use(express.json());
app.use(express.urlencoded());
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);
app.use(CryptoRoute);
app.use(CryptoCoinRoute);
app.use(TransactionRoute);
app.use(BankRoute);
app.use(PaymentMethodRoute);
app.use(CryptoCoinNetworkRoute);
app.use(CustomerCryptoCoinRoute);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running");
});


