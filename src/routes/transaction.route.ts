import { Router } from "express";
import TransactionController from "../controllers/transaction.controller";
import isAuthenticated from "../middlewares/isAuthenticated";
import transferValidator from "../middlewares/validators/isTransferValid";

const TransactionRouter = Router();
TransactionRouter.get(
  "/:pageNumber/:pageSize",
  isAuthenticated,
  TransactionController.getTransactionList
);
TransactionRouter.post(
  "/transfer",
  isAuthenticated,
  transferValidator,
  TransactionController.transferPoints
);

TransactionRouter.put(
  "/transfer/confirm/:requestId",
  isAuthenticated,
  TransactionController.confirmTransfer
);

export default TransactionRouter;
