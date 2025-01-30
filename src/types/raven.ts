export interface RavenResponse<T> {
  status: "success" | "fail";
  message: string;
  data?: T;
}

export interface GenerateCollectionAccountResponseData {
  account_number: string;
  account_name: string;
  bank: string;
  customer: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  isPermanent: boolean;
  amount: string;
}

export interface TransferResponseData {
  email: string;
  trx_ref: string;
  merchant_ref: string;
  amount: number;
  bank: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  narration: string;
  fee: number;
  status: string;
  created_at: string;
  id: number;
}
