// services/chatService.js
import ChatMessage from "../models/ChatMessage.js";

/**
 * Simpan pesan baru ke database
 */
export const saveMessage = async ({ roomId, sender, message }) => {
  try {
    return await ChatMessage.create({ roomId, sender, message });
  } catch (error) {
    throw new Error("Gagal menyimpan pesan: " + error.message);
  }
};

/**
 * Ambil riwayat pesan berdasarkan roomId
 */
export const getChatHistoryByRoom = async (roomId) => {
  try {
    return await ChatMessage.findAll({
      where: { roomId },
      order: [["createdAt", "ASC"]],
    });
  } catch (error) {
    throw new Error("Gagal mengambil riwayat pesan: " + error.message);
  }
};
