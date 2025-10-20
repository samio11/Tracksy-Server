import { EPaymentStatus } from "./payment.interface";
import { Payment } from "./payment.model";

const successPayment = async (query: Record<string, string>) => {
  const session = await Payment.startSession();
  session.startTransaction();
  try {
    const updatepayment = await Payment.findOneAndUpdate(
      { transactionId: query?.transactionId },
      { status: EPaymentStatus.complete },
      { new: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return {
      message: "Payment Created Done",
      success: true,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
const failPayment = async (query: Record<string, string>) => {
  const session = await Payment.startSession();
  session.startTransaction();
  try {
    const updatepayment = await Payment.findOneAndUpdate(
      { transactionId: query?.transactionId },
      { status: EPaymentStatus.fail },
      { new: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return {
      message: "Payment Created fail",
      success: true,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
const cancelPayment = async (query: Record<string, string>) => {
  const session = await Payment.startSession();
  session.startTransaction();
  try {
    const updatepayment = await Payment.findOneAndUpdate(
      { transactionId: query?.transactionId },
      { status: EPaymentStatus.cancel },
      { new: true, session }
    );
    await session.commitTransaction();
    session.endSession();
    return {
      message: "Payment is canceled",
      success: true,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const getAllPaymentData = async () => {
  const result = await Payment.find().populate("cartId");
  return result;
};

export const paymentServices = {
  successPayment,
  failPayment,
  cancelPayment,
  getAllPaymentData,
};
