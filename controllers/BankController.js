import Bank from "../models/Bank.js";

export const getBanks = async (req, res) => {
  try {
    const data = await Bank.findAll({
      attributes: ["id", "uuid", "name", "admin_fee_percentage", "expiry_minute", "payment_method_id", "minimum_transaction", "maksimum_transaction"],
    });
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

export const getBankById = async (req, res) => {
  const id = req.params.uuid;
  try {
    const data = await Bank.findOne({
      attributes: ["id", "uuid", "name", "admin_fee_percentage", "expiry_minute", "payment_method_id", "minimum_transaction", "maksimum_transaction"],
      where: {
        uuid: id,
      },
    });

    res.status(200).json({
      data: data,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

export const createBank = async (req, res) => {
  const {
    name,
    admin_fee_percentage,
    expiry_minute,
    payment_method_id,
    minimum_transaction,
    maksimum_transaction,
  } = req.body;

  try {
    const data = await Bank.create({
      name: name,
      admin_fee_percentage : admin_fee_percentage,
      expiry_minute : expiry_minute,
      payment_method_id : payment_method_id,
      minimum_transaction : minimum_transaction,
      maksimum_transaction : maksimum_transaction
    });

    res.status(201).json({
      msg: "Successfully added new bank",
      data: data,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

export const updateBank = async (req, res) => {
  const uuid = req.params.uuid;
  const {
    name,
    admin_fee_percentage,
    expiry_minute,
    payment_method_id,
    minimum_transaction,
    maksimum_transaction,
  } = req.body;

  try {
    const bank = await Bank.findOne({
      where: {
        uuid: uuid,
      },
    });

    if (!bank) {
      const err = new Error(`Bank with id ${uuid} not found`);
      err.status = 404;
      throw err;
    }

    bank.name = name ?? bank.name;
    bank.admin_fee_percentage = admin_fee_percentage ?? bank.admin_fee_percentage;
    bank.expiry_minute = expiry_minute ?? bank.expiry_minute;
    bank.payment_method_id = payment_method_id ?? bank.payment_method_id;
    bank.maksimum_transaction = maksimum_transaction ?? bank.maksimum_transaction;
    bank.minimum_transaction = minimum_transaction ?? bank.maksimum_transaction;

    const updatedBank = await bank.save();

    res.status(200).json({
      msg: "Bank successfully updated",
      data: updatedBank,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteBank = async (req, res) => {
  const uuid = req.params.uuid;

  try {
    const bank = await Bank.findOne({
      where: {
        uuid: uuid,
      },
    });

    if (!bank) {
      const err = new Error(`Bank with id ${uuid} not found`);
      err.status = 404;
      throw err;
    }

    await Bank.destroy({
      where: {
        uuid: uuid,
      },
    });

    res.status(200).json({
      msg: `Bank ${bank.name} successfully deleted`,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};
