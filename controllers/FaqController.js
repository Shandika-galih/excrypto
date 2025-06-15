import {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../services/FaqService.js";

export const getFaqs = async (req, res) => {
  try {
    const faqs = await getAllFaqs();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getFaq = async (req, res) => {
  try {
    const faq = await getFaqById(req.params.uuid);
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const postFaq = async (req, res) => {
  try {
    const data = req.body;
    const faq = await createFaq(data);
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const patchFaq = async (req, res) => {
  try {
    const faq = await updateFaq(req.params.uuid, req.body);
    res.status(200).json(faq);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteFaqById = async (req, res) => {
  try {
    await deleteFaq(req.params.uuid);
    res.status(200).json({ msg: "FAQ deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
