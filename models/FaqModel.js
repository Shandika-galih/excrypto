import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const FAQ = db.define(
  "faq_tbl",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    question: {
      type: DataTypes.TEXT, // bisa menyimpan HTML
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT, // bisa menyimpan HTML
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default FAQ;
