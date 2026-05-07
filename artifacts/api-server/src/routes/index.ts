import { Router, type IRouter } from "express";
import healthRouter from "./health";
import incomeRouter from "./income";

const router: IRouter = Router();

router.use(healthRouter);
router.use(incomeRouter);

export default router;
