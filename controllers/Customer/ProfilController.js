
import UserModel from "../../models/UserModel.js";

export const getProfile = async (req, res) => {
  let uuid = req.session.userId;
  try {
    const user = await UserModel.findOne({
      where: {
        uuid: uuid,
      },
    });
    
    res.status(200).json(user);
  } catch (error) {
    res.status(error.status || 500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};
