import CryptoCoinNetwork from "../models/CryptoCoinNetwork.js";
import { Op } from "sequelize";

export const getCryptoCoinNetworkById = async (id) => {
  return await CryptoCoinNetwork.findOne({
    where: {
      uuid: id,
    },
  });
};

export const deleteCryptoCoinNetwork = async (id) => {
  return await CryptoCoinNetwork.destroy({ where: { uuid: id } });
};

export const saveCryptoCoinNetwork = async (
  name,
  kode,
  admin_fee,
  logoPath,
  rpc_url,
  status,
  chain_id,
  coin_id
) => {
  const cryptoCoin = await CryptoCoinNetwork.create({
    name: name,
    kode: kode,
    admin_fee: parseFloat(admin_fee),
    logo: logoPath,
    rpc_url: rpc_url,
    status: status,
    chain_id: chain_id,
    coin_id: coin_id,
  });

  return cryptoCoin;
};
export const getCryptoCoinNetworksService = async ({
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
            { status: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const networks = await CryptoCoinNetwork.findAll({
      where: whereCondition,
      order: [[orderBy, orderDirection.toUpperCase()]],
      limit: limit,
      offset: offset,
    });
    const totalCount = await CryptoCoinNetwork.count({ where: whereCondition });

    return {
      data: networks,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error in service:", error.message);
    throw error;
  }
};
