import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersAdmin,
} from "../controllers/Users.js";
import { admin, auth } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/users", auth, admin, getUsers);
router.get("/users/:id", auth, getUserById);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", auth, deleteUser);
router.get("/usersAdmin", auth, admin, getUsersAdmin);

export default router;
