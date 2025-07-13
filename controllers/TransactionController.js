import TransactionModel from "../models/Transaction.js";
import {
  createTransactionServiceMidtrans,
  verifyPaymentService,
  calculateAdminFeeService,
  getMyTransactionsService,
  getTransactionsAdminService,
} from "../services/TransactionService.js";
import CryptoCoinNetwork from "../models/CryptoCoinNetwork.js";
import CryptoCoin from "../models/CryptoCoin.js";
import Bank from "../models/Bank.js";

// GET ALL
export const getTransactions = async (req, res) => {
  try {
    const transaction = await TransactionModel.findAll({
      attributes: [
        "id",
        "uuid",
        "email_user",
        "coin_network_id",
        "total_pembayaran",
        "status",
        "payment_type_id",
        "va_account",
        "qris_link",
        "expiry_time",
        "reciever_wallet_address",
      ],
    });
    res.status(200).json({ data: transaction });
  } catch (error) {
    res.status(error.status || 500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

// GET BY ID
export const getTransactionById = async (req, res) => {
  const id = req.params.id;
  try {
    const transaction = await TransactionModel.findOne({
      attributes: [
        "id",
        "uuid",
        "email_user",
        "coin_network_id",
        "total_pembayaran",
        "status",
        "payment_type_id",
        "coin_amount",
        "va_account",
        "qris_link",
        "expiry_time",
        "reciever_wallet_address",
        "updatedAt",
        "createdAt",
      ],
      where: { uuid: id },
      include: [{ model: CryptoCoinNetwork, include: CryptoCoin }, Bank],
    });
    res.status(200).json({ data: transaction });
  } catch (err) {
    res.status(err.status || 500).json({
      msg: "Internal server error",
      error: err.message,
    });
  }
};

// CREATE TRANSACTION
export const createTransaction = async (req, res) => {
  try {
    const transaction = await createTransactionServiceMidtrans(req);
    res.status(201).json({
      msg: "Transaction successfully created",
      data: transaction,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      msg: "Internal server error",
      error: err.message,
    });
  }
};

// VERIFY PAYMENT (MIDTRANS CALLBACK)
export const verifyPayment = async (req, res) => {
  const {
    order_id,
    status_code,
    gross_amount,
    transaction_status,
    signature_key,
  } = req.body;

  try {
    const data = await verifyPaymentService(
      order_id,
      status_code,
      gross_amount,
      transaction_status,
      signature_key
    );
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({
      msg: "Internal server error",
      error: err.message,
    });
  }
};

// ADMIN FEE DETAIL
export const calculateAdminFee = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const adminFee = await calculateAdminFeeService(transactionId);
    res.status(201).json({
      msg: "Transaction successfully created",
      data: adminFee,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

// MY TRANSACTIONS (LIMITED)
export const getMyTransactions = async (req, res) => {
  try {
    const result = await getMyTransactionsService(req.session.userId);
    if (result.error) {
      return res.status(result.status).json({ msg: result.msg });
    }
    res.status(200).json({ data: result.data });
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

// ADMIN PAGINATED
export const getTransactionsAdmin = async (req, res) => {
  try {
    const result = await getTransactionsAdminService(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

export const updateTransaction = (req, res) => {};
export const deleteTransaction = (req, res) => {};
