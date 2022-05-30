import { Router } from "express";
import { getCustomer, getCustomers } from "../controllers/customersController.js";

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomer);

export default customersRouter;