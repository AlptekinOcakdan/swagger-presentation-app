import {API_PREFIX} from "../constants/environment.js";
import globalErrorMiddleware, {
  CustomError,
} from "../middlewares/errorHandler.middleware.js";
import { Router } from "express";

// ROUTES IMPORTS
import productRoutes from "./product.routes.js";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import userRoutes from './user.routes.js';
import uploadRoutes from './upload.routes.js';

const initializeRoutes = (app) => {
  /**
   * @swagger
   * /healthcheck:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  app.get("/healthcheck", (req, res) => res.status(200).send("OK"));

  const routes = new Router();

  routes.use("/auth", authRoutes);
  routes.use("/products", productRoutes);
  routes.use("/categories", categoryRoutes);
  routes.use("/users", userRoutes);
  routes.use("/upload", uploadRoutes);

  app.use(`${API_PREFIX}`, routes);

  app.all('*', (req, res, next) => {
    const errMessage = `Can't find the valid endpoint ${req.originalUrl} on this server!`;
    const err = new CustomError(errMessage.trim(), 404);
    next(err);
  });

  app.use(globalErrorMiddleware);
};

export default initializeRoutes;