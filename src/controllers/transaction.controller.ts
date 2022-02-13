import { Request, Response } from "express";
import { UserModel } from "../models/User";
import { RequestModel } from "../models/Request";
import { TransactionModel } from "../models/Transaction";
import {
  expiresAfter,
  requestStatus,
  transactionType,
} from "../config/constant";
import pointsService from "../services/points.service";
import userService from "../services/user.service";
import { startSession } from "mongoose";

class TransactionController {
  async transferPoints(req: Request, res: Response) {
    try {
      const senderId = res.locals.user._id;
      const reciverMail = req.body.reciverMail;
      const { points } = req.body;
      const reciverUser = await UserModel.findOne({
        email: reciverMail,
      }).lean();
      const expiresAt = new Date(
        new Date().setMinutes(new Date().getMinutes() + expiresAfter)
      );

      if (!reciverUser) {
        throw new Error(`reciver with email ${reciverMail} is not found`);
      }

      const isEnoughBalance = await pointsService.isUserHasEnoughBalance(
        senderId,
        points
      );

      if (!isEnoughBalance) {
        throw new Error(`no enough balance`);
      }

      const isReceiverMailForSender = await userService.isEmailForUserId(
        reciverMail,
        senderId
      );

      if (isReceiverMailForSender) {
        throw new Error(`you can not send points to yourself`);
      }

      const request = await RequestModel.create({
        from: senderId,
        to: reciverUser._id,
        expiresAt: expiresAt,
        points: points,
      });

      res.send({
        message: "request is created successfully",
        requestId: request._id,
      });
    } catch (err: any) {
      res.statusCode = 500;
      res.json({
        message: err.message,
      });
    }
  }

  async confirmTransfer(req: Request, res: Response) {
    const session = await startSession();
    session.startTransaction();
    try {
      const senderId = res.locals.user._id;
      const requestId = req.params.requestId;

      const request = await RequestModel.findById(requestId);

      if (!request) {
        throw new Error(`no request is found with id ${requestId}`);
      }

      const receiverUser = await UserModel.findById(request.to);
      const senderUser = await UserModel.findById(senderId);

      if (!receiverUser) {
        throw new Error(`user is not found by id ${request.to}`);
      }

      if (!senderUser) {
        throw new Error(`user is not found by id ${senderId}`);
      }
      if (request.status != requestStatus.pending) {
        throw new Error(`you can not accept this request`);
      }

      if (new Date(request.expiresAt).getTime() < new Date().getTime()) {
        request.status = requestStatus.confirmed;
        await request.save();
        throw new Error(`you can not accept this request`);
      }

      const isEnoughBalance = await pointsService.isUserHasEnoughBalance(
        senderId,
        request.points
      );

      if (!isEnoughBalance) {
        throw new Error(`no enough balance`);
      }

      request.status = requestStatus.confirmed;
      await request.save({ session: session });

      await TransactionModel.create(
        [
          {
            user: senderId,
            type: transactionType.debit,
            points: request.points,
          },
          {
            user: request.to,
            type: transactionType.credit,
            points: request.points,
          },
        ],
        { session: session }
      );

      senderUser.points -= request.points;
      receiverUser.points += request.points;

      await senderUser.save({ session: session });
      await receiverUser.save({ session: session });

      await session.commitTransaction();
    } catch (err: any) {
      session.abortTransaction();
      res.statusCode = 500;
      res.json({
        message: err.message,
      });
    }

    res.send({
      message: "request is confirmed successfully",
    });
    session.endSession();
  }

  async getTransactionList(req: Request, res: Response) {
    try {
      const pageNumber = req.params.pageNumber || 0;
      const pageSize = req.params.pageSize || 10;
      const userId = res.locals.user._id.toString();

      const transactions = await TransactionModel.find({ user: userId }, null, {
        skip: Number(pageNumber) * Number(pageSize),
        limit: Number(pageSize),
      });
      const count = await TransactionModel.count({
        user: userId,
      });

      res.send({
        transactions,
        count,
      });
    } catch (err: any) {
      res.statusCode = 500;
      res.json({
        message: err.message,
      });
    }
  }
}
export default new TransactionController();
