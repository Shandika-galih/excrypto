import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import CryptoCoin from "./CryptoCoin.js";

const { DataTypes } = Sequelize;
const CryptoCoinNetwork = db.define(
  "CryptoCoinNetwork",
  {
     uuid:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        allowNull:false,
        validate:{
            notEmpty:true
        }
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notEmpty:true,
            len:[3,100]
        }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
      validate: {
        notEmpty: true,
      },
    },
    
    kode:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            notEmpty:true,
        }
    },
    admin_fee:{
        type:DataTypes.DECIMAL,
        allowNull:false,
        validate:{
            notEmpty:true,
        }
    },
    logo:{
        type:DataTypes.STRING,
        allowNull:true
    },
    rpc_url : {
        type : DataTypes.STRING,
        allowNull : true,
        unique: true
    },
    chain_id : {
        type : DataTypes.STRING,
        allowNull : true,
        unique: true
    },
    coin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },

    
},{
    tableName:"crypto_coin_network_tbl"
});


CryptoCoinNetwork.belongsTo(CryptoCoin, {
  foreignKey: "coin_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});



export default CryptoCoinNetwork;
