import { Router } from "express";
import { getRentals, setRental } from "../controllers/rentalsController.js";
import { validateRental } from "../middlewares/rentalsMiddleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateRental, setRental);

export default rentalsRouter;