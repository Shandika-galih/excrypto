// socket/socketHandler.js
import { saveMessage } from "../services/ChatService.js";

export const socketHandler = (socket, io) => {
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("sendMessage", async ({ roomId, sender, message }) => {
    try {
      if (!roomId || !message || !sender) return;

      await saveMessage({ roomId, sender, message });

      io.to(roomId).emit("receiveMessage", {
        roomId,
        sender,
        message,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Gagal kirim pesan:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
};
