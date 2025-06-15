import Users from "../models/UserModel.js";

export const auth = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ msg: "Mohon login ke akun anda" });
    }

    const user = await Users.findOne({
      where: { uuid: req.session.userId },
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    req.userId = user.id;
    req.role = user.role;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

export const admin = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ msg: "Mohon login ke akun anda" });
    }

    const user = await Users.findOne({
      where: { uuid: req.session.userId },
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Akses ditolak: hanya admin yang dapat mengakses" });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error.message);
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};
