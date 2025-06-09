import CryptoCoin from '../models/CryptoCoin.js';

export const getCryptoCoinById = async(id) => {
    return await CryptoCoin.findOne({where : {
        uuid : id,
    }});
}

export const deleteCryptoCoin = async(id) => {
    return await CryptoCoin.destroy({where:{uuid : id}});
}

export const saveCryptoCoin = async ({name,kode, admin_fee, logoPath, coin_id}) => {
    const cryptoCoin = await CryptoCoin.create({
        name : name,
        kode : kode,
        admin_fee : parseFloat(admin_fee),
        logo : logoPath,
        coin_id
    });

    return cryptoCoin;
}
