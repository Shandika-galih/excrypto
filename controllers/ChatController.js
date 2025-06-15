import { getChatHistoryByRoom } from "../services/chatService.js";

export const getChatHistory = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await getChatHistoryByRoom(roomId);
    res.status(200).json({ data: messages });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};
