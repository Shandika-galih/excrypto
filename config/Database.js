import {Sequelize} from 'sequelize';
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(process.env.DB, process.env.DBUSER, process.env.DBPASSWORD, {
    host:process.env.DBHOST,
    dialect:'mysql'
});

export default db;