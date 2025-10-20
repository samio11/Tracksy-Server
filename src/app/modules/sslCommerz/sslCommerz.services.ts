import axios from "axios";

import { ISSLCommerz } from "./sslCommerz.interface";
import config from "../../config";
import { AppError } from "../../errors/AppError";

const sslPaymentInit = async (payload: ISSLCommerz) => {
  try {
    // console.log(config.SSL_PAYMENT_API);
    const data = {
      store_id: config.SSL_STORE_ID as string,
      store_passwd: config.SSL_STORE_PASS,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      success_url: `${config.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
      fail_url: `${config.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
      cancel_url: `${config.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
      // ipn_url: "http://localhost:3030/ipn",
      shipping_method: "N/A",
      product_name: "Tour",
      product_category: "Service",
      product_profile: "general",
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address || "Nikunja-02,Dhaka",
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: payload.phoneNumber,
      cus_fax: "01709801305",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: 1000,
      ship_country: "N/A",
    };

    const response = await axios({
      method: "POST",
      url: config.SSL_PAYMENT_API as string,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Payment Error Occured", error);
    throw new AppError(401, error.message);
  }
};

export const SSLService = {
  sslPaymentInit,
};
