export interface RavenResponse<T> {
  status: "success" | "fail";
  message: string;
  data?: T;
}

// {
//   "account_number": "6000323534",
//   "account_name": "BST/PreshyJones - Precious Adedibu",
//   "bank": "BestStar MFB",
//   "customer": {
//       "email": "adedibuprecious@gmail.com",
//       "first_name": "Precious",
//       "last_name": "Adedibu",
//       "phone": "08188996821"
//   },
//   "isPermanent": false,
//   "amount": "500"
// }

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
