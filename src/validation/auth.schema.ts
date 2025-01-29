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

export const LoginSchema = object({
  ...payload,
});

export type LoginInput = TypeOf<typeof LoginSchema>;
