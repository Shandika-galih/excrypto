import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, type = "signup") => {
  const user = await Users.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const url =
    type === "reset"
      ? `http://localhost:5173/reset-password?token=${token}`
      : `http://localhost:5173/verify-email?token=${token}`;

  const htmlContent =
    type === "reset"
      ? `<p>Klik untuk reset password: <a href="${url}">Reset Password</a></p>`
      : `<p>Klik untuk verifikasi akun: <a href="${url}">Verifikasi Akun</a></p>`;

  await transporter.sendMail({
    from: `"Crypto App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: type === "reset" ? "Reset Password" : "Verifikasi Email",
    html: htmlContent,
  });

  await user.update({ verify_token: token });
};
