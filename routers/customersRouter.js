import { Router } from "express";
import { getCustomer, getCustomers, setCustomer, changeCustomer } from "../controllers/customersController.js";
import { validateCustomer } from "../middlewares/customersMiddleware.js";

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomer);
customersRouter.post('/customers', validateCustomer, setCustomer);
customersRouter.put('/customers/:id', validateCustomer, changeCustomer);
export default customersRouter;