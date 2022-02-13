import express from "express";
import authRouter from "./auth.router";
import transactionRouter from "./transaction.route";
import userRouter from "./user.router";
const router = express.Router();
//common apis
router.use("/auth", authRouter);
router.use("/transactions", transactionRouter);
router.use("/user", userRouter);

export default router;
