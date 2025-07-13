import { sendVerificationEmail } from "../services/AuthService.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import Users from "../models/UserModel.js";

export const requestVerificationEmail = async (req, res) => {
  const { email, type } = req.body;
  try {
    await sendVerificationEmail(email, type);
    res.json({ msg: "Link berhasil dikirim ke email Anda" });
  } catch (error) {
    res.status(500).json({ msg: "Gagal mengirim email", error: error.message });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🕒 Token Info:");
    console.log(
      "  Issued At (iat):",
      new Date(decoded.iat * 1000).toISOString()
    );
    console.log(
      "  Expired At (exp):",
      new Date(decoded.exp * 1000).toISOString()
    );
    console.log("  Now:", new Date().toISOString());

    const user = await Users.findByPk(decoded.id);
    if (!user || user.verify_token !== token) {
      return res.status(400).json({ msg: "Token tidak valid" });
    }

    await user.update({ is_verified: true, verify_token: null });
    res.json({ msg: "Akun berhasil diverifikasi" });
  } catch (error) {
    console.error("❌ Token validation failed:", error.message);
    return res.status(400).json({ msg: "Token tidak valid atau kedaluwarsa" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findByPk(decoded.id);
    if (!user || user.verify_token !== token) {
      return res.status(400).json({ msg: "Token tidak valid" });
    }

    const hashedPassword = await argon2.hash(newPassword); // ✅ pakai argon2
    await user.update({ password: hashedPassword, verify_token: null });

    res.json({ msg: "Password berhasil diubah" });
  } catch (error) {
    console.error("❌ Reset Password Error:", error.message);
    res.status(400).json({ msg: "Token tidak valid atau kedaluwarsa" });
  }
};
