import { Router } from "express";
import { getRentals, setRental, setReturnRental } from "../controllers/rentalsController.js";
import { validateRental, validateReturnRental } from "../middlewares/rentalsMiddleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateRental, setRental);
rentalsRouter.post("/rentals/:id/return", validateReturnRental, setReturnRental);

export default rentalsRouter;