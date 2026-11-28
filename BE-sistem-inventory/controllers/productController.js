import productModel from "../models/productModel.js";

const productController = {
  getAllProduct: async (req, res) => {
    try {
      const products = await productModel.allProduct();
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  createProduct: async (req, res) => {
    const { name, category, stock, price, supplier } = req.body;
    try {
      const insertId = await productModel.create({
        name,
        category,
        stock,
        price,
        supplier,
      });
      return res
        .status(201)
        .json({ id: insertId, name, category, stock, price, supplier });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  updateProduct: async (req, res) => {
    const { id } = req.params;
    const { name, category, stock, price, supplier } = req.body;
    try {
      await productModel.update(id, { name, category, stock, price, supplier });
      return res.json({ message: "Produk berhasil diperbarui" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    const { id } = req.params;
    try {
      await productModel.delete(id);
      return res.json({ message: "Product berhasil dihapus!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default productController;
