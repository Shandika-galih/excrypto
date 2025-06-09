import {Sequelize} from 'sequelize';
import db from '../config/Database.js'

const {DataTypes} = Sequelize;

const CryptoCoin = db.define('CryptoCoin',{

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
        allowNull:false,
        validate:{
            notEmpty:true,
        }
    },
    wss_indodax_price_code : {
        type : DataTypes.STRING,
        allowNull : true,
        unique: true
    },
    api_indodax_price_code :{
        type: DataTypes.STRING,
        allowNull:true,
        unique:true
    }
    
},{
    tableName:"crypto_coin_tbl"
})
export default CryptoCoin;