import FAQ from "../models/FaqModel.js";

export const getAllFaqs = async () => {
  return await FAQ.findAll();
};

export const getFaqById = async (uuid) => {
  return await FAQ.findOne({ where: { uuid } });
};

export const createFaq = async (data) => {
  return await FAQ.create(data);
};

export const updateFaq = async (uuid, data) => {
  const faq = await getFaqById(uuid);
  if (!faq) throw new Error("FAQ not found");
  return await faq.update(data);
};

export const deleteFaq = async (uuid) => {
  const faq = await getFaqById(uuid);
  if (!faq) throw new Error("FAQ not found");
  return await faq.destroy();
};
