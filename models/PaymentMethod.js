import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Bank from "./Bank.js";

const { DataTypes } = Sequelize;

const PaymentMethod = db.define(
  "PaymentMethod",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
  },
  { tableName: "payment_method_tbl" }
);

export default PaymentMethod;
