import PaymentMethod from "../models/PaymentMethod.js";

export const getPaymentMethods = async (req, res) => {
  try {
    const data = await PaymentMethod.findAll({
        attributes : ["id", "uuid", "name"],
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

export const getPaymentMethodById = async (req, res) => {
  const id = req.params.uuid;
  try {
    const data = await PaymentMethod.findOne({
      attributes: ["id", "uuid", "name"],
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

export const createPaymentMethod = async (req, res) => {
  const { name } = req.body;

  try {
    const data = await PaymentMethod.create({
      name: name,
    });

    res.status(201).json({
      msg: "Successfully added new payment method",
      data: data,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

export const updatePaymentMethod = async (req, res) => {
  const uuid = req.params.uuid;
  const { name } = req.body;

  try {
    const paymentMethod = await PaymentMethod.findOne({
      where: {
        uuid: uuid,
      },
    });

    if (!paymentMethod) {
      const err = new Error(`Payment method with id ${uuid} not found`);
      err.status = 404;
      throw err;
    }

    paymentMethod.name = name ?? paymentMethod.name;

    const updatedPaymentMethod = await paymentMethod.save();

    res.status(200).json({
      msg: "Payment method successfully updated",
      data: updatedPaymentMethod,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deletePaymentMethod = async (req, res) => {
  const uuid = req.params.uuid;

  try {
    const paymentMethod = await PaymentMethod.findOne({
      where: {
        uuid: uuid,
      },
    });

    if (!paymentMethod) {
      const err = new Error(`Payment method with id ${uuid} not found`);
      err.status = 404;
      throw err;
    }

    await paymentMethod.destroy({
      where: {
        uuid: uuid,
      },
    });

    res.status(200).json({
      msg: `Payment method ${paymentMethod.name} successfully deleted`,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};
