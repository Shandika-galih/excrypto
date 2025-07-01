import {Sequelize} from 'sequelize';
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(process.env.DB, process.env.DBUSER, process.env.DBPASSWORD, {
    host:process.env.DBHOST,
    dialect:'mysql',
    timezone: "+07:00",
    logging: process.env.ENV === "development" ? (...msg) => console.log(msg) : false,
});

export default db;