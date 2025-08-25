"use server";

import { revalidatePath } from "next/cache";

export interface CreateMerchantData {
  merchant_name: string;
  merchant_details: {
    primary_contact_person: string;
    primary_email: string;
    primary_phone: string;
    address: {
      line1: string;
      city: string;
      state: string;
      zip: string;
      country: string;
      first_name: string;
      last_name: string;
    };
  };
  bank_accounts: Array<{
    bank_name: string;
    bank_code: string;
    account_number: string;
    account_name: string;
    account_currency: string;
    is_default: boolean;
  }>;
}

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

export async function createMerchant(merchantData: CreateMerchantData) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error("API URL not configured");
    }

    const response = await fetch(`${apiUrl}/api/merchants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(merchantData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create merchant: ${response.status} - ${errorText}`
      );
    }

    const result = await response.json();
    revalidatePath("/merchants");
    revalidatePath("/");

    return {
      success: true,
      data: result,
      message: "Merchant created successfully",
    };
  } catch (error) {
    console.error("Error creating merchant:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

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
