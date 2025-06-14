// services/userService.js
import Users from "../models/UserModel.js";
import { Op } from "sequelize"; // Menggunakan operator untuk query pencarian dan filter

export const getUsersService = async ({
  page = 1,
  limit = 10,
  search = "",
  orderBy = "name",
  orderDirection = "ASC",
}) => {
  try {
    // Menghitung offset untuk pagination
    page = parseInt(page);
    limit = parseInt(limit);

    // Validasi parameter limit dan page
    if (isNaN(page) || page <= 0) page = 1;
    if (isNaN(limit) || limit <= 0) limit = 10;

    const offset = (page - 1) * limit;

    // Membangun kondisi pencarian
    const whereCondition = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    // Mengambil data user berdasarkan query dengan pagination, pencarian, dan urutan
    const users = await Users.findAll({
      where: whereCondition,
      order: [[orderBy, orderDirection.toUpperCase()]], // Urutkan berdasarkan kolom yang dipilih
      limit: limit,
      offset: offset,
    });

    // Menghitung total user yang ada di database untuk pagination
    const totalCount = await Users.count({ where: whereCondition });

    return {
      data: users,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error in service:", error.message);
    throw error; // Lempar error agar dapat ditangani oleh controller
  }
};
