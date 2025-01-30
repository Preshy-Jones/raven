import { object, string, number, array, TypeOf } from "zod";

const payload = {
  body: object({
    email: string({
      required_error: "Email is required",
    }),

    password: string({
      required_error: "Password is required",
    }),
  }).strict(),
};

export const TransferSchema = object({
  ...payload,
});

export type TransferInput = TypeOf<typeof TransferSchema>;

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
