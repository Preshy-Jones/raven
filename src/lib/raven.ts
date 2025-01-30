import axios from "axios";
import config from "../config";
import {
  GenerateCollectionAccountResponseData,
  RavenResponse,
  TransferResponseData,
} from "../types/raven";

export class RavenBankService {
  private readonly baseUrl = "https://integrations.getravenbank.com";
  private readonly apiKey: string;

  client: any;

  constructor() {
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${config.raven.apiKey}`,
      },
    });
  }

  async generateCollectionAccount(
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    amount: number
  ): Promise<RavenResponse<GenerateCollectionAccountResponseData>> {
    try {
      const response = await this.client.post(
        `${this.baseUrl}/v1/pwbt/generate_account`,
        {
          email,
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber,
          amount,
        }
      );
      console.log("success", response.data);

      return response.data;
    } catch (error) {
      console.log("Error", error);

      throw new Error(error);
    }
  }

  async initiateTransfer(params: {
    amount: number;
    bank_code: string;
    account_number: string;
    account_name: string;
    reference: string;
    narration?: string;
  }): Promise<RavenResponse<TransferResponseData>> {
    try {
      const response = await this.client.post(`${this.baseUrl}/transfers`, {
        ...params,
        currency: "NGN",
      });
      console.log("Transfer initiated successfully", response.data);

      return response.data;
      // return {
      //   status: "success",
      //   message: "transfer queued successfully",
      //   data: {
      //     email: "adedibuprecious@gmail.com",
      //     trx_ref: "202207111524IIGEEHC",
      //     merchant_ref: "9967998",
      //     amount: 200,
      //     bank: "Opay",
      //     bank_code: "100004",
      //     account_number: "8188996821",
      //     account_name: "Precious Adedbu",
      //     narration: "Transfer",
      //     fee: 10,
      //     status: "pending",
      //     created_at: "2024-01-30T13:24:03.402Z",
      //     id: 2,
      //   },
      // };
    } catch (error) {
      console.log("Error initiating transfer", error);

      throw new Error(error);
    }
  }

  async listBanks(): Promise<
    RavenResponse<
      {
        code: string;
        name: string;
      }[]
    >
  > {
    try {
      const response = await this.client.get(`${this.baseUrl}/v1/banks`);
      console.log("Banks", response.data);

      return response.data;
    } catch (error) {
      console.log("Error fetching banks", error);

      throw new Error(error);
    }
  }
  async lookupAccount(
    accountNumber: string,
    bankCode: string
  ): Promise<string> {
    try {
      const payload = {
        account_number: accountNumber,
        bank: bankCode,
      };
      console.log("Payload", payload);

      const response = await this.client.post(
        `${this.baseUrl}/v1/account_number_lookup`,
        payload
      );

      console.log("Account details", response.data);

      return response.data;
    } catch (error) {
      console.log("Error fetching account details", error);

      throw new Error(error);
    }
  }
}
