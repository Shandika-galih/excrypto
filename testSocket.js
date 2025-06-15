// testSocket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("✅ Connected as:", socket.id);

  socket.emit("joinRoom", "room_test");

  socket.emit("sendMessage", {
    roomId: "room_test",
    sender: "CLI Tester",
    message: "Halo dari terminal",
  });
});
socket.emit("sendMessage", {
  sender: "user1",
  receiver: "admin",
  message: "Halo admin dari terminal!",
});

socket.on("receiveMessage", (msg) => {
  console.log("📩 Pesan diterima:", msg);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});
