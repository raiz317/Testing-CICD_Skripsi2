import db from "../config/db.js";

const supplierModel = {
  allSupplier: async () => {
    const [rows] = await db.query("SELECT * FROM suppliers");
    return rows;
  },

  create: async (supplierData) => {
    const { supplier, industry, email, phone } = supplierData;
    const query =
      "INSERT INTO suppliers (supplier, industry, email, phone) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(query, [supplier, industry, email, phone]);
    return result.insertId;
  },

  update: async (id, supplierData) => {
    const { supplier, industry, email, phone } = supplierData;
    const query =
      "UPDATE suppliers SET supplier = ?, industry = ?, email = ?, phone = ? WHERE id = ?";
    const [result] = await db.query(query, [
      supplier,
      industry,
      email,
      phone,
      id,
    ]);
    return result;
  },

  delete: async (id) => {
    const query = "DELETE FROM suppliers WHERE id = ?";
    const [result] = await db.query(query, [id]);
    return result;
  },
};

export default supplierModel;
