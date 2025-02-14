export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  created_at: Date;
  updated_at: Date;
}

export interface Transaction {
  id: number;
  userId: number;
  type: "DEPOSIT" | "TRANSFER";
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  reference: string;
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface RavenWebhookSource {
  account_number: string;
  first_name: string;
  last_name: string;
  narration: string;
  bank: string;
  bank_code: string;
  createdAt: string;
}

export interface RavenWebhookPayload {
  type: string;
  amount: number;
  session_id: string;
  account_number: string;
  source: RavenWebhookSource;
  secret: string;
}
