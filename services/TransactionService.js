import axios from "axios";
import TransactionModel from "../models/Transaction.js";
import UserModel from "../models/UserModel.js";
import crypto from "crypto";
import Bank from "../models/Bank.js";
import CryptoCoinNetwork from "../models/CryptoCoinNetwork.js";
import CryptoCoin from "../models/CryptoCoin.js";
import { getCryptoPrice } from "../services/cryptoService.js";
import { stat } from "fs";
import { Op } from "sequelize";

export const createTransactionServiceQris = async (req) => {
  const {
    email_user,
    coin_network_id,
    total_pembayaran,
    payment_type_id,
    reciever_wallet_address,
    coin_amount,
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
      coin_amount: coin_amount,
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

const sendCryptoToReceiver = async (transaction) => {
  try {
    const network = await CryptoCoinNetwork.findOne({
      where: { id: transaction.coin_network_id },
    });
    if (!network) throw new Error("Network not found");

    const provider = new ethers.JsonRpcProvider(network.rpc_url);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const tx = await wallet.sendTransaction({
      to: transaction.reciever_wallet_address,
      value: ethers.parseUnits(transaction.coin_amount.toString(), "ether"),
    });

    console.log(`Transaction sent with hash: ${tx.hash}`);

    await transaction.update({
      blockchain_tx_hash: tx.hash,
      status: "success",
    });

    console.log("Transaction updated in the database successfully");
    return tx;
  } catch (err) {
    console.error("Failed to send crypto:", err.message);
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

    if (expectedSignature !== signature_key) {
      throw new Error("Invalid Signature key");
    }

    const transaction = await TransactionModel.findOne({
      where: { uuid: order_id },
    });
    if (!transaction) {
      throw new Error(`Transaction with id ${order_id} not found`);
    }

    if (transaction_status === "settlement") {
      status = "paid";
      console.log("Transaction is paid. Proceeding with sending crypto.");
      try {
        await sendCryptoToReceiver(transaction);
      } catch (err) {
        console.error("Error saat mengirim koin:", err.message);
      }
    } else if (transaction_status === "expire") {
      status = "expired";
    }

    transaction.status = status;
    await transaction.save();

    return { message: `Success` };
  } catch (error) {
    throw error;
  }
};

export const calculateAdminFeeService = async (transactionId) => {
  try {
    const transaction = await TransactionModel.findOne({
      where: {
        uuid: transactionId,
      },
      include: [
        {
          model: CryptoCoinNetwork,
          include: CryptoCoin,
        },
        {
          model: Bank,
        },
      ],
    });

    if (!transaction) {
      const error = new Error(`Transaction with id ${transactionId} not found`);
      error.status = 404;
      throw error;
    }
    return transaction;
  } catch (error) {
    throw error;
  }
};

export const getMyTransactionsService = async (userId) => {
  try {
    const user = await UserModel.findOne({
      where: {
        uuid: userId,
      },
      
    });

    if (!user) {
      return { error: true, status: 404, msg: "User not found" };
    }

    const email_user = user.email;
    const transactions = await TransactionModel.findAll({
      where: {
        email_user: email_user,
      },
      include: [
        {
          model: CryptoCoinNetwork,
          include: CryptoCoin,
        },
        {
          model: Bank,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    if (transactions.length === 0) {
      return {
        error: true,
        status: 404,
        msg: "No transactions found for this user",
      };
    }

    return { error: false, data: transactions }; // Kembalikan data transaksi jika ditemukan
  } catch (error) {
    console.error("Error in service:", error.message);
    return { error: true, status: 500, msg: error.message }; // Tangani error jika terjadi
  }
};

export const getTransactionsAdminService = async ({
  page = 1,
  limit = 10,
  search = "",
  orderBy = "createdAt",
  orderDirection = "ASC",
}) => {
  page = parseInt(page);
  limit = parseInt(limit);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;
  const offset = (page - 1) * limit;

  const where = search
    ? {
        [Op.or]: [
          { email_user: { [Op.like]: `%${search}%` } },
          { status: { [Op.like]: `%${search}%` } },
          { reciever_wallet_address: { [Op.like]: `%${search}%` } },
        ],
      }
    : {};

  const data = await TransactionModel.findAll({
    where,
    order: [[orderBy, orderDirection.toUpperCase()]],
    limit,
    offset,
  });

  const total = await TransactionModel.count({ where });

  return {
    data,
    totalCount: total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};