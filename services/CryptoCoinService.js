import CryptoCoin from "../models/CryptoCoin.js";
import { Op } from "sequelize";

export const getCryptoCoinById = async (id) => {
  return await CryptoCoin.findOne({
    where: {
      uuid: id,
    },
  });
};

export const deleteCryptoCoin = async (id) => {
  return await CryptoCoin.destroy({ where: { uuid: id } });
};

export const saveCryptoCoin = async ({
  name,
  kode,
  admin_fee,
  logoPath,
  coin_id,
}) => {
  const cryptoCoin = await CryptoCoin.create({
    name: name,
    kode: kode,
    admin_fee: parseFloat(admin_fee),
    logo: logoPath,
    coin_id,
  });

  return cryptoCoin;
};

export const getCryptoCoinsService = async ({
  page = 1,
  limit = 10,
  search = "",
  orderBy = "name",
  orderDirection = "ASC",
}) => {
  try {
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page <= 0) page = 1;
    if (isNaN(limit) || limit <= 0) limit = 10;

    const offset = (page - 1) * limit;

    const whereCondition = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { kode: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};
    const coins = await CryptoCoin.findAll({
      where: whereCondition,
      order: [[orderBy, orderDirection.toUpperCase()]],
      limit: limit,
      offset: offset,
    });

    const totalCount = await CryptoCoin.count({ where: whereCondition });

    return {
      data: coins,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error in service:", error.message);
    throw error;
  }
};
