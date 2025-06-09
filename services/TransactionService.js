import axios from "axios";
import TransactionModel from "../models/Transaction.js";
import crypto from "crypto";
import Bank from "../models/Bank.js";
import CryptoCoinNetwork from "../models/CryptoCoinNetwork.js";
import CryptoCoin from "../models/CryptoCoin.js";
import { stat } from "fs";

export const createTransactionServiceQris = async (req) => {
  const {
    email_user,
    coin_network_id,
    total_pembayaran,
    payment_type_id,
    reciever_wallet_address,
  } = req.body;
  try {
    const bank = await Bank.findOne({
      where: {
        id: payment_type_id,
      },
    });

    if (!bank) throw new Error("Payment method do not support");

    const transaction = await TransactionModel.create({
      email_user: email_user,
      coin_network_id: coin_network_id,
      total_pembayaran: total_pembayaran,
      payment_type_id: payment_type_id,
      reciever_wallet_address: reciever_wallet_address,
    });
    if (!transaction) {
      throw new Error("Failed to create transactions");
    }

    const response = await axios.post(
      process.env.MIDTRANS_ENDPOINT,
      {
        payment_type: "gopay",
        transaction_details: {
          order_id: transaction.uuid,
          gross_amount: transaction.total_pembayaran,
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.MIDTRANS_SERVER_KEY + ":"
          ).toString("base64")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.status === 201 || response.status === 200) {
      const actions = response.data.actions;
      let actionsMap = {};
      actions.forEach((action, index) => {
        actionsMap[action["name"]] = action["url"];
      });

      const transactionStatus = await getTransactionStatus(
        actionsMap["get-status"]
      );

      transaction.expiry_time = transactionStatus.expiry_time;
      transaction.qris_link = actionsMap["generate-qr-code"];
      transaction.midtrans_ct_response = response.data;

      await transaction.save();
    }
    return {
      transaction: transaction,
      midtrans_res: response.data,
    };
  } catch (error) {
    throw error;
  }
};

const getTransactionStatus = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.MIDTRANS_SERVER_KEY + ":"
        ).toString("base64")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (err) {
    throw err;
  }
};

export const verifyPaymentService = async (
  order_id,
  status_code,
  gross_amount,
  transaction_status,
  signature_key
) => {
  let status = "pending";
  try {
    const expectedSignature = crypto
      .createHash("sha512")
      .update(
        order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY
      )
      .digest("hex");

    if (expectedSignature != signature_key) {
      const error = new Error("Invalid Signature key");
      error.status = 400;
      throw error;
    }

    let transaction = await TransactionModel.findOne({where:{
      uuid : order_id,
    }})

    if(!transaction){
      const error = new Error(`Transaction with id ${order_id} not found`);
      error.status = 400;
      throw error;
    }

    if(transaction_status === 'settlement'){
      status = 'paid';
    }else if(transaction_status === 'expire'){
      status = 'expired';
    }

    transaction.status = status;

    transaction = await transaction.save();
    return {message : `Success`};

  } catch (error) {
    throw error;
  }
};

export const getTransactionById = async (uuid) => {
  try {
    const transaction = await TransactionModel.findOne({
      where: {
        uuid: uuid,
      },
    });

    if (!transaction) {
      let error = new Error(`Transaction with id ${uuid} not found`);
      error.status = 404;
      throw error;
    }
  } catch (err) {
    throw err;
  }
};

export const calculateAdminFeeService = async(transactionId) => {
  try {
    const transaction = await TransactionModel.findOne({
      where: {
        uuid: transactionId,
      },
      include: [
        {
          model: CryptoCoinNetwork,
          include : CryptoCoin
        },
        {
          model: Bank,
        },
      ],
    });

    if(!transaction){
      const error = new Error(`Transaction with id ${transactionId} not found`);
      error.status = 404;
      throw error;
    }
    return transaction;
  } catch (error) {
    throw error;
  }
};
