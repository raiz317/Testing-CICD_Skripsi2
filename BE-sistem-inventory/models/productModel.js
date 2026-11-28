import db from "../config/db.js";

const productModel = {
  allProduct: async () => {
    const [rows] = await db.query("SELECT * FROM products");
    return rows;
  },

  create: async (productData) => {
    const { name, category, stock, price, supplier } = productData;
    const query =
      "INSERT INTO products (name, category, stock, price, supplier) VALUES(?, ?, ?, ?, ?)";
    const [result] = await db.query(query, [
      name,
      category,
      stock,
      price,
      supplier,
    ]);
    return result.insertId;
  },

  update: async (id, productData) => {
    const { name, category, stock, price, supplier } = productData;
    const query =
      "UPDATE products SET name = ?, category = ?, stock = ?, price = ?, supplier = ? WHERE id = ?";
    const [result] = await db.query(query, [
      name,
      category,
      stock,
      price,
      supplier,
      id,
    ]);
    return result;
  },

  delete: async (id) => {
    const query = "DELETE FROM products WHERE id = ?";
    const [result] = await db.query(query, [id]);
    return result;
  },
};

export default productModel;
