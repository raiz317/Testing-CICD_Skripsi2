import supplierModel from "../models/supplierModel.js";

const supplierController = {
  getAllSupplier: async (req, res) => {
    try {
      const suppliers = await supplierModel.allSupplier();
      return res.json(suppliers);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  createSupplier: async (req, res) => {
    const { supplier, industry, email, phone } = req.body;
    try {
      const insertId = await supplierModel.create({
        supplier,
        industry,
        email,
        phone,
      });
      return res
        .status(201)
        .json({ id: insertId, supplier, industry, email, phone });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateSupplier: async (req, res) => {
    const { id } = req.params;
    const { supplier, industry, email, phone } = req.body;
    try {
      await supplierModel.update(id, { supplier, industry, email, phone });
      return res.json({ message: "Data supplier berhasil diperbarui" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteSupplier: async (req, res) => {
    const { id } = req.params;
    try {
      await supplierModel.delete(id);
      return res.json({ message: "Supplier berhasil dihapus!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default supplierController;
