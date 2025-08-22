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
};

export type Merchant = {
  id: string;
  name: string;
  email: string;
  api_key: string;
  is_active: boolean;
  created_at: string; // ISO 8601 format date string
  updated_at: string; // ISO 8601 format date string
  bank_accounts: BankAccount[];
};

export type BankAccount = {
  id: string;
  merchant_id: string;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  account_currency: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string; // ISO 8601 format date string
  updated_at: string; // ISO 8601 format date string
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

export const fetchMerchants = async () => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/merchants",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 3600,
      },
    }
  );

  const merchants: Merchant[] = await response.json();
  return merchants;
};
