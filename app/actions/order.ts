"use server";

import { revalidatePath } from "next/cache";
import { Merchant } from "./merchant";

export type Order = {
  id: string;
  merchant_id: string;
  payment_source_id: string | null;
  order_id: string;
  trx_id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  metadata: string | null;
  created_at: string; // ISO 8601 format date string
  updated_at: string; // ISO 8601 format date string
  bank_account_id: string;
  invoice_code: string | null;
  payment_code: string; // Assuming this is always a string
  raw_data: {
    merchant: {
      email: string;
      id: string;
      name: string;
    };
    qr_code: string;
  };
};

export const fetchOrders = async () => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/orders",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
      },
    }
  );

  const orders: Order[] = await response.json();
  return orders;
};

export type CreateOrderData = {
  amount: string;
  currency: string;
  description: string;
  transaction_type: "payment" | "transfer" | "purchase";
  bank_account_id: string;
};

export const createOrder = async (
  merchant: Merchant,
  payload: CreateOrderData
) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/orders/unified",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": merchant.api_key,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    return { data: null, error: `Error: ${res.status} - ${errorText}` };
  }

  revalidatePath("/");
  const data: Order = await res.json();
  return { data, error: null };
};
