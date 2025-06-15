import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import CryptoCoinNetwork from '../models/CryptoCoinNetwork.js';
import Users from "./UserModel.js";
import Bank from "./Bank.js";

const { DataTypes } = Sequelize;
const TransactionModel = db.define(
  "TransactionModel",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email_user: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    coin_network_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    coin_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    total_pembayaran: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
      validate: {
        notEmpty: true,
      },
    },
    payment_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    va_account: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    qris_link: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    expiry_time: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
    blockchain_tx_hash : {
      type : DataTypes.STRING,
      allowNull : true

    },
    reciever_wallet_address:{
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : true
      }
    },
    midtrans_ct_response : {
      type : DataTypes.JSON,
      allowNull : true
    }
  },
  {
    tableName: "transaction_tbl",
  }
);



TransactionModel.belongsTo(CryptoCoinNetwork, {
  foreignKey: "coin_network_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

TransactionModel.belongsTo(Users, {
  foreignKey: "email_user",
  targetKey : 'email',
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

TransactionModel.belongsTo(Bank, {
  foreignKey : 'payment_type_id',
  targetKey : "id",
  onDelete : 'SET NULL',
  onUpdate : 'CASCADE'

});




export default TransactionModel;
