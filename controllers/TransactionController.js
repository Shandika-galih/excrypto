import TransactionModel from "../models/Transaction.js";
import {
  createTransactionServiceQris,
  verifyPaymentService,
  calculateAdminFeeService,
  getMyTransactionsService,
  getTransactionsAdminService,
} from "../services/TransactionService.js";

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
    res.status(200).json({
      data: transaction,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

export const getTransactionById = async (req, res) => {
  const id = req.params.uuid;
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
        "va_account",
        "qris_link",
        "expiry_time",
        "reciever_wallet_address",
      ],
      where: {
        uuid: id,
      },
    });
    res.status(200).json({
      data: transaction,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      msg: "Internal server error",
      error: err.message,
    });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const transaction = await createTransactionServiceQris(req);

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

export const verifyPayment = async (req, res) => {
  const {
    order_id,
    status_code,
    gross_amount,
    transaction_status,
    signature_key,
  } = req.body;

  try {
    var data = await verifyPaymentService(
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

export const getMyTransactions = async (req, res) => {
  try {
    const result = await getMyTransactionsService(req.userId);
    if (result.error) {
      return res.status(result.status).json({ msg: result.msg });
    }
    res.status(200).json({
      data: result.data,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

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
