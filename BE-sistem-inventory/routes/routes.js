import express from "express";
import authController from "../controllers/authController.js";
import productController from "../controllers/productController.js";
import supplierController from "../controllers/supplierController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import loginLimiter from "../middlewares/rateLimiter.js";

const Router = express.Router();

Router.post("/api/register", authController.register);
Router.post("/api/login", loginLimiter, authController.login);
Router.post("/api/logout", authController.logout);
Router.get("/api/users/me", authController.getMe);
Router.put("/api/users/update", isAuthenticated, authController.updateProfile);

Router.get("/api/products", isAuthenticated, productController.getAllProduct);
Router.post("/api/products", isAuthenticated, productController.createProduct);
Router.put(
  "/api/products/:id",
  isAuthenticated,
  productController.updateProduct,
);
Router.delete(
  "/api/products/:id",
  isAuthenticated,
  productController.deleteProduct,
);

Router.get(
  "/api/suppliers",
  isAuthenticated,
  supplierController.getAllSupplier,
);
Router.post(
  "/api/suppliers",
  isAuthenticated,
  supplierController.createSupplier,
);
Router.put(
  "/api/suppliers/:id",
  isAuthenticated,
  supplierController.updateSupplier,
);
Router.delete(
  "/api/suppliers/:id",
  isAuthenticated,
  supplierController.deleteSupplier,
);

export default Router;
