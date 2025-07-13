import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import PaymentMethod from "./PaymentMethod.js"; // Pastikan ini di-import

const { DataTypes } = Sequelize;

const Bank = db.define(
  "Bank",
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
      validate: {
        notEmpty: true,
      },
    },
    admin_fee_percentage: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    minimum_transaction: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    maksimum_transaction: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    expiry_minute: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    tableName: "bank_tbl",
  }
);

// Relasi setelah define
Bank.belongsTo(PaymentMethod, {
  foreignKey: "payment_method_id",
  as: "PaymentMethod",
});

export default Bank;
