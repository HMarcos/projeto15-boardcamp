import { Router } from "express";
import { excludeRental, getRentals, setRental, setReturnRental } from "../controllers/rentalsController.js";
import { validateRental, validateReturnRental } from "../middlewares/rentalsMiddleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateRental, setRental);
rentalsRouter.post("/rentals/:id/return", validateReturnRental, setReturnRental);
rentalsRouter.delete("/rentals/:id", validateReturnRental, excludeRental);

export default rentalsRouter;