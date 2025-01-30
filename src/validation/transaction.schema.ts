import { object, string, number, array, TypeOf } from "zod";

const payload = {
  body: object({
    bankCode: string({
      required_error: "Bank code is required",
    }),
    accountNumber: string({
      required_error: "Account number is required",
    }),
    accountName: string({
      required_error: "Account name is required",
    }),
    amount: number({
      required_error: "Amount is required",
    }),
  }).strict(),
};

export const TransferSchema = object({
  ...payload,
});

export type TransferInput = TypeOf<typeof TransferSchema>;

const lookUpAccountPayload = {
  body: object({
    bankCode: string({
      required_error: "Bank code is required",
    }),
    accountNumber: string({
      required_error: "Account number is required",
    }),
  }).strict(),
};

export const LookUpAccountSchema = object({
  ...lookUpAccountPayload,
});

export type LookUpAccountInput = TypeOf<typeof LookUpAccountSchema>;

const generateVirtualAccountNumberPayload = {
  body: object({
    amount: number({
      required_error: "Amount is required",
    }),
  }).strict(),
};

export const GenerateVirtualAccountNumberSchema = object({
  ...generateVirtualAccountNumberPayload,
});

export type GenerateVirtualAccountNumberInput = TypeOf<
  typeof GenerateVirtualAccountNumberSchema
>;
