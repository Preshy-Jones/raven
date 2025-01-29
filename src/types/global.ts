export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  ravenBankAccountNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: number;
  userId: number;
  type: "DEPOSIT" | "TRANSFER";
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  reference: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
